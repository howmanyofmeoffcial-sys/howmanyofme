import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const distDir = path.join(root, "dist");

console.log("=== PHASE 13 AUTOMATED SEO HEALTH & SERP COMPLIANCE AUDIT ===");

function getAllHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (file.endsWith(".html")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(distDir);
console.log(`Auditing ${htmlFiles.length} static HTML production files...`);

let passed = 0;
let errors = 0;
let warnings = 0;

for (const file of htmlFiles) {
  const rel = path.relative(distDir, file);
  // Skip Google Site Verification token files and noindex embed widgets
  if ((rel.startsWith("google") && rel.endsWith(".html")) || rel.startsWith("embed/")) {
    continue;
  }
  const content = fs.readFileSync(file, "utf8");

  // 1. Check Title Tag
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    console.error(`[ERROR] Missing or empty <title> in ${rel}`);
    errors++;
  }

  // 2. Check Meta Description
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    console.error(`[ERROR] Missing meta description in ${rel}`);
    errors++;
  }

  // 3. Check Canonical Link Tag
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (!canonicalMatch || !canonicalMatch[1].trim()) {
    console.error(`[ERROR] Missing canonical URL link in ${rel}`);
    errors++;
  }

  // 4. Check Single H1
  const h1Matches = [...content.matchAll(/<h1[^>]*>.*?<\/h1>/gis)];
  if (h1Matches.length === 0) {
    console.error(`[ERROR] Missing <h1> tag in ${rel}`);
    errors++;
  } else if (h1Matches.length > 1) {
    console.warn(`[WARN] Multiple <h1> tags (${h1Matches.length}) in ${rel}`);
    warnings++;
  }

  // 5. Check Structured Data
  if (!content.includes('application/ld+json')) {
    console.warn(`[WARN] Missing JSON-LD structured data in ${rel}`);
    warnings++;
  }

  passed++;
}

console.log("\n--------------------------------------------------");
console.log(`SEO Audit Completed: ${passed} files checked.`);
console.log(`Errors: ${errors}, Warnings: ${warnings}`);
console.log("--------------------------------------------------");

if (errors > 0) {
  process.exit(1);
} else {
  console.log("✅ All production pages passed SEO technical standards.");
}
