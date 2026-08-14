# Automated Monitoring & Site Health Engine

## 1. System Overview
The monitoring system provides continuous, automated auditing across technical SEO, data freshness, GSC performance, and revenue health.

```text
Master Health Runner: npm run health:check
      ├── SEO Health Checker (scripts/monitoring/check-seo-health.mjs)
      ├── Data Freshness Checker (scripts/monitoring/check-data-freshness.mjs)
      ├── GSC Performance Monitor (scripts/monitoring/check-gsc-performance.mjs)
      ├── Revenue Health Auditor (scripts/monitoring/check-revenue-health.mjs)
      └── Release Snapshot Generator (scripts/monitoring/generate-release-snapshot.mjs)
```

---

## 2. Health Thresholds & Exit Codes

| Severity Level | Definition | CI/CD Behavior |
| :--- | :--- | :--- |
| **Critical (P0)** | Build failure, missing canonical tags, broken sitemap, or NaN statistics | **Exit Code 1** (Blocks Deployment) |
| **High (P1)** | CTR drop $> 20\%$, missing metadata on non-critical pages | Logged for weekly triage |
| **Medium (P2)** | Crawl depth $> 4$, minor typography warnings | Logged for routine cleanup |

---

## 3. Execution Commands
```bash
# Full health check with exit-code build gating
npm run health:check

# Specific domain reports
npm run data:report    # Data freshness and schema validation
npm run seo:report     # GSC search performance and CTR tracking
```
Outputs are written to `reports/generated/` and logged to stdout.
