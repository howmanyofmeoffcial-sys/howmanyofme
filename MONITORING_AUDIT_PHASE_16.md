# Phase 16 — Comprehensive Monitoring Audit & Capability Inventory
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Inventory of Current vs. Required Monitoring Capabilities

| Dimension / Source | Currently Monitored? | Mode | Frequency | Current Output | Missing Capability (Resolved in Phase 16) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Search Console (GSC)** | 🟡 Partial | Scripted | On-Demand | `data/seo/` snapshots | Automated anomaly detection & query cluster drop alerts |
| **Indexation & Coverage** | 🟡 Partial | Scripted | Build-time | `audit_seo_health.mjs` | Template-level indexation rate tracking (`/name/*` vs `/people/*`) |
| **Sitemap & Robots** | ✅ Yes | Automated | Build-time | `sitemap.xml`, `robots.txt` | Automated XML syntax, duplicate, and stale route detection |
| **Canonical URLs** | ✅ Yes | Automated | Build-time | `validate-url-parity.mjs` | Multi-host/protocol validation & canonical drift alerting |
| **Internal Links** | ✅ Yes | Automated | Build-time | `validate_internal_links.mjs` | Orphan rate tracking & crawl depth regression alerts |
| **Structured Data (JSON-LD)** | ✅ Yes | Automated | Build-time | `audit_seo_health.mjs` | Entity type verification & schema-content parity checking |
| **Data Freshness & Provenance** | 🟡 Partial | Manual | On-Demand | `manifest.json` | Automated release diffing & column anomaly checks |
| **Core Web Vitals / Performance**| 🟡 Partial | Lab/Manual | On-Demand | Phase 6 CWV audits | Release-over-release JS payload & CLS regression gating |
| **Monetization & Revenue** | 🟡 Partial | Manual | Monthly | Phase 15 Baseline | Automated Session RPM & Traffic vs. Revenue divergence alerts |
| **Deployment Snapshots** | ❌ No | None | None | None | Release snapshot persistence in `data/monitoring/releases/` |

---

## 2. Monitoring Upgrade Roadmap

1. **Unified Health Engine**: Build `src/lib/monitoring/types.ts` and `src/lib/monitoring/healthEngine.ts` to standardize findings across all 11 health categories.
2. **Deterministic Severity Rules**: Differentiate `CRITICAL` (fails build / exit code 1), `HIGH` (daily review), `MEDIUM` (weekly report), and `LOW` (monitoring log).
3. **Master Health Command**: Provide `npm run health:check` executing technical, data, SEO, performance, and revenue sanity in a single command.
4. **Human-in-the-Loop Safeguards**: Explicit prohibition of automated destructive actions (no auto-deletions, no auto-noindex, no auto-title rewrites).
