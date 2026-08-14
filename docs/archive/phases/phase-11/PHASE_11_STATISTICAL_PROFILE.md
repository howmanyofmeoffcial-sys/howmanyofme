# Phase 11 — Statistical Profile Architecture & Implementation
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## A. Entity Profile Architecture
The entity page architecture follows a strict data-flow model:
```text
Phase 10 Canonical Generated Dataset (names-index.json)
                         ↓
       computeStatisticalSummary(record) (statistics.ts)
                         ↓
        buildNameEntityProfile(record) (entityProfile.ts)
                         ↓
  /name/[name].astro (100% Server-Rendered HTML + Recharts Island)
```

---

## B. Data Fields Used
- **Identification**: `name`, `slug`, `normalizedName`, `origin`, `meaning`.
- **SSA Historical**: `ssa.totalBirths`, `ssa.maleBirths`, `ssa.femaleBirths`, `ssa.firstYear` (1880), `ssa.lastYear` (2024), `ssa.peakYear`, `ssa.peakYearBirths`, `ssa.recentBirths`, `ssa.recentTrend`.
- **Actuarial**: `actuarial.estimatedLiving`, `actuarial.estimatedAverageAge`, `actuarial.survivalModel`.
- **Census 2020**: `census2020.count`, `census2020.rank`, `census2020.pctMale`, `census2020.pctFemale`, `census2020.sourceYear`.
- **Geographic**: `stateDistribution` (ranked states, estimated bearers, share of total).
- **Sex Breakdown**: `sexBreakdown.male`, `sexBreakdown.female`, `sexBreakdown.pctMale`, `sexBreakdown.pctFemale`, `sexBreakdown.primarySex`.
- **Decades**: `decade_popularity` (9 normalized 0–100 index values from 1940s to 2020s).

---

## C. Historical Data Implementation
- **Interactive Island**: `src/islands/NameHistoryChart.tsx` loaded on `client:visible`, passing only the 30–40 milestone years for the single active name.
- **No-JS Semantic Fallback**: `<details>` expandable data table containing raw annual milestone counts (Year, Total, Male, Female) directly inside the initial HTML response.

---

## D. Sex Distribution
- Displayed via a responsive, accessible CSS dual-bar with exact counts and percentage shares derived directly from SSA application records.

---

## E. Census 2020 Snapshot
- Dedicated card highlighting official Decennial Census enumerations.
- Explicitly documents the official Census methodology (*"First-name tabulations covering names with 100+ occurrences in 2020 census returns"*).

---

## F. Geography
- Ranked state-level frequency table showing estimated living bearers across California, Texas, Florida, New York, Pennsylvania, and other populous jurisdictions.

---

## G. Actuarial Living Estimate
- Calculated by applying cohort survival probabilities from the CDC/NCHS Actuarial Life Tables to each single-year birth cohort from 1880 to 2024.
- Explicitly separated from lifetime cumulative birth counts.

---

## H. Methodology & Transparency
- Section 9 of the page breaks down the exact data pipeline:
  1. Social Security Administration (1880–2024)
  2. U.S. Census Bureau (2020)
  3. Actuarial Living Population Modeling
  4. State Population Allocation
  5. Limitations & Boundary Conditions

---

## I. Source Attribution & Data Freshness
- Displays live metadata from `src/data/metadata/manifest.json`:
  - SSA Coverage: `1880-2024`
  - Census Snapshot: `2020`
  - Manifest Version: `2026.08.14`
