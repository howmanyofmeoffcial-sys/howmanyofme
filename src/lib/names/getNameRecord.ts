import namesIndex from "../../data/generated/names-index.json" with { type: "json" };
import { normalizeName } from "./normalizeName.ts";
import { validateName } from "./validateName.ts";
import type { NameRecord } from "./getName.ts";

const INDEX_MAP = namesIndex as unknown as Record<string, NameRecord>;

// Create lookup map with lowercased and ASCII-normalized keys
const LOOKUP_MAP = new Map<string, NameRecord>();
for (const [key, record] of Object.entries(INDEX_MAP)) {
  LOOKUP_MAP.set(key.toLowerCase(), record);
  LOOKUP_MAP.set(record.name.toLowerCase(), record);
  if (record.slug) LOOKUP_MAP.set(record.slug.toLowerCase(), record);
  if (record.normalizedName) LOOKUP_MAP.set(record.normalizedName.toLowerCase(), record);
}

/**
 * Canonical Source-Backed First-Name Lookup
 * @param rawName Raw input name or slug
 * @returns Official NameRecord if present in canonical datasets, or null.
 * NEVER returns fabricated random numbers, ranks, or origins.
 */
export function getNameRecord(rawName: string): NameRecord | null {
  if (!rawName || typeof rawName !== "string") {
    return null;
  }

  const validation = validateName(rawName);
  if (!validation.isValid || !validation.normalized) {
    return null;
  }

  const normalized = normalizeName(validation.normalized);
  const found =
    LOOKUP_MAP.get(normalized.lowerSlug) ||
    LOOKUP_MAP.get(normalized.asciiClean.toLowerCase()) ||
    INDEX_MAP[normalized.lowerSlug] ||
    null;

  if (found) {
    return {
      ...found,
      regions: found.regions || { "United States": found.count },
      isCurated: found.rank <= 20,
    };
  }

  return null;
}
