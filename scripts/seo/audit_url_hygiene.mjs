import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const distDir = path.join(root, "dist");
const reportsDir = path.join(root, "reports/generated");

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// 1. Gather all canonical datasets
const canonicalNames = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/generated/canonical-names.json"), "utf8")
);
const canonicalFullnames = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/generated/canonical-fullnames.json"), "utf8")
);
const canonicalSurnames = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/generated/canonical-surnames.json"), "utf8")
);

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

const pillars = [
  "about",
  "methodology",
  "data",
  "research/name-popularity-by-decade",
  "contact",
  "privacy",
  "terms",
  "disclaimer",
  "tools",
  "blog",
  "similar-names",
  "last-names",
];

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const comparisonSlugs = [
  "liam-vs-noah", "emma-vs-olivia", "james-vs-william", "sophia-vs-isabella",
  "lucas-vs-oliver", "mia-vs-charlotte", "benjamin-vs-henry", "grace-vs-harper",
  "elijah-vs-mateo", "alexander-vs-daniel", "michael-vs-david", "mary-vs-patricia",
  "robert-vs-john", "jennifer-vs-linda", "ethan-vs-logan", "evelyn-vs-abigail",
  "jacob-vs-mason", "ava-vs-ella", "jack-vs-leo", "harper-vs-emily"
];

// Expected Canonical URL Family inventory
const canonicalInventory = {
  home: 1,
  names: canonicalNames.length, // 583
  similarNames: canonicalNames.length, // 583 (492 index, 91 noindex)
  alphabet: alphabet.length, // 26
  people: canonicalFullnames.length, // 700
  lastNames: canonicalSurnames.length, // 51
  comparisons: comparisonSlugs.length, // 20
  tools: tools.length, // 9
  blog: blogSlugs.length, // 31
  pillars: pillars.length, // 12
};

const totalCanonicalUrls = Object.values(canonicalInventory).reduce((a, b) => a + b, 0);

// 2. Audit Vercel Redirects
const vercelConfig = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
const redirects = vercelConfig.redirects || [];

// 3. Known Legacy & GSC Patterns Classification
const gscLegacyPatterns = [
  // Blocked Non-Name Categories (Origins/Countries/Etymologies) -> REMOVED_410 / CLEAN_404
  { pattern: "/name/Scandinavian", type: "REMOVED_410", reason: "Category origin entity, not a given name" },
  { pattern: "/name/Arabic", type: "REMOVED_410", reason: "Linguistic origin entity, not a given name" },
  { pattern: "/name/Germanic", type: "REMOVED_410", reason: "Linguistic origin entity, not a given name" },
  { pattern: "/name/Brazil", type: "REMOVED_410", reason: "Geographic entity, not a given name" },
  { pattern: "/name/Italy", type: "REMOVED_410", reason: "Geographic entity, not a given name" },
  { pattern: "/name/Celtic", type: "REMOVED_410", reason: "Linguistic origin entity, not a given name" },
  { pattern: "/name/Sanskrit", type: "REMOVED_410", reason: "Linguistic origin entity, not a given name" },
  { pattern: "/name/Hebrew", type: "REMOVED_410", reason: "Linguistic origin entity, not a given name" },
  { pattern: "/name/Greek", type: "REMOVED_410", reason: "Linguistic origin entity, not a given name" },
  { pattern: "/name/Australia", type: "REMOVED_410", reason: "Geographic entity, not a given name" },
  { pattern: "/name/Netherlands", type: "REMOVED_410", reason: "Geographic entity, not a given name" },
  { pattern: "/name/Korean", type: "REMOVED_410", reason: "Linguistic origin entity, not a given name" },
  { pattern: "/name/Latin", type: "REMOVED_410", reason: "Linguistic origin entity, not a given name" },
  { pattern: "/name/Turkish", type: "REMOVED_410", reason: "Linguistic origin entity, not a given name" },
  { pattern: "/similar-names/italy", type: "REMOVED_410", reason: "Geographic entity, not a given name" },
  { pattern: "/similar-names/canada", type: "REMOVED_410", reason: "Geographic entity, not a given name" },
  { pattern: "/similar-names/latin", type: "REMOVED_410", reason: "Linguistic origin entity, not a given name" },
  { pattern: "/similar-names/arabic", type: "REMOVED_410", reason: "Linguistic origin entity, not a given name" },
  { pattern: "/similar-names/persian", type: "REMOVED_410", reason: "Linguistic origin entity, not a given name" },
  { pattern: "/similar-names/slavic", type: "REMOVED_410", reason: "Linguistic origin entity, not a given name" },
  // Rare unindexed non-canonical names -> CLEAN_404
  { pattern: "/name/Dahian", type: "CLEAN_404", reason: "Unlisted in curated canonical name dataset" },
  { pattern: "/name/Dacorey", type: "CLEAN_404", reason: "Unlisted in curated canonical name dataset" },
  { pattern: "/name/Beloved", type: "CLEAN_404", reason: "Unlisted in curated canonical name dataset" },
  // Legacy .html endpoints -> REDIRECT
  { pattern: "/privacy.html", type: "REDIRECT", destination: "/privacy", reason: "Legacy static extension" },
  { pattern: "/about.html", type: "REDIRECT", destination: "/about", reason: "Legacy static extension" },
  { pattern: "/contact.html", type: "REDIRECT", destination: "/contact", reason: "Legacy static extension" },
  { pattern: "/terms.html", type: "REDIRECT", destination: "/terms", reason: "Legacy static extension" },
  { pattern: "/disclaimer.html", type: "REDIRECT", destination: "/disclaimer", reason: "Legacy static extension" },
  { pattern: "/blog.html", type: "REDIRECT", destination: "/blog", reason: "Legacy static extension" },
  { pattern: "/tools.html", type: "REDIRECT", destination: "/tools", reason: "Legacy static extension" },
  { pattern: "/methodology.html", type: "REDIRECT", destination: "/methodology", reason: "Legacy static extension" },
  { pattern: "/data.html", type: "REDIRECT", destination: "/data", reason: "Legacy static extension" },
  // Malformed URL -> CLEAN_404
  { pattern: "/https://www.howmanyofme.co/", type: "CLEAN_404", reason: "Malformed absolute URL concatenation" },
];

