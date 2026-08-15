import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("==================================================");
console.log(">>> STARTING OFFICIAL DATA INGESTION PIPELINE <<<");
console.log("==================================================");

const steps = [
  { name: "Verify SSA National Researcher Dataset", script: "sources/fetch-ssa-national.mjs" },
  { name: "Verify Census 2020 First Names Dataset", script: "sources/fetch-census-first-names.mjs" },
  { name: "Verify Census Surnames Dataset", script: "sources/fetch-census-last-names.mjs" },
  { name: "Verify SSA 2025/2026 Popularity Cohort", script: "sources/fetch-ssa-2025.mjs" },
  { name: "Parse SSA Raw Records", script: "parse-ssa.mjs" },
  { name: "Parse Census 2020 Tabulations", script: "parse-census.mjs" },
  { name: "Seed Census Decennial Surnames", script: "seed-surnames.mjs" },
  { name: "Validate Schemas & Slug Uniqueness", script: "validate-names.mjs" },
  { name: "Build Derived Metrics & Historical Curves", script: "build-derived-data.mjs" },
  { name: "Build Full-Name Combination Index", script: "build-fullnames.mjs" },
  { name: "Generate Application Dataset & Manifest", script: "generate-app-data.mjs" },
  { name: "Print Provenance & Quality Report", script: "report.mjs" },
];

for (const step of steps) {
  console.log(`\n[STEP] ${step.name}...`);
  try {
    execSync(`node ${path.join(__dirname, step.script)}`, { stdio: "inherit" });
  } catch (err) {
    console.error(`\n[!] Pipeline FAILED at step: ${step.name}`);
    process.exit(1);
  }
}

console.log("\n[STEP] Running Unit & Component Test Suite (vitest)...");
try {
  execSync("npx vitest run", { stdio: "inherit", cwd: path.resolve(__dirname, "../..") });
} catch (err) {
  console.error("\n[!] Test suite validation FAILED following data update");
  process.exit(1);
}

console.log("\n>>> DATA PIPELINE EXECUTION COMPLETED SUCCESSFULLY <<<\n");
