# Strict SEO Engineering Rules

These rules are permanent guardrails for all developers and AI coding agents working on HowManyOfMe.co. Violations will fail the pre-deployment health check.

---

## 1. Zero Synthetic or Hallucinated Data
- ⛔ **NEVER** generate fake demographic statistics, birth numbers, or probabilities.
- All numbers must derive deterministically from official government tables (`src/data/generated/`).

## 2. One Intent $\rightarrow$ One Canonical URL
- ⛔ **NEVER** create duplicate routes targeting identical search intents (e.g. `/name/john-smith` vs `/people/john-smith`).
- `/name/[name]` is for given names; `/last-name/[surname]` is for surnames; `/people/[first-last]` is for full names.

## 3. Server-Rendered Semantic HTML
- ⛔ **NEVER** render critical SEO content (H1s, answers, tables, metadata) via client-side JavaScript.
- All content must be present in the static HTML payload generated at build time.

## 4. No Uncontrolled Programmatic URL Explosion
- ⛔ **NEVER** mass-generate thousands of unvetted programmatic URLs.
- Always execute pilot cohorts (20–50 URLs) with demand validation before scaling.

## 5. Absolute Canonical Parity
- ⛔ **NEVER** deploy if `node scripts/validate-url-parity.mjs` detects missing or mismatched canonical tags.
