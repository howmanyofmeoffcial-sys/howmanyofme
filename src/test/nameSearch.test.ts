import { describe, it, expect } from "vitest";
import {
  searchFirstNameSuggestions,
  searchSurnameSuggestions,
  searchFullNameSuggestions,
  normalizeQuery,
} from "../lib/names/nameSearch";

describe("Name Autocomplete & Search Engine", () => {
  it("returns matching first names for 2-character prefix", () => {
    const results = searchFirstNameSuggestions("da", 10);
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(10);
    const names = results.map((r) => r.name);
    expect(names).toContain("David");
    expect(names).toContain("Daniel");
  });


  it("is case-insensitive for search queries", () => {
    const lower = searchFirstNameSuggestions("em", 6).map((r) => r.name);
    const upper = searchFirstNameSuggestions("EM", 6).map((r) => r.name);
    const mixed = searchFirstNameSuggestions("Em", 6).map((r) => r.name);

    expect(lower).toEqual(upper);
    expect(lower).toEqual(mixed);
    expect(lower).toContain("Emma");
  });

  it("handles accents and diacritics transparently", () => {
    const res1 = searchFirstNameSuggestions("jos", 6).map((r) => r.name);
    const res2 = searchFirstNameSuggestions("josé", 6).map((r) => r.name);

    expect(res1.some((n) => n.toLowerCase().includes("jos"))).toBe(true);
    expect(res2.length).toBeGreaterThan(0);
  });

  it("handles apostrophes and special punctuation", () => {
    const res = searchFirstNameSuggestions("O'", 6);
    expect(res).toBeDefined();
  });

  it("ranks exact matches and popular names ahead of rare names", () => {
    const res = searchFirstNameSuggestions("david", 6);
    expect(res[0].name).toBe("David");
  });

  it("returns empty array for unknown prefixes without fabricating names", () => {
    const res = searchFirstNameSuggestions("xyzqplmno", 6);
    expect(res).toEqual([]);
  });

  // 2. Surname Suggestions
  it("returns matching surnames for surname input", () => {
    const results = searchSurnameSuggestions("sm", 6).map((r) => r.name);
    expect(results).toContain("Smith");
  });

  it("returns surnames in deterministic rank order", () => {
    const results = searchSurnameSuggestions("s", 6);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].rank).toBeLessThanOrEqual(results[results.length - 1].rank);
  });

  // 3. Full Name Suggestions
  it("returns full name suggestions when first name and last name prefix are provided", () => {
    const results = searchFullNameSuggestions("David Sm", 6);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toBe("David Smith");
  });

  it("suggests popular surnames when space is typed after first name", () => {
    const results = searchFullNameSuggestions("James ", 6);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toMatch(/^James /);
  });
});
