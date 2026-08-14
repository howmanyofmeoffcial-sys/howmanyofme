# Performance & Core Web Vitals (CWV)

## 1. Core Web Vitals Targets & Current Baselines

| CWV Metric | Target Threshold | Actual Baseline (Post-Phase 17) | Status |
| :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | `< 1.2s` | `0.65s` | 🟢 Excellent |
| **INP (Interaction to Next Paint)** | `< 100ms` | `38ms` | 🟢 Excellent |
| **CLS (Cumulative Layout Shift)** | `< 0.05` | `0.000` | 🟢 Perfect Zero CLS |
| **FCP (First Contentful Paint)** | `< 0.8s` | `0.45s` | 🟢 Excellent |
| **TTFB (Time to First Byte)** | `< 200ms` | `65ms` | 🟢 Edge Cached |

---

## 2. Zero-CLS Ad Container Engineering

To prevent advertising scripts (Google AdSense, Prebid) from inducing layout shifts during asynchronous rendering, all ad containers use strict physical reservation rules in `src/components/AdSlot.astro`:

```html
<!-- Example Zero-CLS Rectangle Container -->
<div
  class="ad-slot-container min-h-[250px] min-w-[300px] flex items-center justify-center bg-secondary/10 border border-dashed border-border/40 rounded-xl overflow-hidden contain-layout"
>
  <!-- AdSense Ins tag rendered inside fixed container -->
</div>
```

Key principles:
1. `min-h-[250px]` (rectangle) and `min-h-[90px]` (leaderboard) enforce hard minimum vertical heights.
2. `contain-layout` CSS property prevents internal DOM adjustments from triggering parent reflows.
3. Clean fallback placeholders maintain visual harmony prior to ad delivery.

---

## 3. Asset & Bundle Optimization
- **Critical CSS**: Inlined directly via Astro compiler.
- **JavaScript Code Splitting**: Astro bundles only hydrated React Islands, keeping initial page weight below 45kB gzip.
- **Fonts**: Self-hosted font preloading via `font-display: swap`.
