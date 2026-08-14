# Migration Phase 3 Documentation
## Programmatic Name Pages Migration (`/name/[name]`)
## Project: HowManyOfMe.co

---

## 1. Programmatic Page Architecture

Phase 3 transitions HowManyOfMe.co's primary programmatic SEO entity pages (`/name/[name]`) from client-side React rendering to build-time static HTML generation via Astro with minimal React Island hydration.

### The Build Pipeline

```text
       Source Data (src/data/nameData.ts)
                       │
                       ▼
       Normalization (src/lib/names/normalizeName.ts)
                       │
                       ▼
       Validation Gate (src/lib/names/validateName.ts)
                       │
                       ▼
       Data Access Layer (src/lib/names/getAllNames.ts)
                       │
                       ▼
       Astro getStaticPaths() (src/pages/name/[name].astro)
                       │
                       ▼
       Build Output (dist/name/[Name]/index.html)
        ├── Static H1, intro, summary
        ├── Static demographic statistics & rank
        ├── Static decade breakdown & trends
        ├── Static regional distributions
        ├── Static gender & etymology context
        ├── Static Question/Answer structured FAQs
        ├── Static internal links (similar + related names)
        ├── Build-time JSON-LD (Person, FAQPage, BreadcrumbList)
        └── React Islands for UI only (Recharts graph, Save/Share, Search)
```

---

## 2. Server/Build-Time Data Access Layer (`src/lib/names/`)

To prevent pages and client bundles from importing frontend-oriented monolithic objects, we constructed a dedicated data access layer:

- **[normalizeName.ts](file:///Users/riponchakma/Downloads/Howmanyofme/src/lib/names/normalizeName.ts)**: Single source of truth for name normalization, title casing (`James`), URL slugs (`James`), lowercase matching (`james`), and canonical URLs (`https://howmanyofme.co/name/James`).
- **[validateName.ts](file:///Users/riponchakma/Downloads/Howmanyofme/src/lib/names/validateName.ts)**: Validates character sets (A–Z only), token length (2–20), vowel existence, and anti-spam patterns.
- **[getName.ts](file:///Users/riponchakma/Downloads/Howmanyofme/src/lib/names/getName.ts)**: Server-side record resolver. Returns `null` for unknown or non-canonical names when `allowFallback=false`, preventing thin fallback page generation.
- **[getAllNames.ts](file:///Users/riponchakma/Downloads/Howmanyofme/src/lib/names/getAllNames.ts)**: Returns all 583 canonical names sorted by popularity rank.
- **[getSimilarNames.ts](file:///Users/riponchakma/Downloads/Howmanyofme/src/lib/names/getSimilarNames.ts)**: Server-rendered Levenshtein and prefix similarity engine.
- **[getRelatedNames.ts](file:///Users/riponchakma/Downloads/Howmanyofme/src/lib/names/getRelatedNames.ts)**: Cultural and demographic relatedness engine (matching origin, gender, and era).

---

## 3. Indexability Gate & Anti-Thin Content Safeguards

1. **Quality Criteria**:
   - Every indexable page represents a genuine name with verified SSA/Census/UN demographic distributions.
   - Every page provides 9 decades of popularity scoring (1940s–2020s), multi-country estimates, and etymological origins.
   - Pages contain dynamic FAQ entity schemas matching visible accordion questions.
2. **Invalid / Unknown Query Policy**:
   - Unknown queries (`/name/random123`, `/name/notaname`) return `null` from `getName(name, false)` and trigger a 404 response rather than generating thin auto-created pages.

---

## 4. Server-Rendered Content & SEO Metadata

### 100% Server-Rendered Elements (No JS Required for Search Engines):
- `<title>`: `How Many People Are Named {Name}? Popularity, Rarity & Origin`
- `<meta name="description">`: Specific to `{Name}`, with living bearer count and global rank.
- `<link rel="canonical">`: Exact 1:1 canonical URL matching the normalized slug.
- Structured Data: `Person`, `FAQPage`, and `BreadcrumbList` rendered directly in `<script type="application/ld+json">`.
- Core headings: `H1`, `H2` sections for About, Historical Trends, Regional Distribution, Gender, Origin, and FAQs.
- Internal Link Graph: Direct `<a>` links to similar names, names of the same origin, A–Z letter hubs, and comparison tools.

### React Islands (Interactive Features Only):
1. **`SiteHeader`** (`client:idle`): Interactive search and mobile hamburger menu drawer.
2. **`BookmarkShareButtons`** (`client:idle`): LocalStorage bookmarking and native Web Share API dialog.
3. **`NameInsightReport`** (`client:visible`): Interactive Recharts line, pie, and bar visualizations.

---

## 5. Performance & Build Metrics

- **Total Static Pages Built**: **579** (578 programmatic name pages + 1 homepage)
- **Build Duration**: **6.06 seconds**
- **Memory Footprint**: Normal Node.js heap (<150MB)
- **HTML Payload**: ~73KB per full entity page with complete pre-rendered editorial content, schemas, and inlined critical styling.
- **JavaScript Efficiency**: Primary content and SEO link graph require 0 bytes of JavaScript to crawl and read.
