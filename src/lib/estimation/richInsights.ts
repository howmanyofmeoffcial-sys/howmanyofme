import type {
  RarityInfo,
  RarityLevel,
  GenderDistributionInfo,
  HistoricalTrendInfo,
  GeographicDistributionInfo,
  FunFactItem,
  RichInsights,
} from "./types";
import type { NameRecord } from "../names/getName";
import { getPopularNames } from "../../data/nameData";

const US_POPULATION_BASELINE = 334_900_000;

/**
 * 1. Deterministic Rarity Classification
 */
export function getRarityClassification(count: number): RarityInfo {
  const safeCount = Math.max(1, count);
  const oneInX = Math.max(1, Math.round(US_POPULATION_BASELINE / safeCount));

  let level: RarityLevel = "Very Rare";
  let description = "An exceptionally rare name combination in the United States.";

  if (count >= 500_000) {
    level = "Very Common";
    description = "Among the top national classics in American demographic history.";
  } else if (count >= 100_000) {
    level = "Common";
    description = "A widely familiar name established across multiple American generations.";
  } else if (count >= 20_000) {
    level = "Uncommon";
    description = "A distinctive name with recognizable character and moderate national frequency.";
  } else if (count >= 2_000) {
    level = "Rare";
    description = "Less common than the median American name, offering strong individuality.";
  }

  return {
    level,
    description,
    oneInX,
  };
}

/**
 * 2. Gender / Sex Distribution from Official Records
 */
export function getGenderDistribution(record?: NameRecord | null): GenderDistributionInfo | null {
  if (!record) return null;

  if (record.sexBreakdown && (record.sexBreakdown.pctMale !== undefined || record.sexBreakdown.pctFemale !== undefined)) {
    const malePct = Math.round(record.sexBreakdown.pctMale ?? (record.gender === "male" ? 100 : 0));
    const femalePct = Math.round(record.sexBreakdown.pctFemale ?? (100 - malePct));
    let label = "Balanced Gender-Neutral Usage";
    if (malePct >= 90) label = `Predominantly Masculine (${malePct}% Male births)`;
    else if (femalePct >= 90) label = `Predominantly Feminine (${femalePct}% Female births)`;
    else if (malePct >= 65) label = `Historically Masculine-Leaning (${malePct}% Male)`;
    else if (femalePct >= 65) label = `Historically Feminine-Leaning (${femalePct}% Female)`;

    return { malePct, femalePct, label };
  }

  if (record.gender) {
    const malePct = record.gender === "male" ? 100 : record.gender === "female" ? 0 : 50;
    const femalePct = 100 - malePct;
    const label =
      record.gender === "male"
        ? "Historically Masculine Name"
        : record.gender === "female"
        ? "Historically Feminine Name"
        : "Gender-Neutral Usage";
    return { malePct, femalePct, label };
  }

  return null;
}

/**
 * 3. Historical Popularity & Decade Trajectory
 */
export function getHistoricalTrend(record?: NameRecord | null): HistoricalTrendInfo | null {
  if (!record || !record.decade_popularity || Object.keys(record.decade_popularity).length === 0) {
    return null;
  }

  const entries = Object.entries(record.decade_popularity);
  if (entries.length === 0) return null;

  const history = entries.map(([decade, count]) => ({
    decade,
    count,
  }));

  // Find peak decade
  let peakDecade = entries[0][0];
  let peakCount = entries[0][1];
  for (const [decade, count] of entries) {
    if (count > peakCount) {
      peakCount = count;
      peakDecade = decade;
    }
  }

  // Parse peak year (either from record.ssa.peakYear or derived from decade)
  const peakYear = record.ssa?.peakYear || parseInt(peakDecade.replace(/\D/g, ""), 10) + 5;

  // Trend direction between earlier vs recent periods
  let trendDirection: "rising" | "declining" | "stable" = "stable";
  let trendDescription = "Historical usage has remained relatively consistent across decades.";

  if (history.length >= 2) {
    const last = history[history.length - 1].count;
    const prev = history[history.length - 2].count;
    const diffPct = prev > 0 ? ((last - prev) / prev) * 100 : 0;

    if (diffPct >= 15) {
      trendDirection = "rising";
      trendDescription = "Newborn registrations show upward momentum in the most recent recorded cohorts.";
    } else if (diffPct <= -15) {
      trendDirection = "declining";
      trendDescription = "Registration volume has softened compared to peak historical decades.";
    }
  }

  return {
    peakYear,
    peakCount,
    trendDirection,
    trendDescription,
    history,
  };
}

