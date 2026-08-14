# HowManyOfMe.co

Official, evidence-backed demographic platform estimating name frequencies, living populations, and vital statistics in the United States.

---

## ⚡ Tech Stack
- **Core Framework**: [Astro](https://astro.build/) (Static Site Generation / SSG)
- **UI Islands**: [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **Data Engine**: Official U.S. Social Security Administration (1880–2024) + U.S. Decennial Census (2020)
- **Quality & Monitoring**: Vitest, TypeScript, Automated Node.js Health Engines

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Local Development
```bash
npm run dev
```
Starts the local dev server at `http://localhost:4321`.

### 3. Production Build
```bash
npm run build
```
Generates 2,590+ pre-rendered static HTML pages in `dist/`.

### 4. Run Test Suite
```bash
npm test
```

### 5. Run Health & SEO Checks
```bash
npm run health:check
```

---

## 📁 Repository Structure

```text
/
├── AGENTS.md                   # AI Agent operating manual & rules
├── README.md                   # Project overview & developer guide
├── package.json                # NPM scripts and dependencies
├── astro.config.mjs            # Astro SSG configuration
├── vercel.json                 # Deployment headers & routing
├── src/
│   ├── pages/                  # Static file-based routes
│   ├── components/             # Reusable Astro components
│   ├── islands/                # Interactive React Islands
│   ├── lib/                    # Domain logic & data resolvers
│   └── data/                   # Generated demographic datasets
├── scripts/                    # Ingestion, validation & audit scripts
├── docs/                       # Canonical documentation hub
└── reports/                    # Generated automated check reports
```

---

## 📚 Documentation
Comprehensive documentation is available in the [`docs/`](./docs/README.md) directory:
- [Long-Term Operating System](./docs/OPERATING_SYSTEM.md) — Master operating manual & workflows.
- [System Architecture](./docs/architecture/ARCHITECTURE.md) — SSG & React Islands architecture.
- [Data Platform & Pipeline](./docs/data/DATA_PLATFORM.md) — Ingestion pipeline & math methodology.
- [SEO Operating System](./docs/seo/SEO_OPERATING_SYSTEM.md) — GSC clusters & query management.
- [Site Health Runbook](./docs/operations/SITE_HEALTH_RUNBOOK.md) — Operational triage & troubleshooting.
- [Monetization & Zero-CLS Specs](./docs/monetization/MONETIZATION.md) — AdSlot container engineering.
- [Historical Phase Archives](./docs/archive/README.md) — Historical reports (Phases 1–17).
