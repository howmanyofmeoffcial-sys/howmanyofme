# Site Health Operations & Incident Runbook
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Incident Diagnosis & Triage Protocols

### Incident A: Sitemap Generation Failure or Drop
- **Symptoms**: `sitemap.xml` returns 404, contains < 1,500 URLs, or has XML syntax errors.
- **Diagnostic Steps**:
  1. Run `node scripts/generate-sitemap.mjs` directly in the terminal.
  2. Inspect `dist/sitemap.xml` for missing canonical URL schemas.
  3. Verify that new routes in `src/pages/` are correctly registered in `scripts/generate-sitemap.mjs`.
- **Resolution**: Re-run `node scripts/generate-sitemap.mjs` and execute `node scripts/validate-url-parity.mjs` to confirm 100% parity.

---

### Incident B: Canonical URL Regression or Domain Drift
- **Symptoms**: Canonical tags point to `localhost`, staging domains, or omit `https://`.
- **Diagnostic Steps**:
  1. Inspect `src/lib/seo/canonicalUrl.ts` for domain prefix constant (`https://howmanyofme.co`).
  2. Run `node scripts/seo/audit_seo_health.mjs`.
- **Resolution**: Fix the canonical generator function in `src/lib/seo/canonicalUrl.ts` and rebuild static HTML.

---

### Incident C: 404 Spike or Broken Internal Links
- **Symptoms**: Internal link validator reports broken `href` destinations.
- **Diagnostic Steps**:
  1. Run `node scripts/validate_internal_links.mjs`.
  2. Locate the specific source and target URL pairs listed in the error log.
- **Resolution**: Update the link target in Astro components or markdown articles to point to valid canonical routes.

---

### Incident D: Data Pipeline Ingestion Failure
- **Symptoms**: `canonical-names.json` missing or contains < 583 records.
- **Diagnostic Steps**:
  1. Run `npm run data:validate`.
  2. Check source data integrity in `src/data/sources/` or `data/census/`.
- **Resolution**: Re-execute `npm run data:build` and verify `manifest.json`.

---

### Incident E: Core Web Vitals (CLS) Regression
- **Symptoms**: Google Search Console reports CLS > 0.100 on mobile/desktop.
- **Diagnostic Steps**:
  1. Check `src/components/AdSlot.astro` to ensure `contain-layout` and minimum heights (`min-h-[250px]`) are present.
  2. Inspect image tags for explicit `width` and `height` attributes.
- **Resolution**: Restore reserved container sizing in `AdSlot.astro`.

---

### Incident F: Organic Traffic or Ranking Drop
- **Symptoms**: GSC shows a > 20% drop in impressions or clicks for a query cluster.
- **Diagnostic Steps**:
  1. Run `npm run seo:report` to identify affected query clusters and landing pages.
  2. Check if a major Google search algorithm update occurred on that date.
  3. Review `CRO_EXPERIMENT_LOG_PHASE_15.md` to see if recent UI changes affected the template.
- **Resolution**: Follow human-in-the-loop triage before altering metadata.
