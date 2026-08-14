import canonicalNamesList from "../../data/generated/canonical-names.json";
import { type NameRecord } from "./getName";

const ALL_RECORDS = canonicalNamesList as unknown as NameRecord[];

/**
 * Retrieves all canonical names from the generated dataset.
 */
export function getAllNames(): NameRecord[] {
  return ALL_RECORDS;
}

/**
 * Retrieves all indexable names passing data quality filters.
 */
export function getIndexableNames(): NameRecord[] {
  return ALL_RECORDS.filter((n) => n.count > 0 && n.rank > 0 && Boolean(n.origin));
}

/**
 * Retrieves top curated names.
 */
export function getCuratedPopularNames(): NameRecord[] {
  return ALL_RECORDS.slice(0, 20);
}

/**
 * Retrieves all names for a specific letter (A–Z).
 */
export function getNamesByLetter(letter: string): NameRecord[] {
  const l = letter.toLowerCase();
  return ALL_RECORDS.filter((n) => n.name.toLowerCase().startsWith(l));
}
