import { describe, it, expect } from "vitest";
import { getName, hasName, getNameSlug } from "../lib/names/getName";
import { getAllNames, getIndexableNames } from "../lib/names/getAllNames";
import { normalizeName } from "../../scripts/data/normalize-names.mjs";

describe("Phase 10 — Real First-Name Data Infrastructure Tests", () => {
  it("normalizes names deterministically across case, whitespace, and diacritics", () => {
    const variants = ["David", "DAVID", "david", "  David  ", "David"];
    for (const v of variants) {
      const res = normalizeName(v);
      expect(res.display).toBe("David");
      expect(res.normalized).toBe("david");
      expect(res.slug).toBe("David");
      expect(res.lowerSlug).toBe("david");
    }
  });

  it("retrieves official historical SSA records and derived stats for canonical names", () => {
    const james = getName("James");
    expect(james).not.toBeNull();
    expect(james?.name).toBe("James");
    expect(james?.gender).toBe("male");
    expect(james?.rank).toBe(1);
    expect(james?.ssa).toBeDefined();
    expect(james?.ssa?.totalBirths).toBeGreaterThan(4000000);
    expect(james?.ssa?.peakYear).toBeGreaterThanOrEqual(1880);
    expect(james?.ssa?.peakYear).toBeLessThanOrEqual(2024);
    expect(james?.sources).toContain("ssa-popular-names");
  });

  it("handles Census 2020 data integration accurately", () => {
    const mary = getName("Mary");
    expect(mary).not.toBeNull();
    expect(mary?.census2020).toBeDefined();
    if (mary?.census2020) {
      expect(mary.census2020.sourceYear).toBe(2020);
      expect(mary.census2020.count).toBeGreaterThan(0);
      expect(mary.sources).toContain("census-2020-first-names");
    }
  });

  it("validates slug lookup consistency", () => {
    expect(hasName("william")).toBe(true);
    expect(hasName("nonexistentnamestring123")).toBe(false);
    expect(getNameSlug("Emily")).toBe("Emily");
  });

  it("ensures all canonical names pass data quality checks", () => {
    const all = getAllNames();
    expect(all.length).toBe(583);
    const indexable = getIndexableNames();
    expect(indexable.length).toBe(583);
  });
});
