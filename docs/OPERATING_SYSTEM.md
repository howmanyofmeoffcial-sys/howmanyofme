# Long-Term SEO Operating System & Growth Playbook
## Project: HowManyOfMe.co

Welcome to the definitive operating manual for **HowManyOfMe.co**. This document governs all ongoing operational cadences, experimentation frameworks, data release lifecycles, and strategic decision rules.

---

## 🔁 Continuous Growth Loop

```text
                  SEARCH / USERS
                       │
                       ↓
                    DATA
                       │
                       ↓
                  GSC / ANALYTICS
                       │
                       ↓
                MONITORING SYSTEM
                       │
                       ↓
                 WEEKLY REVIEW
                       │
                       ↓
               PRIORITY DECISIONS (P0–P3)
                       │
         ┌─────────────┼─────────────┐
         ↓             ↓             ↓
       SEO          PRODUCT       REVENUE
         │             │             │
         └─────────────┼─────────────┘
                       ↓
                  EXPERIMENT
                       ↓
                    MEASURE
                       ↓
                     LEARN
                       ↓
                    REPEAT
```

---

## 1. Weekly Operational Cadence (10-Step Review)

Every Monday, execute this standard operating review:

1. **Technical Health Audit**: Run `npm run health:check`. Verify 0 Critical (P0) errors, 0 broken links, and 100% canonical parity.
2. **GSC Traffic & Impressions**: Compare 7-day trailing clicks and impressions against the prior 28-day baseline.
3. **Query Cluster Performance**: Review ranking movements across the 4 primary clusters: Direct Frequency, Popularity/Rank, Head-to-Head Comparisons, and Surnames.
4. **Ranking Opportunities**: Identify keywords in Positions 4–10 with high impression volume and low CTR ($< 5\%$).
5. **Indexation Velocity**: Inspect Google Search Console coverage to ensure newly deployed programmatic cohorts are indexing cleanly.
6. **Programmatic Family Health**: Evaluate traffic yield across `/name/*`, `/people/*`, `/last-name/*`, and `/name-comparison/*`.
7. **Internal Link Integrity**: Ensure no orphaned pages exist and all new routes are within 3 clicks of the homepage.
8. **Monetization & RPM Review**: Check page RPM ($\ge \$13.80$) and revenue per visitor ($\ge \$0.0193$). Ensure ad viewability remains high without layout shifts.
9. **Open Experiments Check**: Review telemetry logs for active CRO or title experiments (`docs/monetization/EXPERIMENTS.md`).
10. **Action Prioritization**: Produce a maximum of **Top 3–5 High-ROI Actions** classified by P0–P3 priority.

---

## 2. Monthly Strategic Analysis

Once per month, conduct a deeper audit using the [`MONTHLY_GROWTH_SCORECARD.md`](./templates/MONTHLY_GROWTH_SCORECARD.md) template:

- **Competitor Movement**: Monitor top competitors for new features, data claims, or UX patterns.
- **Content Quality Classification**: Categorize underperforming pages into:
  - `KEEP`: Stable performers matching user search intent.
  - `IMPROVE`: High-impression pages with weak dwell time or CTR; update metadata or enhance charts.
  - `MERGE`: Duplicate or overlapping search intents; consolidate into one canonical URL.
  - `REMOVE`: Deprecated or unbacked programmatic pages.
- **Programmatic Yield Audit**: Measure impressions per page and clicks per page for each programmatic family.
- **Authority & PR Review**: Track editorial citations and Open Data Hub downloads (`/data`).

---

## 3. Quarterly Strategy & Keep / Kill / Scale Review

Every quarter, perform a portfolio review using [`QUARTERLY_STRATEGY_REVIEW.md`](./templates/QUARTERLY_STRATEGY_REVIEW.md):

