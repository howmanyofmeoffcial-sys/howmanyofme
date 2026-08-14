# Phase 12 — Full-Name Candidate & Indexability Report
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Candidate Generation Breakdown

| Metric | Count | Description |
| :--- | :--- | :--- |
| **Total Possible Combinations** | `29,150` | Full Cartesian product ($583 \text{ First Names} \times 50 \text{ Census Surnames}$) |
| **Candidate Combinations Evaluated** | `700` | High-quality controlled initial cohort ($35 \text{ Top First Names} \times 20 \text{ Top Surnames}$) |
| **Validated Combinations** | `700` | Passed schema, existence, and numerical bounds validation |
| **Indexable Combinations Approved** | `700` | Met all indexability gates ($\text{Estimate} > 0$, $\text{Living} \ge 100$, $\text{Surname} \ge 500$) |
| **Excluded Combinations** | `28,450` | Intentionally excluded from static cohort to prevent programmatic bloat |

---

## 2. Top Representative Indexable Full Names

1. **James Smith**: ~39,000 estimated living people (First Rank #1, Surname Rank #1)
2. **Michael Smith**: ~36,000 estimated living people (First Rank #4, Surname Rank #1)
3. **Robert Smith**: ~36,000 estimated living people (First Rank #3, Surname Rank #1)
4. **David Smith**: ~31,000 estimated living people (First Rank #6, Surname Rank #1)
5. **James Johnson**: ~31,000 estimated living people (First Rank #1, Surname Rank #2)
6. **Mary Smith**: ~27,000 estimated living people (First Rank #2, Surname Rank #1)
7. **John Smith**: ~26,000 estimated living people (First Rank #5, Surname Rank #1)
8. **William Smith**: ~24,000 estimated living people (First Rank #7, Surname Rank #1)

---

## 3. Exclusion Reasons & Gate Analysis
- **Uncontrolled Cartesian Explosion (`28,450` excluded)**: Low-demand or uncommon combinations withheld from static build to ensure optimal Core Web Vitals, shallow crawl depths, and focused search authority.
- **Malformed Slugs / Missing Entities (`0` errors)**: 100% of generated candidates mapped cleanly to canonical first-name and surname records without orphan entities or slug collisions.
