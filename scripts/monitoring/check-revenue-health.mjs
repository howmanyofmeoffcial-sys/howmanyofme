import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

export function runRevenueHealthCheck() {
  const findings = [];

  // Check AdSlot layout stability in code
  const adSlotPath = path.join(root, "src/components/AdSlot.astro");
  if (fs.existsSync(adSlotPath)) {
    const adSlotContent = fs.readFileSync(adSlotPath, "utf8");
    if (!adSlotContent.includes("contain-layout") || !adSlotContent.includes("min-h-")) {
      findings.push({
        id: "adslot-cls-risk",
        category: "performance",
        severity: "high",
        title: "AdSlot Component Missing Zero-CLS Constraints",
        description: "AdSlot.astro is missing contain-layout or minimum height definitions.",
        firstDetectedAt: new Date().toISOString(),
        lastDetectedAt: new Date().toISOString(),
        status: "open",
      });
    }
  }

  return findings;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const results = runRevenueHealthCheck();
  console.log(`[check-revenue-health] Found ${results.length} issues.`);
  console.log(JSON.stringify(results, null, 2));
}
