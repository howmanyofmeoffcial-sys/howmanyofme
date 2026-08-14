# Data Dictionary
## Project: HowManyOfMe.co

---

## 1. Canonical Name Record (`NameRecord`)

| Field | Meaning | Type | Source | Derived? | Nullable? | Example |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | Canonical title-cased display name | `string` | SSA / Census | No | No | `"James"` |
| `normalizedName` | Lowercased, whitespace-trimmed index key | `string` | Pipeline | Yes | No | `"james"` |
| `slug` | Clean URL routing slug | `string` | Pipeline | Yes | No | `"James"` |
| `count` | Canonical historical count (total SSA recorded births) | `number` | SSA (1880–2024) | Yes | No | `4712453` |
| `gender` | Primary sex classification (`male` \| `female` \| `unisex`) | `string` | SSA sex ratio | Yes | No | `"male"` |
| `rank` | 1-based national popularity rank sorted by total births | `number` | SSA totals | Yes | No | `1` |
| `origin` | Linguistic and cultural etymological origin | `string` | Reference lexicon | No | No | `"Hebrew"` |
| `meaning` | Historical and linguistic definition | `string` | Reference lexicon | No | No | `"Supplanter"` |
| `ssa.totalBirths` | Sum of all SSA birth card registrations (1880–2024) | `number` | SSA | Yes | No | `4712453` |
| `ssa.maleBirths` | Sum of male SSA birth card registrations | `number` | SSA | Yes | No | `4642100` |
| `ssa.femaleBirths` | Sum of female SSA birth card registrations | `number` | SSA | Yes | No | `70353` |
| `ssa.firstYear` | Earliest year with recorded birth applications ($\ge 5$) | `number` | SSA | No | No | `1880` |
| `ssa.lastYear` | Latest available recorded birth year | `number` | SSA | No | No | `2024` |
| `ssa.peakYear` | Year with the highest recorded annual births | `number` | SSA yearly rows | Yes | No | `1947` |
| `ssa.peakYearBirths` | Number of births recorded during the peak year | `number` | SSA yearly rows | Yes | No | `94750` |
| `ssa.recentBirths` | Cumulative births in the 10-year window (2015–2024) | `number` | SSA (2015–2024) | Yes | No | `132450` |
| `ssa.recentWindow` | Time range for recent popularity calculation | `string` | Metadata | Yes | No | `"2015-2024"` |
| `census2020.count` | Observed first-name count in 2020 Decennial Census | `number` | U.S. Census 2020 | No | Yes | `3392966` |
| `census2020.rank` | First-name rank in 2020 Decennial Census returns | `number` | U.S. Census 2020 | No | Yes | `1` |
| `census2020.pctMale` | Percentage of male individuals in Census returns | `number` | U.S. Census 2020 | No | Yes | `98.5` |
| `census2020.pctFemale` | Percentage of female individuals in Census returns | `number` | U.S. Census 2020 | No | Yes | `1.5` |
| `decade_popularity` | Normalized 0–100 index across 9 decades (1940s–2020s) | `Record<string, number>` | SSA decade sums | Yes | No | `{"1940s": 95, ...}` |
| `sources` | List of supporting source identifiers | `string[]` | Metadata | Yes | No | `["ssa-popular-names", "census-2020-first-names"]` |
