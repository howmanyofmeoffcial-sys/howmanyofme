import { getNamesForLetter, ALPHABET } from "../../data/nameData";
import { getName, type NameRecord } from "./getName";
import { normalizeName } from "./normalizeName";

let ALL_NAMES_CACHE: NameRecord[] | null = null;

/**
 * Retrieves all canonical names in the dataset (583 records).
 */
export function getAllNames(): NameRecord[] {
  if (ALL_NAMES_CACHE) return ALL_NAMES_CACHE;

  const namesSet = new Set<string>();
  ALPHABET.forEach((letter) => {
    getNamesForLetter(letter).forEach((name) => {
      const norm = normalizeName(name).display;
      if (norm) namesSet.add(norm);
    });
  });

  const records: NameRecord[] = [];
  namesSet.forEach((name) => {
    const record = getName(name, false);
    if (record) {
      records.push(record);
    }
  });

  // Sort by rank ascending
  records.sort((a, b) => a.rank - b.rank);
  ALL_NAMES_CACHE = records;
  return records;
}

/**
 * Retrieves all indexable names passing the Phase 3 Data Quality Gate.
 */
export function getIndexableNames(): NameRecord[] {
  return getAllNames().filter((n) => n.count > 0 && n.rank > 0 && Boolean(n.origin));
}

/**
 * Retrieves the top 20 curated names.
 */
export function getCuratedPopularNames(): NameRecord[] {
  return getAllNames().filter((n) => n.isCurated).slice(0, 20);
}

/**
 * Retrieves all names for a specific letter (A–Z).
 */
export function getNamesByLetter(letter: string): NameRecord[] {
  const l = letter.toLowerCase();
  return getAllNames().filter((n) => n.name.toLowerCase().startsWith(l));
}
