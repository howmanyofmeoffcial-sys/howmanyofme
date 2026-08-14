/**
 * Canonical Name Normalization & Slug Generation
 * Phase 10 Data Infrastructure
 */

/**
 * Normalizes an input string to canonical display casing (Title Case)
 * and generates a deterministic URL slug.
 */
export function normalizeName(raw) {
  if (!raw || typeof raw !== "string") {
    return { display: "", normalized: "", slug: "" };
  }

  // 1. Trim and collapse internal whitespace
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) {
    return { display: "", normalized: "", slug: "" };
  }

  // 2. Unicode normalization (NFC for display, NFD for slug stripping)
  const nfc = trimmed.normalize("NFC");

  // 3. Display name: First letter uppercase, rest lowercase per token
  const display = nfc
    .split(/[\s-]+/)
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : ""))
    .join(" ");

  // 4. Normalized key for indexing (lowercased, trimmed)
  const normalized = nfc.toLowerCase();

  // 5. URL Slug: Preserve TitleCase for /name/[name] routing in HowManyOfMe
  const slug = display;
  const lowerSlug = normalized;

  return { display, normalized, slug, lowerSlug };
}

/**
 * Validates whether a raw name string conforms to naming constraints.
 */
export function isStandardName(raw) {
  if (!raw || typeof raw !== "string") return false;
  const trimmed = raw.trim();
  if (trimmed.length < 2 || trimmed.length > 50) return false;
  // Allow letters, accented characters, hyphens, and apostrophes
  return /^[\p{L}'-]+$/u.test(trimmed);
}
