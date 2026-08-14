import { normalizeName } from "./normalizeName";
import { validateName } from "./validateName";
import { getNameRecord } from "./getNameRecord";
import type { TimelinePoint, StateShare } from "./statistics";

export interface NameRecord {
  name: string;
  normalizedName: string;
  slug: string;
  count: number;
  gender: "male" | "female" | "unisex";
  rank: number;
  origin: string;
  meaning: string;
  regions?: Record<string, number>;
  decade_popularity: Record<string, number>;
  ssa?: {
    totalBirths: number;
    maleBirths: number;
    femaleBirths: number;
    firstYear: number;
    lastYear: number;
    peakYear: number;
    peakYearBirths: number;
    recentBirths: number;
    recentWindow: string;
    recentTrend?: {
      percentChange: number;
      direction: string;
      period: string;
    };
    history?: TimelinePoint[];
  };
  actuarial?: {
    estimatedLiving: number;
    estimatedAverageAge: number;
    survivalModel: string;
  };
  sexBreakdown?: {
    male: number;
    female: number;
    pctMale: number;
    pctFemale: number;
    primarySex: "male" | "female" | "unisex";
  };
  census2020?: {
    count: number;
    rank: number;
    pctMale: number;
    pctFemale: number;
    sourceYear: number;
  } | null;
  stateDistribution?: StateShare[];
  sources: string[];
  isCurated?: boolean;
}

/**
 * Retrieves a NameRecord from the generated official dataset.
 * @param rawName Raw input name or slug
 * @param allowFallback If false, returns null for names not in the canonical dataset
 */
export function getName(rawName: string, allowFallback = false): NameRecord | null {
  const officialRecord = getNameRecord(rawName);
  if (officialRecord) {
    return officialRecord;
  }

  if (!allowFallback) {
    return null;
  }

  const validation = validateName(rawName);
  if (!validation.isValid || !validation.normalized) {
    return null;
  }

  // Safe fallback without fabricated rank, origin, meaning, or decade curves
  const normObj = normalizeName(validation.normalized);
  return {
    name: normObj.display,
    normalizedName: normObj.lowerSlug,
    slug: normObj.slug,
    count: 0,
    gender: "unisex",
    rank: 0,
    origin: "Unspecified",
    meaning: "Demographic estimate",
    regions: { "United States": 0 },
    decade_popularity: {},
    sources: ["derived-estimate"],
    isCurated: false,
  };
}

export function hasName(name: string): boolean {
  return getNameRecord(name) !== null;
}

export function getNameSlug(name: string): string {
  const norm = normalizeName(name);
  return norm.slug;
}
