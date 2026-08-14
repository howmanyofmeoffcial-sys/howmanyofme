# Data Pipeline & Reproducibility Guide
## Project: HowManyOfMe.co

---

## 1. Data Sources
The primary datasets are official public domain records provided by United States government agencies:
1. **Social Security Administration (SSA)**: Popular Baby Names National Dataset (1880–2024), covering all births with Social Security card applications in the U.S. with $\ge 5$ occurrences per year/sex.
2. **U.S. Census Bureau**: 2020 Decennial Census First Names Tabulation covering 53,615 distinct first names with $\ge 100$ occurrences in the 2020 Census.

---

## 2. Pipeline Architecture & Directory Structure

```text
src/data/
├── metadata/
│   ├── sources.json       # Source URLs, provider info, licenses, checksums
│   └── manifest.json      # Generated dataset manifest, versions, entity counts
├── raw/
│   ├── ssa/               # Versioned SSA historical birth records (1880-2024)
│   └── census/            # Versioned Census 2020 first-name tabulations
├── normalized/
│   ├── ssa_normalized.json    # Standardized annual male/female birth records
│   └── census_normalized.json # Standardized Census 2020 counts and ratios
├── derived/
│   └── names_derived.json     # Calculated peak years, recent totals, ranks, decades
└── generated/
    ├── names-index.json       # High-speed key-value index (by name & slug)
    └── canonical-names.json   # Full canonical entity list for build generation
```

---

## 3. Step-by-Step Data Execution Workflow

```text
[Official Sources] 
        ↓
npm run data:update  (or: node scripts/data/pipeline.mjs)
        ↓
1. fetch-ssa.mjs          → Snapshot SSA raw archive
2. parse-ssa.mjs          → Extract name, sex, annual counts (1880–2024)
3. parse-census.mjs       → Extract Census 2020 returns & sex breakdowns
4. validate-names.mjs     → Automated schema, bounds, duplicate & slug collision checks
5. build-derived-data.mjs → Calculate peakYear, recentBirths (2015–2024), rank, decades
6. generate-app-data.mjs  → Emit names-index.json, canonical-names.json, manifest.json
7. report.mjs             → Print data quality & provenance report
```

---

## 4. Normalization Rules
- **Display Name**: Title Case (e.g., `"James"`, `"Mary"`), preserving Unicode accents where present.
- **Normalized Key**: Lowercased, whitespace-trimmed string (e.g., `"james"`, `"mary"`).
- **Routing Slug**: ASCII-safe, lowercased, diacritics stripped, hyphenated (e.g., `/name/James`).
- **Standard Name Filter**: Only tokens with 2–50 characters composed of valid Unicode letters, hyphens, and apostrophes are accepted.

---

## 5. Automated Quality Checks & Sanity Bounds
- **Schema Check**: Mandatory non-empty `name`, `normalizedName`, `slug`, `totalBirths`, `firstYear`, `lastYear`.
- **Value Bounds**: $totalBirths \ge 0$, $maleBirths \ge 0$, $femaleBirths \ge 0$, $1880 \le year \le 2024$.
- **Duplicate Prevention**: 0 duplicate canonical entities allowed per normalized name.
- **Slug Collisions**: 0 collisions allowed across distinct entities.
- **Aggregation Identity**: $totalBirths \equiv maleBirths + femaleBirths$.

---

## 6. How to Update or Rebuild Data
- **Full Ingestion Update**: `npm run data:update`
- **Rebuild Generated Index**: `npm run data:build`
- **Validate Data Integrity**: `npm run data:validate`
- **Inspect Quality Report**: `npm run data:report`
