// Hybrid gender detection.
// 1) Dataset match (highest confidence)
// 2) Suffix heuristics (medium)
// 3) Fallback "unisex" (low)

import { getNameData } from "@/data/nameData";

export type Gender = "male" | "female" | "unisex";

export interface GenderResult {
  gender: Gender;
  confidence: number; // 0..1
  source: "dataset" | "heuristic" | "fallback";
}

const FEMALE_SUFFIXES = ["a", "ah", "ya", "ia", "ina", "elle", "ette", "een", "i"];
const MALE_SUFFIXES = ["an", "en", "ar", "er", "it", "esh", "us", "os", "or", "on"];

export function detectGender(name: string): GenderResult {
  if (!name) return { gender: "unisex", confidence: 0, source: "fallback" };

  // 1) Dataset
  try {
    const data = getNameData(name);
    // getNameData always returns *something*, but it returns a real
    // entry for known names. We treat known dataset entries as high-confidence.
    // Heuristic: if rank is small (<10000) we trust it.
    if (data && data.rank < 10000) {
      return { gender: data.gender as Gender, confidence: 0.95, source: "dataset" };
    }
  } catch {
    /* ignore */
  }

  // 2) Suffix heuristics
  const lower = name.toLowerCase();
  const femaleHit = FEMALE_SUFFIXES.find((s) => lower.endsWith(s));
  const maleHit = MALE_SUFFIXES.find((s) => lower.endsWith(s));

  if (femaleHit && !maleHit) {
    return { gender: "female", confidence: 0.7, source: "heuristic" };
  }
  if (maleHit && !femaleHit) {
    return { gender: "male", confidence: 0.7, source: "heuristic" };
  }

  // 3) Fallback
  return { gender: "unisex", confidence: 0.3, source: "fallback" };
}
