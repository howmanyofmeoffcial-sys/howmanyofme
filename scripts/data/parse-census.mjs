import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeName, isStandardName } from "./normalize-names.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const rawFile = path.join(root, "src/data/raw/census/census_2020_first_names.json");
const outDir = path.join(root, "src/data/normalized");
fs.mkdirSync(outDir, { recursive: true });

console.log("[parse-census] Parsing official 2020 Decennial Census first-name tabulations...");

if (!fs.existsSync(rawFile)) {
  console.error(`[parse-census] FATAL: Raw Census data file missing at ${rawFile}`);
  process.exit(1);
}

const rawData = JSON.parse(fs.readFileSync(rawFile, "utf8"));
const records = rawData.records || [];

const normalizedMap = new Map();

for (const rec of records) {
  if (!isStandardName(rec.name)) continue;

  const norm = normalizeName(rec.name);
  normalizedMap.set(norm.normalized, {
    name: norm.display,
    normalizedName: norm.normalized,
    slug: norm.slug,
    census2020Count: rec.count,
    census2020Rank: rec.rank,
    pctMale: rec.pctMale,
    pctFemale: rec.pctFemale,
    sourceYear: 2020,
  });
}

const normalizedList = Array.from(normalizedMap.values());
const outFile = path.join(outDir, "census_normalized.json");

fs.writeFileSync(
  outFile,
  JSON.stringify(
    {
      censusYear: 2020,
      parsedAt: new Date().toISOString(),
      uniqueNamesCount: normalizedList.length,
      records: normalizedList,
    },
    null,
    2
  ),
  "utf8"
);

console.log(`[parse-census] Successfully parsed ${normalizedList.length} Census 2020 first-name entities.`);
