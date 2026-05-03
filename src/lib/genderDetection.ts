// US-first hybrid gender detection.
//
// Priority:
//   1. Hard override list (zero ambiguity for anchor names)
//   2. US SSA ratio dataset (90–100% confidence)
//   3. Existing global dataset via getNameData (70–85%)
//   4. Western suffix heuristics (40–60%)
//   5. Fallback "unisex" (low)
//
// Decision rules on the US dataset:
//   male_ratio   >= 0.80 → male
//   female_ratio >= 0.80 → female
//   both 0.40..0.60      → unisex
//   else                 → dominant gender (medium-high confidence)
//
// Strict unisex control: a name is only labeled unisex when truly balanced
// (40–60% split) OR final confidence < 60%.

import { getNameData } from "@/data/nameData";
import { US_SSA_GENDER, GENDER_OVERRIDES } from "@/data/usSSAGender";

export type Gender = "male" | "female" | "unisex";

export interface GenderResult {
  name: string;
  gender: Gender;
  confidence: number; // 0..100 (integer, US-style)
  source: "override" | "US_SSA" | "global_dataset" | "heuristic" | "fallback";
  ratios?: { male: number; female: number };
}

// Tier-1-style Western patterns. Kept conservative to avoid Indian-name bias.
const FEMALE_SUFFIXES = ["a", "ie", "y", "elle", "lyn", "ah", "ette", "een", "ine"];
const MALE_SUFFIXES = ["son", "ton", "er", "us", "an", "ld", "rd", "rt"];

function classifyByRatio(m: number, f: number): { gender: Gender; confidence: number; ratios: { male: number; female: number } } {
  const total = Math.max(1, m + f);
  const male = m / total;
  const female = f / total;
  const ratios = { male, female };

  if (male >= 0.8) return { gender: "male", confidence: Math.round(90 + male * 10), ratios };
  if (female >= 0.8) return { gender: "female", confidence: Math.round(90 + female * 10), ratios };
  if (male >= 0.4 && male <= 0.6) return { gender: "unisex", confidence: 88, ratios };
  // dominant but not overwhelming
  if (male > female) return { gender: "male", confidence: Math.round(60 + male * 30), ratios };
  return { gender: "female", confidence: Math.round(60 + female * 30), ratios };
}

export function detectGender(rawName: string): GenderResult {
  const name = (rawName || "").trim();
  if (!name) return { name, gender: "unisex", confidence: 0, source: "fallback" };

  const lower = name.toLowerCase();
  const display = lower.charAt(0).toUpperCase() + lower.slice(1);

  // 1) Override list
  if (GENDER_OVERRIDES[lower]) {
    return { name: display, gender: GENDER_OVERRIDES[lower], confidence: 99, source: "override" };
  }

  // 2) US SSA ratio dataset
  const ssa = US_SSA_GENDER[lower];
  if (ssa) {
    const { gender, confidence, ratios } = classifyByRatio(ssa.m, ssa.f);
    return { name: display, gender, confidence, source: "US_SSA", ratios };
  }

  // 3) Global dataset (existing)
  try {
    const data = getNameData(display);
    if (data && data.rank < 10000) {
      // Existing dataset already reports a single gender, no ratio.
      // Treat as medium-high confidence.
      return {
        name: display,
        gender: data.gender as Gender,
        confidence: 80,
        source: "global_dataset",
      };
    }
  } catch {
    /* ignore */
  }

  // 4) Western suffix heuristics — low priority
  const femaleHit = FEMALE_SUFFIXES.find((s) => lower.endsWith(s));
  const maleHit = MALE_SUFFIXES.find((s) => lower.endsWith(s));
  if (femaleHit && !maleHit) {
    return { name: display, gender: "female", confidence: 55, source: "heuristic" };
  }
  if (maleHit && !femaleHit) {
    return { name: display, gender: "male", confidence: 55, source: "heuristic" };
  }

  // 5) Fallback
  return { name: display, gender: "unisex", confidence: 40, source: "fallback" };
}

// Convenience formatter matching the spec output shape.
export function formatGenderResult(name: string) {
  const r = detectGender(name);
  return {
    name: r.name,
    gender: r.gender === "male" ? "Male" : r.gender === "female" ? "Female" : "Unisex",
    confidence: r.confidence,
    source: r.source,
  };
}

// ---------------------------------------------------------------------------
// Async detection via secure Vercel serverless proxy (/api/gender-detect).
// The proxy holds GENDERIZE_API_KEY server-side. If the proxy is unavailable
// (local dev without the function, missing key, quota, network error), we
// silently fall back to the local heuristic `detectGender` above.
// ---------------------------------------------------------------------------

interface ProxyResponse {
  name: string;
  gender: "male" | "female" | null;
  probability: number;
  count: number;
  country?: string | null;
  source?: string;
  error?: string;
  fallback?: boolean;
}

const proxyCache = new Map<string, GenderResult>();

export async function detectGenderAsync(
  rawName: string,
  country?: string
): Promise<GenderResult> {
  const name = (rawName || "").trim();
  if (!name) return { name, gender: "unisex", confidence: 0, source: "fallback" };

  const cacheKey = `${name.toLowerCase()}|${country ?? ""}`;
  const cached = proxyCache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch("/api/gender-detect", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, country }),
    });

    if (!res.ok) throw new Error(`proxy ${res.status}`);

    const data = (await res.json()) as ProxyResponse;
    if (data.fallback || !data.gender) throw new Error("no upstream gender");

    const display = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const result: GenderResult = {
      name: display,
      gender: data.gender, // "male" | "female"
      confidence: Math.round((data.probability ?? 0) * 100),
      source: "global_dataset", // reuse existing union; treated as authoritative
    };
    proxyCache.set(cacheKey, result);
    return result;
  } catch {
    // Silent fallback to local heuristic detection.
    const local = detectGender(name);
    proxyCache.set(cacheKey, local);
    return local;
  }
}

