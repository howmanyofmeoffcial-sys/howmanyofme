import { describe, it, expect } from "vitest";
import {
  evaluateNameIndexability,
  auditNamesIndexability,
  evaluateSimilarNamesIndexability,
  auditSimilarNamesIndexability,
} from "../lib/seo/indexability";
import { auditNameQuality } from "../lib/names/contentQuality";
import { getAllNames, getIndexableNames } from "../lib/names/getAllNames";
import { getName } from "../lib/names/getName";
import { getSimilarNames } from "../lib/names/getSimilarNames";

describe("Central SEO Indexability Engine", () => {
  it("indexes fully validated canonical names like 'James'", () => {
    const james = getName("James", false);
    expect(james).toBeDefined();
    if (!james) return;

    const evaluation = evaluateNameIndexability(james);
    expect(evaluation.status).toBe("INDEX");
    expect(evaluation.reasons).toHaveLength(0);
    expect(evaluation.score).toBeGreaterThanOrEqual(70);
  });

  it("excludes null, empty, or structurally invalid records", () => {
    expect(evaluateNameIndexability(null).status).toBe("EXCLUDE");
    expect(evaluateNameIndexability({} as any).status).toBe("EXCLUDE");
    expect(evaluateNameIndexability({ name: "A" } as any).status).toBe("EXCLUDE");
    expect(evaluateNameIndexability({ name: "12345" } as any).status).toBe("EXCLUDE");
    expect(evaluateNameIndexability({ name: "https://howmanyofme.co" } as any).status).toBe("EXCLUDE");
  });

  it("excludes legacy category terms and blocked pseudo-names", () => {
    for (const blocked of ["Scandinavian", "Arabic", "Germanic", "Brazil", "Italy"]) {
      const res = evaluateNameIndexability({
        name: blocked,
        count: 50000,
        rank: 100,
        origin: "Traditional",
        meaning: "Sample meaning",
        gender: "unisex",
        actuarial: { estimatedLiving: 40000, estimatedAverageAge: 40, survivalModel: "cdc" },
        ssa: { totalBirths: 50000, maleBirths: 25000, femaleBirths: 25000, firstYear: 1880, lastYear: 2024, peakYear: 1950, peakYearBirths: 1000, recentBirths: 100, recentWindow: "2015-2024" },
        decade_popularity: { "1950": 1000, "1960": 1000, "1970": 1000, "1980": 1000 },
        sources: ["ssa"],
      } as any);

      expect(res.status).toBe("EXCLUDE");
      expect(res.reasons[0]).toContain("blocked entity keyword");
    }
  });

  it("marks incomplete/fallback records as NOINDEX with specific actionable reasons", () => {
    const fallback = getName("SomeUnknownNameXYZ", true);
    expect(fallback).toBeDefined();
    if (!fallback) return;

    const evaluation = evaluateNameIndexability(fallback);
    expect(evaluation.status).toBe("NOINDEX");
    expect(evaluation.reasons.length).toBeGreaterThan(0);
    expect(evaluation.reasons).toContain("Missing valid historical birth count");
    expect(evaluation.reasons).toContain("Missing valid national popularity rank");
    expect(evaluation.reasons).toContain("Missing cultural origin");
    expect(evaluation.reasons).toContain("Missing etymological meaning");
  });

  it("ensures all 583 canonical dataset names evaluate to INDEX for name pages", () => {
    const allNames = getAllNames();
    expect(allNames.length).toBe(583);

    const audit = auditNamesIndexability(allNames);
    expect(audit.total).toBe(583);
    expect(audit.indexedCount).toBe(583);
    expect(audit.noindexCount).toBe(0);
    expect(audit.excludedCount).toBe(0);
  });

  it("ensures getIndexableNames() matches exactly the INDEX set", () => {
    const indexable = getIndexableNames();
    expect(indexable.length).toBe(583);
    expect(indexable.every((n) => evaluateNameIndexability(n).status === "INDEX")).toBe(true);
  });

  it("audits content quality without artificial score inflation", () => {
    const james = getName("James", false);
    if (!james) return;

    const quality = auditNameQuality(james);
    expect(quality.isIndexable).toBe(true);
    expect(quality.tier).toBe("TIER_A_STRONG");
    expect(quality.score).toBeGreaterThanOrEqual(85);
  });
});

describe("Similar Names Multi-Signal Engine & Indexability", () => {
  it("computes data-backed similar names with deterministic signals", () => {
    const kyle = getName("Kyle", false);
    expect(kyle).toBeDefined();
    if (!kyle) return;

    const similar = getSimilarNames(kyle, 12);
    expect(similar.combined.length).toBeGreaterThanOrEqual(5);

    // Verify leading match has real signals
    const topMatch = similar.combined[0];
    expect(topMatch).toBeDefined();
    expect(topMatch.score).toBeGreaterThanOrEqual(65);
    expect(topMatch.signals.length).toBeGreaterThanOrEqual(1);
    expect(topMatch.estimatedLiving).toBeGreaterThan(0);
  });

  it("evaluates strong candidate 'Kyle' as INDEX for Similar Names", () => {
    const kyle = getName("Kyle", false);
    if (!kyle) return;

    const evalRes = evaluateSimilarNamesIndexability(kyle);
    expect(evalRes.status).toBe("INDEX");
    expect(evalRes.score).toBeGreaterThanOrEqual(75);
    expect(evalRes.strongMatchCount).toBeGreaterThanOrEqual(4);
    expect(evalRes.soundalikeCount).toBeGreaterThanOrEqual(3);
  });

  it("evaluates 'James' and 'Emma' as strong INDEX Similar Names pages", () => {
    for (const name of ["James", "Emma", "Liam", "Noah", "John"]) {
      const rec = getName(name, false);
      expect(rec).toBeDefined();
      if (!rec) continue;

      const res = evaluateSimilarNamesIndexability(rec);
      expect(res.status).toBe("INDEX");
      expect(res.score).toBeGreaterThanOrEqual(75);
    }
  });

  it("excludes non-name/category entities from Similar Names indexability", () => {
    for (const blocked of ["Italy", "Canada", "Latin", "Arabic", "Persian", "Slavic", "Scandinavian"]) {
      const res = evaluateSimilarNamesIndexability(blocked);
      expect(res.status).toBe("EXCLUDE");
      expect(res.reasons[0]).toContain("blocked/category entity");
    }
  });

  it("audits Similar Names batch dataset with real data distribution", () => {
    const allNames = getAllNames();
    const batchAudit = auditSimilarNamesIndexability(allNames);

    expect(batchAudit.total).toBe(583);
    expect(batchAudit.indexedCount).toBeGreaterThan(300);
    expect(batchAudit.noindexCount).toBeGreaterThan(0);
    expect(batchAudit.excludedCount).toBe(0);
    expect(batchAudit.distribution.max).toBeGreaterThan(0);
  }, 15000);
});
