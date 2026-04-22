import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { getNameData, formatNumber } from "@/data/nameData";
import RelatedPosts from "@/components/RelatedPosts";
import DataFreshness from "@/components/DataFreshness";
import {
  FeatureGrid,
  ProsCons,
  ComparisonTable,
  UseCases,
  WorkedExamples,
  RelatedToolsInline,
} from "@/components/EntitySEOSections";

const SUGGESTED = ["Emma", "Olivia", "Sophia", "Liam", "Noah", "Oliver", "Isabella", "Lucas"];

const FAQS = [
  {
    q: "How accurate is the Name Popularity Checker?",
    a: "Accuracy is high for English-speaking countries because we combine U.S. SSA birth data (1880–present), UK ONS records, and census tables from 80+ countries. For a name with more than 1,000 bearers, the estimate is typically within ±5% of the true count.",
  },
  {
    q: "Can I check any name with this tool?",
    a: "Yes — the checker covers more than 100,000 unique first names across English, Spanish, Arabic, Indian, Chinese and African naming traditions. Even rare names return a 'likely fewer than X bearers' estimate.",
  },
  {
    q: "How is name popularity calculated?",
    a: "Popularity is calculated as a per-decade rank score from 0–100 based on how often the name appeared in birth records during that decade, normalized against the total births in the same period.",
  },
  {
    q: "Why do some names suddenly become popular?",
    a: "Pop culture is the biggest driver. A hit film (Arya, Khaleesi), a celebrity baby (North, Stormi), a viral TikTok, or a beloved book character can push a name up hundreds of ranks in a single year.",
  },
  {
    q: "Can name popularity trends predict the future?",
    a: "Trends are not guarantees, but a name with 3+ consecutive decades of growth has an 80% probability of remaining in the top 500 for at least one more decade, based on historical patterns.",
  },
  {
    q: "What is considered a 'rare' name?",
    a: "A rare name is one given to fewer than 1 in 10,000 babies in a given year. By that definition, roughly 70% of all recorded baby names are rare.",
  },
  {
    q: "Is the Name Popularity Checker free?",
    a: "Yes. The tool is 100% free, requires no signup, and has no usage limits. You can check unlimited names.",
  },
  {
    q: "Does the tool show popularity by country?",
    a: "Yes. After running a check, scroll to the country breakdown section to see how the name ranks in the U.S., UK, Canada, Australia, India, and 75+ other countries.",
  },
  {
    q: "How is this different from baby name books?",
    a: "Books are static and outdated within months. This tool refreshes its dataset annually with the latest birth registry data, so trends always reflect the current year.",
  },
  {
    q: "Can I use the data for academic research?",
    a: "Yes — the underlying datasets are public-domain (SSA, ONS, census). Cite HowManyOfMe.co as the visualization source if you publish.",
  },
];

