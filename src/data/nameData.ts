import namesIndex from "./generated/names-index.json";
import canonicalNamesList from "./generated/canonical-names.json";
import { normalizeName } from "../lib/names/normalizeName";
import { validateName } from "../lib/names/validateName";

export interface NameRecordData {
  name: string;
  count: number;
  gender: "male" | "female" | "unisex";
  rank: number;
  regions: Record<string, number>;
  decade_popularity: Record<string, number>;
  origin: string;
  meaning: string;
  ssa?: {
    totalBirths: number;
    maleBirths: number;
    femaleBirths: number;
    firstYear: number;
    lastYear: number;
    peakYear: number;
    peakYearBirths: number;
    recentBirths: number;
    recentWindow: string;
  };
  census2020?: {
    count: number;
    rank: number;
    pctMale: number;
    pctFemale: number;
    sourceYear: number;
  } | null;
  sources?: string[];
}

const INDEX_MAP = namesIndex as unknown as Record<string, NameRecordData>;
const ALL_NAMES = canonicalNamesList as unknown as NameRecordData[];

export const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export function getNameData(name: string): NameRecordData {
  if (!name || typeof name !== "string") {
    return {
      name: "",
      count: 0,
      gender: "unisex",
      rank: 0,
      regions: {},
      decade_popularity: {},
      origin: "",
      meaning: "",
      sources: ["none"],
    };
  }

  const validation = validateName(name);
  const normalizedDisplay = validation.normalized || normalizeName(name).display;
  const key = normalizedDisplay.toLowerCase();
  const found = INDEX_MAP[key];

  if (found) {
    return {
      ...found,
      regions: found.regions || { "United States": found.count },
    };
  }

  // Non-fabricated safe return for unindexed queries
  return {
    name: normalizedDisplay,
    count: 0,
    gender: "unisex",
    rank: 0,
    regions: { "United States": 0 },
    decade_popularity: {},
    origin: "",
    meaning: "",
    sources: ["derived-estimate"],
  };
}

export function getNamesForLetter(letter: string): string[] {
  const l = letter.toLowerCase();
  return ALL_NAMES.filter((n) => n.name.toLowerCase().startsWith(l)).map((n) => n.name);
}

export function searchNames(query: string): string[] {
  if (!query) return [];
  const q = query.toLowerCase();
  return ALL_NAMES.filter((n) => n.name.toLowerCase().includes(q)).map((n) => n.name).slice(0, 20);
}

export function getPopularNames(): NameRecordData[] {
  return ALL_NAMES.slice(0, 20);
}

export function getSimilarNames(name: string): string[] {
  const letter = name.charAt(0).toLowerCase();
  const names = getNamesForLetter(letter);
  return names.filter((n) => n.toLowerCase() !== name.toLowerCase()).slice(0, 10);
}

export function formatNumber(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return num.toLocaleString("en-US");
}
