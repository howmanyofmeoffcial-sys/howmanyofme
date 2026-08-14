import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

export function runDataFreshnessCheck() {
  const findings = [];
  const manifestPath = path.join(root, "src/data/metadata/manifest.json");

  if (!fs.existsSync(manifestPath)) {
    findings.push({
      id: "manifest-missing",
      category: "data",
      severity: "critical",
      title: "Data Manifest Missing",
      description: "src/data/metadata/manifest.json does not exist.",
      firstDetectedAt: new Date().toISOString(),
      lastDetectedAt: new Date().toISOString(),
      status: "open",
    });
    return findings;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  // Check SSA dataset
  if (!manifest.sources?.ssa || manifest.sources.ssa.coverageYears !== "1880-2024") {
    findings.push({
      id: "ssa-data-stale",
      category: "data",
      severity: "high",
      title: "SSA Dataset Coverage Mismatch",
      description: "Expected full 1880-2024 SSA birth series.",
      firstDetectedAt: new Date().toISOString(),
      lastDetectedAt: new Date().toISOString(),
      status: "open",
    });
  }

  // Check Census dataset
  if (!manifest.sources?.census || manifest.sources.census.coverageYear !== 2020) {
    findings.push({
      id: "census-data-incomplete",
      category: "data",
      severity: "high",
      title: "Census 2020 First Names Incomplete",
      description: "Expected 2020 Census tabulation data.",
      firstDetectedAt: new Date().toISOString(),
      lastDetectedAt: new Date().toISOString(),
      status: "open",
    });
  }

  // Check Canonical Names JSON integrity
  const canonicalNamesPath = path.join(root, "src/data/generated/canonical-names.json");
  if (!fs.existsSync(canonicalNamesPath)) {
    findings.push({
      id: "canonical-names-missing",
      category: "data",
      severity: "critical",
      title: "canonical-names.json Missing",
      description: "Processed entity database is missing. Run data pipeline.",
      firstDetectedAt: new Date().toISOString(),
      lastDetectedAt: new Date().toISOString(),
      status: "open",
    });
  } else {
    const canonicalNames = JSON.parse(fs.readFileSync(canonicalNamesPath, "utf8"));
    if (canonicalNames.length < 580) {
      findings.push({
        id: "canonical-names-count-low",
        category: "data",
        severity: "critical",
        title: `Canonical Names Count Under Target (${canonicalNames.length})`,
        description: `Expected at least 583 canonical name records, found ${canonicalNames.length}.`,
        firstDetectedAt: new Date().toISOString(),
        lastDetectedAt: new Date().toISOString(),
        status: "open",
      });
    }
  }

  return findings;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const results = runDataFreshnessCheck();
  console.log(`[check-data-freshness] Found ${results.length} issues.`);
  console.log(JSON.stringify(results, null, 2));
}
