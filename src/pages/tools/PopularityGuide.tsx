import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { CheckCircle, ArrowRight } from "lucide-react";
import RelatedPosts from "@/components/RelatedPosts";
import DataFreshness from "@/components/DataFreshness";
import {
  FeatureGrid,
  ProsCons,
  ComparisonTable,
  UseCases,
  RelatedToolsInline,
} from "@/components/EntitySEOSections";

const steps = [
  { title: "Enter a Name", desc: "Type any first name into the search box. Our tool accepts names from any origin, language, or cultural tradition." },
  { title: "View the Results", desc: "You'll see the estimated number of people with that name, its global popularity rank, and a gender distribution breakdown." },
  { title: "Explore Historical Trends", desc: "The decade popularity chart shows how the name's popularity has changed from the 1880s to today." },
  { title: "Check Regional Data", desc: "See how the name is distributed across the US, UK, Canada, Australia and 76 other countries." },
  { title: "Discover Similar Names", desc: "Find related names, alternative spellings, and names with similar origins or meanings." },
  { title: "Compare Names", desc: "Use the comparison tool to see two names side by side with statistical analysis." },
];

const FAQS = [
  { q: "What is the Name Popularity Checker?", a: "It's a free tool that returns a name's global rank, estimated bearer count, gender split, decade trends and country distribution — all from official birth-registry data." },
  { q: "What data sources does the checker use?", a: "U.S. Social Security Administration (1880–present), UK Office for National Statistics, Statistics Canada, plus aggregated census data from 78 additional countries." },
  { q: "How accurate is the popularity data?", a: "For a name with more than 1,000 bearers, estimates are typically within ±5% of the true count, calculated using actuarial life tables on historical birth data." },
  { q: "Why use the spelling that's most common?", a: "Statistical aggregation works best on the canonical spelling. 'Catherine' and 'Katherine' are tracked separately — pick the one most relevant to you." },
  { q: "Can I check uncommon or international names?", a: "Yes. The database covers 100,000+ names across 80+ countries. Even rare names return a 'likely fewer than X bearers' estimate." },
  { q: "How often is the data updated?", a: "Annually, every January, with the previous calendar year's birth registry release." },
  { q: "Is the guide and tool free?", a: "Yes — both are free, unlimited and require no signup." },
  { q: "What's the difference between rank and count?", a: "Rank is the name's position in the all-time ordered list (e.g. #15). Count is the estimated number of living people with the name (e.g. ~580k)." },
  { q: "Does the tool work on mobile?", a: "Yes — fully responsive, works on iOS and Android browsers." },
  { q: "Can I share my result?", a: "Yes, name pages have stable URLs you can copy and share." },
];

