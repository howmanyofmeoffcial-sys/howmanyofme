import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const namesFile = path.join(root, "src/data/generated/canonical-names.json");
const canonicalNames = JSON.parse(fs.readFileSync(namesFile, "utf8"));

console.log("=== CANONICAL NAME DATASET AUDIT ===");
console.log("Total canonical records:", canonicalNames.length);

const uniqueNormalized = new Set();
const invalid = [];

for (const rec of canonicalNames) {
  const norm = rec.name.toLowerCase();
  if (uniqueNormalized.has(norm)) {
    console.error(`[!] Duplicate canonical entry detected: ${rec.name}`);
  }
  uniqueNormalized.add(norm);

  if (rec.name.length < 2 || !/^[A-Za-z]+$/.test(rec.name)) {
    invalid.push(rec.name);
  }
}

console.log("Unique normalized names:", uniqueNormalized.size);
console.log("Invalid names count:", invalid.length);
console.log("Dataset integrity check complete.");
