// Build-time sitemap generator & SEO Indexability Validator.
// Synchronously triggered after production build to write dist/sitemap.xml and public/sitemap.xml
// Guarantees only verified, canonical, indexable URLs are emitted.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  evaluateNameIndexability,
  auditNamesIndexability,
  evaluateSimilarNamesIndexability,
  auditSimilarNamesIndexability,
  BLOCKED_NAME_ENTITIES,
} from "../src/lib/seo/indexability.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const SITE = "https://howmanyofme.co";
const today = new Date().toISOString().slice(0, 10);

// 1. Audit and filter canonical names using centralized indexability engine
const canonicalNamesFile = path.join(root, "src/data/generated/canonical-names.json");
const rawCanonicalNames = JSON.parse(fs.readFileSync(canonicalNamesFile, "utf8"));
const nameIndexabilityAudit = auditNamesIndexability(rawCanonicalNames);

// Filter names strictly by INDEX status for /name/[name]
const indexableNameRecords = rawCanonicalNames.filter(
  (n) => evaluateNameIndexability(n).status === "INDEX"
);
const indexableNames = indexableNameRecords.map((n) => n.name).sort();

// 2. Audit and filter Similar Names strictly by INDEX status
const similarIndexabilityAudit = auditSimilarNamesIndexability(rawCanonicalNames);
const indexableSimilarNames = rawCanonicalNames
  .filter((n) => evaluateSimilarNamesIndexability(n).status === "INDEX")
  .map((n) => n.name)
  .sort();

// 3. Extract blog slugs
const blogSrc = fs.readFileSync(path.join(root, "src/data/blogData.ts"), "utf8");
const blogSlugs = [...blogSrc.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);

// 4. Full names
const fullNamesFile = path.join(root, "src/data/generated/canonical-fullnames.json");
const allFullNames = fs.existsSync(fullNamesFile) ? JSON.parse(fs.readFileSync(fullNamesFile, "utf8")) : [];

// 5. Alphabet
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

// 6. Tools
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

// 7. Pillar pages
const pillars = [
  "",
  "blog",
  "tools",
  "about",
  "methodology",
  "data",
  "research/name-popularity-by-decade",
  "contact",
  "privacy",
  "terms",
  "disclaimer",
];

const urls = [];
let legacyCount = 0;
let malformedCount = 0;

const push = (loc, priority, changefreq) => {
  // Validate URL format
  if (!loc || typeof loc !== "string" || !loc.startsWith("/")) {
    malformedCount++;
    return;
  }

  // Check for blocked/legacy patterns
  const lowerLoc = loc.toLowerCase();
  for (const blocked of BLOCKED_NAME_ENTITIES) {
    if (lowerLoc === `/name/${blocked}` || lowerLoc === `/similar-names/${blocked}`) {
      legacyCount++;
      return;
    }
  }

  if (loc.includes("//") || loc.includes("https:") || loc.includes(".html")) {
    malformedCount++;
    return;
  }

  urls.push({ loc: `${SITE}${loc}`, priority, changefreq, path: loc });
};

// Populate sitemap entries
pillars.forEach((p) => push(`/${p}`, p === "" ? "1.0" : "0.8", "weekly"));
tools.forEach((t) => push(`/tools/${t}`, "0.8", "monthly"));
alphabet.forEach((l) => push(`/names/${l}`, "0.6", "monthly"));

// Name pages (indexable only)
indexableNames.forEach((n) => push(`/name/${n}`, "0.7", "monthly"));

// Similar names pages (Hub + INDEX cohort only)
push(`/similar-names`, "0.8", "weekly");
indexableSimilarNames.forEach((n) => push(`/similar-names/${n.toLowerCase()}`, "0.6", "monthly"));

// People pages
allFullNames.forEach((fn) => push(`/people/${fn.slug}`, "0.6", "monthly"));

// Blog posts
blogSlugs.forEach((s) => push(`/blog/${s}`, "0.7", "monthly"));

// Surnames
const surnamesFile = path.join(root, "src/data/generated/canonical-surnames.json");
let surnamesCount = 0;
if (fs.existsSync(surnamesFile)) {
  push(`/last-names`, "0.8", "weekly");
  const surnames = JSON.parse(fs.readFileSync(surnamesFile, "utf8"));
  surnamesCount = surnames.length;
  surnames.forEach((s) => push(`/last-name/${s.slug}`, "0.7", "monthly"));
}

// Name Comparisons
const comparisonSlugs = [
  "liam-vs-noah", "emma-vs-olivia", "james-vs-william", "sophia-vs-isabella",
  "lucas-vs-oliver", "mia-vs-charlotte", "benjamin-vs-henry", "grace-vs-harper",
  "elijah-vs-mateo", "alexander-vs-daniel", "michael-vs-david", "mary-vs-patricia",
  "robert-vs-john", "jennifer-vs-linda", "ethan-vs-logan", "evelyn-vs-abigail",
  "jacob-vs-mason", "ava-vs-ella", "jack-vs-leo", "harper-vs-emily"
];
comparisonSlugs.forEach((slug) => push(`/name-comparison/${slug}`, "0.7", "monthly"));

// Deduplication
const seen = new Set();
let duplicateCount = 0;
const unique = [];

for (const u of urls) {
  if (seen.has(u.loc)) {
    duplicateCount++;
  } else {
    seen.add(u.loc);
    unique.push(u);
  }
}

// Generate XML
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  unique
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;

const distDir = path.join(root, "dist");
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml);
fs.writeFileSync(path.join(root, "public/sitemap.xml"), xml);

// Build-time SEO & Indexability Report
console.log("\n==================================================");
console.log("SEO Indexability Report");
console.log("==================================================");
console.log(`First-Name Records: Total=${nameIndexabilityAudit.total} | INDEX=${nameIndexabilityAudit.indexedCount} | NOINDEX=${nameIndexabilityAudit.noindexCount} | EXCLUDE=${nameIndexabilityAudit.excludedCount}`);
console.log(`Similar-Name Pages: Total=${similarIndexabilityAudit.total} | INDEX=${similarIndexabilityAudit.indexedCount} | NOINDEX=${similarIndexabilityAudit.noindexCount} | EXCLUDE=${similarIndexabilityAudit.excludedCount}`);
console.log("\nSitemap URLs Summary:");
console.log(`  Name pages (/name/*): ${indexableNames.length}`);
console.log(`  Similar pages (/similar-names/*): ${indexableSimilarNames.length} entity pages + 1 hub`);
console.log(`  Full name pages (/people/*): ${allFullNames.length}`);
console.log(`  Last name pages (/last-name/*): ${surnamesCount > 0 ? surnamesCount + 1 : 0}`);
console.log(`  Comparisons (/name-comparison/*): ${comparisonSlugs.length}`);
console.log(`  Tools (/tools/*): ${tools.length}`);
console.log(`  Pillars & Alphabet: ${pillars.length + alphabet.length}`);
console.log(`  Blog posts (/blog/*): ${blogSlugs.length}`);
console.log(`  Total emitted URLs: ${unique.length}`);
console.log(`  Legacy URLs emitted: ${legacyCount}`);
console.log(`  Duplicates: ${duplicateCount}`);
console.log(`  Malformed URLs: ${malformedCount}`);
console.log("==================================================\n");

if (duplicateCount > 0 || malformedCount > 0 || legacyCount > 0) {
  console.error("❌ Sitemap consistency check failed with structural errors.");
  process.exit(1);
} else {
  console.log("✅ Sitemap generated and verified successfully.");
}
