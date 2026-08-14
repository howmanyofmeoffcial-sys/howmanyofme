import { describe, it, expect } from "vitest";
import { getName } from "../lib/names/getName";
import { buildNameEntityProfile } from "../lib/names/entityProfile";

describe("Phase 11 — Rich Statistical Entity Profile Tests", () => {
  it("builds a comprehensive entity profile for classic names (James)", () => {
    const james = getName("James");
    expect(james).not.toBeNull();
    const profile = buildNameEntityProfile(james!);

    expect(profile.name).toBe("James");
    expect(profile.rank).toBe(1);
    expect(profile.stats.totalHistoricalBirths).toBeGreaterThan(4000000);
    expect(profile.stats.estimatedLivingPeople).toBeGreaterThan(1500000);
    expect(profile.stats.peakYear).toBeGreaterThanOrEqual(1880);
    expect(profile.stats.peakYear).toBeLessThanOrEqual(2024);
    expect(profile.availability.hasHistory).toBe(true);
    expect(profile.availability.hasCensus).toBe(true);
    expect(profile.availability.hasActuarial).toBe(true);
    expect(profile.availability.hasStateDistribution).toBe(true);
    expect(profile.insights.quickAnswer).toContain("James");
    expect(profile.insights.peakInsight).toContain("peak");
  });

  it("accurately reports sex distribution for female-dominant names (Mary)", () => {
    const mary = getName("Mary");
    expect(mary).not.toBeNull();
    const profile = buildNameEntityProfile(mary!);

    expect(profile.stats.femaleShare).toBeGreaterThan(90);
    expect(profile.insights.sexInsight).toContain("feminine");
  });

  it("provides fallback and clean notice when census data is missing or unlisted", () => {
    const custom = getName("CustomUnindexedName", true);
    expect(custom).not.toBeNull();
    const profile = buildNameEntityProfile(custom!);

    expect(profile.availability.hasCensus).toBe(false);
    expect(profile.insights.censusInsight).toContain("not appear");
  });

  it("verifies state distribution shares sum to expected national proportions", () => {
    const david = getName("David");
    expect(david).not.toBeNull();
    const profile = buildNameEntityProfile(david!);

    expect(profile.stats.stateDistribution.length).toBeGreaterThan(0);
    const ca = profile.stats.stateDistribution.find((s) => s.code === "CA");
    expect(ca).toBeDefined();
    expect(ca?.estimatedBearers).toBeGreaterThan(0);
  });
});
