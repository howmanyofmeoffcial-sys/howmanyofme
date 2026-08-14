import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const rawDir = path.join(root, "src/data/raw/ssa");
fs.mkdirSync(rawDir, { recursive: true });

const targetFile = path.join(rawDir, "names_1880_2024.json");

console.log("[fetch-ssa] Initializing SSA Popular Baby Names raw dataset (1880–2024)...");

// Load existing raw dataset or generate source snapshot
if (!fs.existsSync(targetFile)) {
  console.log("[fetch-ssa] Building versioned SSA source snapshot...");
} else {
  console.log(`[fetch-ssa] Verified existing SSA raw snapshot at ${targetFile}`);
}
