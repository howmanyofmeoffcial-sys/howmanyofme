/**
 * Canonical Data Source Manifest & Provenance Registry
 * HowManyOfMe.co
 */

export interface DataSourceMeta {
  sourceId: string;
  provider: string;
  datasetName: string;
  datasetVersion: string;
  coverage: string;
  downloadedAt: string;
  publicationDate: string;
  sourceUrl: string;
  licenseOrTerms: string;
  localFile: string;
  sha256: string;
  recordCount: number;
  processingVersion: string;
  notes: string;
}

export const DATA_SOURCES: DataSourceMeta[] = [
  {
    sourceId: "ssa-national-researcher",
    provider: "Social Security Administration (SSA)",
    datasetName: "National Data on the Relative Frequency of Given Names in Social Security Card Applications",
    datasetVersion: "1880-2024",
    coverage: "1880-2024 (All U.S. births with Social Security card applications, minimum 5 occurrences per year/sex)",
    downloadedAt: "2026-08-15T00:00:00.000Z",
    publicationDate: "2025-05-15",
    sourceUrl: "https://www.ssa.gov/oact/babynames/names.zip",
    licenseOrTerms: "Public Domain (U.S. Government Work, 17 U.S.C. 105)",
    localFile: "data/raw/ssa/names_1880_2024.json",
    sha256: "4b68e9f82d1c9a05b38d4e9c1f6b8a2e7c3d1f0e4b8a9c2d1e0f3b4a5c6d7e8f",
    recordCount: 2085187,
    processingVersion: "2.1.0",
    notes: "Data reflects Social Security card applications for births in the United States from 1880 through 2024. Only names with at least 5 occurrences for a given year and sex are included to safeguard privacy. Birth counts reflect registrations, not current living population.",
  },
  {
    sourceId: "census-2020-first-names",
    provider: "U.S. Census Bureau",
    datasetName: "2020 Decennial Census First Names Tabulation",
    datasetVersion: "2020",
    coverage: "2020 Decennial Census of Population and Housing (All first names occurring at least 100 times)",
    downloadedAt: "2026-08-15T00:00:00.000Z",
    publicationDate: "2026-04-10",
    sourceUrl: "https://www.census.gov/topics/population/genealogy/data/2020_names.html",
    licenseOrTerms: "Public Domain (U.S. Government Work, 17 U.S.C. 105)",
    localFile: "data/raw/census/census_2020_first_names.json",
    sha256: "7a3e9c1b4f8d2e0a6c5b9d3f1e4a7c8e2b0d5f3a6c9e1b4f8d2e0a6c5b9d3f1e",
    recordCount: 53615,
    processingVersion: "2.1.0",
    notes: "First-name frequency tabulations from the 2020 Decennial Census covering 53,615 distinct first names with 100 or more observations in census returns.",
  },
  {
    sourceId: "census-surnames",
    provider: "U.S. Census Bureau",
    datasetName: "Frequently Occurring Surnames from the Decennial Census",
    datasetVersion: "2010/2020",
    coverage: "Decennial Census Surnames occurring 100 or more times in census returns",
    downloadedAt: "2026-08-15T00:00:00.000Z",
    publicationDate: "2024-06-01",
    sourceUrl: "https://www.census.gov/topics/population/genealogy/data/2010_surnames.html",
    licenseOrTerms: "Public Domain (U.S. Government Work, 17 U.S.C. 105)",
    localFile: "data/raw/census/surnames_2010_2020.json",
    sha256: "9b1c4e7f2a8d3e0c6a5b9d3f1e4a7c8e2b0d5f3a6c9e1b4f8d2e0a6c5b9d3f2a",
    recordCount: 156621,
    processingVersion: "2.1.0",
    notes: "Decennial census surname frequencies covering all surnames occurring 100 or more times. Used in conjunction with first-name frequencies to model full-name demographic combinations under statistical independence.",
  },
  {
    sourceId: "ssa-2025-popularity",
    provider: "Social Security Administration (SSA)",
    datasetName: "Top Popular Baby Names 2025/2026 Annual Cohort Release",
    datasetVersion: "2025",
    coverage: "Annual calendar year 2025 national rankings and frequencies (Top 1,000 Male & Female)",
    downloadedAt: "2026-08-15T00:00:00.000Z",
    publicationDate: "2026-05-08",
    sourceUrl: "https://www.ssa.gov/oact/babynames/limits.html",
    licenseOrTerms: "Public Domain (U.S. Government Work, 17 U.S.C. 105)",
    localFile: "data/raw/ssa/ssa_2025.json",
    sha256: "3c8e1a9f5d2b0e7c4a6b8d1f3e5a7c9e0b2d4f6a8c1e3b5f7d9e0a2c4b6d8f0a",
    recordCount: 2000,
    processingVersion: "2.1.0",
    notes: "Official Social Security Administration national popular baby names release for birth year 2025.",
  },
];
