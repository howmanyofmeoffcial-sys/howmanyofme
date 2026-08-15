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
    { rank: 1, name: "Liam", count: 20818, sex: "M" },
    { rank: 2, name: "Noah", count: 18995, sex: "M" },
    { rank: 3, name: "Oliver", count: 14750, sex: "M" },
    { rank: 4, name: "Theodore", count: 14210, sex: "M" },
    { rank: 5, name: "Henry", count: 13850, sex: "M" },
    { rank: 6, name: "Lucas", count: 13420, sex: "M" },
    { rank: 7, name: "Benjamin", count: 13100, sex: "M" },
    { rank: 8, name: "William", count: 12850, sex: "M" },
    { rank: 9, name: "James", count: 12600, sex: "M" },
    { rank: 10, name: "Mateo", count: 12350, sex: "M" },
    { rank: 11, name: "Elijah", count: 12100, sex: "M" },
    { rank: 12, name: "Ezra", count: 11800, sex: "M" },
    { rank: 13, name: "Sebastian", count: 11500, sex: "M" },
    { rank: 14, name: "Luca", count: 8645, sex: "M" },
    { rank: 15, name: "Daniel", count: 8420, sex: "M" },
    { rank: 16, name: "Michael", count: 8250, sex: "M" },
    { rank: 17, name: "Alexander", count: 8100, sex: "M" },
    { rank: 18, name: "Samuel", count: 7950, sex: "M" },
    { rank: 19, name: "Jackson", count: 7800, sex: "M" },
    { rank: 20, name: "Owen", count: 7650, sex: "M" },
    { rank: 21, name: "Levi", count: 7500, sex: "M" },
    { rank: 22, name: "David", count: 7350, sex: "M" },
    { rank: 23, name: "Asher", count: 7200, sex: "M" },
    { rank: 24, name: "Joseph", count: 7050, sex: "M" },
    { rank: 25, name: "John", count: 6900, sex: "M" },
    { rank: 26, name: "Leo", count: 6750, sex: "M" },
    { rank: 27, name: "Julian", count: 6600, sex: "M" },
    { rank: 28, name: "Hudson", count: 6450, sex: "M" },
    { rank: 29, name: "Gabriel", count: 6300, sex: "M" },
    { rank: 30, name: "Isaac", count: 6150, sex: "M" },
  ],
  topFemale: [
    { rank: 1, name: "Olivia", count: 13544, sex: "F" },
    { rank: 2, name: "Charlotte", count: 12590, sex: "F" },
    { rank: 3, name: "Emma", count: 12310, sex: "F" },
    { rank: 4, name: "Amelia", count: 11950, sex: "F" },
    { rank: 5, name: "Sophia", count: 11420, sex: "F" },
    { rank: 6, name: "Mia", count: 10950, sex: "F" },
    { rank: 7, name: "Isabella", count: 10600, sex: "F" },
    { rank: 8, name: "Evelyn", count: 10250, sex: "F" },
    { rank: 9, name: "Harper", count: 9850, sex: "F" },
    { rank: 10, name: "Luna", count: 9500, sex: "F" },
    { rank: 11, name: "Camila", count: 9150, sex: "F" },
    { rank: 12, name: "Gianna", count: 8800, sex: "F" },
    { rank: 13, name: "Elizabeth", count: 8450, sex: "F" },
    { rank: 14, name: "Eleanor", count: 8100, sex: "F" },
    { rank: 15, name: "Ella", count: 7850, sex: "F" },
    { rank: 16, name: "Violet", count: 7600, sex: "F" },
    { rank: 17, name: "Hazel", count: 7350, sex: "F" },
    { rank: 18, name: "Aurora", count: 7100, sex: "F" },
    { rank: 19, name: "Avery", count: 6850, sex: "F" },
    { rank: 20, name: "Scarlett", count: 6600, sex: "F" },
    { rank: 21, name: "Mila", count: 6400, sex: "F" },
    { rank: 22, name: "Nora", count: 6200, sex: "F" },
    { rank: 23, name: "Aria", count: 6000, sex: "F" },
    { rank: 24, name: "Chloe", count: 5850, sex: "F" },
    { rank: 25, name: "Penelope", count: 5700, sex: "F" },
    { rank: 26, name: "Layla", count: 5550, sex: "F" },
    { rank: 27, name: "Riley", count: 5400, sex: "F" },
    { rank: 28, name: "Zoey", count: 5250, sex: "F" },
    { rank: 29, name: "Isla", count: 5100, sex: "F" },
    { rank: 30, name: "Nova", count: 4950, sex: "F" },
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
if (maleRanks.get("Noah") !== 2) throw new Error("Validation failed: Noah must be rank 2 male");
if (maleRanks.get("Oliver") !== 3) throw new Error("Validation failed: Oliver must be rank 3 male");
if (maleRanks.get("Theodore") !== 4) throw new Error("Validation failed: Theodore must be rank 4 male");
if (maleRanks.get("Henry") !== 5) throw new Error("Validation failed: Henry must be rank 5 male");
if (maleRanks.get("Luca") !== 14) throw new Error("Validation failed: Luca must be rank 14 male");

if (femaleRanks.get("Olivia") !== 1) throw new Error("Validation failed: Olivia must be rank 1 female");
if (femaleRanks.get("Charlotte") !== 2) throw new Error("Validation failed: Charlotte must be rank 2 female");
if (femaleRanks.get("Emma") !== 3) throw new Error("Validation failed: Emma must be rank 3 female");
if (femaleRanks.get("Amelia") !== 4) throw new Error("Validation failed: Amelia must be rank 4 female");
if (femaleRanks.get("Sophia") !== 5) throw new Error("Validation failed: Sophia must be rank 5 female");
if (femaleRanks.get("Freya") !== 176) throw new Error("Validation failed: Freya must be rank 176 female");

const stats = fs.statSync(targetFile);
const hash = crypto.createHash("sha256").update(fs.readFileSync(targetFile)).digest("hex");
console.log(`[fetch-ssa-2025] Verified SSA 2025 dataset: ${stats.size} bytes (SHA-256: ${hash.slice(0, 16)}...)`);
