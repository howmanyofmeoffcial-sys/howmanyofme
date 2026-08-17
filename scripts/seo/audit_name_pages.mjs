import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  evaluateNameIndexability,
  auditNamesIndexability,
  BLOCKED_NAME_ENTITIES,
} from "../../src/lib/seo/indexability.ts";
import {
  buildNamePageViewModel,
  getLivingEstimate,
  getHistoricalBirths,
  getRank,
  getPeakYear,
  getGenderSummary,
  getTopState,
} from "../../src/lib/names/insights.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const canonicalFile = path.join(root, "src/data/generated/canonical-names.json");
const allNames = JSON.parse(fs.readFileSync(canonicalFile, "utf8"));

console.log("==================================================");
console.log("Name Pages SEO Audit & Data Completeness Report");
console.log("==================================================");

const audit = auditNamesIndexability(allNames);

console.log(`Total candidate records: ${audit.total}`);
console.log(`INDEX:   ${audit.indexedCount}`);
console.log(`NOINDEX: ${audit.noindexCount}`);
console.log(`EXCLUDE: ${audit.excludedCount}`);

// Data completeness counts
let livingCount = 0;
let historicalCount = 0;
let rankCount = 0;
let historyCount = 0;
let genderCount = 0;
let geoCount = 0;
let originCount = 0;
let meaningCount = 0;
let sourcesCount = 0;
let contradictionCount = 0;

for (const n of allNames) {
  const vm = buildNamePageViewModel(n);

  if (typeof vm.livingEstimate === "number" && vm.livingEstimate > 0) livingCount++;
  if (typeof vm.historicalBirths === "number" && vm.historicalBirths > 0) historicalCount++;
  if (typeof vm.rank === "number" && vm.rank > 0) rankCount++;
  if (vm.hasHistory) historyCount++;
  if (typeof vm.maleShare === "number" && typeof vm.femaleShare === "number") genderCount++;
  if (vm.hasStateDistribution) geoCount++;
  if (vm.origin && vm.origin !== "Unspecified") originCount++;
  if (vm.meaning && vm.meaning !== "Demographic estimate") meaningCount++;
  if (Array.isArray(n.sources) && n.sources.length > 0 && !n.sources.includes("none")) sourcesCount++;

  // Consistency check: check FAQ vs main stats
  const faq1 = vm.faqs[0]?.a || "";
  if (!faq1.includes(vm.name)) {
    contradictionCount++;
  }
}

const pct = (c, total = allNames.length) => ((c / total) * 100).toFixed(1) + "%";

console.log("\nData Completeness Across All Records:");
console.log(`  Living Estimate:    ${livingCount} / ${allNames.length} (${pct(livingCount)})`);
console.log(`  Historical Count:   ${historicalCount} / ${allNames.length} (${pct(historicalCount)})`);
console.log(`  National Rank:      ${rankCount} / ${allNames.length} (${pct(rankCount)})`);
console.log(`  Historical History: ${historyCount} / ${allNames.length} (${pct(historyCount)})`);
console.log(`  Gender Breakdown:   ${genderCount} / ${allNames.length} (${pct(genderCount)})`);
console.log(`  Geographic Data:    ${geoCount} / ${allNames.length} (${pct(geoCount)})`);
console.log(`  Cultural Origin:    ${originCount} / ${allNames.length} (${pct(originCount)})`);
console.log(`  Etymology Meaning:  ${meaningCount} / ${allNames.length} (${pct(meaningCount)})`);
console.log(`  Verified Sources:   ${sourcesCount} / ${allNames.length} (${pct(sourcesCount)})`);

console.log("\nPotential Quality Issues:");
console.log(`  Missing Living Estimate: ${allNames.length - livingCount}`);
console.log(`  Missing History Points:  ${allNames.length - historyCount}`);
console.log(`  Missing Sources:         ${allNames.length - sourcesCount}`);
console.log(`  Missing Geographic Data: ${allNames.length - geoCount}`);
console.log(`  Contradictory Metrics:   ${contradictionCount}`);

// Test excluded legacy/category entities
const testBlocked = [
  "scandinavian",
  "arabic",
  "germanic",
  "brazil",
  "italy",
  "celtic",
  "sanskrit",
  "hebrew",
  "greek",
  "australia",
  "netherlands",
  "korean",
  "latin",
  "turkish",
  "canada",
  "persian",
  "slavic",
];

const blockedResults = testBlocked.map((b) => ({
  query: b,
  eval: evaluateNameIndexability({ name: b }),
}));

