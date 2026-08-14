import namesIndex from "../../data/generated/names-index.json";
import { normalizeName } from "./normalizeName";
import { validateName } from "./validateName";

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
  };
  census2020?: {
    count: number;
    rank: number;
    pctMale: number;
    pctFemale: number;
    sourceYear: number;
  } | null;
  sources: string[];
  isCurated?: boolean;
}

const INDEX_MAP = namesIndex as unknown as Record<string, NameRecord>;

/**
 * Retrieves a NameRecord from the generated official dataset.
 * @param rawName Raw input name or slug
 * @param allowFallback If false, returns null for names not in the canonical dataset
 */
export function getName(rawName: string, allowFallback = false): NameRecord | null {
  const validation = validateName(rawName);
  if (!validation.isValid || !validation.normalized) {
    return null;
  }

  const normalizedKey = validation.normalized.toLowerCase();
  const found = INDEX_MAP[normalizedKey];

  if (found) {
    return {
      ...found,
      regions: found.regions || { "United States": found.count },
      isCurated: found.rank <= 20,
    };
  }

  if (!allowFallback) {
    return null;
  }

  // Fallback generation for dynamic unindexed queries
  const normObj = normalizeName(validation.normalized);
  const syntheticCount = Math.max(100, Math.floor(1000000 / (normObj.display.length * 15)));

  return {
    name: normObj.display,
    normalizedName: normObj.lowerSlug,
    slug: normObj.slug,
    count: syntheticCount,
    gender: "unisex",
    rank: 9999,
    origin: "Traditional",
    meaning: "Beloved name",
    regions: { "United States": syntheticCount },
    decade_popularity: {
      "1940s": 50,
      "1950s": 55,
      "1960s": 60,
      "1970s": 65,
      "1980s": 70,
      "1990s": 75,
      "2000s": 80,
      "2010s": 85,
      "2020s": 90,
    },
    sources: ["derived-estimate"],
    isCurated: false,
  };
}

export function hasName(name: string): boolean {
  if (!name) return false;
  return Boolean(INDEX_MAP[name.toLowerCase()]);
}

export function getNameSlug(name: string): string {
  const norm = normalizeName(name);
  return norm.slug;
}
