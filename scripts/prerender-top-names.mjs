// Prerender static HTML snapshots for crawlers (Googlebot, AdsBot, GPTBot…).
// Runs after `vite build`. Produces dist/<route>/index.html for:
//   • the top 100 first-name pages (/name/<Name>)
//   • all 9 tool pages (/tools/<slug>)
//   • the similar-names index + top-100 detail pages (/similar-names/<name>)
//   • core static pages (/about, /methodology, /tools, /blog, /privacy, /terms, /disclaimer, /contact)
//
// Each snapshot ships unique <title>, <meta description>, canonical, JSON-LD,
// and a crawler-visible <main> with the H1, intro, and key links — so Googlebot
// and AdSense reviewers see real content even before the SPA hydrates.
// User-visible content matches the SPA (no cloaking).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const SITE = "https://howmanyofme.co";

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

const TOOLS = [
  { slug: "popularity-checker", title: "Name Popularity Checker — Rank, Trend & Rarity", desc: "Check any first name's popularity rank, year-by-year trend, and how rare it is. Free instant results from 100M+ records.", h1: "Name Popularity Checker" },
  { slug: "random-name", title: "Random Name Generator — First & Last Names", desc: "Generate random first and last names with one click. Filter by gender, origin, and decade. Free, no signup.", h1: "Random Name Generator" },
  { slug: "baby-names", title: "Baby Name Finder — Browse Top US Baby Names", desc: "Browse the most popular baby names from the U.S. Social Security Administration. Filter by gender, decade, and origin.", h1: "Baby Name Finder" },
  { slug: "username-generator", title: "Username Generator from Your Name", desc: "Turn your first or last name into 20+ unique username ideas for Instagram, Gmail, Reddit and more.", h1: "Username Generator" },
  { slug: "name-comparison", title: "Compare Two Names — Popularity, Trends & Origin", desc: "Compare any two first names side-by-side: popularity rank, decade trends, gender split, and origin.", h1: "Compare Two Names" },
  { slug: "trend-visualizer", title: "Name Trend Visualizer — 140 Years of Data", desc: "Visualize how any first name's popularity rose and fell from 1880 to today, with US/UK regional filters.", h1: "Name Trend Visualizer" },
  { slug: "unique-name-generator", title: "Unique Name Generator — Rare & Uncommon Names", desc: "Discover rare, uncommon first names you've never heard of, filtered by gender, origin, and rarity score.", h1: "Unique Name Generator" },
  { slug: "popularity-guide", title: "How to Read Name Popularity — A Visual Guide", desc: "Learn what name popularity rank, percentile, and rarity scores actually mean — with examples.", h1: "Name Popularity Guide" },
  { slug: "meaning", title: "Name Meaning Lookup — Origin & Etymology", desc: "Look up the meaning, origin, and etymology of any first name from our curated database.", h1: "Name Meaning Lookup" },
];

