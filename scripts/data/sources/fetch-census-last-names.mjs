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

const targetFile = path.join(rawDir, "surnames_2010_2020.json");
const appTargetFile = path.join(appRawDir, "surnames_2010_2020.json");

console.log("[fetch-census-last-names] Verifying Census Decennial Surnames dataset...");

if (fs.existsSync(appTargetFile) && !fs.existsSync(targetFile)) {
  fs.copyFileSync(appTargetFile, targetFile);
} else if (fs.existsSync(targetFile) && !fs.existsSync(appTargetFile)) {
  fs.copyFileSync(targetFile, appTargetFile);
}

if (!fs.existsSync(targetFile)) {
  throw new Error("Census Surnames dataset missing at " + targetFile);
}

const stats = fs.statSync(targetFile);
if (stats.size < 500) {
  throw new Error(`[fetch-census-last-names] Corrupted file at ${targetFile}`);
}

const content = fs.readFileSync(targetFile);
const hash = crypto.createHash("sha256").update(content).digest("hex");
console.log(`[fetch-census-last-names] Verified Census surnames dataset: ${stats.size} bytes (SHA-256: ${hash.slice(0, 16)}...)`);
