import fullnamesIndex from "../../data/generated/fullnames-index.json";
import canonicalFullNames from "../../data/generated/canonical-fullnames.json";
import { getFullNameSlug } from "./url";

export interface FullNameEntity {
  displayName: string;
  firstName: string;
  lastName: string;
  slug: string;
  firstNameRank: number;
  firstNameLiving: number;
  surnameRank: number;
  surnameCount: number;
  estimatedPeople: number;
  rawEstimate: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  sources: string[];
  methodologyVersion: string;
}

const INDEX_MAP = fullnamesIndex as unknown as Record<string, FullNameEntity>;
const ALL_FULL_NAMES = canonicalFullNames as unknown as FullNameEntity[];

/**
 * Retrieves a full-name entity by slug or first+last name.
 */
export function getFullName(slugOrFirstName: string, lastName?: string): FullNameEntity | null {
  if (lastName) {
    const slug = getFullNameSlug(slugOrFirstName, lastName);
    return INDEX_MAP[slug] || null;
  }
  const cleanSlug = slugOrFirstName.toLowerCase().trim();
  return INDEX_MAP[cleanSlug] || null;
}

/**
 * Returns all canonical, validated, indexable full-name entities.
 */
export function getIndexableFullNames(): FullNameEntity[] {
  return ALL_FULL_NAMES;
}

/**
 * Returns meaningful related full-name combinations (same first name or same surname).
 */
export function getRelatedFullNames(firstName: string, lastName: string, limit = 8): FullNameEntity[] {
  const normFirst = firstName.toLowerCase().trim();
  const normLast = lastName.toLowerCase().trim();

  if (normFirst && !normLast) {
    return ALL_FULL_NAMES.filter(
      (f) => f.firstName.toLowerCase() === normFirst
    ).slice(0, limit);
  }

  if (normLast && !normFirst) {
    return ALL_FULL_NAMES.filter(
      (f) => f.lastName.toLowerCase() === normLast
    ).slice(0, limit);
  }

  const sameFirst = ALL_FULL_NAMES.filter(
    (f) => f.firstName.toLowerCase() === normFirst && f.lastName.toLowerCase() !== normLast
  ).slice(0, Math.floor(limit / 2));

  const sameLast = ALL_FULL_NAMES.filter(
    (f) => f.lastName.toLowerCase() === normLast && f.firstName.toLowerCase() !== normFirst
  ).slice(0, Math.ceil(limit / 2));

  return [...sameFirst, ...sameLast].slice(0, limit);
}

