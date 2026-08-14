# AI Coding Agent Onboarding & Operating Manual

Welcome to **HowManyOfMe.co**. This repository is engineered for high performance, strict SEO compliance, and verifiable demographic statistics.

---

## 🛑 MANDATORY FIRST STEPS FOR ALL AI AGENTS

Before modifying code or creating files:
1. **Read this document thoroughly.**
2. **Review canonical operating procedures in [`docs/OPERATING_SYSTEM.md`](./docs/OPERATING_SYSTEM.md) and [`docs/`](./docs/README.md).**
3. **Inspect existing utilities in `src/lib/` before creating new helper functions.**
4. **Never create loose phase reports or markdown documents in the root directory.**
5. **Always run the validation suite before finishing.**

---

## 🛑 ABSOLUTE PERMANENT RULE: NO NEW NUMBERED PHASES

The numbered migration and foundation roadmap (Phases 1–20) is **officially complete**.

> ⛔ **DO NOT create `PHASE_21.md`, `PHASE_22.md`, or similar numbered roadmap files.**

All ongoing development follows standard software engineering cycles:
- **Tasks & Features**: Discrete improvements with measurable ROI.
- **Experiments**: Controlled tests documented in [`docs/monetization/EXPERIMENTS.md`](./docs/monetization/EXPERIMENTS.md).
- **Data Updates**: Scheduled releases governed by [`docs/data/DATA_PIPELINE.md`](./docs/data/DATA_PIPELINE.md).
- **Incidents**: Bugfixes documented in [`docs/operations/INCIDENTS.md`](./docs/operations/INCIDENTS.md).

---

## 🌲 AI Agent Decision Tree

```text
Need to implement a change or resolve an issue?
                    │
                    ↓
Does an existing utility / script / component already solve it?
                    │
           ┌────────┴────────┐
         YES                 NO
           │                 │
           ↓                 ↓
      Reuse it!     Does it belong to an existing domain module?
                             │
                    ┌────────┴────────┐
                  YES                 NO
                    │                 │
                    ↓                 ↓
               Extend it!    Create minimal new module in src/lib/
```

---

## 🏛️ Repository Architecture

- `src/pages/`: File-based Astro routes (SSG mode).
- `src/components/`: Pure static Astro components (`AdSlot.astro`, `ToolCTA.astro`, `Breadcrumbs.astro`, etc.).
- `src/islands/`: Interactive React Islands (`SiteHeader.tsx`, `CopyCitationButton.tsx`, etc.).
- `src/lib/`: Core domain logic (`names/`, `fullNames/`, `surnames/`, `comparisons/`, `seo/`, `monitoring/`).
- `src/data/`: Generated static datasets (`canonical-names.json`, `canonical-surnames.json`, `canonical-fullnames.json`).
- `scripts/`: Data ingestion, sitemap generation, and automated health checks.
- `docs/`: Canonical, structured permanent documentation.
- `docs/archive/`: Historical phase reports (reference only).
- `reports/generated/`: Output location for automated health/SEO check runs (ignored by git).

---

## 📜 Strict Engineering & SEO Rules

1. **Zero Synthetic / Hallucinated Data**:
   - Every statistic must derive deterministically from official government datasets (SSA 1880–2024, U.S. Census 2020).
2. **One Intent $\rightarrow$ One Canonical URL**:
   - Never generate overlapping URLs. Use canonical builders (`getNameUrl`, `getFullNameUrl`, `getSurnameUrl`).
3. **Pure Static HTML Delivery**:
   - All critical SEO content (H1s, answers, structured data) must be present in the static HTML generated at build time.
4. **Zero Layout Shift (CLS = 0.000)**:
   - Ad slots and dynamic elements must strictly adhere to physical container reservation rules (`min-h-[250px]`, `contain-layout`).
5. **No File Clutter**:
   - Permanent documentation goes into `docs/`.
   - Generated run outputs go into `reports/generated/`.
   - Never commit raw temporary test outputs or phase notes to the root directory.

---

## 🛠️ Common Commands

```bash
# Start local development server
npm run dev

# Run unit tests
npm test

# Run Astro & TypeScript type check
npm run check

# Run static production build (generates dist/)
npm run build

# Run master automated health check (gated on exit code 1)
npm run health:check

# Run data pipeline update
npm run data:update

# Run full pre-deployment validation chain
npm run health:check && npm test && npm run check && npm run build && node scripts/generate-sitemap.mjs && node scripts/validate-url-parity.mjs && node scripts/validate_internal_links.mjs && node scripts/seo/audit_seo_health.mjs
```
