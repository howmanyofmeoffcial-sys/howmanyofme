import { normalizeName } from "./normalizeName.ts";

export interface ValidationResult {
  isValid: boolean;
  normalized?: string;
  reason?: string;
}

// Support Unicode letters, hyphens, and apostrophes
const VALID_NAME_REGEX = /^[\p{L}]+(?:[\-'’][\p{L}]+)*$/u;
const SPAM_PATTERNS = [/(.)\1{3,}/iu, /^(.{1,3})\1{3,}$/iu]; // e.g. aaaa, xyzxyzxyzxyz
const URL_PATTERN = /(?:https?:\/\/|www\.|\.com|\.org|\.net|\.xyz|\.io)/i;

/**
 * Validates a single name input against structural, Unicode, and anti-spam rules.
 */
export function validateName(raw: string): ValidationResult {
  if (!raw || typeof raw !== "string") {
    return { isValid: false, reason: "Name cannot be empty" };
  }

  let trimmed = "";
  try {
    trimmed = decodeURIComponent(raw).trim();
  } catch {
    trimmed = raw.trim();
  }

  if (!trimmed) {
    return { isValid: false, reason: "Name cannot be empty" };
  }

  if (URL_PATTERN.test(trimmed)) {
    return { isValid: false, reason: "URLs and web links are not valid names" };
  }

  if (/\d/.test(trimmed)) {
    return { isValid: false, reason: "Names cannot contain numbers" };
  }

  if (trimmed.length < 2) {
    return { isValid: false, reason: "Name must be at least 2 characters" };
  }

  if (trimmed.length > 30) {
    return { isValid: false, reason: "Name must be 30 characters or fewer" };
  }

  if (!VALID_NAME_REGEX.test(trimmed)) {
    return { isValid: false, reason: "Please enter valid letters (including international characters, hyphens, and apostrophes)" };
  }

  if (SPAM_PATTERNS.some((re) => re.test(trimmed))) {
    return { isValid: false, reason: "Invalid repetitive name pattern" };
  }

  const normalized = normalizeName(trimmed).display;
  return { isValid: true, normalized };
}
