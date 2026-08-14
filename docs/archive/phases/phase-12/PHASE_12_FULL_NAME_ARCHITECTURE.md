# Phase 12 Architecture — Full-Name / People Entity System
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## A. Entity Model
The system keeps first names and surnames as independent canonical entities, combining them strictly via deterministic demographic modeling:
```text
FirstNameEntity (SSA / Census 2020)
       +
LastNameEntity (Census Decennial Surnames)
       ↓
FullNameCombinationModel (Joint Probability under Independence)
       ↓
Quality & Indexability Gate (isIndexable.ts)
       ↓
/people/[first]-[last] (100% Server-Rendered HTML)
```

---

## B. Surname Data Source
- Provider: U.S. Census Bureau Frequently Occurring Surnames.
- Local snapshot: `src/data/raw/census/surnames_2010_2020.json`.
- Zero scraped or personal people-search databases.

---

## C. Combination Model
- Operates under the joint probability law:
  $$P(\text{Full Name}) \approx P(\text{First Name}) \times P(\text{Surname})$$
- Calculated at build time and cached in `src/data/generated/fullnames-index.json`.

---

## D. Estimation Formula
$$\text{Expected Living Bearers} = \frac{\text{FirstNameLiving} \times \text{SurnameCount}}{295,000,000}$$

---

## E. Independence Assumption
- Prominently disclosed in the Quick Answer card, Methodology section, and FAQ schemas.
- Explicitly warns that ethnic and regional clustering can create deviations from pure independence.

---

## F. Rounding
- Tiered rounding rules prevent false precision (e.g. `31,234.82` $\to$ `~31,000`).

---

## G. Quality Model
- Indexable full-name pages require:
  1. Valid, canonical first-name entity ($\text{Living} \ge 100$).
  2. Valid, canonical surname entity ($\text{Occurrences} \ge 500$).
  3. Positive model estimate ($> 0$).
  4. Unique, collision-free slug.

---

## H. Candidate Generation
- Controlled generation of high-demand combinations ($35 \text{ First Names} \times 20 \text{ Surnames} = 700 \text{ entities}$) to avoid Cartesian explosion.

---

## I. Indexability
- Managed by `src/lib/fullNames/isIndexable.ts`.
- Non-indexable or unvalidated combinations return 404.

---

## J. URL Architecture
- Centralized URL generator: `getFullNameUrl(firstName, lastName)` $\to$ `/people/[first]-[last]`.
- Normalizes Unicode accents (e.g. `José García` $\to$ `jose-garcia`).

---

## K. Internal Linking
- `/people/[first]-[last]` $\to$ `/name/[first]` (First Name Statistics).
- `/people/[first]-[last]` $\to$ 8 contextual related full-name combinations.
- `/name/[first]` $\to$ Top 8 popular full-name combinations for that first name.

---

## L. Sitemap
- `scripts/generate-sitemap.mjs` automatically includes all 700 approved `/people/[slug]` URLs.

---

## M. Privacy & Compliance
- Strictly aggregate demographic statistics.
- ZERO personally identifiable information (no addresses, phone numbers, ages of individuals, or people lookups).

---

## N. Performance
- 100% Server-Rendered Astro HTML.
- Zero client-side JavaScript required for core content and SEO indexing.

---

## O. Known Limitations
- Does not account for localized ethnic co-occurrence correlations.
- Surnames occurring fewer than 100 times in Census returns are suppressed.
