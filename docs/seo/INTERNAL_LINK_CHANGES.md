# Canonical Internal Link Change Log

**Project:** HowManyOfMe.co  
**Implementation Date:** August 15, 2026  
**Status:** Deployed & Verified  

---

## 1. Summary of Linking Modifications

| Source URL | Target URL(s) | Anchor Text / UI Element | Semantic Reason |
| :--- | :--- | :--- | :--- |
| `src/pages/name/[name].astro` | `/people/[fullName]` (20 full names per name) | `{displayName} (~{estimatedPeople} people)` | Surfaces all verified full-name combinations for each canonical first name. |
| `src/pages/name/[name].astro` | `/name-comparison/[slug]` | `{nameA} vs {nameB} (Compare side-by-side →)` | Connects first names to their head-to-head comparison matchups. |
| `src/pages/last-name/[surname].astro` | `/people/[fullName]` (up to 40 full names per surname) | `{displayName} (~{estimatedPeople} people →)` | Surfaces all verified full-name combinations for each canonical surname. |
| `src/pages/tools/name-comparison.astro` | `/name-comparison/[slug]` (all 20 pairs) | `{nameA} vs {nameB} (Compare Stats →)` | Hub-to-spoke link connecting all precomputed comparison matchups. |
| `src/pages/similar-names/[name].astro` | `/similar-names/[match]` | `Similar to {name} →` | Cross-links similar-name hubs to form an interconnected soundalike graph. |
| `src/pages/similar-names/[name].astro` | `/tools/popularity-checker`, `/tools/trend-visualizer` | `Popularity & Rarity Checker`, `Historical Trend Visualizer` | Contextual research journey from soundalike exploration to demographic trends. |
| `src/pages/data/index.astro` | `/research/name-popularity-by-decade` | `How First-Name Popularity Changed Across U.S. Birth Decades (Read Research Report →)` | Primary feature card connecting open datasets to in-depth research analysis. |
| `src/components/SiteFooter.astro` | `/disclaimer` | `Disclaimer` | Connects legal disclaimer page sitewide across every page footer. |

---

## 2. Helper & Function Adjustments

* **`src/lib/fullNames/data.ts`**: Refactored `getRelatedFullNames` to remove restrictive half-limit slicing when single parameters are passed (`firstName` or `lastName`), allowing complete parent-child entity linking.
* **`src/lib/comparisons/data.ts`**: Added `getComparisonsForName` helper to associate individual first-name entities with their relevant comparison pairs.
