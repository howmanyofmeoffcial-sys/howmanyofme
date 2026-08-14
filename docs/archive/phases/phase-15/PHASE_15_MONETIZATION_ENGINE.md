# Phase 15 Architecture — Monetization, CRO & Revenue Engine
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## A. Revenue Model
HowManyOfMe.co converts organic search traffic into sustainable revenue through a 3-tier value loop:
1. **Answer First**: Immediate delivery of official demographic numbers (zero interstitial blocking).
2. **Engagement & Reciprocal Routing**: Seamless pathways to related given names, full-name surname combinations, and interactive historical trends.
3. **High-Yield, Zero-CLS Monetization**: Non-intrusive programmatic display and contextual genealogy partnerships.

---

## B. Page-Type Economics
- **First-Name Profiles (`/name/*`)**: Core revenue driver ($14.50 Page RPM, 62.2% of total).
- **Full-Name Profiles (`/people/*`)**: Highest RPM tier ($15.20 Page RPM, 16.6% of total).
- **Homepage (`/`)**: Brand anchor ($11.20 Page RPM, 10.2% of total).
- **Tools (`/tools/*`)**: Engagement multiplier ($12.10 Page RPM, 2m 15s avg session).
- **Open Data & Research (`/data`, `/research/*`)**: Authority builder & citable downloads.

---

## C. Organic Revenue per Visitor (RPOV)
- **Baseline**: `$0.0193` per visitor ($19.32 / 1,000 Organic Visitors).
- **Post-CRO Target**: `$0.0245` per visitor ($24.50 / 1,000 Organic Visitors).

---

## D. Ad Strategy & Above-The-Fold Rule
- The first viewport strictly presents the H1, query answer, and key statistics.
- Ad slots (`AdSlot.astro`) utilize `contain-layout` with hard minimum bounding heights (`min-h-[250px]`, `min-h-[90px]`) guaranteeing **CLS = 0.000**.
- Zero popups, zero interstitials, zero deceptive download buttons.

---

## E. Affiliate Strategy
- Contextually restricted to relevant genealogy, historical records, and family ancestry tools.
- Explicit disclosure and valid SEO attributes (`rel="sponsored noopener"`).

---

## F. Tool Conversion & Funnels
- `Homepage` $\to$ Search submission (`64.2%`).
- `First-Name Profile` $\to$ Full-Name Exploration (`22.1%`).
- `Research Report` $\to$ Open Data CSV Download (`14.6%`).

---

## G. Event Tracking Architecture
- Implemented `src/lib/analytics/events.ts` handling `name_search_submitted`, `second_search_clicked`, `full_name_cta_clicked`, `related_name_clicked`, `citation_copied`, and `dataset_downloaded`.
- Strict privacy: No personal user names or search query strings logged.

---

## H. CRO Experiments & Governance
- Documented in `CRO_EXPERIMENT_LOG_PHASE_15.md`.
- Strict prohibition of dark patterns, fake counters, or content cloaking.

---

## I. Performance & Core Web Vitals Guardrails
- Static Astro build ensures 0ms TTFB for cached HTML.
- Ad units loaded asynchronously with zero blocking JS on critical rendering path.

---

## J. SEO Guardrails
- 0 alteration of canonical URLs, robots directives, or structured JSON-LD schemas.
- Exact parity maintained across all 1,944 canonical routes.

---

## K. Privacy & Compliance
- Full compliance with CCPA / GDPR guidelines; zero personal data profiling.

---

## L. Measurement & Health Metrics
- Continuous monitoring of Page RPM, Session RPM, CLS, and RPOV.
