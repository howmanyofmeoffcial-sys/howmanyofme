import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Read canonical names and metadata
const nameDataContent = fs.readFileSync(path.join(root, "src/data/nameData.ts"), "utf8");
const prefixMatch = nameDataContent.match(/const COMMON_PREFIXES: Record<string, string\[\]> = \{([\s\S]*?)\n\};/);
const names = Array.from(
  new Set([...prefixMatch[1].matchAll(/"([A-Za-z]+)"/g)].map((m) => m[1]))
);

console.log("=== POST-MIGRATION SEO GROWTH & QUERY ALIGNMENT MODEL ===");
console.log(`Total Canonical Name Entities: ${names.length}`);

// 1. Query Intent Categorization Model
const intentClusters = {
  directCount: {
    pattern: "how many people have the name {name} / how many people named {name}",
    estimatedShare: "48%",
    landingPage: "/name/{Name}",
    aeoFormat: "Answer-First Quick Answer Card",
  },
  rarityAndRank: {
    pattern: "is {name} a rare name / what rank is the name {name}",
    estimatedShare: "22%",
    landingPage: "/name/{Name}#rarity",
    aeoFormat: "Rarity Tier & 1-in-X Frequency Table",
  },
  trendAndDecade: {
    pattern: "{name} name popularity over time / {name} popularity by decade",
    estimatedShare: "16%",
    landingPage: "/name/{Name}#historical-trends",
    aeoFormat: "Decade Table & Visual Curve Island",
  },
  similarAndAlternatives: {
    pattern: "names like {name} / similar names to {name}",
    estimatedShare: "14%",
    landingPage: "/name/{Name}#similar-names",
    aeoFormat: "Phonetic / Letter Similarity Grid",
  },
};

console.log("\n1. Search Intent Distribution:");
console.table(intentClusters);

// 2. High-Priority Striking Distance Entities (Top 20 high-demand names)
const highDemandEntities = [
  "James", "Mary", "Robert", "Patricia", "John",
  "Jennifer", "Michael", "Linda", "William", "Elizabeth",
  "David", "Barbara", "Emma", "Olivia", "Liam",
  "Sophia", "Noah", "Ava", "Alexander", "Charlotte"
];

console.log(`\n2. High-Value Priority Anchor Entities (20 Curated Core Pages):`);
console.log(highDemandEntities.join(", "));

// 3. CTR Optimization Patterns
const ctrRules = [
  {
    type: "Entity Direct Query",
    template: "How Many People Are Named {Name}? Popularity, Rarity & Origin",
    rationale: "Matches verbatim Google Search query syntax and signals instant answer value.",
  },
  {
    type: "Featured Snippet Direct Answer",
    template: "There are approximately {count} living people named {Name} worldwide (rank #{rank})...",
    rationale: "Provides factual unit, count, and frequency in the first 160 characters for AI/Snippet extraction.",
  },
  {
    type: "Directory Hub Query",
    template: "Names Starting with {Letter} — Popularity & Meanings (A–Z Directory)",
    rationale: "Clear taxonomy heading for browse intent.",
  },
];

console.log("\n3. Proven Title & CTR Formatting Rules:");
console.table(ctrRules);
