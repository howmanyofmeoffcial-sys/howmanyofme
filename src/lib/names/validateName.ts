import { normalizeName } from "./normalizeName";

export interface ValidationResult {
  isValid: boolean;
  normalized?: string;
  reason?: string;
}

const ONLY_LETTERS = /^[A-Za-z]+$/;
const SPAM_PATTERNS = [/(.)\1{3,}/i, /^(.{1,3})\1{2,}$/i]; // e.g. aaaa, xyzxyzxyz

/**
 * Validates a single name input against structural and anti-spam rules.
 */
export function validateName(raw: string): ValidationResult {
  if (!raw || typeof raw !== "string") {
    return { isValid: false, reason: "Name cannot be empty" };
  }

  const trimmed = decodeURIComponent(raw).trim();
  if (!trimmed) {
    return { isValid: false, reason: "Name cannot be empty" };
  }

  if (/\s/.test(trimmed)) {
    return { isValid: false, reason: "Single name only (no spaces)" };
  }

  if (trimmed.length < 2) {
    return { isValid: false, reason: "Name must be at least 2 characters" };
  }

  if (trimmed.length > 20) {
    return { isValid: false, reason: "Name must be 20 characters or fewer" };
  }

  if (!ONLY_LETTERS.test(trimmed)) {
    return { isValid: false, reason: "Letters only (A–Z)" };
  }

  if (SPAM_PATTERNS.some((re) => re.test(trimmed))) {
    return { isValid: false, reason: "Invalid name pattern" };
  }

  if (!/[aeiouy]/i.test(trimmed)) {
    return { isValid: false, reason: "Name must contain at least one vowel" };
  }

  const normalized = normalizeName(trimmed).display;
  return { isValid: true, normalized };
}
