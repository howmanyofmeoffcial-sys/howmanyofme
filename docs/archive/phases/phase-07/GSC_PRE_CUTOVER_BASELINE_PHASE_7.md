# Google Search Console Pre-Cutover Baseline — Phase 7
## HowManyOfMe.co Search Performance Tracking

Date: August 14, 2026

---

## 1. Organic Search KPI Tracking Parameters

To establish the pre-cutover comparison baseline for monitoring Google Search performance post-migration, the following benchmarks are documented:

| Metric Category | Pre-Migration Baseline (Vite SPA) | Post-Cutover Target (Astro Static) |
| :--- | :--- | :--- |
| **Indexed Pages (GSC Coverage)** | 1,242 URLs | 1,242 URLs (100% parity) |
| **Excluded / Crawl Errors** | 0 5xx errors | 0 5xx errors |
| **Mobile Core Web Vitals Status** | "Needs Improvement" (LCP ~3.2s) | "Good" (LCP 0.6s, INP <40ms, CLS 0.00) |
| **Featured Snippet Capture** | Baseline AEO capture | Target +25% capture rate via Answer-First blocks |
| **Primary Indexing Signal** | Client-Side Hydration Dependent | 100% Initial HTML Static Render |

---

## 2. High-Priority URLs for Search Console Verification

Immediately following production cutover, the following representative URLs should be inspected in GSC URL Inspection:
1. `https://howmanyofme.co/` (Homepage)
2. `https://howmanyofme.co/name/James` (Top rank popular entity)
3. `https://howmanyofme.co/name/David` (High-volume query)
4. `https://howmanyofme.co/name/Logan` (Mid-tail entity)
5. `https://howmanyofme.co/names/a` (Alphabet directory hub)
6. `https://howmanyofme.co/sitemap.xml` (Canonical sitemap)
