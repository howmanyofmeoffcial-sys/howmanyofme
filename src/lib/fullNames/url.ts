import { normalizeName } from "../names/normalizeName";

const SITE_ORIGIN = "https://howmanyofme.co";

/**
 * Creates a deterministic, SEO-friendly slug for a full name entity.
 * e.g., "David", "Smith" -> "david-smith"
 * e.g., "Mary", "O'Connor" -> "mary-oconnor"
 * e.g., "José", "García" -> "jose-garcia"
 */
export function getFullNameSlug(firstName: string, lastName: string): string {
  const normFirst = normalizeName(firstName).asciiClean.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normLast = normalizeName(lastName).asciiClean.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${normFirst}-${normLast}`;
}

export function getFullNameUrl(firstName: string, lastName: string): string {
  return `/people/${getFullNameSlug(firstName, lastName)}`;
}

export function getFullNameAbsoluteUrl(firstName: string, lastName: string): string {
  return `${SITE_ORIGIN}${getFullNameUrl(firstName, lastName)}`;
}
