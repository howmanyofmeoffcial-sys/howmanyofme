/**
 * Topical Authority, Entity Mapping & Authority Gap Engine
 * 
 * Formalizes the site's topical clusters, entity relationships, unique data assets,
 * and external citation/authority opportunities.
 */

import { getNameUrl } from "./canonicalUrl.ts";
import type { SearchPerformanceRecord } from "./performanceData.ts";

export type TopicalClusterType =
  | "LIVING_BEARER_DEMOGRAPHICS"
  | "NAME_POPULARITY_TRENDS"
  | "NAME_SIMILARITY_PHONETICS"
  | "NAME_COMPARISONS_COHORTS"
  | "CULTURAL_ETYMOLOGY_ORIGINS"
  | "METHODOLOGY_DATA_PROVENANCE";

export type AuthorityGapType =
  | "LIKELY_AUTHORITY_GAP"
  | "POSSIBLE_AUTHORITY_GAP"
  | "CONTENT_GAP"
  | "TECHNICAL_GAP"
  | "UNKNOWN";

export interface TopicalCluster {
  id: TopicalClusterType;
  name: string;
  hubUrl: string;
  supportingUrls: string[];
  status: "STRONG" | "GOOD" | "NEEDS_WORK" | "MISSING";
  uniqueDataAdvantage: string;
  coreEntitiesCount: number;
  description: string;
}

export interface LinkableAsset {
  id: string;
  title: string;
  url: string;
  assetType: "ORIGINAL_RESEARCH" | "DATA_PORTAL" | "METHODOLOGY" | "INTERACTIVE_TOOL";
  uniqueValue: string;
  targetAudience: string;
  potentialReferrers: string[];
  citationReason: string;
  status: "ACTIVE" | "PLANNED";
}

export interface FutureContentOpportunity {
  topic: string;
  intent: "INFORMATIONAL" | "RESEARCH_STUDY" | "COMPARISON";
  targetUrl: string;
  whyItMatters: string;
  supportingData: string;
  targetEntities: string[];
  citationPotential: "VERY_HIGH" | "HIGH" | "MEDIUM";
  priority: "P1_HIGH" | "P2_MEDIUM";
}

export interface EntityAuthorityProfile {
  name: string;
  url: string;
  primaryCluster: TopicalClusterType;
  searchDemandTier: string;
  seoPriority: string;
  averagePosition: number;
  impressions: number;
  clicks: number;
  authorityGap: AuthorityGapType;
  recommendedAuthorityStrategy: string;
}

export const TOPICAL_CLUSTERS: TopicalCluster[] = [
  {
    id: "LIVING_BEARER_DEMOGRAPHICS",
    name: "Living Population & Bearer Demographics",
    hubUrl: "/",
    supportingUrls: ["/methodology", "/data"],
    status: "STRONG",
    uniqueDataAdvantage: "CDC Actuarial Life-Table cohort survival modeling estimating living population in 2026.",
    coreEntitiesCount: 583,
    description: "Calculates realistic living bearer counts rather than unadjusted raw historical birth counts.",
  },
  {
    id: "NAME_POPULARITY_TRENDS",
    name: "Historical Name Popularity & Birth Trends",
    hubUrl: "/tools/popularity-checker",
    supportingUrls: ["/tools/baby-names", "/research/name-popularity-by-decade", "/tools/trend-visualizer"],
    status: "STRONG",
    uniqueDataAdvantage: "145 years (1880–2024) of official SSA baby name registrations with decade distribution curves.",
    coreEntitiesCount: 583,
    description: "Tracks national rank trajectory, peak birth years, and generation-by-generation shifts.",
  },
  {
    id: "NAME_SIMILARITY_PHONETICS",
    name: "Name Similarity, Soundalikes & Rhyme Engine",
    hubUrl: "/similar-names",
    supportingUrls: ["/tools/unique-name-generator"],
    status: "STRONG",
    uniqueDataAdvantage: "Multi-signal phonetic (Soundex), orthographic (Levenshtein), rhyme, and era-weighted recommendation vector.",
    coreEntitiesCount: 492,
    description: "Discovers genuine soundalikes and cultural equivalents with multi-dimensional match scores.",
  },
  {
    id: "NAME_COMPARISONS_COHORTS",
    name: "Head-to-Head Name Comparisons",
    hubUrl: "/tools/name-comparison",
    supportingUrls: ["/name-comparison/james-vs-john", "/name-comparison/emma-vs-olivia", "/name-comparison/liam-vs-noah"],
    status: "GOOD",
    uniqueDataAdvantage: "Side-by-side living bearer differences, rank histories, and decade crossover graphs.",
    coreEntitiesCount: 20,
    description: "Direct comparative demographic analysis for top naming cohorts.",
  },
  {
    id: "CULTURAL_ETYMOLOGY_ORIGINS",
    name: "Cultural Origins & Etymological Heritage",
    hubUrl: "/tools/meaning",
    supportingUrls: ["/tools/username-generator", "/tools/random-name"],
    status: "GOOD",
    uniqueDataAdvantage: "Factual linguistic etymology paired with real U.S. demographic distribution.",
    coreEntitiesCount: 583,
    description: "Connects linguistic roots with historical U.S. demographic adoption.",
  },
  {
    id: "METHODOLOGY_DATA_PROVENANCE",
    name: "Data Methodology, Academic Sources & Open Data",
    hubUrl: "/methodology",
    supportingUrls: ["/data", "/about"],
    status: "STRONG",
    uniqueDataAdvantage: "Open downloadable datasets, Schema.org Dataset metadata, transparent CDC survival formulas.",
    coreEntitiesCount: 583,
    description: "Citation-ready demographic resource for journalists, researchers, and genealogists.",
  },
];

