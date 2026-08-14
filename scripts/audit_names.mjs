import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const nameDataContent = fs.readFileSync(path.join(root, "src/data/nameData.ts"), "utf8");

// Parse COMMON_PREFIXES
const prefixesMatch = nameDataContent.match(/const COMMON_PREFIXES: Record<string, string\[\]> = \{([\s\S]*?)\n\};/);
const prefixCode = prefixesMatch[1];
const letterBlocks = [...prefixCode.matchAll(/([A-Z]):\s*\[([\s\S]*?)\]/g)];

const extendedByLetter = {};
let totalExtendedEntries = 0;
const allExtended = [];

for (const match of letterBlocks) {
  const letter = match[1];
  const names = [...match[2].matchAll(/"([A-Za-z]+)"/g)].map((m) => m[1]);
  extendedByLetter[letter] = names;
  totalExtendedEntries += names.length;
  allExtended.push(...names);
}

// Extract POPULAR_NAMES keys
const popMatches = [...nameDataContent.matchAll(/^\s{2}"([A-Za-z]+)":\s*\{/gm)];
const popularNames = popMatches.map((m) => m[1]);

console.log("Total entries in EXTENDED_NAMES lists across A-Z:", totalExtendedEntries);
console.log("Unique names in EXTENDED_NAMES:", new Set(allExtended).size);
console.log("Total entries in POPULAR_NAMES:", popularNames.length);

const combinedAll = [...popularNames, ...allExtended];
const uniqueNormalized = new Set();
const lowercaseMap = new Map();
const duplicatesInLists = [];
const invalid = [];

for (const n of combinedAll) {
  const norm = n.trim();
  const lower = norm.toLowerCase();
  if (lowercaseMap.has(lower) && lowercaseMap.get(lower) !== norm) {
    duplicatesInLists.push({ original: lowercaseMap.get(lower), duplicate: norm });
  }
  lowercaseMap.set(lower, norm);

  if (norm.length < 2 || !/^[A-Za-z]+$/.test(norm)) {
    invalid.push(norm);
  }
  uniqueNormalized.add(norm);
}

const popNameSet = new Set(popularNames);
const extendedNameSet = new Set(allExtended);
const overlap = [...popNameSet].filter((n) => extendedNameSet.has(n));

console.log("Total unique canonical names:", uniqueNormalized.size);
console.log("Popular names:", popularNames.length);
console.log("Popular names present in extended list:", overlap.length);
console.log("Popular names NOT present in extended list:", popularNames.filter((n) => !extendedNameSet.has(n)));
console.log("Invalid names count:", invalid.length);
console.log("Letters covered:", Object.keys(extendedByLetter).length);

// Also check top 100 in prerender-top-names.mjs
const prerenderSrc = fs.readFileSync(path.join(root, "scripts/prerender-top-names.mjs"), "utf8");
const top100Matches = [...prerenderSrc.matchAll(/"([A-Za-z]+)"/g)].map((m) => m[1]);
const top100Names = top100Matches.slice(0, 100);
console.log("Top names list in prerender script:", top100Names.length);

// Count how many of top100 are in uniqueNormalized
const top100InDataset = top100Names.filter((n) => uniqueNormalized.has(n));
console.log("Top 100 names in dataset:", top100InDataset.length);