/**
 * 4. Geographic Distribution (Top States)
 */
export function getGeographicDistribution(
  record?: NameRecord | null,
  estimatedTotal?: number
): GeographicDistributionInfo | null {
  if (!record || !estimatedTotal || estimatedTotal <= 0) return null;

  // Top 5 standard census weights
  const stateWeights = [
    { state: "California", weight: 0.117 },
    { state: "Texas", weight: 0.089 },
    { state: "Florida", weight: 0.065 },
    { state: "New York", weight: 0.059 },
    { state: "Pennsylvania", weight: 0.039 },
  ];

  const topStates = stateWeights.map(({ state, weight }) => ({
    state,
    estimatedBearers: Math.max(1, Math.round(estimatedTotal * weight)),
    percentage: Math.round(weight * 100),
  }));

  return { topStates };
}

/**
 * 5. Mathematically Sound Fun Facts
 */
export function generateFunFacts(
  displayName: string,
  estimatedCount: number,
  rarity: RarityInfo,
  history?: HistoricalTrendInfo | null,
  queryType: "first-name" | "full-name" = "first-name"
): FunFactItem[] {
  const facts: FunFactItem[] = [];

  // Fact 1: Population Scale Comparison
  if (estimatedCount >= 1_000_000) {
    facts.push({
      category: "scale",
      title: "Major Metro Population",
      text: `With an estimated ~${estimatedCount.toLocaleString()} bearers, if everyone named ${displayName} gathered in one city, it would be larger than Austin, Texas (~975,000 residents).`,
    });
  } else if (estimatedCount >= 100_000) {
    facts.push({
      category: "scale",
      title: "Stadium Capacity",
      text: `An estimated ~${estimatedCount.toLocaleString()} people share this name—enough to completely fill the largest college football stadium in the country (Michigan Stadium, capacity 107,601).`,
    });
  } else if (estimatedCount >= 20_000) {
    facts.push({
      category: "scale",
      title: "Arena Scale",
      text: `With ~${estimatedCount.toLocaleString()} living bearers, everyone sharing this name could comfortably fill Madison Square Garden in New York City (capacity ~19,500).`,
    });
  } else if (estimatedCount >= 2_000) {
    facts.push({
      category: "scale",
      title: "Town Scale",
      text: `Roughly ~${estimatedCount.toLocaleString()} people share this name across the United States, comparable to the entire population of a classic American small town.`,
    });
  } else {
    facts.push({
      category: "scale",
      title: "Rare Distinctiveness",
      text: `With an estimated ~${estimatedCount.toLocaleString()} bearers, this is an exceptionally distinctive name combination held by fewer than 1 in every 65,000 Americans.`,
    });
  }

  // Fact 2: Frequency Ratio
  facts.push({
    category: "rarity",
    title: "National Frequency",
    text: `Approximately 1 out of every ${rarity.oneInX.toLocaleString()} people in the United States shares the name ${displayName}.`,
  });

  // Fact 3: Historical Peak (if available)
  if (history && history.peakYear) {
    facts.push({
      category: "history",
      title: "Golden Era",
      text: `The peak recorded popularity occurred around ${history.peakYear}, with the highest concentration of newborn birth applications during that historical era.`,
    });
  } else if (queryType === "full-name") {
    facts.push({
      category: "demographics",
      title: "Joint Probability",
      text: `This full-name estimate is derived by combining independent demographic frequencies for the given name and surname against U.S. Census baseline tables.`,
    });
  }

  return facts.slice(0, 3);
}

/**
 * 6. Related Names
 */
export function getRelatedNames(name: string): string[] {
  const popular = getPopularNames();
  const filtered = popular.filter((p) => p.name.toLowerCase() !== name.toLowerCase());
  return filtered.slice(0, 6).map((p) => p.name);
}

/**
 * Master Builder for Rich Insights
 */
export function buildRichInsights(
  displayName: string,
  estimatedCount: number,
  record?: NameRecord | null,
  queryType: "first-name" | "full-name" = "first-name"
): RichInsights {
  const rarity = getRarityClassification(estimatedCount);
  const gender = getGenderDistribution(record);
  const history = getHistoricalTrend(record);
  const geography = getGeographicDistribution(record, estimatedTotalCount(estimatedCount));
  const funFacts = generateFunFacts(displayName, estimatedCount, rarity, history, queryType);
  const relatedNames = getRelatedNames(displayName);

  return {
    rarity,
    gender,
    history,
    geography,
    funFacts,
    relatedNames,
  };
}

function estimatedTotalCount(count: number): number {
  return count > 0 ? count : 1000;
}
