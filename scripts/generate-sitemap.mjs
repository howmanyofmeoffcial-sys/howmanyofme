// Build-time sitemap generator.
// Runs after `vite build` and writes dist/sitemap.xml
// Only high-quality, indexable URLs are included.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const SITE = "https://howmanyofme.co";
const today = new Date().toISOString().slice(0, 10);

// Extract slugs from blogData.ts (simple regex — good enough for our static data)
const blogSrc = fs.readFileSync(path.join(root, "src/data/blogData.ts"), "utf8");
const blogSlugs = [...blogSrc.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);

// Popular names — pull from the POPULAR_NAMES map
const nameSrc = fs.readFileSync(path.join(root, "src/data/nameData.ts"), "utf8");
const popularNames = [...nameSrc.matchAll(/^\s{2}"?([A-Z][a-zA-Z]+)"?:\s*\{\s*count:/gm)].map(
  (m) => m[1],
);
// Extended names list (for /name/ URLs) — capture entries inside EXTENDED_NAMES arrays
const extendedBlocks = [...nameSrc.matchAll(/"([A-Z][a-zA-Z]+)"/g)].map((m) => m[1]);
const allNames = Array.from(new Set([...popularNames, ...extendedBlocks])).filter(
  (n) => n.length > 1 && /^[A-Z][a-z]+$/.test(n),
);

// Alphabet
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

// Tools
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

// Pillar pages
const pillars = ["", "blog", "tools", "about", "methodology"];

const urls = [];
const push = (loc, priority, changefreq) =>
  urls.push({ loc: `${SITE}${loc}`, priority, changefreq });

pillars.forEach((p) => push(`/${p}`, p === "" ? "1.0" : "0.8", "weekly"));
tools.forEach((t) => push(`/tools/${t}`, "0.8", "monthly"));
alphabet.forEach((l) => push(`/names/${l}`, "0.6", "monthly"));
allNames.forEach((n) => push(`/name/${n}`, "0.7", "monthly"));
push(`/similar-names`, "0.8", "weekly");
allNames.forEach((n) => push(`/similar-names/${n.toLowerCase()}`, "0.6", "monthly"));
blogSlugs.forEach((s) => push(`/blog/${s}`, "0.7", "monthly"));

// De-dupe
const seen = new Set();
const unique = urls.filter((u) => (seen.has(u.loc) ? false : seen.add(u.loc)));

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
// Also write to public/ so dev preview serves it
fs.writeFileSync(path.join(root, "public/sitemap.xml"), xml);

console.log(`[sitemap] wrote ${unique.length} urls`);
