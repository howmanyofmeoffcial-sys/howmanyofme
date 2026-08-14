import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const publicDataDir = path.join(root, "public/data");
fs.mkdirSync(publicDataDir, { recursive: true });

console.log("[public-downloads] Generating derived public data assets for researchers & journalists...");

const canonicalNames = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/generated/canonical-names.json"), "utf8")
);

// 1. Generate Top 500 JSON Summary
const top500Summary = canonicalNames.slice(0, 500).map((n) => ({
  name: n.name,
  rank: n.rank,
  gender: n.gender,
  totalHistoricalBirths: n.ssa?.totalBirths || n.count,
  estimatedLivingPeople: n.actuarial?.estimatedLiving || Math.round(n.count * 0.65),
  estimatedAverageAge: n.actuarial?.estimatedAverageAge || 42.0,
  peakYear: n.ssa?.peakYear || 1955,
  peakBirths: n.ssa?.peakYearBirths || 0,
  census2020Count: n.census2020?.count || null,
  census2020Rank: n.census2020?.rank || null,
  sourceAttribution: "Derived from SSA (1880-2024) and U.S. Census Bureau (2020)",
  license: "Public Domain / Creative Commons Attribution (CC-BY 4.0)",
}));

fs.writeFileSync(
  path.join(publicDataDir, "us-names-top500-summary.json"),
  JSON.stringify({ metadata: { version: "2026.08.14", generatedAt: new Date().toISOString() }, records: top500Summary }, null, 2),
  "utf8"
);

// 2. Generate Historical Decades CSV Summary
const csvHeaders = "Name,Rank,Gender,TotalBirths,LivingEstimate,PeakYear,PeakBirths,1940s,1950s,1960s,1970s,1980s,1990s,2000s,2010s,2020s\n";
const csvRows = canonicalNames.slice(0, 250).map((n) => {
  const dec = n.decade_popularity || {};
  return [
    `"${n.name}"`,
    n.rank,
    n.gender,
    n.ssa?.totalBirths || n.count,
    n.actuarial?.estimatedLiving || Math.round(n.count * 0.65),
    n.ssa?.peakYear || 1955,
    n.ssa?.peakYearBirths || 0,
    dec["1940s"] || 0,
    dec["1950s"] || 0,
    dec["1960s"] || 0,
    dec["1970s"] || 0,
    dec["1980s"] || 0,
    dec["1990s"] || 0,
    dec["2000s"] || 0,
    dec["2010s"] || 0,
    dec["2020s"] || 0,
  ].join(",");
});

fs.writeFileSync(
  path.join(publicDataDir, "us-historical-names-decade-summary.csv"),
  csvHeaders + csvRows.join("\n"),
  "utf8"
);

console.log(`[public-downloads] Successfully generated public downloadable JSON and CSV data files.`);