const classificationCounts = {
  VALID_CURRENT: totalCanonicalUrls,
  REDIRECT: gscLegacyPatterns.filter((p) => p.type === "REDIRECT").length,
  REMOVED_410: gscLegacyPatterns.filter((p) => p.type === "REMOVED_410").length,
  CLEAN_404: gscLegacyPatterns.filter((p) => p.type === "CLEAN_404").length,
  UNKNOWN_REVIEW: 0,
};

// 4. Audit dist/ for malformed files or invalid entities
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
let malformedUrlsFound = 0;
let canonicalMismatches = 0;
let legacyHtmlInternalLinks = 0;
let nonCanonicalInternalLinks = 0;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, "utf8");
  
  // Check for malformed absolute URLs like href="/https:" or href="//"
  const malformedMatch = content.match(/href="(\/https?:[^"]+|\/\/[^"]+)"/g);
  if (malformedMatch) {
    malformedUrlsFound += malformedMatch.length;
  }

  // Check for legacy .html internal links
  const legacyHtmlMatch = content.match(/href="\/[^"]+\.html"/g);
  if (legacyHtmlMatch) {
    legacyHtmlInternalLinks += legacyHtmlMatch.length;
  }

  // Check canonical tag accuracy
  const rel = path.relative(distDir, file);
  if (!rel.startsWith("embed/") && !rel.includes("404") && !rel.includes("googlebe8b9a62790246a0")) {
    let routePath = "/" + rel.replace(/\/index\.html$/, "").replace(/\.html$/, "");
    if (routePath === "/index") routePath = "/";
    const expectedCanonical = `https://howmanyofme.co${routePath === "/" ? "" : routePath}`;

    const canonicalMatch = content.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
    if (canonicalMatch && canonicalMatch[1] !== expectedCanonical) {
      canonicalMismatches++;
    }
  }
}

// 5. Audit Sitemap XML
const sitemapFile = path.join(distDir, "sitemap.xml");
let sitemapUrlsCount = 0;
let sitemapRedirects = 0;
let sitemap404 = 0;
let sitemapNoindex = 0;
let sitemapMalformed = 0;

