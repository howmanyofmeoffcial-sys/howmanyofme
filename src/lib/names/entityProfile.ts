import type { NameRecord } from "./getName";
import { computeStatisticalSummary, type StatisticalSummary } from "./statistics";
import { formatNumber } from "../../data/nameData";

export interface NameEntityProfile {
  name: string;
  slug: string;
  rank: number;
  origin: string;
  meaning: string;
  stats: StatisticalSummary;
  availability: {
    hasHistory: boolean;
    hasCensus: boolean;
    hasActuarial: boolean;
    hasStateDistribution: boolean;
    hasSexBreakdown: boolean;
  };
  insights: {
    quickAnswer: string;
    popularitySummary: string;
    peakInsight: string;
    recentTrendInsight: string;
    sexInsight: string;
    censusInsight: string;
    livingEstimateInsight: string;
    geographicInsight: string;
    comparativeInsight: string;
    methodologyNotes: string[];
  };
}

export function buildNameEntityProfile(record: NameRecord): NameEntityProfile {
  const stats = computeStatisticalSummary(record);

  const hasHistory = stats.history.length > 0;
  const hasCensus = stats.censusCount !== null;
  const hasActuarial = Boolean(record.actuarial && record.actuarial.estimatedLiving > 0);
  const hasStateDistribution = stats.stateDistribution.length > 0;
  const hasSexBreakdown = Boolean(record.sexBreakdown);

  // 1. Quick Answer (AEO / Featured Snippet target)
  const quickAnswer = `An estimated ${formatNumber(stats.estimatedLivingPeople)} living people in the United States currently share the first name ${record.name}. In total, official Social Security Administration records document ${formatNumber(stats.totalHistoricalBirths)} U.S. birth applications with this name between 1880 and 2024, ranking it #${formatNumber(stats.rank)} in all-time national frequency.`;

  // 2. Popularity Tier
  let popularityTier = "Rare Name";
  if (stats.rank <= 100) popularityTier = "Top 100 National Classic";
  else if (stats.rank <= 500) popularityTier = "Common First Name (Top 500)";
  else if (stats.rank <= 2000) popularityTier = "Well-Established First Name";
  else popularityTier = "Distinctive First Name";

  const popularitySummary = `${record.name} is classified as a ${popularityTier}. Approximately ${stats.maleShare}% of recorded historical birth registrations for this name are male and ${stats.femaleShare}% are female.`;

  // 3. Peak Year Insight
  const peakInsight = `The single highest historical peak for ${record.name} occurred in ${stats.peakYear}, with ${formatNumber(stats.peakBirths)} recorded newborn registrations in that single year.`;

  // 4. Recent Trend Insight
  let recentTrendInsight = "";
  if (stats.recentTrendDirection === "rising") {
    recentTrendInsight = `In recent years (2015–2024), ${record.name} has demonstrated upward momentum, rising approximately ${stats.recentTrendPct}% in registration frequency.`;
  } else if (stats.recentTrendDirection === "declining") {
    recentTrendInsight = `Between 2015 and 2024, ${record.name} experienced a ${Math.abs(stats.recentTrendPct)}% softening in newborn registration counts compared to preceding cohorts.`;
  } else {
    recentTrendInsight = `${record.name} has maintained a stable, consistent registration trajectory across recent 2015–2024 birth cohorts.`;
  }

  // 5. Sex Distribution Insight
  let sexInsight = "";
  if (stats.maleShare >= 95) {
    sexInsight = `Official registration data reflects that ${record.name} is overwhelmingly used as a masculine first name (${stats.maleShare}% male births).`;
  } else if (stats.femaleShare >= 95) {
    sexInsight = `Official registration data reflects that ${record.name} is overwhelmingly used as a feminine first name (${stats.femaleShare}% female births).`;
  } else if (stats.maleShare >= 75) {
    sexInsight = `Historically, ${record.name} has been predominantly masculine (${stats.maleShare}% male, ${stats.femaleShare}% female).`;
  } else if (stats.femaleShare >= 75) {
    sexInsight = `Historically, ${record.name} has been predominantly feminine (${stats.femaleShare}% female, ${stats.maleShare}% male).`;
  } else {
    sexInsight = `${record.name} represents a balanced gender-neutral name with significant usage across both male (${stats.maleShare}%) and female (${stats.femaleShare}%) registrations.`;
  }

  // 6. Census Insight
  const censusInsight = hasCensus
    ? `In the 2020 Decennial U.S. Census first-name tabulations, ${record.name} appeared ${formatNumber(stats.censusCount!)} times, ranking #${formatNumber(stats.censusRank!)} among all first names observed in 2020 returns.`
    : `The name ${record.name} does not appear in the published 2020 Census table of first names occurring 100+ times, indicating it is an uncommon or historically localized name in decennial returns.`;

  // 7. Living Estimate Insight
  const livingEstimateInsight = `Based on cohort survival models applied to 1880–2024 SSA birth registrations, an estimated ${formatNumber(stats.estimatedLivingPeople)} people named ${record.name} are living today in the U.S., with an estimated average age of ${stats.estimatedAverageAge} years.`;

  // 8. Geographic Insight
  const topState = stats.stateDistribution[0];
  const geographicInsight = topState
    ? `The largest concentration of living bearers is estimated in ${topState.state} (~${formatNumber(topState.estimatedBearers)} individuals, accounting for ${topState.percentageOfTotal}% of all U.S. bearers).`
    : `Bearers of the name ${record.name} are distributed across all 50 U.S. states.`;

  // 9. Comparative Insight
  const comparativeInsight = stats.rank <= 50
    ? `Ranking at #${formatNumber(stats.rank)} out of thousands of canonical names, ${record.name} shares historical rarity tiers with enduring classics like William, John, and Elizabeth.`
    : stats.rank <= 500
    ? `Ranking at #${formatNumber(stats.rank)}, ${record.name} is a widely familiar name that maintains strong recognition across American generations.`
    : `Ranking at #${formatNumber(stats.rank)}, ${record.name} offers distinct individual character while preserving established historical pedigree.`;

  // 10. Methodology Notes
  const methodologyNotes = [
    "U.S. Social Security Administration (SSA) Baby Names Dataset (1880–2024): All historical births with Social Security card applications (minimum 5 occurrences per year/sex).",
    "U.S. Census Bureau 2020 Decennial Census: First-name frequency tabulations covering 53,615 distinct names occurring 100+ times in 2020 census returns.",
    "Actuarial Living Estimates: Calculated by multiplying birth cohorts from 1880 to 2024 by CDC/NCHS life table survival probabilities to estimate living population rather than lifetime cumulative births.",
    "State Distributions: Demographic frequency allocation proportional to state census population weights.",
  ];

  return {
    name: record.name,
    slug: record.slug,
    rank: record.rank,
    origin: record.origin,
    meaning: record.meaning,
    stats,
    availability: {
      hasHistory,
      hasCensus,
      hasActuarial,
      hasStateDistribution,
      hasSexBreakdown,
    },
    insights: {
      quickAnswer,
      popularitySummary,
      peakInsight,
      recentTrendInsight,
      sexInsight,
      censusInsight,
      livingEstimateInsight,
      geographicInsight,
      comparativeInsight,
      methodologyNotes,
    },
  };
}
