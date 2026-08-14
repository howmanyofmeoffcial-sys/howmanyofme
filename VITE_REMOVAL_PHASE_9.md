# Vite & SPA Retirement Documentation — Phase 9
## Project: HowManyOfMe.co

---

## A. Removed Vite Components & Configurations

The following files belonging strictly to the legacy Vite build pipeline have been completely removed:

- **`vite.config.ts`**: Legacy build and plugin configuration.
- **`index.html`**: The legacy client-side SPA shell containing `<div id="root"></div>`.
- **`@vitejs/plugin-react-swc` & `lovable-tagger`**: Removed from `package.json` dependencies.
- **`build:dev` & `dev:astro` & `preview:astro`**: Replaced by standard `npm run dev`, `npm run build`, `npm run preview`.

---

## B. Removed SPA Components & Architecture

- **`src/main.tsx`**: Legacy `ReactDOM.createRoot` mounting script.
- **`src/App.tsx` & `src/App.css`**: Legacy React Router top-level application wrapper.
- **`src/Canonical.jsx`**: Legacy runtime `useLocation` canonical tag injector.
- **`src/components/home/HomeBelowFold.tsx`**: Legacy client-rendered homepage body.
- **`src/components/NavLink.tsx` & `src/components/RouteErrorBoundary.tsx` & `src/components/ScrollToTop.tsx`**: Legacy SPA navigation utilities.
- **Legacy React Pages in `src/pages/*.tsx` and `src/pages/tools/*.tsx`**: All 26 legacy SPA page components removed after 100% static Astro page recreation.

---

## C. React Router Removal

- **`react-router-dom`**: Completely removed from `package.json` and production codebase.
- **Zero Runtime Dependencies**: All links across the site use standard HTML `<a href="...">` anchors with zero JavaScript overhead for crawlability.
- **Deep-linking & Parameters**: Interactive tool islands use standard browser APIs (`URLSearchParams`, `window.location.href`) without requiring an SPA router.

---

## D. Old Prerender Removal & Replacement

- **`scripts/prerender-top-names.mjs`**: Deleted.
- **Replacement**: Native Astro static generation via `getStaticPaths()` in:
  - `src/pages/name/[name].astro` (583 name entity pages)
  - `src/pages/names/[letter].astro` (26 A–Z directories)
  - `src/pages/similar-names/[name].astro` (583 soundalike pages)
  - `src/pages/blog/[slug].astro` (32 editorial blog posts)

---

## E. SEO Architecture

- **`src/components/SEO.astro`**: Centralized, server-rendered `<head>` metadata generator.
- **Zero JavaScript Requirement for SEO**: Titles, meta descriptions, canonical URLs, robots directives, Open Graph, and JSON-LD schemas (`WebPage`, `FAQPage`, `BreadcrumbList`, `Article`, `CollectionPage`) are 100% baked into initial static HTML.

---

## F. Build Architecture (Old vs. New)

```text
OLD (Vite + SPA + Prerender Workaround)
----------------------------------------
npm run build
  ↓
vite build (outputs dist/index.html + bundle)
  ↓
node scripts/generate-sitemap.mjs
  ↓
node scripts/prerender-top-names.mjs (regex string replacements on HTML)


NEW (Pure Astro Static Build)
-----------------------------
npm run build
  ↓
astro build
  ↓
Generates 1,243 clean, server-rendered static HTML pages in ~8 seconds
```

---

## G. Vercel Hosting Architecture (Old vs. New)

- **Old `vercel.json`**: `"framework": "vite"` with catch-all rewrite `/((?!api/).*) -> /index.html` (risk of soft-404s).
- **New `vercel.json`**: `"framework": "astro"` with zero catch-all rewrites. Real 404 pages return HTTP 404 status, protecting SEO indexation health.

---

## H. Remaining React Islands (Audited & Verified)

React remains active strictly for genuinely interactive client-side user experiences:

1. **`src/islands/SiteHeader.tsx`** (`client:idle`): Mobile navigation toggle and instant search shortcut.
2. **`src/islands/NameSearchHero.tsx`** (`client:load`): Live autocomplete search bar with instant keyboard navigation.
3. **`src/islands/NameInsightReport.tsx`** (`client:visible`): Interactive demographic tabs, regional calculators, and dynamic decade curves.
4. **`src/islands/BookmarkShareButtons.tsx`** (`client:idle`): Native clipboard copy and Web Share API.
5. **`src/islands/tools/BabyNamesBrowser.tsx`** (`client:load`): Interactive A–Z letter filter and gender switcher.
6. **`src/islands/tools/RandomNameIsland.tsx`** (`client:load`): Instant 10-name randomizer with gender filters.
7. **`src/islands/tools/UsernameGeneratorIsland.tsx`** (`client:load`): 8-style username creator with one-click clipboard copy.
8. **`src/islands/tools/UniqueNameIsland.tsx`** (`client:load`): Dynamic rarity threshold slider and generator.
9. **`src/islands/tools/MeaningLookupIsland.tsx`** (`client:load`): Etymology search with quick-preset chips.
10. **`src/islands/tools/PopularityCheckerIsland.tsx`** (`client:load`): Fast name lookup and redirect.
11. **`src/islands/tools/NameComparisonIsland.tsx`** (`client:load`): Head-to-head name comparison form.
12. **`src/islands/tools/TrendVisualizerIsland.tsx`** (`client:load`): Multi-series Recharts time-series visualizer.

---

## I. Vite References Audit

- **Application Build Pipeline**: Zero direct Vite production dependencies or configuration.
- **Transitive / Internal**: Astro and Vitest use Vite internally as their low-level bundler/test runner, which is standard modern practice.
