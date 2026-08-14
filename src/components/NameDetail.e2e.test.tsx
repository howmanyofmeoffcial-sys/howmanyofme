import { describe, it, expect } from "vitest";
import { getName } from "../lib/names/getName";
import { getSimilarNames } from "../lib/names/getSimilarNames";
import { auditNameQuality } from "../lib/names/contentQuality";

describe("Name Data & Core Engine tests", () => {
  it("resolves canonical popular names correctly", () => {
    const data = getName("David", false);
    expect(data).toBeDefined();
    expect(data?.name).toBe("David");
    expect(data?.count).toBeGreaterThan(100000);
    expect(data?.rank).toBeGreaterThan(0);
  });

  it("calculates similarity graph without errors", () => {
    const similar = getSimilarNames("Emma", 10);
    expect(similar.combined.length).toBeGreaterThan(0);
    expect(similar.startsWith.every((n) => n.startsWith("E"))).toBe(true);
  });

  it("computes content quality score meeting minimum Tier threshold", () => {
    const data = getName("James", false);
    expect(data).toBeDefined();
    if (data) {
      const score = auditNameQuality(data);
      expect(score.score).toBeGreaterThanOrEqual(70);
      expect(score.tier).not.toBe("TIER_C_INSUFFICIENT");
    }
  });

  it("handles non-existent names cleanly without crashing", () => {
    const data = getName("NonExistentXYZ999", false);
    expect(data).toBeNull();
  });
});
