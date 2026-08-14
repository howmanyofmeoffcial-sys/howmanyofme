# Data Platform Architecture

## 1. High-Level Data Ingestion Pipeline

The HowManyOfMe data platform operates on an immutable, deterministic 4-stage pipeline:

```text
1. RAW (data/raw/ or src/data/raw/)
   ├── SSA Birth Files (1880–2024, 145 annual cohorts)
   └── U.S. Census 2020 First & Surname Frequency Tables
        ↓
2. NORMALIZED (src/data/normalized/)
   ├── ssa_normalized.json (Annual counts, sex splits, peak years)
   └── census_normalized.json (Census ranks, proportions per 100k)
        ↓
3. DERIVED (src/data/derived/)
   └── names_derived.json (Actuarial survival models, age distributions, state splits)
        ↓
4. APPLICATION DATA (src/data/generated/)
   ├── canonical-names.json (First-name entities)
   ├── canonical-surnames.json (Surname entities)
   └── canonical-fullnames.json (Full-name combinations)
```

---

## 2. Entity Models & Relationships

- **First-Name Entity (`canonical-names.json`)**: Contains total historical birth registrations, actuarial living population estimates, national ranks, sex ratios, state geographical distributions, and peak years.
- **Surname Entity (`canonical-surnames.json`)**: Contains Decennial Census counts, national rankings, proportion per 100,000 residents, and etymological origins.
- **Full-Name Entity (`canonical-fullnames.json`)**: Computed joint statistical combinations modeling living individuals with exact given name and surname pairs.

---

## 3. Data Integrity & Verification
Every release executes `npm run data:validate` and `npm run data:report` to enforce:
- Zero NaN or undefined values.
- Sum of sex distributions equal to 100%.
- Positive integer living population estimates.
- Strict cross-referencing between source tables and output JSON files.
