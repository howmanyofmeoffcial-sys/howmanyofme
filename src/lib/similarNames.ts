// Similar-name engine. Pure data — works for any name (programmatic SEO).

import { getNameData, getNamesForLetter } from "@/data/nameData";

const ALL_NAMES_CACHE: string[] = [];

function getAllNames(): string[] {
  if (ALL_NAMES_CACHE.length) return ALL_NAMES_CACHE;
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  letters.forEach((l) => ALL_NAMES_CACHE.push(...getNamesForLetter(l)));
  return ALL_NAMES_CACHE;
}

// Levenshtein distance — small + fast for short strings.
function lev(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export interface SimilarNamesResult {
  query: string;
  display: string;
  startsWith: string[];
  sameLength: string[];
  phonetic: string[];   // edit-distance ≤ 2
  combined: string[];   // de-duplicated, ranked
}

export function getSimilarNamesFor(rawName: string, limit = 24): SimilarNamesResult {
  const name = (rawName || "").trim();
  const display = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const lower = display.toLowerCase();
  const all = getAllNames();

  const startsWith = all
    .filter((n) => n.toLowerCase() !== lower && n.toLowerCase().startsWith(lower.charAt(0)))
    .slice(0, 30);

  const sameLength = all
    .filter((n) => n.toLowerCase() !== lower && n.length === display.length)
    .slice(0, 30);

  const phonetic = all
    .filter((n) => {
      const ln = n.toLowerCase();
      if (ln === lower) return false;
      const d = lev(ln, lower);
      return d > 0 && d <= 2;
    })
    .slice(0, 30);

  // Rank: phonetic > startsWith > sameLength
  const seen = new Set<string>([lower]);
  const combined: string[] = [];
  const push = (arr: string[]) => {
    for (const n of arr) {
      const k = n.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        combined.push(n);
        if (combined.length >= limit) return;
      }
    }
  };
  push(phonetic);
  push(startsWith);
  push(sameLength);

  return { query: name, display, startsWith, sameLength, phonetic, combined };
}

// Used by the index page + sitemap.
export function getAllIndexableNames(): string[] {
  return getAllNames();
}

// Lightweight context block used in the SEO content section.
export function getNameContext(name: string) {
  const data = getNameData(name);
  return {
    origin: data.origin,
    meaning: data.meaning,
    rank: data.rank,
    count: data.count,
  };
}
