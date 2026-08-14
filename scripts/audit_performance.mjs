import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const astroDir = path.join(distDir, "_astro");

// 1. Audit HTML page sizes
const pagesToMeasure = [
  { name: "Homepage", path: path.join(distDir, "index.html") },
  { name: "Popular Name (/name/James)", path: path.join(distDir, "name/James/index.html") },
  { name: "Medium Name (/name/Logan)", path: path.join(distDir, "name/Logan/index.html") },
  { name: "Uncommon Name (/name/Uma)", path: path.join(distDir, "name/Uma/index.html") },
  { name: "Directory Hub (/names/a)", path: path.join(distDir, "names/a/index.html") },
];

console.log("=== HTML DOCUMENT SIZES ===");
const htmlSizes = [];
for (const p of pagesToMeasure) {
  if (fs.existsSync(p.path)) {
    const stat = fs.statSync(p.path);
    const sizeKB = (stat.size / 1024).toFixed(2);
    const html = fs.readFileSync(p.path, "utf8");
    const scriptTags = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
    const linkCss = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);

    htmlSizes.push({
      page: p.name,
      sizeKB: `${sizeKB} KB`,
      scriptsCount: scriptTags.length,
      stylesheetsCount: linkCss.length,
    });
  }
}
console.table(htmlSizes);

// 2. Audit Client JS and CSS bundles in dist/_astro
console.log("\n=== STATIC ASSETS BUNDLE BREAKDOWN (_astro) ===");
let totalJsBytes = 0;
let totalCssBytes = 0;
const assetFiles = [];

if (fs.existsSync(astroDir)) {
  const files = fs.readdirSync(astroDir);
  for (const f of files) {
    const fullPath = path.join(astroDir, f);
    const stat = fs.statSync(fullPath);
    const sizeKB = (stat.size / 1024).toFixed(2);

    if (f.endsWith(".js")) {
      totalJsBytes += stat.size;
      assetFiles.push({ file: f, type: "JavaScript", sizeKB: `${sizeKB} KB`, rawSize: stat.size });
    } else if (f.endsWith(".css")) {
      totalCssBytes += stat.size;
      assetFiles.push({ file: f, type: "CSS", sizeKB: `${sizeKB} KB`, rawSize: stat.size });
    }
  }
}

assetFiles.sort((a, b) => b.rawSize - a.rawSize);
console.table(assetFiles);

console.log(`Total Client JS in dist/_astro: ${(totalJsBytes / 1024).toFixed(2)} KB`);
console.log(`Total CSS in dist/_astro: ${(totalCssBytes / 1024).toFixed(2)} KB`);

// 3. Check React Island hydration directives across Astro templates
console.log("\n=== REACT ISLAND HYDRATION DIRECTIVES ===");
const astroPages = [
  "src/pages/index.astro",
  "src/pages/name/[name].astro",
  "src/pages/names/[letter].astro",
];

for (const ap of astroPages) {
  const fullPath = path.join(root, ap);
  if (fs.existsSync(fullPath)) {
    const code = fs.readFileSync(fullPath, "utf8");
    const islandMatches = [...code.matchAll(/<([A-Z][A-Za-z0-9]+)\s+client:([a-z]+)/g)];
    console.log(`Page: ${ap}`);
    if (islandMatches.length === 0) {
      console.log("  No React islands (100% static HTML)");
    } else {
      islandMatches.forEach((m) => {
        console.log(`  - Island: <${m[1]} client:${m[2]}>`);
      });
    }
  }
}
