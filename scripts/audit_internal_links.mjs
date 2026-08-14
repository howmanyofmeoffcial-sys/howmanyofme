import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

// Read all HTML files in dist/
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
console.log(`Found ${htmlFiles.length} HTML files in dist/`);

// Map of page URL -> Set of outgoing hrefs
const outgoingMap = new Map();
// Map of page URL -> Set of incoming source URLs
const incomingMap = new Map();

// Map of canonical name -> stats
const namePages = new Set();

for (const file of htmlFiles) {
  const rel = path.relative(distDir, file);
  let routePath = "/" + rel.replace(/\/index\.html$/, "").replace(/\.html$/, "");
  if (routePath === "/index") routePath = "/";

  if (routePath.startsWith("/name/")) {
    const name = routePath.replace("/name/", "");
    namePages.add(name);
  }

  const html = fs.readFileSync(file, "utf8");
  // Extract all hrefs
  const hrefMatches = [...html.matchAll(/href="([^"#?]+)"/g)].map((m) => m[1]);
  const localHrefs = hrefMatches.filter(
    (h) => h.startsWith("/") && !h.startsWith("//") && !h.startsWith("/_astro")
  );

  outgoingMap.set(routePath, new Set(localHrefs));

  for (const dest of localHrefs) {
    if (!incomingMap.has(dest)) {
      incomingMap.set(dest, new Set());
    }
    incomingMap.get(dest).add(routePath);
  }
}

console.log(`Total name pages found: ${namePages.size}`);

// Audit incoming links to /name/[name]
let zeroIncoming = [];
let oneIncoming = [];
let twoToFiveIncoming = [];
let sixPlusIncoming = [];

for (const name of namePages) {
  const pathUrl = `/name/${name}`;
  const incoming = incomingMap.get(pathUrl) || new Set();
  const count = incoming.size;

  if (count === 0) {
    zeroIncoming.push(name);
  } else if (count === 1) {
    oneIncoming.push(name);
  } else if (count >= 2 && count <= 5) {
    twoToFiveIncoming.push(name);
  } else {
    sixPlusIncoming.push(name);
  }
}

console.log("\n=== INCOMING INTERNAL LINK AUDIT FOR /name/[name] ===");
console.log(`Total Name Pages: ${namePages.size}`);
console.log(`0 incoming links (Orphans): ${zeroIncoming.length}`);
console.log(`1 incoming link: ${oneIncoming.length}`);
console.log(`2-5 incoming links: ${twoToFiveIncoming.length}`);
console.log(`6+ incoming links: ${sixPlusIncoming.length}`);

if (zeroIncoming.length > 0) {
  console.log("\nSample orphan names (0 incoming):", zeroIncoming.slice(0, 10));
}
if (oneIncoming.length > 0) {
  console.log("Sample 1-incoming names:", oneIncoming.slice(0, 10));
}

// Homepage outgoing links to names
const homeOutgoing = outgoingMap.get("/") || new Set();
const homeNameLinks = [...homeOutgoing].filter((h) => h.startsWith("/name/"));
console.log(`\nHomepage links to /name/: ${homeNameLinks.length}`);
