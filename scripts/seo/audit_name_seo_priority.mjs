import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const reportsDir = path.join(root, "reports/generated");

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

import {
  ingestGscRecords,
  evaluateNameSeoProfile,
  normalizeGscUrl,
  classifyQueryIntent,
} from "../../src/lib/seo/performanceData.ts";

const canonicalFile = path.join(root, "src/data/generated/canonical-names.json");
const allNames = JSON.parse(fs.readFileSync(canonicalFile, "utf8"));

// 2. Load GSC snapshot
const snapshotPath = path.join(root, "data/seo/snapshots/2026_08_14_snapshot.json");
let gscSnapshot = { metadata: { snapshotDate: "2026-08-14" }, queries: [] };
if (fs.existsSync(snapshotPath)) {
  gscSnapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
}

// 3. Load inlinks data if available
const inlinksReportPath = path.join(reportsDir, "INTERNAL_LINKING_AUDIT.json");
let inlinkCounts = new Map();
if (fs.existsSync(inlinksReportPath)) {
  // We can calculate exact inlinks from dist HTML files
}

const distDir = path.join(root, "dist");
if (fs.existsSync(distDir)) {
  function getAllHtml(d, list = []) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) getAllHtml(p, list);
      else if (f.endsWith(".html")) list.push(p);
    }
    return list;
  }
  const files = getAllHtml(distDir);
  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    const matches = [...html.matchAll(/<a\s+[^>]*href="([^"#?]+)"/gis)];
    for (const m of matches) {
      const href = m[1];
      if (href.startsWith("/name/")) {
        inlinkCounts.set(href, (inlinkCounts.get(href) || 0) + 1);
      }
    }
  }
}

// 4. Ingest and map GSC performance
const gscMap = ingestGscRecords(gscSnapshot.queries || [], {
  start: "2026-07-17",
  end: "2026-08-14",
});

// 5. Evaluate all canonical name entities
const profiles = [];

const demandCohortCounts = { PROVEN: 0, PROMISING: 0, LOW_OBSERVED: 0, UNKNOWN: 0 };
const priorityCohortCounts = {
  P0_PROVEN: 0,
  P1_STRIKING_DISTANCE: 0,
  P1_HIGH_DEMAND_LOW_CTR: 0,
  P1_AUTHORITY_OPPORTUNITY: 0,
  P2_VALID_LOW_OBSERVED: 0,
  P2_UNKNOWN: 0,
  P3_DATA_WEAK: 0,
};
const intentCounts = {
  HOW_MANY: 0,
  POPULARITY: 0,
  MEANING_ORIGIN: 0,
  HISTORICAL: 0,
  GEOGRAPHIC: 0,
  GENERAL_NAME: 0,
  OTHER: 0,
};

let pagesWithGscData = 0;
let pagesWithoutGscData = 0;

for (const nameRecord of allNames) {
  const nameUrl = `/name/${encodeURIComponent(nameRecord.name)}`;
  const perfRecord = gscMap.get(nameUrl);
  const inlinks = inlinkCounts.get(nameUrl) || 0;

  if (perfRecord) {
    pagesWithGscData++;
  } else {
    pagesWithoutGscData++;
  }

  const profile = evaluateNameSeoProfile(nameRecord, perfRecord, inlinks);
  profiles.push(profile);

  demandCohortCounts[profile.searchDemandTier]++;
  priorityCohortCounts[profile.seoPriority]++;
  if (perfRecord) {
    intentCounts[profile.primaryIntent]++;
  }
}

// Sort profiles: highest priority, then impressions, then name
const priorityOrder = {
  P0_PROVEN: 1,
  P1_STRIKING_DISTANCE: 2,
  P1_HIGH_DEMAND_LOW_CTR: 3,
  P1_AUTHORITY_OPPORTUNITY: 4,
  P2_VALID_LOW_OBSERVED: 5,
  P2_UNKNOWN: 6,
  P3_DATA_WEAK: 7,
};

profiles.sort((a, b) => {
  const pDiff = (priorityOrder[a.seoPriority] || 99) - (priorityOrder[b.seoPriority] || 99);
  if (pDiff !== 0) return pDiff;
  return b.impressions - a.impressions;
});

// 6. Generate CSV Report
const csvRows = [
  "name,url,indexability,quality_status,search_demand,seo_priority,clicks,impressions,ctr,position,query_count,primary_intent,internal_links,reason"
];

