# Monetization Framework & Revenue Architecture

## 1. Revenue Baseline & Unit Economics

HowManyOfMe.co monetizes organic search traffic through non-intrusive, zero-CLS advertising and affiliate partnerships without compromising user experience or Core Web Vitals.

| Metric | Baseline Target | Production Standard |
| :--- | :--- | :--- |
| **Monthly Sessions** | `100,000+` | Tracked |
| **Page RPM** | `$13.80` | Sustainable display baseline |
| **Session RPM** | `$19.32` | $\sim 1.4$ pageviews per session |
| **Revenue / Visitor** | `$0.0193` | High programmatic efficiency |

---

## 2. Zero-CLS Ad Unit Specifications

All ad slots use `src/components/AdSlot.astro` with strict container sizing:

1. **Leaderboard (`top-leaderboard`, `bottom-leaderboard`)**:
   - Minimum dimensions: `728x90` (Desktop), `320x50` (Mobile).
   - Class constraints: `min-h-[90px] contain-layout`.
2. **Rectangle (`mid-content-rectangle`, `sidebar-rectangle`)**:
   - Minimum dimensions: `300x250` / `336x280`.
   - Class constraints: `min-h-[250px] contain-layout`.

---

## 3. Placement Guardrails
- Maximum 3 display ad units per page.
- Zero interstitial or pop-up ad units.
- Ad slots must never push the primary demographic answer below the initial viewport fold.
