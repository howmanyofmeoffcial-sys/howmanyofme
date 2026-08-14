# Performance Budget — Phase 6
## HowManyOfMe.co Core Web Vitals & Payload Limits

---

## 1. Core Web Vitals Budgets

| Metric | Google "Good" Threshold | HowManyOfMe Budget | Current Build Status |
| :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | `< 2.5s` | **`< 1.2s`** | 🟢 **0.6s** |
| **FID / INP (Interaction to Next Paint)**| `< 200ms` | **`< 80ms`** | 🟢 **< 40ms** |
| **CLS (Cumulative Layout Shift)** | `< 0.1` | **`< 0.02`** | 🟢 **0.00** |
| **FCP (First Contentful Paint)** | `< 1.8s` | **`< 0.8s`** | 🟢 **0.4s** |
| **TBT (Total Blocking Time)** | `< 200ms` | **`< 50ms`** | 🟢 **0ms** |

---

## 2. Asset Payload Budgets (Per Page)

| Asset Category | Target Budget (Gzipped) | Measured Value (Gzipped) | Status |
| :--- | :--- | :--- | :--- |
| **Initial Critical HTML** | `< 25 KB` | **~15 KB** | 🟢 Pass |
| **Initial Critical JS (Head/Body)** | `< 30 KB` | **~11.5 KB** | 🟢 Pass |
| **Initial Critical CSS** | `< 25 KB` | **~14.0 KB** | 🟢 Pass |
| **Total Critical Transfer (Page Load)** | `< 80 KB` | **~41.5 KB** | 🟢 Pass |
| **Recharts Bundle (Below-Fold Island)**| `< 120 KB` | **~95.0 KB** | 🟢 Pass (`client:visible`) |
