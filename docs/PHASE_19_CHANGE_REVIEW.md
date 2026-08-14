# Phase 19 — Change Review & Ledger
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Documentation Relocation & Archiving Ledger

### A. Root to `docs/archive/phases/`
- `MIGRATION_PHASE_1.md` $\rightarrow$ `docs/archive/phases/phase-01/`
- `MIGRATION_PHASE_3*.md`, `NAME_DATA_AUDIT_PHASE_3.md` $\rightarrow$ `docs/archive/phases/phase-03/`
- `MIGRATION_PHASE_4*.md`, `INTERNAL_LINK_AUDIT_PHASE_4.md` $\rightarrow$ `docs/archive/phases/phase-04/`
- `MIGRATION_PHASE_5*.md`, `PROGRAMMATIC_CONTENT_AUDIT_PHASE_5.md` $\rightarrow$ `docs/archive/phases/phase-05/`
- `MIGRATION_PHASE_6*.md`, `PERFORMANCE_*.md`, `THIRD_PARTY_*.md` $\rightarrow$ `docs/archive/phases/phase-06/`
- `MIGRATION_PHASE_7_REPORT.md`, `PRODUCTION_*.md`, `TECHNICAL_SEO_*.md`, `GSC_PRE_CUTOVER_*.md` $\rightarrow$ `docs/archive/phases/phase-07/`
- `MIGRATION_PHASE_8*.md`, `GSC_GROWTH_AUDIT_PHASE_8.md` $\rightarrow$ `docs/archive/phases/phase-08/`
- `PHASE_9_FINAL_AUDIT.md`, `VITE_REMOVAL_PHASE_9.md`, `VITE_RETIREMENT_AUDIT_PHASE_9.md` $\rightarrow$ `docs/archive/phases/phase-09/`
- `PHASE_10_*.md` $\rightarrow$ `docs/archive/phases/phase-10/`
- `PHASE_11_*.md` $\rightarrow$ `docs/archive/phases/phase-11/`
- `PHASE_12_*.md`, `FULL_NAME_*.md` $\rightarrow$ `docs/archive/phases/phase-12/`
- `PHASE_13_*.md`, `COMPETITOR_GAP_MATRIX_PHASE_13.md`, `GSC_DATA_SOURCE_PHASE_13.md`, `LOW_CTR_*.md`, `OPPORTUNITIES_*.md`, `QUERY_GAP_*.md`, `SEO_EXPERIMENT_LOG.md`, `SEO_GROWTH_BACKLOG_PHASE_13.md`, `TOP_20_*.md` $\rightarrow$ `docs/archive/phases/phase-13/`
- `PHASE_14_*.md`, `BACKLINK_*.md`, `COMPETITOR_LINK_REASONS_PHASE_14.md`, `LINKABLE_ASSET_INDEX_PHASE_14.md`, `PR_DATA_PACK_PHASE_14.md`, `RESEARCH_CHANGELOG.md`, `TOP_10_LINKABLE_ASSETS_PHASE_14.md` $\rightarrow$ `docs/archive/phases/phase-14/`
- `PHASE_15_*.md`, `ANALYTICS_EVENT_TAXONOMY_PHASE_15.md`, `CRO_EXPERIMENT_LOG_PHASE_15.md`, `MONETIZATION_BASELINE_PHASE_15.md`, `REVENUE_BY_PAGE_TYPE_PHASE_15.md`, `SEO_INTENT_REVENUE_MAP_PHASE_15.md` $\rightarrow$ `docs/archive/phases/phase-15/`
- `PHASE_16_*.md`, `MONITORING_AUDIT_PHASE_16.md`, `PROGRAMMATIC_TEMPLATE_SCORECARD.md`, `WEEKLY_SEO_REPORT.md`, `WEEKLY_SERP_CHANGES.md` $\rightarrow$ `docs/archive/phases/phase-16/`
- `PHASE_17_*.md`, `EXPANSION_CANDIDATES_PHASE_17.md`, `PROGRAMMATIC_EXPANSION_DISCOVERY_PHASE_17.md`, `PROGRAMMATIC_PAGE_FAMILY_SCORECARD_PHASE_17.md` $\rightarrow$ `docs/archive/phases/phase-17/`

### B. Root to Canonical `docs/`
- `DATA_DICTIONARY.md` $\rightarrow$ `docs/data/DATA_DICTIONARY.md`
- `DATA_PIPELINE.md` $\rightarrow$ `docs/data/DATA_PIPELINE.md`
- `SITE_HEALTH_RUNBOOK.md` $\rightarrow$ `docs/operations/SITE_HEALTH_RUNBOOK.md`

### C. Generated Run Outputs to `reports/generated/`
- `DAILY_SITE_HEALTH.md` $\rightarrow$ `reports/generated/` (Ignored by `.gitignore`)
- `HEALTH_REPORT_LATEST.md` $\rightarrow$ `reports/generated/` (Ignored by `.gitignore`)

---

## 2. New Canonical Documents Created
- `AGENTS.md` (Root AI Coding Agent Manual)
- `README.md` (Clean Root Documentation)
- `docs/README.md` (Master Documentation Hub)
- `docs/archive/README.md` (Historical Phase Archive Explainer)
- `docs/architecture/ARCHITECTURE.md`
- `docs/architecture/ROUTING.md`
- `docs/architecture/MIGRATION_HISTORY.md`
- `docs/architecture/PERFORMANCE.md`
- `docs/data/DATA_PLATFORM.md`
- `docs/data/DATA_SOURCES.md`
- `docs/data/METHODOLOGY.md`
- `docs/seo/SEO_OPERATING_SYSTEM.md`
- `docs/seo/AUTHORITY_AND_LINKABLE_ASSETS.md`
- `docs/seo/INTERNAL_LINKING.md`
- `docs/seo/PROGRAMMATIC_SEO.md`
- `docs/seo/INDEXABILITY_RULES.md`
- `docs/seo/SEO_RULES.md`
- `docs/operations/MONITORING.md`
- `docs/operations/ENVIRONMENT.md`
- `docs/operations/RELEASE_PROCESS.md`
- `docs/monetization/MONETIZATION.md`
- `docs/monetization/CRO.md`
- `docs/monetization/EXPERIMENTS.md`
