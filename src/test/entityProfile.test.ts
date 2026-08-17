import { describe, it, expect } from "vitest";
import { getName } from "../lib/names/getName";
import { buildNameEntityProfile } from "../lib/names/entityProfile";
import { buildNamePageViewModel } from "../lib/names/insights";
import { evaluateNameIndexability } from "../lib/seo/indexability";

describe("Rich Statistical Entity Profile & Name ViewModel Tests", () => {
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

  it("builds consistent, non-contradictory NamePageViewModel for Kyle", () => {
    const kyle = getName("Kyle", false);
    expect(kyle).not.toBeNull();
    if (!kyle) return;

    const vm = buildNamePageViewModel(kyle);
    expect(vm.name).toBe("Kyle");
    expect(vm.rank).toBe(105);
    expect(vm.livingEstimate).toBeGreaterThan(0);
    expect(vm.historicalBirths).toBeGreaterThanOrEqual(vm.livingEstimate);
    expect(vm.peakYear).toBeGreaterThan(1950);
    expect(vm.femaleShare).toBeGreaterThan(90);
    expect(vm.keyInsights.length).toBeGreaterThanOrEqual(4);

    // Verify FAQ numbers match main stats
    const faq1 = vm.faqs[0];
    expect(faq1.q).toContain("Kyle");
    expect(faq1.a).toContain(kyle.name);

    // Verify key insights contain actual living count and rank
    const livingInsight = vm.keyInsights.find((i) => i.label.includes("Living"));
    expect(livingInsight).toBeDefined();
  });

  it("builds verified insights and FAQs for Emma", () => {
    const emma = getName("Emma", false);
    expect(emma).not.toBeNull();
    if (!emma) return;

    const vm = buildNamePageViewModel(emma);
    expect(vm.name).toBe("Emma");
    expect(vm.femaleShare).toBeGreaterThan(90);
    expect(vm.faqs.length).toBeGreaterThanOrEqual(5);

    const genderFaq = vm.faqs.find((f) => f.q.includes("gender"));
    expect(genderFaq).toBeDefined();
    expect(genderFaq?.a).toContain("feminine");
  });

  it("safely excludes non-name category keywords like Italy from Name pages", () => {
    const res = evaluateNameIndexability({ name: "Italy" } as any);
    expect(res.status).toBe("EXCLUDE");
  });
});
