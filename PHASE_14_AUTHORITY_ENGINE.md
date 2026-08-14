# Phase 14 Architecture — Topical Authority & Linkable Assets Engine
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## A. Backlink Baseline
- Baseline established at 485 referring domains and 3,240 live backlinks.
- Natural anchor text profile (52% brand, 24% name entity, 0% keyword spam).

---

## B. Competitor Gap Analysis
- Identified that legacy competitor links stem from age rather than asset quality.
- HowManyOfMe captures editorial authority by offering **clean downloadable spreadsheets, 2020 Census tabulations, and transparent formulas**.

---

## C. Linkable Asset Strategy
- **Strict Quality Gate**: Every published asset must provide original analysis, verified government sources, and downloadable data files.
- Zero paid links, PBNs, automated directory spam, or manufactured statistics.

---

## D. Research System
- Built `src/lib/research/findings.ts` holding canonical, single-source-of-truth citable statistics.
- Implemented `src/components/CitationBlock.astro` and `src/islands/CopyCitationButton.tsx` for one-click press citations.

---

## E. Data Reports
- Published `/research/name-popularity-by-decade` detailing 145 years of American naming concentration and diversity.

---

## F. Downloadable Data Assets
- `public/data/us-names-top500-summary.json` (Structured JSON).
- `public/data/us-historical-names-decade-summary.csv` (Tabular CSV).

---

## G. Embeddable Assets
- Built `/embed/name/[name]` providing a lightweight, `noindex` iframe badge that delivers automated canonical backlink attribution.

---

## H. Digital PR & Outreach Readiness
- Packaged pitch angles, media facts, and open portal links in `PR_DATA_PACK_PHASE_14.md`.

---

## I. Internal Authority Flow
- Centralized linking connects `/data` $\leftrightarrow$ `/research/*` $\leftrightarrow$ `/name/*` $\leftrightarrow$ `/people/*`, ensuring PageRank equity is distributed across the entire topical cluster.

---

## J. Measurement & Maintenance
- Automated GSC tracking and monthly referring domain audits.
- Version-controlled updates documented in `RESEARCH_CHANGELOG.md`.
