import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

// 1. Gather all canonical names from nameData.ts
const nameDataContent = fs.readFileSync(path.join(root, "src/data/nameData.ts"), "utf8");
const prefixMatch = nameDataContent.match(/const COMMON_PREFIXES: Record<string, string\[\]> = \{([\s\S]*?)\n\};/);
const names = Array.from(
  new Set([...prefixMatch[1].matchAll(/"([A-Za-z]+)"/g)].map((m) => m[1]))
);

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

// Build expected core SEO routes
const expectedRoutes = new Set();
expectedRoutes.add("/");
for (const n of names) {
  expectedRoutes.add(`/name/${n}`);
}
for (const l of letters) {
  expectedRoutes.add(`/names/${l}`);
}

// 2. Gather actual generated routes in dist/
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
const actualRoutes = new Set();
const canonicalMismatches = [];

for (const file of htmlFiles) {
  const rel = path.relative(distDir, file);
  let routePath = "/" + rel.replace(/\/index\.html$/, "").replace(/\.html$/, "");
  if (routePath === "/index") routePath = "/";
  actualRoutes.add(routePath);

  // Inspect canonical in HTML
  const html = fs.readFileSync(file, "utf8");
  const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
  if (canonicalMatch) {
    const canonicalUrl = canonicalMatch[1];
    const expectedCanonical = `https://howmanyofme.co${routePath === "/" ? "" : routePath}`;
    if (canonicalUrl !== expectedCanonical) {
      canonicalMismatches.push({
        route: routePath,
        found: canonicalUrl,
        expected: expectedCanonical,
      });
    }
  }
}

// Compare
const matched = [];
const missing = [];
const unexpected = [];

for (const exp of expectedRoutes) {
  if (actualRoutes.has(exp)) {
    matched.push(exp);
  } else {
    missing.push(exp);
  }
}

for (const act of actualRoutes) {
  if (!expectedRoutes.has(act)) {
    unexpected.push(act);
  }
}

console.log("=== URL PARITY & CANONICAL VALIDATION REPORT ===");
console.log(`Expected Core Production Routes: ${expectedRoutes.size}`);
console.log(`Actual Generated Routes in dist/: ${actualRoutes.size}`);
console.log(`Exact Matched Canonical Routes: ${matched.length}`);
console.log(`Missing Routes from Astro: ${missing.length}`);
console.log(`Unexpected Extra Routes: ${unexpected.length}`);
console.log(`Canonical Tag Mismatches: ${canonicalMismatches.length}`);

if (missing.length > 0) {
  console.log("\n[!] Missing Routes:", missing);
}
if (unexpected.length > 0) {
  console.log("\n[i] Unexpected Routes in dist/:", unexpected);
}
if (canonicalMismatches.length > 0) {
  console.log("\n[!] Canonical Mismatches:", canonicalMismatches);
}
