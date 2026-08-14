# Phase 1 Migration Inventory & Architecture Plan — HowManyOfMe.co

**Document Version:** 1.0.0  
**Target Architecture:** Astro (Static HTML First) + React Islands (Interactive Elements Only)  
**Migration Phase:** Phase 1 (Audit, Inventory, Foundation Setup & Target Scaffold)  
**URL & SEO Preservation Guarantee:** 100% slug parity, zero 404s, build-time SSR metadata, zero client-side SEO dependencies.

---

## 1. Current Stack

| Component | Current Implementation | Notes / Target State in Astro |
|---|---|---|
| **Framework** | React 18.3.1 (SPA) with TypeScript | Transition to Astro 5 (Static HTML-first) + React Islands for interactive widgets |
| **Bundler** | Vite 5.4.19 + `@vitejs/plugin-react-swc` | Astro internal Vite bundler with zero-JS static HTML generation by default |
| **Routing** | React Router DOM v6 (`BrowserRouter`, `Routes`, `Route`, `useLocation`) | File-based routing via `src/pages/` (e.g. `[name].astro`, `[letter].astro`, `[slug].astro`) with static paths |
| **Data Sources** | Static TypeScript data modules: `src/data/nameData.ts` (100M+ stats), `blogData.ts`, `blogExpansions.ts`, `contentRegistry.ts`, `usSSAGender.ts`; Serverless Vercel endpoints in `/api/` | Direct build-time imports in Astro frontmatter; zero client fetch required for static views; `/api/` serverless functions preserved for dynamic queries |
| **Styling** | Tailwind CSS v3.4.17 + PostCSS + `tailwindcss-animate` + `@tailwindcss/typography` | Global CSS in `src/styles/global.css` (or `src/index.css`) imported via `BaseLayout.astro`; full Tailwind utility support preserved |
| **Typography & Fonts** | Google Fonts: `Inter` (400, 600, 700) + `Playfair Display` (700, 800) | Loaded in `BaseLayout.astro` `<head>` with preconnects + non-blocking print/onload swap |
| **Analytics** | Google Analytics / GTM (`G-Q1NTDXVHWE`) | Injected directly in `BaseLayout.astro` `<head>` / `<body>` with idle/interaction deferral logic |
| **Advertising & Monetization** | Journey by Mediavine (`scripts.scriptwrapper.com/tags/...`), Grow by Mediavine (`faves.grow.me/main.js`), Google AdSense preconnect | Server-rendered `<script>` tags in `BaseLayout.astro` and `<AdSlot />` components rendered as static HTML containers |
| **Charts** | Recharts v2.15.4 (`LineChart`, `PieChart`, `BarChart`, `ResponsiveContainer`) | Hydrated only where charts exist using `client:visible` or `client:idle` in React Islands |
| **SEO Implementation** | Client-side `SEOHead.tsx` (`useEffect` updating `document.title`, meta tags, JSON-LD scripts) + `Canonical.jsx` + Post-build snapshot injection (`prerender-top-names.mjs`) | Replaced with build-time, server-rendered `src/components/SEO.astro` generating pure static `<head>` markup with zero JavaScript overhead |
| **Sitemap** | `scripts/generate-sitemap.mjs` (runs post-build to write `dist/sitemap.xml` and `public/sitemap.xml`) | Retained / unified with Astro's build pipeline (`@astrojs/sitemap` or existing custom sitemap script) |
| **Deployment** | Vercel (`vercel.json` with trailingSlash: false, apex host redirects, .html redirects, legacy blog redirects, `/api/` serverless rewrites, SPA fallback) | Vercel static output / Astro Vercel adapter; existing redirects in `vercel.json` preserved intact |

---

## 2. Current Routes & Migration Mapping

