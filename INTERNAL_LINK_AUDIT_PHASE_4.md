# Internal Link Audit — Phase 4
## HowManyOfMe.co Crawl Graph & Discoverability Report

Date: August 14, 2026  
Scope: Internal link distribution, orphan pages, crawl depth, and canonical consistency across all generated static pages.

---

## 1. Executive Summary & Before / After Metrics

| Metric | Before Phase 4 (Phase 3 baseline) | After Phase 4 (Architecture complete) | Change / Impact |
| :--- | :--- | :--- | :--- |
| **Total Indexable Name Pages** | **578** | **583** | +5 (Fixed 1-indexed rank formula in data layer) |
| **0 Incoming Links (Orphan Pages)** | **74** | **0** | **-74 (-100% orphan reduction)** |
| **1 Incoming Link** | **20** | **0** | **-20 (-100%)** |
| **2–5 Incoming Links** | **25** | **53** | Shifted to healthy distribution |
| **6+ Incoming Links** | **459** | **530** | +71 (+15.5% deep graph connectivity) |
| **Total Internal Links Audited** | ~52,000 | **65,096** | +13,096 crawlable semantic links |
| **Broken Internal Links** | 721 | **0** | **0 broken links across 611 generated files** |
| **Maximum Crawl Depth to Name Pages** | Depth 4+ | **Depth 2** | 100% of names discoverable within 2 clicks |

---

## 2. Link Distribution by Page Type

### 2.1 Homepage (`/`)
- **Direct Outgoing Links to Names**: 20 top popular names in responsive grid with live bearer counts.
- **Directory Hub Links**: All 26 alphabetical directory hubs (`/names/a` through `/names/z`).
- **Tool Hub Links**: 4 core name tools jump cards (`/tools/...`).

### 2.2 Alphabet Directory Pages (`/names/[letter]`)
- **Direct Outgoing Links to Names**: 100% of all names starting with that letter (e.g. `/names/c` links directly to all 38 C-names: `Caleb`, `Cameron`, `Camila`, `Carl`, `Carlos`, `Charlotte`, `Christopher`, etc.).
- **A–Z Directory Jump Nav**: 26 letter links.
- **Prev / Next Letter Links**: Circular alphabetical crawl chain (`← Previous letter` / `Next letter →`).

### 2.3 Programmatic Name Pages (`/name/[name]`)
- **Alphabet Directory Hub**: Breadcrumb link and contextual footer link to `/names/[letter]`.
- **Alphabet Neighbors**: Direct links to `← Previous [Letter] name` and `Next [Letter] name →`.
- **Similar Names**: 10 sound/letter-alike names with natural anchor text.
- **Related Names by Origin**: 6 culturally/demographically related names with bearer count badges.
- **Contextual Tools**: 3 relevant tools (`Popularity Checker`, `Compare [Name]`, `Trend Visualizer`).
- **Contextual Articles**: 3 themed blog posts on name rarity, trends, and charts.

---

## 3. Crawl Depth Distribution (from Homepage `/`)

| Crawl Depth | Page Count | Description |
| :--- | :--- | :--- |
| **Depth 0** | **1** | Homepage (`/`) |
| **Depth 1** | **46** | 20 popular name pages + 26 A–Z letter directory hubs |
| **Depth 2** | **563** | Remaining 563 name pages reachable in 1 click from A–Z directory hubs or popular names |
| **Depth 3+** | **0** | Zero deeply buried or unreachable pages |
| **Unreachable** | **0** | Zero orphaned indexable pages |
