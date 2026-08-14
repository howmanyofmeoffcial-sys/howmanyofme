# System Architecture

## 1. High-Level Model
HowManyOfMe.co is engineered as a **Pure Astro Static Site (SSG)** paired with **React Islands** for client-side interactivity.

```text
Build Time:
Official Data Sources (SSA + Census)
        ↓
Data Pipeline Ingestion & Normalization
        ↓
Canonical Pre-rendered Static Pages (Astro SSG)
        ↓
Client:
Static HTML + CSS (Zero runtime JS overhead for content)
        ↓
Hydrated React Islands (Search autocomplete, interactive charts, copy tools)
```

---

## 2. Technology Stack
- **Framework**: [Astro 7.2+](https://astro.build/) in purely static pre-render mode (`output: 'static'`).
- **UI Islands**: [React 18](https://react.dev/) using `client:idle` or `client:load` directives only where genuinely interactive.
- **Styling**: Tailwind CSS v3 with custom semantic tokens and `@tailwindcss/typography`.
- **Validation**: Zod schema validation for all ingested and generated demographic entities.
- **Testing**: Vitest for unit & integration testing; automated Node.js health engines for SEO and build gating.

---

## 3. Directory Layout
- `src/pages/`: Astro file-based static routes.
- `src/layouts/`: Base layouts (`BaseLayout.astro`) providing structured schema, meta tags, and critical assets.
- `src/components/`: Reusable static UI components (Breadcrumbs, CitationBlock, AdSlot, ToolCTA, SourceBox).
- `src/islands/`: Isolated interactive React components (SiteHeader, CopyCitationButton, NameDetail, ToolCard).
- `src/lib/`: Pure domain logic and data accessors (names, fullNames, surnames, comparisons, seo, analytics, monitoring).
- `src/data/`: Static JSON datasets generated deterministically by the build pipeline.
- `scripts/`: Data ingestion, validation, sitemap generation, and automated audit tools.
