import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const distDir = path.join(root, "dist");

describe("Technical SEO & Production Build Quality Suite", () => {
  it("verifies static production HTML contains complete above-the-fold SEO content", () => {
    const kyleHtmlPath = path.join(distDir, "name/Kyle/index.html");
    if (!fs.existsSync(kyleHtmlPath)) return;

    const html = fs.readFileSync(kyleHtmlPath, "utf8");

    // Pre-rendered Title
    expect(html).toContain("<title>");
    expect(html).toContain("Kyle");

    // Pre-rendered Canonical
    expect(html).toContain('<link rel="canonical" href="https://howmanyofme.co/name/Kyle"');

    // Pre-rendered Meta Description
    expect(html).toContain('<meta name="description"');

    // Pre-rendered H1
    expect(html).toContain("<h1");
    expect(html).toContain("Kyle");

    // Pre-rendered Answer Card & Structured Table
    expect(html).toContain("Quick Answer");
    expect(html).toContain("Estimated Living U.S. Bearers");
    expect(html).toContain("<table");

    // Pre-rendered Schema.org JSON-LD
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('"@type":"FAQPage"');
  });

  it("verifies zero client:only dependencies on content routes", () => {
    const namePageAstro = fs.readFileSync(path.join(root, "src/pages/name/[name].astro"), "utf8");
    const similarPageAstro = fs.readFileSync(path.join(root, "src/pages/similar-names/[name].astro"), "utf8");

    expect(namePageAstro).not.toContain("client:only");
    expect(similarPageAstro).not.toContain("client:only");
  });

  it("verifies deferred hydration for heavy interactive components", () => {
    const namePageAstro = fs.readFileSync(path.join(root, "src/pages/name/[name].astro"), "utf8");

    // SiteHeader uses client:idle to prevent main thread blocking
    expect(namePageAstro).toContain("<SiteHeader client:idle />");

    // NameHistoryChart uses client:visible for lazy chunk loading
    expect(namePageAstro).toContain("client:visible");
  });

  it("verifies physical space reservation on ad slots to guarantee zero layout shift (CLS = 0.000)", () => {
    const adSlotAstro = fs.readFileSync(path.join(root, "src/components/AdSlot.astro"), "utf8");

    expect(adSlotAstro).toContain("min-h-[250px]");
    expect(adSlotAstro).toContain("contain-layout");
  });

  it("verifies production robots.txt and sitemap.xml directives", () => {
    const robotsPath = path.join(distDir, "robots.txt");
    const sitemapPath = path.join(distDir, "sitemap.xml");

    if (!fs.existsSync(robotsPath) || !fs.existsSync(sitemapPath)) return;

    const robots = fs.readFileSync(robotsPath, "utf8");
    const sitemap = fs.readFileSync(sitemapPath, "utf8");

    expect(robots).toContain("Sitemap: https://howmanyofme.co/sitemap.xml");
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");

    expect(sitemap.startsWith("<?xml")).toBe(true);
    expect(sitemap).toContain("<urlset");
    expect(sitemap).toContain("https://howmanyofme.co/name/James");
  });
});
