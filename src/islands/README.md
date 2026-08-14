# React Islands Directory (`src/islands/`)

This directory is reserved for React components that require client-side browser hydration in Astro pages.

## Guidelines & Best Practices

1. **Only interactive widgets live here:**
   - Search autocomplete / query forms (`NameSearchHero`, `HeaderSearch`)
   - Interactive calculators & generators (`PopularityChecker`, `RandomNameGenerator`, `BabyNames`, `UsernameGenerator`, `NameComparison`, `TrendVisualizer`, `UniqueNameGenerator`, `MeaningLookup`)
   - SVG Chart visualizations powered by Recharts (`NameInsightReport` charts)
   - Bookmark / Clipboard / Web Share API actions
   - Admin diagnostic probe (`AdminGenderHealth`)

2. **Static presentation components do NOT belong here:**
   - Headers with pure link lists, Footers, Breadcrumbs, Entity SEO Sections, Markdown tables, Content blocks, and Informational cards must remain static Astro components (`.astro`) with 0 KB JavaScript footprint.

3. **Hydration Directives:**
   - `client:load` — Immediate hydration for critical above-the-fold interactive components (e.g. primary search hero).
   - `client:idle` — Hydrate when the browser is idle for secondary interactive forms and generators.
   - `client:visible` — Hydrate only when scrolled into the viewport for below-the-fold Recharts / insight graphs.
   - `client:only="react"` — Reserved for client-only dashboards (e.g. `/admin/gender-health`).
