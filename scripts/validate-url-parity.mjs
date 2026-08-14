import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

// 1. Gather all canonical names from generated dataset
const canonicalNames = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/generated/canonical-names.json"), "utf8")
);
const names = canonicalNames.map((n) => n.name);

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

const blogSrc = fs.readFileSync(path.join(root, "src/data/blogData.ts"), "utf8");
const blogSlugs = [...blogSrc.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);

const tools = [
  "popularity-checker",
  "random-name",
  "baby-names",
  "username-generator",
  "name-comparison",
  "trend-visualizer",
  "unique-name-generator",
  "popularity-guide",
  "meaning",
];

const pillars = ["about", "methodology", "data", "research/name-popularity-by-decade", "contact", "privacy", "terms", "disclaimer", "tools", "blog", "similar-names"];

// Build expected core SEO routes
const expectedRoutes = new Set();
expectedRoutes.add("/");
for (const n of names) {
  expectedRoutes.add(`/name/${n}`);
  expectedRoutes.add(`/similar-names/${n.toLowerCase()}`);
}
const fullNamesFile = path.join(root, "src/data/generated/canonical-fullnames.json");
if (fs.existsSync(fullNamesFile)) {
  const fullNames = JSON.parse(fs.readFileSync(fullNamesFile, "utf8"));
  for (const fn of fullNames) {
    expectedRoutes.add(`/people/${fn.slug}`);
  }
}
for (const l of letters) {
  expectedRoutes.add(`/names/${l}`);
}
for (const t of tools) {
  expectedRoutes.add(`/tools/${t}`);
}
for (const p of pillars) {
  expectedRoutes.add(`/${p}`);
}
for (const s of blogSlugs) {
  expectedRoutes.add(`/blog/${s}`);
}
const surnamesFile = path.join(root, "src/data/generated/canonical-surnames.json");
if (fs.existsSync(surnamesFile)) {
  expectedRoutes.add("/last-names");
  const surnames = JSON.parse(fs.readFileSync(surnamesFile, "utf8"));
  for (const s of surnames) {
    expectedRoutes.add(`/last-name/${s.slug}`);
  }
}
const comparisonSlugs = [
  "liam-vs-noah", "emma-vs-olivia", "james-vs-william", "sophia-vs-isabella",
  "lucas-vs-oliver", "mia-vs-charlotte", "benjamin-vs-henry", "grace-vs-harper",
  "elijah-vs-mateo", "alexander-vs-daniel", "michael-vs-david", "mary-vs-patricia",
  "robert-vs-john", "jennifer-vs-linda", "ethan-vs-logan", "evelyn-vs-abigail",
  "jacob-vs-mason", "ava-vs-ella", "jack-vs-leo", "harper-vs-emily"
];
for (const c of comparisonSlugs) {
  expectedRoutes.add(`/name-comparison/${c}`);
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
  if (rel.includes("googlebe8b9a62790246a0.html") || rel === "404.html" || rel.includes("404/index.html") || rel.startsWith("embed/")) continue;
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
console.log(`Expected Production Routes: ${expectedRoutes.size}`);
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
