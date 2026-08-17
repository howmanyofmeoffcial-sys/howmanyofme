import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  evaluateSimilarNamesIndexability,
  auditSimilarNamesIndexability,
  BLOCKED_NAME_ENTITIES,
} from "../../src/lib/seo/indexability.ts";
import { getSimilarNames } from "../../src/lib/names/getSimilarNames.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const canonicalFile = path.join(root, "src/data/generated/canonical-names.json");
const allNames = JSON.parse(fs.readFileSync(canonicalFile, "utf8"));

console.log("==================================================");
console.log("Similar Names SEO Audit & Distribution Report");
console.log("==================================================");

const audit = auditSimilarNamesIndexability(allNames);

console.log(`Total candidate pages: ${audit.total}`);
console.log(`INDEX:   ${audit.indexedCount}`);
console.log(`NOINDEX: ${audit.noindexCount}`);
console.log(`EXCLUDE: ${audit.excludedCount}`);

console.log("\nMatch distribution (Strong Multi-Signal Matches):");
console.log(`  Min matches:     ${audit.distribution.min}`);
console.log(`  Median matches:  ${audit.distribution.median}`);
console.log(`  Average matches: ${audit.distribution.avg}`);
console.log(`  P75:             ${audit.distribution.p75}`);
console.log(`  P90:             ${audit.distribution.p90}`);
console.log(`  Max matches:     ${audit.distribution.max}`);

// Group NOINDEX reasons
const reasonCounts = {};
for (const n of audit.noindexDetails) {
  for (const r of n.reasons) {
    reasonCounts[r] = (reasonCounts[r] || 0) + 1;
  }
}

console.log("\nWhy pages were NOINDEXed (reasons breakdown):");
for (const [reason, count] of Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  - ${reason}: ${count} pages`);
}

// Check legacy / excluded entity handling
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
  eval: evaluateSimilarNamesIndexability(b),
}));

console.log("\nExcluded URL Patterns Validation:");
console.log(`  Tested ${blockedResults.length} known legacy/category terms.`);
const allExcluded = blockedResults.every((b) => b.eval.status === "EXCLUDE");
console.log(`  All blocked entities successfully EXCLUDED: ${allExcluded ? "YES" : "NO"}`);

// Write JSON & Markdown report to reports/generated/
const reportsDir = path.join(root, "reports/generated");
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

const reportJsonPath = path.join(reportsDir, "SIMILAR_NAMES_SEO_AUDIT.json");
fs.writeFileSync(reportJsonPath, JSON.stringify(audit, null, 2));

const mdContent = `# Similar Names SEO Audit & Indexability Report

## Executive Summary
- **Total Candidate Pages**: ${audit.total}
- **INDEX**: ${audit.indexedCount}
- **NOINDEX**: ${audit.noindexCount}
- **EXCLUDE**: ${audit.excludedCount}

## Data Distribution (Multi-Signal Strong Matches)
| Metric | Value |
| :--- | :--- |
| **Min Matches** | ${audit.distribution.min} |
| **Median Matches** | ${audit.distribution.median} |
| **Average Matches** | ${audit.distribution.avg} |
| **75th Percentile (P75)** | ${audit.distribution.p75} |
| **90th Percentile (P90)** | ${audit.distribution.p90} |
| **Max Matches** | ${audit.distribution.max} |

## Indexability Reasons Breakdown
${Object.entries(reasonCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([r, c]) => `- **${r}**: ${c} pages`)
  .join("\n")}

## Top Indexed Similar Names Sample
${audit.indexedNames.slice(0, 20).map((n) => `- /similar-names/${n.toLowerCase()}`).join("\n")}
`;

const reportMdPath = path.join(reportsDir, "SIMILAR_NAMES_SEO_AUDIT.md");
fs.writeFileSync(reportMdPath, mdContent);

console.log(`\n✅ Generated ${reportJsonPath} and ${reportMdPath}`);
console.log("==================================================\n");
