/**
 * Centralized Name Normalization Utility for HowManyOfMe.co
 * Controls URL slug generation, canonical URL generation, and route lookups.
 */

export interface NormalizedName {
  display: string;      // Canonical display title-cased name (e.g., "James")
  slug: string;         // Canonical URL slug for routing (e.g., "James")
  lowerSlug: string;    // Lowercase slug for case-insensitive matching (e.g., "james")
  canonicalUrl: string; // Full canonical URL (e.g., "https://howmanyofme.co/name/James")
}

const SITE_URL = "https://howmanyofme.co";

/**
 * Normalizes any raw name string into canonical display and slug formats.
 */
export function normalizeName(raw: string): NormalizedName {
  if (!raw || typeof raw !== "string") {
    return {
      display: "",
      slug: "",
      lowerSlug: "",
      canonicalUrl: `${SITE_URL}/`,
    };
  }

  const decoded = decodeURIComponent(raw).trim();
  // Strip diacritics / accents and non-alpha characters for normalization
  const cleaned = decoded
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "");

  if (!cleaned) {
    return {
      display: "",
      slug: "",
      lowerSlug: "",
      canonicalUrl: `${SITE_URL}/`,
    };
  }

  // Canonical casing: First letter uppercase, rest lowercase
  const display = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  // In HowManyOfMe, URL slugs for names preserve TitleCase (e.g. /name/James)
  const slug = display;
  const lowerSlug = display.toLowerCase();
  const canonicalUrl = `${SITE_URL}/name/${encodeURIComponent(slug)}`;

  return {
    display,
    slug,
    lowerSlug,
    canonicalUrl,
  };
}
