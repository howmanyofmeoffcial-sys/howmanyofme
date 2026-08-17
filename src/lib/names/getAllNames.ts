import canonicalNamesList from "../../data/generated/canonical-names.json" with { type: "json" };
import { type NameRecord } from "./getName.ts";
import { evaluateNameIndexability } from "../seo/indexability.ts";

const ALL_RECORDS = canonicalNamesList as unknown as NameRecord[];

/**
 * Retrieves all canonical names from the generated dataset.
 */
export function getAllNames(): NameRecord[] {
  return ALL_RECORDS;
}

/**
 * Retrieves all indexable names passing centralized SEO indexability evaluation.
 */
export function getIndexableNames(): NameRecord[] {
  return ALL_RECORDS.filter((n) => evaluateNameIndexability(n).status === "INDEX");
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
