# Phase 19 — Technical Debt Audit & Resolution
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Technical Debt Classification

| Priority | Category | Finding / Debt Item | Resolution / Status |
| :--- | :--- | :--- | :--- |
| **P0** | Architecture | Duplicate build pipelines or loose SPA fallbacks | **RESOLVED (Phase 9 pure Astro static build)** |
| **P0** | SEO / Routing | Broken internal links or canonical tag mismatches | **RESOLVED (100% parity, 0 broken links)** |
| **P1** | Documentation | Root-level clutter of 70+ unorganized phase reports | **RESOLVED (Phase 19 consolidated docs/ structure)** |
| **P1** | Performance | Ad layout shift (CLS) during ad network delivery | **RESOLVED (Zero-CLS container reservations)** |
| **P2** | Tooling | Health check script polluting git root with daily files | **RESOLVED (Moved to ignored reports/generated/)** |
| **P2** | Data Provenance| Undocumented mathematical demographic formulas | **RESOLVED (Consolidated in docs/data/METHODOLOGY.md)**|
| **P3** | Future Scalability| State-by-name full historical matrices | **DEFERRED (Hold for Phase 20 scale)** |

---

## 2. Remaining Deferred Items
1. **Full 50-State Single-Year Ingestion**: Currently, state distributions for top names are derived from aggregated SSA state files. Expanding to all 53,000+ long-tail names requires ingesting the 50-state historical matrix.
2. **Additional Head-to-Head Comparison Pairs**: Scaling from the current top 20 pilot cohort to top 100 pairings following 30-day indexability measurement.
