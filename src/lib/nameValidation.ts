// Single-name input validation utilities.
// Supports Unicode characters, hyphens, and apostrophes.

export type NameValidation =
  | { ok: true; value: string }
  | { ok: false; reason: string };

const VALID_NAME_REGEX = /^[\p{L}]+(?:[\-'’][\p{L}]+)*$/u;
const SPAM_PATTERNS = [/(.)\1{3,}/iu, /^(.{1,3})\1{3,}$/iu];
const URL_PATTERN = /(?:https?:\/\/|www\.|\.com|\.org|\.net|\.xyz|\.io)/i;

export function validateSingleName(raw: string): NameValidation {
  if (!raw || typeof raw !== "string") {
    return { ok: false, reason: "Please enter a name" };
  }

  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, reason: "Please enter a name" };

  if (URL_PATTERN.test(trimmed)) {
    return { ok: false, reason: "URLs are not valid names" };
  }

  if (/\d/.test(trimmed)) {
    return { ok: false, reason: "Names cannot contain numbers" };
  }

  // Multiple words / spaces inside
  if (/\s/.test(trimmed)) {
    return { ok: false, reason: "Please enter first or last name only" };
  }

  if (trimmed.length < 2) return { ok: false, reason: "Name must be at least 2 characters" };
  if (trimmed.length > 30) return { ok: false, reason: "Name must be 30 characters or fewer" };

  if (!VALID_NAME_REGEX.test(trimmed)) {
    return { ok: false, reason: "Please enter valid letters (including international characters, hyphens, and apostrophes)" };
  }

  if (SPAM_PATTERNS.some((re) => re.test(trimmed))) {
    return { ok: false, reason: "This doesn't look like a real name" };
  }

  // Normalize: capital first, rest lower (preserve internal hyphens/apostrophes)
  const normalized = trimmed.toLowerCase().replace(/(?:^|[\s\-'’])\p{L}/gu, (m) => m.toUpperCase());
  return { ok: true, value: normalized };
}

// Lightweight "looks like a real name" check used by the report layer.
export function looksLikeRealName(name: string): boolean {
  if (!name || typeof name !== "string") return false;
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 30) return false;
  if (/\d/.test(trimmed)) return false;
  if (URL_PATTERN.test(trimmed)) return false;
  if (!VALID_NAME_REGEX.test(trimmed)) return false;
  if (SPAM_PATTERNS.some((re) => re.test(trimmed))) return false;
  return true;
}
