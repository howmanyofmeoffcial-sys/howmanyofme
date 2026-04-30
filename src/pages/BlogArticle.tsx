import { useParams, Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { getBlogArticle, blogArticles, blogCategories } from "@/data/blogData";
import { Clock, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import RelatedPosts from "@/components/RelatedPosts";
import ToolCTA from "@/components/ToolCTA";
import AdSlot from "@/components/AdSlot";
import AlphabetJumpNav from "@/components/AlphabetJumpNav";
import DataSnapshot from "@/components/DataSnapshot";
import { getTagsForSlug } from "@/data/contentRegistry";
import type { BlogDataSnapshot } from "@/data/blogData";
import React from "react";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = getBlogArticle(slug || "");

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container py-20 text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const catLabel = blogCategories.find(c => c.id === article.category)?.label || "";
  const idx = blogArticles.findIndex(a => a.slug === article.slug);
  const prev = idx > 0 ? blogArticles[idx - 1] : null;
  const next = idx < blogArticles.length - 1 ? blogArticles[idx + 1] : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: { "@type": "Person", name: "Ziven Borceg", url: "https://medium.com/@zivenborceg" },
    publisher: { "@type": "Organization", name: "HowManyOfMe", url: "https://howmanyofme.co" },
  };

  const faqSchema = article.faqs && article.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const jsonLd: Record<string, unknown>[] = faqSchema ? [articleSchema, faqSchema] : [articleSchema];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={article.seoTitle ?? `${article.title} | HowManyOfMe Blog`}
        description={article.seoDescription ?? article.description}
        canonical={`https://howmanyofme.co/blog/${article.slug}`}
        jsonLd={jsonLd}
      />
      <SiteHeader />
      <main className="container py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/blog" className="hover:text-primary">Blog</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
        </nav>

        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
              {catLabel}
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{article.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">{article.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
              <span>By <strong className="text-foreground">Ziven Borceg</strong></span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{article.readTime} min read</span>
              <span>{new Date(article.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {article.content.map((block, i) => (
              <ContentBlock key={i} text={block} dataSnapshot={article.dataSnapshot} />
            ))}
          </div>

          {/* FAQ Section */}
          {article.faqs && article.faqs.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="font-display text-2xl md:text-3xl font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {article.faqs.map((f, i) => (
                  <details key={i} className="group rounded-xl border border-border bg-card/50 p-4 open:bg-card">
                    <summary className="cursor-pointer font-semibold text-foreground list-none flex items-start justify-between gap-3">
                      <span>{f.q}</span>
                      <ChevronRight className="h-4 w-4 mt-1 flex-shrink-0 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-muted-foreground leading-relaxed text-[15px]">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Embedded main tool — every blog post funnels to /name/* */}
          <ToolCTA variant="compact" />

          {/* Internal links */}
          <div className="mt-12 p-6 rounded-xl bg-secondary/50 border border-border">
            <h3 className="font-display text-lg font-bold mb-3">Explore More</h3>
            <div className="flex flex-wrap gap-2">
              <Link to="/tools/popularity-checker" className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:bg-primary/5 transition-colors">Name Popularity Checker</Link>
              <Link to="/tools/random-name" className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:bg-primary/5 transition-colors">Random Name Generator</Link>
              <Link to="/tools/baby-names" className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:bg-primary/5 transition-colors">Baby Name Ideas</Link>
              <Link to="/similar-names" className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:bg-primary/5 transition-colors">Similar Names Finder</Link>
              <Link to="/names/a" className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:bg-primary/5 transition-colors">Browse Names A–Z</Link>
            </div>
          </div>

          {/* Prev/Next */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev && (
              <Link to={`/blog/${prev.slug}`} className="group p-4 rounded-xl border border-border hover:bg-secondary/50 transition-colors">
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><ArrowLeft className="h-3 w-3" /> Previous</span>
                <span className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">{prev.title}</span>
              </Link>
            )}
            {next && (
              <Link to={`/blog/${next.slug}`} className="group p-4 rounded-xl border border-border hover:bg-secondary/50 transition-colors sm:text-right sm:ml-auto">
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1 sm:justify-end">Next <ArrowRight className="h-3 w-3" /></span>
                <span className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">{next.title}</span>
              </Link>
            )}
          </div>

          {/* Related Posts — lazy loaded, 12+ items, mixed articles & tools */}
          <RelatedPosts
            currentSlug={article.slug}
            tags={getTagsForSlug(article.slug)}
            count={12}
          />
        </article>
      </main>
      <SiteFooter />
    </div>
  );
};

// ----- Content rendering -----

interface Token {
  kind: "h2" | "h3" | "ul" | "ol" | "p" | "table" | "callout" | "ad";
  // For block tokens that hold lines
  lines?: string[];
  // For ad token
  label?: string;
}

function tokenize(text: string): Token[] {
  const lines = text.split("\n");
  const tokens: Token[] = [];
  let i = 0;
  let listBuf: { kind: "ul" | "ol"; lines: string[] } | null = null;
  let tableBuf: string[] | null = null;
  let calloutBuf: string[] | null = null;

  const flush = () => {
    if (listBuf) {
      tokens.push({ kind: listBuf.kind, lines: listBuf.lines });
      listBuf = null;
    }
    if (tableBuf) {
      tokens.push({ kind: "table", lines: tableBuf });
      tableBuf = null;
    }
    if (calloutBuf) {
      tokens.push({ kind: "callout", lines: calloutBuf });
      calloutBuf = null;
    }
  };

  while (i < lines.length) {
    const raw = lines[i];
    const t = raw.trim();
    if (!t) {
      flush();
      i++;
      continue;
    }
    // Ad break marker: [AD]
    if (t === "[AD]") {
      flush();
      tokens.push({ kind: "ad", label: "Advertisement" });
      i++;
      continue;
    }
    // Callout: lines wrapped between > start and > end
    if (t.startsWith("> ")) {
      if (!calloutBuf) calloutBuf = [];
      calloutBuf.push(t.slice(2));
      i++;
      continue;
    } else if (calloutBuf) {
      flush();
    }
    if (t.startsWith("### ")) {
      flush();
      tokens.push({ kind: "h3", lines: [t.slice(4)] });
      i++;
      continue;
    }
    if (t.startsWith("## ")) {
      flush();
      tokens.push({ kind: "h2", lines: [t.slice(3)] });
      i++;
      continue;
    }
    if (t.startsWith("|")) {
      if (!tableBuf) tableBuf = [];
      tableBuf.push(t);
      i++;
      continue;
    } else if (tableBuf) {
      flush();
    }
    if (t.startsWith("- ")) {
      if (!listBuf || listBuf.kind !== "ul") {
        flush();
        listBuf = { kind: "ul", lines: [] };
      }
      listBuf.lines.push(t.slice(2));
      i++;
      continue;
    }
    if (/^\d+\.\s/.test(t)) {
      if (!listBuf || listBuf.kind !== "ol") {
        flush();
        listBuf = { kind: "ol", lines: [] };
      }
      listBuf.lines.push(t.replace(/^\d+\.\s/, ""));
      i++;
      continue;
    }
    flush();
    tokens.push({ kind: "p", lines: [t] });
    i++;
  }
  flush();
  return tokens;
}

const ContentBlock = ({ text }: { text: string }) => {
  const tokens = tokenize(text);
  return (
    <div className="mb-8">
      {tokens.map((tok, i) => {
        switch (tok.kind) {
          case "h2":
            return <h2 key={i} className="font-display text-2xl font-bold mt-8 mb-4 text-foreground">{tok.lines![0]}</h2>;
          case "h3":
            return <h3 key={i} className="font-display text-xl font-bold mt-6 mb-3 text-foreground">{tok.lines![0]}</h3>;
          case "ul":
            return (
              <ul key={i} className="list-disc pl-6 space-y-1.5 mb-4 text-muted-foreground">
                {tok.lines!.map((l, j) => <li key={j}>{renderInlineMarkdown(l)}</li>)}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="list-decimal pl-6 space-y-1.5 mb-4 text-muted-foreground">
                {tok.lines!.map((l, j) => <li key={j}>{renderInlineMarkdown(l)}</li>)}
              </ol>
            );
          case "callout":
            return (
              <aside key={i} className="my-6 p-5 rounded-xl border-l-4 border-primary bg-primary/5">
                {tok.lines!.map((l, j) => <p key={j} className="text-foreground leading-relaxed">{renderInlineMarkdown(l)}</p>)}
              </aside>
            );
          case "ad":
            return (
              <div key={i} className="my-8">
                <AdSlot label={tok.label} />
              </div>
            );
          case "table":
            return <MarkdownTable key={i} rows={tok.lines!} />;
          case "p":
          default:
            return <p key={i} className="text-muted-foreground leading-relaxed mb-3">{renderInlineMarkdown(tok.lines![0])}</p>;
        }
      })}
    </div>
  );
};

function MarkdownTable({ rows }: { rows: string[] }) {
  // Skip separator row like |---|---|
  const cleanRows = rows.filter((r) => !/^\|\s*[-:|\s]+\|?\s*$/.test(r));
  const cells = cleanRows.map((r) =>
    r.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim())
  );
  if (cells.length === 0) return null;
  const [head, ...body] = cells;
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="text-left font-semibold px-4 py-2.5 text-foreground">{renderInlineMarkdown(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, i) => (
            <tr key={i} className="border-t border-border">
              {row.map((c, j) => (
                <td key={j} className="px-4 py-2.5 text-muted-foreground align-top">{renderInlineMarkdown(c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderInlineMarkdown(text: string): React.ReactNode {
  // Tokenize bold (**...**) and links [text](url)
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  const boldRe = /\*\*([^*]+)\*\*/g;

  // First split by links, keep non-link text as raw, then split raw by bold.
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  const pushRaw = (s: string) => {
    if (!s) return;
    let lastB = 0;
    let m: RegExpExecArray | null;
    boldRe.lastIndex = 0;
    while ((m = boldRe.exec(s)) !== null) {
      if (m.index > lastB) out.push(s.slice(lastB, m.index));
      out.push(<strong key={`b-${key++}`} className="text-foreground font-semibold">{m[1]}</strong>);
      lastB = m.index + m[0].length;
    }
    if (lastB < s.length) out.push(s.slice(lastB));
  };

  let lm: RegExpExecArray | null;
  while ((lm = linkRe.exec(text)) !== null) {
    if (lm.index > last) pushRaw(text.slice(last, lm.index));
    const label = lm[1];
    const url = lm[2];
    if (url.startsWith("/")) {
      out.push(<Link key={`l-${key++}`} to={url} className="text-primary hover:underline">{label}</Link>);
    } else {
      out.push(
        <a
          key={`l-${key++}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {label}
        </a>,
      );
    }
    last = lm.index + lm[0].length;
  }
  if (last < text.length) pushRaw(text.slice(last));
  return <>{out}</>;
}

export default BlogArticle;
