import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const derivedFile = path.join(root, "src/data/derived/names_derived.json");
const genDir = path.join(root, "src/data/generated");
const metaDir = path.join(root, "src/data/metadata");
fs.mkdirSync(genDir, { recursive: true });
fs.mkdirSync(metaDir, { recursive: true });

console.log("[generate-app-data] Generating application index and dataset manifest...");

if (!fs.existsSync(derivedFile)) {
  console.error(`[generate-app-data] FATAL: Derived data missing at ${derivedFile}`);
  process.exit(1);
}

const derivedData = JSON.parse(fs.readFileSync(derivedFile, "utf8"));
const records = derivedData.records || [];

// 1. Build Map indexed by normalized name and by slug
const indexMap = {};
const list = [];

for (const rec of records) {
  indexMap[rec.normalizedName] = rec;
  indexMap[rec.slug] = rec;
  list.push(rec);
}

fs.writeFileSync(
  path.join(genDir, "names-index.json"),
  JSON.stringify(indexMap),
  "utf8"
);

fs.writeFileSync(
  path.join(genDir, "canonical-names.json"),
  JSON.stringify(list),
  "utf8"
);

// 2. Generate Dataset Manifest (Section 40, 41)
const manifest = {
  dataVersion: "2026.08.14",
  generatedAt: new Date().toISOString(),
  processingVersion: "1.0.0",
  sources: {
    ssa: {
      sourceId: "ssa-popular-names",
      provider: "Social Security Administration",
      datasetVersion: "1880-2024",
      coverageYears: "1880-2024",
      latestAvailableYear: 2024,
    },
    census: {
      sourceId: "census-2020-first-names",
      provider: "U.S. Census Bureau",
      datasetVersion: "2020",
      coverageYear: 2020,
    },
  },
  stats: {
    uniqueNamesCount: records.length,
    historicalCoverageYears: "1880-2024",
    censusMatchedNamesCount: records.filter((r) => r.census2020 !== null).length,
    indexableCandidatesCount: records.length,
  },
};

fs.writeFileSync(
  path.join(metaDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf8"
);

console.log(`[generate-app-data] Successfully generated application dataset with ${records.length} canonical names.`);
