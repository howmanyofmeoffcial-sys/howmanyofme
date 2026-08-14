# Phase 11 — Data Capability Audit & Feature Matrix
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Feature Availability & Source Audit

| Feature | Data Available? | Source | Derived? | Coverage | Ready for UI? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Annual Birth History (1880–2024)** | ✅ Yes | SSA Popular Baby Names | No (Direct Ingestion) | 1880–2024 (145 years) | ✅ Ready (Full timeline + Peak year) |
| **Peak Year & Peak Births** | ✅ Yes | SSA Historical Records | Yes (Deterministic max) | 100% of canonical names | ✅ Ready |
| **Sex Breakdown (Male / Female Ratio)** | ✅ Yes | SSA Records & Census 2020 | Yes (Source-backed proportions) | 100% of canonical names | ✅ Ready |
| **Decade Popularity Index (1940s–2020s)** | ✅ Yes | SSA Decade Aggregation | Yes (Normalized 0–100 scale) | 9 decades | ✅ Ready |
| **Census 2020 Snapshot** | ✅ Yes | U.S. Census Bureau 2020 Tabulation | No (Official Decennial returns) | All names with $\ge 100$ counts | ✅ Ready (Distinct section) |
| **Actuarial Living Population Estimate** | ✅ Yes | Actuarial Life Cohort Model | Yes (Derived survival model) | 100% of canonical names | ✅ Ready (Explicitly labeled as estimate) |
| **Estimated Average Age** | ✅ Yes | Cohort Age Distribution Model | Yes (Weighted mean of surviving cohorts) | 100% of canonical names | ✅ Ready (Explicitly labeled as estimate) |
| **Geographic / State Distribution** | ✅ Yes | U.S. Census & Demographic Models | Yes (State-level frequency allocation) | 50 States + DC | ✅ Ready (Compact ranked table) |
| **Comparative Context (Similar Ranks)** | ✅ Yes | National Rank Index | Yes (Deterministic ranking) | 100% of canonical names | ✅ Ready |
| **International / Global Census Data** | ❌ No | N/A | N/A | U.S. only | ❌ Hidden (Zero fake global numbers) |

---

## 2. Rendering Rules & Graceful Fallbacks

1. **Facts vs. Estimates Separation**:
   - SSA historical birth registrations are labeled as **Observed Historical Registrations (1880–2024)**.
   - 2020 Census figures are labeled as **2020 Decennial Census Tabulations**.
   - Living population and average age are labeled as **Actuarial Demographic Estimates**.
2. **Missing Census Data**:
   - If a name is not present in the Census 2020 tabulation, the Census snapshot section displays an official explanatory notice (*"The name is not listed in the published 2020 Census first-name table of names with 100+ occurrences"*) rather than showing a fake `0`.
3. **No-JS Accessibility**:
   - All statistical metrics, summaries, and key historical points (peak year, recent 10-year trend, sex ratio) are fully server-rendered in HTML before any JavaScript executes.
   - Interactive charts act as visual enhancements via isolated React Islands (`client:visible`).
