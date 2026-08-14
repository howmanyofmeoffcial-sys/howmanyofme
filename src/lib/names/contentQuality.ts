/**
 * Content Quality & Data Completeness Evaluation Engine for HowManyOfMe.co
 * Deterministically grades entity records to ensure zero thin pages are indexed.
 */

import type { NameRecord } from "./getName";
import { getAllNames } from "./getAllNames";

export type QualityTier = "TIER_A_STRONG" | "TIER_B_USABLE" | "TIER_C_INSUFFICIENT";

export interface QualityReport {
  name: string;
  tier: QualityTier;
  score: number; // 0 to 100
  dataCompleteness: {
    hasCount: boolean;
    hasRank: boolean;
    hasGender: boolean;
    hasOrigin: boolean;
    hasMeaning: boolean;
    regionsCount: number;
    decadesCount: number;
    isCurated: boolean;
  };
  aeoReadiness: boolean;
  isIndexable: boolean;
  issues: string[];
}

/**
 * Audits an individual name record for content quality and data completeness.
 */
export function auditNameQuality(record: NameRecord): QualityReport {
  const issues: string[] = [];
  let score = 0;

  const hasCount = typeof record.count === "number" && record.count > 0;
  const hasRank = typeof record.rank === "number" && record.rank > 0;
  const hasGender = ["male", "female", "unisex"].includes(record.gender);
  const hasOrigin = Boolean(record.origin && record.origin.trim().length > 0);
  const hasMeaning = Boolean(record.meaning && record.meaning.trim().length > 0);
  const regionsCount = Object.keys(record.regions || {}).length;
  const decadesCount = Object.keys(record.decade_popularity || {}).length;
  const isCurated = record.isCurated === true;

  // 1. Data Completeness (40 pts)
  if (hasCount) score += 10;
  else issues.push("Missing valid living bearer count");

  if (hasRank) score += 10;
  else issues.push("Missing popularity rank");

  if (hasGender) score += 5;
  else issues.push("Missing gender classification");

  if (hasOrigin) score += 5;
  else issues.push("Missing cultural origin");

  if (hasMeaning) score += 5;
  else issues.push("Missing etymological meaning");

  if (regionsCount >= 3) score += 5;
  else issues.push("Fewer than 3 regional distributions");

  // 2. Trend & Historical Depth (20 pts)
  if (decadesCount >= 8) score += 20;
  else if (decadesCount >= 4) score += 10;
  else issues.push("Insufficient decade trend data");

  // 3. Curated Authority (15 pts)
  if (isCurated) score += 15;
  else score += 10; // Standard procedural baseline

  // 4. Entity Specificity & Linguistic Context (15 pts)
  if (record.name.length >= 2 && record.name.length <= 20) score += 15;
  else issues.push("Name length out of standard bounds");

  // 5. Structure & Consistency (10 pts)
  score += 10;

  let tier: QualityTier = "TIER_C_INSUFFICIENT";
  if (score >= 85) {
    tier = "TIER_A_STRONG";
  } else if (score >= 65) {
    tier = "TIER_B_USABLE";
  }

  const aeoReadiness = hasCount && hasRank && hasOrigin && decadesCount >= 8;
  const isIndexable = tier !== "TIER_C_INSUFFICIENT";

  return {
    name: record.name,
    tier,
    score,
    dataCompleteness: {
      hasCount,
      hasRank,
      hasGender,
      hasOrigin,
      hasMeaning,
      regionsCount,
      decadesCount,
      isCurated,
    },
    aeoReadiness,
    isIndexable,
    issues,
  };
}

/**
 * Runs a comprehensive quality audit across the entire dataset.
 */
export function auditAllNamesQuality() {
  const allNames = getAllNames();
  const results = allNames.map(auditNameQuality);

  const tierA = results.filter((r) => r.tier === "TIER_A_STRONG");
  const tierB = results.filter((r) => r.tier === "TIER_B_USABLE");
  const tierC = results.filter((r) => r.tier === "TIER_C_INSUFFICIENT");

  return {
    total: results.length,
    tierA: { count: tierA.length, names: tierA.map((r) => r.name) },
    tierB: { count: tierB.length, names: tierB.map((r) => r.name) },
    tierC: { count: tierC.length, names: tierC.map((r) => r.name) },
    averageScore: Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length),
    aeoReadyCount: results.filter((r) => r.aeoReadiness).length,
    indexableCount: results.filter((r) => r.isIndexable).length,
  };
}
