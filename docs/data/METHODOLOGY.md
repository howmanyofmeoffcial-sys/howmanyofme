# Demographic Estimation Methodology

## 1. Overview
Determining how many living people currently share a given name or full name requires combining continuous historical birth registrations with actuarial mortality curves and joint probability distributions.

---

## 2. Statistical Models

### A. Living Population Estimation (Actuarial Survival Curves)
Total living people with first name $N$ is estimated by applying cohort survival probabilities $S(t)$ to historical birth registrations $B(N, t)$ across all years $t \in [1880, 2024]$:

$$\text{Estimated Living}(N) = \sum_{t=1880}^{2024} B(N, t) \times S(2026 - t)$$

Where:
- $B(N, t)$ is the recorded newborn count for name $N$ in birth year $t$ from SSA card applications.
- $S(a)$ is the CDC/SSA Actuarial Life Table survival probability for an individual of exact age $a$.

### B. Full-Name Demographic Estimation
To estimate the living population with both first name $F$ and last name $L$:

$$\text{Estimated People}(F, L) = \frac{\text{Living}(F) \times \text{Census Count}(L)}{\text{Total U.S. Population}}$$

Where:
- $\text{Living}(F)$ is the actuarial living estimate for given name $F$.
- $\text{Census Count}(L)$ is the Decennial Census count for surname $L$.
- $\text{Total U.S. Population} \approx 334,914,895$ (official baseline).

---

## 3. Disclaimers & Model Bounds
- **Immigration & Emigration**: SSA records capture all individuals issued a Social Security card, including naturalized citizens.
- **Privacy Thresholds**: SSA data suppresses names with fewer than 5 occurrences in a single year to preserve individual confidentiality.
- **Rounding Policy**: Demographic estimates are rounded to nearest whole person or significant digit to reflect statistical modeling uncertainty.

---

## 4. Name Estimation Engine & Result Modes (Phase A)

The search resolver (`resolveNameSearch`) categorizes every query into explicit confidence and data modes:

### A. Result Modes
1. **Verified (`mode: "verified"`)**:
   - **Condition**: Direct match in official indexed dataset (`canonical-names.json` or `canonical-fullnames.json`).
   - **Label**: `"Source-backed profile"`.
   - **Confidence**: High.
   - **Profile URL**: Links to canonical static route (e.g. `/name/David`, `/people/david-smith`).
2. **Modelled (`mode: "modelled"`)**:
   - **Condition**: Valid name or combination without an indexed canonical record.
   - **Label**: `"Statistical estimate"`.
   - **Confidence**: Moderate / Low.
   - **Profile URL**: `null` (Strictly prevents creating unvetted or thin programmatic SEO URLs).
   - **Safety Guarantee**: Zero fabricated rank, zero fake origins, zero fake meanings, zero fake decade popularity curves.
3. **Insufficient (`mode: "insufficient"`)**:
   - **Condition**: Unlisted or rare input with inadequate demographic signals for estimation.
   - **Label**: `"Limited data"`.
4. **Invalid (`mode: "invalid"`)**:
   - **Condition**: Numbers-only, URLs, repetitive spam, or malformed input strings.
   - **Label**: `"Invalid input"`.

### B. Supported Name Diversity
- Full Unicode support across international characters (e.g., *José*, *María*, *Zoë*, *Søren*, *Wei*, *Yuki*, *Min-jun*).
- Hyphenated names (e.g., *Anne-Marie*) and apostrophes (e.g., *O'Connor*) are preserved and correctly normalized.
