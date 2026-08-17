import { describe, it, expect } from "vitest";
import {
  TOPICAL_CLUSTERS,
  LINKABLE_ASSETS,
  FUTURE_CONTENT_OPPORTUNITIES,
  evaluateEntityAuthorityProfile,
} from "../lib/seo/topicalAuthority";
import type { SearchPerformanceRecord } from "../lib/seo/performanceData";

describe("Topical Authority & Entity Strategy Suite", () => {
  it("registers 6 core topical clusters with valid hubs and unique advantages", () => {
    expect(TOPICAL_CLUSTERS.length).toBe(6);
    for (const cluster of TOPICAL_CLUSTERS) {
      expect(cluster.id).toBeDefined();
      expect(cluster.hubUrl.startsWith("/")).toBe(true);
      expect(cluster.uniqueDataAdvantage.length).toBeGreaterThan(15);
      expect(cluster.coreEntitiesCount).toBeGreaterThan(0);
    }
  });

  it("registers active linkable assets with target audiences and citation rationale", () => {
    expect(LINKABLE_ASSETS.length).toBeGreaterThanOrEqual(4);
    for (const asset of LINKABLE_ASSETS) {
      expect(asset.url.startsWith("/")).toBe(true);
      expect(asset.potentialReferrers.length).toBeGreaterThan(0);
      expect(asset.citationReason.length).toBeGreaterThan(10);
    }
  });

  it("contains high-ROI future content and research study opportunities", () => {
    expect(FUTURE_CONTENT_OPPORTUNITIES.length).toBeGreaterThanOrEqual(3);
    for (const opportunity of FUTURE_CONTENT_OPPORTUNITIES) {
      expect(opportunity.targetUrl.startsWith("/research/")).toBe(true);
      expect(opportunity.targetEntities.length).toBeGreaterThan(0);
      expect(opportunity.supportingData).toBeDefined();
    }
  });

  it("correctly classifies LIKELY_AUTHORITY_GAP for high-demand striking-distance entities", () => {
    const mockPerf: SearchPerformanceRecord = {
      url: "/name/Emma",
      canonicalUrl: "/name/Emma",
      pageFamily: "first-name",
      impressions: 19500,
      clicks: 1420,
      ctr: 0.0728,
      averagePosition: 4.9,
      primaryIntent: "POPULARITY",
      queries: [],
    };

    const profile = evaluateEntityAuthorityProfile("Emma", mockPerf);

    expect(profile.authorityGap).toBe("LIKELY_AUTHORITY_GAP");
    expect(profile.primaryCluster).toBe("NAME_POPULARITY_TRENDS");
    expect(profile.recommendedAuthorityStrategy).toContain("held back from top 3 SERP rankings by external domain authority");
  });

  it("handles unknown demand safely without assigning arbitrary gaps", () => {
    const profile = evaluateEntityAuthorityProfile("Aaliyah");

    expect(profile.authorityGap).toBe("UNKNOWN");
    expect(profile.searchDemandTier).toBe("UNKNOWN");
    expect(profile.seoPriority).toBe("P2_UNKNOWN");
  });
});
