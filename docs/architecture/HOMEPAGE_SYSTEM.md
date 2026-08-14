# HowManyOfMe Canonical System Architecture & Product Specification

This document provides the permanent, canonical technical and product specification for **HowManyOfMe.co**, detailing the estimation engine, homepage architecture, tools ecosystem, content policies, data governance, and SEO/AEO guidelines.

---

## 1. Product Model & User Journey

The primary mission of HowManyOfMe is to answer:
> **"How many people have my name?"**

```text
                        Google / Direct Search
                                  │
                                  ↓
                        HowManyOfMe.co Homepage
                                  │
                                  ↓
                  Enter Name (First, Last, or Full)
                                  │
                                  ↓
                ┌───────────────────────────────────┐
                │   Does verified data exist in     │
                │   SSA (1880–2024) or 2020 Census? │
                └─────────────────┬─────────────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 │ YES                             │ NO
                 ↓                                 ↓
      Source-Backed Profile               Statistical Estimate
      (Exact Living Cohort Est.)          (Deterministic Bracket)
                 │                                 │
                 └────────────────┬────────────────┘
                                  │
                                  ↓
                       SAME-PAGE INLINE RESULT
                                  │
                ┌─────────────────┴─────────────────┐
                │                                   │
                ↓                                   ↓
      Explore Detailed Profile             Check Another Name
      (Canonical URL if indexed)           (Instant Reset)
```

---

## 2. Estimation Engine Architecture (`src/lib/estimation/`)

The shared estimation engine (`resolveNameSearch`) is the single source of truth across the homepage hero and tools.

### A. First-Name Estimation (`estimateFirstName.ts`)
1. **Verified Mode (`official-data`)**:
   - Matches canonical SSA given-name database (1880–2024).
   - Computes living cohort population using CDC & SSA Actuarial Life Tables.
   - Surfaces exact rank, peak birth year, gender split, and canonical link (`/name/[name]`).
2. **Modelled Mode (`derived-model`)**:
   - Evaluates valid unindexed names (e.g. *Rahul*, *Priya*, *Wei*, *Yuki*, *Min-jun*, *Zendaya*).
   - Generates deterministic demographic frequency tiers without fabricating false ranks, fake genders, or fake peak years.
   - **Crucial Rule**: `detailedProfileUrl: null` (never generates low-quality dynamic SEO pages).

### B. Full-Name Estimation (`resolveFullName.ts`)
- Computes joint demographic probability under statistical independence:
  $$\text{Estimated Living Bearers} = \frac{\text{First Name Living Count} \times \text{Surname Census Count}}{\text{U.S. Population Baseline (330M+)}}$$
- Supported by indexed canonical combinations (e.g. *James Smith*, *David Johnson*) linking to `/people/[slug]`.

### C. Normalization & Unicode Integrity (`normalizeName.ts`, `validateName.ts`)
- Preserves international Unicode letters, accents, diacritics, hyphens, and apostrophes (*José*, *Zoë*, *Søren*, *Anne-Marie*, *O'Connor*).
- Enforces strict anti-spam patterns, URL rejection, and numerical input rejection.

---

## 3. Truthful Content & Data Governance Policy

### Prohibited Unsupported Claims
- ⛔ "100M+ names across 80+ countries"
- ⛔ "Worldwide exact counts" / "Global census"
- ⛔ "±5% global accuracy"
- ⛔ "Quarterly global refresh from UK ONS, Eurostat, ABS"

### Verifiable Data Claims
- ✅ **U.S. Social Security Administration (SSA):** Given-name birth registrations from 1880 through 2024 (minimum 5 occurrences per sex/year).
- ✅ **U.S. Census Bureau:** 2020 Decennial Census first-names tabulation (53,615 names with $\ge 100$ occurrences) and Decennial Census Frequently Occurring Surnames.
- ✅ **Actuarial Life Tables:** CDC & SSA cohort survival tables for computing living demographic estimates.
- ✅ **330M+ Population Baseline:** U.S. national demographic baseline.

---

## 4. Homepage Hierarchy & Tool Ecosystem

### Homepage Layout (`src/pages/index.astro`)
1. **Header** (`SiteHeader.tsx`)
2. **Hero & Checker Tool** (`NameSearchHero.tsx`, `NameCheckerForm.tsx`, `NameEstimateCard.tsx`)
3. **AEO What This Estimate Means** (Definition of Source-Backed vs. Statistical Estimate)
4. **Popular First Names** (Top 15 given names derived from `getPopularNames()`)
5. **Popular Surnames** (Top 15 surnames derived from `getAllSurnames()`)
6. **Full-Name Discovery** (Common full-name joint probability combinations)
7. **How Name Estimates Work** (3-step evidence workflow)
8. **Name Directories** (First Names A–Z, Surnames, Full Names)
9. **Related Name Tools** (Popularity Checker, Name Comparison, Trend Visualizer, Random Name Explorer)
10. **Data Sources & Why Results Can Differ** (Cohort survival modeling vs. raw birth totals)
11. **Truthful FAQ Accordion** (9 questions with exact 1:1 synchronized `FAQPage` JSON-LD schema)
12. **Footer** (`SiteFooter.astro`)

### Tools Alignment (`src/pages/tools/`)
- **Popularity Checker (`/tools/popularity-checker`)**: Powered by `PopularityCheckerIsland.tsx` using `resolveNameSearch()`, rendering inline results without unexpected redirects.
- **Name Comparison (`/tools/name-comparison`)**: Side-by-side demographic comparison of historical peaks and living counts.
- **Trend Visualizer (`/tools/trend-visualizer`)**: Multi-decade popularity curves (1940s–2020s).
- **Random Name Explorer (`/tools/random-name`)**: Deterministic exploration across historical frequency tiers.

---

## 5. Verification & Health Audit Summary

- **Vitest Test Suite**: 43/43 tests passing across 8 test files (`npm test`).
- **Astro & TypeScript Diagnostics**: 0 errors, 0 warnings (`npm run check`).
- **SSG Static Production Build**: 2,599 pages built cleanly in ~13s (`npm run build`).
- **Canonical Parity**: 2,015 canonical URLs audited with 0 mismatches.
- **Internal Link Integrity**: 131,832 internal links audited with 0 broken links.
- **SEO Health Audit**: 0 errors, 0 warnings.
