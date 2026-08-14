import { describe, it, expect } from "vitest";
import { resolveNameSearch } from "../lib/estimation/resolveNameSearch";
import { getRarityClassification } from "../lib/estimation/richInsights";
import {
  getGeneration,
  getChineseZodiac,
  getWesternZodiac,
  calculatePersonalizedInsights,
} from "../lib/estimation/personalization";

describe("Phase B2: Rich Inline Name Results & Personalization Tests", () => {
  // 1. Rarity Classification
  it("computes deterministic rarity classifications based on population count", () => {
    expect(getRarityClassification(1_200_000).level).toBe("Very Common");
    expect(getRarityClassification(350_000).level).toBe("Common");
    expect(getRarityClassification(45_000).level).toBe("Uncommon");
    expect(getRarityClassification(8_500).level).toBe("Rare");
    expect(getRarityClassification(450).level).toBe("Very Rare");

    expect(getRarityClassification(1_000_000).oneInX).toBeGreaterThan(0);
  });

  // 2. Rich Insights Attachment in resolveNameSearch
  it("attaches rich insights to verified first-name search results", () => {
    const res = resolveNameSearch({ firstName: "James" });

    expect(res.mode).toBe("verified");
    expect(res.richInsights).toBeDefined();
    expect(res.richInsights?.rarity.level).toBe("Very Common");
    expect(res.richInsights?.gender?.malePct).toBeGreaterThan(90);
    expect(res.richInsights?.history).toBeDefined();
    expect(res.richInsights?.history?.peakYear).toBeGreaterThan(1900);
    expect(res.richInsights?.geography?.topStates.length).toBe(5);
    expect(res.richInsights?.funFacts.length).toBeGreaterThanOrEqual(2);
    expect(res.richInsights?.relatedNames.length).toBeGreaterThanOrEqual(4);
  });

  it("attaches valid baseline insights to unindexed modelled names without fake gender or fake charts", () => {
    const res = resolveNameSearch({ firstName: "Rahul" });

    expect(res.mode).toBe("modelled");
    expect(res.richInsights).toBeDefined();
    expect(res.richInsights?.gender).toBeNull(); // Must not infer gender
    expect(res.richInsights?.history).toBeNull(); // Must not fabricate historical birth curves
    expect(res.richInsights?.funFacts.length).toBeGreaterThanOrEqual(1);
  });

  // 3. Generation Classification
  it("correctly identifies generations from birth years", () => {
    expect(getGeneration(2020).name).toBe("Gen Alpha");
    expect(getGeneration(2005).name).toBe("Gen Z");
    expect(getGeneration(1990).name).toBe("Millennial");
    expect(getGeneration(1975).name).toBe("Gen X");
    expect(getGeneration(1955).name).toBe("Baby Boomer");
    expect(getGeneration(1935).name).toBe("Silent Generation");
  });

  // 4. Chinese Zodiac Mapping
  it("calculates deterministic Chinese Zodiac animals and emojis", () => {
    expect(getChineseZodiac(1996).animal).toBe("Rat");
    expect(getChineseZodiac(1997).animal).toBe("Ox");
    expect(getChineseZodiac(1998).animal).toBe("Tiger");
    expect(getChineseZodiac(1999).animal).toBe("Rabbit");
    expect(getChineseZodiac(2000).animal).toBe("Dragon");
    expect(getChineseZodiac(2001).animal).toBe("Snake");
  });

  // 5. Western Zodiac
  it("calculates Western Zodiac signs from valid month and day", () => {
    expect(getWesternZodiac(3, 25)?.sign).toBe("Aries");
    expect(getWesternZodiac(7, 15)?.sign).toBe("Cancer");
    expect(getWesternZodiac(10, 31)?.sign).toBe("Scorpio");
    expect(getWesternZodiac(12, 25)?.sign).toBe("Capricorn");
    expect(getWesternZodiac(13, 1)).toBeUndefined();
  });

  // 6. Master Personalization Engine
  it("generates structured birth-year insights with historical era context", () => {
    const insight = calculatePersonalizedInsights("David", 1990);

    expect(insight).not.toBeNull();
    expect(insight?.birthYear).toBe(1990);
    expect(insight?.generation).toBe("Millennial");
    expect(insight?.chineseZodiac).toBe("Horse");
    expect(insight?.namePopularityInYear).toBeDefined();
    expect(insight?.namePopularityInYear?.birthCountEstimate).toBeGreaterThan(0);
  });

  it("handles out-of-range birth years gracefully without crashing", () => {
    expect(calculatePersonalizedInsights("David", 1850)).toBeNull();
    expect(calculatePersonalizedInsights("David", 2099)).toBeNull();
    expect(calculatePersonalizedInsights("David", NaN)).toBeNull();
  });

  // 7. Top Cities Derivation
  it("derives top cities without exceeding state bearer counts", () => {
    const res = resolveNameSearch({ firstName: "James" });
    const topCities = res.richInsights?.geography?.topCities;
    const topStates = res.richInsights?.geography?.topStates;

    expect(topCities).toBeDefined();
    expect(topCities!.length).toBeLessThanOrEqual(5);
    expect(topCities!.length).toBeGreaterThan(0);

    for (const city of topCities!) {
      const parentState = topStates?.find((s) => s.state === city.state);
      if (parentState) {
        expect(city.estimatedBearers).toBeLessThanOrEqual(parentState.estimatedBearers);
      }
    }
  });

  // 8. Full Birthday Personalization with Western Zodiac
  it("generates Western Zodiac when month and day are provided", () => {
    const insight = calculatePersonalizedInsights("Emma", 2002, 7, 24);
    expect(insight).not.toBeNull();
    expect(insight?.westernZodiac).toBeDefined();
    expect(insight?.westernZodiac?.sign).toBe("Leo");
    expect(insight?.westernZodiac?.symbol).toBe("♌");
    expect(insight?.generation).toBe("Gen Z");
    expect(insight?.chineseZodiac).toBe("Horse");
  });
});
