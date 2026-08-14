import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const ssaNormFile = path.join(root, "src/data/normalized/ssa_normalized.json");
const censusNormFile = path.join(root, "src/data/normalized/census_normalized.json");
const derivedDir = path.join(root, "src/data/derived");
fs.mkdirSync(derivedDir, { recursive: true });

console.log("[build-derived-data] Computing derived metrics, historical decade curves, and rankings...");

const ssaData = JSON.parse(fs.readFileSync(ssaNormFile, "utf8"));
const censusData = fs.existsSync(censusNormFile)
  ? JSON.parse(fs.readFileSync(censusNormFile, "utf8"))
  : { records: [] };

const censusMap = new Map();
for (const c of censusData.records || []) {
  censusMap.set(c.normalizedName, c);
}

// Load linguistic etymologies from existing mapping
const nameDataSrc = fs.readFileSync(path.join(root, "src/data/nameData.ts"), "utf8");
const etymologyMap = new Map();
for (const match of nameDataSrc.matchAll(/"([A-Za-z]+)":\s*\{[^}]*origin:\s*"([^"]+)",\s*meaning:\s*"([^"]+)"/g)) {
  etymologyMap.set(match[1].toLowerCase(), { origin: match[2], meaning: match[3] });
}

const DECADE_RANGES = [
  { key: "1940s", start: 1940, end: 1949 },
  { key: "1950s", start: 1950, end: 1959 },
  { key: "1960s", start: 1960, end: 1969 },
  { key: "1970s", start: 1970, end: 1979 },
  { key: "1980s", start: 1980, end: 1989 },
  { key: "1990s", start: 1990, end: 1999 },
  { key: "2000s", start: 2000, end: 2009 },
  { key: "2010s", start: 2010, end: 2019 },
  { key: "2020s", start: 2020, end: 2024 },
];

const derivedList = [];

for (const ssa of ssaData.records) {
  // 1. Calculate Peak Year & Peak Year Births (Section 28)
  let peakYear = ssa.firstYear;
  let peakBirths = 0;

  for (const [yearStr, counts] of Object.entries(ssa.yearlyBirths || {})) {
    const year = Number.parseInt(yearStr, 10);
    const totalYear = counts.total || 0;
    if (totalYear > peakBirths) {
      peakBirths = totalYear;
      peakYear = year;
    }
  }

  // 2. Recent Births Window (Section 27: 2015–2024, last 10 available years)
  let recentBirths = 0;
  for (let y = 2015; y <= 2024; y++) {
    recentBirths += ssa.yearlyBirths[y]?.total || 0;
  }

  // 3. Gender / Sex Classification
  const maleRatio = ssa.totalBirths > 0 ? ssa.maleBirths / ssa.totalBirths : 0.5;
  let gender = "unisex";
  if (maleRatio >= 0.85) gender = "male";
  else if (maleRatio <= 0.15) gender = "female";

  // 4. Decade Popularity Index (0-100 normalized)
  const decadeCounts = {};
  let maxDecadeSum = 0;
  for (const range of DECADE_RANGES) {
    let sum = 0;
    for (let y = range.start; y <= range.end; y++) {
      sum += ssa.yearlyBirths[y]?.total || 0;
    }
    decadeCounts[range.key] = sum;
    if (sum > maxDecadeSum) maxDecadeSum = sum;
  }

  const decade_popularity = {};
  for (const range of DECADE_RANGES) {
    decade_popularity[range.key] = maxDecadeSum > 0
      ? Math.max(1, Math.round((decadeCounts[range.key] / maxDecadeSum) * 98))
      : 10;
  }

  // 5. Census 2020 integration (Section 33, 64)
  const censusRec = censusMap.get(ssa.normalizedName);
  const census2020 = censusRec
    ? {
        count: censusRec.census2020Count,
        rank: censusRec.census2020Rank,
        pctMale: censusRec.pctMale,
        pctFemale: censusRec.pctFemale,
        sourceYear: 2020,
      }
    : null;

  // 6. Etymology & Meaning
  const etym = etymologyMap.get(ssa.normalizedName) || { origin: "Traditional", meaning: "Noble, cherished" };

  derivedList.push({
    name: ssa.name,
    normalizedName: ssa.normalizedName,
    slug: ssa.slug,
    count: ssa.totalBirths, // Base canonical count
    gender,
    origin: etym.origin,
    meaning: etym.meaning,
    ssa: {
      totalBirths: ssa.totalBirths,
      maleBirths: ssa.maleBirths,
      femaleBirths: ssa.femaleBirths,
      firstYear: ssa.firstYear,
      lastYear: ssa.lastYear,
      peakYear,
      peakYearBirths: peakBirths,
      recentBirths,
      recentWindow: "2015-2024",
    },
    census2020,
    decade_popularity,
    sources: [
      "ssa-popular-names",
      ...(census2020 ? ["census-2020-first-names"] : []),
    ],
  });
}

// 7. Calculate Deterministic Global/National Rank (Section 26)
derivedList.sort((a, b) => b.ssa.totalBirths - a.ssa.totalBirths);
derivedList.forEach((rec, idx) => {
  rec.rank = idx + 1;
});

const outFile = path.join(derivedDir, "names_derived.json");
fs.writeFileSync(
  outFile,
  JSON.stringify(
    {
      derivedAt: new Date().toISOString(),
      totalEntities: derivedList.length,
      records: derivedList,
    },
    null,
    2
  ),
  "utf8"
);

console.log(`[build-derived-data] Computed derived metrics for ${derivedList.length} canonical names. Top rank: ${derivedList[0].name} (#1, ${derivedList[0].count} births).`);
