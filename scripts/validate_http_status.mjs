import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

const canonicalNames = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/generated/canonical-names.json"), "utf8")
);
const names = new Set(canonicalNames.map((n) => n.name.toLowerCase()));

console.log("=== HTTP STATUS & SOFT-404 SIMULATION ===");

// 1. Check Valid Expected 200 URLs
const validUrlsToTest = [
  "/",
  "/name/James",
  "/name/Mary",
  "/name/Logan",
  "/name/Uma",
  "/names/a",
  "/names/z",
];

const validResults = [];
for (const v of validUrlsToTest) {
  let filePath = path.join(distDir, v === "/" ? "index.html" : `${v.slice(1)}/index.html`);
  const exists = fs.existsSync(filePath);
  if (exists) {
    const html = fs.readFileSync(filePath, "utf8");
    const hasH1 = html.includes("<h1");
    const hasQuickAnswer = html.includes("⚡ Quick Answer") || v.startsWith("/names/") || v === "/";
    validResults.push({
      url: v,
      status: 200,
      existsOnDisk: true,
      hasContent: hasH1 && hasQuickAnswer,
    });
  } else {
    validResults.push({
      url: v,
      status: "MISSING",
      existsOnDisk: false,
      hasContent: false,
    });
  }
}
console.table(validResults);

// 2. Check Invalid URLs (Should NOT exist in dist/ as static pages, must route to 404)
const invalidUrlsToTest = [
  "/name/nonexistent-123",
  "/name/invalidnamexyz",
  "/name/random404query",
  "/name/aaaabbbbcccc",
  "/names/1",
  "/names/invalid",
];

const invalidResults = [];
for (const inv of invalidUrlsToTest) {
  let filePath = path.join(distDir, `${inv.slice(1)}/index.html`);
  const exists = fs.existsSync(filePath);
  // An invalid name should NOT exist in dist/
  invalidResults.push({
    url: inv,
    existsInDist: exists,
    handledAs404: !exists,
    soft404Risk: exists ? "HIGH (Thin page generated)" : "NONE (404 Gate active)",
  });
}
console.table(invalidResults);
