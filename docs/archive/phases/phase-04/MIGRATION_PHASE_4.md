# Migration Phase 4 Documentation
## Internal Linking + Crawl Architecture + Indexability
## Project: HowManyOfMe.co

---

## 1. Internal Linking Architecture

Phase 4 establishes an SEO internal discovery graph for HowManyOfMe.co that ensures search engine crawlers and users can discover every indexable entity without relying solely on the XML sitemap.

### The Semantic Crawl Graph

```text
                           ┌──────────────┐
                           │   Homepage   │
                           └──────┬───────┘
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
      ┌────────────────────┐            ┌────────────────────┐
      │  Popular Names Grid│            │ A–Z Directory Hubs │
      │   (/name/James...) │            │    (/names/a-z)    │
      └──────────┬─────────┘            └──────────┬─────────┘
                 │                                 │
                 │   ┌─────────────────────────────┘
                 ▼   ▼
      ┌────────────────────────────────────────────┐
      │           Entity Page: /name/[name]        │
      │  ├── Breadcrumbs → /names/[letter]         │
      │  ├── Prev/Next Neighbor → /name/[sibling]  │
      │  ├── Similar Names (10) → /name/[sound]    │
      │  ├── Related Origin (6) → /name/[origin]   │
      │  ├── Contextual Tools → /tools/[tool]      │
      │  └── Themed Articles → /blog/[article]     │
      └────────────────────────────────────────────┘
```

---

## 2. Centralized Canonical URL Resolver

To eliminate URL drift, double-slash errors, and case-sensitive routing bugs, all internal links pass through [src/lib/seo/canonicalUrl.ts](file:///Users/riponchakma/Downloads/Howmanyofme/src/lib/seo/canonicalUrl.ts):

- `getNameUrl(name)`: Returns canonical path (e.g. `/name/James`).
- `getNameAbsoluteUrl(name)`: Returns absolute URL (e.g. `https://howmanyofme.co/name/James`).
- `getLetterUrl(letter)`: Returns letter hub path (e.g. `/names/a`).
- `getSimilarNamesUrl(name)`: Returns similar names path (e.g. `/similar-names/james`).
- `getToolUrl(slug)`: Returns tool path (e.g. `/tools/popularity-checker`).
- `getBlogUrl(slug)`: Returns article path (e.g. `/blog/name-rarity-score-explained`).

---

## 3. A–Z Alphabet Directory Implementation (`src/pages/names/[letter].astro`)

- Pre-renders all 26 letter hubs (`/names/a` through `/names/z`).
- Generates server-rendered `<a href="/name/[Name]">` cards for every name starting with that letter.
- Contains an A–Z quick jump bar and circular previous/next letter navigation.
- Injects `ItemList` JSON-LD structured data linking all names for that letter.

---

## 4. Query Parameter & Filter Crawl Trap Mitigation

- Keystroke searches, filters, and dynamic calculators are executed client-side via React Islands or route directly to canonical clean URLs without appending crawler-visible duplicate query strings (`?search=`, `?q=`, `?filter=`).
- No pagination parameters exist on letter directories (all names per letter fit comfortably within single fast static HTML pages).

---

## 5. Automated Link & Depth Validation

Using [scripts/validate_internal_links.mjs](file:///Users/riponchakma/Downloads/Howmanyofme/scripts/validate_internal_links.mjs):
- **Total Internal Links Audited**: **65,096**
- **Valid Internal Links**: **65,096** (100%)
- **Broken Internal Links**: **0** (0%)
- **Crawl Depth**: 100% of names are reachable in **2 clicks** from the homepage (`/` → `/names/[letter]` → `/name/[Name]`).
- **Orphan Count**: **0** names with 0 incoming internal links.