for (const p of profiles) {
  const escapedReason = `"${p.reason.replace(/"/g, '""')}"`;
  csvRows.push(
    [
      p.name,
      p.url,
      p.indexability,
      p.qualityStatus,
      p.searchDemandTier,
      p.seoPriority,
      p.clicks,
      p.impressions,
      (p.ctr * 100).toFixed(2) + "%",
      p.averagePosition.toFixed(1),
      p.queryCount,
      p.primaryIntent,
      p.internalInlinks,
      escapedReason,
    ].join(",")
  );
}

fs.writeFileSync(path.join(reportsDir, "NAME_SEO_PRIORITY_REPORT.csv"), csvRows.join("\n"), "utf8");

// 7. Generate JSON Report
fs.writeFileSync(
  path.join(reportsDir, "NAME_SEO_PRIORITY_REPORT.json"),
  JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      snapshotDate: gscSnapshot.metadata?.snapshotDate || "2026-08-14",
      totalNameEntities: allNames.length,
      coverage: {
        pagesWithGscData,
        pagesWithoutGscData,
        coveragePercentage: ((pagesWithGscData / allNames.length) * 100).toFixed(1) + "%",
      },
      demandCohorts: demandCohortCounts,
      priorityCohorts: priorityCohortCounts,
      intentDistribution: intentCounts,
      profiles,
    },
    null,
    2
  ),
  "utf8"
);

// 8. Generate Markdown Report
const topOpportunities = profiles.filter((p) => p.seoPriority === "P0_PROVEN" || p.seoPriority.startsWith("P1_"));

const reportMd = `# Data-Driven Search Demand & Name SEO Priority Report

## 1. Executive Summary & Coverage

- **Total First-Name Entities Evaluated**: ${allNames.length}
- **Entities with GSC Performance Data**: ${pagesWithGscData} (${((pagesWithGscData / allNames.length) * 100).toFixed(1)}%)
- **Entities Awaiting GSC Impression Capture**: ${pagesWithoutGscData} (${((pagesWithoutGscData / allNames.length) * 100).toFixed(1)}%)
- **Snapshot Date**: ${gscSnapshot.metadata?.snapshotDate || "2026-08-14"} (Period: 28 Days)

---

## 2. Search-Demand Cohort Distribution

| Search Demand Tier | Count | % of Total | Definition |
| :--- | :--- | :--- | :--- |
| **PROVEN** | **${demandCohortCounts.PROVEN}** | ${((demandCohortCounts.PROVEN / allNames.length) * 100).toFixed(1)}% | $\ge 15,000$ impressions and $\ge 500$ clicks in snapshot. |
| **PROMISING** | **${demandCohortCounts.PROMISING}** | ${((demandCohortCounts.PROMISING / allNames.length) * 100).toFixed(1)}% | $\ge 2,000$ impressions or ranking in top 15. |
| **LOW_OBSERVED** | **${demandCohortCounts.LOW_OBSERVED}** | ${((demandCohortCounts.LOW_OBSERVED / allNames.length) * 100).toFixed(1)}% | Visible impressions with lower search volume. |
| **UNKNOWN** | **${demandCohortCounts.UNKNOWN}** | ${((demandCohortCounts.UNKNOWN / allNames.length) * 100).toFixed(1)}% | No GSC performance recorded in current snapshot (not treated as low demand). |

---

## 3. 2-Dimensional SEO Priority Cohorts

| SEO Priority State | Count | Strategic Rationale & Action Plan |
| :--- | :--- | :--- |
| **P0_PROVEN** | **${priorityCohortCounts.P0_PROVEN}** | Powerhouse search entities with established volume and strong click-through. Maintain content depth and monitoring. |
| **P1_STRIKING_DISTANCE** | **${priorityCohortCounts.P1_STRIKING_DISTANCE}** | High impressions ranking in positions #4–#15. Highest ROI for snippet, FAQ, and H1 optimizations. |
| **P1_HIGH_DEMAND_LOW_CTR** | **${priorityCohortCounts.P1_HIGH_DEMAND_LOW_CTR}** | High impressions with below-average CTR. Prime candidates for title tag and meta description testing. |
| **P1_AUTHORITY_OPPORTUNITY** | **${priorityCohortCounts.P1_AUTHORITY_OPPORTUNITY}** | Strong demographic completeness and unique insights, but limited search visibility. Candidates for internal authority flow. |
| **P2_VALID_LOW_OBSERVED** | **${priorityCohortCounts.P2_VALID_LOW_OBSERVED}** | Valid canonical entity with low observed search demand. Standard maintenance tier. |
| **P2_UNKNOWN** | **${priorityCohortCounts.P2_UNKNOWN}** | 100% verified SSA/Census data quality with unobserved GSC data. Retained cleanly as indexable. |
| **P3_DATA_WEAK** | **${priorityCohortCounts.P3_DATA_WEAK}** | Factual data or indexability gating criteria not met. Data quality must be fixed first. |

---

## 4. Top Real Priority Opportunities from GSC Evidence

| Name | SEO Priority | Demand Tier | Impressions | Clicks | CTR | Pos | Primary Intent | Internal Links | Evidence / Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${topOpportunities
  .map(
    (p) =>
      `| [${p.name}](${p.url}) | **${p.seoPriority}** | ${p.searchDemandTier} | ${p.impressions.toLocaleString()} | ${p.clicks.toLocaleString()} | ${(p.ctr * 100).toFixed(1)}% | #${p.averagePosition.toFixed(1)} | \`${p.primaryIntent}\` | ${p.internalInlinks} | ${p.reason} |`
  )
  .join("\n")}

