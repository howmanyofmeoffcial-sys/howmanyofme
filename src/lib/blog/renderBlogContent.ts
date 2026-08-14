import type { BlogArticle, BlogDataSnapshot } from "../../data/blogData";

/**
 * Parses inline markdown (bold, italic, code, links) into accessible HTML.
 */
export function parseInlineMarkdown(text: string): string {
  let html = text;

  // Escape HTML entities to prevent XSS (while preserving markdown formatting)
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Markdown links: [label](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    `<a href="$2" class="text-primary font-medium underline underline-offset-2 hover:text-primary/80 transition-colors">$1</a>`
  );

  // Bold: **text** or __text__
  html = html.replace(/\*\*([^*]+)\*\*/g, `<strong class="font-semibold text-foreground">$1</strong>`);
  html = html.replace(/__([^_]+)__/g, `<strong class="font-semibold text-foreground">$1</strong>`);

  // Italic: *text* or _text_
  html = html.replace(/\*([^*]+)\*/g, `<em class="italic text-foreground/90">$1</em>`);
  html = html.replace(/_([^_]+)_/g, `<em class="italic text-foreground/90">$1</em>`);

  // Inline code: `code`
  html = html.replace(
    /`([^`]+)`/g,
    `<code class="rounded bg-secondary/80 px-1.5 py-0.5 font-mono text-xs text-primary font-semibold">$1</code>`
  );

  return html;
}

/**
 * Renders the interactive A–Z Alphabet Jump Navigation.
 */
function renderAlphabetNav(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const buttons = letters
    .map(
      (letter) =>
        `<a href="#${letter}" class="h-8 w-8 rounded-lg border border-border/80 bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary font-bold text-xs flex items-center justify-center transition-all shadow-xs text-foreground shrink-0">${letter}</a>`
    )
    .join("");

  return `
    <div class="my-8 rounded-2xl border border-border/80 bg-secondary/30 p-4 md:p-6 shadow-xs">
      <div class="flex items-center justify-between gap-2 mb-3">
        <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Jump by Letter (A–Z)</span>
        <span class="text-xs text-muted-foreground">26 Unique Alphabet Categories</span>
      </div>
      <div class="flex flex-wrap gap-1.5 justify-center md:justify-start">
        ${buttons}
      </div>
    </div>
  `;
}

/**
 * Renders the Visual Data Snapshot Card.
 */
function renderDataSnapshot(snapshot?: BlogDataSnapshot): string {
  if (!snapshot || !snapshot.metrics || snapshot.metrics.length === 0) {
    return "";
  }

  const metricCards = snapshot.metrics
    .map((m) => {
      const trendBadge =
        m.trend === "up"
          ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">↑ Rising</span>`
          : m.trend === "down"
          ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">↓ Declining</span>`
          : `<span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/60">→ Stable</span>`;

      return `
        <div class="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">${m.label}</span>
            ${trendBadge}
          </div>
          <div class="font-display text-2xl font-extrabold text-foreground tracking-tight my-1">${m.value}</div>
          ${m.context ? `<p class="text-xs text-muted-foreground mt-1">${m.context}</p>` : ""}
        </div>
      `;
    })
    .join("");

  const sourcesList = snapshot.sources
    ? snapshot.sources
        .map((s) => (s.url ? `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">${s.label}</a>` : s.label))
        .join(" · ")
    : "Social Security Administration & U.S. Census Bureau";

  return `
    <div class="my-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 md:p-6 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-primary/15 pb-3 mb-4">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded bg-primary/10 inline-block mb-1">
            Data Snapshot
          </span>
          <h3 class="font-display text-xl font-bold text-foreground">${snapshot.title || "Key Demographic Findings"}</h3>
        </div>
        ${snapshot.lastUpdatedLabel ? `<span class="text-xs text-muted-foreground font-medium">Updated: ${snapshot.lastUpdatedLabel}</span>` : ""}
      </div>

      ${snapshot.summary ? `<p class="text-sm text-muted-foreground leading-relaxed mb-4">${snapshot.summary}</p>` : ""}

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
        ${metricCards}
      </div>

      <div class="mt-4 pt-3 border-t border-primary/10 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
        <span>Sources: ${sourcesList}</span>
        <span>Official Government Registrations</span>
      </div>
    </div>
  `;
}

/**
 * Renders an In-Article Advertisement placement block.
 */
function renderInArticleAd(): string {
  return `
    <div class="my-8 rounded-2xl border border-dashed border-border/80 bg-secondary/20 p-5 text-center">
      <span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
        Interactive Tools &amp; Resources
      </span>
      <div class="max-w-md mx-auto py-2">
        <p class="text-sm font-semibold text-foreground mb-3">
          Curious how common your own first or last name is across the United States?
        </p>
        <a href="/" class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
          Explore Your Name Statistics →
        </a>
      </div>
    </div>
  `;
}

/**
 * Parses a markdown table into clean, responsive HTML table.
 */
function parseTable(tableLines: string[]): string {
  if (tableLines.length < 2) return "";

  const rows = tableLines.map((line) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim())
  );

  const headerRow = rows[0];
  // Filter out markdown divider row like |---|---|
  const dataRows = rows.slice(1).filter((r) => !r.every((cell) => /^[-:]+$/.test(cell)));

  const theadHtml = `
    <thead class="bg-secondary/80 text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border">
      <tr>
        ${headerRow.map((h) => `<th scope="col" class="py-3 px-4">${parseInlineMarkdown(h)}</th>`).join("")}
      </tr>
    </thead>
  `;

  const tbodyHtml = `
    <tbody class="divide-y divide-border/60 text-sm">
      ${dataRows
        .map(
          (row) => `
        <tr class="hover:bg-secondary/20 transition-colors">
          ${row
            .map(
              (cell, i) =>
                `<td class="py-3 px-4 ${i === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}">${parseInlineMarkdown(
                  cell
                )}</td>`
            )
            .join("")}
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;

  return `
    <div class="my-6 overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
      <table class="w-full text-left border-collapse">
        ${theadHtml}
        ${tbodyHtml}
      </table>
    </div>
  `;
}

