# Canonical Internal Link Map & Information Architecture

**Project:** HowManyOfMe.co  
**Version:** 1.0.0  
**Updated:** August 15, 2026  

---

## 1. Topical Clusters & Architecture

```text
HOWMANYOFME.CO TOPICAL MAP
├── 1. NAME DEMOGRAPHICS & LIVING POPULATION (Core Hub: /)
│   ├── First Name Profiles: /name/[name] (583 canonical names)
│   ├── Last Name Profiles: /last-name/[surname] (50 canonical surnames)
│   ├── Full Name Profiles: /people/[fullName] (700 canonical full names)
│   └── A–Z Alphabetic Directories: /names/[letter] (26 hubs)
│
├── 2. INTERACTIVE DEMOGRAPHIC & NAMING TOOLS (Core Hub: /tools)
│   ├── Popularity Checker: /tools/popularity-checker
│   ├── Name Comparison: /tools/name-comparison
│   │   └── Precomputed Matchups: /name-comparison/[pair] (20 canonical pairs)
│   ├── Trend Visualizer: /tools/trend-visualizer
│   ├── Name Meaning & Origin: /tools/meaning
│   ├── Similar Names Finder: /similar-names
│   │   └── Name-Specific Soundalikes: /similar-names/[name] (583 canonical hubs)
│   ├── Baby Names Hub: /tools/baby-names
│   ├── Unique Name Generator: /tools/unique-name-generator
│   ├── Random Name Generator: /tools/random-name
│   ├── Username Generator: /tools/username-generator
│   └── Popularity Guide: /tools/popularity-guide
│
├── 3. DEMOGRAPHIC RESEARCH & OPEN DATA (Core Hub: /data)
│   ├── Open Data Downloads: /data
│   ├── 145-Year Decade Research Report: /research/name-popularity-by-decade
│   ├── Mathematical Methodology: /methodology
│   └── Research Articles & Analyses: /blog (31 articles)
│
└── 4. TRUST, GOVERNANCE & SITE UTILITIES
    ├── About Us: /about
    ├── Contact: /contact
    ├── Privacy Policy: /privacy
    ├── Terms of Service: /terms
    └── Disclaimer: /disclaimer
```

---

## 2. Hub-and-Spoke Inbound & Outbound Mappings

### Hub: Name Demographic Profiles (`/name/[name]`)
* **Inbound From:** Homepage (`/`), A–Z Directory (`/names/[letter]`), Similar Names (`/similar-names/[name]`), Head-to-Head Comparisons (`/name-comparison/[pair]`), Full Name Profiles (`/people/[fullName]`), Search Island.
* **Outbound To:**
  - Similar Names variant hub (`/similar-names/[name]`)
  - Head-to-Head Comparison matchups (`/name-comparison/[pair]`)
  - Full-Name combinations (`/people/[fullName]`)
  - Related names by linguistic origin (`/name/[Related]`)
  - Core research tools (`/tools/popularity-checker`, `/tools/trend-visualizer`)

### Hub: Surname Demographic Profiles (`/last-name/[surname]`)
* **Inbound From:** Last Names Hub (`/last-names`), Homepage Footer, Full Name Profiles (`/people/[fullName]`).
* **Outbound To:**
  - Full-Name combinations with this surname (`/people/[First]-[Surname]`)
  - Related common surnames (`/last-name/[Related]`)
  - General demographic tool CTA (`/`)

### Hub: Head-to-Head Comparisons (`/tools/name-comparison`)
* **Inbound From:** Homepage, Tools Hub (`/tools`), Footer, First Name Profiles.
* **Outbound To:**
  - All 20 canonical matchup pages (`/name-comparison/[pair]`)
  - Related demographic research tools (`/tools/popularity-checker`, `/tools/trend-visualizer`)
  - Individual profile pages (`/name/[nameA]`, `/name/[nameB]`)

### Hub: Similar Names Finder (`/similar-names`)
* **Inbound From:** Homepage, Tools Hub (`/tools`), First Name Profiles, Footer.
* **Outbound To:**
  - 583 name-specific similar name pages (`/similar-names/[name]`)
  - Name profiles (`/name/[name]`)
  - Name Meaning tool (`/tools/meaning`)
  - Popularity Checker (`/tools/popularity-checker`)

### Hub: Open Data Portal (`/data`)
* **Inbound From:** Homepage, Header, Footer, Methodology (`/methodology`).
* **Outbound To:**
  - 145-Year Decade Research Report (`/research/name-popularity-by-decade`)
  - Direct dataset downloads (JSON / CSV)
  - Social Security Administration & Census official documentation
