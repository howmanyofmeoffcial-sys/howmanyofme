// Single-name input validation utilities.
// Rules: A–Z only, 2–20 chars, no spaces, single token.

export type NameValidation =
  | { ok: true; value: string }
  | { ok: false; reason: string };

const ONLY_LETTERS = /^[A-Za-z]+$/;
const SPAM_PATTERNS = [/(.)\1{3,}/i, /^(.{1,3})\1{2,}$/i]; // aaaa, xyzxyzxyz, etc.

export function validateSingleName(raw: string): NameValidation {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, reason: "Please enter a name" };

  // Multiple words / spaces inside
  if (/\s/.test(trimmed)) {
    return { ok: false, reason: "Please enter first or last name only" };
  }
  if (trimmed.length < 2) return { ok: false, reason: "Name must be at least 2 characters" };
  if (trimmed.length > 20) return { ok: false, reason: "Name must be 20 characters or fewer" };
  if (!ONLY_LETTERS.test(trimmed)) {
    return { ok: false, reason: "Use letters only (A–Z)" };
  }
  if (SPAM_PATTERNS.some((re) => re.test(trimmed))) {
    return { ok: false, reason: "This doesn't look like a real name" };
  }
  // Normalize: capital first, rest lower
  const normalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  return { ok: true, value: normalized };
}

// Lightweight "looks like a real name" check used by the report layer.
// Names not in our dataset are still allowed (we generate stats), but we flag
// obvious junk strings so we can surface a soft warning.
export function looksLikeRealName(name: string): boolean {
  if (!ONLY_LETTERS.test(name)) return false;
  if (name.length < 2 || name.length > 20) return false;
  if (SPAM_PATTERNS.some((re) => re.test(name))) return false;
  // Must have at least one vowel — almost all real names do.
  if (!/[aeiouy]/i.test(name)) return false;
  return true;
}
