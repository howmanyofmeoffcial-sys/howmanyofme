/**
 * Multi-Signal Name Similarity Engine for HowManyOfMe.co
 * Deterministically computes phonetic, orthographic, etymological, and demographic
 * similarity between first names with verifiable, data-backed matching signals.
 */

import canonicalNamesList from "../../data/generated/canonical-names.json" with { type: "json" };
import { normalizeName } from "./normalizeName.ts";
import type { NameRecord } from "./getName.ts";

const ALL_CANONICAL_RECORDS = canonicalNamesList as unknown as NameRecord[];

export interface SimilarNameMatch {
  name: string;
  score: number; // 0 to 100
  signals: string[];
  rank: number;
  estimatedLiving: number;
  origin: string;
  meaning: string;
  gender: string;
}

export interface SimilarNamesOutput {
  name: string;
  targetRecord: NameRecord | null;
  phonetic: SimilarNameMatch[];
  sharedOrigin: SimilarNameMatch[];
  popularTier: SimilarNameMatch[];
  combined: SimilarNameMatch[];
  topSignals: string[];
  startsWith: string[];
  sameLength: string[];
  rhyme: string[];
}

/**
 * Standard Soundex algorithm for phonetic indexing.
 */
export function soundex(s: string): string {
  if (!s) return "";
  const a = s.toLowerCase().split("");
  const first = a[0].toUpperCase();
  const codes: Record<string, string> = {
    b: "1", f: "1", p: "1", v: "1",
    c: "2", g: "2", j: "2", k: "2", q: "2", s: "2", x: "2", z: "2",
    d: "3", t: "3",
    l: "4",
    m: "5", n: "5",
    r: "6",
  };
  const res = [first];
  let prev = codes[a[0]] || "0";
  for (let i = 1; i < a.length; i++) {
    const code = codes[a[i]] || "0";
    if (code !== "0" && code !== prev) {
      res.push(code);
    }
    prev = code;
  }
  return (res.join("") + "000").slice(0, 4);
}

/**
 * Levenshtein distance calculation for string orthographic edit distance.
 */
export function lev(a: string, b: string): number {
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

/**
 * Syllable heuristic counter for rhythmic similarity.
 */
export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/(?:[^laeiouy]|ed|es|e)$/, "").replace(/^y/, "");
  const matches = w.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Computes multi-signal similar names for a target name entity.
 */