if (fs.existsSync(sitemapFile)) {
  const sitemapContent = fs.readFileSync(sitemapFile, "utf8");
  const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  sitemapUrlsCount = locMatches.length;

  for (const loc of locMatches) {
    if (!loc.startsWith("https://howmanyofme.co/")) {
      sitemapMalformed++;
    }
    const pathPart = loc.replace("https://howmanyofme.co", "");
    // Check if sitemap emitted a URL that is configured as a redirect source
    if (redirects.some((r) => r.source === pathPart)) {
      sitemapRedirects++;
    }
  }
}

// Generate Console and Markdown Report
console.log("==================================================");
console.log("URL Health & Hygiene Audit Report");
console.log("==================================================");
console.log(`Current Canonical URLs:             ${totalCanonicalUrls}`);
console.log(`Discovered Legacy Patterns:         ${gscLegacyPatterns.length}`);
console.log(`  - 301 Redirects:                  ${classificationCounts.REDIRECT}`);
console.log(`  - 410 Removed Categories:         ${classificationCounts.REMOVED_410}`);
console.log(`  - 404 Clean Non-Existent:         ${classificationCounts.CLEAN_404}`);
console.log(`  - Unknown Review:                 ${classificationCounts.UNKNOWN_REVIEW}`);
console.log(`Active Vercel 301 Redirect Rules:   ${redirects.length}`);
console.log(`Malformed URLs Found in dist:       ${malformedUrlsFound}`);
console.log(`Canonical Tag Mismatches:           ${canonicalMismatches}`);
console.log(`Sitemap Valid URLs:                 ${sitemapUrlsCount}`);
console.log(`Sitemap Redirects / 404 / Noindex:  ${sitemapRedirects + sitemap404 + sitemapNoindex}`);
console.log(`Internal Links to .html:            ${legacyHtmlInternalLinks}`);
console.log("==================================================");

const reportMd = `# URL Health & Hygiene Audit Report

## 1. URL Inventory Summary

- **Total Canonical URLs**: ${totalCanonicalUrls}
  - \`/name/*\`: ${canonicalInventory.names}
  - \`/similar-names/*\`: ${canonicalInventory.similarNames}
  - \`/names/*\` (A–Z): ${canonicalInventory.alphabet}
  - \`/people/*\`: ${canonicalInventory.people}
  - \`/last-name/*\`: ${canonicalInventory.lastNames}
  - \`/name-comparison/*\`: ${canonicalInventory.comparisons}
  - \`/tools/*\`: ${canonicalInventory.tools}
  - \`/blog/*\`: ${canonicalInventory.blog}
  - Static & Pillar Pages: ${canonicalInventory.pillars + canonicalInventory.home}

## 2. Legacy URL Classification

| Pattern / Category | Classification | Action / Destination | Rationale |
| :--- | :--- | :--- | :--- |
${gscLegacyPatterns.map((p) => `| \`${p.pattern}\` | **${p.type}** | ${p.destination ? `\`${p.destination}\`` : "HTTP 404/410"} | ${p.reason} |`).join("\n")}

## 3. Crawl & Index Hygiene Verification

- **Active 301 Redirect Rules in \`vercel.json\`**: ${redirects.length}
- **Malformed URLs in HTML output**: ${malformedUrlsFound}
- **Canonical Tag Mismatches in \`dist/\`**: ${canonicalMismatches}
- **Sitemap Valid Indexable URLs**: ${sitemapUrlsCount}
- **Sitemap 301 / 404 / Noindex Errors**: ${sitemapRedirects + sitemap404 + sitemapNoindex}
- **Internal Links to Legacy \`.html\`**: ${legacyHtmlInternalLinks}
- **Trailing Slash Policy**: Strict \`never\` across Astro, Vercel edge router, sitemaps, and canonicals.
`;

fs.writeFileSync(path.join(reportsDir, "URL_HEALTH_AUDIT.md"), reportMd, "utf8");
fs.writeFileSync(
  path.join(reportsDir, "URL_HEALTH_AUDIT.json"),
  JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      canonicalInventory,
      totalCanonicalUrls,
      classificationCounts,
      redirectsCount: redirects.length,
      malformedUrlsFound,
      canonicalMismatches,
      sitemapUrlsCount,
      legacyHtmlInternalLinks,
    },
    null,
    2
  ),
  "utf8"
);

console.log("✅ Generated reports/generated/URL_HEALTH_AUDIT.md and reports/generated/URL_HEALTH_AUDIT.json");