const STATIC_PAGES = [
  { route: "/about", title: "About HowManyOfMe — How Many People Have My Name", desc: "Learn about HowManyOfMe, the platform that answers 'how many of me are there?' using 100M+ names across 80+ countries.", h1: "About HowManyOfMe", intro: "HowManyOfMe is an independent project answering one simple question — how many people have your name? Built by Ziven Borceg, it covers 100M+ name records across 80+ countries." },
  { route: "/methodology", title: "Methodology — How We Estimate Name Frequency | HowManyOfMe", desc: "Inside our name statistics methodology: government data sources, actuarial survival modelling, migration adjustments, and confidence scoring.", h1: "Our Methodology", intro: "Every estimate is built from public data and a transparent statistical model — SSA birth records, Census surnames, WHO life tables, and UN migration flows." },
  { route: "/tools", title: "Free Name Tools — Popularity, Trends, Comparison & More", desc: "Free tools to explore your first name: popularity rank, trends since 1880, comparison, baby names, username generator, and more.", h1: "Free Name Tools", intro: "Nine free tools to explore any first name — popularity, trends, baby names, comparisons, and more. No signup, no fluff." },
  { route: "/blog", title: "Name Statistics Blog — Trends, Data & Stories", desc: "Long-form articles on baby name trends, naming culture, and the data behind name popularity.", h1: "Name Statistics Blog", intro: "Long-form articles on name trends, naming culture, and the data behind why some names rise and others fade." },
  { route: "/privacy", title: "Privacy Policy — HowManyOfMe", desc: "How HowManyOfMe collects, uses, and protects data — including cookies, analytics, advertising, and your GDPR/CCPA rights.", h1: "Privacy Policy", intro: "How HowManyOfMe handles your data — cookies, analytics, advertising disclosures, and your GDPR/CCPA rights." },
  { route: "/terms", title: "Terms of Service — HowManyOfMe", desc: "The rules for using HowManyOfMe — acceptable use, accuracy disclaimer, intellectual property, and limitation of liability.", h1: "Terms of Service", intro: "Acceptable use, data accuracy, IP, and liability — the rules for using HowManyOfMe." },
  { route: "/disclaimer", title: "Disclaimer — HowManyOfMe", desc: "Important disclaimers about HowManyOfMe's name statistics: estimates, limitations of data, and third-party sources.", h1: "Disclaimer", intro: "All HowManyOfMe statistics are estimates derived from public data and statistical modelling." },
  { route: "/contact", title: "Contact HowManyOfMe — Email, Feedback & Data Inquiries", desc: "Get in touch with HowManyOfMe. Email hello@howmanyofme.co for feedback, bug reports, data licensing, press, or partnership inquiries.", h1: "Contact Us", intro: "Email hello@howmanyofme.co for feedback, bug reports, data licensing, press, or partnership inquiries." },
  { route: "/similar-names", title: "Find Similar Names — Sound-Alike & Related First Names", desc: "Find first names that sound like or look like any name. Browse 100+ similar-name lists with popularity, gender and origin.", h1: "Find Similar Names", intro: "Type a name to find sound-alike, look-alike, and culturally related first names — backed by SSA popularity data." },
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

function renderPage({ canonical, title, description, jsonLdItems, prerenderBody }) {
  let html = baseHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
    .replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`);

  const headInjections = jsonLdItems
    .map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`)
    .join("\n    ");
  html = html.replace("</head>", `    ${headInjections}\n  </head>`);
  html = html.replace('<div id="root">', `<div id="root">${prerenderBody}`);
  return html;
}

function writePage(routePath, html) {
  const outDir = path.join(distDir, routePath.replace(/^\//, ""));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
}

let written = 0;

// 1) Top name pages
for (const name of TOP_NAMES) {
  const title = `How Many People Are Named ${name}? Popularity, Rarity & Origin`;
  const description = `Find out how many people are named ${name} worldwide. See ${name}'s popularity rank, decade-by-decade trend, regional distribution, and meaning. Free, no signup.`;
  const canonical = `${SITE}/name/${encodeURIComponent(name)}`;

  const prerenderBody = `
    <main data-prerender="name">
      <nav aria-label="Breadcrumb"><a href="/">Home</a> &rsaquo; <a href="/names/${name.charAt(0).toLowerCase()}">Names: ${name.charAt(0)}</a> &rsaquo; <span>${escapeHtml(name)}</span></nav>
      <h1>How Many People Are Named ${escapeHtml(name)}?</h1>
      <p>${escapeHtml(description)}</p>
      <p>Source data: <a href="https://www.ssa.gov/oact/babynames/" rel="noopener" target="_blank">U.S. Social Security Administration</a>, <a href="https://www.census.gov/" rel="noopener" target="_blank">U.S. Census Bureau</a>.</p>
      <p><a href="${canonical}">View full ${escapeHtml(name)} statistics</a> · <a href="/similar-names/${name.toLowerCase()}">Similar names to ${escapeHtml(name)}</a></p>
    </main>`;

  const html = renderPage({
    canonical,
    title,
    description,
    jsonLdItems: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: `Names: ${name.charAt(0)}`, item: `${SITE}/names/${name.charAt(0).toLowerCase()}` },
          { "@type": "ListItem", position: 3, name },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name,
        description: `Statistics, popularity, and origin for the first name ${name}.`,
      },
    ],
    prerenderBody,
  });
  writePage(`/name/${name}`, html);
  written++;
}

