/**
 * Centralized SEO Indexability Engine for HowManyOfMe.co
 * Single source of truth across static path generation, sitemap inclusion,
 * robots directives, internal link gating, and content quality auditing.
 */

import type { NameRecord } from "../names/getName.ts";
import { getSimilarNames } from "../names/getSimilarNames.ts";

export type IndexabilityStatus = "INDEX" | "NOINDEX" | "EXCLUDE";

export interface IndexabilityResult {
  status: IndexabilityStatus;
  reasons: string[];
  score: number; // 0 to 100 based on verified data depth
}

// Known non-name stop words, protocols, or legacy category terms that must be excluded from name index
export const BLOCKED_NAME_ENTITIES = new Set([
  "scandinavian",
  "arabic",
  "germanic",
  "brazil",
  "italy",
  "celtic",
  "sanskrit",
  "hebrew",
  "greek",
  "australia",
  "netherlands",
  "korean",
  "latin",
  "turkish",
  "canada",
  "persian",
  "slavic",
  "undefined",
  "null",
  "https",
  "http",
  "favicon",
  "robots",
  "sitemap",
]);

/**
 * Centrally evaluates whether a NameRecord is complete, factually backed,
 * and eligible for search engine indexing.
 */
export function evaluateNameIndexability(
  record: NameRecord | null | undefined
): IndexabilityResult {
  const reasons: string[] = [];
  let score = 0;

  if (!record || typeof record !== "object") {
    return {
      status: "EXCLUDE",
      reasons: ["Record is null or not a valid object"],
      score: 0,
    };
  }

  const rawName = typeof record.name === "string" ? record.name.trim() : "";

  // 1. Structural Name Validity
  if (rawName.length < 2 || rawName.length > 30) {
    return {
      status: "EXCLUDE",
      reasons: [`Name length (${rawName.length}) is outside valid bounds (2-30)`],
      score: 0,
    };
  }

  if (BLOCKED_NAME_ENTITIES.has(rawName.toLowerCase())) {
    return {
      status: "EXCLUDE",
      reasons: [`"${rawName}" is a legacy/blocked entity keyword, not an individual name`],
      score: 0,
    };
  }

  // Check valid name characters (letters, spaces, hyphens, apostrophes)
  if (!/^[A-Za-zÀ-ÿ' -]+$/.test(rawName)) {
    return {
      status: "EXCLUDE",
      reasons: ["Name contains invalid non-alphabetic characters"],
      score: 0,
    };
  }

  // 2. Popularity & Scale Validation (20 pts)
  const hasCount = typeof record.count === "number" && record.count > 0;
  const hasRank = typeof record.rank === "number" && record.rank > 0;

  if (hasCount) {
    score += 10;
  } else {
    reasons.push("Missing valid historical birth count");
  }

  if (hasRank) {
    score += 10;
  } else {
    reasons.push("Missing valid national popularity rank");
  }

  // 3. Cultural Origin & Etymology (20 pts)
  const originClean = typeof record.origin === "string" ? record.origin.trim() : "";
  const meaningClean = typeof record.meaning === "string" ? record.meaning.trim() : "";
  const hasValidOrigin = originClean.length >= 2 && originClean.toLowerCase() !== "unspecified";
  const hasValidMeaning = meaningClean.length >= 2 && meaningClean.toLowerCase() !== "demographic estimate";

  if (hasValidOrigin) {
    score += 10;
  } else {
    reasons.push("Missing cultural origin");
  }

  if (hasValidMeaning) {
    score += 10;
  } else {
    reasons.push("Missing etymological meaning");
  }

  // 4. Actuarial & Living Bearer Estimate (20 pts)
  const estimatedLiving = record.actuarial?.estimatedLiving;
  const hasActuarial = typeof estimatedLiving === "number" && estimatedLiving > 0;

  if (hasActuarial) {
    score += 20;
  } else {
    reasons.push("Missing actuarial living population estimate");
  }

  // 5. Historical Depth & Decade Trend Data (20 pts)
  const totalBirths = record.ssa?.totalBirths;
  const hasSsa = typeof totalBirths === "number" && totalBirths > 0;
  const decadeCount = record.decade_popularity ? Object.keys(record.decade_popularity).length : 0;

  if (hasSsa) {
    score += 10;
  } else {
    reasons.push("Missing SSA historical registration data");
  }

  if (decadeCount >= 8) {
    score += 10;
  } else if (decadeCount >= 4) {
    score += 5;
  } else {
    reasons.push("Insufficient historical decade trend data (< 4 decades)");
  }

  // 6. Demographic Completeness & Verification (20 pts)
  const hasGender = ["male", "female", "unisex"].includes(record.gender);
  const hasSources = Array.isArray(record.sources) && record.sources.length > 0 && !record.sources.includes("none");

  if (hasGender) {
    score += 10;
  } else {
    reasons.push("Missing gender classification");
  }

  if (hasSources) {
    score += 10;
  } else {
    reasons.push("Missing verifiable government/census sources");
  }

  // Optional Curation bonus (not artificial points, but extra verification flag)
  if (record.isCurated === true) {
    score = Math.min(100, score + 5);
  }

  // Hard gating: to be INDEX, all core required components must be present
  const isHardRequirementsMet =
    hasCount &&
    hasRank &&
    hasValidOrigin &&
    hasValidMeaning &&
    hasActuarial &&
    hasSsa &&
    hasGender &&
    hasSources &&
    decadeCount >= 4;

  const status: IndexabilityStatus = isHardRequirementsMet && score >= 70 ? "INDEX" : "NOINDEX";

  return {
    status,
    reasons,
    score,
  };
}

export interface IndexabilityBatchAudit {
  total: number;
  indexedCount: number;
  noindexCount: number;
  excludedCount: number;
  indexedNames: string[];
  noindexNames: { name: string; reasons: string[] }[];
  excludedNames: { name: string; reasons: string[] }[];
}

/**
 * Runs a batch indexability audit across an array of NameRecords.
 */
export function auditNamesIndexability(records: NameRecord[]): IndexabilityBatchAudit {
  const indexedNames: string[] = [];
  const noindexNames: { name: string; reasons: string[] }[] = [];
  const excludedNames: { name: string; reasons: string[] }[] = [];

  for (const record of records) {
    const evaluation = evaluateNameIndexability(record);
    const name = record?.name || "UNKNOWN";

    if (evaluation.status === "INDEX") {
      indexedNames.push(name);
    } else if (evaluation.status === "NOINDEX") {
      noindexNames.push({ name, reasons: evaluation.reasons });
    } else {
      excludedNames.push({ name, reasons: evaluation.reasons });
    }
  }

  return {
    total: records.length,
    indexedCount: indexedNames.length,
    noindexCount: noindexNames.length,
    excludedCount: excludedNames.length,
    indexedNames,
    noindexNames,
    excludedNames,
  };
}

export interface SimilarNamesIndexabilityResult extends IndexabilityResult {
  matchCount: number;
  soundalikeCount: number;
  strongMatchCount: number;
  topScore: number;
}

/**
 * Centrally evaluates whether a Similar Names page for a given target entity
 * provides sufficient multi-signal similarity value to be indexed as a Google landing page.
 */
export function evaluateSimilarNamesIndexability(
  record: NameRecord | string | null | undefined
): SimilarNamesIndexabilityResult {
  const reasons: string[] = [];

  if (!record) {
    return {
      status: "EXCLUDE",
      reasons: ["Target record is null or undefined"],
      score: 0,
      matchCount: 0,
      soundalikeCount: 0,
      strongMatchCount: 0,
      topScore: 0,
    };
  }

  const rawName = typeof record === "string" ? record.trim() : record.name.trim();

  // 1. Structural validity
  if (rawName.length < 2 || rawName.length > 30) {
    return {
      status: "EXCLUDE",
      reasons: [`Name length (${rawName.length}) is outside valid bounds (2-30)`],
      score: 0,
      matchCount: 0,
      soundalikeCount: 0,
      strongMatchCount: 0,
      topScore: 0,
    };
  }

  if (BLOCKED_NAME_ENTITIES.has(rawName.toLowerCase())) {
    return {
      status: "EXCLUDE",
      reasons: [`"${rawName}" is a blocked/category entity, not a valid person name`],
      score: 0,
      matchCount: 0,
      soundalikeCount: 0,
      strongMatchCount: 0,
      topScore: 0,
    };
  }

  if (!/^[A-Za-zÀ-ÿ' -]+$/.test(rawName)) {
    return {
      status: "EXCLUDE",
      reasons: ["Name contains invalid characters"],
      score: 0,
      matchCount: 0,
      soundalikeCount: 0,
      strongMatchCount: 0,
      topScore: 0,
    };
  }

  // 2. Underlying Target Entity Data Completeness
  const targetObj = typeof record === "object" ? record : null;
  const hasCount = typeof targetObj?.count === "number" && targetObj.count > 0;
  const hasRank = typeof targetObj?.rank === "number" && targetObj.rank > 0;
  const hasLiving = typeof targetObj?.actuarial?.estimatedLiving === "number" && targetObj.actuarial.estimatedLiving > 0;
  const hasHistory = typeof targetObj?.ssa?.totalBirths === "number" && targetObj.ssa.totalBirths > 0;
  const hasOrigin = Boolean(targetObj?.origin && targetObj.origin.trim() && targetObj.origin.trim().toLowerCase() !== "unspecified");

  if (!hasCount || !hasRank || !hasLiving || !hasHistory || !hasOrigin) {
    reasons.push("Target name lacks required authoritative demographic/historical data depth");
  }

  // 3. Multi-Signal Similarity Quality
  const similarOutput = getSimilarNames(record, 20);
  const matchCount = similarOutput.combined.length;
  const soundalikeCount = similarOutput.phonetic.length;
  const strongMatches = similarOutput.combined.filter((m) => m.score >= 50 && m.signals.length >= 2);
  const strongMatchCount = strongMatches.length;
  const topScore = similarOutput.combined[0]?.score || 0;

  if (soundalikeCount < 3) {
    reasons.push(`Insufficient phonetic/orthographic soundalikes (${soundalikeCount} < 3)`);
  }

  if (strongMatchCount < 4) {
    reasons.push(`Insufficient multi-dimensional strong matches (${strongMatchCount} < 4)`);
  }

  if (topScore < 65) {
    reasons.push(`Leading match similarity score below required confidence threshold (${topScore} < 65)`);
  }

  // 4. Data-driven Quality Scoring
  const topScorePts = (Math.min(100, topScore) / 100) * 30;
  const strongPts = Math.min(1, strongMatchCount / 6) * 30;
  const soundalikePts = Math.min(1, soundalikeCount / 5) * 20;
  const rank = targetObj?.rank || 500;
  const popPts = rank <= 100 ? 20 : rank <= 250 ? 15 : rank <= 500 ? 10 : 5;

  const score = Math.round(topScorePts + strongPts + soundalikePts + popPts);

  if (score < 75) {
    reasons.push(`Overall similarity quality score (${score}) is below the index threshold (75)`);
  }

  const status: IndexabilityStatus = reasons.length === 0 && score >= 75 ? "INDEX" : "NOINDEX";

  return {
    status,
    reasons,
    score,
    matchCount,
    soundalikeCount,
    strongMatchCount,
    topScore,
  };
}

export interface SimilarNamesBatchAudit {
  total: number;
  indexedCount: number;
  noindexCount: number;
  excludedCount: number;
  indexedNames: string[];
  noindexDetails: { name: string; reasons: string[]; score: number }[];
  excludedDetails: { name: string; reasons: string[] }[];
  distribution: {
    min: number;
    median: number;
    avg: string;
    p75: number;
    p90: number;
    max: number;
  };
}

/**
 * Runs a comprehensive batch indexability audit for Similar Names across all records.
 */
export function auditSimilarNamesIndexability(records: NameRecord[]): SimilarNamesBatchAudit {
  const indexedNames: string[] = [];
  const noindexDetails: { name: string; reasons: string[]; score: number }[] = [];
  const excludedDetails: { name: string; reasons: string[] }[] = [];
  const strongMatchCounts: number[] = [];

  for (const record of records) {
    const evaluation = evaluateSimilarNamesIndexability(record);
    const name = record?.name || "UNKNOWN";
    strongMatchCounts.push(evaluation.strongMatchCount);

    if (evaluation.status === "INDEX") {
      indexedNames.push(name);
    } else if (evaluation.status === "NOINDEX") {
      noindexDetails.push({ name, reasons: evaluation.reasons, score: evaluation.score });
    } else {
      excludedDetails.push({ name, reasons: evaluation.reasons });
    }
  }

  strongMatchCounts.sort((a, b) => a - b);
  const sum = strongMatchCounts.reduce((a, b) => a + b, 0);

  return {
    total: records.length,
    indexedCount: indexedNames.length,
    noindexCount: noindexDetails.length,
    excludedCount: excludedDetails.length,
    indexedNames,
    noindexDetails,
    excludedDetails,
    distribution: {
      min: strongMatchCounts[0] || 0,
      median: strongMatchCounts[Math.floor(strongMatchCounts.length / 2)] || 0,
      avg: (sum / (strongMatchCounts.length || 1)).toFixed(2),
      p75: strongMatchCounts[Math.floor(strongMatchCounts.length * 0.75)] || 0,
      p90: strongMatchCounts[Math.floor(strongMatchCounts.length * 0.9)] || 0,
      max: strongMatchCounts[strongMatchCounts.length - 1] || 0,
    },
  };
}
