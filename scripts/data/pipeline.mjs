import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("==================================================");
console.log(">>> STARTING OFFICIAL DATA INGESTION PIPELINE <<<");
console.log("==================================================");

const steps = [
  { name: "Fetch SSA Dataset Snapshot", script: "fetch-ssa.mjs" },
  { name: "Parse SSA Raw Records", script: "parse-ssa.mjs" },
  { name: "Parse Census 2020 Tabulations", script: "parse-census.mjs" },
  { name: "Validate Schemas & Slug Uniqueness", script: "validate-names.mjs" },
  { name: "Build Derived Metrics & Historical Curves", script: "build-derived-data.mjs" },
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

console.log("\n>>> DATA PIPELINE EXECUTION COMPLETED SUCCESSFULLY <<<\n");
