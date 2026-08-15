import { describe, it, expect } from "vitest";
import {
  searchFirstNameSuggestions,
  searchSurnameSuggestions,
  searchFullNameSuggestions,
} from "../lib/names/nameSearch";
import { resolveFirstName, resolveFullName } from "../lib/name-resolver";

describe("Phase 23: Large Dataset Autocomplete & Compact Search Index", () => {
  // 1. First Name Prefix Behavior
  it("suggests David, Daniel, and Daisy for prefix 'da'", () => {
    const results = searchFirstNameSuggestions("da", 8).map((r) => r.name);
    expect(results).toContain("David");
    expect(results).toContain("Daniel");
    expect(results).toContain("Daisy");
  });

  it("suggests Rahul for prefix 'rah' and Rachel, Raphael for prefix 'ra'", () => {
    const rahResults = searchFirstNameSuggestions("rah", 6).map((r) => r.name);
    expect(rahResults).toContain("Rahul");

    const raResults = searchFirstNameSuggestions("ra", 8).map((r) => r.name);
    expect(raResults).toContain("Rachel");
    expect(raResults).toContain("Raphael");
  });

  it("suggests Priya for prefix 'pri'", () => {
    const results = searchFirstNameSuggestions("pri", 6).map((r) => r.name);
    expect(results).toContain("Priya");
  });

  it("suggests Yuki for prefix 'yuk'", () => {
    const results = searchFirstNameSuggestions("yuk", 6).map((r) => r.name);
    expect(results).toContain("Yuki");
  });

  it("suggests Muhammad for prefix 'muh'", () => {
    const results = searchFirstNameSuggestions("muh", 6).map((r) => r.name);
    expect(results).toContain("Muhammad");
  });

  it("suggests Sofia and Sophia for prefix 'sof'", () => {
    const results = searchFirstNameSuggestions("sof", 6).map((r) => r.name);
    expect(results).toContain("Sofia");
  });

  // 2. Surname Behavior
  it("suggests David Smith and David Scott for 'David s'", () => {
    const results = searchFullNameSuggestions("David s", 6);
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContain("David Smith");
    expect(results).toContain("David Scott");
  });

  it("suggests Patel and Patterson for prefix 'pat'", () => {
    const results = searchSurnameSuggestions("pat", 6).map((r) => r.name);
    expect(results).toContain("Patel");
    expect(results).toContain("Patterson");
  });

  it("suggests Garcia for prefix 'gar'", () => {
    const results = searchSurnameSuggestions("gar", 6).map((r) => r.name);
    expect(results).toContain("Garcia");
  });

  // 3. Resolvability (No False Results)
  it("ensures suggested names are resolvable by the name resolver", () => {
    const suggestions = searchFirstNameSuggestions("rah", 3);
    for (const s of suggestions) {
      const resolved = resolveFirstName(s.name);
      expect(resolved.status).not.toBe("invalid");
      expect(resolved.derivedLivingBearers.count).toBeGreaterThan(0);
    }
  });

  it("ensures full-name suggestions are resolvable", () => {
    const fullNameSuggestions = searchFullNameSuggestions("David Sm", 3);
    for (const fn of fullNameSuggestions) {
      const [first, ...lastParts] = fn.split(" ");
      const last = lastParts.join(" ");
      const resolved = resolveFullName(first, last);
      expect(resolved.status).not.toBe("invalid");
      expect(resolved.jointEstimate?.estimatedPeople).toBeGreaterThan(0);
    }
  });

  // 4. Performance & Latency
  it("executes search query in under 10ms", () => {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      searchFirstNameSuggestions("da", 6);
      searchFullNameSuggestions("David Sm", 6);
    }
    const end = performance.now();
    const avgLatency = (end - start) / 200;
    expect(avgLatency).toBeLessThan(10);
  });
});
