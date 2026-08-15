/**
 * Unified Name Resolver & Data Model
 * HowManyOfMe.co
 *
 * Authoritative resolver combining:
 * - Census 2020 First-Name Tabulations
 * - Census Decennial Surname Data
 * - Social Security Administration (SSA 1880-2024) National Researcher Data
 * - Social Security Administration (SSA 2025) Annual Release
 */

import { getNameRecord } from "./names/getNameRecord";
import { getSurname } from "./surnames/data";
import { normalizeName } from "./names/normalizeName";
import { validateName } from "./names/validateName";
import { calculateModelledLivingCount, calculateJointFullNameEstimate, type MetricType } from "./name-estimator";
import ssa2025Raw from "../data/raw/ssa/ssa_2025.json";

export type ConfidenceScore = "high" | "moderate" | "low" | null;

export interface SourceAvailability {
  censusFirstName: boolean;
  ssaHistorical: boolean;
  ssa2025: boolean;
  censusSurname: boolean;
}

export interface CensusFirstNameInfo {
  count: number;
  rank: number | null;
  pctMale: number;
  pctFemale: number;
  sourceYear: number;
  sourceLabel: "U.S. Census 2020";
  metricType: "observed";
}

export interface SsaHistoricalInfo {
  totalBirths: number;
  maleBirths: number;
  femaleBirths: number;
  firstYear: number;
  lastYear: number;
  peakYear: number;
  peakYearBirths: number;
  recentBirths: number;
  sourceLabel: "Social Security Administration";
  metricType: "observed";
}

export interface Ssa2025Info {
  year: number;
  rank: number;
  count: number;
  sex: "M" | "F";
  sourceLabel: "Social Security Administration";
  metricType: "observed";
}

export interface ResolvedFirstNameResult {
  name: string;
  displayName: string;
  normalizedKey: string;
  status: "verified" | "modelled" | "invalid";
  confidence: ConfidenceScore;
  availability: SourceAvailability;

  // Primary living estimate
  derivedLivingBearers: {
    count: number;
    metricType: MetricType;
    sourceLabel: string;
    explanation: string;
  };

  // Official source records
  census: CensusFirstNameInfo | null;
  ssa: SsaHistoricalInfo | null;
  latestSsa: Ssa2025Info | null;

  // Metadata
  primaryGender: "male" | "female" | "unisex";
  origin?: string;
  meaning?: string;
  errorReason?: string;
}

export interface ResolvedSurnameResult {
  surname: string;
  displayName: string;
  status: "verified" | "modelled" | "invalid";
  confidence: ConfidenceScore;
  availability: {
    censusSurname: boolean;
  };

  censusFrequency: {
    count: number;
    rank: number | null;
    prop100k: number | null;
    sourceLabel: "U.S. Census Bureau";
    metricType: "observed" | "estimated";
  } | null;

  origin?: string;
  errorReason?: string;
}

export interface ResolvedFullNameResult {
  fullName: string;
  firstName: ResolvedFirstNameResult;
  surname: ResolvedSurnameResult;
  status: "verified" | "modelled" | "invalid";
  confidence: ConfidenceScore;

  jointEstimate: {
    estimatedPeople: number;
    displayEstimate: string;
    metricType: MetricType;
    sourceLabel: string;
    methodology: string;
  } | null;

  errorReason?: string;
}

// 2025 Top Ranks Lookup Cache
const SSA_2025_CACHE = new Map<string, Ssa2025Info>();
if (ssa2025Raw) {
  if (Array.isArray((ssa2025Raw as any).topMale)) {
    for (const m of (ssa2025Raw as any).topMale) {
      SSA_2025_CACHE.set(m.name.toLowerCase(), {
        year: 2025,
        rank: m.rank,
        count: m.count,
        sex: "M",
        sourceLabel: "Social Security Administration",
        metricType: "observed",
      });
    }
  }
  if (Array.isArray((ssa2025Raw as any).topFemale)) {
    for (const f of (ssa2025Raw as any).topFemale) {
      SSA_2025_CACHE.set(f.name.toLowerCase(), {
        year: 2025,
        rank: f.rank,
        count: f.count,
        sex: "F",
        sourceLabel: "Social Security Administration",
        metricType: "observed",
      });
    }
  }
}

/**
 * Resolves first-name demographic data across Census 2020, SSA 1880-2024, and SSA 2025.
 */
