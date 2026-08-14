import { getAllNames } from "./getAllNames";
import { normalizeName } from "./normalizeName";

// Levenshtein distance calculation
function lev(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export interface SimilarNamesOutput {
  name: string;
  phonetic: string[];   // edit-distance <= 2
  startsWith: string[]; // same first letter
  sameLength: string[]; // same character length
  combined: string[];   // de-duplicated top recommendations
}

/**
 * Computes similar names for server-rendered HTML internal links.
 */
export function getSimilarNames(targetName: string, limit = 10): SimilarNamesOutput {
  const norm = normalizeName(targetName).display;
  const lower = norm.toLowerCase();
  const all = getAllNames().map((r) => r.name);

  const startsWith = all
    .filter((n) => n.toLowerCase() !== lower && n.toLowerCase().startsWith(lower.charAt(0)))
    .slice(0, 20);

  const sameLength = all
    .filter((n) => n.toLowerCase() !== lower && n.length === norm.length)
    .slice(0, 20);

  const phonetic = all
    .filter((n) => {
      const ln = n.toLowerCase();
      if (ln === lower) return false;
      const d = lev(ln, lower);
      return d > 0 && d <= 2;
    })
    .slice(0, 20);

  // Priority ranking: phonetic > startsWith > sameLength
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

  return {
    name: norm,
    phonetic,
    startsWith,
    sameLength,
    combined,
  };
}
