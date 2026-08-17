import { describe, it, expect } from "vitest";
import {
  normalizeGscUrl,
  classifyQueryIntent,
  ingestGscRecords,
  evaluateNameSeoProfile,
  type SearchPerformanceRecord,
} from "../lib/seo/performanceData";
import { getName } from "../lib/names/getName";
import type { NameRecord } from "../lib/names/getName";

describe("Search Demand, Cohorts & SEO Priority Engine Tests", () => {
  describe("GSC URL Normalization", () => {
    it("normalizes diverse raw URL formats to canonical endpoints", () => {
      expect(normalizeGscUrl("https://howmanyofme.co/name/kyle/").canonicalUrl).toBe("/name/Kyle");
      expect(normalizeGscUrl("http://www.howmanyofme.co/name/James").canonicalUrl).toBe("/name/James");
      expect(normalizeGscUrl("/name/emma.html").canonicalUrl).toBe("/name/Emma");
      expect(normalizeGscUrl("/people/david-smith").canonicalUrl).toBe("/people/david-smith");
      expect(normalizeGscUrl("/names/j").canonicalUrl).toBe("/names/j");
      expect(normalizeGscUrl("https://howmanyofme.co/").canonicalUrl).toBe("/");
    });

    it("correctly identifies page families", () => {
      expect(normalizeGscUrl("/name/David").pageFamily).toBe("first-name");
      expect(normalizeGscUrl("/people/john-smith").pageFamily).toBe("full-name");
      expect(normalizeGscUrl("/names/m").pageFamily).toBe("directory");
      expect(normalizeGscUrl("/tools/popularity-checker").pageFamily).toBe("tool");
      expect(normalizeGscUrl("/methodology").pageFamily).toBe("informational");
      expect(normalizeGscUrl("/").pageFamily).toBe("brand");
    });
  });

  describe("Query Intent Classification", () => {
    it("correctly categorizes query intents", () => {
      expect(classifyQueryIntent("how many people are named David")).toBe("HOW_MANY");
      expect(classifyQueryIntent("how many James are there")).toBe("HOW_MANY");
      expect(classifyQueryIntent("how common is the name Emma")).toBe("POPULARITY");
      expect(classifyQueryIntent("Liam name popularity rank")).toBe("POPULARITY");
      expect(classifyQueryIntent("Sophia name meaning and origin")).toBe("MEANING_ORIGIN");
      expect(classifyQueryIntent("Noah popularity by decade history")).toBe("HISTORICAL");
      expect(classifyQueryIntent("Oliver in New York state")).toBe("GEOGRAPHIC");
      expect(classifyQueryIntent("names starting with a")).toBe("GENERAL_NAME");
      expect(classifyQueryIntent("random search terms")).toBe("OTHER");
    });
  });

  describe("GSC Ingestion and Aggregation", () => {
    it("aggregates multiple queries for the same canonical page", () => {
      const rows = [
        { query: "how many people named james", page: "/name/james", clicks: 100, impressions: 1000, position: 4.0 },
        { query: "how common is the name james", page: "/name/James/", clicks: 50, impressions: 500, position: 5.0 },
      ];

      const gscMap = ingestGscRecords(rows);
      const record = gscMap.get("/name/James");

      expect(record).toBeDefined();
      if (!record) return;

      expect(record.canonicalUrl).toBe("/name/James");
      expect(record.impressions).toBe(1500);
      expect(record.clicks).toBe(150);
      expect(record.ctr).toBe(0.1);
      expect(record.queries.length).toBe(2);
    });
  });

  describe("2-Dimensional SEO Priority Evaluation", () => {
    const validRecord = getName("James", false) as NameRecord;

    it("evaluates a proven high-visibility name (P0_PROVEN)", () => {
      const perf: SearchPerformanceRecord = {
        url: "/name/James",
        canonicalUrl: "/name/James",
        pageFamily: "first-name",
        impressions: 32000,
        clicks: 2400,
        ctr: 0.075,
        averagePosition: 4.2,
        queries: [{ query: "how many people are named james", impressions: 32000, clicks: 2400, ctr: 0.075, position: 4.2, intent: "HOW_MANY" }],
        primaryIntent: "HOW_MANY",
      };

      const profile = evaluateNameSeoProfile(validRecord, perf, 668);
      expect(profile.seoPriority).toBe("P0_PROVEN");
      expect(profile.searchDemandTier).toBe("PROVEN");
      expect(profile.indexability).toBe("INDEX");
      expect(profile.qualityStatus).toBe("EXCELLENT");
    });

    it("evaluates a striking-distance name (P1_STRIKING_DISTANCE)", () => {
      const perf: SearchPerformanceRecord = {
        url: "/name/Emma",
        canonicalUrl: "/name/Emma",
        pageFamily: "first-name",
        impressions: 19500,
        clicks: 1420,
        ctr: 0.0728,
        averagePosition: 4.9,
        queries: [{ query: "how common is the name emma", impressions: 19500, clicks: 1420, ctr: 0.0728, position: 4.9, intent: "POPULARITY" }],
        primaryIntent: "POPULARITY",
      };

      const emma = getName("Emma", false) as NameRecord;
      const profile = evaluateNameSeoProfile(emma, perf, 80);
      expect(profile.seoPriority).toBe("P1_STRIKING_DISTANCE");
      expect(profile.searchDemandTier).toBe("PROVEN");
    });

    it("evaluates a high-demand low-CTR name (P1_HIGH_DEMAND_LOW_CTR)", () => {
      const perf: SearchPerformanceRecord = {
        url: "/name/James",
        canonicalUrl: "/name/James",
        pageFamily: "first-name",
        impressions: 12000,
        clicks: 200,
        ctr: 0.016,
        averagePosition: 5.5,
        queries: [],
        primaryIntent: "HOW_MANY",
      };

      const profile = evaluateNameSeoProfile(validRecord, perf, 100);
      expect(profile.seoPriority).toBe("P1_HIGH_DEMAND_LOW_CTR");
    });

    it("evaluates an authority opportunity (P1_AUTHORITY_OPPORTUNITY)", () => {
      const perf: SearchPerformanceRecord = {
        url: "/name/James",
        canonicalUrl: "/name/James",
        pageFamily: "first-name",
        impressions: 800,
        clicks: 12,
        ctr: 0.015,
        averagePosition: 28.0,
        queries: [],
        primaryIntent: "HOW_MANY",
      };

      const profile = evaluateNameSeoProfile(validRecord, perf, 20);
      expect(profile.seoPriority).toBe("P1_AUTHORITY_OPPORTUNITY");
    });

    it("evaluates a page with no GSC data as P2_UNKNOWN without changing indexability", () => {
      const profile = evaluateNameSeoProfile(validRecord, undefined, 25);
      expect(profile.seoPriority).toBe("P2_UNKNOWN");
      expect(profile.searchDemandTier).toBe("UNKNOWN");
      expect(profile.indexability).toBe("INDEX");
      expect(profile.impressions).toBe(0);
    });

    it("evaluates a weak data / invalid record as P3_DATA_WEAK", () => {
      const weakRecord = {
        name: "FakeName",
        count: 0,
        rank: 0,
        gender: "unknown",
        origin: "",
        meaning: "",
      } as unknown as NameRecord;

      const profile = evaluateNameSeoProfile(weakRecord, undefined, 0);
      expect(profile.seoPriority).toBe("P3_DATA_WEAK");
      expect(profile.qualityStatus).toBe("WEAK");
      expect(profile.indexability).toBe("NOINDEX");
    });
  });
});
