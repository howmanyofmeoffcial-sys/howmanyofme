/**
 * Content Quality & Data Completeness Evaluation Engine for HowManyOfMe.co
 * Deterministically grades entity records to ensure zero thin pages are indexed.
 * Backed by the centralized Indexability Engine in src/lib/seo/indexability.ts.
 */

import type { NameRecord } from "./getName";
import { getAllNames } from "./getAllNames";
import { evaluateNameIndexability } from "../seo/indexability";

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
    hasActuarial: boolean;
    hasSsa: boolean;
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
 * Evaluates real data depth with zero synthetic score inflation.
 */
export function auditNameQuality(record: NameRecord): QualityReport {
  const indexability = evaluateNameIndexability(record);

  const hasCount = typeof record.count === "number" && record.count > 0;
  const hasRank = typeof record.rank === "number" && record.rank > 0;
  const hasGender = ["male", "female", "unisex"].includes(record.gender);
  const originClean = typeof record.origin === "string" ? record.origin.trim() : "";
  const hasOrigin = originClean.length >= 2 && originClean.toLowerCase() !== "unspecified";
  const meaningClean = typeof record.meaning === "string" ? record.meaning.trim() : "";
  const hasMeaning = meaningClean.length >= 2 && meaningClean.toLowerCase() !== "demographic estimate";
  const hasActuarial = typeof record.actuarial?.estimatedLiving === "number" && record.actuarial.estimatedLiving > 0;
  const hasSsa = typeof record.ssa?.totalBirths === "number" && record.ssa.totalBirths > 0;
  const regionsCount = Object.keys(record.regions || {}).length;
  const decadesCount = Object.keys(record.decade_popularity || {}).length;
  const isCurated = record.isCurated === true;

  const score = indexability.score;

  let tier: QualityTier = "TIER_C_INSUFFICIENT";
  if (indexability.status === "INDEX") {
    if (score >= 85 || isCurated) {
      tier = "TIER_A_STRONG";
    } else {
      tier = "TIER_B_USABLE";
    }
  }

  const aeoReadiness = hasCount && hasRank && hasOrigin && hasActuarial && decadesCount >= 8;
  const isIndexable = indexability.status === "INDEX";

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
      hasActuarial,
      hasSsa,
      regionsCount,
      decadesCount,
      isCurated,
    },
    aeoReadiness,
    isIndexable,
    issues: indexability.reasons,
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
    averageScore: Math.round(results.reduce((acc, r) => acc + r.score, 0) / (results.length || 1)),
    aeoReadyCount: results.filter((r) => r.aeoReadiness).length,
    indexableCount: results.filter((r) => r.isIndexable).length,
  };
}
