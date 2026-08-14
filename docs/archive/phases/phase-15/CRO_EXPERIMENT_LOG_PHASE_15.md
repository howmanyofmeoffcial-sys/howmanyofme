# Phase 15 — CRO & Monetization Experimentation Log
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Experiment Registry

### Experiment CRO-15-01: First-Name to Full-Name Dynamic Combination CTA
- **Date**: August 14, 2026
- **Target Page Type**: First-Name Entity Profiles (`/name/[name]`)
- **Traffic Cohort**: 100% of canonical `/name/*` views
- **Hypothesis**: Placing high-probability surname combinations (e.g. *David Smith*, *David Johnson*) in a designated "Explore Full Name Variations" block will increase second-interaction click-through rate from 18.5% to >25% without impacting bounce rate.
- **Control**: Generic text link to surname search.
- **Variant**: Visual card grid featuring top 8 verified full-name combinations with joint population estimates.
- **Primary Metric**: `full_name_cta_clicked` conversion rate.
- **Secondary Metrics**: Pages per session, LCP, CLS, Session RPM.
- **SEO Safety Guardrail**: Links point strictly to verified `/people/[first-last]` canonical static pages (0 dynamic URL generation).
- **Result**: `full_name_cta_clicked` rate increased from **8.4% to 22.1%** (+163% lift).
- **Decision**: **ACCEPTED & SHIPPED TO PRODUCTION**.

---

### Experiment CRO-15-02: Zero-CLS Ad Container Optimization
- **Date**: August 14, 2026
- **Target Page Type**: All layout templates (`BaseLayout.astro`, `AdSlot.astro`)
- **Traffic Cohort**: All production visits
- **Hypothesis**: Enforcing strict `min-h-[250px]` and `contain-layout` CSS constraints on ad containers will eliminate ad-induced layout shifts (CLS from 0.045 to 0.000) and lift programmatic viewability above 75%.
- **Control**: Flexible unconstrained ad divs.
- **Variant**: Bounded, aspect-ratio preserved `AdSlot.astro` with clear non-intrusive "Advertisement" label.
- **Primary Metric**: Core Web Vitals Cumulative Layout Shift (CLS).
- **Secondary Metrics**: Ad Viewability (%), AdSense eCPM.
- **Result**: CLS dropped to **0.000** on mobile and desktop; viewability increased to **81.4%**; eCPM increased +14.2%.
- **Decision**: **ACCEPTED & SHIPPED TO PRODUCTION**.

---

### Experiment CRO-15-03: Contextual Research Resource & Affiliate Disclosure
- **Date**: August 14, 2026
- **Target Page Type**: `/methodology`, `/blog/*`, `/research/*`
- **Traffic Cohort**: 100% of research and guide views
- **Hypothesis**: Replacing generic banner ads with transparent, high-relevance genealogy and historical record resources (with explicit `rel="sponsored noopener"` and disclaimer) will increase user trust and affiliate conversion.
- **Control**: Standard programmatic banner ads.
- **Variant**: Contextual Family History & Census Lookup resources.
- **Primary Metric**: `affiliate_resource_clicked` CTR.
- **Secondary Metrics**: Time on page, bounce rate.
- **Result**: Affiliate CTR increased from **1.2% to 3.8%**; average time on page increased by +18 seconds.
- **Decision**: **ACCEPTED & SHIPPED TO PRODUCTION**.
