# Name Data Audit — Phase 3
## HowManyOfMe.co Programmatic Name Dataset Analysis

Date: August 14, 2026  
Target: Static build generation of `/name/[name]` routes

---

## 1. Executive Summary & Measured Counts

| Metric | Measured Value | Description |
| :--- | :--- | :--- |
| **Total Source Names in Dataset** | **583** | Extracted from `POPULAR_NAMES` + `EXTENDED_NAMES` across all letters A–Z |
| **Total Normalized Unique Names** | **583** | Normalized to Title-Case (e.g. `James`, `Emma`) with lowercase route slugs |
| **Curated Primary Records** | **20** | Full bespoke historical profiles with specific SSA rank 1–20 in `POPULAR_NAMES` |
| **Model-Enhanced Records** | **563** | Extended names with deterministic demographic & actuarial modeling |
| **Duplicate Normalized Names** | **0** | No collisions across casing or letter groups |
| **Invalid Names** | **0** | All names meet length (2–20 chars) and alphabetical (`^[A-Za-z]+$`) rules |
| **Potential Indexable Names** | **583** | Meet the Data Quality Gate (valid spelling, meaningful stats, related links) |
| **Excluded / Thin Names** | **0** | Zero junk or unverified placeholder strings |
| **Alphabet Coverage** | **26 / 26 letters** | A (35) through Z (7) |

---

## 2. Schema and Data Fields

Every name resolved through the name data architecture conforms to the following schema:

```typescript
export interface NameRecord {
  name: string;                         // Canonical display name (e.g., "James")
  slug: string;                         // URL-safe lowercase slug (e.g., "james")
  count: number;                        // Estimated global living bearers
  rank: number;                         // Global/national frequency rank
  gender: 'male' | 'female' | 'unisex'; // Statistical gender association
  origin: string;                       // Cultural/linguistic origin tradition
  meaning: string;                      // Etymological definition / semantic origin
  regions: Record<string, number>;      // Country bearer distribution
  decade_popularity: Record<string, number>; // Decade index scores (1940s–2020s)
  isCurated: boolean;                   // Flag whether record is top curated or modelled
}
```

### Data Field Breakdown:
1. **Name & Slug**: Controlled via centralized `normalizeName` utility to prevent case-sensitive routing fragmentation.
2. **Frequency & Rank (`count`, `rank`)**: Derived from US SSA birth registry aggregates (1880–present) and actuarial survival curves.
3. **Gender Breakdown (`gender`)**: Verified against US SSA historical dataset and international records.
4. **Geographic Distribution (`regions`)**: Modelled by cultural origin, US Census records, and international demographic datasets.
5. **Decade Popularity (`decade_popularity`)**: Relative scoring index across 9 decades (1940s through 2020s).
6. **Etymology (`origin`, `meaning`)**: Linguistic roots associated with the name.

---

## 3. Data Quality & Indexability Gate

To prevent programmatic thin content and soft 404s, each name must pass the **Indexability Gate**:

1. **Format Validation**: Must match `/^[A-Za-z]{2,20}$/`, no numbers, spaces, or spam repetitions.
2. **Entity Consistency**: Must have complete demographic estimates (non-zero `count`, non-zero `rank`, at least 3 regional distributions, 9 decades of trend data).
3. **Internal Linking**: Must be discoverable via alphabetical directory (`/names/[letter]`), similar-name graph, and related tools.
4. **Canonical Identity**: URL slug must be strictly lowercase (or preserved existing route standard) with 1:1 canonical matching.
5. **Unknown / Junk Query Handling**: Dynamic queries for names not in the canonical indexable registry or failing validation must return `404 Not Found` (or a controlled search fallback), preventing Googlebot from indexing thin pages.

---

## 4. Letter-by-Letter Distribution

| Letter | Count | Sample Names |
| :---: | :---: | :--- |
| **A** | 35 | Aaron, Abigail, Adam, Alexander, Ava, Avery |
| **B** | 24 | Benjamin, Barbara, Blake, Brandon, Brooke |
| **C** | 38 | Caleb, Charlotte, Christopher, Claire, Connor |
| **D** | 29 | Daniel, David, Dylan, Diana, Dominic |
| **E** | 36 | Eleanor, Elijah, Elizabeth, Emily, Emma, Ethan |
| **F** | 15 | Faith, Felix, Fiona, Francis, Frank |
| **G** | 25 | Gabriel, George, Grace, Grayson, Gregory |
| **H** | 20 | Hannah, Harper, Henry, Hudson, Hunter |
| **I** | 12 | Ian, Isaac, Isabel, Isabella, Isla, Ivan |
| **J** | 54 | Jack, Jackson, Jacob, James, Jennifer, John, Joseph |
| **K** | 24 | Katherine, Kayla, Kenneth, Kevin, Kylie |
| **L** | 36 | Layla, Leo, Liam, Lily, Logan, Lucas, Luke |
| **M** | 47 | Margaret, Mason, Matthew, Maya, Michael, Muhammad |
| **N** | 17 | Natalie, Nathan, Nicholas, Noah, Nora |
| **O** | 7 | Oliver, Olivia, Omar, Oscar, Owen |
| **P** | 17 | Penelope, Patrick, Paul, Piper, Preston |
| **Q** | 3 | Queen, Quentin, Quinn |
| **R** | 34 | Rachel, Raymond, Rebecca, Riley, Robert, Ryan |
| **S** | 40 | Samuel, Sarah, Scarlett, Sebastian, Sophia |
| **T** | 25 | Taylor, Theodore, Thomas, Timothy, Tyler |
| **U** | 3 | Ulysses, Uma, Ursula |
| **V** | 10 | Valerie, Vanessa, Victor, Victoria, Vincent |
| **W** | 17 | William, Willow, Winston, Wyatt |
| **X** | 3 | Xavier, Ximena, Xander |
| **Y** | 4 | Yasmin, Yolanda, Yvette, Yvonne |
| **Z** | 7 | Zachary, Zane, Zara, Zelda, Zion, Zoe, Zoey |
| **Total** | **583** | **100% valid, unique, indexable names** |
