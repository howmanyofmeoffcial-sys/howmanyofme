# Phase 17 — Expansion Candidates & Gate Evaluation Table
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Expansion Candidate Gate Table

| Candidate | Data Ready | Search Demand | Distinct Intent | Competition | Potential Pages | Revenue Potential | Risk | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Surname Entity Pages (`/last-name/*`)** | **YES** (Decennial Census) | **HIGH** (35k/mo GSC intent) | **YES** (Surname frequency) | Medium | 100 (Pilot) | **HIGH** (Genealogy & display) | Low | **APPROVED FOR PILOT (TOP 1)** |
| **Name Comparisons (`/name-comparison/*-vs-*`)** | **YES** (SSA 1880–2024) | **HIGH** (18k/mo GSC intent) | **YES** (Head-to-head comparison) | Low | 25 (Pilot) | **HIGH** (High tool engagement) | Low | **APPROVED FOR PILOT (TOP 2)** |
| **Name-by-State Pages (`/name/*/*`)** | Partial | Medium (8k/mo) | Yes | High | 2,500+ | Medium | Medium (Thin content risk) | ⏸️ **HOLD** |
| **Name-by-Decade Pages (`/name/*/*s`)** | Yes | Low (2k/mo) | No | Low | 5,000+ | Low | High (Keyword cannibalization) | ❌ **REJECTED** |
| **International Expansion (`/country/*`)** | No | High | Yes | High | 50,000+ | High | Very High (Zero official source data) | ❌ **REJECTED** |

---

## 2. Selection Rationale for Top 2 Pilots
1. **Surname Entity Pages (`/last-name/[surname]`)**:
   - Ingests verified U.S. Census Bureau Decennial Surname returns.
   - Provides exact national rank, total U.S. count, frequency per 100k, and demographic context.
   - Connects directly to `/people/[first]-[surname]` and `/name/[first]`.
2. **Head-to-Head Name Comparisons (`/name-comparison/[nameA]-vs-[nameB]`)**:
   - Solves the common parental/demographic query "Name A vs Name B".
   - Compares total births, peak years, all-time ranks, and actuarial living populations in a side-by-side comparison table.