export const LINKABLE_ASSETS: LinkableAsset[] = [
  {
    id: "ACTUARIAL_METHODOLOGY",
    title: "How Living Name Bearers Are Estimated: Actuarial Survival Methodology",
    url: "/methodology",
    assetType: "METHODOLOGY",
    uniqueValue: "Transparent explanation of CDC cohort survival rates applied to 145 years of SSA registration data.",
    targetAudience: "Demographers, journalists, genealogists, data journalists.",
    potentialReferrers: ["Academic institutions", "Data journalism portals", "Genealogy blogs", "Parenting researchers"],
    citationReason: "Explains why cumulative historical births differ significantly from living population counts.",
    status: "ACTIVE",
  },
  {
    id: "OPEN_DEMOGRAPHIC_PORTAL",
    title: "Open Demographic Name Data & Research Datasets",
    url: "/data",
    assetType: "DATA_PORTAL",
    uniqueValue: "Free downloadable JSON and CSV summaries under CC-BY-4.0 licensing with Schema.org Dataset markup.",
    targetAudience: "Data scientists, researchers, student developers, visualization specialists.",
    potentialReferrers: ["Open-data directories", "GitHub research repositories", "Kaggle datasets", "Data blogs"],
    citationReason: "Standardized given-name summaries with actuarial estimates and decade rankings.",
    status: "ACTIVE",
  },
  {
    id: "DECADE_POPULARITY_RESEARCH",
    title: "U.S. Name Popularity by Decade (1880–2024)",
    url: "/research/name-popularity-by-decade",
    assetType: "ORIGINAL_RESEARCH",
    uniqueValue: "Comprehensive historical breakdown of naming trends across 14 decades of federal records.",
    targetAudience: "Cultural historians, sociologists, baby name enthusiasts, trend writers.",
    potentialReferrers: ["History blogs", "Sociology resources", "News media naming articles"],
    citationReason: "Longitudinal perspective on generational name replacement and linguistic shifts.",
    status: "ACTIVE",
  },
  {
    id: "MULTI_SIGNAL_SIMILARITY_ENGINE",
    title: "Multi-Signal Name Similarity & Phonetic Recommendation Engine",
    url: "/similar-names",
    assetType: "INTERACTIVE_TOOL",
    uniqueValue: "Algorithmic discovery combining sound, spelling, syllables, and historical era.",
    targetAudience: "Expecting parents, writers, linguists.",
    potentialReferrers: ["Baby naming guides", "Creative writing communities", "Linguistics discussion forums"],
    citationReason: "High-accuracy phonetic and stylistic recommendations without arbitrary editorial tags.",
    status: "ACTIVE",
  },
];

