import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

console.log("==================================================");
console.log(">>> RUNNING PHASE 26: DATA ARCHITECTURE QA <<<");
console.log("==================================================");

// 1. Audit URL Count & Dist Size
const distDir = path.join(root, "dist");
const sitemapFile = path.join(distDir, "sitemap.xml");

let sitemapUrlCount = 0;
if (fs.existsSync(sitemapFile)) {
  const content = fs.readFileSync(sitemapFile, "utf8");
  const matches = content.match(/<loc>/g);
  sitemapUrlCount = matches ? matches.length : 0;
}

// 2. Storage & Payload Size Audit
function getDirSize(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  let total = 0;
  const files = fs.readdirSync(dirPath, { recursive: true });
  for (const f of files) {
    const fullPath = path.join(dirPath, f);
    if (fs.statSync(fullPath).isFile()) {
      total += fs.statSync(fullPath).size;
    }
  }
  return total;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

const rawSize = getDirSize(path.join(root, "data/raw"));
const normalizedSize = getDirSize(path.join(root, "src/data/normalized"));
const derivedSize = getDirSize(path.join(root, "src/data/derived"));
const generatedSize = getDirSize(path.join(root, "src/data/generated"));

// Check client JS bundle size in dist/_astro/
const distAstroDir = path.join(distDir, "_astro");
let totalClientJsBytes = 0;
let jsFileCount = 0;
if (fs.existsSync(distAstroDir)) {
  const files = fs.readdirSync(distAstroDir);
  for (const f of files) {
    if (f.endsWith(".js")) {
      jsFileCount++;
      totalClientJsBytes += fs.statSync(path.join(distAstroDir, f)).size;
    }
  }
}

// Check index.html size
const indexHtmlFile = path.join(distDir, "index.html");
const indexHtmlSize = fs.existsSync(indexHtmlFile) ? fs.statSync(indexHtmlFile).size : 0;

// 3. Raw Data Records Verification
const ssaRawFile = path.join(root, "data/raw/ssa/names_1880_2024.json");
const censusFirstRawFile = path.join(root, "data/raw/census/census_2020_first_names.json");
const censusSurnameRawFile = path.join(root, "data/raw/census/surnames_2010_2020.json");
const ssa2025RawFile = path.join(root, "data/raw/ssa/ssa_2025.json");

const ssaRawRecords = fs.existsSync(ssaRawFile) ? JSON.parse(fs.readFileSync(ssaRawFile, "utf8")).records?.length || 0 : 0;
const censusFirstRecords = fs.existsSync(censusFirstRawFile) ? JSON.parse(fs.readFileSync(censusFirstRawFile, "utf8")).records?.length || 0 : 0;
const censusSurnameRecords = fs.existsSync(censusSurnameRawFile) ? JSON.parse(fs.readFileSync(censusSurnameRawFile, "utf8")).records?.length || 0 : 0;
const ssa2025Records = fs.existsSync(ssa2025RawFile) ? JSON.parse(fs.readFileSync(ssa2025RawFile, "utf8")).totalRecorded || 0 : 0;

// 4. Ads.txt and Mediavine Verification
const adsTxtFile = path.join(distDir, "ads.txt");
const hasAdsTxt = fs.existsSync(adsTxtFile);

console.log("\n[QA AUDIT RESULTS]");
console.log(`- Sitemap URLs:                ${sitemapUrlCount} (Controlled canonical index)`);
console.log(`- Zero URL Explosion:          ${sitemapUrlCount < 5000 ? "✅ PASSED" : "❌ FAILED"}`);
console.log(`- Raw Data Store Size:         ${formatBytes(rawSize)}`);
console.log(`- Normalized Data Store Size:  ${formatBytes(normalizedSize)}`);
console.log(`- Generated App Index Size:    ${formatBytes(generatedSize)}`);
console.log(`- Total Client JS Files:       ${jsFileCount} (${formatBytes(totalClientJsBytes)})`);
console.log(`- Homepage HTML Size:          ${formatBytes(indexHtmlSize)}`);
console.log(`- Ads.txt Preserved:           ${hasAdsTxt ? "✅ YES" : "❌ NO"}`);
console.log(`- SSA 1880-2024 Records:       ${ssaRawRecords.toLocaleString()}`);
console.log(`- Census 2020 First Names:     ${censusFirstRecords.toLocaleString()}`);
console.log(`- Census Surnames:             ${censusSurnameRecords.toLocaleString()}`);
console.log(`- SSA 2025 Top Cohort:         ${ssa2025Records.toLocaleString()}`);
console.log("==================================================\n");

if (sitemapUrlCount > 5000) {
  console.error("❌ ERROR: URL explosion detected. Total URLs exceeds threshold.");
  process.exit(1);
}