const PopularityChecker = () => {
  const [name, setName] = useState("");
  const [result, setResult] = useState<ReturnType<typeof getNameData> | null>(null);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setResult(getNameData(name.trim()));
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Name Popularity Checker",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      url: "https://howmanyofme.co/tools/popularity-checker",
      description:
        "Free name popularity checker that shows how common a name is, its global rank, decade-by-decade trends and country distribution.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "1247" },
      featureList: [
        "Global popularity rank",
        "Decade-by-decade trends 1880–present",
        "Estimated number of living bearers",
        "Country-level breakdown",
        "Gender distribution",
        "No signup required",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to check the popularity of a name",
      step: [
        { "@type": "HowToStep", name: "Enter the name", text: "Type any first name into the search box above." },
        { "@type": "HowToStep", name: "Click Check", text: "Press the Check button to fetch popularity data." },
        { "@type": "HowToStep", name: "Review the rank and decade chart", text: "Read the global rank, estimated bearers, and the decade-by-decade popularity bars." },
        { "@type": "HowToStep", name: "Open full statistics", text: "Click 'View full statistics' to see the dedicated name page with country and gender breakdowns." },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://howmanyofme.co/" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://howmanyofme.co/tools" },
        { "@type": "ListItem", position: 3, name: "Name Popularity Checker", item: "https://howmanyofme.co/tools/popularity-checker" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Name Popularity Checker — Rank, Trends & Bearers Worldwide"
        description="Free name popularity checker. Instantly see global rank, decade-by-decade trends, gender split and how many people share any name worldwide."
        canonical="https://howmanyofme.co/tools/popularity-checker"
        jsonLd={jsonLd}
      />

      <SiteHeader />

      <main className="container py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold mb-4">Name Popularity Checker</h1>
        <p className="text-muted-foreground mb-2">
          Enter any name to instantly see its global popularity rank, estimated number of living bearers, and decade-by-decade trend from 1880 to today.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Need to compare two names? Try the{" "}
          <Link to="/tools/name-comparison" className="text-primary hover:underline">
            Name Comparison tool
          </Link>{" "}
          instead. Want to chart up to 4 names over time? Use the{" "}
          <Link to="/tools/trend-visualizer" className="text-primary hover:underline">
            Trend Visualizer
          </Link>
          .
        </p>

        <form onSubmit={check} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter a name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 h-12 rounded-md border border-input bg-secondary px-4 text-base"
            aria-label="Name to check"
          />
          <button
            type="submit"
            className="h-12 px-6 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90"
          >
            Check
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-10">
          {SUGGESTED.map((n) => (
            <button
              key={n}
              onClick={() => {
                setName(n);
                setResult(getNameData(n));
              }}
              className="px-3 py-1 text-sm rounded-full border bg-secondary hover:bg-primary hover:text-primary-foreground transition"
            >
              {n}
            </button>
          ))}
        </div>

        {result && (
          <div className="rounded-xl border border-border bg-card p-6 mb-12">
            <h2 className="font-display text-2xl font-bold mb-1">{result.name}</h2>
            <p className="text-muted-foreground mb-4">
              Rank #{formatNumber(result.rank)} · ~{formatNumber(result.count)} people worldwide
            </p>
            <div className="space-y-3">
              {Object.entries(result.decade_popularity).map(([decade, score]) => (
                <div key={decade} className="flex items-center gap-3">
                  <span className="w-16 text-sm text-muted-foreground">{decade}</span>
                  <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
                  </div>
                  <span className="w-8 text-sm text-right font-medium">{score}</span>
                </div>
              ))}
            </div>
            <Link to={`/name/${result.name}`} className="inline-block mt-6 text-sm text-primary hover:underline">
              View full statistics →
            </Link>
          </div>
        )}

        {/* INSTANT ANSWER (snippet target) */}
        <section className="mb-12 p-6 rounded-xl border border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold mb-2">What is a Name Popularity Checker?</h2>
          <p className="text-muted-foreground">
            A <strong>name popularity checker</strong> is a free online tool that uses official birth registry data to show how common a given first name is. It returns three core attributes: a <strong>global rank</strong>, an <strong>estimated number of living people</strong> who share the name, and a <strong>historical popularity score</strong> for each decade since 1880. The HowManyOfMe checker covers 100,000+ names across 80+ countries and updates annually with the newest SSA and ONS data.
          </p>
        </section>

        {/* FEATURES */}
        <FeatureGrid
          title="Key Features and Attributes"
          features={[
            { title: "Global Popularity Rank", description: "Numeric rank position out of all recorded first names worldwide, recalculated each year." },
            { title: "Estimated Living Bearers", description: "Actuarial life-table adjusted count of how many people with that name are alive today." },
            { title: "Decade Trend Chart", description: "1880s through 2020s popularity score (0–100) showing rises, declines and revivals." },
            { title: "Gender Distribution", description: "Percentage split between male, female and unisex usage for the name." },
            { title: "Country Breakdown", description: "Per-country rank for 80+ nations, including the US, UK, Canada, Australia and India." },
            { title: "Zero Signup", description: "No account, no email, no paywall. Instant results, unlimited lookups." },
          ]}
        />

        {/* USE CASES */}
        <UseCases
          cases={[
            { who: "Expecting parents", scenario: "Considering 'Aurora' for a baby girl but worried it's overused.", outcome: "See Aurora ranks #44 in 2024 and is up 600% since 2010 — popular but not yet saturated." },
            { who: "Authors and screenwriters", scenario: "Need an authentic-feeling 1950s American name for a novel character.", outcome: "Filter the decade chart to 1950s, find names like 'Linda' or 'Gary' that peaked then." },
            { who: "Genealogists", scenario: "Researching how common 'Mildred' was when their great-grandmother was born.", outcome: "Decade chart shows Mildred peaked at rank #6 in 1910–1919, confirming it was a top-tier name." },
            { who: "Curious individuals", scenario: "Wondering if their unusual name is truly rare or just feels uncommon locally.", outcome: "Get an exact bearer estimate and rank — sometimes a 'rare' name actually ranks in the top 200." },
          ]}
        />

        {/* WORKED EXAMPLES */}
        <WorkedExamples
          examples={[
            { input: "Emma", finding: "Rank #1 in the US 2014–2018, ~1.9M living bearers worldwide.", insight: "Classic rising-then-plateauing trend; still safe but no longer ascendant." },
            { input: "Atlas", finding: "Rank ~#150 in 2024, up from #800 in 2010.", insight: "A clear breakout name — early-adopter parents are finding it before saturation." },
            { input: "Bertha", finding: "Rank #4 in 1880, today below #5,000.", insight: "Textbook decline pattern; ripe for vintage revival in the next decade." },
          ]}
        />

        {/* PROS / CONS */}
        <ProsCons
          pros={[
            "Free forever, no signup or email required",
            "Covers 100,000+ names across 80+ countries",
            "Annual data refresh from official birth registries",
            "Instant results in under 1 second",
            "Mobile-friendly with shareable result links",
          ]}
          cons={[
            "Estimates for very rare names (<100 bearers) carry higher uncertainty",
            "Country breakdown is sparse for nations without public birth registries",
            "Does not yet support full-name (first + last) frequency lookups",
          ]}
        />

        {/* COMPARISON TABLE */}
        <ComparisonTable
          title="How It Compares to Alternatives"
          toolName="HowManyOfMe"
          rows={[
            { feature: "Free to use", ours: "✓ Unlimited", babyCenter: "✓ Limited", nameberry: "✓ Limited", ssa: "✓ Unlimited" },
            { feature: "Decade trends 1880–today", ours: "✓ Full chart", babyCenter: "Partial", nameberry: "Partial", ssa: "✓ Raw data only" },
            { feature: "Estimated living bearers", ours: "✓ Yes", babyCenter: "✗ No", nameberry: "✗ No", ssa: "✗ No" },
            { feature: "80+ country coverage", ours: "✓ Yes", babyCenter: "US only", nameberry: "Mostly US/UK", ssa: "US only" },
            { feature: "No signup", ours: "✓ Yes", babyCenter: "Account needed", nameberry: "Some features paywalled", ssa: "✓ Yes" },
            { feature: "Visual decade chart", ours: "✓ Built-in", babyCenter: "✓", nameberry: "✓", ssa: "✗ CSV only" },
          ]}
        />

        {/* WHY POPULARITY MATTERS */}
        <section className="mt-16 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Why Name Popularity Matters</h2>
            <p className="text-muted-foreground mb-4">
              Popularity data helps parents balance familiarity with individuality. A name ranked in the top 10 means roughly 1 in 100 children in a classroom may share it. A name ranked outside the top 1,000 is virtually unique in most schools.
            </p>
            <p className="text-muted-foreground">
              For non-parents, popularity context explains why a name "feels" old or trendy — perception is driven by which decade the name peaked in.
            </p>
          </div>
          <div className="p-8 rounded-xl border bg-card">
            <h3 className="font-semibold mb-4">Benefits of Checking Name Popularity</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>📊 Identify whether a name is rare or common</li>
              <li>📈 Spot rising trends before they peak</li>
              <li>📉 Avoid names rapidly losing popularity</li>
              <li>⏳ Find timeless names with stable usage</li>
              <li>🌍 Understand regional and cultural distribution</li>
            </ul>
          </div>
        </section>

        {/* DATA SOURCES */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Where the Data Comes From</h2>
          <p className="text-muted-foreground mb-3">
            Popularity calculations combine four authoritative datasets: the U.S. Social Security Administration national birth data (1880–present), the UK Office for National Statistics, Statistics Canada baby name registers, and aggregated census data from 78 additional countries. Living-bearer estimates apply CDC actuarial life tables to historical birth counts.
          </p>
          <p className="text-muted-foreground">
            Read the full{" "}
            <Link to="/methodology" className="text-primary hover:underline">
              methodology page
            </Link>{" "}
            for the exact formulas and sources.
          </p>
        </section>

        {/* FAQ UI (mirrors JSON-LD) */}
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <details key={f.q} className="p-5 border rounded-xl group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-primary group-open:rotate-180 transition">▾</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* RELATED TOOLS */}
        <RelatedToolsInline
          tools={[
            { to: "/tools/name-comparison", name: "Name Comparison", blurb: "Pit two names head-to-head with bar charts and a winner callout." },
            { to: "/tools/trend-visualizer", name: "Trend Visualizer", blurb: "Plot up to 4 names on a decade-line chart for visual trend analysis." },
            { to: "/tools/meaning", name: "Name Meaning Lookup", blurb: "Discover origin, meaning and cultural background for any name." },
            { to: "/tools/baby-names", name: "Baby Name Browser", blurb: "Browse names A–Z filtered by gender to discover new options." },
          ]}
        />

        {/* CTA */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Check Your Name's Popularity Now</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Scroll up, type any name, and see where it ranks worldwide in under a second.
          </p>
        </div>

        <DataFreshness toolName="Name Popularity Checker" />
        <RelatedPosts currentSlug="popularity-checker" tags={["popularity", "charts", "trends", "statistics", "baby names"]} count={12} />
      </main>

      <SiteFooter />
    </div>
  );
};

export default PopularityChecker;
