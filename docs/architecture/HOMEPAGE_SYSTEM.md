# Homepage Architecture & Content System

This document outlines the product-led architecture, content policy, demographic estimation models, and SEO/AEO guidelines for the HowManyOfMe.co homepage.

---

## 1. Homepage Structure & Hierarchy

The homepage is organized in a clean, tool-first, evidence-backed hierarchy:

```text
1. Header (<SiteHeader client:idle />)
2. Hero & Name Checker Tool (<NameSearchHero client:load />)
   ├── Mode Switcher: First Name vs. Full Name
   ├── Inline Real-Time Result (<NameEstimateCard />)
   └── Quick Reset / Check Another Name
3. AEO Answer Block & What This Estimate Means
   ├── Source-Backed Profile definition
   ├── Statistical Estimate definition
   └── Census boundary & living cohort disclaimer
4. Popular First Names Grid (dynamic via getPopularNames())
5. Popular Surnames Grid (dynamic via getAllSurnames())
6. Full-Name Discovery & Probability Combinations
7. How Name Estimates Work (3-Step process)
8. Name Directories Navigation (First Names A–Z, Surnames, Full Names)
9. Related Name Statistics Tools (Popularity, Comparison, Trends, Random Explorer)
10. Data Sources & Methodology (SSA 1880–2024, Census 2020, CDC Actuarial Life Tables)
11. Why Results Can Differ (AEO-optimized comparative clarity)
12. Truthful FAQ Accordion (8–10 verified questions with matching JSON-LD Schema)
13. Footer (<SiteFooter />)
```

---

## 2. Truthful Content & Data Claims Policy

### Unsupported Claims Strictly Prohibited
- ⛔ "100M+ names across 80+ countries" (Unless officially ingested)
- ⛔ "Worldwide exact counts" / "Global census"
- ⛔ "±5% global accuracy"
- ⛔ "Quarterly global refresh from UK ONS, Eurostat, ABS"

### Canonical Data Claims
- ✅ **U.S. Social Security Administration (SSA):** 1880–2024 given-name birth application records.
- ✅ **U.S. Census Bureau:** 2020 Decennial Census first-names tabulations (53,615 given names with $\ge 100$ occurrences) and Decennial Frequently Occurring Surnames.
- ✅ **Actuarial Survival Curves:** CDC & SSA cohort life tables for estimating current living bearers from historical birth registrations.
- ✅ **330M+ Population Baseline:** U.S. national demographic baseline.

---

## 3. Estimation & Result Wording

| Result Type | Badge | Description & Behavior |
| :--- | :--- | :--- |
| **Source-Backed Profile** | `🟢 Source-Backed Profile` | Direct match in canonical SSA/Census datasets. Displays exact living estimate, national rank, gender distribution, and links to canonical profile `/name/[name]`. |
| **Statistical Estimate** | `🟡 Statistical Estimate` | Unindexed valid name. Computes deterministic demographic frequency tier based on U.S. name distributions. **Never generates fake unvetted SEO pages** (`detailedProfileUrl: null`). |
| **Full-Name Combination** | `🔵 Full Name Analysis` | Joint demographic probability combining first-name living cohorts with Decennial Census surname frequencies under statistical independence. |

---

## 4. FAQ Policy & Schema Synchronization

- The homepage maintains **8–10 focused, truthful FAQs** covering core user intents.
- **Strict Rule:** Every question in the visible accordion must have an exact 1:1 match in the structured `FAQPage` JSON-LD schema. No phantom or removed FAQs may exist in schema.

---

## 5. Tool UX & Core Flow

- **Zero Immediate Redirection:** Searches resolve inline on the homepage without navigating away or forcing page reloads.
- **Interruption-Free Flow:** No ad slots or disruptive banners are placed between the hero input and the inline result card.
- **Accessible & Responsive:** Supports mobile viewports, high contrast dark/light themes, keyboard navigation, and `prefers-reduced-motion` scrolling.
