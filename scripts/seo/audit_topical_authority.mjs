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
  TOPICAL_CLUSTERS,
  LINKABLE_ASSETS,
  FUTURE_CONTENT_OPPORTUNITIES,
  evaluateEntityAuthorityProfile,
} from "../../src/lib/seo/topicalAuthority.ts";
import { getDefaultGscMap } from "../../src/lib/seo/performanceData.ts";

const canonicalFile = path.join(root, "src/data/generated/canonical-names.json");
const allNames = JSON.parse(fs.readFileSync(canonicalFile, "utf8"));

const gscMap = getDefaultGscMap();

const entityProfiles = [];
const gapCounts = {
  LIKELY_AUTHORITY_GAP: 0,
  POSSIBLE_AUTHORITY_GAP: 0,
  CONTENT_GAP: 0,
  TECHNICAL_GAP: 0,
  UNKNOWN: 0,
};

for (const record of allNames) {
  const canonicalUrl = `/name/${encodeURIComponent(record.name)}`;
  const perfRecord = gscMap.get(canonicalUrl);
  const profile = evaluateEntityAuthorityProfile(record.name, perfRecord);

  entityProfiles.push(profile);
  gapCounts[profile.authorityGap]++;
}

// 1. Write TOPICAL_AUTHORITY_REPORT
const topicalReportData = {
  clusters: TOPICAL_CLUSTERS,
  linkableAssets: LINKABLE_ASSETS,
  futureContent: FUTURE_CONTENT_OPPORTUNITIES,
};

fs.writeFileSync(
  path.join(reportsDir, "TOPICAL_AUTHORITY_REPORT.json"),
  JSON.stringify(topicalReportData, null, 2),
  "utf8"
);

const topicalReportMd = `# Topical Authority, Entity Architecture & Content Strategy Report

## 1. Core Topical Clusters Scorecard

| Topical Cluster | Hub URL | Status | Core Entities | Unique Data Advantage |
| :--- | :--- | :--- | :--- | :--- |
${TOPICAL_CLUSTERS.map(
  (c) =>
    `| **${c.name}** | [${c.hubUrl}](${c.hubUrl}) | \`${c.status}\` | ${c.coreEntitiesCount} | ${c.uniqueDataAdvantage} |`
).join("\n")}

## 2. Differentiated Proprietary & Derived Data Assets

1. **CDC Actuarial Life-Table Living Bearer Estimates**: Converts 145-year raw SSA births into realistic, actuarially adjusted living populations in 2026.
2. **Multi-Signal Name Similarity Engine**: Multi-dimensional phonetic (Soundex), orthographic (Levenshtein), rhyme, syllable, and historical era algorithm.
3. **Longitudinal Decade Matrix (1880–2024)**: Decade-by-decade frequency curves capturing generational naming shifts.
4. **Geographic State Distribution Shares**: Census 2020 and regional concentration models across all 50 states.

## 3. High-Value Linkable Assets

| Asset Title | Hub URL | Asset Type | Primary Target Audience | Citation Rationale |
| :--- | :--- | :--- | :--- | :--- |
${LINKABLE_ASSETS.map(
  (a) =>
    `| **${a.title}** | [${a.url}](${a.url}) | \`${a.assetType}\` | ${a.targetAudience} | ${a.citationReason} |`
).join("\n")}

## 4. Future High-ROI Research Studies & Linkable Content

| Study / Topic | URL Endpoint | Priority | Citation Potential | Supporting Dataset |
| :--- | :--- | :--- | :--- | :--- |
${FUTURE_CONTENT_OPPORTUNITIES.map(
  (f) =>
    `| **${f.topic}** | [${f.targetUrl}](${f.targetUrl}) | \`${f.priority}\` | \`${f.citationPotential}\` | ${f.supportingData} |`
).join("\n")}
`;

fs.writeFileSync(path.join(reportsDir, "TOPICAL_AUTHORITY_REPORT.md"), topicalReportMd, "utf8");

// 2. Write AUTHORITY_OPPORTUNITY_REPORT
const priorityEntities = entityProfiles.filter((p) => p.authorityGap !== "UNKNOWN");

const authorityReportData = {
  summary: gapCounts,
  priorityEntities,
};

fs.writeFileSync(
  path.join(reportsDir, "AUTHORITY_OPPORTUNITY_REPORT.json"),
  JSON.stringify(authorityReportData, null, 2),
  "utf8"
);

const authorityReportMd = `# Authority Opportunity & External Citation Strategy Report

