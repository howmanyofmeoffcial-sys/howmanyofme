# Vite Retirement & SPA Architecture Audit — Phase 9
## Project: HowManyOfMe.co

Date: August 14, 2026  
Objective: Complete removal of the legacy Vite + React SPA architecture in favor of a 100% Astro + React Islands static build engine.

---

## 1. Vite & SPA File Inventory

| Category | File / Artifact Path | Purpose in Old SPA | Astro Replacement Status |
| :--- | :--- | :--- | :--- |
| **Vite Config** | `vite.config.ts` | Vite build & plugin config | Replaced by `astro.config.mjs` |
| **SPA Entry HTML** | `index.html` | `<div id="root"></div>` mount shell | Replaced by `src/layouts/BaseLayout.astro` |
| **SPA Entry Script** | `src/main.tsx` | `ReactDOM.createRoot` mount script | Obsolete (Astro manages island mounting) |
| **SPA Root App** | `src/App.tsx` & `src/App.css` | React Router route definitions | Replaced by Astro filesystem routing |
| **Old Router** | `react-router-dom` | Client-side routing | Replaced by native Astro static pages & `<a href>` |
| **Old Prerender Workaround** | `scripts/prerender-top-names.mjs` | Post-build HTML regex patching | Replaced by Astro `getStaticPaths()` |
| **Old Client SEO** | `src/components/SEOHead.tsx` | `document.title` / `useEffect` mutation | Replaced by `src/components/SEO.astro` |
| **SPA Rewrite Fallback** | `vercel.json` rewrite (`/((?!api/).*) -> /index.html`) | Catch-all for React Router | Obsolete (Static files served directly) |

---

## 2. Capability Replacement & Verification Matrix

| Production Capability | Old Vite SPA Implementation | New Astro Architecture | Status |
| :--- | :--- | :--- | :--- |
| **Routing** | React Router (`react-router-dom`) | Astro Filesystem Routing (`src/pages/`) | ✅ Verified |
| **SEO Metadata** | Client `useEffect` in `SEOHead.tsx` | `src/components/SEO.astro` in `<head>` | ✅ Verified |
| **Programmatic Entity Pages**| Client runtime + manual prerender | `src/pages/name/[name].astro` (`getStaticPaths`) | ✅ Verified |
| **Alphabet Directories** | `LetterDirectory.tsx` SPA component | `src/pages/names/[letter].astro` | ✅ Verified |
| **Sitemap Generation** | Manual script | Authoritative `scripts/generate-sitemap.mjs` | ✅ Verified |
| **Robots.txt** | `public/robots.txt` | `public/robots.txt` (Canonical production) | ✅ Verified |
| **Analytics & GTM** | SPA initial mount script | `BaseLayout.astro` (`requestIdleCallback`) | ✅ Verified |
| **Monetization / Ads** | `AdSlot.tsx` | `AdSlot.astro` (with layout containment) | ✅ Verified |
| **Interactive Search** | Full-app React tree | `NameSearchHero.tsx` Island (`client:load`) | ✅ Verified |
| **Data Visualizations** | Full-app React Recharts | `NameInsightReport.tsx` Island (`client:visible`)| ✅ Verified |
| **Build Pipeline** | `vite build` | `astro build` | ✅ Verified |
| **Hosting Deployment** | Vercel SPA rewrites | Vercel Astro static output | ✅ Ready |
