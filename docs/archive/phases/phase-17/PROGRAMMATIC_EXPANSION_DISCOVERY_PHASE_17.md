# Phase 17 — Programmatic SEO Expansion Discovery & Intent Audit
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Candidate Expansion Verticals Audit

We evaluated 8 potential programmatic search verticals against our strict 10-point Expansion Gate:
1. Search demand evidence
2. Distinct user search intent
3. Reliable official source data
4. Sufficient unique page value
5. Canonical URL design
6. Internal linking architecture
7. Indexability strategy
8. Sitemap integration
9. Zero performance/CWV regression
10. Monetization & business relevance

---

## 2. Vertical Evaluation Matrix

| Vertical | Target URL Pattern | Source Data | Search Intent | Demand | Cannibalization Risk | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Standalone Surname Entities** | `/last-name/[surname]` | U.S. Census Bureau Surnames | "How common is the surname Smith?" | **VERY HIGH** | **LOW** (Distinct from given names) | **SELECTED (TOP 1 PILOT)** |
| **Head-to-Head Comparisons** | `/name-comparison/[nameA]-vs-[nameB]` | SSA 1880–2024 Series | "Liam vs Noah popularity comparison" | **HIGH** | **LOW** (Controlled top pairs) | **SELECTED (TOP 2 PILOT)** |
| **Name by State** | `/name/[name]/[state]` | State Census Estimates | "How common is David in Texas?" | Medium | Medium | ⏸️ **HOLD** (Pending full state matrix) |
| **Name by Decade** | `/name/[name]/[decade]` | SSA Decades | "David popularity in 1950s" | Low | High (Covered on `/name/[name]`) | ❌ **REJECTED** (Cannibalizes `/name/*`) |
| **Country Expansion** | `/name/[name]/[country]` | Global registries | "David name popularity in UK/India" | High | Low | ❌ **REJECTED** (Zero non-US data ingested) |
| **Rarest Names Hub** | `/rarest-names` | SSA Low-Cohort (5–10 births) | "Rarest American baby names" | Medium | Low | ⏸️ **FUTURE CONSIDERATION** |
| **Popularity by Year Hub** | `/most-popular-names/[year]` | SSA Annual Top 100 | "Most popular baby names in 2024" | High | Low | ⏸️ **FUTURE CONSIDERATION** |
