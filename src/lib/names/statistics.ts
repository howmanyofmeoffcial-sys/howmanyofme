import type { NameRecord } from "./getName";

export interface TimelinePoint {
  year: number;
  births: number;
  male: number;
  female: number;
}

export interface StateShare {
  state: string;
  code: string;
  estimatedBearers: number;
  percentageOfTotal: number;
}

export interface StatisticalSummary {
  totalHistoricalBirths: number;
  estimatedLivingPeople: number;
  estimatedAverageAge: number;
  peakYear: number;
  peakBirths: number;
  recentBirths10Yr: number;
  recentTrendDirection: string;
  recentTrendPct: number;
  rank: number;
  maleShare: number;
  femaleShare: number;
  primarySex: string;
  censusCount: number | null;
  censusRank: number | null;
  stateDistribution: StateShare[];
  history: TimelinePoint[];
}

export function computeStatisticalSummary(record: NameRecord): StatisticalSummary {
  const totalHistoricalBirths = record.ssa?.totalBirths || record.count || 0;
  const estimatedLivingPeople = record.actuarial?.estimatedLiving || Math.round(totalHistoricalBirths * 0.65);
  const estimatedAverageAge = record.actuarial?.estimatedAverageAge || 42.0;

  const peakYear = record.ssa?.peakYear || 1955;
  const peakBirths = record.ssa?.peakYearBirths || Math.round(totalHistoricalBirths / 40);
  const recentBirths10Yr = record.ssa?.recentBirths || Math.round(totalHistoricalBirths * 0.08);
  const recentTrendDirection = record.ssa?.recentTrend?.direction || "stable";
  const recentTrendPct = record.ssa?.recentTrend?.percentChange || 0;

  const maleShare = record.sexBreakdown?.pctMale ?? (record.gender === "male" ? 98.0 : record.gender === "female" ? 2.0 : 50.0);
  const femaleShare = record.sexBreakdown?.pctFemale ?? (record.gender === "female" ? 98.0 : record.gender === "male" ? 2.0 : 50.0);
  const primarySex = record.sexBreakdown?.primarySex || record.gender;

  const censusCount = record.census2020?.count ?? null;
  const censusRank = record.census2020?.rank ?? null;

  const stateDistribution = record.stateDistribution || [
    { state: "California", code: "CA", estimatedBearers: Math.round(estimatedLivingPeople * 0.125), percentageOfTotal: 12.5 },
    { state: "Texas", code: "TX", estimatedBearers: Math.round(estimatedLivingPeople * 0.092), percentageOfTotal: 9.2 },
    { state: "Florida", code: "FL", estimatedBearers: Math.round(estimatedLivingPeople * 0.068), percentageOfTotal: 6.8 },
    { state: "New York", code: "NY", estimatedBearers: Math.round(estimatedLivingPeople * 0.061), percentageOfTotal: 6.1 },
    { state: "Pennsylvania", code: "PA", estimatedBearers: Math.round(estimatedLivingPeople * 0.040), percentageOfTotal: 4.0 },
  ];

  const history = record.ssa?.history || [];

  return {
    totalHistoricalBirths,
    estimatedLivingPeople,
    estimatedAverageAge,
    peakYear,
    peakBirths,
    recentBirths10Yr,
    recentTrendDirection,
    recentTrendPct,
    rank: record.rank,
    maleShare,
    femaleShare,
    primarySex,
    censusCount,
    censusRank,
    stateDistribution,
    history,
  };
}
