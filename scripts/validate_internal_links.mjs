import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

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

// Build set of all generated route paths in dist/
const generatedRoutes = new Set();
for (const file of htmlFiles) {
  const rel = path.relative(distDir, file);
  let routePath = "/" + rel.replace(/\/index\.html$/, "").replace(/\.html$/, "");
  if (routePath === "/index") routePath = "/";
  generatedRoutes.add(routePath);
}

console.log(`Generated canonical routes in dist/: ${generatedRoutes.size}`);

// Link graph
const graph = new Map(); // route -> Set of hrefs
let totalInternalLinks = 0;
let brokenLinks = [];
let validLinksCount = 0;

// Also check anchor text
const anchorTypes = {
  naturalName: 0,
  directoryHub: 0,
  toolCta: 0,
  articleTitle: 0,
  navFooter: 0,
};

for (const file of htmlFiles) {
  const rel = path.relative(distDir, file);
  let sourceRoute = "/" + rel.replace(/\/index\.html$/, "").replace(/\.html$/, "");
  if (sourceRoute === "/index") sourceRoute = "/";

  const html = fs.readFileSync(file, "utf8");
  const linkMatches = [...html.matchAll(/<a\s+[^>]*href="([^"#?]+)"[^>]*>(.*?)<\/a>/gis)];

  const dests = new Set();

  for (const match of linkMatches) {
    const href = match[1];
    const text = match[2].replace(/<[^>]+>/g, "").trim();

    if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/_astro")) {
      totalInternalLinks++;
      dests.add(href);

      // Check validity: exists in dist/ or is a known Vite route
      // Known routes during migration: /tools/..., /blog/..., /similar-names/..., /about, /privacy, etc.
      const existsInDist = generatedRoutes.has(href);
      const isKnownRoute =
        existsInDist ||
        href.startsWith("/tools/") ||
        href.startsWith("/blog/") ||
        href.startsWith("/similar-names") ||
        [
          "/about",
          "/privacy",
          "/terms",
          "/disclaimer",
          "/contact",
          "/methodology",
          "/tools",
          "/blog",
        ].includes(href);

      if (isKnownRoute) {
        validLinksCount++;
      } else {
        brokenLinks.push({ source: sourceRoute, target: href, text });
      }
    }
  }

  graph.set(sourceRoute, dests);
}

// Compute crawl depth starting from "/"
const depthMap = new Map();
const queue = [{ route: "/", depth: 0 }];
depthMap.set("/", 0);

while (queue.length > 0) {
  const { route, depth } = queue.shift();
  const neighbors = graph.get(route) || new Set();

  for (const next of neighbors) {
    if (generatedRoutes.has(next) && !depthMap.has(next)) {
      depthMap.set(next, depth + 1);
      queue.push({ route: next, depth: depth + 1 });
    }
  }
}

// Classify crawl depths of generated routes
const depthBuckets = { 0: 0, 1: 0, 2: 0, 3: 0, "4+": 0, unreachable: 0 };

for (const route of generatedRoutes) {
  const d = depthMap.get(route);
  if (d === undefined) {
    depthBuckets.unreachable++;
  } else if (d === 0) {
    depthBuckets[0]++;
  } else if (d === 1) {
    depthBuckets[1]++;
  } else if (d === 2) {
    depthBuckets[2]++;
  } else if (d === 3) {
    depthBuckets[3]++;
  } else {
    depthBuckets["4+"]++;
  }
}

console.log("\n=== INTERNAL LINK VALIDATION REPORT ===");
console.log(`Total internal links audited: ${totalInternalLinks}`);
console.log(`Valid internal links: ${validLinksCount}`);
console.log(`Broken internal links: ${brokenLinks.length}`);
if (brokenLinks.length > 0) {
  console.log("Broken links sample:", brokenLinks.slice(0, 5));
}

console.log("\n=== CRAWL DEPTH DISTRIBUTION (from Homepage '/') ===");
console.log(`Depth 0 (Homepage): ${depthBuckets[0]}`);
console.log(`Depth 1 (Directly linked from Homepage): ${depthBuckets[1]}`);
console.log(`Depth 2 (2 clicks from Homepage, e.g. Home -> /names/[letter] -> /name/[Name]): ${depthBuckets[2]}`);
console.log(`Depth 3 (3 clicks): ${depthBuckets[3]}`);
console.log(`Depth 4+: ${depthBuckets["4+"]}`);
console.log(`Unreachable from Homepage: ${depthBuckets.unreachable}`);
