# Migration Phase 8 Documentation
## Post-Migration SEO Growth + Google Search Console Optimization
## Project: HowManyOfMe.co

---

## 1. Post-Migration Growth Architecture

Phase 8 leverages the speed, crawlability, and AEO/GEO capabilities of the new Astro + React Islands platform to drive measurable organic search growth across Google, Bing, and AI search engines.

```text
               1. Search Query on Google / AI Engines
               ("How many people have the name David?")
                               │
                               ▼
               2. Direct Answer Snippet Extraction
                  ├── ⚡ Quick Answer Card in initial HTML
                  ├── 1-in-X Frequency & Popularity Rank
                  └── Exact SSA & Census citation metadata
                               │
                               ▼
               3. High-CTR SERP Display
                  ├── Title: "How Many People Are Named David? Popularity, Rarity & Origin"
                  └── Meta: "~4.3M bearers worldwide (rank #11)..."
                               │
                               ▼
               4. Sub-Second Landing Experience
                  ├── FCP 0.4s / LCP 0.6s / CLS 0.00
                  └── 0ms blocking time
                               │
                               ▼
               5. Internal Authority & User Engagement Loop
                  ├── Related Origins Grid → /name/[Sibling]
                  ├── Similar Names Soundalikes → /name/[Phonetic]
                  └── Contextual Tools → /tools/[Tool]
```

---

## 2. Query-to-Page Intent Mapping

- **Direct Entity Queries (48% share)**: Served directly by `/name/[name]` with the Answer-First card above the fold.
- **Rarity & Ranking Queries (22% share)**: Satisfied by the 4 key metric pills (Bearers, Rank, Rarity Tier, Origin) and 1-in-X calculation.
- **Decade & Trend Queries (16% share)**: Served by the 9-decade popularity table and interactive `NameInsightReport` island.
- **Similar & Soundalike Queries (14% share)**: Served by the server-rendered phonetic and letter-similarity chips.

---

## 3. Structured Data & AEO Optimization

- All entity pages output clean, non-duplicated JSON-LD schemas:
  - `WebPage` with `about: { "@type": "Thing", name: ... }` targeting the linguistic name entity.
  - `FAQPage` matching on-page visible questions.
  - `BreadcrumbList` matching breadcrumb navigation.
- Answer-First headings and structured definitions ensure citation readiness for Perplexity, ChatGPT, and Google AI Overviews.
