# Production Incident Log & Post-Mortem Register
## Project: HowManyOfMe.co

This document logs all production incidents, technical outages, and ranking regressions alongside root causes and preventative automation rules.

---

## 📋 Incident Classification

- **P0**: Complete site unavailability, mass 404s, broken canonical URLs, corrupted data.
- **P1**: Major SEO regression, broken sitemap, Core Web Vitals layout shift spike (CLS $> 0.1$).
- **P2**: Localized template flaw, missing metadata on secondary pages.
- **P3**: Minor cosmetic or styling glitch.

---

## 📜 Historical Incident Register

### INC-2026-01: Legacy Vite Production Hydration Conflict (Phase 9)
- **Severity**: P0
- **Impact**: Duplicate build pipelines and potential hydration mismatches.
- **Root Cause**: Vite production entry point was competing with Astro SSG compiler.
- **Resolution**: Completely removed Vite production bundles and finalized Astro-only architecture.
- **Preventative Check**: Automated Astro build and type check in `package.json` pre-deployment chain.

---

## 📝 Post-Mortem Template

```markdown
### [INC-YYYY-XX]: [Short Incident Title]
- **Date / Time**: [UTC Timestamp]
- **Severity**: [P0 / P1 / P2 / P3]
- **Impact**: [Traffic, revenue, or affected URLs]
- **Root Cause**: [Technical description of failure mechanism]
- **Resolution**: [How the issue was contained and fixed]
- **Preventative Automation**: [Specific script/check added to npm run health:check]
```
