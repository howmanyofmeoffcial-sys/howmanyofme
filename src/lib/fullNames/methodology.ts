export const US_POPULATION_ESTIMATE = 334914895; // 2024 U.S. Census Bureau Population Estimate
export const CENSUS_SURNAME_POPULATION_BASE = 295000000; // Census coverage denominator for tabulated surnames

export interface FullNameCalculationResult {
  rawEstimate: number;
  roundedEstimate: number;
  displayEstimate: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  formulaDescription: string;
  independenceAssumptionNote: string;
}

/**
 * Calculates estimated living people with a given first name and surname combination
 * under the statistical independence assumption.
 */
export function calculateFullNameEstimate(
  firstNameLiving: number,
  surnameCount: number,
  isFirstStrong = true,
  isSurnameStrong = true
): FullNameCalculationResult {
  if (firstNameLiving <= 0 || surnameCount <= 0) {
    return {
      rawEstimate: 0,
      roundedEstimate: 0,
      displayEstimate: "0",
      confidence: "LOW",
      formulaDescription: "Insufficient data for estimation",
      independenceAssumptionNote: "Combination cannot be reliably estimated due to unlisted frequencies.",
    };
  }

  // Model: Joint probability under independence P(First ∩ Last) = P(First) * P(Last)
  // Expected Count = (FirstLiving / US_POP) * (SurnameCount / CENSUS_BASE) * US_POP
  const rawEstimate = (firstNameLiving * surnameCount) / CENSUS_SURNAME_POPULATION_BASE;

  let roundedEstimate = 0;
  let displayEstimate = "";

  if (rawEstimate < 1) {
    roundedEstimate = Math.max(1, Math.round(rawEstimate));
    displayEstimate = "Fewer than 5";
  } else if (rawEstimate < 10) {
    roundedEstimate = Math.round(rawEstimate);
    displayEstimate = `~${roundedEstimate}`;
  } else if (rawEstimate < 100) {
    roundedEstimate = Math.round(rawEstimate / 5) * 5;
    displayEstimate = `~${roundedEstimate.toLocaleString()}`;
  } else if (rawEstimate < 1000) {
    roundedEstimate = Math.round(rawEstimate / 10) * 10;
    displayEstimate = `~${roundedEstimate.toLocaleString()}`;
  } else if (rawEstimate < 10000) {
    roundedEstimate = Math.round(rawEstimate / 50) * 50;
    displayEstimate = `~${roundedEstimate.toLocaleString()}`;
  } else {
    roundedEstimate = Math.round(rawEstimate / 100) * 100;
    displayEstimate = `~${roundedEstimate.toLocaleString()}`;
  }

  let confidence: "HIGH" | "MEDIUM" | "LOW" = "MEDIUM";
  if (isFirstStrong && isSurnameStrong && firstNameLiving >= 50000 && surnameCount >= 100000) {
    confidence = "HIGH";
  } else if (firstNameLiving < 5000 || surnameCount < 10000) {
    confidence = "LOW";
  }

  const formulaDescription = `Modeled by multiplying the first-name living probability (${(
    (firstNameLiving / US_POPULATION_ESTIMATE) *
    100
  ).toFixed(4)}%) by the surname population probability (${(
    (surnameCount / CENSUS_SURNAME_POPULATION_BASE) *
    100
  ).toFixed(4)}%) over the U.S. population.`;

  const independenceAssumptionNote = `Statistical estimate based on joint independence modeling of Social Security and Census frequency distributions. Does not represent a direct enumeration of identifiable individuals.`;

  return {
    rawEstimate,
    roundedEstimate,
    displayEstimate,
    confidence,
    formulaDescription,
    independenceAssumptionNote,
  };
}