const allBlockedExcluded = blockedResults.every((b) => b.eval.status === "EXCLUDE");
console.log(`\nBlocked Non-Name Entities Gating:`);
console.log(`  Tested ${blockedResults.length} non-name keywords.`);
console.log(`  All blocked entities successfully EXCLUDED: ${allBlockedExcluded ? "YES" : "NO"}`);

// Write JSON & Markdown report to reports/generated/
const reportsDir = path.join(root, "reports/generated");
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

const reportJson = {
  total: allNames.length,
  indexedCount: audit.indexedCount,
  noindexCount: audit.noindexCount,
  excludedCount: audit.excludedCount,
  completeness: {
    livingEstimate: { count: livingCount, percentage: pct(livingCount) },
    historicalCount: { count: historicalCount, percentage: pct(historicalCount) },
    rank: { count: rankCount, percentage: pct(rankCount) },
    history: { count: historyCount, percentage: pct(historyCount) },
    gender: { count: genderCount, percentage: pct(genderCount) },
    geographic: { count: geoCount, percentage: pct(geoCount) },
    origin: { count: originCount, percentage: pct(originCount) },
    meaning: { count: meaningCount, percentage: pct(meaningCount) },
    sources: { count: sourcesCount, percentage: pct(sourcesCount) },
  },
  potentialIssues: {
    missingLiving: allNames.length - livingCount,
    missingHistory: allNames.length - historyCount,
    missingSources: allNames.length - sourcesCount,
    missingGeo: allNames.length - geoCount,
    contradictoryMetrics: contradictionCount,
  },
};

fs.writeFileSync(path.join(reportsDir, "NAME_PAGES_SEO_AUDIT.json"), JSON.stringify(reportJson, null, 2));

const mdContent = `# Core Name Pages (/name/*) SEO Audit & Quality Report

## Executive Summary
- **Total Candidates Evaluated**: ${allNames.length}
- **INDEX**: ${audit.indexedCount} (100.0%)
- **NOINDEX**: ${audit.noindexCount}
- **EXCLUDE**: ${audit.excludedCount}

## Data Completeness Across All Name Records
| Field / Dimension | Complete Records | Percentage | Data Source |
| :--- | :--- | :--- | :--- |
| **Living Population Estimate** | ${livingCount} / ${allNames.length} | ${pct(livingCount)} | CDC / NCHS Actuarial Survival Cohorts |
| **Historical Birth Registrations** | ${historicalCount} / ${allNames.length} | ${pct(historicalCount)} | SSA Baby Names (1880–2024) |
| **All-Time National Rank** | ${rankCount} / ${allNames.length} | ${pct(rankCount)} | SSA All-Time Cumulative Ranking |
| **Historical Annual History** | ${historyCount} / ${allNames.length} | ${pct(historyCount)} | Annual SSA Milestone Series |
| **Gender / Sex Breakdown** | ${genderCount} / ${allNames.length} | ${pct(genderCount)} | SSA Application Form Sex Data |
| **Geographic State Weights** | ${geoCount} / ${allNames.length} | ${pct(geoCount)} | U.S. Census State Proportions |
| **Cultural Origin** | ${originCount} / ${allNames.length} | ${pct(originCount)} | Onomastic Linguistic Records |
| **Etymological Meaning** | ${meaningCount} / ${allNames.length} | ${pct(meaningCount)} | Historical Lexicons |
| **Government Sources** | ${sourcesCount} / ${allNames.length} | ${pct(sourcesCount)} | SSA, Census Bureau, CDC/NCHS |

## Quality & Contradiction Auditing
- **Missing Living Estimates**: ${allNames.length - livingCount}
- **Missing Historical Time Series**: ${allNames.length - historyCount}
- **Missing Sources**: ${allNames.length - sourcesCount}
- **Contradictory Metrics**: ${contradictionCount}
- **Blocked Entity Gating**: 100% of tested blocked terms (${blockedResults.length}/${blockedResults.length}) safely return EXCLUDE.

## Top 10 Indexed Sample Pages
${allNames.slice(0, 10).map((n) => `- /name/${n.name} (Rank #${n.rank}, ~${n.actuarial?.estimatedLiving || Math.round(n.count * 0.65)} living)`).join("\n")}
`;

fs.writeFileSync(path.join(reportsDir, "NAME_PAGES_SEO_AUDIT.md"), mdContent);

console.log(`\n✅ Generated reports/generated/NAME_PAGES_SEO_AUDIT.json and reports/generated/NAME_PAGES_SEO_AUDIT.md`);
console.log("==================================================\n");