| Current URL Pattern | Current Component | Content Type | Dynamic? | SEO Critical? | Proposed Astro Route | Migration Strategy |
|---|---|---|---|---|---|---|
| `/` | `src/pages/Index.tsx` | Homepage / Primary Search Hub | Static + Client Search | **CRITICAL** (Priority 1.0) | `src/pages/index.astro` | Static HTML layout with Hero search bar as `client:idle` React Island |
| `/names/:letter` | `src/pages/LetterDirectory.tsx` | A–Z Directory Listings (26 letters) | Static Param (`:letter`) | **CRITICAL** (Priority 0.6) | `src/pages/names/[letter].astro` | `getStaticPaths()` for letters a–z; 100% static HTML |
| `/name/:name` | `src/pages/NameDetail.tsx` | Individual Name Insight Report & Statistics | Dynamic Param (`:name`) | **CRITICAL** (Priority 0.7) | `src/pages/name/[name].astro` | Pre-render top/indexed names via `getStaticPaths()` or SSR with on-demand fallback; server-rendered report HTML + interactive Island for client charts |
| `/similar-names` | `src/pages/SimilarNamesIndex.tsx` | Similar Names Search Hub & Popular Index | Static + Client Search | **CRITICAL** (Priority 0.8) | `src/pages/similar-names/index.astro` | Static HTML with interactive autocomplete search island |
| `/similar-names/:name` | `src/pages/SimilarNamesDetail.tsx` | Sound-alike / Length / Cluster Name Detail | Dynamic Param (`:name`) | **CRITICAL** (Priority 0.6) | `src/pages/similar-names/[name].astro` | `getStaticPaths()` for known names; 100% static HTML content + links |
| `/tools` | `src/pages/ToolsPage.tsx` | Suite of 9+ Name Tools Hub | Static | **CRITICAL** (Priority 0.8) | `src/pages/tools/index.astro` | 100% Static HTML grid of tools with structured data |
| `/tools/popularity-checker` | `src/pages/tools/PopularityChecker.tsx` | Interactive Name Popularity Checker | Interactive Tool | **CRITICAL** (Priority 0.8) | `src/pages/tools/popularity-checker.astro` | Static layout + `PopularityCheckerIsland` (`client:load` / `client:idle`) |
| `/tools/random-name` | `src/pages/tools/RandomNameGenerator.tsx` | 10-Name Random Generator | Interactive Tool | **CRITICAL** (Priority 0.8) | `src/pages/tools/random-name.astro` | Static layout + `RandomNameIsland` (`client:idle`) |
| `/tools/baby-names` | `src/pages/tools/BabyNames.tsx` | Baby Name Finder & Filter | Interactive Tool | **CRITICAL** (Priority 0.8) | `src/pages/tools/baby-names.astro` | Static layout + `BabyNamesIsland` (`client:idle`) |
| `/tools/username-generator` | `src/pages/tools/UsernameGenerator.tsx` | 20+ Handle Variation Builder | Interactive Tool | **CRITICAL** (Priority 0.8) | `src/pages/tools/username-generator.astro` | Static layout + `UsernameGeneratorIsland` (`client:idle`) |
| `/tools/name-comparison` | `src/pages/tools/NameComparison.tsx` | Side-by-Side Comparison Tool | Interactive Tool | **CRITICAL** (Priority 0.8) | `src/pages/tools/name-comparison.astro` | Static layout + `NameComparisonIsland` (`client:idle`) |
| `/tools/trend-visualizer` | `src/pages/tools/TrendVisualizer.tsx` | 140-Year Historical Chart Visualizer | Interactive Tool | **CRITICAL** (Priority 0.8) | `src/pages/tools/trend-visualizer.astro` | Static layout + `TrendVisualizerIsland` (`client:visible`) |
| `/tools/unique-name-generator` | `src/pages/tools/UniqueNameGenerator.tsx` | Rare Name Filter & Generator | Interactive Tool | **CRITICAL** (Priority 0.8) | `src/pages/tools/unique-name-generator.astro` | Static layout + `UniqueNameGeneratorIsland` (`client:idle`) |
| `/tools/popularity-guide` | `src/pages/tools/PopularityGuide.tsx` | Educational Visual Guide | Static Content | **CRITICAL** (Priority 0.8) | `src/pages/tools/popularity-guide.astro` | 100% Static HTML |
| `/tools/meaning` | `src/pages/tools/MeaningLookup.tsx` | Etymology & Meaning Search | Interactive Tool | **CRITICAL** (Priority 0.8) | `src/pages/tools/meaning.astro` | Static layout + `MeaningLookupIsland` (`client:idle`) |
| `/blog` | `src/pages/BlogIndex.tsx` | Blog Index & Category Filtering | Static + Client Filter | **CRITICAL** (Priority 0.8) | `src/pages/blog/index.astro` | Static HTML grid with build-time category pages or lightweight filter island |
| `/blog/:slug` | `src/pages/BlogArticle.tsx` | Long-form Editorial Articles | Dynamic Param (`:slug`) | **CRITICAL** (Priority 0.7) | `src/pages/blog/[slug].astro` | `getStaticPaths()` for all blog articles; 100% static HTML with zero client JS |
| `/about` | `src/pages/About.tsx` | Brand & Founder Editorial Page | Static Informational | **CRITICAL** (Priority 0.8) | `src/pages/about.astro` | 100% Static HTML |
| `/methodology` | `src/pages/Methodology.tsx` | Statistical Modelling Documentation | Static Informational | **CRITICAL** (Priority 0.8) | `src/pages/methodology.astro` | 100% Static HTML |
| `/privacy` | `src/pages/Privacy.tsx` | Privacy Policy (GDPR/CCPA) | Legal / Static | **CRITICAL** (Priority 0.8) | `src/pages/privacy.astro` | 100% Static HTML |
| `/terms` | `src/pages/Terms.tsx` | Terms of Service | Legal / Static | **CRITICAL** (Priority 0.8) | `src/pages/terms.astro` | 100% Static HTML |
| `/disclaimer` | `src/pages/Disclaimer.tsx` | Statistical Disclaimer | Legal / Static | **CRITICAL** (Priority 0.8) | `src/pages/disclaimer.astro` | 100% Static HTML |
| `/contact` | `src/pages/Contact.tsx` | Contact & Inquiries | Static Informational | **CRITICAL** (Priority 0.8) | `src/pages/contact.astro` | 100% Static HTML |
| `/admin/gender-health` | `src/pages/AdminGenderHealth.tsx` | Admin Diagnostic Dashboard | Client-only Admin | Low (Internal) | `src/pages/admin/gender-health.astro` | Single client-only island (`client:only="react"`) with `noindex` robots |
| `*` | `src/pages/NotFound.tsx` | 404 Error Page | Fallback | High (User Experience) | `src/pages/404.astro` | Static 404 HTML page |