const PopularityGuide = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "How to Use the Name Popularity Checker: Step-by-Step Guide",
      description: "A complete step-by-step guide to using the HowManyOfMe Name Popularity Checker for accurate name statistics, historical trends and regional rankings.",
      author: { "@type": "Organization", name: "HowManyOfMe" },
      publisher: { "@type": "Organization", name: "HowManyOfMe", url: "https://howmanyofme.co" },
      mainEntityOfPage: "https://howmanyofme.co/tools/popularity-guide",
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to use the Name Popularity Checker",
      step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.desc })),
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://howmanyofme.co/" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://howmanyofme.co/tools" },
        { "@type": "ListItem", position: 3, name: "Popularity Checker Guide", item: "https://howmanyofme.co/tools/popularity-guide" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="How to Use the Name Popularity Checker — Step-by-Step Guide"
        description="Complete step-by-step guide to using the HowManyOfMe Name Popularity Checker. Learn to read rank, decade trends, regional data and more."
        canonical="https://howmanyofme.co/tools/popularity-guide"
        jsonLd={jsonLd}
      />
      <SiteHeader />
      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-4">How to Use the Name Popularity Checker</h1>
        <p className="text-muted-foreground mb-2 text-lg">
          A complete six-step guide to extracting maximum insight from the{" "}
          <Link to="/tools/popularity-checker" className="text-primary hover:underline">Name Popularity Checker</Link>.
        </p>
        <p className="text-sm text-muted-foreground mb-10">
          New here? Start with the{" "}
          <Link to="/tools/popularity-checker" className="text-primary hover:underline">Popularity Checker</Link> itself, then return for the deeper walkthrough below.
        </p>

        {/* INSTANT ANSWER */}
        <section className="mb-10 p-6 rounded-xl border border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold mb-2">What does the Name Popularity Checker do?</h2>
          <p className="text-muted-foreground">
            The <strong>Name Popularity Checker</strong> takes any first name and returns five attributes from official birth-registry data: <strong>global rank</strong>, <strong>estimated living bearers</strong>, <strong>decade-by-decade trend</strong>, <strong>gender distribution</strong> and <strong>country breakdown</strong>. This guide walks you through reading each metric in under five minutes.
          </p>
        </section>

        <div className="space-y-6 mb-12">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{i + 1}</div>
              <div>
                <h2 className="font-display text-lg font-bold mb-1">{step.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 mb-12">
          <h2 className="font-display text-xl font-bold mb-3">Tips for Best Results</h2>
          <ul className="space-y-2">
            {[
              "Use the standard spelling for the most accurate aggregated data",
              "Try alternative spellings to compare variants (e.g. Catherine vs Katherine)",
              "Read the decade chart to see whether a name is rising, falling or stable",
              "Use the comparison tool when deciding between two finalists",
              "Use the Trend Visualizer for 3- or 4-name multi-line comparisons",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <FeatureGrid title="What the Checker Tells You" features={[
          { title: "Global rank", description: "Ordinal position out of all recorded first names worldwide." },
          { title: "Estimated bearer count", description: "Number of living people who share the name, adjusted via actuarial life tables." },
          { title: "Decade popularity score", description: "0–100 normalized score for each decade from 1880s to 2020s." },
          { title: "Gender distribution", description: "Percentage split between male, female and unisex usage." },
          { title: "Country breakdown", description: "Per-country bearer counts for 80+ nations." },
          { title: "Direct name page link", description: "Each lookup links to a dedicated SEO-optimized name page with all metrics." },
        ]} />

        <UseCases cases={[
          { who: "First-time tool users", scenario: "Want to understand what every metric on the result card means.", outcome: "Walk through this 6-step guide once and you'll read future results in seconds." },
          { who: "Researchers citing the data", scenario: "Need to know the data sources for academic publication.", outcome: "Step-by-step covers SSA, ONS and methodology — link in your citation." },
          { who: "Parents comparing 5+ names", scenario: "Have a long shortlist and need an efficient workflow.", outcome: "Guide explains when to use Popularity Checker vs Comparison vs Trend Visualizer for max efficiency." },
          { who: "Casual curious users", scenario: "Just want to check their own name once.", outcome: "Steps 1–2 are enough; the rest unlocks deeper analysis if you want it." },
        ]} />

        <ProsCons
          pros={["Six clear steps — readable in under 5 minutes", "Includes data-source explanation", "Cross-links to companion tools (Comparison, Trend Visualizer)", "Free guide, free tool, no signup", "Works as both a tutorial and a reference"]}
          cons={["Step 4 (regional data) requires opening the full name page — not on the checker card", "No video walkthrough yet (roadmap)", "Methodology details are deeper on the dedicated /methodology page"]}
        />

        <ComparisonTable title="HowManyOfMe vs Other Name-Stats Resources" toolName="HowManyOfMe" rows={[
          { feature: "Step-by-step guide", ours: "✓ Dedicated page", babyCenter: "Help docs", nameberry: "Help docs", ssa: "PDF reports" },
          { feature: "Decade trends in tool", ours: "✓ Visual chart", babyCenter: "Partial", nameberry: "Partial", ssa: "✓ Raw data" },
          { feature: "Country breakdowns", ours: "✓ 80+ countries", babyCenter: "US only", nameberry: "Mostly US/UK", ssa: "US only" },
          { feature: "Free + no signup", ours: "✓", babyCenter: "Limited", nameberry: "Premium-gated", ssa: "✓" },
          { feature: "Bearer-count estimates", ours: "✓ With life-table adjustment", babyCenter: "✗", nameberry: "✗", ssa: "✗" },
          { feature: "Multi-tool ecosystem", ours: "✓ 9 tools cross-linked", babyCenter: "Few tools", nameberry: "Multiple", ssa: "Single dataset" },
        ]} />

        {/* FAQ */}
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <details key={f.q} className="p-5 border rounded-xl group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">{f.q}<span className="text-primary group-open:rotate-180 transition">▾</span></summary>
                <p className="text-sm text-muted-foreground mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <RelatedToolsInline tools={[
          { to: "/tools/popularity-checker", name: "Popularity Checker", blurb: "The actual tool this guide explains — go run a lookup now." },
          { to: "/tools/name-comparison", name: "Name Comparison", blurb: "Use this when you have exactly two finalists to compare." },
          { to: "/tools/trend-visualizer", name: "Trend Visualizer", blurb: "Use this for 3 or 4 names on one chart with country filtering." },
          { to: "/methodology", name: "Methodology", blurb: "Deep technical doc on data sources, formulas and accuracy bounds." },
        ]} />

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/tools/popularity-checker" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Try the Popularity Checker <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/tools/name-comparison" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card font-semibold text-sm hover:bg-secondary transition-colors">
            Compare Two Names <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/tools/trend-visualizer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card font-semibold text-sm hover:bg-secondary transition-colors">
            Plot 4 Names <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <DataFreshness toolName="Popularity Checker Guide" />
        <RelatedPosts currentSlug="popularity-guide" tags={["guide", "popularity", "help", "charts", "statistics"]} count={12} />
      </main>
      <SiteFooter />
    </div>
  );
};

export default PopularityGuide;