export const FUTURE_CONTENT_OPPORTUNITIES: FutureContentOpportunity[] = [
  {
    topic: "The Great Century Shift: How 1950s Top Names Evolved into 2020s Rare Names",
    intent: "RESEARCH_STUDY",
    targetUrl: "/research/1950s-vs-2020s-name-evolution",
    whyItMatters: "Explores the mathematical turnover of baby names from Baby Boomers to Gen Alpha.",
    supportingData: "SSA 1950–2024 decade matrix, CDC survival estimates.",
    targetEntities: ["James", "Robert", "Michael", "Jennifer", "Emma", "Liam"],
    citationPotential: "VERY_HIGH",
    priority: "P1_HIGH",
  },
  {
    topic: "Living Population vs Historical Births: The Actuarial Name Index",
    intent: "RESEARCH_STUDY",
    targetUrl: "/research/living-population-vs-historical-births",
    whyItMatters: "Clarifies why names with high total historical births have relatively few living bearers today.",
    supportingData: "Actuarial mortality curves, SSA historical records.",
    targetEntities: ["Mary", "John", "Patricia", "David"],
    citationPotential: "VERY_HIGH",
    priority: "P1_HIGH",
  },
  {
    topic: "The Geographic Distribution of Rare Given Names in America",
    intent: "RESEARCH_STUDY",
    targetUrl: "/research/geographic-name-distribution-patterns",
    whyItMatters: "Surfaces regional state-level naming concentrations across the 50 U.S. states.",
    supportingData: "State distribution shares, Census 2020 returns.",
    targetEntities: ["Noah", "Olivia", "Emma", "Liam"],
    citationPotential: "HIGH",
    priority: "P2_MEDIUM",
  },
];

/**
 * Evaluates the external authority and topical positioning for an entity.
 */
export function evaluateEntityAuthorityProfile(
  name: string,
  perfRecord?: SearchPerformanceRecord
): EntityAuthorityProfile {
  const url = getNameUrl(name);
  const averagePosition = perfRecord?.averagePosition ?? 50.0;
  const impressions = perfRecord?.impressions ?? 0;
  const clicks = perfRecord?.clicks ?? 0;
  const primaryIntent = perfRecord?.primaryIntent ?? "HOW_MANY";

  let primaryCluster: TopicalClusterType = "LIVING_BEARER_DEMOGRAPHICS";
  if (primaryIntent === "POPULARITY") {
    primaryCluster = "NAME_POPULARITY_TRENDS";
  } else if (primaryIntent === "MEANING_ORIGIN") {
    primaryCluster = "CULTURAL_ETYMOLOGY_ORIGINS";
  } else if (primaryIntent === "HISTORICAL") {
    primaryCluster = "NAME_POPULARITY_TRENDS";
  }

  let authorityGap: AuthorityGapType = "UNKNOWN";
  let recommendedAuthorityStrategy = "Maintain clean data baseline and internal directory crawl paths.";

  if (perfRecord) {
    if (averagePosition >= 4.0 && averagePosition <= 8.0 && impressions >= 10000) {
      authorityGap = "LIKELY_AUTHORITY_GAP";
      recommendedAuthorityStrategy =
        "Entity possesses high search demand and verified data completeness, but is held back from top 3 SERP rankings by external domain authority. Target for data citations, editorial research references, and relevant parenting/demographic publications.";
    } else if (impressions >= 20000 && clicks >= 1000) {
      authorityGap = "POSSIBLE_AUTHORITY_GAP";
      recommendedAuthorityStrategy =
        "Proven high-traffic entity. Solidify top-ranking authority by linking from relevant research studies and open datasets.";
    } else {
      authorityGap = "POSSIBLE_AUTHORITY_GAP";
      recommendedAuthorityStrategy =
        "Build contextual links from related topical hubs and similar name clusters.";
    }
  }

  return {
    name,
    url,
    primaryCluster,
    searchDemandTier: perfRecord ? (impressions >= 15000 ? "PROVEN" : "PROMISING") : "UNKNOWN",
    seoPriority: perfRecord ? (averagePosition <= 6.0 && impressions >= 20000 ? "P0_PROVEN" : "P1_STRIKING_DISTANCE") : "P2_UNKNOWN",
    averagePosition,
    impressions,
    clicks,
    authorityGap,
    recommendedAuthorityStrategy,
  };
}
