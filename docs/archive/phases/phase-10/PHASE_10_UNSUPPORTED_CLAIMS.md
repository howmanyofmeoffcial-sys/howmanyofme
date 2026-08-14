# Phase 10 Unsupported Claims Audit & Data Terminology Policy
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Executive Summary

As part of Phase 10 (Real First-Name Data Infrastructure), an extensive audit was conducted across the codebase to identify legacy marketing claims that overstated data breadth (e.g., claiming "100M+ global names across 80+ countries" or "exact living counts" when the underlying data is official U.S. Social Security Administration 1880–2024 birth registrations and U.S. Census 2020 returns).

In accordance with Phase 10 Section 18, 52, and 53 ("DATA TRUTH > PAGE COUNT > SEO SCALE > MARKETING CLAIMS"):
- Historical birth registration records are accurately labeled as **U.S. Historical Birth Data (SSA 1880–2024)** and **U.S. Decennial Census Tabulations (Census 2020)**.
- Derived values are accurately labeled as **Statistical Estimates / Derived Frequency Models**.
- Global/international claims are separated from validated U.S. datasets.

---

## 2. Inventory of Audited Claims

| Claim | Current Location | Source Evidence | Supported? | Replacement Terminology / Action |
| :--- | :--- | :--- | :--- | :--- |
| `"100M+ records from 80+ countries"` | `src/pages/index.astro` (FAQ, Hero description) | Official U.S. SSA (350M+ cumulative historical birth records) + U.S. Census 2020 | ❌ Misleading (Implies 80 separate national databases) | Replace with `"350M+ historical birth & census records covering 1880–2024"` |
| `"exact number of living people"` | `src/pages/index.astro`, `src/pages/name/[name].astro` | SSA historical birth registrations | ❌ Unsupported (SSA records births, not living population) | Replace with `"Estimated historical births & Census 2020 frequency"` |
| `"100M+ names · 80+ countries"` | `src/components/ToolCTA.astro`, `src/islands/NameSearchHero.tsx` | Legacy copy | ❌ Unsupported | Replace with `"Authoritative U.S. Social Security & Census data (1880–2024)"` |
| `"±5% accuracy guaranteed"` | `src/pages/about.astro`, `methodology.astro` | Statistical frequency modeling | ❌ Unsupported claim | Replace with `"Demographic modeling based on official public records"` |
| `"global bearers worldwide"` | `src/lib/names/insights.ts` | U.S. national records | ❌ Unsupported | Replace with `"U.S. historical birth records and demographic frequency"` |

---

## 3. Approved Terminology Policy

### ✅ Approved Terms
- **"U.S. Historical Birth Registrations (SSA 1880–2024)"**
- **"2020 Decennial Census Frequency Tabulations"**
- **"Estimated Historical Frequency"**
- **"Derived Peak Year & Decade Trends"**
- **"Official Public Domain Datasets"**

### ❌ Prohibited Terms (Unless separate verified international data is integrated)
- "Exact living population worldwide"
- "100M+ names from 80+ countries"
- "Guaranteed ±5% accuracy"
- "Global census database"
