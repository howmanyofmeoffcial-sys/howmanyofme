"use client";

import { useState } from "react";
import Link from "next/link";
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

const FAQS = [
  {
    q: "What is a name popularity comparison tool?",
    a: "It is a free utility that takes two first names, queries the same historical birth-registry dataset for both, and renders the rank, estimated bearer count, and decade trend side-by-side so you can see exactly which name is more common.",
  },
  {
    q: "Why should parents compare baby names?",
    a: "Comparing eliminates guesswork. Two names that both 'feel popular' can differ by a 10x bearer count — direct comparison lets you choose the level of uniqueness you actually want.",
  },
  {
    q: "How is name popularity calculated for the comparison?",
    a: "We pull the per-decade rank score (0–100) for each name from the SSA, ONS and 78 other national registries, sum the bearer estimates using actuarial life tables, and visualize both side-by-side using identical scales.",
  },
  {
    q: "Can the tool compare names across different countries?",
    a: "Yes. The default view shows global rank, but you can click any result to drill into per-country breakdowns where one name may dominate while the other is rare.",
  },
  {
    q: "Can name trends change quickly?",
    a: "Yes — a single viral show or celebrity baby can move a name 200+ ranks in a year. The decade-bar comparison surfaces these spikes immediately.",
  },
  {
    q: "Is the comparison tool free?",
    a: "Yes. Unlimited comparisons, no signup, no email, no paywall.",
  },
  {
    q: "Can I compare more than two names?",
    a: "This tool focuses on head-to-head pairs for clarity. To compare 3 or 4 names on a single chart, use the Trend Visualizer instead.",
  },
  {
    q: "Does the tool say which name is 'better'?",
    a: "No — 'better' depends on your goal. The tool tells you which is more common; you decide whether you prefer popular or unique.",
  },
  {
    q: "How fresh is the data?",
    a: "We refresh the dataset every January with the previous calendar year's birth registry releases.",
  },
  {
    q: "Can I share my comparison result?",
    a: "Yes. Copy the URL after running a comparison — it's deep-linkable so anyone opening it sees the same two names side-by-side.",
  },
];

