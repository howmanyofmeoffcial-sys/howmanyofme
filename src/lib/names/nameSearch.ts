import canonicalNamesList from "../../data/generated/canonical-names.json";
import canonicalSurnamesList from "../../data/generated/canonical-surnames.json";
import canonicalFullNamesList from "../../data/generated/canonical-fullnames.json";

export interface FirstNameSuggestion {
  name: string;
  gender: string;
  rank: number;
  origin?: string;
}

export interface SurnameSuggestion {
  name: string;
  rank: number;
  count: number;
}

export interface FullNameSuggestion {
  displayName: string;
  firstName: string;
  lastName: string;
}

const FIRST_NAMES: FirstNameSuggestion[] = (canonicalNamesList as any[]).map((n) => ({
  name: n.name,
  gender: n.gender || "unisex",
  rank: n.rank || 9999,
  origin: n.origin,
}));

const SURNAMES: SurnameSuggestion[] = (canonicalSurnamesList as any[]).map((s) => ({
  name: s.name,
  rank: s.rank || 9999,
  count: s.count || 0,
}));

const FULL_NAMES: FullNameSuggestion[] = (canonicalFullNamesList as any[]).map((f) => ({
  displayName: f.displayName,
  firstName: f.firstName,
  lastName: f.lastName,
}));

/**
 * Normalizes a query for accent-insensitive and case-insensitive prefix comparison.
 * e.g. "José" -> "jose", "O'Connor" -> "o'connor"
 */
export function normalizeQuery(query: string): string {
  if (!query) return "";
  return query
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip diacritics for matching only
}

/**
 * Searches first-name suggestions using deterministic prefix matching and popularity ranking.
 */
export function searchFirstNameSuggestions(query: string, limit = 6): FirstNameSuggestion[] {
  const norm = normalizeQuery(query);
  if (!norm || norm.length < 1) return [];

  const matches = FIRST_NAMES.filter((rec) => {
    const recNorm = normalizeQuery(rec.name);
    return recNorm.startsWith(norm);
  });

  // Sort: Exact match first -> Popularity rank (ascending) -> Length -> Alphabetical
  matches.sort((a, b) => {
    const aNorm = normalizeQuery(a.name);
    const bNorm = normalizeQuery(b.name);

    if (aNorm === norm) return -1;
    if (bNorm === norm) return 1;

    if (a.rank !== b.rank) return a.rank - b.rank;
    if (a.name.length !== b.name.length) return a.name.length - b.name.length;
    return a.name.localeCompare(b.name);
  });

  return matches.slice(0, limit);
}

/**
 * Searches surname suggestions using deterministic prefix matching.
 */
export function searchSurnameSuggestions(query: string, limit = 6): SurnameSuggestion[] {
  const norm = normalizeQuery(query);
  if (!norm || norm.length < 1) return [];

  const matches = SURNAMES.filter((rec) => {
    const recNorm = normalizeQuery(rec.name);
    return recNorm.startsWith(norm);
  });

  // Sort by national Census rank (ascending) -> Alphabetical
  matches.sort((a, b) => {
    const aNorm = normalizeQuery(a.name);
    const bNorm = normalizeQuery(b.name);

    if (aNorm === norm) return -1;
    if (bNorm === norm) return 1;

    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.name.localeCompare(b.name);
  });

  return matches.slice(0, limit);
}

/**
 * Searches full-name suggestions based on a combined two-token query (e.g. "David Sm" -> "David Smith").
 */
export function searchFullNameSuggestions(query: string, limit = 6): string[] {
  if (!query || !query.includes(" ")) return [];

  const parts = query.trim().split(/\s+/);
  const firstNameInput = parts[0];
  const lastNamePrefix = parts.length > 1 && query.trim() !== firstNameInput ? parts.slice(1).join(" ") : "";

  const normFirst = normalizeQuery(firstNameInput);
  const normLastPrefix = normalizeQuery(lastNamePrefix);

  if (!normLastPrefix) {
    // Return top popular surnames paired with the entered first name
    return SURNAMES.slice(0, limit).map((s) => `${firstNameInput} ${s.name}`);
  }

  // 1. Check exact full-name dataset first
  const fullMatches = FULL_NAMES.filter((f) => {
    const fFirst = normalizeQuery(f.firstName);
    const fLast = normalizeQuery(f.lastName);
    return fFirst === normFirst && fLast.startsWith(normLastPrefix);
  }).map((f) => f.displayName);

  if (fullMatches.length >= limit) {
    return fullMatches.slice(0, limit);
  }

  // 2. Supplement with matching surnames
  const surnameMatches = searchSurnameSuggestions(lastNamePrefix, limit);
  const combined = new Set<string>(fullMatches);

  for (const s of surnameMatches) {
    combined.add(`${firstNameInput} ${s.name}`);
    if (combined.size >= limit) break;
  }

  return Array.from(combined).slice(0, limit);
}

