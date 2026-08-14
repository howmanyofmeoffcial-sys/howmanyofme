# Phase 13 — Query Gap & Intent Coverage Matrix
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Intent Coverage Evaluation

| Search Intent / Query Type | Supported by Current Data? | Supported on Canonical Page? | Satisfies User Intent? | Recommended Improvement | New URL Needed? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Living Name Count** (`how many people are named X`) | ✅ Yes (Actuarial Model) | ✅ `/name/[name]` | ✅ Yes (Quick Answer) | Maintain & feature in meta description | ❌ No (Keep canonical) |
| **Historical Birth Frequency** (`how many X born in 1950`) | ✅ Yes (SSA 1880–2024) | ✅ `/name/[name]` | ✅ Yes (Timeline & Table) | Elevate milestone table visibility | ❌ No |
| **Name Rarity & Rank** (`is X a rare name`) | ✅ Yes (Rank & Rarity tier) | ✅ `/name/[name]` | ✅ Yes (Key Stats) | Add explicit 1-in-N ratio badge | ❌ No |
| **Full-Name Frequency** (`how many David Smiths`) | ✅ Yes (Census Surnames + SSA) | ✅ `/people/[fullName]` | ✅ Yes (Quick Answer) | Expand candidate cohorts in Phase 14 | ❌ No |
| **State Distribution** (`where is the name X most common`) | ✅ Yes (State Allocations) | ✅ `/name/[name]` | ✅ Yes (State Table) | Add state map visualization island | ❌ No |
| **Name Age & Generation** (`what is the average age of someone named X`) | ✅ Yes (Actuarial Average Age) | ✅ `/name/[name]` | ✅ Yes (Average Age Card) | Add generation badge (e.g. Boomer/Gen Z) | ❌ No |
| **Browse by Letter** (`names starting with J`) | ✅ Yes (A-Z Taxonomy) | ✅ `/names/[letter]` | ✅ Yes (Letter Hub) | Add sort by popularity / alphabetical | ❌ No |
| **Methodology** (`how is name frequency calculated`) | ✅ Yes (Sources & Formulas) | ✅ `/methodology` | ✅ Yes (Pillar page) | Add interactive formula sandbox | ❌ No |

---

## 2. Cannibalization & Doorway Policy

- **Zero Keyword Doorways**: We strictly forbid creating redundant URL variations like `/name/david-popularity` or `/name/david-frequency`.
- **Single Canonical Entity**: One canonical `/name/[name]` page captures all related first-name intent variants. One canonical `/people/[first]-[last]` captures all full-name intent variants.
