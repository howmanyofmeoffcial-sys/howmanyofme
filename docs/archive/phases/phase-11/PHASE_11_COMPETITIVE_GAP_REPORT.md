# Phase 11 — Structural Competitor Gap & Parity Report
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Feature & Data Parity Comparison

| Feature / Dimension | HowManyOfMe.co (Phase 11) | HowManyOfMe.org (Competitor) | Advantage / Evaluation |
| :--- | :--- | :--- | :--- |
| **Primary Quick Answer** | ✅ Server-rendered AEO card (Living estimate + SSA births + rank) | ✅ Living estimate based on independence assumption | 🟢 **HowManyOfMe.co**: Full SSR for instant crawlability & featured snippet extraction |
| **Annual Historical Timeline** | ✅ Full 1880–2024 SSA series + Recharts interactive island + SSR data table | ⚠️ Decade aggregate charts only | 🟢 **HowManyOfMe.co**: Single-year resolution and accessible tabular fallback |
| **Sex / Gender Breakdown** | ✅ Source-backed M vs F percentages & counts | ⚠️ Binary gender inference | 🟢 **HowManyOfMe.co**: Grounded in actual SSA application records |
| **Decennial Census 2020 Data** | ✅ Dedicated section with 2020 Decennial Census returns & ranks | ❌ None (Old Census 1990/2000 data) | 🟢 **HowManyOfMe.co**: Uses newly released 2020 Census first-name tabulations |
| **State Geographic Distribution** | ✅ Top 5 states demographic allocation table | ⚠️ Simple choropleth map | 🟡 **Parity**: Lightweight table with state shares; dedicated map island planned |
| **Actuarial Living Population Model** | ✅ Transparent CDC/NCHS Life Table cohort survival model | ⚠️ Modeled without formula transparency | 🟢 **HowManyOfMe.co**: Clearly documented methodology distinguishing births from living |
| **Estimated Average Age** | ✅ Cohort-weighted survival age | ❌ None | 🟢 **HowManyOfMe.co**: Unique demographic data point |
| **Methodology & Source Links** | ✅ Multi-part section with centralized SSA & Census citations | ⚠️ High-level methodology text | 🟢 **HowManyOfMe.co**: Full provenance, dataset versions, and coverage dates |
| **Data Freshness / Metadata** | ✅ Live manifest block (1880–2024 SSA, 2020 Census) | ❌ Stale copyright/data notices | 🟢 **HowManyOfMe.co**: Automated version tracking |
| **Full-Name `/people/[first-last]`** | ⏸️ Reserved for Phase 12 | ✅ First + Last name combinations | 🟡 **Planned**: Phase 12 will implement full surname & combination system |

---

## 2. Competitive Gaps Remaining for Future Phases

1. **Full-Name Combinations (Phase 12)**:
   - Ingesting official U.S. Census Surnames dataset (162,253 surnames) and implementing the joint probability independence model for full first+last combinations.
2. **State-Level Programmatic Hubs (Phase 13+)**:
   - Creating dedicated `/name/[name]/[state]` pages once search demand and granular SSA state-birth series are indexed.
