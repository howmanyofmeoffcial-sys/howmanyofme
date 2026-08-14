import { getNameData, getNamesForLetter } from "../../data/nameData";
import { normalizeName } from "./normalizeName";
import { validateName } from "./validateName";

export interface NameRecord {
  name: string;
  slug: string;
  count: number;
  gender: "male" | "female" | "unisex";
  rank: number;
  regions: Record<string, number>;
  decade_popularity: Record<string, number>;
  origin: string;
  meaning: string;
  isCurated: boolean;
}

// Set of known canonical names in dataset
let CANONICAL_NAMES_SET: Set<string> | null = null;

function getCanonicalNamesSet(): Set<string> {
  if (CANONICAL_NAMES_SET) return CANONICAL_NAMES_SET;
  const set = new Set<string>();
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  letters.forEach((l) => {
    getNamesForLetter(l).forEach((n) => set.add(n.toLowerCase()));
  });
  CANONICAL_NAMES_SET = set;
  return set;
}

/**
 * Retrieves a NameRecord for a given name.
 * @param rawName Raw input name or slug
 * @param allowFallback If false, returns null for names not in the canonical dataset (used for static generation/404 gates)
 */
export function getName(rawName: string, allowFallback = false): NameRecord | null {
  const validation = validateName(rawName);
  if (!validation.isValid || !validation.normalized) {
    return null;
  }

  const normalized = validation.normalized;
  const canonicalSet = getCanonicalNamesSet();
  const isKnown = canonicalSet.has(normalized.toLowerCase());

  if (!isKnown && !allowFallback) {
    return null;
  }

  const rawData = getNameData(normalized);
  const normObj = normalizeName(normalized);

  return {
    name: normObj.display,
    slug: normObj.slug,
    count: rawData.count,
    gender: rawData.gender,
    rank: rawData.rank,
    regions: rawData.regions,
    decade_popularity: rawData.decade_popularity,
    origin: rawData.origin,
    meaning: rawData.meaning,
    isCurated: rawData.rank <= 20,
  };
}
