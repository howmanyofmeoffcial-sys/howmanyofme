# Third-Party Script Audit — Phase 6
## HowManyOfMe.co Monetization & Tag Performance Analysis

Date: August 14, 2026

---

## 1. Third-Party Script Inventory

| Provider / Script | Purpose | Loading Strategy | Critical to Render? | CLS Risk Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| **Google Fonts (Inter, Playfair Display)** | Typography | `rel="preload"` + `media="print" onload="this.media='all'"` with `display=swap` | No (Non-blocking) | System fallback metrics specified |
| **Google Tag Manager / GA4** (`G-Q1NTDXVHWE`) | Analytics & Search measurement | `requestIdleCallback` (3.5–4.0s delay or first user interaction) | No (Completely deferred) | Zero layout impact |
| **Mediavine / Grow Ads** (`faves.grow.me`) | Site Monetization & Reader Engagement | `defer` attribute | No | Non-blocking execution |
| **ScriptWrapper / Ad Partner** (`scripts.scriptwrapper.com`) | Header bidding & Display advertising | `async` with `data-cfasync="false"` | No | Pre-reserved min-height slots |

---

## 2. AdSlot CLS Prevention Strategy

To prevent advertising creative payloads from causing Cumulative Layout Shift (CLS) when loaded dynamically:
1. **Geometric Containment**: `.ad-slot` elements specify `min-height: 250px` and `contain: layout style`.
2. **Above-the-Fold Priority**: Advertisements are strictly placed beneath the primary Answer-First block and hero headings so the LCP element is never displaced by third-party ad injection.
