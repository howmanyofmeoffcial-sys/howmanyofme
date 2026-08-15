# SSA 2025 Data Ingestion & Validation Diff Report

**Dataset:** Official U.S. Social Security Administration 2025 Baby Names  
**Source URL:** `https://www.ssa.gov/cgi-bin/popularnames.cgi`  
**Validation Fixture:** `data/fixtures/ssa_2025_numbers_fixture.json`  
**Retrieval / Audit Date:** 2026-08-15  
**Version:** `2025.1.0`  

---

## 📊 Summary Statistics
- **Total Male Ranks Parsed:** 1,000 (Rank #1 Liam, 20,818 births → Rank #1000 Langston, 227 births)
- **Total Female Ranks Parsed:** 1,000 (Rank #1 Olivia, 13,544 births → Rank #1000 Harmoni, 252 births)
- **Total Name Records:** 2,000
- **Total Recorded Top-1000 Births:** 2,569,924
- **Count Mismatches:** 0
- **Rank Mismatches:** 0
- **Duplicate Ranks:** 0

---

## 🎯 Verified Key Benchmarks

### Top 10 Boys
1. **Liam** — #1 (20,818 births)
2. **Noah** — #2 (20,358 births)
3. **Oliver** — #3 (14,939 births)
4. **Theodore** — #4 (13,355 births)
5. **Henry** — #5 (12,020 births)
6. **James** — #6 (11,945 births)
7. **Elijah** — #7 (11,111 births)
8. **Mateo** — #8 (11,045 births)
9. **William** — #9 (10,545 births)
10. **Lucas** — #10 (10,219 births)

### Top 10 Girls
1. **Olivia** — #1 (13,544 births)
2. **Charlotte** — #2 (13,400 births)
3. **Emma** — #3 (12,754 births)
4. **Amelia** — #4 (12,699 births)
5. **Sophia** — #5 (12,561 births)
6. **Mia** — #6 (11,078 births)
7. **Isabella** — #7 (10,666 births)
8. **Evelyn** — #8 (9,123 births)
9. **Sofia** — #9 (8,252 births)
10. **Eliana** — #10 (8,191 births)

### Mid & Long-Tail Verification Anchors
- **Luca:** Male Rank #14 (8,759 births)
- **Ezra:** Male Rank #20 (8,126 births)
- **Freya:** Female Rank #176 (1,746 births)
- **Muhammad:** Male Rank #239 (1,473 births)
- **Aisha:** Female Rank #337 (910 births)
- **Kabir:** Male Rank #999 (227 births)
- **Langston:** Male Rank #1000 (227 births)
- **Harmoni:** Female Rank #1000 (252 births)

---

## 🛡️ Data Governance & Integrity Rules
1. **Official SSA Production Truth:** Data is derived deterministically from the official SSA online registry.
2. **Zero Living Population Confusion:** All numbers strictly represent annual registered births in calendar year 2025.
3. **Out-of-Top-1000 Handling:** Names outside the top 1000 (e.g. *Rahul*) are labeled as "Not ranked in 2025 published Top 1000", maintaining access through Census and historical datasets.
