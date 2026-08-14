# SEO Operating System

## 1. Operating Framework
The HowManyOfMe SEO Operating System continuously monitors search visibility, clicks, impressions, and CTR across programmatic cohorts using Google Search Console (GSC) query clustering.

```text
GSC Performance Export
        ↓
Query Clustering & Intent Classification
        ↓
Underperforming / High-Opportunity Detection (Positions 4–10 & Low CTR)
        ↓
On-Page Optimization / Intent Tuning
        ↓
Continuous Health Auditing (scripts/seo/audit_seo_health.mjs)
```

---

## 2. Query Clustering Taxonomy

1. **Volume / Direct Frequency Queries**: "How many people have the name John?", "How many David Smiths are there?"
   - Target URL: Canonical `/name/[name]` or `/people/[first-last]`.
   - Content Focus: Exact living estimate, quick answer box, all-time rank.
2. **Rank & Popularity Queries**: "Is Liam a popular name?", "Where does Emma rank?"
   - Target URL: Canonical `/name/[name]` or `/tools/popularity-checker`.
   - Content Focus: Historical peak year, current decade trend, national percentile.
3. **Comparative Queries**: "Liam vs Noah popularity", "James vs William name frequency"
   - Target URL: Canonical `/name-comparison/[nameA]-vs-[nameB]`.
   - Content Focus: Side-by-side demographic scorecards and peak comparisons.
4. **Genealogical & Origin Queries**: "Origin of last name Smith", "How common is Johnson?"
   - Target URL: Canonical `/last-name/[surname]`.
   - Content Focus: Decennial Census count, proportion per 100k, etymology.

---

## 3. Weekly Review & Automated Auditing
- **Automated Check**: `npm run seo:report` monitors top clusters, impressions, and CTR performance.
- **Audit Command**: `node scripts/seo/audit_seo_health.mjs` verifies 100% compliance of meta tags, H1s, canonical URLs, and JSON-LD structured data on all generated HTML pages.
