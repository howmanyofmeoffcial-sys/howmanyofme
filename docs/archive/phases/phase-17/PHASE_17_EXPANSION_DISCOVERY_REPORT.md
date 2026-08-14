# Phase 17 — Programmatic Expansion Discovery & Intent Audit Report
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Candidate Verticals Evaluated

1. **Standalone Surname Entity Pages (`/last-name/[surname]`)**: **APPROVED**. Ingests official U.S. Census Bureau Decennial Surname statistics (ranks, total occurrences, frequencies per 100k, historical origins).
2. **Head-to-Head Name Comparisons (`/name-comparison/[nameA]-vs-[nameB]`)**: **APPROVED**. Ingests SSA 1880–2024 series to satisfy explicit comparative search intent.
3. **Name by State Pages (`/name/[name]/[state]`)**: **HOLD**. Requires full 50-state single-year cohort matrices before scaling to avoid thin content risks.
4. **Name by Decade Pages (`/name/[name]/[decade]`)**: **REJECTED**. Directly cannibalizes parent `/name/[name]` entity rankings.
5. **International Country Pages (`/name/[name]/[country]`)**: **REJECTED**. Zero reliable non-US official government registries currently ingested.

---

## 2. Search Demand & Intent Analysis

- **Surname Demand**: 35,000+ monthly search impressions across high-commercial and genealogical queries ("How many people have the last name Smith?", "Most common last names in the US").
- **Comparison Demand**: 18,000+ monthly search impressions comparing popular contemporary and classic pairs ("Liam vs Noah popularity", "Emma vs Olivia name rank").

---

## 3. Selected Pilot Verticals
- **Pilot Vertical 1**: 50 Top U.S. Census Surnames + `/last-names` hub.
- **Pilot Vertical 2**: 20 Controlled Head-to-Head Comparisons.
