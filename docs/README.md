# HowManyOfMe.co — Documentation Hub

Welcome to the central documentation hub for **HowManyOfMe.co**. This repository contains the architecture, data pipeline, SEO operating system, monitoring runbooks, and monetization framework for the platform.

---

## 📚 Documentation Index

### 1. [Architecture](./architecture/ARCHITECTURE.md)
- [System Architecture](./architecture/ARCHITECTURE.md) — Pure Astro SSG + React Islands model.
- [Routing & URL Resolution](./architecture/ROUTING.md) — Canonical URL structures and static dynamic routes.
- [Migration History](./architecture/MIGRATION_HISTORY.md) — Record of migration from legacy SPA to Astro-only.
- [Performance & CWV](./architecture/PERFORMANCE.md) — Core Web Vitals targets and zero-CLS ad architecture.

### 2. [Data Platform](./data/DATA_PLATFORM.md)
- [Data Platform Architecture](./data/DATA_PLATFORM.md) — Core data engineering, normalization, and model layers.
- [Data Pipeline Runbook](./data/DATA_PIPELINE.md) — Ingestion scripts and generation commands (`npm run data:update`).
- [Data Dictionary](./data/DATA_DICTIONARY.md) — JSON schema definitions and entity field specifications.
- [Data Sources & Provenance](./data/DATA_SOURCES.md) — Official SSA and U.S. Census Bureau data manifests.
- [Methodology & Models](./data/METHODOLOGY.md) — Actuarial survival formulas and demographic calculations.

### 3. [SEO Operating System](./seo/SEO_OPERATING_SYSTEM.md)
- [SEO Operating System](./seo/SEO_OPERATING_SYSTEM.md) — GSC workflows, query clustering, and SERP audit framework.
- [Authority & Linkable Assets](./seo/AUTHORITY_AND_LINKABLE_ASSETS.md) — Open Data Hub, PR data packs, and embed badges.
- [Internal Linking Graph](./seo/INTERNAL_LINKING.md) — Silo hierarchy, reciprocal links, and crawl depth controls.
- [Programmatic SEO](./seo/PROGRAMMATIC_SEO.md) — Rules for `/name/*`, `/people/*`, `/last-name/*`, and comparisons.
- [Indexability & Quality Gates](./seo/INDEXABILITY_RULES.md) — Canonical parity, crawl budgets, and noindex policies.
- [SEO Guardrails & Rules](./seo/SEO_RULES.md) — Permanent engineering rules for AI agents and developers.

### 4. [Operations & Monitoring](./operations/MONITORING.md)
- [Monitoring Framework](./operations/MONITORING.md) — Master health engine and automated exit-code-1 CI checks.
- [Site Health Runbook](./operations/SITE_HEALTH_RUNBOOK.md) — Incident response and triage protocols.
- [Environment Configuration](./operations/ENVIRONMENT.md) — Environment variables and deployment settings.
- [Release Process](./operations/RELEASE_PROCESS.md) — Pre-deployment verification checklist and build gate.

### 5. [Monetization & CRO](./monetization/MONETIZATION.md)
- [Monetization Framework](./monetization/MONETIZATION.md) — AdSlot container specs, revenue baselines, and RPM targets.
- [Conversion Rate Optimization (CRO)](./monetization/CRO.md) — Tool engagement funnels and interaction rates.
- [Experimentation Log](./monetization/EXPERIMENTS.md) — Active telemetry taxonomy and test histories.

### 6. [Historical Archive](./archive/README.md)
- [Phase Archives](./archive/README.md) — Historical reports and pre-cutover audits (Phases 1–17).

---

## 🤖 AI Agent Guidelines
All AI coding assistants must review [AGENTS.md](../AGENTS.md) before making code or content modifications.
