# Phase 12 Data Report — Full-Name & Surname Foundation
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Dataset Dimensions

- **First-Name Entities (SSA & Census 2020)**: `583` canonical first names
- **Last-Name Entities (Census Surnames)**: `50` official U.S. Census Bureau surnames
- **Possible Combinations**: `29,150`
- **Candidate Combinations**: `700`
- **Validated Combinations**: `700`
- **Indexable Published Combinations**: `700`
- **Excluded Combinations**: `28,450`
- **Exclusion Reasons**: Controlled candidate batching to prevent programmatic index bloat (`28,450`).

---

## 2. Methodology & Mathematical Foundation

$$\text{Estimated Bearers} = \left(\frac{\text{FirstLiving}}{\text{USPopulation}}\right) \times \left(\frac{\text{SurnameCount}}{\text{CensusBase}}\right) \times \text{USPopulation} = \frac{\text{FirstLiving} \times \text{SurnameCount}}{\text{CensusBase}}$$

- **Independence Assumption**: Disclosed on every full-name page; clearly labeled as a statistical demographic model rather than an individual census roll-call.
- **Deterministic Rounding**: Modeled outputs rounded based on numerical scale ($<10 \to$ integer, $10\text{--}999 \to$ nearest 5/10, $1,000+ \to$ nearest 50/100) to eliminate false precision.

---

## 3. Dataset Versions

- **Social Security Administration**: `1880–2024` (Coverage: 1880–2024)
- **Census First Names**: `2020 Decennial Census`
- **Census Surnames**: `2010/2020 Decennial Census Tabulations`
- **Methodology Version**: `1.0.0`
- **Data Pipeline Version**: `2026.08.14`
