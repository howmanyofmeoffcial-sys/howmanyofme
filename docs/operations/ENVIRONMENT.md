# Environment & Deployment Configuration

## 1. Runtime Environment
HowManyOfMe.co builds as a pure static site (SSG) requiring standard Node.js $\ge 18$ / $\ge 20$.

---

## 2. Configuration Files
- `astro.config.mjs`: Astro build settings (`output: 'static'`, React integration, Tailwind CSS).
- `vercel.json`: Clean URL routing, security headers (HSTS, Content-Security-Policy), and cache-control headers.
- `tsconfig.json`: Strict TypeScript compiler options.
- `package.json`: NPM scripts and verified dependency manifests.

---

## 3. Environment Variables
- `SITE`: Canonical origin (`https://howmanyofme.co`).
- `PUBLIC_GA_ID`: (Optional) Google Analytics Measurement ID for privacy-compliant telemetry.
- `PUBLIC_ADSENSE_CLIENT`: (Optional) Google AdSense publisher ID.
