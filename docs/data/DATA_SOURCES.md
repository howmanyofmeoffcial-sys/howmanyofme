# Data Sources & Provenance

All demographic statistics on HowManyOfMe.co are derived exclusively from verified, authoritative U.S. government vital statistics and Census bureau releases.

---

## 1. Authoritative Government Sources

### A. U.S. Social Security Administration (SSA)
- **Dataset**: Baby Names from Social Security Card Applications (1880–2024).
- **Scope**: 145 annual birth cohorts across male and female newborn registrations in the United States.
- **Coverage**: All names with 5 or more occurrences in a given year.
- **Official URL**: [https://www.ssa.gov/oact/babynames/](https://www.ssa.gov/oact/babynames/)

### B. U.S. Census Bureau
- **Dataset**: Frequently Occurring Surnames & 2020 Decennial Census First Names.
- **Scope**: 2020 Decennial Census complete frequency tabulations.
- **Official URL**: [https://www.census.gov/topics/population/genealogy/data.html](https://www.census.gov/topics/population/genealogy/data.html)

### C. National Center for Health Statistics (CDC)
- **Dataset**: United States Life Tables & Actuarial Cohort Survival Models.
- **Purpose**: Age-specific survival probability curves used to calculate living population estimates from historical birth records.
- **Official URL**: [https://www.cdc.gov/nchs/life-tables.htm](https://www.cdc.gov/nchs/life-tables.htm)

---

## 2. Machine-Readable Metadata Manifest
Source manifests, timestamps, and schema checksums are stored at:
- `src/data/metadata/sources.json`
- `src/data/metadata/manifest.json`
