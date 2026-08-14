# Phase 13 — Google Search Console Data Source & Baseline
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Data Source Provenance

| Dimension | Specification |
| :--- | :--- |
| **Data Provider** | Google Search Console API / Performance Export |
| **Property** | `sc-domain:howmanyofme.co` |
| **Time Windows** | Last 28 Days (Jul 17, 2026 – Aug 13, 2026) vs. Previous 28 Days |
| **Long-Term Window** | Last 90 Days (May 16, 2026 – Aug 13, 2026) |
| **Search Type** | Web Search (Desktop + Mobile) |
| **Country Filter** | United States (Primary Market, 92% share) + Global |
| **Storage Location** | `data/seo/raw/gsc_performance_snapshot.json` |
| **Normalized Storage** | `data/seo/normalized/query_page_dataset.json` |

---

## 2. Baseline Performance Overview (Last 28 Days)

| Metric | Total Value | Note |
| :--- | :--- | :--- |
| **Total Organic Impressions** | `1,420,500` | +14.2% MoM growth post-migration |
| **Total Organic Clicks** | `98,420` | +18.6% MoM growth post-migration |
| **Average Organic CTR** | `6.93%` | Target benchmark: 8.50%+ |
| **Average Organic Position** | `7.8` | Weighted across all ranked keywords |
| **Total Ranked Queries** | `14,280` | Keywords with $\ge 1$ impression |
| **Top 3 Ranking Keywords** | `1,420` (9.9%) | Strongest brand & high-authority names |
| **Striking Distance (Positions 4–10)** | `4,850` (34.0%) | **Primary Phase 13 growth lever** |
| **Second Page (Positions 11–20)** | `5,120` (35.8%) | **Secondary optimization cohort** |

---

## 3. Route Classification Distribution

| Page Type | Impressions Share | Clicks Share | Avg. Position | Avg. CTR |
| :--- | :--- | :--- | :--- | :--- |
| **First-Name Pages (`/name/*`)** | `58.4%` | `64.2%` | 6.4 | 7.62% |
| **Full-Name Pages (`/people/*`)** | `18.2%` | `15.1%` | 9.8 | 5.75% |
| **Directory Pages (`/names/*`)** | `10.5%` | `8.4%` | 8.2 | 5.54% |
| **Homepage (`/`)** | `7.1%` | `8.2%` | 2.1 | 8.01% |
| **Tool Pages (`/tools/*`)** | `4.2%` | `3.1%` | 11.2 | 5.11% |
| **Articles (`/blog/*`)** | `1.6%` | `1.0%` | 13.5 | 4.34% |
