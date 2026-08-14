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
