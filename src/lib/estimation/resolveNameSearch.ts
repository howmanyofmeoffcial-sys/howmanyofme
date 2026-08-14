import { estimateFirstName } from "./estimateFirstName";
import { resolveFullName } from "./resolveFullName";
import type { NameEstimateResult, NameSearchParams } from "./types";

/**
 * Master Search & Demographic Resolver API
 * The single entry point for all user-facing name lookups on HowManyOfMe.co.
 * Handles first-name, full-name, Unicode, space-separated inputs, and invalid cases.
 */
export function resolveNameSearch(params: NameSearchParams): NameEstimateResult {
  const rawFirst = (params?.firstName || "").trim();
  const rawLast = (params?.lastName || "").trim();

  // 1. Handle Empty Input
  if (!rawFirst && !rawLast) {
    return {
      mode: "invalid",
      queryType: "unknown",
      firstName: "",
      displayName: "",
      estimatedPeople: null,
      displayEstimate: "0",
      confidence: null,
      sourceType: "none",
      methodology: "No input provided",
      userFacingLabel: "Invalid input",
      detailedProfileUrl: null,
      errorReason: "Please enter a name to search",
      warnings: ["Name field cannot be empty"],
    };
  }

  // 2. Explicit First + Last Name
  if (rawFirst && rawLast) {
    return resolveFullName(rawFirst, rawLast);
  }

  // 3. User entered a full name (space-separated) into the single first-name input
  if (rawFirst && !rawLast && rawFirst.includes(" ")) {
    const parts = rawFirst.split(/\s+/);
    const firstNamePart = parts[0];
    const lastNamePart = parts.slice(1).join(" ");
    return resolveFullName(firstNamePart, lastNamePart);
  }

  // 4. Single First-Name Search
  return estimateFirstName(rawFirst);
}
