// Prerender the top 100 most-searched name pages as static HTML.
// Runs after `vite build`. Produces dist/name/<Name>/index.html for each
// name in the curated list so Googlebot can crawl & index without JS.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const SITE = "https://howmanyofme.co";

// Top 100 most-searched first names (US/UK/global blend).
const TOP_NAMES = [
  "James","Mary","Robert","Patricia","John","Jennifer","Michael","Linda","William","Elizabeth",
  "David","Barbara","Richard","Susan","Joseph","Jessica","Thomas","Sarah","Charles","Karen",
  "Christopher","Nancy","Daniel","Lisa","Matthew","Margaret","Anthony","Betty","Mark","Sandra",
  "Donald","Ashley","Steven","Dorothy","Paul","Kimberly","Andrew","Emily","Joshua","Donna",
  "Kenneth","Michelle","Kevin","Carol","Brian","Amanda","George","Melissa","Edward","Deborah",
  "Ronald","Stephanie","Timothy","Rebecca","Jason","Laura","Jeffrey","Helen","Ryan","Sharon",
  "Jacob","Cynthia","Gary","Kathleen","Nicholas","Amy","Eric","Shirley","Jonathan","Angela",
  "Stephen","Anna","Larry","Brenda","Justin","Pamela","Scott","Emma","Brandon","Nicole",
  "Benjamin","Samantha","Samuel","Katherine","Gregory","Christine","Frank","Debra","Alexander",
  "Rachel","Raymond","Carolyn","Patrick","Janet","Jack","Maria","Dennis","Catherine","Jerry",
  "Heather","Liam","Noah","Olivia","Sophia","Ava","Isabella","Charlotte","Mia","Amelia",
];

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const indexHtmlPath = path.join(distDir, "index.html");
if (!fs.existsSync(indexHtmlPath)) {
  console.error("[prerender] dist/index.html not found — run `vite build` first.");
  process.exit(1);
}
const baseHtml = fs.readFileSync(indexHtmlPath, "utf8");

let written = 0;
for (const name of TOP_NAMES) {
  const title = `How Many People Are Named ${name}? Popularity, Rarity & Origin`;
  const description = `Find out how many people are named ${name} worldwide. See ${name}'s popularity rank, decade-by-decade trend, regional distribution, and meaning. Free, no signup.`;
  const canonical = `${SITE}/name/${encodeURIComponent(name)}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: `Names: ${name.charAt(0)}`, item: `${SITE}/names/${name.charAt(0).toLowerCase()}` },
      { "@type": "ListItem", position: 3, name },
    ],
  };
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description: `Statistics, popularity, and origin for the first name ${name}.`,
  };

  // Pre-rendered crawler-visible content (the SPA hydrates over it).
  const prerenderBody = `
    <noscript-fallback>
      <nav aria-label="Breadcrumb"><a href="/">Home</a> &rsaquo; <a href="/names/${name.charAt(0).toLowerCase()}">Names: ${name.charAt(0)}</a> &rsaquo; <span>${escapeHtml(name)}</span></nav>
      <h1>How Many People Are Named ${escapeHtml(name)}?</h1>
      <p>${escapeHtml(description)}</p>
      <p><a href="${canonical}">View full ${escapeHtml(name)} statistics</a></p>
    </noscript-fallback>`;

  let html = baseHtml
    // title
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    // description
    .replace(/<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`)
    // og:title / og:description / twitter
    .replace(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);

  // Inject canonical + JSON-LD into <head> if missing
  const headInjections = [
    `<link rel="canonical" href="${canonical}" />`,
    `<script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(personJsonLd)}</script>`,
  ].join("\n    ");
  html = html.replace("</head>", `    ${headInjections}\n  </head>`);

  // Inject crawler-visible content right after <div id="root">
  html = html.replace('<div id="root">', `<div id="root">${prerenderBody}`);

  const outDir = path.join(distDir, "name", name);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  written += 1;
}

console.log(`[prerender] wrote ${written} static name pages`);
