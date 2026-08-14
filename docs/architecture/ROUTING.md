# Routing & URL Resolution Architecture

## 1. Canonical URL Hierarchy

HowManyOfMe.co enforces strict, permanent canonical route patterns. Every page has one and only one canonical representation:

| Page Category | URL Pattern | Data Source | Prerender Status |
| :--- | :--- | :--- | :--- |
| **Homepage** | `/` | Aggregated metrics | Static SSG |
| **First Name Profile** | `/name/[name]` | SSA 1880–2024 + Census 2020 | Static SSG (583 routes) |
| **Similar Names** | `/similar-names/[name]` | Phonetic & algorithmic matches | Static SSG (583 routes) |
| **Full Name Profile** | `/people/[first-last]` | Joint probability model | Static SSG (700 routes) |
| **Surname Profile** | `/last-name/[surname]` | Decennial Census Surname Data | Static SSG (50 routes) |
| **Surname Hub** | `/last-names` | Top Census Surnames Index | Static SSG (1 route) |
| **Name Comparison** | `/name-comparison/[nameA]-vs-[nameB]` | SSA comparative metrics | Static SSG (20 routes) |
| **Alphabetical Directory** | `/names/[letter]` | Filtered name dictionary | Static SSG (26 routes) |
| **Interactive Tools** | `/tools/[tool-slug]` | Interactive calculators | Static SSG (11 routes) |
| **Open Data Hub** | `/data` | Public downloadable summaries | Static SSG (1 route) |
| **Research Reports** | `/research/[slug]` | Deep-dive statistical analyses | Static SSG (1 route) |
| **Similar Names Hub** | `/similar-names` | Directory of similar names | Static SSG (1 route) |
| **Blog & Guides** | `/blog/[slug]` | Editorial content & baby guides | Static SSG (23 routes) |
| **Core Pillars** | `/about`, `/methodology`, `/privacy`, `/terms`, `/disclaimer`, `/contact` | Institutional & compliance | Static SSG (6 routes) |
| **Embed Endpoints** | `/embed/name/[name]` | Minimal badge iframe (`noindex`)| Static SSG (583 routes) |

---

## 2. Dynamic Resolution & Parity Validation

- Dynamic routes use Astro's `getStaticPaths()` to ensure every valid URL is generated at build time.
- `scripts/validate-url-parity.mjs` enforces a 100% match between:
  1. Expected canonical routes.
  2. Generated HTML outputs in `dist/`.
  3. Registered URLs in `sitemap.xml`.
- Trailing slash policy: Clean trailing slash removal (`/name/john` instead of `/name/john/`) with automated canonical matching.
