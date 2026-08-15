import { describe, it, expect } from "vitest";
import ssa2025Raw from "../data/raw/ssa/ssa_2025.json";
import { resolveFirstName, resolveFullName } from "../lib/name-resolver";

interface SsaEntry {
  rank: number;
  name: string;
  count: number;
  sex: string;
}

describe("Phase 25 — 2025 SSA Baby Names Validation Suite", () => {
  it("verifies 1,000 male and 1,000 female records are present and complete", () => {
    const data = ssa2025Raw as any;
    expect(data.year).toBe(2025);
    expect(data.topMale).toBeDefined();
    expect(data.topFemale).toBeDefined();
    expect(data.topMale.length).toBe(1000);
    expect(data.topFemale.length).toBe(1000);

    for (let i = 1; i <= 1000; i++) {
      expect(data.topMale[i - 1].rank).toBe(i);
      expect(data.topFemale[i - 1].rank).toBe(i);
      expect(data.topMale[i - 1].count).toBeGreaterThan(0);
      expect(data.topFemale[i - 1].count).toBeGreaterThan(0);
      expect(data.topMale[i - 1].name.length).toBeGreaterThan(0);
      expect(data.topFemale[i - 1].name.length).toBeGreaterThan(0);
    }
  });

  it("validates exact Top 10 Boys benchmarks against official SSA 2025 data", () => {
    const topBoys: SsaEntry[] = (ssa2025Raw as any).topMale.slice(0, 10);
    const expected = [
      { rank: 1, name: "Liam", count: 20818 },
      { rank: 2, name: "Noah", count: 20358 },
      { rank: 3, name: "Oliver", count: 14939 },
      { rank: 4, name: "Theodore", count: 13355 },
      { rank: 5, name: "Henry", count: 12020 },
      { rank: 6, name: "James", count: 11945 },
      { rank: 7, name: "Elijah", count: 11111 },
      { rank: 8, name: "Mateo", count: 11045 },
      { rank: 9, name: "William", count: 10545 },
      { rank: 10, name: "Lucas", count: 10219 },
    ];

    for (let i = 0; i < 10; i++) {
      expect(topBoys[i].rank).toBe(expected[i].rank);
      expect(topBoys[i].name).toBe(expected[i].name);
      expect(topBoys[i].count).toBe(expected[i].count);
    }
  });

  it("validates exact Top 10 Girls benchmarks against official SSA 2025 data", () => {
    const topGirls: SsaEntry[] = (ssa2025Raw as any).topFemale.slice(0, 10);
    const expected = [
      { rank: 1, name: "Olivia", count: 13544 },
      { rank: 2, name: "Charlotte", count: 13400 },
      { rank: 3, name: "Emma", count: 12754 },
      { rank: 4, name: "Amelia", count: 12699 },
      { rank: 5, name: "Sophia", count: 12561 },
      { rank: 6, name: "Mia", count: 11078 },
      { rank: 7, name: "Isabella", count: 10666 },
      { rank: 8, name: "Evelyn", count: 9123 },
      { rank: 9, name: "Sofia", count: 8252 },
      { rank: 10, name: "Eliana", count: 8191 },
    ];

    for (let i = 0; i < 10; i++) {
      expect(topGirls[i].rank).toBe(expected[i].rank);
      expect(topGirls[i].name).toBe(expected[i].name);
      expect(topGirls[i].count).toBe(expected[i].count);
    }
  });

  it("validates mid and long-tail anchor names from the numbers fixture", () => {
    const boysMap = new Map<string, SsaEntry>(
      (ssa2025Raw as any).topMale.map((m: SsaEntry) => [m.name, m])
    );
    const girlsMap = new Map<string, SsaEntry>(
      (ssa2025Raw as any).topFemale.map((f: SsaEntry) => [f.name, f])
    );

    // Luca #14 (8,759)
    expect(boysMap.get("Luca")?.rank).toBe(14);
    expect(boysMap.get("Luca")?.count).toBe(8759);

    // Ezra #20 (8,126)
    expect(boysMap.get("Ezra")?.rank).toBe(20);
    expect(boysMap.get("Ezra")?.count).toBe(8126);

    // Muhammad #239 (1,473)
    expect(boysMap.get("Muhammad")?.rank).toBe(239);
    expect(boysMap.get("Muhammad")?.count).toBe(1473);

    // Freya #176 (1,746)
    expect(girlsMap.get("Freya")?.rank).toBe(176);
    expect(girlsMap.get("Freya")?.count).toBe(1746);

    // Aisha #337 (910)
    expect(girlsMap.get("Aisha")?.rank).toBe(337);
    expect(girlsMap.get("Aisha")?.count).toBe(910);

    // Kabir #999 (227)
    expect(boysMap.get("Kabir")?.rank).toBe(999);
    expect(boysMap.get("Kabir")?.count).toBe(227);

    // Langston #1000 (227)
    expect(boysMap.get("Langston")?.rank).toBe(1000);
    expect(boysMap.get("Langston")?.count).toBe(227);

    // Harmoni #1000 (252)
    expect(girlsMap.get("Harmoni")?.rank).toBe(1000);
    expect(girlsMap.get("Harmoni")?.count).toBe(252);
  });

  it("verifies count monotonicity across all 1000 ranks without anomalies", () => {
    const boys: SsaEntry[] = (ssa2025Raw as any).topMale;
    const girls: SsaEntry[] = (ssa2025Raw as any).topFemale;

    for (let i = 1; i < boys.length; i++) {
      expect(boys[i].count).toBeLessThanOrEqual(boys[i - 1].count);
    }
    for (let i = 1; i < girls.length; i++) {
      expect(girls[i].count).toBeLessThanOrEqual(girls[i - 1].count);
    }
  });

  it("integrates 2025 SSA data seamlessly into resolveFirstName", () => {
    const liam = resolveFirstName("Liam");
    expect(liam.availability.ssa2025).toBe(true);
    expect(liam.latestSsa?.rank).toBe(1);
    expect(liam.latestSsa?.count).toBe(20818);
    expect(liam.latestSsa?.year).toBe(2025);

    const olivia = resolveFirstName("Olivia");
    expect(olivia.availability.ssa2025).toBe(true);
    expect(olivia.latestSsa?.rank).toBe(1);
    expect(olivia.latestSsa?.count).toBe(13544);
    expect(olivia.latestSsa?.sex).toBe("F");

    const freya = resolveFirstName("Freya");
    expect(freya.availability.ssa2025).toBe(true);
    expect(freya.latestSsa?.rank).toBe(176);
    expect(freya.latestSsa?.count).toBe(1746);
  });

  it("handles out-of-top-1000 names properly without declaring they do not exist", () => {
    const rahul = resolveFirstName("Rahul");
    expect(rahul.displayName).toBe("Rahul");
    // Not in 2025 published Top 1000
    expect(rahul.availability.ssa2025).toBe(false);
    expect(rahul.latestSsa).toBeNull();
    // But demographic living estimate exists from Census / statistical model
    expect(rahul.derivedLivingBearers.count).toBeGreaterThan(0);
    expect(rahul.status).not.toBe("invalid");
  });

  it("preserves strict full-name metric separation for combined queries", () => {
    const res = resolveFullName("Liam", "Smith");
    expect(res.status).toBeDefined();
    expect(res.firstName.availability.ssa2025).toBe(true);
    expect(res.firstName.latestSsa?.count).toBe(20818);
    // Surname must NOT inherit baby-name count
    expect(res.surname.censusFrequency.count).toBeGreaterThan(0);
  });
});