---

## 5. Discovered Query Intent Patterns

1. **\`HOW_MANY\` Intent (Primary)**:
   - Queries: *"how many people are named [Name]"*, *"how many [Name]s are there"*, *"people named [Name]"*.
   - **Page Requirement**: Instant direct answer in Quick Answer card with living population estimate and national rank.
2. **\`POPULARITY\` Intent**:
   - Queries: *"how common is the name [Name]"*, *"[Name] name popularity"*, *"rarity score"*.
   - **Page Requirement**: Percentile rarity badge, decade-by-decade chart, and national standing.
3. **\`MEANING_ORIGIN\` & \`HISTORICAL\` Intent**:
   - Queries: *"[Name] name meaning"*, *"[Name] origin"*, *"[Name] historical trends"*.
   - **Page Requirement**: Verified etymology, linguistic root, and SSA historical data tables from 1880–2024.

---

## 6. Indexability Governance Guarantee

> ⚠️ **Critical Policy**: No mass indexability changes (\`INDEX\` $\leftrightarrow$ \`NOINDEX\`) were made based on GSC metrics. Search performance is strictly a prioritization and discovery layer; indexability is permanently governed by factual data quality, technical validity, and centralized indexability rules.
`;

fs.writeFileSync(path.join(reportsDir, "NAME_SEO_PRIORITY_REPORT.md"), reportMd, "utf8");

console.log("==================================================");
console.log("NAME SEO DEMAND & PRIORITY REPORT");
console.log("==================================================");
console.log(`Total First-Name Entities:        ${allNames.length}`);
console.log(`Pages with GSC Performance:       ${pagesWithGscData}`);
console.log(`Pages without GSC Performance:    ${pagesWithoutGscData}`);
console.log("");
console.log("Search Demand Tiers:");
console.log(`  - PROVEN:                       ${demandCohortCounts.PROVEN}`);
console.log(`  - PROMISING:                    ${demandCohortCounts.PROMISING}`);
console.log(`  - LOW_OBSERVED:                 ${demandCohortCounts.LOW_OBSERVED}`);
console.log(`  - UNKNOWN:                      ${demandCohortCounts.UNKNOWN}`);
console.log("");
console.log("SEO Priority Cohorts:");
console.log(`  - P0_PROVEN:                    ${priorityCohortCounts.P0_PROVEN}`);
console.log(`  - P1_STRIKING_DISTANCE:         ${priorityCohortCounts.P1_STRIKING_DISTANCE}`);
console.log(`  - P1_HIGH_DEMAND_LOW_CTR:       ${priorityCohortCounts.P1_HIGH_DEMAND_LOW_CTR}`);
console.log(`  - P1_AUTHORITY_OPPORTUNITY:     ${priorityCohortCounts.P1_AUTHORITY_OPPORTUNITY}`);
console.log(`  - P2_VALID_LOW_OBSERVED:        ${priorityCohortCounts.P2_VALID_LOW_OBSERVED}`);
console.log(`  - P2_UNKNOWN:                   ${priorityCohortCounts.P2_UNKNOWN}`);
console.log(`  - P3_DATA_WEAK:                 ${priorityCohortCounts.P3_DATA_WEAK}`);
console.log("==================================================");
console.log("✅ Reports generated:");
console.log("  - reports/generated/NAME_SEO_PRIORITY_REPORT.md");
console.log("  - reports/generated/NAME_SEO_PRIORITY_REPORT.json");
console.log("  - reports/generated/NAME_SEO_PRIORITY_REPORT.csv");
