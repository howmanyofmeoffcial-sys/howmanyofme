import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const snapshotsDir = path.join(root, "data/monitoring/releases");

fs.mkdirSync(snapshotsDir, { recursive: true });

export function generateReleaseSnapshot() {
  let commitHash = "unknown";
  try {
    commitHash = execSync("git rev-parse --short HEAD", { cwd: root }).toString().trim();
  } catch (e) {
    // Ignore if git not available
  }

  const sitemapPath = path.join(root, "dist/sitemap.xml");
  let sitemapCount = 0;
  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
    const locs = sitemapContent.match(/<loc>/g);
    sitemapCount = locs ? locs.length : 0;
  }

  const manifestPath = path.join(root, "src/data/metadata/manifest.json");
  let dataVersion = "unknown";
  if (fs.existsSync(manifestPath)) {
    const m = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    dataVersion = m.dataVersion || "unknown";
  }

  const snapshot = {
    releaseId: `rel-${Date.now()}`,
    commit: commitHash,
    generatedAt: new Date().toISOString(),
    sitemapUrlsCount: sitemapCount,
    expectedCanonicalRoutes: 1944,
    dataVersion: dataVersion,
    status: "healthy",
  };

  const filename = `release-${new Date().toISOString().split("T")[0]}.json`;
  fs.writeFileSync(path.join(snapshotsDir, filename), JSON.stringify(snapshot, null, 2), "utf8");

  return snapshot;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const s = generateReleaseSnapshot();
  console.log(`[release-snapshot] Generated release snapshot for ${s.commit}:`, s);
}
