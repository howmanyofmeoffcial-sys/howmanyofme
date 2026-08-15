/**
 * Name Estimation & Resolver Core Types
 * Defines the shared result model for verified vs modelled demographic statistics.
 */

export type EstimateMode = "verified" | "modelled" | "insufficient" | "invalid";

export type ConfidenceLevel = "high" | "moderate" | "low" | null;

export type SourceType = "official-data" | "derived-model" | "none";

export type RarityLevel = "Very Common" | "Common" | "Uncommon" | "Rare" | "Very Rare";

export interface RarityInfo {
  level: RarityLevel;
  description: string;
  oneInX: number;
}

export interface GenderDistributionInfo {
  malePct: number;
  femalePct: number;
  label: string;
}

export interface DecadeHistoryPoint {
  decade: string;
  count: number;
}

export interface HistoricalTrendInfo {
  peakYear: number;
  peakCount: number;
  trendDirection: "rising" | "declining" | "stable";
  trendDescription: string;
  history: DecadeHistoryPoint[];
}

export interface GeographicDistributionInfo {
  topStates: Array<{
    state: string;
    estimatedBearers: number;
    percentage: number;
  }>;
  topCities: Array<{
    city: string;
    state: string;
    estimatedBearers: number;
  }>;
}

export interface FunFactItem {
  title: string;
  text: string;
  category: "scale" | "rarity" | "history" | "demographics";
}

export interface RichInsights {
  rarity: RarityInfo;
  gender: GenderDistributionInfo | null;
  history: HistoricalTrendInfo | null;
  geography: GeographicDistributionInfo | null;
  funFacts: FunFactItem[];
  relatedNames: string[];
}

export interface SupportingNameData {
  name: string;
  count: number;
  rank?: number | null;
  gender?: "male" | "female" | "unisex" | null;
  peakYear?: number | null;
  sourceType: SourceType;
  isIndexed: boolean;
}

export interface SupportingSurnameData {
  surname: string;
  name?: string;
  censusCount: number;
  censusRank?: number | null;
  prop100k?: number | null;
  origin?: string | null;
  sourceType: SourceType;
  isIndexed: boolean;
}

export interface NameEstimateResult {
  mode: EstimateMode;
  queryType: "first-name" | "full-name" | "unknown";

  firstName: string;
  lastName?: string;
  displayName: string;

  estimatedPeople: number | null;
  displayEstimate: string;

  confidence: ConfidenceLevel;

  sourceType: SourceType;
  sourceYear?: number | null;

  methodology: string;
  userFacingLabel: "Source-backed profile" | "Statistical estimate" | "Limited data" | "Invalid input";

  detailedProfileUrl?: string | null;

  supportingData?: {
    firstName?: SupportingNameData;
    lastName?: SupportingSurnameData;
  };

  latestSsa?: {
    year: number;
    rank: number;
    count: number;
    sex: "M" | "F";
  } | null;

  sourceAvailability?: {
    censusFirstName: boolean;
    ssaHistorical: boolean;
    ssa2025: boolean;
    censusSurname: boolean;
  };

  richInsights?: RichInsights;

  warnings?: string[];
  errorReason?: string;
}

export interface NameSearchParams {
  firstName: string;
  lastName?: string;
}