export function getSimilarNames(
  targetInput: string | NameRecord,
  limit = 12,
  recordsList: NameRecord[] = ALL_CANONICAL_RECORDS
): SimilarNamesOutput {
  let targetRecord: NameRecord | null = null;
  let targetName = "";

  if (typeof targetInput === "object" && targetInput !== null) {
    targetRecord = targetInput;
    targetName = targetInput.name;
  } else {
    targetName = normalizeName(typeof targetInput === "string" ? targetInput : "").display;
    targetRecord = recordsList.find((r) => r.name.toLowerCase() === targetName.toLowerCase()) || null;
  }

  const tLower = targetName.toLowerCase();
  const tSoundex = soundex(targetName);
  const tSyllables = countSyllables(targetName);
  const tLen = targetName.length;
  const tOrigin = targetRecord?.origin?.trim() || "";
  const tGender = targetRecord?.gender || "unisex";
  const tRank = targetRecord?.rank || 500;
  const tPeak = targetRecord?.ssa?.peakYear || 1980;

  const candidateMatches: SimilarNameMatch[] = [];

  for (const c of recordsList) {
    if (c.name.toLowerCase() === tLower) continue;

    const cName = c.name;
    const cLower = cName.toLowerCase();
    const cLen = cName.length;
    const cSoundex = soundex(cName);
    const cSyllables = countSyllables(cName);
    const cOrigin = c.origin?.trim() || "";
    const cGender = c.gender || "unisex";
    const cRank = c.rank || 500;
    const cPeak = c.ssa?.peakYear || 1980;
    const cLiving = c.actuarial?.estimatedLiving || Math.round(c.count * 0.65);

    let score = 0;
    const signals: string[] = [];

    const d = lev(tLower, cLower);
    const maxLen = Math.max(tLen, cLen);

    // 1. Edit distance & spelling
    if (d === 1) {
      score += 45;
      signals.push("1-letter spelling variation");
    } else if (d === 2) {
      score += 35;
      signals.push("Phonetic soundalike (2-letter edit distance)");
    } else if (d === 3 && maxLen >= 6) {
      score += 20;
      signals.push("Similar length and character structure");
    }

    // 2. Soundex root
    if (tSoundex === cSoundex) {
      score += 25;
      signals.push("Shared phonetic consonant frame");
    }

    // 3. Shared prefix / suffix
    if (tLower.length >= 3 && cLower.length >= 3 && tLower.slice(0, 3) === cLower.slice(0, 3)) {
      score += 20;
      signals.push(`Shared 3-letter prefix '${targetName.slice(0, 3)}'`);
    } else if (tLower.length >= 2 && cLower.length >= 2 && tLower.slice(0, 2) === cLower.slice(0, 2)) {
      score += 15;
      signals.push(`Matching prefix '${targetName.slice(0, 2)}'`);
    } else if (tLower.charAt(0) === cLower.charAt(0)) {
      score += 5;
      signals.push(`Same starting letter '${targetName.charAt(0)}'`);
    }

    if (tLen >= 3 && cLen >= 3 && tLower.slice(-2) === cLower.slice(-2)) {
      score += 15;
      signals.push(`Matching suffix '-${tLower.slice(-2)}'`);
    }

    // 4. Syllable cadence
    if (tSyllables === cSyllables) {
      score += 5;
      signals.push(`Matching ${tSyllables}-syllable rhythm`);
    }

    // 5. Cultural origin
    if (tOrigin && cOrigin && tOrigin !== "Unspecified" && cOrigin !== "Unspecified" && tOrigin.toLowerCase() === cOrigin.toLowerCase()) {
      score += 15;
      signals.push(`Shared cultural origin (${tOrigin})`);
    }

    // 6. Gender compatibility
    if (tGender === cGender && tGender !== "unisex") {
      score += 5;
      signals.push(`Matching gender usage (${tGender})`);
    }

    // 7. Popularity tier proximity
    if (Math.abs(tRank - cRank) <= 100) {
      score += 15;
      signals.push(`Comparable national popularity (Rank #${cRank} vs #${tRank})`);
    } else if (Math.abs(tRank - cRank) <= 250) {
      score += 8;
      signals.push(`Similar popularity tier (Top ${Math.max(tRank, cRank) <= 250 ? "250" : "500"})`);
    }

    // 8. Historical era alignment
    if (Math.abs(tPeak - cPeak) <= 10) {
      score += 5;
      signals.push(`Similar historical peak era (~${cPeak})`);
    }

    if (score >= 25 && signals.length >= 1) {
      candidateMatches.push({
        name: cName,
        score: Math.min(100, score),
        signals,
        rank: cRank,
        estimatedLiving: cLiving,
        origin: cOrigin || "Traditional",
        meaning: c.meaning || "Demographic name record",
        gender: cGender,
      });
    }
  }

  candidateMatches.sort((a, b) => b.score - a.score);

  // Group by specialized sub-categories
  const phonetic = candidateMatches
    .filter((m) => m.signals.some((s) => s.includes("spelling") || s.includes("soundalike") || s.includes("phonetic") || s.includes("prefix") || s.includes("suffix")))
    .slice(0, 8);

  const sharedOrigin = candidateMatches
    .filter((m) => m.signals.some((s) => s.includes("Shared cultural origin")))
    .slice(0, 8);

  const popularTier = candidateMatches
    .filter((m) => m.signals.some((s) => s.includes("popularity") || s.includes("peak era")))
    .slice(0, 8);

  // De-duplicate top combined recommendations
  const seen = new Set<string>();
  const combined: SimilarNameMatch[] = [];

  for (const m of candidateMatches) {
    if (!seen.has(m.name.toLowerCase())) {
      seen.add(m.name.toLowerCase());
      combined.push(m);
      if (combined.length >= limit) break;
    }
  }

  const startsWith = recordsList
    .filter((c) => c.name.toLowerCase() !== tLower && c.name.toLowerCase().startsWith(tLower.charAt(0)))
    .slice(0, 8)
    .map((c) => c.name);

  const sameLength = recordsList
    .filter((c) => c.name.toLowerCase() !== tLower && c.name.length === tLen)
    .slice(0, 8)
    .map((c) => c.name);

  const rhyme = candidateMatches
    .filter((m) => m.signals.some((s) => s.includes("suffix") || s.includes("spelling")))
    .slice(0, 8)
    .map((m) => m.name);

  // Extract top overarching signals
  const signalFrequency: Record<string, number> = {};
  for (const m of combined) {
    for (const s of m.signals) {
      signalFrequency[s] = (signalFrequency[s] || 0) + 1;
    }
  }
  const topSignals = Object.entries(signalFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([s]) => s);

  return {
    name: targetName,
    targetRecord,
    phonetic,
    sharedOrigin,
    popularTier,
    combined,
    topSignals,
    startsWith,
    sameLength,
    rhyme,
  };
}
