import { describe, it, expect } from "vitest";
import { renderBlogContent, parseInlineMarkdown } from "../lib/blog/renderBlogContent";
import { getBlogArticle, blogArticles } from "../data/blogData";

describe("Blog Markdown & Rich Content Renderer", () => {
  it("parses inline markdown links, bold, and code accurately", () => {
    const raw = "Check [SSA data](https://www.ssa.gov) with **bold words** and `inline_code`.";
    const parsed = parseInlineMarkdown(raw);

    expect(parsed).toContain('<a href="https://www.ssa.gov"');
    expect(parsed).toContain("SSA data</a>");
    expect(parsed).toContain('<strong class="font-semibold text-foreground">bold words</strong>');
    expect(parsed).toContain('<code class="rounded bg-secondary/80 px-1.5 py-0.5 font-mono text-xs text-primary font-semibold">inline_code</code>');
  });

  it("renders tables into responsive semantic HTML with thead and tbody", () => {
    const testArticle = {
      slug: "test-tables",
      title: "Test Tables",
      description: "Testing table rendering",
      category: "trends" as const,
      readTime: 5,
      date: "2026-01-01",
      content: [
        "## Table Heading\n\n| Rank | Name | Living Estimate |\n|---|---|---|\n| 1 | Liam | 350,000 |\n| 2 | Olivia | 320,000 |",
      ],
    };

    const html = renderBlogContent(testArticle);
    expect(html).toContain("<table");
    expect(html).toContain("<thead");
    expect(html).toContain("<th scope=\"col\"");
    expect(html).toContain("Rank</th>");
    expect(html).toContain("<tbody");
    expect(html).toContain("Liam</td>");
    expect(html).toContain("350,000</td>");
  });

  it("renders A–Z alphabet jump nav and assigns letter anchor IDs", () => {
    const alphabetArticle = getBlogArticle("unusual-baby-names-alphabet");
    expect(alphabetArticle).toBeDefined();

    const html = renderBlogContent(alphabetArticle!);
    expect(html).toContain('Jump by Letter (A–Z)');
    expect(html).toContain('href="#A"');
    expect(html).toContain('href="#Z"');
    expect(html).toContain('id="A"');
    expect(html).toContain('id="B"');
  });

  it("renders Data Snapshot widget with structured metrics and sources", () => {
    const trendsArticle = getBlogArticle("baby-name-trends");
    expect(trendsArticle).toBeDefined();

    const html = renderBlogContent(trendsArticle!);
    expect(html).toContain("Data Snapshot");
    expect(html).toContain("2026 Trend Velocity Snapshot");
    expect(html).toContain("Biblical-with-a-twist");
    expect(html).toContain("Celestial names");
    expect(html).toContain("SSA velocity");
  });

  it("renders all production blog articles without errors or broken tags", () => {
    for (const article of blogArticles) {
      const fullArticle = getBlogArticle(article.slug);
      expect(fullArticle).toBeDefined();
      const html = renderBlogContent(fullArticle!);

      expect(html.length).toBeGreaterThan(100);
      expect(html).not.toContain("[DATA_SNAPSHOT]");
      expect(html).not.toContain("[ALPHABET_NAV]");
      expect(html).not.toContain("[AD]");
      expect(html).toContain("<p");
    }
  });
});
