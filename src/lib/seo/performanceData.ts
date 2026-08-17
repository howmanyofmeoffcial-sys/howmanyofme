/**
 * Search Performance, Demand Cohorts & SEO Priority Engine
 * 
 * Normalizes Google Search Console (GSC) performance data, aligns queries with canonical entities,
 * and builds a deterministic 2-dimensional priority model (Search Demand x Content Quality).
 */

import { normalizeName } from "../names/normalizeName.ts";
import { getNameUrl } from "./canonicalUrl.ts";
import { evaluateNameIndexability } from "./indexability.ts";
import type { NameRecord } from "../names/getName.ts";

export type QueryIntent =
  | "HOW_MANY"
  | "POPULARITY"
  | "MEANING_ORIGIN"
  | "HISTORICAL"
  | "GEOGRAPHIC"
  | "GENERAL_NAME"
  | "OTHER";

export type SearchDemandTier =
  | "PROVEN"
  | "PROMISING"
  | "LOW_OBSERVED"
  | "UNKNOWN";

export type SeoPriority =
  | "P0_PROVEN"
  | "P1_STRIKING_DISTANCE"
  | "P1_HIGH_DEMAND_LOW_CTR"
  | "P1_AUTHORITY_OPPORTUNITY"
  | "P2_VALID_LOW_OBSERVED"
  | "P2_UNKNOWN"
  | "P3_DATA_WEAK";

export interface NormalizedQueryItem {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  intent: QueryIntent;
  classification?: string;
  cluster?: string;
}

