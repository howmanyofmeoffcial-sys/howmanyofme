import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { normalizeName } from "../lib/names/normalizeName";
import { getNameUrl, getNameAbsoluteUrl, getSimilarNamesUrl, getLetterUrl, getToolUrl, getBlogUrl } from "../lib/seo/canonicalUrl";
import { getName } from "../lib/names/getName";
import { evaluateNameIndexability, evaluateSimilarNamesIndexability, BLOCKED_NAME_ENTITIES } from "../lib/seo/indexability";

describe("URL Hygiene, Canonicalization & Legacy Route Rejection Tests", () => {
  it("normalizes case-sensitive variants to standard TitleCase canonical slugs", () => {
    const kyleLower = normalizeName("kyle");
    const kyleUpper = normalizeName("KYLE");
    const kyleMixed = normalizeName("KyLe");

    expect(kyleLower.slug).toBe("Kyle");
    expect(kyleUpper.slug).toBe("Kyle");
    expect(kyleMixed.slug).toBe("Kyle");
    expect(kyleLower.canonicalUrl).toBe("https://howmanyofme.co/name/Kyle");
  });

  it("handles complex names, diacritics, hyphens, and apostrophes deterministically", () => {
    const jose = normalizeName("josé");
    expect(jose.display).toBe("José");
    expect(jose.slug).toBe("José");
    expect(jose.asciiClean).toBe("Jose");

    const anneMarie = normalizeName("anne-marie");
    expect(anneMarie.display).toBe("Anne-Marie");
    expect(anneMarie.slug).toBe("Anne-Marie");

    const oconnor = normalizeName("o'connor");
    expect(oconnor.display).toBe("O'Connor");
  });

  it("generates correct lowercase canonical slugs for Similar Names", () => {
    expect(getSimilarNamesUrl("Kyle")).toBe("/similar-names/kyle");
    expect(getSimilarNamesUrl("JAMES")).toBe("/similar-names/james");
    expect(getSimilarNamesUrl("Emma")).toBe("/similar-names/emma");
  });

  it("prevents malformed URL generation and double slashes", () => {
    const nameAbs = getNameAbsoluteUrl("James");
    expect(nameAbs).toBe("https://howmanyofme.co/name/James");
    expect(nameAbs).not.toContain("/https:");
    expect(nameAbs).not.toContain("//name");

    const toolUrl = getToolUrl("/tools/popularity-checker");
    expect(toolUrl).toBe("/tools/popularity-checker");
    expect(toolUrl).not.toContain("/tools/tools");

    const blogUrl = getBlogUrl("/blog/baby-name-trends");
    expect(blogUrl).toBe("/blog/baby-name-trends");
    expect(blogUrl).not.toContain("/blog/blog");
  });

  it("strictly rejects non-name category keywords (Italy, Scandinavian, Arabic)", () => {
    expect(BLOCKED_NAME_ENTITIES.has("italy")).toBe(true);
    expect(BLOCKED_NAME_ENTITIES.has("scandinavian")).toBe(true);
    expect(BLOCKED_NAME_ENTITIES.has("arabic")).toBe(true);

    const evalItaly = evaluateNameIndexability({ name: "Italy" } as any);
    expect(evalItaly.status).toBe("EXCLUDE");

    const evalSimilarItaly = evaluateSimilarNamesIndexability({ name: "Italy" } as any);
    expect(evalSimilarItaly.status).toBe("EXCLUDE");
  });

  it("returns null for non-existent unindexed random query strings", () => {
    const random = getName("RandomNonexistentString123", false);
    expect(random).toBeNull();
  });

  it("verifies vercel.json contains complete 301 redirects for legacy .html pages", () => {
    const vercelConfig = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../../vercel.json"), "utf8")
    );
    const redirects = vercelConfig.redirects as Array<{ source: string; destination: string; permanent: boolean }>;

    const htmlRedirects = [
      { source: "/index.html", destination: "/" },
      { source: "/privacy.html", destination: "/privacy" },
      { source: "/terms.html", destination: "/terms" },
      { source: "/about.html", destination: "/about" },
      { source: "/contact.html", destination: "/contact" },
      { source: "/disclaimer.html", destination: "/disclaimer" },
      { source: "/methodology.html", destination: "/methodology" },
      { source: "/data.html", destination: "/data" },
      { source: "/tools.html", destination: "/tools" },
      { source: "/blog.html", destination: "/blog" },
      { source: "/last-names.html", destination: "/last-names" },
      { source: "/similar-names.html", destination: "/similar-names" },
    ];

    for (const rule of htmlRedirects) {
      const match = redirects.find((r) => r.source === rule.source);
      expect(match).toBeDefined();
      expect(match?.destination).toBe(rule.destination);
      expect(match?.permanent).toBe(true);
    }
  });

  it("verifies trailing slash redirects in vercel.json", () => {
    const vercelConfig = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../../vercel.json"), "utf8")
    );
    const slashRule = vercelConfig.redirects.find((r: any) => r.source === "/:path+/");
    expect(slashRule).toBeDefined();
    expect(slashRule.destination).toBe("/:path+");
    expect(slashRule.permanent).toBe(true);
  });
});
