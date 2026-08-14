# Phase 13 Architecture — SERP Growth Engine & Query Clustering
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## A. GSC Data Pipeline
- Automated ingest and normalization of Google Search Console performance data in `data/seo/normalized/query_page_dataset.json`.
- Preserves periodic historical snapshots in `data/seo/snapshots/` to benchmark before/after impact of SEO experiments.

---

## B. Query Clustering
- Managed by `src/lib/seo/queryClusters.ts`.
- Maps queries deterministically into 6 distinct classes: `brand`, `first-name`, `full-name`, `directory`, `tool`, and `informational`.
- Clusters multiple query variations (e.g. *"how many people have the name David"*, *"how common is David"*) to a single canonical entity page (`/name/David`).

---

## C. Page Classification & Mapping
- Routes classified into:
  - Homepage (`/`)
  - First-Name Pages (`/name/*`)
  - Full-Name Pages (`/people/*`)
  - Letter Directories (`/names/*`)
  - Tools (`/tools/*`)
  - Educational Articles (`/blog/*`)

---

## D. Opportunity Detection
- **Positions 4–10**: Striking distance targets with high impressions where small CTR or AEO optimizations yield massive click gains.
- **Positions 11–20**: Second-page targets requiring internal link equity and topical depth.
- **Low CTR / High Impressions**: Queries with suboptimal title hooks or missing numeric anchors.

---

## E. Competitor Analysis
- Continuous benchmarking against legacy statistical databases and baby-name directories documented in [COMPETITOR_GAP_MATRIX_PHASE_13.md](file:///Users/riponchakma/Downloads/Howmanyofme/COMPETITOR_GAP_MATRIX_PHASE_13.md).

---

## F. Query/Page Matching
- Strict single-canonical-entity architecture prevents internal cannibalization or thin doorway proliferation.

---

## G. CTR Optimization
- Title and snippet formulas frontload verbatim entity names, verified living population numbers, and official SSA/Census authority markers.

---

## H. Internal-Link Optimization
- Reciprocal linking architecture connects `/name/[first]` $\leftrightarrow$ `/people/[first]-[last]`, preserving shallow crawl depth ($\le 3$ clicks from homepage).

---

## I. Indexation Monitoring
- Verified 1,942 canonical production URLs in sitemap with 0 404s, 0 duplicate titles, and 0 missing canonical tags.

---

## J. SEO Experimentation
- Systematic tracking in [SEO_EXPERIMENT_LOG.md](file:///Users/riponchakma/Downloads/Howmanyofme/SEO_EXPERIMENT_LOG.md) across predefined page cohorts.

---

## K. Programmatic Expansion Rules
- New programmatic page types require:
  1. Real verified search demand.
  2. Distinct user intent.
  3. Authoritative public data.
  4. Scalable generation pipeline.
  5. Zero cannibalization of existing entities.

---

## L. Monetization Alignment
- Answer-first priority ensures monetization ad slots never interrupt the primary featured snippet or living population answer.
