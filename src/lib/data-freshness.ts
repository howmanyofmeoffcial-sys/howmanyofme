/**
 * Official Data Freshness & Source Provenance System
 * HowManyOfMe.co
 *
 * Central configuration for government data vintages, release years,
 * and automated freshness auditing.
 */

export interface SourceCitation {
  provider: string;
  datasetName: string;
  vintage: string;
  officialUrl: string;
  description: string;
}

export interface DataFreshnessConfig {
  latestAvailableBirthYear: number;
  sourceLastUpdated: string;
  ssaCoveragePeriod: string;
  censusVintage: string;
  citations: SourceCitation[];
}

export const DATA_FRESHNESS: DataFreshnessConfig = {
  latestAvailableBirthYear: 2025,
  sourceLastUpdated: "March 2026",
  ssaCoveragePeriod: "1880–2024 Historical Researcher Records + 2025 Annual Popularity Cohort",
  censusVintage: "2020 U.S. Decennial Census First-Name & Surname Tabulations",
  citations: [
    {
      provider: "Social Security Administration (SSA)",
      datasetName: "National Data on the Relative Frequency of Given Names",
      vintage: "1880–2024 / 2025 Annual Top Cohort",
      officialUrl: "https://www.ssa.gov/oact/babynames/limits.html",
      description: "Official Social Security card application records for births with >=5 occurrences per sex/year.",
    },
    {
      provider: "U.S. Census Bureau",
      datasetName: "Decennial Census Frequently Occurring Surnames & First Names",
      vintage: "2020 Decennial Tabulation",
      officialUrl: "https://www.census.gov/topics/population/genealogy/data/2010_surnames.html",
      description: "Self-reported given names and surnames occurring 100+ times nationwide in decennial enumerations.",
    },
    {
      provider: "Centers for Disease Control and Prevention (CDC / NCHS)",
      datasetName: "United States Life Tables & Actuarial Survival Curves",
      vintage: "National Vital Statistics System",
      officialUrl: "https://www.cdc.gov/nchs/products/life_tables.htm",
      description: "Age-specific cohort survival probabilities applied to historic annual birth registrations.",
    },
  ],
};

export function getLatestBirthYear(): number {
  return DATA_FRESHNESS.latestAvailableBirthYear;
}

export function getSourceLastUpdated(): string {
  return DATA_FRESHNESS.sourceLastUpdated;
}

export function getDataFreshnessInfo(): DataFreshnessConfig {
  return DATA_FRESHNESS;
}
