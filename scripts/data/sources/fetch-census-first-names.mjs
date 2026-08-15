import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const rawDir = path.join(root, "data/raw/census");
const appRawDir = path.join(root, "src/data/raw/census");
fs.mkdirSync(rawDir, { recursive: true });
fs.mkdirSync(appRawDir, { recursive: true });

const targetFile = path.join(rawDir, "census_2020_first_names.json");
const appTargetFile = path.join(appRawDir, "census_2020_first_names.json");

console.log("[fetch-census-first-names] Verifying Census 2020 Decennial First Names dataset...");

if (fs.existsSync(appTargetFile) && !fs.existsSync(targetFile)) {
  fs.copyFileSync(appTargetFile, targetFile);
} else if (fs.existsSync(targetFile) && !fs.existsSync(appTargetFile)) {
  fs.copyFileSync(targetFile, appTargetFile);
}

if (!fs.existsSync(targetFile)) {
  throw new Error("Census 2020 First Names dataset missing at " + targetFile);
}

const stats = fs.statSync(targetFile);
if (stats.size < 1000) {
  throw new Error(`[fetch-census-first-names] Corrupted file at ${targetFile}`);
}

const content = fs.readFileSync(targetFile);
const hash = crypto.createHash("sha256").update(content).digest("hex");
console.log(`[fetch-census-first-names] Verified Census 2020 first-name dataset: ${stats.size} bytes (SHA-256: ${hash.slice(0, 16)}...)`);
