import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { getSimilarNamesFor, getNameContext } from "@/lib/similarNames";
import { detectGender } from "@/lib/genderDetection";
import { formatNumber } from "@/data/nameData";
import { buildSimilarIntro, buildSimilarFaqs } from "@/lib/dynamicContent";
import DataSources from "@/components/DataSources";

const SimilarNamesDetail = () => {
  const { name = "" } = useParams<{ name: string }>();

  const { display, lower, similar, ctx, gender, intro, faqs } = useMemo(() => {
    const lower = name.toLowerCase();
    const display = lower.charAt(0).toUpperCase() + lower.slice(1);
    const similar = getSimilarNamesFor(display, 24);
    const ctx = getNameContext(display);
    const gender = detectGender(display);
    const dynCtx = {
      name: display,
      origin: ctx.origin,
      meaning: ctx.meaning,
      rank: ctx.rank,
      count: ctx.count,
      similarSample: similar.combined.slice(0, 5),
      formatNumber,
    };
    const intro = buildSimilarIntro(dynCtx);
    const faqs = buildSimilarFaqs(dynCtx);
    return { display, lower, similar, ctx, gender, intro, faqs };
  }, [name]);

  const previewList = similar.combined.slice(0, 4).join(", ") || "Aaron, Aiden, Alan";

  const title = `Names Similar to ${display} — ${similar.combined.length}+ Alternatives`;
  const desc = `Names similar to ${display} include ${previewList}, and more. See popularity, meaning, and rarity for every match. Free, instant.`;
  const canonical = `https://howmanyofme.co/similar-names/${lower}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      url: canonical,
      description: desc,
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://howmanyofme.co/" },
          { "@type": "ListItem", position: 2, name: "Similar Names", item: "https://howmanyofme.co/similar-names" },
          { "@type": "ListItem", position: 3, name: `Similar to ${display}`, item: canonical },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Names similar to ${display}`,
      itemListElement: similar.combined.map((n, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://howmanyofme.co/similar-names/${n.toLowerCase()}`,
        name: n,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={title} description={desc} canonical={canonical} jsonLd={jsonLd} />
      <SiteHeader />
      <main className="container py-8">
        <Breadcrumbs
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Similar Names", href: "/similar-names" },
            { label: display },
          ]}
        />

        {/* HERO */}
        <header className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Names Similar To {display}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            <strong>Short answer:</strong> Names similar to {display} include{" "}
            <span className="text-foreground font-medium">{previewList}</span>, and more — based on shared sound,
            starting letter, and length.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            <div className="p-3 rounded-lg border border-border bg-card">
              <div className="text-xs text-muted-foreground">Similar names</div>
              <div className="font-bold text-xl">{similar.combined.length}</div>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card">
              <div className="text-xs text-muted-foreground">Name length</div>
              <div className="font-bold text-xl">{display.length}</div>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card">
              <div className="text-xs text-muted-foreground">Starts with</div>
              <div className="font-bold text-xl">{display.charAt(0).toUpperCase()}</div>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card">
              <div className="text-xs text-muted-foreground">Gender ({gender.confidence}%)</div>
              <div className="font-bold text-xl capitalize">{gender.gender}</div>
            </div>
          </div>
        </header>

        {/* SIMILAR LIST */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-4">All Names Similar to {display}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {similar.combined.map((n) => (
              <div
                key={n}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors"
              >
                <Link to={`/name/${n}`} className="font-semibold hover:text-primary">
                  {n}
                </Link>
                <div className="flex gap-1">
                  <Link
                    to={`/name/${n}`}
                    className="text-xs px-2 py-1 rounded bg-secondary hover:bg-primary/10 hover:text-primary"
                    aria-label={`Stats for ${n}`}
                  >
                    Stats
                  </Link>
                  <Link
                    to={`/similar-names/${n.toLowerCase()}`}
                    className="text-xs px-2 py-1 rounded bg-secondary hover:bg-primary/10 hover:text-primary"
                    aria-label={`Similar to ${n}`}
                  >
                    Similar
                  </Link>
                </div>
              </div>
            ))}
            {similar.combined.length === 0 && (
              <p className="col-span-full text-muted-foreground text-sm">
                No similar matches yet for {display}. Try the{" "}
                <Link to="/similar-names" className="text-primary hover:underline">
                  Similar Names finder
                </Link>{" "}
                or browse the <Link to={`/names/${display.charAt(0).toLowerCase()}`} className="text-primary hover:underline">
                  {display.charAt(0).toUpperCase()} directory
                </Link>.
              </p>
            )}
          </div>
        </section>

        {/* SEO content block */}
        <section className="prose-content max-w-3xl mb-12">
          <h2>About the Name {display}</h2>
          <p>
            <strong>{display}</strong> is a first name of {ctx.origin} origin meaning "{ctx.meaning}." With an
            estimated {formatNumber(ctx.count)} living bearers worldwide and a popularity rank near #{ctx.rank},{" "}
            {display} sits among the {ctx.rank < 1000 ? "more recognizable" : "less common"} first names in our
            dataset.
          </p>
          <p>
            The names listed above are considered similar to {display} for one or more reasons: they share the same
            starting letter ({display.charAt(0).toUpperCase()}), they have a comparable length ({display.length}{" "}
            characters), or they sound alike (small phonetic edit distance). This makes them strong candidates for
            parents searching for a {display}-style baby name, writers building name sets for related characters,
            or anyone exploring the broader name family around {display}.
          </p>
          <p>
            Want deeper insights? Open the{" "}
            <Link to={`/name/${display}`} className="text-primary hover:underline">
              full {display} statistics page
            </Link>{" "}
            for global bearer counts, US SSA rank, decade-by-decade popularity, and the gender split — or jump to
            our <Link to="/tools/popularity-checker" className="text-primary hover:underline">popularity checker</Link>{" "}
            and <Link to="/tools/name-comparison" className="text-primary hover:underline">name comparison tool</Link>.
          </p>
        </section>

        {/* INTERNAL LINKING */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="font-bold mb-3">Names starting with {display.charAt(0).toUpperCase()}</h3>
            <div className="flex flex-wrap gap-2">
              {similar.startsWith.slice(0, 12).map((n) => (
                <Link
                  key={n}
                  to={`/similar-names/${n.toLowerCase()}`}
                  className="text-sm px-2.5 py-1 rounded-md bg-secondary hover:bg-primary/10 hover:text-primary"
                >
                  {n}
                </Link>
              ))}
            </div>
            <Link
              to={`/names/${display.charAt(0).toLowerCase()}`}
              className="mt-3 inline-flex text-sm text-primary hover:underline"
            >
              See all {display.charAt(0).toUpperCase()} names →
            </Link>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="font-bold mb-3">Names with {display.length} letters</h3>
            <div className="flex flex-wrap gap-2">
              {similar.sameLength.slice(0, 12).map((n) => (
                <Link
                  key={n}
                  to={`/similar-names/${n.toLowerCase()}`}
                  className="text-sm px-2.5 py-1 rounded-md bg-secondary hover:bg-primary/10 hover:text-primary"
                >
                  {n}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mb-12">
          <h2 className="font-display text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-2">What names are similar to {display}?</h3>
              <p className="text-sm text-muted-foreground">
                Names similar to {display} include {similar.combined.slice(0, 8).join(", ") || "—"}. They share
                starting letter, length, or sound.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-2">What does {display} mean?</h3>
              <p className="text-sm text-muted-foreground">
                {display} is of {ctx.origin} origin and means "{ctx.meaning}".
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-2">Is {display} a rare name?</h3>
              <p className="text-sm text-muted-foreground">
                {display} ranks around #{ctx.rank}, with roughly {formatNumber(ctx.count)} known bearers
                {ctx.rank < 100
                  ? " — making it very common."
                  : ctx.rank < 1000
                  ? " — making it common but not in the very top tier."
                  : " — making it uncommon."}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <div className="font-bold">See full statistics for {display}</div>
              <div className="text-sm text-muted-foreground">
                Bearer counts, decade trends, gender split, and global distribution.
              </div>
            </div>
          </div>
          <Link
            to={`/name/${display}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" /> Open Name Statistics Tool <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default SimilarNamesDetail;