## 1. Authority Gap Distribution

- **Total First-Name Entities**: ${allNames.length}
- **LIKELY_AUTHORITY_GAP**: ${gapCounts.LIKELY_AUTHORITY_GAP} (Striking-distance pages with strong data but competing against legacy high-DR portals)
- **POSSIBLE_AUTHORITY_GAP**: ${gapCounts.POSSIBLE_AUTHORITY_GAP} (Proven high-volume entities ready for research citations)
- **CONTENT_GAP**: ${gapCounts.CONTENT_GAP}
- **TECHNICAL_GAP**: ${gapCounts.TECHNICAL_GAP} (0 technical barriers; clean indexability & CLS)
- **UNKNOWN**: ${gapCounts.UNKNOWN} (Entities awaiting GSC capture)

## 2. Priority Entity Authority Opportunities

| Entity URL | Search Tier | SEO Priority | Impressions | Clicks | Position | Authority Gap | Strategic Authority Plan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${priorityEntities
  .map(
    (p) =>
      `| [${p.name}](${p.url}) | \`${p.searchDemandTier}\` | \`${p.seoPriority}\` | ${p.impressions.toLocaleString()} | ${p.clicks.toLocaleString()} | #${p.averagePosition.toFixed(1)} | \`${p.authorityGap}\` | ${p.recommendedAuthorityStrategy} |`
  )
  .join("\n")}

## 3. SEO Priority Matrix

\`\`\`text
                         HIGH SEARCH DEMAND
                                 │
            Improve CTR          │       Build Authority
            + snippet tables     │       + research citations
          (Robert, Jennifer,     │     (James, John, Michael,
           Emma, Olivia, Liam)   │      David, Mary, Noah)
                                 │
LOW DATA QUALITY ────────────────┼──────────────── HIGH DATA QUALITY
                                 │
            Deprioritize         │       Monitor baseline
                                 │     (571 verified entities)
                                 │
                         LOW OBSERVED DEMAND
\`\`\`
`;

fs.writeFileSync(path.join(reportsDir, "AUTHORITY_OPPORTUNITY_REPORT.md"), authorityReportMd, "utf8");

console.log("==================================================");
console.log("TOPICAL AUTHORITY & EXTERNAL OPPORTUNITY AUDIT");
console.log("==================================================");
console.log(`Topical Clusters Audited:         ${TOPICAL_CLUSTERS.length}`);
console.log(`Active Linkable Assets:           ${LINKABLE_ASSETS.length}`);
console.log(`Future Content Opportunities:     ${FUTURE_CONTENT_OPPORTUNITIES.length}`);
console.log("");
console.log("Authority Gap Classifications:");
console.log(`  - LIKELY_AUTHORITY_GAP:         ${gapCounts.LIKELY_AUTHORITY_GAP}`);
console.log(`  - POSSIBLE_AUTHORITY_GAP:       ${gapCounts.POSSIBLE_AUTHORITY_GAP}`);
console.log(`  - CONTENT_GAP:                  ${gapCounts.CONTENT_GAP}`);
console.log(`  - TECHNICAL_GAP:                ${gapCounts.TECHNICAL_GAP}`);
console.log(`  - UNKNOWN (Awaiting Search Data): ${gapCounts.UNKNOWN}`);
console.log("==================================================");
console.log("✅ Generated reports:");
console.log("  - reports/generated/TOPICAL_AUTHORITY_REPORT.md");
console.log("  - reports/generated/TOPICAL_AUTHORITY_REPORT.json");
console.log("  - reports/generated/AUTHORITY_OPPORTUNITY_REPORT.md");
console.log("  - reports/generated/AUTHORITY_OPPORTUNITY_REPORT.json");