export function resolveFirstName(rawName: string): ResolvedFirstNameResult {
  const validation = validateName(rawName);

  if (!validation.isValid || !validation.normalized) {
    return {
      name: rawName,
      displayName: rawName,
      normalizedKey: rawName.toLowerCase(),
      status: "invalid",
      confidence: null,
      availability: {
        censusFirstName: false,
        ssaHistorical: false,
        ssa2025: false,
        censusSurname: false,
      },
      derivedLivingBearers: {
        count: 0,
        metricType: "unavailable",
        sourceLabel: "Not available in this source",
        explanation: validation.reason || "Invalid name structure",
      },
      census: null,
      ssa: null,
      latestSsa: null,
      primaryGender: "unisex",
      errorReason: validation.reason || "Invalid name provided",
    };
  }

  const norm = normalizeName(validation.normalized);
  const official = getNameRecord(norm.display);
  const key = norm.display.toLowerCase();
  const latest2025 = SSA_2025_CACHE.get(key) || null;

  if (official) {
    const ssaInfo: SsaHistoricalInfo | null = official.ssa
      ? {
          totalBirths: official.ssa.totalBirths,
          maleBirths: official.ssa.maleBirths,
          femaleBirths: official.ssa.femaleBirths,
          firstYear: official.ssa.firstYear,
          lastYear: official.ssa.lastYear,
          peakYear: official.ssa.peakYear,
          peakYearBirths: official.ssa.peakYearBirths,
          recentBirths: official.ssa.recentBirths,
          sourceLabel: "Social Security Administration",
          metricType: "observed",
        }
      : null;

    const censusInfo: CensusFirstNameInfo | null = official.census2020
      ? {
          count: official.census2020.count,
          rank: official.census2020.rank,
          pctMale: official.census2020.pctMale,
          pctFemale: official.census2020.pctFemale,
          sourceYear: 2020,
          sourceLabel: "U.S. Census 2020",
          metricType: "observed",
        }
      : null;

    const livingCount = official.actuarial?.estimatedLiving || official.count;

    return {
      name: official.name,
      displayName: norm.display || official.name,
      normalizedKey: key,
      status: "verified",
      confidence: ssaInfo && censusInfo ? "high" : "moderate",
      availability: {
        censusFirstName: Boolean(censusInfo),
        ssaHistorical: Boolean(ssaInfo),
        ssa2025: Boolean(latest2025),
        censusSurname: false,
      },
      derivedLivingBearers: {
        count: livingCount,
        metricType: "derived",
        sourceLabel: "Derived estimate from SSA cohort & CDC actuarial life tables",
        explanation: "Computed by applying age-specific actuarial survival rates to historical annual birth cohorts.",
      },
      census: censusInfo,
      ssa: ssaInfo,
      latestSsa: latest2025,
      primaryGender: official.gender || "unisex",
      origin: official.origin,
      meaning: official.meaning,
    };
  }

  // Unindexed / Modelled Name
  const modelledCount = calculateModelledLivingCount(norm.display);

  return {
    name: norm.display,
    displayName: norm.display,
    normalizedKey: key,
    status: "modelled",
    confidence: "low",
    availability: {
      censusFirstName: false,
      ssaHistorical: false,
      ssa2025: Boolean(latest2025),
      censusSurname: false,
    },
    derivedLivingBearers: {
      count: modelledCount,
      metricType: "estimated",
      sourceLabel: "Statistical estimate from U.S. demographic distribution model",
      explanation: "Calculated using demographic frequency curve for names outside primary top-name records.",
    },
    census: null,
    ssa: null,
    latestSsa: latest2025,
    primaryGender: "unisex",
  };
}

/**
 * Resolves surname demographic frequency from Decennial Census data.
 */
export function resolveSurname(rawSurname: string): ResolvedSurnameResult {
  const validation = validateName(rawSurname);

  if (!validation.isValid || !validation.normalized) {
    return {
      surname: rawSurname,
      displayName: rawSurname,
      status: "invalid",
      confidence: null,
      availability: {
        censusSurname: false,
      },
      censusFrequency: null,
      errorReason: validation.reason || "Invalid surname structure",
    };
  }

  const norm = normalizeName(validation.normalized);
  const surnameRecord = getSurname(norm.display);

  if (surnameRecord) {
    return {
      surname: surnameRecord.name,
      displayName: surnameRecord.name,
      status: "verified",
      confidence: "high",
      availability: {
        censusSurname: true,
      },
      censusFrequency: {
        count: surnameRecord.count,
        rank: surnameRecord.rank,
        prop100k: surnameRecord.prop100k,
        sourceLabel: "U.S. Census Bureau",
        metricType: "observed",
      },
      origin: surnameRecord.origin,
    };
  }

  // Modelled surname for unindexed queries
  const modelledCount = calculateModelledLivingCount(norm.display) * 3;

  return {
    surname: norm.display,
    displayName: norm.display,
    status: "modelled",
    confidence: "low",
    availability: {
      censusSurname: false,
    },
    censusFrequency: {
      count: modelledCount,
      rank: null,
      prop100k: Math.round((modelledCount / 335000000) * 100000),
      sourceLabel: "U.S. Census Bureau",
      metricType: "estimated",
    },
  };
}

/**
 * Resolves joint full-name demographic frequency under statistical independence.
 */
export function resolveFullName(rawFirstName: string, rawSurname: string): ResolvedFullNameResult {
  const firstResult = resolveFirstName(rawFirstName);
  const lastResult = resolveSurname(rawSurname);

  if (firstResult.status === "invalid" || lastResult.status === "invalid") {
    return {
      fullName: `${rawFirstName} ${rawSurname}`.trim(),
      firstName: firstResult,
      surname: lastResult,
      status: "invalid",
      confidence: null,
      jointEstimate: null,
      errorReason: firstResult.errorReason || lastResult.errorReason || "Invalid full-name input",
    };
  }

  const firstLiving = firstResult.derivedLivingBearers.count;
  const surnameCount = lastResult.censusFrequency?.count || 1000;

  const joint = calculateJointFullNameEstimate(firstLiving, surnameCount);

  const status: "verified" | "modelled" =
    firstResult.status === "verified" && lastResult.status === "verified" ? "verified" : "modelled";

  const confidence: ConfidenceScore =
    firstResult.confidence === "high" && lastResult.confidence === "high"
      ? "high"
      : firstResult.confidence === "low" || lastResult.confidence === "low"
        ? "low"
        : "moderate";

  return {
    fullName: `${firstResult.displayName} ${lastResult.displayName}`,
    firstName: firstResult,
    surname: lastResult,
    status,
    confidence,
    jointEstimate: {
      estimatedPeople: joint.estimatedPeople,
      displayEstimate: `~${joint.estimatedPeople.toLocaleString("en-US")}`,
      metricType: joint.metricType,
      sourceLabel: "Derived from SSA birth survival models and Census surname probabilities",
      methodology: joint.methodology,
    },
  };
}
