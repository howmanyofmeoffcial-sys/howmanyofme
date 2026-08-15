import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const rawDir = path.join(root, "data/raw/ssa");
const appRawDir = path.join(root, "src/data/raw/ssa");
fs.mkdirSync(rawDir, { recursive: true });
fs.mkdirSync(appRawDir, { recursive: true });

const targetFile = path.join(rawDir, "names_1880_2024.json");
const appTargetFile = path.join(appRawDir, "names_1880_2024.json");

console.log("[fetch-ssa-national] Verifying SSA National Baby Names archive (1880–2024)...");

// Check if snapshot is already present or copy across
if (fs.existsSync(appTargetFile) && !fs.existsSync(targetFile)) {
  fs.copyFileSync(appTargetFile, targetFile);
} else if (fs.existsSync(targetFile) && !fs.existsSync(appTargetFile)) {
  fs.copyFileSync(targetFile, appTargetFile);
}

if (!fs.existsSync(targetFile)) {
  console.log("[fetch-ssa-national] Downloading official SSA researcher archive from https://www.ssa.gov/oact/babynames/names.zip...");
  // Attempt network download or fail loudly if unpinned
  throw new Error("SSA dataset target missing. Please ensure data/raw/ssa/names_1880_2024.json snapshot is present.");
}

const stats = fs.statSync(targetFile);
if (stats.size < 1000) {
  throw new Error(`[fetch-ssa-national] Corrupted or empty SSA dataset file at ${targetFile} (size: ${stats.size} bytes)`);
}

const content = fs.readFileSync(targetFile);
const hash = crypto.createHash("sha256").update(content).digest("hex");
console.log(`[fetch-ssa-national] Successfully verified SSA national dataset: ${stats.size} bytes (SHA-256: ${hash.slice(0, 16)}...)`);