---

## 3. Current SEO Implementation & Flaws to Fix

### 3.1 Flaws in Current Vite SPA Architecture
1. **Client-Side Title & Meta Injection:** Current pages rely on `useEffect` in `SEOHead.tsx` to set `document.title`, `<meta name="description">`, Open Graph, and Twitter tags. Crawlers that do not execute JavaScript immediately receive default homepage tags from `index.html`.
2. **Fragile Post-Build Prerendering:** The custom `scripts/prerender-top-names.mjs` script performs regex replacements on `dist/index.html` after build. This only covers ~100 names and ~20 static pages, leaving thousands of indexable names as unprerendered client-side SPA routes.
3. **Canonical Race Conditions:** `src/Canonical.jsx` runs with `window.setTimeout(..., 0)` to allow `SEOHead.tsx` to mount first. This creates timing vulnerabilities for search engine crawlers.
4. **Duplicate Schema Script Tags:** `SEOHead.tsx` removes and recreates `<script type="application/ld+json">` dynamically on the DOM, which can lead to missed schema indexing during fast crawler passes.

### 3.2 Astro Target SEO Solution
1. **100% Server/Build Rendered `<head>`:** All `<title>`, `<meta>`, canonical `<link>`, hreflang, Open Graph, Twitter cards, and JSON-LD schemas are baked directly into the static HTML during `astro build`.
2. **Unified `SEO.astro` Component:** Centralizes standard metadata, custom schemas, robots directives (`index, follow` vs `noindex`), canonical normalization (apex domain, trailing slash removal), and social preview assets.
3. **Static JSON-LD Generation:** JSON-LD structured data (`WebSite`, `Organization`, `Person`, `BreadcrumbList`, `FAQPage`, `Article`, `SoftwareApplication`, `HowTo`, `CollectionPage`, `ItemList`) rendered in static `<script type="application/ld+json">` without client runtime cost.
4. **Static Breadcrumbs with Schema:** `Breadcrumbs.astro` renders accessible HTML (`<nav aria-label="Breadcrumb">`) along with accompanying `BreadcrumbList` schema.

---

## 4. Component Classification

### 4.1 STATIC Components (100% Astro HTML — 0 KB Client JS)
- `SiteFooter.tsx` → `src/components/SiteFooter.astro` (Static link hierarchy, copyright, branding)
- `Breadcrumbs.tsx` → `src/components/Breadcrumbs.astro` (Accessible navigation + JSON-LD)
- `AdSlot.tsx` → `src/components/AdSlot.astro` (Static markup container for ads)
- `DataSources.tsx` → `src/components/DataSources.astro` (Citation and trust block)
- `DataFreshness.tsx` → `src/components/DataFreshness.astro` (Data update timestamp badge)
- `DataSnapshot.tsx` → `src/components/DataSnapshot.astro` (Editorial table/stat card)
- `EntitySEOSections.tsx` (`FeatureGrid`, `ProsCons`, `ComparisonTable`, `UseCases`, `WorkedExamples`, `RelatedToolsInline`) → `src/components/EntitySEOSections.astro`
- `RelatedPosts.tsx` → `src/components/RelatedPosts.astro` (Internal linking grid computed at build time from tags)
- `AlphabetJumpNav.tsx` → `src/components/AlphabetJumpNav.astro` (A–Z letter jump links)
- `ToolCTA.tsx` → `src/components/ToolCTA.astro` (Contextual call-to-action banner)
- `HomeBelowFold.tsx` (FAQ accordion, stats, authority content, CTR variations) → Server-rendered Astro components
- `BlogArticle` content parser (`MarkdownTable`, `ContentBlock`) → Server-rendered markdown/tokens in Astro

