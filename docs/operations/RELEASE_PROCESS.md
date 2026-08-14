# Release Process & Pre-Deployment Checklist

Before merging any pull request or deploying a release to production, the complete validation chain MUST pass with 0 errors.

---

## 1. Full Pre-Deployment Command Sequence

```bash
# 1. Automated Health & Monitoring Audits
npm run health:check
npm run seo:report
npm run data:report

# 2. Automated Unit & Integration Tests
npm test

# 3. Astro & TypeScript Diagnostics
npm run check

# 4. Static Production Build
npm run build

# 5. Sitemap & URL Parity Validation
node scripts/generate-sitemap.mjs
node scripts/validate-url-parity.mjs
node scripts/validate_internal_links.mjs

# 6. HTML SEO & Schema Validation
node scripts/seo/audit_seo_health.mjs
```

---

## 2. Release Acceptance Criteria
- [ ] `npm run health:check`: 0 Critical (P0) issues.
- [ ] `npm test`: 22/22 unit tests passing.
- [ ] `npm run check`: 0 TypeScript or Astro errors.
- [ ] `npm run build`: 2,590+ static pages built in $< 10$ seconds.
- [ ] `validate-url-parity.mjs`: 100% parity between sitemap and generated HTML.
- [ ] `validate_internal_links.mjs`: 0 broken internal links across all pages.
- [ ] `audit_seo_health.mjs`: 0 missing meta descriptions, H1s, or canonical tags.
