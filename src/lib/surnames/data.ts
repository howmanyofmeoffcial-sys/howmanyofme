import canonicalSurnames from "../../data/generated/canonical-surnames.json";
import type { SurnameEntity } from "./types";

const SURNAMES_LIST = canonicalSurnames as unknown as SurnameEntity[];
const SURNAMES_MAP = new Map<string, SurnameEntity>();

for (const s of SURNAMES_LIST) {
  SURNAMES_MAP.set(s.slug.toLowerCase(), s);
  SURNAMES_MAP.set(s.name.toLowerCase(), s);
}

export function getAllSurnames(): SurnameEntity[] {
  return SURNAMES_LIST;
}

export function getSurname(nameOrSlug: string): SurnameEntity | null {
  return SURNAMES_MAP.get(nameOrSlug.toLowerCase().trim()) || null;
}

export function getRelatedSurnames(currentSurname: string, limit = 6): SurnameEntity[] {
  const norm = currentSurname.toLowerCase();
  return SURNAMES_LIST.filter((s) => s.slug !== norm).slice(0, limit);
}