### 4.2 INTERACTIVE Components (React Islands — Loaded Only When Needed)
- **`NameSearchHero` (`src/islands/NameSearchHero.tsx`):**
  - *Reason for Hydration:* Real-time keystroke input validation, animated shake feedback on invalid input, live name suggestion dropdown, client routing transition.
  - *Hydration Strategy:* `client:idle` (or `client:load` on homepage above-the-fold).
- **`SiteHeader` (`src/islands/SiteHeader.tsx`):**
  - *Reason for Hydration:* Mobile hamburger drawer toggle state, inline header search input with autocomplete submission.
  - *Hydration Strategy:* `client:idle`.
- **`NameInsightReport` (`src/islands/NameInsightReport.tsx`):**
  - *Reason for Hydration:* Interactive Recharts (SVG render, responsive container, tooltips, hover states) for popularity over time, decade breakdown, age distribution, and client-side gender detection fallback verification (`/api/gender-detect`).
  - *Hydration Strategy:* `client:visible`.
- **Interactive Tool Engines (`src/islands/tools/*`):**
  - `PopularityCheckerIsland.tsx` (Keystroke calculation, interactive charts)
  - `RandomNameGeneratorIsland.tsx` (Client-side random generator with gender filter)
  - `BabyNamesIsland.tsx` (Interactive filter by decade, gender, origin)
  - `UsernameGeneratorIsland.tsx` (Client username variation generator with copy-to-clipboard)
  - `NameComparisonIsland.tsx` (Dual-name side-by-side comparison charts)
  - `TrendVisualizerIsland.tsx` (Interactive multi-name time-series line chart with decade sliders)
  - `UniqueNameGeneratorIsland.tsx` (Rarity score filter slider and randomizer)
  - `MeaningLookupIsland.tsx` (Live etymology search input)
  - *Reason for Hydration:* Client event listeners, interactive calculators, React state, Recharts rendering.
  - *Hydration Strategy:* `client:idle` or `client:visible`.
- **`BookmarkShareButtons.tsx` (`src/islands/BookmarkShareButtons.tsx`):**
  - *Reason for Hydration:* `localStorage` bookmark saving, `navigator.share` / clipboard copying with toast feedback.
  - *Hydration Strategy:* `client:idle`.
- **`AdminGenderHealth.tsx` (`src/islands/AdminGenderHealth.tsx`):**
  - *Reason for Hydration:* Client password gate, async live fetch probes to `/api/gender-detect`.
  - *Hydration Strategy:* `client:only="react"`.

### 4.3 SERVER/DATA Components (Frontmatter Build-Time Data Loading)
- Name dataset queries (`getNameData()`, `getNamesForLetter()`, `searchNames()`, `getSimilarNames()`)
- Blog registry queries (`getBlogArticle()`, `blogArticles`, `blogCategories`, `getTagsForSlug()`)
- Gender detection database (`usSSAGender.ts`, `detectGender()`)
- Sitemap generation (`generate-sitemap.mjs`)

---

## 5. Phase 1 Architecture Foundation

### 5.1 Directory Layout
```
/
├── astro.config.mjs          # Astro configuration with React & Tailwind integrations
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro  # Master HTML shell with server-rendered head, fonts, scripts
│   ├── components/
│   │   ├── SEO.astro         # Build-time SEO meta, canonical, open graph, JSON-LD
│   │   ├── Breadcrumbs.astro # Static HTML breadcrumb navigation + Schema
│   │   └── InternalLinks.astro # Centralized crawl-graph internal links
│   ├── islands/              # Isolated React interactive components (hydrated via client directives)
│   ├── pages/                # Astro file-based routes (coexisting with Vite during migration)
│   ├── data/                 # Existing shared TypeScript datasets (nameData, blogData, etc.)
│   ├── lib/                  # Shared utilities (similarNames, genderDetection, etc.)
│   └── styles/
│       └── global.css        # Global Tailwind and custom theme variables
├── package.json              # Configured with both Vite and Astro scripts
└── MIGRATION_PHASE_1.md      # This document
```

### 5.2 Coexistence & Safety Rules
1. The existing Vite SPA (`src/App.tsx`, `src/main.tsx`, `index.html`, `vite.config.ts`) remains 100% functional and testable via `npm run dev:vite` / `npm run build:vite`.
2. Astro development runs via `npm run dev:astro` / `npx astro dev`.
3. Production URLs, slugs, canonical rules, and redirects remain identical.
4. Phase 2 will execute route-by-route migration of static pages, followed by Phase 3 (name & similar-names programmatic pages), and Phase 4 (interactive tools islands).
