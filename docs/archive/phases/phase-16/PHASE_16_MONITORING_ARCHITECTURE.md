# Phase 16 Architecture — Continuous SEO Automation & Monitoring Engine
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## A. Monitoring Sources & Ingestion
The monitoring system automatically collects signals from:
1. **Build Artifacts & HTML**: Canonical tags, H1s, titles, structured JSON-LD schemas, and `dist/` parity.
2. **Search Console Snapshots**: Impressions, clicks, rankings, and query clusters in `data/seo/`.
3. **Data Pipeline Provenance**: `manifest.json`, single-year cohort counts, and Census returns in `src/data/metadata/`.
4. **Core Web Vitals**: Layout shift, LCP, and bundle size constraints in `src/components/AdSlot.astro`.

---

## B. Health Categories & Classification
All findings are mapped to 11 standardized categories: `technical`, `indexation`, `seo`, `content`, `data`, `performance`, `links`, `analytics`, `revenue`, `security`, and `deployment`.

---

## C. Deterministic Severity Rules
- **CRITICAL**: Fails `npm run health:check` (exit code 1). Halts deployments. (Broken builds, global robots Disallow, missing canonicals, data pipeline corruption).
- **HIGH**: Requires triage within 24 hours. (Template-level ranking drops, CLS regressions, sitemap size drops).
- **MEDIUM**: Reviewed in weekly sprint triage. (Isolated metadata quality issues, individual 404 links).
- **LOW / INFO**: Recorded in telemetry changelog. (Minor stylistic differences, stale release reports).

---

## D. Daily vs. Weekly Check Frequency
- **Daily (`npm run health:check`)**: Runs fast SEO health checks, sitemap/robots integrity, data manifest validation, and zero-CLS ad container verification.
- **Weekly (`npm run seo:report`)**: Generates GSC query cluster performance, template scorecards, and ranking movement tracking.

---

## E. Human Review & Safe Auto-Fix Policy
- **Automated Safe Actions**: Gating builds, generating Markdown health reports, synchronizing sitemaps, alerting developers.
- **Prohibited Automated Actions**: No automated page deletions, no bulk noindexing, no automated canonical rewriting, no unverified AI title rewrites.

---

## F. Deployment Safety & Snapshots
- Every build creates a release snapshot in `data/monitoring/releases/` tracking commit hash, sitemap URL count, and data version.
