import { describe, it, expect } from "vitest";
import {
  buildNameSeoMetadata,
  getDefaultGscMap,
  type SearchPerformanceRecord,
} from "../lib/seo/performanceData";
import { buildNamePageViewModel } from "../lib/names/insights";
import type { NameRecord } from "../lib/names/getName";

describe("CTR Optimization & Intent-Matched Metadata Suite", () => {
  const sampleEmma: NameRecord = {
    name: "Emma",
    slug: "emma",
    normalizedName: "emma",
    gender: "female",
    rank: 10,
    count: 650000,
    origin: "Germanic",
    meaning: "Universal, whole",
    decade_popularity: { "2010s": 1 },
    sources: ["SSA", "US_CENSUS"],
    actuarial: {
      estimatedLiving: 580000,
      estimatedAverageAge: 28.5,
      survivalModel: "CDC_2020_LIFE_TABLE",
    },
    ssa: {
      totalBirths: 650000,
      maleBirths: 0,
      femaleBirths: 650000,
      firstYear: 1880,
      lastYear: 2024,
      peakYear: 2014,
      peakYearBirths: 20936,
      recentBirths: 15000,
      recentWindow: "2015-2024",
      history: [{ year: 2014, births: 20936, male: 0, female: 20936 }],
    },
  };

  const sampleJames: NameRecord = {
    name: "James",
    slug: "james",
    normalizedName: "james",
    gender: "male",
    rank: 1,
    count: 5200000,
    origin: "Hebrew",
    meaning: "Supplanter",
    decade_popularity: { "1950s": 1 },
    sources: ["SSA", "US_CENSUS"],
    actuarial: {
      estimatedLiving: 3200000,
      estimatedAverageAge: 51.0,
      survivalModel: "CDC_2020_LIFE_TABLE",
    },
    ssa: {
      totalBirths: 5200000,
      maleBirths: 5200000,
      femaleBirths: 0,
      firstYear: 1880,
      lastYear: 2024,
      peakYear: 1947,
      peakYearBirths: 94756,
      recentBirths: 12000,
      recentWindow: "2015-2024",
      history: [{ year: 1947, births: 94756, male: 94756, female: 0 }],
    },
  };

  it("generates popularity-intent matched title & H1 for names with rarity search demand", () => {
    const vm = buildNamePageViewModel(sampleEmma);
    const perfRecord: SearchPerformanceRecord = {
      url: "/name/Emma",
      canonicalUrl: "/name/Emma",
      pageFamily: "first-name",
      impressions: 19500,
      clicks: 1420,
      ctr: 0.0728,
      averagePosition: 4.9,
      primaryIntent: "POPULARITY",
      queries: [{ query: "how common is the name emma", impressions: 19500, clicks: 1420, ctr: 0.0728, position: 4.9, intent: "POPULARITY" }],
    };

    const meta = buildNameSeoMetadata(sampleEmma, vm.livingEstimate, vm.rank, perfRecord);

    expect(meta.title).toBe("How Common Is the Name Emma? Popularity & Living Statistics");
    expect(meta.h1).toBe("How Common Is the Name Emma?");
    expect(meta.description).toContain("Emma ranks #10 in all-time U.S. frequency with ~580,000 living bearers");
    expect(meta.primaryIntent).toBe("POPULARITY");
  });

  it("generates how-many count-intent matched title & H1 for names with count search demand", () => {
    const vm = buildNamePageViewModel(sampleJames);
    const meta = buildNameSeoMetadata(sampleJames, vm.livingEstimate, vm.rank);

    expect(meta.title).toBe("How Many People Are Named James? Statistics & Living Population");
    expect(meta.h1).toBe("How Many People Are Named James?");
    expect(meta.description).toContain("An estimated ~3,200,000 living people in the U.S. have the first name James (rank #1)");
    expect(meta.primaryIntent).toBe("HOW_MANY");
  });

  it("supports meaning & origin intent when observed in search patterns", () => {
    const vm = buildNamePageViewModel(sampleEmma);
    const perfRecord: SearchPerformanceRecord = {
      url: "/name/Emma",
      canonicalUrl: "/name/Emma",
      pageFamily: "first-name",
      impressions: 5000,
      clicks: 300,
      ctr: 0.06,
      averagePosition: 3.5,
      primaryIntent: "MEANING_ORIGIN",
      queries: [{ query: "emma name meaning", impressions: 5000, clicks: 300, ctr: 0.06, position: 3.5, intent: "MEANING_ORIGIN" }],
    };

    const meta = buildNameSeoMetadata(sampleEmma, vm.livingEstimate, vm.rank, perfRecord);

    expect(meta.title).toBe("Emma: Name Meaning, Cultural Origin & Living Statistics");
    expect(meta.h1).toBe("Emma Name Meaning, Cultural Origin & Statistics");
    expect(meta.description).toContain("Discover the Germanic origins and meaning of Emma (\"Universal, whole\")");
    expect(meta.primaryIntent).toBe("MEANING_ORIGIN");
  });

  it("supports historical decade intent when observed in search patterns", () => {
    const vm = buildNamePageViewModel(sampleJames);
    const perfRecord: SearchPerformanceRecord = {
      url: "/name/James",
      canonicalUrl: "/name/James",
      pageFamily: "first-name",
      impressions: 4000,
      clicks: 250,
      ctr: 0.0625,
      averagePosition: 4.1,
      primaryIntent: "HISTORICAL",
      queries: [{ query: "james name popularity over time", impressions: 4000, clicks: 250, ctr: 0.0625, position: 4.1, intent: "HISTORICAL" }],
    };

    const meta = buildNameSeoMetadata(sampleJames, vm.livingEstimate, vm.rank, perfRecord);

    expect(meta.title).toBe("James Name Popularity by Decade & Historical Trends");
    expect(meta.h1).toBe("James Historical Popularity & Decade Trends (1880–2024)");
    expect(meta.description).toContain("Track the historical popularity of James across decades from 1880 through 2024");
    expect(meta.primaryIntent).toBe("HISTORICAL");
  });

  it("automatically resolves known GSC query intents from default snapshot lookup", () => {
    const defaultMap = getDefaultGscMap();
    expect(defaultMap.has("/name/Emma")).toBe(true);
    expect(defaultMap.get("/name/Emma")?.primaryIntent).toBe("POPULARITY");
    expect(defaultMap.has("/name/James")).toBe(true);
    expect(defaultMap.get("/name/James")?.primaryIntent).toBe("HOW_MANY");
  });
});
