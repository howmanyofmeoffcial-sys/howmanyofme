# Phase 12 — U.S. Census Surnames Source Audit & Provenance
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Source Identification

| Property | Official Specification |
| :--- | :--- |
| **Provider** | U.S. Census Bureau (Population Division) |
| **Dataset Name** | Frequently Occurring Surnames from the Decennial Census |
| **Dataset Version** | 2010 / 2020 Decennial Census Surnames Tabulation |
| **Coverage** | All surnames occurring 100 or more times in Decennial Census returns (covering ~90% of the U.S. population) |
| **Key Fields** | `name` (Surname), `rank` (National rank), `count` (Total occurrences), `prop100k` (Proportion per 100k people), `cum_prop100k` |
| **License / Terms** | Public Domain (U.S. Government Work, 17 U.S.C. 105) |
| **Official URL** | https://www.census.gov/topics/population/genealogy/data/2010_surnames.html |
| **Local Snapshot** | `src/data/raw/census/surnames_2010_2020.json` |
| **Limitations** | Surnames occurring fewer than 100 times are suppressed by the Census Bureau to protect individual confidentiality. Surnames reflect Decennial Census responses, not Social Security birth applications. |

---

## 2. Statistical Independence Policy

First-name data (SSA 1880–2024 / Census 2020 first names) and surname data (Census Decennial Surnames) are independent statistical collections.
- **Model Definition**: $P(\text{First Name} \cap \text{Surname}) \approx P(\text{First Name}) \times P(\text{Surname})$
- **Estimated Full-Name Frequency**: $\text{Estimate} = \left(\frac{\text{FirstNameLiving}}{\text{USPopulation}}\right) \times \left(\frac{\text{SurnameCount}}{\text{CensusPopulation}}\right) \times \text{USPopulation}$
- **Mandatory Disclosure**: The full-name frequency is explicitly labeled as a **statistical demographic model** based on the joint independence assumption, not an individual census enumeration.
