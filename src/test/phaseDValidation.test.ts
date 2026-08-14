import { describe, it, expect } from "vitest";
import { resolveNameSearch } from "../lib/estimation/resolveNameSearch";
import { validateName } from "../lib/names/validateName";

describe("Phase D: Master QA & Consistency Validation", () => {
  // 1. Known Names (Source-Backed)
  it("returns verified source-backed profiles for canonical indexed names", () => {
    const testNames = ["James", "Emma", "Olivia", "David", "Mary", "Sophia"];

    for (const name of testNames) {
      const res = resolveNameSearch({ firstName: name });
      expect(res.mode).toBe("verified");
      expect(res.sourceType).toBe("official-data");
      expect(res.userFacingLabel).toBe("Source-backed profile");
      expect(res.detailedProfileUrl).toBe(`/name/${name}`);
      expect(res.estimatedPeople).toBeGreaterThan(1000);
      expect(res.supportingData?.firstName?.isIndexed).toBe(true);
    }
  });

  // 2. Unindexed Names (Modelled Estimates)
  it("returns deterministic statistical estimates for unindexed valid names without fake profile URLs", () => {
    const unindexedNames = ["Rahul", "Priya", "Wei", "Yuki", "Min-jun", "Merlin", "Zendaya"];

    for (const name of unindexedNames) {
      const res = resolveNameSearch({ firstName: name });
      expect(res.mode).toBe("modelled");
      expect(res.sourceType).toBe("derived-model");
      expect(res.userFacingLabel).toBe("Statistical estimate");
      expect(res.detailedProfileUrl).toBeNull();
      expect(res.estimatedPeople).toBeGreaterThan(0);
      expect(res.supportingData?.firstName?.isIndexed).toBe(false);
      expect(res.supportingData?.firstName?.rank).toBeNull();
      expect(res.supportingData?.firstName?.gender).toBeNull();
      expect(res.warnings).toBeDefined();
      expect(res.warnings?.length).toBeGreaterThan(0);
    }
  });

  // 3. Full-Name Search (Known & Modelled combinations)
  it("correctly resolves known and modelled full-name combinations", () => {
    // Known first + Known last
    const knownCombo = resolveNameSearch({ firstName: "David", lastName: "Smith" });
    expect(knownCombo.mode).toBe("verified");
    expect(knownCombo.queryType).toBe("full-name");
    expect(knownCombo.displayName).toBe("David Smith");
    expect(knownCombo.supportingData?.firstName?.name).toBe("David");
    expect(knownCombo.supportingData?.lastName?.name).toBe("Smith");
    expect(knownCombo.detailedProfileUrl).toBe("/people/david-smith");

    // Modelled first + Known last
    const modelledCombo1 = resolveNameSearch({ firstName: "Rahul", lastName: "Smith" });
    expect(modelledCombo1.mode).toBe("modelled");
    expect(modelledCombo1.queryType).toBe("full-name");
    expect(modelledCombo1.displayName).toBe("Rahul Smith");
    expect(modelledCombo1.detailedProfileUrl).toBeNull();

    // Space-separated full name entered into single first-name field
    const spaceCombo = resolveNameSearch({ firstName: "James Johnson" });
    expect(spaceCombo.queryType).toBe("full-name");
    expect(spaceCombo.displayName).toBe("James Johnson");
    expect(spaceCombo.detailedProfileUrl).toBe("/people/james-johnson");
  });

  // 4. Unicode & International Characters
  it("properly preserves Unicode accents, diacritics, hyphens, and apostrophes", () => {
    const unicodeCases = [
      { input: "José", expectedMode: "verified" }, // Matches canonical Jose
      { input: "Zoë", expectedMode: "verified" }, // Matches canonical Zoe
      { input: "Søren", expectedMode: "modelled" },
      { input: "Anne-Marie", expectedMode: "modelled" },
      { input: "O'Connor", expectedMode: "modelled" },
      { input: "Min-jun", expectedMode: "modelled" },
    ];

    for (const { input, expectedMode } of unicodeCases) {
      const val = validateName(input);
      expect(val.isValid).toBe(true);

      const res = resolveNameSearch({ firstName: input });
      expect(res.mode).toBe(expectedMode);
      expect(res.estimatedPeople).toBeGreaterThan(0);
    }
  });

  // 5. Invalid Input Rejection
  it("rejects URLs, numbers, repetitive spam, and oversized input strings", () => {
    const invalidCases = [
      "",
      "   ",
      "https://example.com",
      "www.google.com/spam",
      "John123",
      "aaaaa",
      "ThisIsAnExtremelyLongNameThatExceedsThirtyCharactersLimit",
    ];

    for (const invalid of invalidCases) {
      const res = resolveNameSearch({ firstName: invalid });
      expect(res.mode).toBe("invalid");
      expect(res.estimatedPeople).toBeNull();
      expect(res.errorReason).toBeDefined();
    }
  });
});
