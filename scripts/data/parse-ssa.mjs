import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeName, isStandardName } from "./normalize-names.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const rawFile = path.join(root, "src/data/raw/ssa/names_1880_2024.json");
const outDir = path.join(root, "src/data/normalized");
fs.mkdirSync(outDir, { recursive: true });

console.log("[parse-ssa] Parsing official SSA historical birth records...");

if (!fs.existsSync(rawFile)) {
  console.error(`[parse-ssa] FATAL: Raw SSA data file missing at ${rawFile}`);
  process.exit(1);
}

const rawData = JSON.parse(fs.readFileSync(rawFile, "utf8"));
const records = rawData.records || [];

const normalizedMap = new Map();

for (const rec of records) {
  if (!isStandardName(rec.name)) continue;

  const norm = normalizeName(rec.name);
  if (!normalizedMap.has(norm.normalized)) {
    normalizedMap.set(norm.normalized, {
      name: norm.display,
      normalizedName: norm.normalized,
      slug: norm.slug,
      firstYear: 2024,
      lastYear: 1880,
      maleBirths: 0,
      femaleBirths: 0,
      totalBirths: 0,
      yearlyBirths: {}, // { [year]: { M: 0, F: 0, total: 0 } }
    });
  }

  const entry = normalizedMap.get(norm.normalized);
  const sex = rec.sex === "M" ? "M" : "F";

  for (const [yearStr, count] of Object.entries(rec.birthsByYear || {})) {
    const year = Number.parseInt(yearStr, 10);
    if (isNaN(year) || year < 1880 || year > 2024 || count < 0) continue;

    if (year < entry.firstYear) entry.firstYear = year;
    if (year > entry.lastYear) entry.lastYear = year;

    if (!entry.yearlyBirths[year]) {
      entry.yearlyBirths[year] = { M: 0, F: 0, total: 0 };
    }

    entry.yearlyBirths[year][sex] += count;
    entry.yearlyBirths[year].total += count;

    if (sex === "M") entry.maleBirths += count;
    else entry.femaleBirths += count;
    entry.totalBirths += count;
  }
}

const normalizedList = Array.from(normalizedMap.values());
const outFile = path.join(outDir, "ssa_normalized.json");

fs.writeFileSync(
  outFile,
  JSON.stringify(
    {
      datasetVersion: rawData.datasetVersion || "1880-2024",
      parsedAt: new Date().toISOString(),
      uniqueNamesCount: normalizedList.length,
      records: normalizedList,
    },
    null,
    2
  ),
  "utf8"
);

console.log(`[parse-ssa] Successfully parsed ${normalizedList.length} unique normalized SSA name entities.`);
