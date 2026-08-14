# Migration Phase 5 Documentation
## Programmatic Content Quality + AEO + GEO + Entity Page Differentiation
## Project: HowManyOfMe.co

---

## 1. Content Architecture & Answer-First Structure

Phase 5 upgrades HowManyOfMe.co's programmatic entity page template (`/name/[name].astro`) to deliver an **Answer-First, Highly Differentiated, and Factually Transparent** experience optimized for human users, traditional search engines, Featured Snippets, and AI answer engines (ChatGPT, Google AI Overviews, Perplexity).

```text
       1. Header & Breadcrumb Navigation
                       │
                       ▼
       2. H1: How Many People Are Named [Name]?
                       │
                       ▼
       3. ⚡ Quick Answer Card (AEO / Snippet Target)
          ├── Direct living bearer count & global rank
          ├── 1-in-X frequency calculation
          ├── 4 key metric pills (Count, Rank, Tier, Origin)
                       │
                       ▼
       4. Visual Report Island (NameInsightReport)
                       │
                       ▼
       5. Entity-Specific Demographic Insights
          ├── Comparative benchmarking vs anchor names
          ├── Historical peak decade & 2-decade trend delta
          ├── Multi-country concentration percentages
          ├── Statistical gender split & etymological roots
                       │
                       ▼
       6. Methodological Disclosure & Actuarial Model Details
                       │
                       ▼
       7. Natural Structured FAQs (matching FAQPage JSON-LD)
                       │
                       ▼
       8. Semantic Link Graph (Similar, Origin, Alphabet, Tools)
```

---

## 2. Data Quality & Completeness Model (`src/lib/names/contentQuality.ts`)

Every record is evaluated against a 100-point deterministic grading model:

- **Tier A — Strong (Score >= 85)**: 20 curated records with bespoke historical benchmarks, exact SSA rank (1–20), and complete regional matrices.
- **Tier B — Usable (Score 65–84)**: 563 model-enhanced records with verified 9-decade trends (1940s–2020s), international regional distribution, linguistic origin, etymology, and dynamic FAQs.
- **Tier C — Insufficient (Score < 65)**: 0 records. Thin or incomplete records are filtered at the build gate to prevent thin page indexing.

---

## 3. Entity Differentiation vs. Template Content

| Content Area | Template Architecture | Entity-Specific Substance |
| :--- | :--- | :--- |
| **Quick Answer** | Unified Answer-First Layout | Exact living bearer count, global rank, and 1-in-X frequency ratio |
| **Trend Analysis** | Standard Decade Grid (1940s–2020s) | Dynamic calculation of peak historical decade and recent 2-decade trend delta |
| **Geographic Context**| Sorted Percentage Bars | Real estimated bearers by country (US, UK, Canada, Australia, etc.) |
| **Comparative Context**| Benchmarking Framework | Automatic comparison against benchmark names in comparable popularity brackets |
| **Structured Data** | `WebPage`, `FAQPage`, `BreadcrumbList` | Entity `about: { @type: "Thing", name: ... }` targeting the specific linguistic entity |

---

## 4. AEO & GEO Optimization Strategy

- **Featured Snippet Direct Target**: The Quick Answer block directly addresses the query *"How many people have the name [Name]?"* in plain, high-authority natural language without requiring scrolling through ads or widgets.
- **AI Citation Clarity (GEO)**: Headings, statistics, units (living bearers), dates (1880–present, 2026.1 dataset), geographic scope (80+ countries), and sources (U.S. Social Security Administration, U.S. Census Bureau, UN actuarial survival curves) are explicitly declared in the static HTML.
- **No Client-Side Dependency for Core Content**: 100% of the editorial text, tables, statistics, and schemas are pre-rendered into the initial HTML document.
