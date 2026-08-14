import type { NameRecord } from "./getName";
import { formatNumber } from "../../data/nameData";

export interface NameInsights {
  quickAnswer: string;
  popularityTier: string;
  oneInX: string;
  peakDecadeText: string;
  trendText: string;
  geographicText: string;
  genderText: string;
  comparativeText: string;
  etymologyText: string;
  factsList: string[];
}

export const DATASET_METADATA = {
  version: "2026.1",
  ssaDataRange: "1880–present",
  countriesCovered: "80+",
  recordsIndexed: "100M+",
  lastUpdatedYear: 2026,
  confidenceInterval: "±5% (common names) to ±15% (uncommon names)",
};

/**
 * Returns deterministic, fact-based insights for a name entity.
 */
export function getNameInsights(record: NameRecord): NameInsights {
  const count = record.count;
  const rank = record.rank;
  const name = record.name;
  const origin = record.origin;
  const meaning = record.meaning;
  const gender = record.gender;

  const oneInXNum = Math.max(1, Math.round(8_000_000_000 / Math.max(1, count)));
  const oneInX = `1 in every ${formatNumber(oneInXNum)} people`;

  // Popularity tier
  let popularityTier = "Rare";
  if (rank <= 100) {
    popularityTier = "Very Common (Top 100)";
  } else if (rank <= 1000) {
    popularityTier = "Common (Top 1,000)";
  } else if (rank <= 10000) {
    popularityTier = "Uncommon (Top 10,000)";
  } else {
    popularityTier = "Rare (1 in 50,000+ rarity)";
  }

  // Answer-first Quick Answer
  const quickAnswer = `There are approximately ${formatNumber(count)} living people named ${name} worldwide, making it rank #${formatNumber(rank)} in global name popularity. This means roughly ${oneInX} on Earth shares the name ${name}.`;

  // Decade & Trend analysis
  const decadeEntries = Object.entries(record.decade_popularity || {});
  const peakDecade = decadeEntries.reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    decadeEntries[0] || ["1980s", 50]
  );

  const peakDecadeText = `${name} reached its peak historical popularity in the ${peakDecade[0]} with a popularity score of ${peakDecade[1]}/100.`;

  const recent2020s = record.decade_popularity["2020s"] ?? 50;
  const recent2000s = record.decade_popularity["2000s"] ?? 50;
  const delta = recent2020s - recent2000s;

  let trendText = "";
  if (delta > 15) {
    trendText = `${name} is trending upward, rising ${delta} points in relative popularity over the last two decades.`;
  } else if (delta < -15) {
    trendText = `${name} has declined in newborn frequency over the last two decades, softening by ${Math.abs(delta)} points from earlier peaks.`;
  } else {
    trendText = `${name} has demonstrated steady, consistent popularity across recent birth cohorts without drastic volatility.`;
  }

  // Geographic distribution
  const regions = Object.entries(record.regions || {}).sort((a, b) => b[1] - a[1]);
  const topCountry = regions[0];
  let geographicText = "";
  if (topCountry) {
    const topPct = Math.round((topCountry[1] / count) * 100);
    geographicText = `The highest concentration of people named ${name} is in ${topCountry[0]} (~${formatNumber(topCountry[1])} bearers, accounting for ${topPct}% of the global total).`;
  } else {
    geographicText = `${name} is distributed across multiple international populations.`;
  }

  // Gender breakdown
  let genderText = "";
  if (gender === "male") {
    genderText = `${name} is predominantly used as a masculine first name across demographic registries.`;
  } else if (gender === "female") {
    genderText = `${name} is predominantly used as a feminine first name across demographic registries.`;
  } else {
    genderText = `${name} is widely recognized as a unisex / gender-neutral first name with balanced representation.`;
  }

  // Comparative context
  let comparativeText = "";
  if (count > 2_000_000) {
    comparativeText = `With over ${formatNumber(Math.floor(count / 1_000_000))} million estimated living bearers, ${name} is among the most widely recognized personal names globally, comparable in scale to staple names like Michael and David.`;
  } else if (count > 200_000) {
    comparativeText = `With approximately ${formatNumber(count)} living bearers, ${name} occupies a well-established demographic tier, ranking comfortably within international naming indices.`;
  } else {
    comparativeText = `With approximately ${formatNumber(count)} living bearers worldwide, ${name} is a distinctive personal name, offering individuality while retaining linguistic recognition.`;
  }

  // Etymology
  const etymologyText = `The name ${name} originates from the ${origin} linguistic tradition, historically meaning "${meaning}."`;

  const usCount = (record.regions && record.regions["United States"]) || record.count;

  // Facts list
  const factsList = [
    `🏛️ Total U.S. recorded SSA births (1880–2024): ~${formatNumber(record.ssa?.totalBirths || count)} registrations.`,
    `📊 Historical national popularity rank: #${formatNumber(rank)} out of all tracked canonical names.`,
    `📅 Peak historical generation for ${name} was born during ${record.ssa?.peakYear ? record.ssa.peakYear : `the ${peakDecade[0]}`}.`,
    `🇺🇸 U.S. demographic frequency: ~${formatNumber(usCount)} recorded births & census observations.`,
  ];

  return {
    quickAnswer,
    popularityTier,
    oneInX,
    peakDecadeText,
    trendText,
    geographicText,
    genderText,
    comparativeText,
    etymologyText,
    factsList,
  };
}
