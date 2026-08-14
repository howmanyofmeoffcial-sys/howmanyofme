/**
 * Centralized Name Normalization Utility for HowManyOfMe.co
 * Supports Unicode names, apostrophes, and hyphenated names.
 */

export interface NormalizedName {
  display: string;      // Canonical display title-cased name (e.g., "José", "Anne-Marie", "O'Connor")
  slug: string;         // Canonical URL slug for routing (e.g., "James", "Anne-Marie")
  lowerSlug: string;    // Lowercase slug for case-insensitive matching (e.g., "josé", "anne-marie")
  asciiClean: string;   // Accent-stripped ASCII name (e.g., "Jose", "OConnor")
  canonicalUrl: string; // Full canonical URL
}

const SITE_URL = "https://howmanyofme.co";

/**
 * Formats a name string into proper title casing, preserving internal hyphens and apostrophes.
 */
function formatTitleCase(str: string): string {
  // Split on word boundaries or hyphens/apostrophes
  return str
    .toLowerCase()
    .replace(/(?:^|[\s\-'’])\p{L}/gu, (match) => match.toUpperCase());
}

/**
 * Normalizes any raw name string into canonical display and slug formats.
 */
export function normalizeName(raw: string): NormalizedName {
  if (!raw || typeof raw !== "string") {
    return {
      display: "",
      slug: "",
      lowerSlug: "",
      asciiClean: "",
      canonicalUrl: `${SITE_URL}/`,
    };
  }

  let decoded = "";
  try {
    decoded = decodeURIComponent(raw).trim();
  } catch {
    decoded = raw.trim();
  }

  // Remove disallowed characters but preserve Unicode letters, hyphens, and apostrophes
  const cleaned = decoded
    .replace(/[^\p{L}\-'’\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return {
      display: "",
      slug: "",
      lowerSlug: "",
      asciiClean: "",
      canonicalUrl: `${SITE_URL}/`,
    };
  }

  const display = formatTitleCase(cleaned);
  const lowerSlug = display.toLowerCase();

  // ASCII clean representation (accents removed)
  const asciiClean = display
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z\-']/g, "");

  // URL slug (preserve clean titlecase or ASCII)
  const slug = display;
  const canonicalUrl = `${SITE_URL}/name/${encodeURIComponent(slug)}`;

  return {
    display,
    slug,
    lowerSlug,
    asciiClean,
    canonicalUrl,
  };
}