/**
 * Transforms an array of markdown-like blocks into richly formatted HTML.
 */
export function renderBlogContent(article: BlogArticle): string {
  const contentBlocks = article.content || [];
  const renderedParts: string[] = [];

  for (const rawBlock of contentBlocks) {
    const trimmed = rawBlock.trim();
    if (!trimmed) continue;

    // Check special tokens
    if (trimmed === "[DATA_SNAPSHOT]") {
      renderedParts.push(renderDataSnapshot(article.dataSnapshot));
      continue;
    }

    if (trimmed === "[ALPHABET_NAV]") {
      renderedParts.push(renderAlphabetNav());
      continue;
    }

    if (trimmed === "[AD]") {
      renderedParts.push(renderInArticleAd());
      continue;
    }

    // Split block into lines to process markdown structures
    const lines = trimmed.split("\n");
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const lineTrim = line.trim();

      if (!lineTrim) {
        i++;
        continue;
      }

      // Check Table Block
      if (lineTrim.startsWith("|") && lineTrim.endsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
          tableLines.push(lines[i].trim());
          i++;
        }
        renderedParts.push(parseTable(tableLines));
        continue;
      }

      // Check Blockquote / Quick Answer
      if (lineTrim.startsWith(">")) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith(">")) {
          quoteLines.push(lines[i].trim().replace(/^>\s*/, ""));
          i++;
        }
        const quoteText = parseInlineMarkdown(quoteLines.join(" "));
        renderedParts.push(`
          <div class="my-6 rounded-2xl border-l-4 border-primary bg-primary/5 p-5 md:p-6 text-foreground shadow-xs">
            <div class="text-sm md:text-base leading-relaxed font-medium">
              ${quoteText}
            </div>
          </div>
        `);
        continue;
      }

      // Check Headings
      if (lineTrim.startsWith("#### ")) {
        const headingText = lineTrim.slice(5).trim();
        renderedParts.push(
          `<h4 class="font-display text-lg font-bold text-foreground mt-6 mb-2">${parseInlineMarkdown(headingText)}</h4>`
        );
        i++;
        continue;
      }

      if (lineTrim.startsWith("### ")) {
        const headingText = lineTrim.slice(4).trim();
        renderedParts.push(
          `<h3 class="font-display text-xl font-bold text-foreground mt-8 mb-3">${parseInlineMarkdown(headingText)}</h3>`
        );
        i++;
        continue;
      }

      if (lineTrim.startsWith("## ")) {
        const headingText = lineTrim.slice(3).trim();

        // Check if this is an A–Z alphabet heading like "## A — Alaric"
        const azMatch = headingText.match(/^([A-Z])\s*—/);
        const anchorId = azMatch
          ? azMatch[1]
          : headingText
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");

        renderedParts.push(`
          <h2 id="${anchorId}" class="font-display text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4 pt-4 border-t border-border/50 scroll-mt-20 flex items-center justify-between">
            <span>${parseInlineMarkdown(headingText)}</span>
            ${azMatch ? `<a href="#top" class="text-xs text-muted-foreground font-normal hover:text-primary transition-colors">↑ Top</a>` : ""}
          </h2>
        `);
        i++;
        continue;
      }

      // Check Ordered List (e.g. 1. Item)
      if (/^\d+\.\s+/.test(lineTrim)) {
        const listItems: string[] = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
          i++;
        }
        renderedParts.push(`
          <ol class="my-4 list-decimal list-outside pl-6 space-y-3 text-muted-foreground leading-relaxed text-sm md:text-base">
            ${listItems.map((item) => `<li>${parseInlineMarkdown(item)}</li>`).join("")}
          </ol>
        `);
        continue;
      }

      // Check Unordered List (e.g. - Item or * Item)
      if (lineTrim.startsWith("- ") || lineTrim.startsWith("* ")) {
        const listItems: string[] = [];
        while (
          i < lines.length &&
          (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))
        ) {
          listItems.push(lines[i].trim().slice(2));
          i++;
        }
        renderedParts.push(`
          <ul class="my-4 list-disc list-outside pl-6 space-y-2 text-muted-foreground leading-relaxed text-sm md:text-base">
            ${listItems.map((item) => `<li>${parseInlineMarkdown(item)}</li>`).join("")}
          </ul>
        `);
        continue;
      }

      // Standard Paragraph
      const paragraphLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].trim().startsWith("#") &&
        !lines[i].trim().startsWith(">") &&
        !lines[i].trim().startsWith("|") &&
        !lines[i].trim().startsWith("- ") &&
        !lines[i].trim().startsWith("* ") &&
        !/^\d+\.\s+/.test(lines[i].trim())
      ) {
        paragraphLines.push(lines[i].trim());
        i++;
      }

      if (paragraphLines.length > 0) {
        const paragraphText = parseInlineMarkdown(paragraphLines.join(" "));
        renderedParts.push(
          `<p class="text-sm md:text-base text-muted-foreground leading-relaxed my-4">${paragraphText}</p>`
        );
      }
    }
  }

  return renderedParts.join("\n");
}