- **KEEP**: Core systems performing reliably (SSA 1880–2024 first-name layer, full-name combination model).
- **SCALE**: High-demand pilot cohorts that passed the 30-day indexability gate (e.g. expanding `/last-name/*` from top 50 to top 250 surnames).
- **IMPROVE**: Templates with mixed engagement or rising search impressions.
- **PAUSE**: Candidate verticals with incomplete datasets (e.g. State-by-name full historical matrices).
- **RETIRE**: Ineffective experiments or legacy features.

---

## 4. Incident Response Protocol (`docs/operations/INCIDENTS.md`)

When a production defect or ranking anomaly occurs, follow the formal incident lifecycle:

```text
Detect → Confirm → Contain → Diagnose → Fix → Validate → Deploy → Post-Mortem
```

### Severity Levels
- **P0 (Critical)**: Production site down, mass 404s, broken canonicals, or data corruption. Immediate rollback/hotfix within 1 hour.
- **P1 (High)**: Indexation drop $> 20\%$, broken sitemap, or Core Web Vitals regression (CLS $> 0.1$). Fix within 24 hours.
- **P2 (Medium)**: Localized template error, broken image link, or minor typography flaw. Fix in regular weekly release.
- **P3 (Low)**: Minor cosmetic defect or nice-to-have optimization.

---

## 5. SEO & CRO Experiment Framework

All page modifications targeting CTR, conversion, or engagement must adhere to controlled experimentation:

1. **Hypothesis**: "Adding a prominent related full-name box to surname profiles will increase pages-per-session by $15\%$."
2. **Cohort**: Apply change to a randomized $20\%$ sample or single pilot vertical.
3. **Single Variable Rule**: Test one element at a time (e.g. Title Tag vs Hero CTA vs Ad Placement).
4. **Minimum Sample Size**: Never declare a winner with $< 1,000$ organic impressions or $< 100$ user interactions. Label insufficient data as `INCONCLUSIVE`.
5. **Logging**: Record hypothesis, variant, and statistical result in [`docs/monetization/EXPERIMENTS.md`](./monetization/EXPERIMENTS.md).

---

## 6. Official Data Release Lifecycle

When official government releases are published (e.g. Annual SSA newborn updates or Census releases):

```text
1. Source Published (SSA/Census)
         ↓
2. Ingestion & Normalization (`npm run data:update`)
         ↓
3. Schema & Math Validation (`npm run data:validate`)
         ↓
4. Diff & Sanity Audit (`npm run data:report`)
         ↓
5. Full Static Build & Parity Test (`npm run build && node scripts/validate-url-parity.mjs`)
         ↓
6. Production Release & Manifest Timestamp Update
```

---

## 7. Strict "Do Not Build" Guardrails

⛔ **NEVER Build Something Merely Because:**
- A competitor has it without verifying if real search demand exists.
- It artificially inflates URL counts with thin or templated text.
- It invents unverified demographic statistics or hallucinated probabilities.
- It promises "quick backlinks" through link schemes or blog networks.
- It introduces complex UI dashboards that provide no tangible user value.

---

## 8. Permanent Core KPIs

| Domain | Metric | Target Baseline | Review Cadence |
| :--- | :--- | :--- | :--- |
| **SEO** | Organic Impressions & Clicks | Continuous Growth | Weekly |
| **SEO** | Average Position (Top 100 Names)| $\le 5.0$ | Weekly |
| **SEO** | Canonical Indexability Rate | $100\%$ | Weekly |
| **Product** | Search-to-Result Interaction Rate| $\ge 65\%$ | Monthly |
| **Product** | Pages per Session | $\ge 1.40$ | Monthly |
| **Revenue** | Page RPM | $\ge \$13.80$ | Weekly |
| **Revenue** | Revenue per Visitor | $\ge \$0.0193$ | Monthly |
| **Technical**| Core Web Vitals (CLS / LCP / INP)| `0.000` / `< 1.0s` / `< 50ms` | Weekly |
| **Technical**| Internal Broken Links | `0` | Weekly |
| **Data** | Official Provenance Coverage | $100\%$ Official | Quarterly |
