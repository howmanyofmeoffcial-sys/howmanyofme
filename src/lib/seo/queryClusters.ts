import { normalizeName } from "../names/normalizeName";
import { getNameUrl } from "./canonicalUrl";
import { getFullNameUrl } from "../fullNames/url";

export type QueryClassification =
  | "brand"
  | "first-name"
  | "full-name"
  | "directory"
  | "tool"
  | "informational"
  | "irrelevant";

export type AlignmentStatus = "MATCH" | "WEAK_MATCH" | "CANNIBALIZATION" | "NO_TARGET";

export interface QueryClusterMatch {
  query: string;
  classification: QueryClassification;
  intentCluster: string;
  targetPage: string;
  currentRankingPage: string;
  alignment: AlignmentStatus;
  priorityScore: number;
}

/**
 * Classifies any incoming search query deterministically into intent clusters and target canonical pages.
 */
export function classifySearchQuery(query: string, currentRankingPage = ""): QueryClusterMatch {
  const clean = query.trim().toLowerCase();

  // 1. Brand Queries
  if (clean.includes("how many of me") || clean === "how many people have my name") {
    const target = "/";
    return {
      query,
      classification: "brand",
      intentCluster: "brand-core",
      targetPage: target,
      currentRankingPage: currentRankingPage || target,
      alignment: currentRankingPage === target || !currentRankingPage ? "MATCH" : "WEAK_MATCH",
      priorityScore: 95,
    };
  }

  // 2. Full Name Queries (e.g. "how many people are named david smith", "david smith count")
  const fullNameRegex = /(?:how many|people named|how common is(?: the name)?)\s+([a-z]+)\s+([a-z]+)/i;
  const fullMatch = clean.match(fullNameRegex);
  if (fullMatch && fullMatch[1] && fullMatch[2]) {
    const firstName = fullMatch[1];
    const lastName = fullMatch[2];
    const target = getFullNameUrl(firstName, lastName);
    const alignment: AlignmentStatus =
      currentRankingPage === target ? "MATCH" : currentRankingPage.startsWith("/name/") ? "WEAK_MATCH" : "MATCH";

    return {
      query,
      classification: "full-name",
      intentCluster: "full-name-count",
      targetPage: target,
      currentRankingPage: currentRankingPage || target,
      alignment,
      priorityScore: 85,
    };
  }

  // 3. First Name Queries (e.g. "how many people are named david", "how common is the name emma")
  const firstNameRegex = /(?:how many people (?:are )?named|how common is (?:the name )?|people named)\s+([a-z]+)/i;
  const firstMatch = clean.match(firstNameRegex);
  if (firstMatch && firstMatch[1]) {
    const norm = normalizeName(firstMatch[1]);
    const target = getNameUrl(norm.display);
    const alignment: AlignmentStatus =
      currentRankingPage === target || !currentRankingPage ? "MATCH" : "WEAK_MATCH";

    return {
      query,
      classification: "first-name",
      intentCluster: "first-name-count",
      targetPage: target,
      currentRankingPage: currentRankingPage || target,
      alignment,
      priorityScore: 90,
    };
  }

  // 4. Directory Queries (e.g. "names starting with j")
  const letterMatch = clean.match(/names (?:starting with|that start with)\s+([a-z])/i);
  if (letterMatch && letterMatch[1]) {
    const letter = letterMatch[1].toLowerCase();
    const target = `/names/${letter}`;
    return {
      query,
      classification: "directory",
      intentCluster: "directory-letter",
      targetPage: target,
      currentRankingPage: currentRankingPage || target,
      alignment: "MATCH",
      priorityScore: 75,
    };
  }

  // 5. Informational / Methodology Queries
  if (clean.includes("methodology") || clean.includes("how is name frequency calculated") || clean.includes("formula")) {
    const target = "/methodology";
    return {
      query,
      classification: "informational",
      intentCluster: "methodology",
      targetPage: target,
      currentRankingPage: currentRankingPage || target,
      alignment: "MATCH",
      priorityScore: 60,
    };
  }

  // Fallback
  return {
    query,
    classification: "general-statistical" as QueryClassification,
    intentCluster: "general-discovery",
    targetPage: "/",
    currentRankingPage: currentRankingPage || "/",
    alignment: "MATCH",
    priorityScore: 50,
  };
}
