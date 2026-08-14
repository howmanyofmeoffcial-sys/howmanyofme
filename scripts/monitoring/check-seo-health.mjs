import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const distDir = path.join(root, "dist");

export function runSeoHealthCheck() {
  const findings = [];
  if (!fs.existsSync(distDir)) {
    findings.push({
      id: "dist-missing",
      category: "technical",
      severity: "critical",
      title: "Missing Production Build Output (dist/)",
      description: "dist directory does not exist. Run npm run build first.",
      firstDetectedAt: new Date().toISOString(),
      lastDetectedAt: new Date().toISOString(),
      status: "open",
    });
    return findings;
  }

  // 1. Robots.txt check
  const robotsPath = path.join(distDir, "robots.txt");
  if (!fs.existsSync(robotsPath)) {
    findings.push({
      id: "robots-missing",
      category: "indexation",
      severity: "critical",
      title: "robots.txt Missing from Production Build",
      description: "robots.txt was not generated or copied to dist/.",
      firstDetectedAt: new Date().toISOString(),
      lastDetectedAt: new Date().toISOString(),
      status: "open",
    });
  } else {
    const robotsTxt = fs.readFileSync(robotsPath, "utf8");
    if (/^\s*Disallow:\s*\/\s*$/m.test(robotsTxt)) {
      findings.push({
        id: "robots-disallow-all",
        category: "indexation",
        severity: "critical",
        title: "robots.txt Disallows Entire Website",
        description: "robots.txt contains global 'Disallow: /'.",
        firstDetectedAt: new Date().toISOString(),
        lastDetectedAt: new Date().toISOString(),
        status: "open",
      });
    }
  }

  // 2. Sitemap.xml check
  const sitemapPath = path.join(distDir, "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    findings.push({
      id: "sitemap-missing",
      category: "indexation",
      severity: "critical",
      title: "sitemap.xml Missing from Production Build",
      description: "sitemap.xml is missing from dist/.",
      firstDetectedAt: new Date().toISOString(),
      lastDetectedAt: new Date().toISOString(),
      status: "open",
    });
  } else {
    const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
    const locMatches = sitemapContent.match(/<loc>/g);
    const count = locMatches ? locMatches.length : 0;
    if (count < 1500) {
      findings.push({
        id: "sitemap-underpopulated",
        category: "indexation",
        severity: "high",
        title: `sitemap.xml Contains Too Few URLs (${count})`,
        description: `Expected ~1,944 canonical URLs, found ${count}.`,
        firstDetectedAt: new Date().toISOString(),
        lastDetectedAt: new Date().toISOString(),
        status: "open",
      });
    }
  }

  return findings;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const results = runSeoHealthCheck();
  console.log(`[check-seo-health] Found ${results.length} issues.`);
  console.log(JSON.stringify(results, null, 2));
}
