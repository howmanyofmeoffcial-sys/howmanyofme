export interface ResearchFinding {
  id: string;
  topic: string;
  headline: string;
  finding: string;
  keyMetric: string;
  metricValue: string | number;
  source: string;
  coveragePeriod: string;
  methodology: string;
  citationText: string;
}

export const CANONICAL_RESEARCH_FINDINGS: ResearchFinding[] = [
  {
    id: "historical-male-champion",
    topic: "All-Time Name Popularity",
    headline: "James Remains the Most Registered Male Given Name in U.S. History",
    finding: "Between 1880 and 2024, official Social Security Administration records document 4,712,453 birth applications for the name James, making it the #1 all-time male given name.",
    keyMetric: "Total SSA Historical Births",
    metricValue: "4,712,453",
    source: "U.S. Social Security Administration (SSA 1880–2024)",
    coveragePeriod: "1880–2024",
    methodology: "Cumulative summation of single-year birth applications with $\ge 5$ occurrences per year/sex.",
    citationText: "HowManyOfMe.co (2026). U.S. Historical Given Name Statistics (1880–2024). Derived from official Social Security Administration datasets.",
  },
  {
    id: "historical-female-champion",
    topic: "All-Time Name Popularity",
    headline: "Mary Holds the Longest Unbroken #1 Run in American History",
    finding: "Mary ranked as the #1 female newborn name for over 60 consecutive years from 1880 to 1946, totaling over 3.2 million recorded historical births.",
    keyMetric: "Consecutive #1 Years",
    metricValue: "66 Years (1880–1946)",
    source: "U.S. Social Security Administration (SSA 1880–2024)",
    coveragePeriod: "1880–2024",
    methodology: "Historical annual rank tracking across official SSA birth cohorts.",
    citationText: "HowManyOfMe.co (2026). Historical Analysis of American Baby Name Trends. Social Security Administration Historical Tabulations.",
  },
  {
    id: "census-2020-first-names",
    topic: "Decennial Census First Names",
    headline: "2020 Decennial Census Tabulates 53,615 Distinct First Names",
    finding: "The U.S. Census Bureau's first-name tabulation from the 2020 Decennial Census identified 53,615 distinct first names with 100 or more observations in returns.",
    keyMetric: "Tabulated Distinct First Names",
    metricValue: "53,615",
    source: "U.S. Census Bureau (2020 Decennial Census)",
    coveragePeriod: "2020",
    methodology: "Decennial Census return analysis with privacy threshold of 100+ occurrences.",
    citationText: "HowManyOfMe.co (2026). 2020 Decennial Census First Name Analysis. U.S. Census Bureau Tabulations.",
  },
  {
    id: "actuarial-living-model",
    topic: "Living Population vs Births",
    headline: "Lifetime Birth Counts Overestimate Living Bearers by 35–40%",
    finding: "Applying CDC/NCHS cohort life table survival probabilities reveals that cumulative historical births exceed current living population by approximately 35% to 40% for established names.",
    keyMetric: "Cohort Survival Multiplier",
    metricValue: "0.60–0.65",
    source: "CDC / National Center for Health Statistics (NCHS) Actuarial Life Tables",
    coveragePeriod: "1880–2024",
    methodology: "Single-year cohort survival probability modeling applied to annual birth series.",
    citationText: "HowManyOfMe.co (2026). Actuarial Living Name Population Modeling. CDC/NCHS Life Table Applications.",
  },
];