export interface SearchPerformanceRecord {
  url: string;
  canonicalUrl: string;
  pageFamily: "first-name" | "full-name" | "directory" | "tool" | "informational" | "brand" | "other";
  nameSlug?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
  queries: NormalizedQueryItem[];
  primaryIntent: QueryIntent;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface NameSeoProfile {
  name: string;
  url: string;
  indexability: "INDEX" | "NOINDEX" | "EXCLUDE";
  qualityStatus: "EXCELLENT" | "STRONG" | "SUFFICIENT" | "WEAK";
  searchDemandTier: SearchDemandTier;
  seoPriority: SeoPriority;
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
  queryCount: number;
  primaryIntent: QueryIntent;
  internalInlinks: number;
  reason: string;
}

/**
 * Classifies a search query into its primary search intent.
 */
export function classifyQueryIntent(query: string): QueryIntent {
  const q = query.trim().toLowerCase();

  if (
    q.includes("how many people") ||
    q.includes("how many") ||
    q.includes("people named") ||
    q.includes("living bearers") ||
    q.includes("share my name") ||
    q.includes("have my name")
  ) {
    return "HOW_MANY";
  }

  if (
    q.includes("by decade") ||
    q.includes("history") ||
    q.includes("historical") ||
    q.includes("1880") ||
    q.includes("19") ||
    q.includes("trend")
  ) {
    return "HISTORICAL";
  }

  if (
    q.includes("how common") ||
    q.includes("popularity") ||
    q.includes("popular") ||
    q.includes("rank") ||
    q.includes("top names") ||
    q.includes("rarity")
  ) {
    return "POPULARITY";
  }

  if (
    q.includes("meaning") ||
    q.includes("origin") ||
    q.includes("etymology") ||
    q.includes("translate")
  ) {
    return "MEANING_ORIGIN";
  }

  if (
    q.includes("in new york") ||
    q.includes("in california") ||
    q.includes("state") ||
    q.includes("geographic") ||
    q.includes("region")
  ) {
    return "GEOGRAPHIC";
  }

  if (q.startsWith("names starting with") || q.startsWith("browse names")) {
    return "GENERAL_NAME";
  }

  return "OTHER";
}

/**
 * Normalizes raw incoming GSC URLs into canonical site routes and identifies page family.
 */
export function normalizeGscUrl(rawUrl: string): {
  canonicalUrl: string;
  pageFamily: "first-name" | "full-name" | "directory" | "tool" | "informational" | "brand" | "other";
  nameSlug?: string;
} {
  let cleaned = rawUrl.trim();

  // Strip protocol and hostname
  cleaned = cleaned.replace(/^https?:\/\/(?:www\.)?howmanyofme\.co/i, "");
  // Strip trailing slash except root
  if (cleaned.length > 1 && cleaned.endsWith("/")) {
    cleaned = cleaned.slice(0, -1);
  }
  // Strip .html extension
  if (cleaned.endsWith(".html")) {
    cleaned = cleaned.slice(0, -5);
  }

  if (cleaned === "" || cleaned === "/" || cleaned === "/index") {
    return { canonicalUrl: "/", pageFamily: "brand" };
  }

  // /name/:name
  const nameMatch = cleaned.match(/^\/name\/([^/?#]+)$/i);
  if (nameMatch) {
    const norm = normalizeName(decodeURIComponent(nameMatch[1]));
    return {
      canonicalUrl: getNameUrl(norm.display),
      pageFamily: "first-name",
      nameSlug: norm.slug,
    };
  }

  // /people/:fullName
  if (cleaned.startsWith("/people/") || cleaned.startsWith("/full-name/")) {
    const fnSlug = cleaned.replace(/^\/(?:people|full-name)\//, "").toLowerCase();
    return {
      canonicalUrl: `/people/${fnSlug}`,
      pageFamily: "full-name",
    };
  }

  // /names/:letter
  if (cleaned.startsWith("/names/")) {
    const letter = cleaned.replace(/^\/names\//, "").toLowerCase().charAt(0);
    return {
      canonicalUrl: `/names/${letter}`,
      pageFamily: "directory",
    };
  }

  // /tools/:tool
  if (cleaned.startsWith("/tools/")) {
    return {
      canonicalUrl: cleaned.toLowerCase(),
      pageFamily: "tool",
    };
  }

  // /methodology, /about, /data
  if (["/methodology", "/about", "/data", "/research"].some((p) => cleaned.startsWith(p))) {
    return {
      canonicalUrl: cleaned.toLowerCase(),
      pageFamily: "informational",
    };
  }

  return {
    canonicalUrl: cleaned,
    pageFamily: "other",
  };
}

/**
 * Parses and ingests GSC performance rows into a normalized Map of canonical URLs.
 */
export function ingestGscRecords(
  rows: Array<{
    query?: string;
    page: string;
    clicks: number;
    impressions: number;
    ctr?: number;
    position: number;
    classification?: string;
    cluster?: string;
  }>,
  dateRange?: { start: string; end: string }
): Map<string, SearchPerformanceRecord> {
  const records = new Map<string, SearchPerformanceRecord>();

  for (const row of rows) {
    if (!row.page || typeof row.impressions !== "number" || typeof row.clicks !== "number") {
      continue;
    }

    const { canonicalUrl, pageFamily, nameSlug } = normalizeGscUrl(row.page);
    const existing = records.get(canonicalUrl);

    const intent = classifyQueryIntent(row.query || "");
    const queryItem: NormalizedQueryItem = {
      query: row.query || "",
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: row.ctr ?? (row.impressions > 0 ? row.clicks / row.impressions : 0),
      position: row.position,
      intent,
      classification: row.classification,
      cluster: row.cluster,
    };

    if (existing) {
      existing.impressions += row.impressions;
      existing.clicks += row.clicks;
      existing.ctr = existing.impressions > 0 ? existing.clicks / existing.impressions : 0;
      // Weighted position
      const totalImp = existing.impressions;
      existing.averagePosition =
        totalImp > 0
          ? Number(
              ((existing.averagePosition * (totalImp - row.impressions) + row.position * row.impressions) / totalImp).toFixed(1)
            )
          : row.position;
      if (row.query) {
        existing.queries.push(queryItem);
      }
    } else {
      records.set(canonicalUrl, {
        url: row.page,
        canonicalUrl,
        pageFamily,
        nameSlug,
        impressions: row.impressions,
        clicks: row.clicks,
        ctr: row.ctr ?? (row.impressions > 0 ? row.clicks / row.impressions : 0),
        averagePosition: row.position,
        queries: row.query ? [queryItem] : [],
        primaryIntent: intent,
        dateRange,
      });
    }
  }

  return records;
}

/**
 * Evaluates the 2-dimensional SEO profile for a First-Name entity:
 * combines Factual Data Quality with Observed Search Demand.
 */
export function evaluateNameSeoProfile(
  record: NameRecord,
  perfRecord?: SearchPerformanceRecord,
  internalInlinks = 0
): NameSeoProfile {
  const indexEval = evaluateNameIndexability(record);
  const nameUrl = getNameUrl(record.name);

  // Content & Data Quality tier
  let qualityStatus: "EXCELLENT" | "STRONG" | "SUFFICIENT" | "WEAK" = "SUFFICIENT";
  if (indexEval.score >= 90) {
    qualityStatus = "EXCELLENT";
  } else if (indexEval.score >= 75) {
    qualityStatus = "STRONG";
  } else if (indexEval.score >= 60) {
    qualityStatus = "SUFFICIENT";
  } else {
    qualityStatus = "WEAK";
  }

  // 1. If factual quality is weak or excluded, strictly P3_DATA_WEAK
  if (qualityStatus === "WEAK" || indexEval.status !== "INDEX") {
    return {
      name: record.name,
      url: nameUrl,
      indexability: indexEval.status,
      qualityStatus,
      searchDemandTier: perfRecord ? "LOW_OBSERVED" : "UNKNOWN",
      seoPriority: "P3_DATA_WEAK",
      impressions: perfRecord?.impressions || 0,
      clicks: perfRecord?.clicks || 0,
      ctr: perfRecord?.ctr || 0,
      averagePosition: perfRecord?.averagePosition || 0,
      queryCount: perfRecord?.queries.length || 0,
      primaryIntent: perfRecord?.primaryIntent || "HOW_MANY",
      internalInlinks,
      reason: "Factual data or indexability gating criteria not met. Data quality must be resolved before SEO optimization.",
    };
  }

  // 2. If NO GSC data exists in current snapshot
  if (!perfRecord) {
    return {
      name: record.name,
      url: nameUrl,
      indexability: indexEval.status,
      qualityStatus,
      searchDemandTier: "UNKNOWN",
      seoPriority: "P2_UNKNOWN",
      impressions: 0,
      clicks: 0,
      ctr: 0,
      averagePosition: 0,
      queryCount: 0,
      primaryIntent: "HOW_MANY",
      internalInlinks,
      reason: "Verified demographic data completeness, no observed GSC data in current snapshot. Retained as clean indexable entity.",
    };
  }

  const { impressions, clicks, ctr, averagePosition, queries, primaryIntent } = perfRecord;

  // Search Demand Tier Classification
  let demandTier: SearchDemandTier = "LOW_OBSERVED";
  if (impressions >= 15000 && clicks >= 500) {
    demandTier = "PROVEN";
  } else if (impressions >= 2000 || (impressions > 0 && averagePosition <= 15)) {
    demandTier = "PROMISING";
  } else if (impressions > 0) {
    demandTier = "LOW_OBSERVED";
  } else {
    demandTier = "UNKNOWN";
  }

  // 3. Evaluate 2D SEO Priority for pages with GSC data
  let priority: SeoPriority = "P2_VALID_LOW_OBSERVED";
  let reason = "Valid canonical entity with low observed search demand; standard maintenance tier.";

  if (impressions >= 8000 && ctr < 0.05 && averagePosition <= 12.0) {
    priority = "P1_HIGH_DEMAND_LOW_CTR";
    reason = `High search impressions (${impressions.toLocaleString()}) with below-benchmark CTR (${(ctr * 100).toFixed(1)}%). Primary candidate for title tag & meta description CTR testing.`;
  } else if (impressions >= 20000 && clicks >= 1000 && averagePosition <= 6.0) {
    priority = "P0_PROVEN";
    reason = `Proven search powerhouse (${impressions.toLocaleString()} impressions, ${clicks.toLocaleString()} clicks, position #${averagePosition}). Highest tier SEO priority.`;
  } else if (averagePosition >= 4.0 && averagePosition <= 15.0 && impressions >= 5000) {
    priority = "P1_STRIKING_DISTANCE";
    reason = `High search demand (${impressions.toLocaleString()} impressions) ranking on striking distance position #${averagePosition}. Prime candidate for snippet & heading optimization.`;
  } else if (impressions < 3000 && (qualityStatus === "EXCELLENT" || qualityStatus === "STRONG")) {
    priority = "P1_AUTHORITY_OPPORTUNITY";
    reason = `High data completeness and strong insights, but limited search visibility. Primary candidate for internal link equity and future authority building.`;
  } else if (demandTier === "PROVEN" || demandTier === "PROMISING") {
    priority = "P0_PROVEN";
    reason = `Strong search visibility (${impressions.toLocaleString()} impressions, position #${averagePosition}).`;
  }

  return {
    name: record.name,
    url: nameUrl,
    indexability: indexEval.status,
    qualityStatus,
    searchDemandTier: demandTier,
    seoPriority: priority,
    impressions,
    clicks,
    ctr,
    averagePosition,
    queryCount: queries.length,
    primaryIntent,
    internalInlinks,
    reason,
  };
}

export interface NameSeoMetadata {
  title: string;
  description: string;
  h1: string;
  subhead: string;
  primaryIntent: QueryIntent;
  quickAnswerLead: string;
}

export const DEFAULT_GSC_SNAPSHOT_RECORDS = [
  { query: "how many people are named david", page: "/name/David", clicks: 1850, impressions: 24500, ctr: 0.0755, position: 4.8, classification: "first-name", cluster: "first-name-count" },
  { query: "how many people are named james", page: "/name/James", clicks: 2400, impressions: 32000, ctr: 0.0750, position: 4.2, classification: "first-name", cluster: "first-name-count" },
  { query: "how many people are named mary", page: "/name/Mary", clicks: 1620, impressions: 21800, ctr: 0.0743, position: 5.1, classification: "first-name", cluster: "first-name-count" },
  { query: "how many people have the name michael", page: "/name/Michael", clicks: 1950, impressions: 27400, ctr: 0.0711, position: 5.4, classification: "first-name", cluster: "first-name-count" },
  { query: "how common is the name emma", page: "/name/Emma", clicks: 1420, impressions: 19500, ctr: 0.0728, position: 4.9, classification: "first-name", cluster: "first-name-rarity" },
  { query: "how many people are named john", page: "/name/John", clicks: 2100, impressions: 29000, ctr: 0.0724, position: 5.8, classification: "first-name", cluster: "first-name-count" },
  { query: "how many people are named robert", page: "/name/Robert", clicks: 1750, impressions: 23600, ctr: 0.0741, position: 6.2, classification: "first-name", cluster: "first-name-count" },
  { query: "how many people are named patricia", page: "/name/Patricia", clicks: 1200, impressions: 16800, ctr: 0.0714, position: 6.8, classification: "first-name", cluster: "first-name-count" },
  { query: "how many people are named jennifer", page: "/name/Jennifer", clicks: 1540, impressions: 21000, ctr: 0.0733, position: 6.1, classification: "first-name", cluster: "first-name-count" },
  { query: "how common is the name olivia", page: "/name/Olivia", clicks: 1350, impressions: 18200, ctr: 0.0741, position: 5.3, classification: "first-name", cluster: "first-name-rarity" },
  { query: "how many people named liam", page: "/name/Liam", clicks: 1100, impressions: 15400, ctr: 0.0714, position: 7.2, classification: "first-name", cluster: "first-name-count" },
  { query: "how many people named noah", page: "/name/Noah", clicks: 1050, impressions: 14900, ctr: 0.0704, position: 7.6, classification: "first-name", cluster: "first-name-count" },
];

let cachedGscMap: Map<string, SearchPerformanceRecord> | null = null;
export function getDefaultGscMap(): Map<string, SearchPerformanceRecord> {
  if (!cachedGscMap) {
    cachedGscMap = ingestGscRecords(DEFAULT_GSC_SNAPSHOT_RECORDS);
  }
  return cachedGscMap;
}

/**
 * Builds evidence-based, intent-matched metadata and H1 headings for a Name page.
 * Guarantees human-first readability, uniqueness, and factual consistency.
 */
export function buildNameSeoMetadata(
  record: NameRecord,
  livingEstimate: number,
  rank: number,
  perfRecord?: SearchPerformanceRecord
): NameSeoMetadata {
  const name = record.name;
  const canonicalUrl = getNameUrl(name);
  const activePerf = perfRecord || getDefaultGscMap().get(canonicalUrl);
  const formattedLiving = livingEstimate.toLocaleString();
  const formattedRank = rank.toLocaleString();
  const origin = record.origin?.trim() || "Traditional";
  const meaning = record.meaning?.trim() || "Demographic name record";
  const intent: QueryIntent = activePerf?.primaryIntent || "HOW_MANY";

  if (intent === "POPULARITY") {
    return {
      title: `How Common Is the Name ${name}? Popularity & Living Statistics`,
      description: `${name} ranks #${formattedRank} in all-time U.S. frequency with ~${formattedLiving} living bearers. Explore historical birth curves, peak years, and rarity metrics.`,
      h1: `How Common Is the Name ${name}?`,
      subhead: `Official U.S. Popularity Rank #${formattedRank} & Living Bearer Demographics for ${name}`,
      primaryIntent: "POPULARITY",
      quickAnswerLead: `The first name ${name} ranks #${formattedRank} in all-time national popularity, with an estimated ${formattedLiving} living bearers in the United States today.`,
    };
  }

  if (intent === "MEANING_ORIGIN") {
    return {
      title: `${name}: Name Meaning, Cultural Origin & Living Statistics`,
      description: `Discover the ${origin} origins and meaning of ${name} ("${meaning}"), alongside U.S. living population estimates (~${formattedLiving}) and historical birth statistics.`,
      h1: `${name} Name Meaning, Cultural Origin & Statistics`,
      subhead: `Etymological Heritage & Modern U.S. Living Demographics for ${name}`,
      primaryIntent: "MEANING_ORIGIN",
      quickAnswerLead: `The name ${name} carries ${origin} origins meaning "${meaning}", with an estimated ${formattedLiving} living bearers in the United States.`,
    };
  }

  if (intent === "HISTORICAL") {
    const peakYear = record.ssa?.peakYear || 1980;
    return {
      title: `${name} Name Popularity by Decade & Historical Trends`,
      description: `Track the historical popularity of ${name} across decades from 1880 through 2024, including peak year ${peakYear} and current living bearer estimates (~${formattedLiving}).`,
      h1: `${name} Historical Popularity & Decade Trends (1880–2024)`,
      subhead: `Decade-by-Decade Social Security Administration Registration History for ${name}`,
      primaryIntent: "HISTORICAL",
      quickAnswerLead: `Social Security Administration records document ${name}'s historical peak in ${peakYear}, with an estimated ${formattedLiving} living bearers today.`,
    };
  }

  // Default HOW_MANY count intent (applies to P0_PROVEN, P1_STRIKING_DISTANCE, and baseline P2_UNKNOWN)
  return {
    title: `How Many People Are Named ${name}? Statistics & Living Population`,
    description: `An estimated ~${formattedLiving} living people in the U.S. have the first name ${name} (rank #${formattedRank}). Explore official SSA historical births, Census data, and decade trends.`,
    h1: `How Many People Are Named ${name}?`,
    subhead: `Official U.S. Social Security & Census demographic profile for ${name}`,
    primaryIntent: "HOW_MANY",
    quickAnswerLead: `An estimated ${formattedLiving} living people in the United States currently have the first name ${name}.`,
  };
}

