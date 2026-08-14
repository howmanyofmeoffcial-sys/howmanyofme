// Lightweight prefetch helper for gender results.
// Used on hover/scroll-near events so navigation feels instant.

import { detectGenderAsync, getCachedGender } from "./genderDetection";

const inflight = new Set<string>();

export function prefetchGender(name: string, country?: string) {
  const trimmed = (name || "").trim();
  if (!trimmed) return;
  const key = `${trimmed.toLowerCase()}|${(country || "").toUpperCase()}`;
  if (inflight.has(key)) return;
  if (getCachedGender(trimmed, country)) return;
  inflight.add(key);
  detectGenderAsync(trimmed, country).finally(() => inflight.delete(key));
}
