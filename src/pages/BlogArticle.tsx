import { useParams, Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { getBlogArticle, blogArticles, blogCategories } from "@/data/blogData";
import { Clock, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import RelatedPosts from "@/components/RelatedPosts";
import ToolCTA from "@/components/ToolCTA";
import { getTagsForSlug } from "@/data/contentRegistry";

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
  const related = blogArticles.filter(a => a.category === article.category && a.slug !== article.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: { "@type": "Person", name: "Ziven Borceg", url: "https://medium.com/@zivenborceg" },
    publisher: { "@type": "Organization", name: "HowManyOfMe", url: "https://howmanyofme.co" },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${article.title} | HowManyOfMe Blog`}
        description={article.description}
        canonical={`https://howmanyofme.co/blog/${article.slug}`}
        jsonLd={jsonLd}
      />
      <SiteHeader />
      <main className="container py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
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
            {article.content.map((block, i) => {
              // Parse markdown-ish content
              const lines = block.split("\n");
              return (
                <div key={i} className="mb-8">
                  {lines.map((line, j) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;
                    if (trimmed.startsWith("### ")) return <h3 key={j} className="font-display text-xl font-bold mt-6 mb-3 text-foreground">{trimmed.slice(4)}</h3>;
                    if (trimmed.startsWith("## ")) return <h2 key={j} className="font-display text-2xl font-bold mt-8 mb-4 text-foreground">{trimmed.slice(3)}</h2>;
                    if (trimmed.startsWith("- ")) return <li key={j} className="text-muted-foreground ml-4 mb-1 list-disc">{renderInlineMarkdown(trimmed.slice(2))}</li>;
                    if (trimmed.startsWith("|")) return <div key={j} className="text-sm text-muted-foreground font-mono overflow-x-auto">{trimmed}</div>;
                    if (/^\d+\.\s/.test(trimmed)) return <li key={j} className="text-muted-foreground ml-4 mb-1 list-decimal">{renderInlineMarkdown(trimmed.replace(/^\d+\.\s/, ""))}</li>;
                    if (trimmed.startsWith("```")) return null;
                    return <p key={j} className="text-muted-foreground leading-relaxed mb-3">{renderInlineMarkdown(trimmed)}</p>;
                  })}
                </div>
              );
            })}
          </div>

          {/* Embedded main tool — every blog post funnels to /name/* */}
          <ToolCTA variant="compact" />

          {/* Internal links */}
          <div className="mt-12 p-6 rounded-xl bg-secondary/50 border border-border">
            <h3 className="font-display text-lg font-bold mb-3">Explore More</h3>
            <div className="flex flex-wrap gap-2">
              <Link to="/tools/popularity-checker" className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:bg-primary/5 transition-colors">Name Popularity Checker</Link>
              <Link to="/tools/random-name" className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:bg-primary/5 transition-colors">Random Name Generator</Link>
              <Link to="/tools/baby-names" className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:bg-primary/5 transition-colors">Baby Name Ideas</Link>
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

function renderInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default BlogArticle;
