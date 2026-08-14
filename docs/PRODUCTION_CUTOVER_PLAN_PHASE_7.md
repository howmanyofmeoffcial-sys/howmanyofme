# Production Cutover & Rollback Plan — Phase 7
## HowManyOfMe.co Deployment Safety Protocols

---

## 1. Cutover Sequence Overview

```text
       Step 1: Local & Build Validation
       ├── npm test (5/5 unit & E2E tests pass)
       ├── npx astro check (0 errors across 131 files)
       ├── npm run build:astro (610 static pages built in ~6s)
       └── node scripts/validate-url-parity.mjs (610/610 routes match)
                     │
                     ▼
       Step 2: Preview Deployment & Staging QA
       ├── Deploy Astro build to Vercel Preview URL
       ├── Automated status-code & soft-404 verification
       └── Verify GTM / GA4 events & ad slot stability
                     │
                     ▼
       Step 3: Controlled Production Switch
       ├── Update Vercel project build settings:
       │   Build Command: "astro build"
       │   Output Directory: "dist"
       └── Trigger production deployment
                     │
                     ▼
       Step 4: Post-Deployment Smoke Test
       ├── Live 200 checks on /, /name/James, /names/a, /robots.txt, /sitemap.xml
       └── GSC sitemap re-validation
```

---

## 2. Rollback Protocol

If critical issues arise during production cutover (e.g. unexpected 5xx responses or ad serving failures), restore the previous Vite deployment immediately:

1. **Instant Vercel Instant Rollback**: In the Vercel Dashboard, click **Promote to Production** on the previous stable Vite deployment.
2. **Local Rollback Command**:
   - Revert build command to: `vite build && node scripts/generate-sitemap.mjs && node scripts/prerender-top-names.mjs`
   - Output directory: `dist`
   - Trigger build.
3. **Rollback Verification**: Verify homepage and name search load successfully.
