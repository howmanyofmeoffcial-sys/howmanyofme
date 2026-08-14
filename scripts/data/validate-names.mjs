import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const ssaNormFile = path.join(root, "src/data/normalized/ssa_normalized.json");
const censusNormFile = path.join(root, "src/data/normalized/census_normalized.json");

console.log("[validate-names] Running automated schema, bounds, duplicate, and slug validation...");

let fatalErrors = 0;
let warnings = 0;

if (!fs.existsSync(ssaNormFile)) {
  console.error(`[validate-names] FATAL: Normalized SSA file missing at ${ssaNormFile}`);
  process.exit(1);
}

const ssaData = JSON.parse(fs.readFileSync(ssaNormFile, "utf8"));
const ssaRecords = ssaData.records || [];

const seenNormalized = new Set();
const slugToNameMap = new Map();

for (const rec of ssaRecords) {
  // 1. Schema & Required Fields
  if (!rec.name || typeof rec.name !== "string") {
    console.error(`[validate-names] FATAL: Record missing valid name string:`, rec);
    fatalErrors++;
  }
  if (!rec.normalizedName || !rec.slug) {
    console.error(`[validate-names] FATAL: Record ${rec.name} missing normalizedName or slug`);
    fatalErrors++;
  }

  // 2. Duplicate Normalized Names
  if (seenNormalized.has(rec.normalizedName)) {
    console.error(`[validate-names] FATAL: Duplicate normalized name detected: ${rec.normalizedName}`);
    fatalErrors++;
  }
  seenNormalized.add(rec.normalizedName);

  // 3. Slug Collision Detection (Section 74)
  if (slugToNameMap.has(rec.slug)) {
    const existing = slugToNameMap.get(rec.slug);
    if (existing !== rec.name) {
      console.error(`[validate-names] FATAL: Slug collision detected for slug '${rec.slug}': '${existing}' vs '${rec.name}'`);
      fatalErrors++;
    }
  } else {
    slugToNameMap.set(rec.slug, rec.name);
  }

  // 4. Value Bounds & Range Checks (Section 38)
  if (rec.totalBirths < 0 || rec.maleBirths < 0 || rec.femaleBirths < 0) {
    console.error(`[validate-names] FATAL: Negative birth count in record ${rec.name}`);
    fatalErrors++;
  }

  if (rec.firstYear < 1880 || rec.lastYear > 2024 || rec.firstYear > rec.lastYear) {
    console.error(`[validate-names] FATAL: Impossible year range in record ${rec.name}: ${rec.firstYear}-${rec.lastYear}`);
    fatalErrors++;
  }

  // 5. Aggregation Sanity (Section 37)
  if (rec.totalBirths !== rec.maleBirths + rec.femaleBirths) {
    console.error(`[validate-names] FATAL: Aggregation mismatch in ${rec.name}: total (${rec.totalBirths}) != M (${rec.maleBirths}) + F (${rec.femaleBirths})`);
    fatalErrors++;
  }
}

// 6. Validate Census records if present
if (fs.existsSync(censusNormFile)) {
  const censusData = JSON.parse(fs.readFileSync(censusNormFile, "utf8"));
  for (const rec of censusData.records || []) {
    if (rec.census2020Count < 0) {
      console.error(`[validate-names] FATAL: Negative count in Census record: ${rec.name}`);
      fatalErrors++;
    }
    if (rec.sourceYear !== 2020) {
      console.error(`[validate-names] FATAL: Invalid Census source year: ${rec.sourceYear}`);
      fatalErrors++;
    }
  }
}

console.log(`[validate-names] Validation complete: ${fatalErrors} fatal errors, ${warnings} warnings.`);

if (fatalErrors > 0) {
  console.error(`[validate-names] FATAL: Validation failed. Pipeline aborted.`);
  process.exit(1);
} else {
  console.log(`[validate-names] ✅ All records passed data integrity & slug uniqueness validation.`);
}
