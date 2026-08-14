import { describe, it, expect } from "vitest";
import { calculateFullNameEstimate, evaluateFullNameIndexability, getFullNameSlug, getFullNameUrl } from "../lib/fullNames";
import { getFullName, getIndexableFullNames, getRelatedFullNames } from "../lib/fullNames/data";

describe("Phase 12 — Full-Name / People Entity System Tests", () => {
  it("calculates modeled estimates for common + common combinations (David + Smith)", () => {
    // David living: ~2,000,000, Smith count: ~2,442,977
    const result = calculateFullNameEstimate(2000000, 2442977);
    expect(result.rawEstimate).toBeGreaterThan(10000);
    expect(result.roundedEstimate).toBeGreaterThan(10000);
    expect(result.confidence).toBe("HIGH");
    expect(result.independenceAssumptionNote.toLowerCase()).toContain("statistical estimate");
  });

  it("handles rare / small frequency combinations with sensible rounding", () => {
    const result = calculateFullNameEstimate(100, 500);
    expect(result.rawEstimate).toBeLessThan(1);
    expect(result.displayEstimate).toBe("Fewer than 5");
  });

  it("handles zero or negative inputs cleanly without error", () => {
    const result = calculateFullNameEstimate(0, 0);
    expect(result.rawEstimate).toBe(0);
    expect(result.roundedEstimate).toBe(0);
    expect(result.confidence).toBe("LOW");
  });

  it("generates deterministic canonical slugs and URLs", () => {
    expect(getFullNameSlug("David", "Smith")).toBe("david-smith");
    expect(getFullNameSlug("Mary", "O'Connor")).toBe("mary-oconnor");
    expect(getFullNameSlug("José", "García")).toBe("jose-garcia");
    expect(getFullNameUrl("David", "Smith")).toBe("/people/david-smith");
  });

  it("evaluates indexability gates accurately", () => {
    const valid = evaluateFullNameIndexability({
      firstName: "David",
      lastName: "Smith",
      slug: "david-smith",
      firstNameLiving: 1500000,
      surnameCount: 2400000,
      rawEstimate: 12000,
    });
    expect(valid.eligible).toBe(true);
    expect(valid.reasons.length).toBe(0);

    const invalid = evaluateFullNameIndexability({
      firstName: "D",
      lastName: "S",
      slug: "d-s",
      firstNameLiving: 5,
      surnameCount: 20,
      rawEstimate: 0,
    });
    expect(invalid.eligible).toBe(false);
    expect(invalid.reasons).toContain("first-name-data-insufficient");
    expect(invalid.reasons).toContain("surname-data-insufficient");
  });

  it("retrieves canonical full-name entities and contextual related combinations", () => {
    const indexable = getIndexableFullNames();
    expect(indexable.length).toBeGreaterThan(100);

    const davidSmith = getFullName("david-smith");
    expect(davidSmith).not.toBeNull();
    expect(davidSmith?.displayName).toBe("David Smith");

    const related = getRelatedFullNames("David", "Smith", 8);
    expect(related.length).toBeGreaterThan(0);
  });
});
