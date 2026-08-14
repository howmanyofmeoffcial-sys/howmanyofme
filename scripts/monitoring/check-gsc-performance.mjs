import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

export function runGscPerformanceCheck() {
  const findings = [];
  const gscSnapshotPath = path.join(root, "data/seo/snapshots/2026_08_14_snapshot.json");

  if (!fs.existsSync(gscSnapshotPath)) {
    findings.push({
      id: "gsc-snapshot-missing",
      category: "seo",
      severity: "low",
      title: "GSC Snapshot Not Initialized",
      description: "GSC snapshot file not found in data/seo/snapshots/.",
      firstDetectedAt: new Date().toISOString(),
      lastDetectedAt: new Date().toISOString(),
      status: "open",
    });
    return findings;
  }

  const gscData = JSON.parse(fs.readFileSync(gscSnapshotPath, "utf8"));

  // Check overall click volume sanity
  if (gscData.totalClicks < 50000) {
    findings.push({
      id: "gsc-clicks-anomaly",
      category: "seo",
      severity: "medium",
      title: `GSC Monthly Clicks Under Baseline (${gscData.totalClicks})`,
      description: "Organic monthly click volume dropped below 50,000 threshold.",
      firstDetectedAt: new Date().toISOString(),
      lastDetectedAt: new Date().toISOString(),
      status: "open",
    });
  }

  return findings;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const results = runGscPerformanceCheck();
  console.log(`[check-gsc-performance] Found ${results.length} issues.`);
  console.log(JSON.stringify(results, null, 2));
}
