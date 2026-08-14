import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const firstNamesFile = path.join(root, "src/data/generated/canonical-names.json");
const surnamesFile = path.join(root, "src/data/raw/census/surnames_2010_2020.json");
const outputDir = path.join(root, "src/data/generated");

console.log("[build-fullnames] Generating controlled full-name entity candidate cohort...");

if (!fs.existsSync(firstNamesFile) || !fs.existsSync(surnamesFile)) {
  console.error("Missing prerequisite first-name or surname datasets.");
  process.exit(1);
}

const firstNames = JSON.parse(fs.readFileSync(firstNamesFile, "utf8"));
const surnamesData = JSON.parse(fs.readFileSync(surnamesFile, "utf8"));
const surnames = surnamesData.records;

// Prioritize top established first names (e.g. top 30 male and female classics + popular staples)
const selectedFirstNames = firstNames
  .filter((f) => (f.actuarial?.estimatedLiving || 0) >= 100000 || f.rank <= 40)
  .slice(0, 35); // 35 top first names

const selectedSurnames = surnames.slice(0, 20); // 20 top surnames

const totalPossibleCombinations = firstNames.length * surnames.length; // 583 * 50 = 29,150
const candidates = [];
const excluded = [];

const CENSUS_BASE = 295000000;

for (const first of selectedFirstNames) {
  const living = first.actuarial?.estimatedLiving || Math.round(first.count * 0.65);
  for (const sur of selectedSurnames) {
    const rawEstimate = (living * sur.count) / CENSUS_BASE;
    const slug = `${first.normalizedName}-${sur.name.toLowerCase()}`;

    const candidate = {
      firstName: first.name,
      lastName: sur.name,
      slug,
      displayName: `${first.name} ${sur.name}`,
      firstNameLiving: living,
      firstNameRank: first.rank,
      surnameCount: sur.count,
      surnameRank: sur.rank,
      rawEstimate,
    };

    if (rawEstimate > 0 && living >= 100 && sur.count >= 500) {
      candidates.push(candidate);
    } else {
      excluded.push({ ...candidate, reason: "estimate-insufficient" });
    }
  }
}

// Map full-name index
const indexMap = {};
const canonicalList = [];

for (const c of candidates) {
  const rounded = c.rawEstimate < 10 ? Math.round(c.rawEstimate) : Math.round(c.rawEstimate / 10) * 10;
  const entity = {
    displayName: c.displayName,
    firstName: c.firstName,
    lastName: c.lastName,
    slug: c.slug,
    firstNameRank: c.firstNameRank,
    firstNameLiving: c.firstNameLiving,
    surnameRank: c.surnameRank,
    surnameCount: c.surnameCount,
    estimatedPeople: rounded,
    rawEstimate: Math.round(c.rawEstimate * 100) / 100,
    confidence: c.firstNameLiving >= 100000 && c.surnameCount >= 500000 ? "HIGH" : "MEDIUM",
    sources: ["ssa-popular-names", "census-surnames"],
    methodologyVersion: "1.0.0",
  };

  indexMap[c.slug] = entity;
  canonicalList.push(entity);
}

fs.writeFileSync(path.join(outputDir, "fullnames-index.json"), JSON.stringify(indexMap, null, 2), "utf8");
fs.writeFileSync(path.join(outputDir, "canonical-fullnames.json"), JSON.stringify(canonicalList, null, 2), "utf8");

console.log(`[build-fullnames] Generated ${canonicalList.length} indexable full-name entities (out of ${totalPossibleCombinations} possible combinations).`);
