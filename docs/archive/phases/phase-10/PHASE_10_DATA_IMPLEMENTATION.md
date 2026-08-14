# Phase 10 — Real First-Name Data Infrastructure Implementation
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Data Sources
- **Social Security Administration (SSA)**: Popular Baby Names National Dataset (`names_1880_2024.json`), covering 1880–2024 with $\ge 5$ occurrences per year/sex.
- **U.S. Census Bureau**: 2020 Decennial Census First Names Tabulation (`census_2020_first_names.json`), covering 53,615 first names with $\ge 100$ occurrences.

---

## 2. Raw Data Management
- Raw snapshots are isolated in `src/data/raw/ssa/` and `src/data/raw/census/`.
- Full provenance details (provider, datasetName, datasetVersion, sourceUrl, license, checksums, downloadedAt) are recorded in `src/data/metadata/sources.json`.

---

## 3. Name Normalization
- Handled by `scripts/data/normalize-names.mjs` and `src/lib/names/normalizeName.ts`.
- Unicode NFC normalization for display names.
- ASCII-safe lowercase routing slugs with diacritics stripped.
- Canonical entity deduplication and Title Case display formatting.

---

## 4. Canonical Entity Model
- Defined in `src/lib/names/getName.ts` as `NameRecord`.
- Separates immutable source facts (`ssa.totalBirths`, `census2020.count`) from derived metrics (`rank`, `peakYear`, `recentBirths`, `decade_popularity`).

---

## 5. Derived Metrics Calculation
- **Peak Year & Births**: Determined from yearly historical SSA distribution. In case of ties, the earliest year is selected deterministically.
- **Recent Births Window**: Calculated over the 10-year window (2015–2024).
- **Derived Rank**: 1-based national popularity rank sorted by total SSA births descending.
- **Decade Popularity**: Normalized 0–100 index across 9 decades (1940s to 2020s).

---

## 6. Indexing & Storage
- Build-time key-value index generated at `src/data/generated/names-index.json`.
- Full entity list generated at `src/data/generated/canonical-names.json`.
- Zero raw CSV or oversized payloads shipped to the client browser.

---

## 7. Data Validation & Quality Gates
- `scripts/data/validate-names.mjs` enforces schema conformity, value bounds, aggregation sanity ($total = male + female$), zero duplicate normalized keys, and zero slug collisions.

---

## 8. Data Update Workflow
- Executed via `npm run data:update` (invokes `scripts/data/pipeline.mjs`).
- Never executes live network requests during normal `npm run build`.
- Fast, deterministic build times (~8 seconds for 1,243 static pages).

---

## 9. Data Versioning
- Version recorded as `2026.08.14` in `src/data/metadata/manifest.json`.
- Distinct tracking of source coverage years (1880–2024 for SSA, 2020 for Census).

---

## 10. Known Limitations
- SSA birth registrations reflect Social Security card applications at birth and are not identical to living population counts.
- The 2020 Census tabulation excludes names occurring fewer than 100 times in 2020 census returns.