// 2) Tool pages
for (const t of TOOLS) {
  const canonical = `${SITE}/tools/${t.slug}`;
  const prerenderBody = `
    <main data-prerender="tool">
      <nav aria-label="Breadcrumb"><a href="/">Home</a> &rsaquo; <a href="/tools">Tools</a> &rsaquo; <span>${escapeHtml(t.h1)}</span></nav>
      <h1>${escapeHtml(t.h1)}</h1>
      <p>${escapeHtml(t.desc)}</p>
      <p>Free, no signup. Backed by data from the <a href="https://www.ssa.gov/oact/babynames/" rel="noopener" target="_blank">SSA</a> and <a href="https://www.census.gov/" rel="noopener" target="_blank">U.S. Census</a>.</p>
      <p><a href="/tools">Browse all 9 tools</a></p>
    </main>`;
  const html = renderPage({
    canonical,
    title: t.title,
    description: t.desc,
    jsonLdItems: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: t.h1,
        url: canonical,
        description: t.desc,
      },
    ],
    prerenderBody,
  });
  writePage(`/tools/${t.slug}`, html);
  written++;
}

// 3) Similar-names detail (lowercase routes)
for (const name of TOP_NAMES) {
  const slug = name.toLowerCase();
  const canonical = `${SITE}/similar-names/${slug}`;
  const title = `Names Similar to ${name} — Sound-Alike & Related First Names`;
  const description = `Discover first names similar to ${name} — sound-alike, look-alike, and culturally related names with popularity, gender, and origin.`;
  const prerenderBody = `
    <main data-prerender="similar">
      <nav aria-label="Breadcrumb"><a href="/">Home</a> &rsaquo; <a href="/similar-names">Similar Names</a> &rsaquo; <span>${escapeHtml(name)}</span></nav>
      <h1>Names Similar to ${escapeHtml(name)}</h1>
      <p>${escapeHtml(description)}</p>
      <p>Data sourced from the <a href="https://www.ssa.gov/oact/babynames/" rel="noopener" target="_blank">U.S. Social Security Administration</a>.</p>
      <p><a href="/name/${name}">View ${escapeHtml(name)} statistics</a> · <a href="/similar-names">Browse all similar-name lists</a></p>
    </main>`;
  const html = renderPage({
    canonical,
    title,
    description,
    jsonLdItems: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Similar Names", item: `${SITE}/similar-names` },
          { "@type": "ListItem", position: 3, name: `Similar to ${name}` },
        ],
      },
    ],
    prerenderBody,
  });
  writePage(`/similar-names/${slug}`, html);
  written++;
}

// 4) Static pages
for (const p of STATIC_PAGES) {
  const canonical = `${SITE}${p.route}`;
  const prerenderBody = `
    <main data-prerender="static">
      <h1>${escapeHtml(p.h1)}</h1>
      <p>${escapeHtml(p.intro)}</p>
      <p>Source data and references: <a href="https://www.ssa.gov/oact/babynames/" rel="noopener" target="_blank">SSA</a>, <a href="https://www.census.gov/" rel="noopener" target="_blank">U.S. Census Bureau</a>, <a href="https://data.unicef.org/" rel="noopener" target="_blank">UNICEF Data</a>.</p>
    </main>`;
  const html = renderPage({
    canonical,
    title: p.title,
    description: p.desc,
    jsonLdItems: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: p.h1,
        url: canonical,
        description: p.desc,
      },
    ],
    prerenderBody,
  });
  writePage(p.route, html);
  written++;
}

console.log(`[prerender] wrote ${written} static snapshots (names + tools + similar + static)`);
