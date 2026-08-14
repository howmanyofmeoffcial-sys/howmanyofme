/**
 * Name Estimation & Resolver Core Types
 * Defines the shared result model for verified vs modelled demographic statistics.
 */

export type EstimateMode = "verified" | "modelled" | "insufficient" | "invalid";

export type ConfidenceLevel = "high" | "moderate" | "low" | null;

export type SourceType = "official-data" | "derived-model" | "none";

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

  warnings?: string[];
  errorReason?: string;
}

export interface NameSearchParams {
  firstName: string;
  lastName?: string;
}
