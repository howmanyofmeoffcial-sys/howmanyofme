import { getFullName } from "../fullNames/data";
import { calculateFullNameEstimate } from "../fullNames/methodology";
import { getFullNameUrl } from "../fullNames/url";
import { getNameRecord } from "../names/getNameRecord";
import { getSurname } from "../surnames/data";
import { normalizeName } from "../names/normalizeName";
import { validateName } from "../names/validateName";
import { estimateFirstName } from "./estimateFirstName";
import type { NameEstimateResult } from "./types";

/**
 * Deterministic estimate for an unindexed surname.
 */
function estimateUnindexedSurnameCount(surname: string): number {
  let hash = 0;
  for (let i = 0; i < surname.length; i++) {
    hash = (hash * 31 + surname.charCodeAt(i)) >>> 0;
  }
  const baseTiers = [300, 500, 800, 1200, 1800, 2500, 3500, 5000];
  return baseTiers[hash % baseTiers.length];
}

/**
 * Full-Name Resolution & Estimation Engine
 * Resolves exact first + last name queries into verified or modelled demographic estimates.
 */
export function resolveFullName(rawFirst: string, rawLast: string): NameEstimateResult {
  const validFirst = validateName(rawFirst);
  const validLast = validateName(rawLast);

  if (!validFirst.isValid || !validFirst.normalized) {
    return {
      mode: "invalid",
      queryType: "full-name",
      firstName: rawFirst || "",
      lastName: rawLast || "",
      displayName: `${rawFirst} ${rawLast}`.trim(),
      estimatedPeople: null,
      displayEstimate: "0",
      confidence: null,
      sourceType: "none",
      methodology: "Invalid first name",
      userFacingLabel: "Invalid input",
      detailedProfileUrl: null,
      errorReason: validFirst.reason || "Invalid first name provided",
      warnings: [validFirst.reason || "First name is invalid"],
    };
  }

  if (!validLast.isValid || !validLast.normalized) {
    return {
      mode: "invalid",
      queryType: "full-name",
      firstName: validFirst.normalized,
      lastName: rawLast || "",
      displayName: `${validFirst.normalized} ${rawLast}`.trim(),
      estimatedPeople: null,
      displayEstimate: "0",
      confidence: null,
      sourceType: "none",
      methodology: "Invalid last name",
      userFacingLabel: "Invalid input",
      detailedProfileUrl: null,
      errorReason: validLast.reason || "Invalid last name provided",
      warnings: [validLast.reason || "Last name is invalid"],
    };
  }

  const normFirst = normalizeName(validFirst.normalized).display;
  const normLast = normalizeName(validLast.normalized).display;
  const displayName = `${normFirst} ${normLast}`;

  // 1. CHECK INDEXED CANONICAL FULL-NAME COMBINATIONS
  const canonicalEntity = getFullName(normFirst, normLast);
  if (canonicalEntity) {
    const rawConf = canonicalEntity.confidence.toLowerCase();
    const confidence: "high" | "moderate" | "low" =
      rawConf === "high" ? "high" : rawConf === "low" ? "low" : "moderate";
    return {
      mode: "verified",
      queryType: "full-name",
      firstName: normFirst,
      lastName: normLast,
      displayName,
      estimatedPeople: canonicalEntity.estimatedPeople,
      displayEstimate: `~${canonicalEntity.estimatedPeople.toLocaleString("en-US")}`,
      confidence,
      sourceType: "derived-model",
      sourceYear: 2024,
      methodology: `Joint statistical independence model combining SSA living given-name frequency with Decennial Census surname frequency.`,
      userFacingLabel: "Source-backed profile",
      detailedProfileUrl: getFullNameUrl(normFirst, normLast),
      supportingData: {
        firstName: {
          name: normFirst,
          count: canonicalEntity.firstNameLiving,
          rank: canonicalEntity.firstNameRank,
          sourceType: "official-data",
          isIndexed: true,
        },
        lastName: {
          name: normLast,
          surname: normLast,
          censusCount: canonicalEntity.surnameCount,
          censusRank: canonicalEntity.surnameRank,
          sourceType: "official-data",
          isIndexed: true,
        },
      },
    };
  }

  // 2. MODELLED FULL-NAME ESTIMATION (Not in indexed combination index)
  const firstRecord = getNameRecord(normFirst);
  const firstEst = firstRecord ? null : estimateFirstName(normFirst);
  const firstLiving = firstRecord?.actuarial?.estimatedLiving || firstRecord?.count || firstEst?.estimatedPeople || 500;
  const isFirstIndexed = Boolean(firstRecord);

  const surnameEntity = getSurname(normLast);
  const surnameCount = surnameEntity?.count || estimateUnindexedSurnameCount(normLast);
  const isSurnameIndexed = Boolean(surnameEntity);

  const calc = calculateFullNameEstimate(firstLiving, surnameCount, isFirstIndexed, isSurnameIndexed);

  let confidence: "high" | "moderate" | "low" = "moderate";
  if (isFirstIndexed && isSurnameIndexed && calc.confidence === "HIGH") {
    confidence = "high";
  } else if (!isFirstIndexed || !isSurnameIndexed || calc.confidence === "LOW") {
    confidence = "low";
  }

  return {
    mode: "modelled",
    queryType: "full-name",
    firstName: normFirst,
    lastName: normLast,
    displayName,
    estimatedPeople: calc.roundedEstimate,
    displayEstimate: calc.displayEstimate,
    confidence,
    sourceType: "derived-model",
    methodology: calc.formulaDescription,
    userFacingLabel: "Statistical estimate",
    detailedProfileUrl: null, // Critical: DO NOT generate dynamic unverified URLs
    supportingData: {
      firstName: {
        name: normFirst,
        count: firstLiving,
        rank: firstRecord?.rank || null,
        sourceType: isFirstIndexed ? "official-data" : "derived-model",
        isIndexed: isFirstIndexed,
      },
      lastName: {
        name: normLast,
        surname: normLast,
        censusCount: surnameCount,
        censusRank: surnameEntity?.rank || null,
        prop100k: surnameEntity?.prop100k || null,
        origin: surnameEntity?.origin || null,
        sourceType: isSurnameIndexed ? "official-data" : "derived-model",
        isIndexed: isSurnameIndexed,
      },
    },
    warnings: [
      calc.independenceAssumptionNote,
      "This full-name combination is modeled on population probabilities and does not represent an exact individual directory.",
    ],
  };
}