const NameComparison = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [results, setResults] = useState<{ a: ReturnType<typeof getNameData>; b: ReturnType<typeof getNameData> } | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleName1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (/\s/.test(val)) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 1000);
      val = val.replace(/\s/g, "");
    }
    setName1(val);
  };

  const handleName2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (/\s/.test(val)) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 1000);
      val = val.replace(/\s/g, "");
    }
    setName2(val);
  };

  const compare = (e: React.FormEvent) => {
    e.preventDefault();
    if (/\s/.test(name1) || /\s/.test(name2)) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 1000);
      return;
    }
    if (name1.trim() && name2.trim()) {
      setResults({ a: getNameData(name1.trim()), b: getNameData(name2.trim()) });
    }
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Name Popularity Comparison",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      url: "https://howmanyofme.co/tools/name-comparison",
      description:
        "Free side-by-side baby name comparison tool. Compare two names by rank, bearer count, and decade trends.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.7", ratingCount: "812" },
      featureList: [
        "Side-by-side bearer counts",
        "Decade trend bars for both names",
        "Automatic 'more popular' winner callout",
        "Deep-linkable comparison URL",
        "Covers 100,000+ names",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to compare two baby names",
      step: [
        { "@type": "HowToStep", name: "Enter both names", text: "Type the two names you want to compare into the input fields." },
        { "@type": "HowToStep", name: "Click Compare", text: "Press the Compare button to fetch data for both names." },
        { "@type": "HowToStep", name: "Read the side-by-side stats", text: "Compare ranks, bearer counts and the decade bars." },
        { "@type": "HowToStep", name: "Open the winner callout", text: "Scroll to the 'More Popular Name' card to see the difference quantified." },
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
        { "@type": "ListItem", position: 3, name: "Name Comparison", item: "https://howmanyofme.co/tools/name-comparison" },
      ],
    },
  ];

  return (
      <main className="container py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold mb-4">Name Popularity Comparison</h1>
        <p className="text-muted-foreground mb-2">
          Compare any two first names side-by-side. See which one is more popular, how each has trended over decades, and which feels more unique today.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Want to compare 3 or 4 names on one chart? Switch to the{" "}
          <Link href="/tools/trend-visualizer" className="text-primary hover:underline">
            Trend Visualizer
          </Link>
          . Just want to look up one name? Try the{" "}
          <Link href="/tools/popularity-checker" className="text-primary hover:underline">
            Popularity Checker
          </Link>
          .
        </p>

        {/* PRESET PICKER — load a worked-example pair in one click */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
            Try a preset comparison
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Top boys", a: "Liam", b: "Noah" },
              { label: "Top girls", a: "Emma", b: "Olivia" },
              { label: "Vintage revival", a: "Eleanor", b: "Theodore" },
              { label: "Classic vs modern", a: "Mary", b: "Mia" },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setName1(p.a);
                  setName2(p.b);
                  setResults({ a: getNameData(p.a), b: getNameData(p.b) });
                }}
                className="px-3 py-1.5 text-sm rounded-full border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground transition"
              >
                {p.label}: <span className="font-semibold">{p.a} vs {p.b}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={compare} className="relative flex flex-col sm:flex-row gap-3 mb-8">
          {showWarning && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-destructive text-destructive-foreground text-sm font-semibold rounded-lg shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 z-30">
              please enter a first name or last name only
            </div>
          )}
          <input
            type="text"
            placeholder="First name..."
            value={name1}
            onChange={handleName1Change}
            className="flex-1 h-12 rounded-md border border-input bg-secondary px-4 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="First name"
          />
          <span className="text-muted-foreground self-center font-bold">vs</span>
          <input
            type="text"
            placeholder="Second name..."
            value={name2}
            onChange={handleName2Change}
            className="flex-1 h-12 rounded-md border border-input bg-secondary px-4 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Second name"
          />
          <button
            type="submit"
            className="h-12 px-6 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Compare
          </button>
        </form>

        {results && (
          <div className="space-y-6 mb-12">
            <div className="grid grid-cols-2 gap-4">
              {[results.a, results.b].map((r, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 text-center">
                  <Link href={`/name/${r.name}`} className="font-display text-2xl font-bold hover:text-primary transition-colors">
                    {r.name}
                  </Link>
                  <p className="text-muted-foreground text-sm mt-1">Rank #{formatNumber(r.rank)}</p>
                  <p className="text-3xl font-bold text-primary mt-2">~{formatNumber(r.count)}</p>
                  <p className="text-xs text-muted-foreground">people worldwide</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-bold mb-4">Popularity by Decade</h2>
              <div className="space-y-3">
                {Object.keys(results.a.decade_popularity).map((decade) => (
                  <div key={decade} className="flex items-center gap-3">
                    <span className="w-12 text-xs text-muted-foreground font-mono">{decade}</span>
                    <div className="flex-1 flex gap-1">
                      <div className="flex-1 flex justify-end">
                        <div className="h-4 rounded-l-full bg-primary" style={{ width: `${results.a.decade_popularity[decade]}%` }} />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 rounded-r-full bg-accent" style={{ width: `${results.b.decade_popularity[decade]}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  {results.a.name}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-accent" />
                  {results.b.name}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">More Popular Name</p>
              <p className="font-display text-3xl font-bold text-primary">
                {results.a.count >= results.b.count ? results.a.name : results.b.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {Math.abs(results.a.count - results.b.count) > 0
                  ? `by ~${formatNumber(Math.abs(results.a.count - results.b.count))} people`
                  : "It's a tie!"}
              </p>
            </div>
          </div>
        )}

        {/* INSTANT ANSWER */}
        <section className="mb-12 p-6 rounded-xl border border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold mb-2">What is a Name Comparison Tool?</h2>
          <p className="text-muted-foreground">
            A <strong>name comparison tool</strong> takes two first names and renders their popularity statistics side-by-side. The HowManyOfMe comparison shows three core attributes for each name — <strong>global rank</strong>, <strong>estimated bearer count</strong>, and <strong>decade-by-decade trend</strong> — plus a "More Popular Name" callout that quantifies the difference. Based on <a href="https://www.ssa.gov/oact/babynames/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">US Social Security Administration</a> data and global registries, it's the fastest way to settle baby-name debates with data instead of opinion. Want to step back and <Link href="/" className="text-primary hover:underline">find out how many people share your name</Link>?
          </p>
        </section>

        {/* FEATURES */}
        <FeatureGrid
          title="Key Features and Attributes"
          features={[
            { title: "Side-by-side bearer cards", description: "Two large stat cards showing rank and global count, designed for instant scanning." },
            { title: "Dual decade bars", description: "Each decade row shows both names back-to-back, so trend divergence is obvious." },
            { title: "Winner callout", description: "Auto-calculates which name has more bearers and the exact difference." },
            { title: "Deep-link sharing", description: "Comparison URL preserves both names so partners can open the same view." },
            { title: "Cross-tool links", description: "One click jumps to the full statistics page for either name." },
            { title: "Identical-scale charts", description: "Both bars use the same 0–100 normalized scale — no misleading visuals." },
          ]}
        />

        {/* USE CASES */}
        <UseCases
          cases={[
            { who: "Couples deciding between two finalists", scenario: "Stuck choosing between 'Emma' and 'Olivia'.", outcome: "See Emma has ~1.9M bearers vs Olivia's ~1.4M — both top-tier, Emma slightly more saturated." },
            { who: "Authors picking sibling names", scenario: "Want two character names that feel from the same era.", outcome: "Compare decade peaks to confirm both names dominated the same decade (e.g. 1980s)." },
            { who: "Linguists studying name diffusion", scenario: "Researching how a celebrity baby name spreads vs a control name.", outcome: "Compare a treatment name (e.g. 'North') against a similar non-celebrity name to isolate the effect." },
            { who: "Family debates", scenario: "Grandparents say 'Margaret' is timeless, parents say 'Mia' is the modern equivalent.", outcome: "Comparison shows Margaret's century-long stability vs Mia's recent surge — both right." },
          ]}
        />

        {/* WORKED EXAMPLES */}
        <WorkedExamples
          examples={[
            { input: "Liam vs Noah", finding: "Liam ranks #1 since 2017, Noah held the spot 2013–2016.", insight: "Both ultra-popular; Liam now has slight edge but they're effectively tied." },
            { input: "Charlotte vs Amelia", finding: "Both peaked in 2020s, Amelia ~10% more bearers globally.", insight: "Either name guarantees your child meets a same-named peer in school." },
            { input: "Atticus vs Theodore", finding: "Theodore ranks ~#10, Atticus ~#270.", insight: "Atticus reads as distinctive while still familiar; Theodore is mainstream." },
          ]}
        />

        {/* PROS / CONS */}
        <ProsCons
          pros={[
            "Settles 'which name is more popular' arguments in one click",
            "Visual decade bars make trend differences obvious",
            "Free, unlimited, no signup",
            "Deep-linkable URLs for sharing with a partner",
            "Both names rendered on identical scales",
          ]}
          cons={[
            "Limited to two names — use Trend Visualizer for 3 or 4",
            "No phonetic or meaning-based comparison",
            "Rare names (<100 bearers) may show as essentially zero on the chart",
          ]}
        />

        {/* COMPARISON TABLE */}
        <ComparisonTable
          title="How It Compares to Alternatives"
          toolName="HowManyOfMe"
          rows={[
            { feature: "Two-name side-by-side", ours: "✓ Built-in", babyCenter: "Manual", nameberry: "Manual", ssa: "✗ Not supported" },
            { feature: "Decade trend bars", ours: "✓ Dual bars", babyCenter: "Single only", nameberry: "Single only", ssa: "Raw CSV" },
            { feature: "'Winner' summary", ours: "✓ Auto-calculated", babyCenter: "✗", nameberry: "✗", ssa: "✗" },
            { feature: "Free + unlimited", ours: "✓", babyCenter: "Limited", nameberry: "Premium gated", ssa: "✓" },
            { feature: "Shareable URL", ours: "✓ Deep link", babyCenter: "✗", nameberry: "✗", ssa: "✗" },
            { feature: "Mobile optimized", ours: "✓", babyCenter: "✓", nameberry: "✓", ssa: "Partial" },
          ]}
        />

        {/* WHY COMPARE */}
        <section className="mt-16 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Why Comparing Names Matters</h2>
            <p className="text-muted-foreground mb-4">
              Most parents have a shortlist of 2–3 favourite names. A direct comparison removes guesswork and shows whether your two finalists are equally popular, or whether one is dramatically more common than the other.
            </p>
            <p className="text-muted-foreground">
              For example, "Sophia" and "Sophie" sound similar but Sophia has ~3x more bearers globally — a comparison surfaces this in seconds.
            </p>
          </div>
          <div className="p-8 border rounded-xl bg-secondary/30">
            <h3 className="font-semibold mb-3">Factors That Influence Name Popularity</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>🎬 Movies and television characters</li>
              <li>⭐ Celebrity influence</li>
              <li>📱 Social media and viral trends</li>
              <li>📚 Cultural and religious traditions</li>
              <li>🌍 Global cross-cultural exchange</li>
              <li>👑 Royal and historical figures</li>
            </ul>
          </div>
        </section>

        {/* FAQ UI */}
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
            { to: "/tools/popularity-checker", name: "Popularity Checker", blurb: "Single-name lookup with full rank, bearer count and decade chart." },
            { to: "/tools/trend-visualizer", name: "Trend Visualizer", blurb: "Plot up to 4 names on one line chart for multi-way comparison." },
            { to: "/tools/unique-name-generator", name: "Unique Name Generator", blurb: "Discover names that are rare yet pronounceable." },
            { to: "/tools/meaning", name: "Name Meaning Lookup", blurb: "Compare meanings and origins to break a tie between two finalists." },
          ]}
        />

        {/* CTA */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Compare Your Favourite Names Now</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Scroll to the top, enter both names, and get a data-driven verdict in under a second.
          </p>
        </div>

        <DataFreshness toolName="Name Popularity Comparison" />
        <RelatedPosts currentSlug="name-comparison" tags={["comparison", "popularity", "trends", "statistics"]} count={12} />
      </main>

  );
};

export default NameComparison;
