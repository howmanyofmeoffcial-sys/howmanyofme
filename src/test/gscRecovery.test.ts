import { describe, it, expect } from "vitest";
import {
  ORIGINAL_689_DISPOSITION,
  REPRESENTATIVE_ROLLOUT_COHORTS,
  isGoogleIndexingReady,
} from "../lib/seo/gscRecovery";

describe("GSC Recovery, Indexing Readiness & Rollout Suite", () => {
  it("verifies full resolution of all 689 originally affected URLs", () => {
    expect(ORIGINAL_689_DISPOSITION.totalOriginalAffected).toBe(689);
    expect(ORIGINAL_689_DISPOSITION.needsReview).toBe(0);

    const sum =
      ORIGINAL_689_DISPOSITION.nowIndexableCandidates +
      ORIGINAL_689_DISPOSITION.nowNoindexUtility +
      ORIGINAL_689_DISPOSITION.nowRedirected301 +
      ORIGINAL_689_DISPOSITION.nowRemoved410 +
      ORIGINAL_689_DISPOSITION.nowClean404;

    expect(sum).toBe(689);
  });

  it("contains representative rollout cohorts spanning all 5 strategic tiers", () => {
    expect(REPRESENTATIVE_ROLLOUT_COHORTS.length).toBeGreaterThanOrEqual(5);

    const cohorts = new Set(REPRESENTATIVE_ROLLOUT_COHORTS.map((c) => c.cohort));
    expect(cohorts.has("COHORT_A_ESTABLISHED")).toBe(true);
    expect(cohorts.has("COHORT_B_UNINDEXED_STRONG")).toBe(true);
    expect(cohorts.has("COHORT_C_SIMILAR_NAMES")).toBe(true);
    expect(cohorts.has("COHORT_D_EDGE_CASE")).toBe(true);
    expect(cohorts.has("COHORT_E_INVALID_REMOVED")).toBe(true);
  });

  it("evaluates a perfect page as 100% indexing-ready with 0 blockers", () => {
    const result = isGoogleIndexingReady("/name/Kyle", {
      status: 200,
      isIndexable: true,
      hasCanonical: true,
      canonicalMatchesSelf: true,
      hasTitle: true,
      hasMetaDesc: true,
      hasH1: true,
      hasCoreContent: true,
      inSitemap: true,
      internalInlinks: 25,
    });

    expect(result.ready).toBe(true);
    expect(result.blockers.length).toBe(0);
    expect(result.warnings.length).toBe(0);
    expect(result.recommendedAction).toContain("100% indexing-ready");
  });

  it("detects blockers when canonical or sitemap criteria are violated", () => {
    const result = isGoogleIndexingReady("/name/NonCanonical", {
      status: 200,
      isIndexable: true,
      hasCanonical: true,
      canonicalMatchesSelf: false, // Mismatch
      hasTitle: true,
      hasMetaDesc: true,
      hasH1: true,
      hasCoreContent: true,
      inSitemap: false, // Missing from sitemap
      internalInlinks: 5,
    });

    expect(result.ready).toBe(false);
    expect(result.blockers).toContain("CANONICAL_MISMATCH (Missing or points to another URL)");
    expect(result.blockers).toContain("MISSING_FROM_SITEMAP");
  });

  it("emits warning for low internal inlinks without breaking indexing readiness", () => {
    const result = isGoogleIndexingReady("/name/RareName", {
      status: 200,
      isIndexable: true,
      hasCanonical: true,
      canonicalMatchesSelf: true,
      hasTitle: true,
      hasMetaDesc: true,
      hasH1: true,
      hasCoreContent: true,
      inSitemap: true,
      internalInlinks: 1, // Warning threshold < 3
    });

    expect(result.ready).toBe(true);
    expect(result.blockers.length).toBe(0);
    expect(result.warnings.length).toBe(1);
    expect(result.warnings[0]).toContain("LOW_INTERNAL_AUTHORITY");
  });
});
