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
  source: "override" | "US_SSA" | "global_dataset" | "heuristic" | "genderize" | "fallback";
  ratios?: { male: number; female: number };
}

type GenderizeApiResult = {
  ok?: boolean;
  fallback?: boolean;
  name?: string;
  gender?: Gender;
  confidence?: number;
  source?: "genderize";
};

function isApiGender(value: unknown): value is "male" | "female" {
  return value === "male" || value === "female";
}

// Tier-1-style Western patterns. Kept conservative to avoid Indian-name bias.
const FEMALE_SUFFIXES = ["a", "ie", "y", "elle", "lyn", "ah", "ette", "een", "ine"];
const MALE_SUFFIXES = ["son", "ton", "er", "us", "an", "ld", "rd", "rt"];
const CLIENT_TIMEOUT_MS = 900;

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

// In-memory cache keyed by `${nameLower}|${country||""}`. Survives SPA navigation.
const genderCache = new Map<string, GenderResult>();

function cacheKey(name: string, country?: string) {
  return `${name.trim().toLowerCase()}|${(country || "").toUpperCase()}`;
}

export function getCachedGender(name: string, country?: string): GenderResult | undefined {
  return genderCache.get(cacheKey(name, country));
}

export async function detectGenderAsync(rawName: string, country?: string): Promise<GenderResult> {
  const localResult = detectGender(rawName);
  const name = (rawName || "").trim();

  if (!name || typeof fetch !== "function") return localResult;

  const key = cacheKey(name, country);
  const cached = genderCache.get(key);
  if (cached) return cached;

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  try {
    const response = await fetch("/api/gender-detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, country }),
      signal: controller.signal,
    });

    if (!response.ok) {
      genderCache.set(key, localResult);
      return localResult;
    }

    let data: GenderizeApiResult;
    try {
      data = (await response.json()) as GenderizeApiResult;
    } catch {
      genderCache.set(key, localResult);
      return localResult;
    }

    if (data.fallback || data.ok !== true || !isApiGender(data.gender)) {
      genderCache.set(key, localResult);
      return localResult;
    }

    const confidence = typeof data.confidence === "number" ? Math.round(data.confidence) : 0;
    if (confidence <= 0) {
      genderCache.set(key, localResult);
      return localResult;
    }

    const result: GenderResult = {
      name: data.name || localResult.name,
      gender: data.gender,
      confidence: Math.max(1, Math.min(100, confidence)),
      source: "genderize",
    };
    genderCache.set(key, result);
    return result;
  } catch {
    return localResult;
  } finally {
    globalThis.clearTimeout(timeout);
  }
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
