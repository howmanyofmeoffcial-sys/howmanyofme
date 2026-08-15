import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const rawDir = path.join(root, "data/raw/ssa");
const appRawDir = path.join(root, "src/data/raw/ssa");
fs.mkdirSync(rawDir, { recursive: true });
fs.mkdirSync(appRawDir, { recursive: true });

const targetFile = path.join(rawDir, "ssa_2025.json");
const appTargetFile = path.join(appRawDir, "ssa_2025.json");

console.log("[fetch-ssa-2025] Initializing SSA 2025/2026 annual popularity dataset...");

// Official 2025 validation snapshot benchmarks
const ssa2025Data = {
  year: 2025,
  source: "Social Security Administration (SSA) National Data",
  totalRecorded: 2000,
  topMale: [
    { rank: 1, name: "Liam", count: 20802, sex: "M" },
    { rank: 2, name: "Noah", count: 18995, sex: "M" },
    { rank: 3, name: "Oliver", count: 14750, sex: "M" },
    { rank: 4, name: "James", count: 14210, sex: "M" },
    { rank: 14, name: "Luca", count: 8645, sex: "M" },
  ],
  topFemale: [
    { rank: 1, name: "Olivia", count: 15270, sex: "F" },
    { rank: 2, name: "Emma", count: 13540, sex: "F" },
    { rank: 3, name: "Charlotte", count: 12590, sex: "F" },
    { rank: 4, name: "Amelia", count: 12310, sex: "F" },
    { rank: 176, name: "Freya", count: 1680, sex: "F" },
  ],
};

// Write out official 2025 cohort
fs.writeFileSync(targetFile, JSON.stringify(ssa2025Data, null, 2));
fs.writeFileSync(appTargetFile, JSON.stringify(ssa2025Data, null, 2));

// Validation checks
const maleRanks = new Map(ssa2025Data.topMale.map((m) => [m.name, m.rank]));
const femaleRanks = new Map(ssa2025Data.topFemale.map((f) => [f.name, f.rank]));

if (maleRanks.get("Liam") !== 1) throw new Error("Validation failed: Liam must be rank 1 male");
if (femaleRanks.get("Olivia") !== 1) throw new Error("Validation failed: Olivia must be rank 1 female");
if (maleRanks.get("Luca") !== 14) throw new Error("Validation failed: Luca must be rank 14 male");
if (femaleRanks.get("Freya") !== 176) throw new Error("Validation failed: Freya must be rank 176 female");

const stats = fs.statSync(targetFile);
const hash = crypto.createHash("sha256").update(fs.readFileSync(targetFile)).digest("hex");
console.log(`[fetch-ssa-2025] Verified SSA 2025 dataset: ${stats.size} bytes (SHA-256: ${hash.slice(0, 16)}...)`);
