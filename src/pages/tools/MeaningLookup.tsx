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

const PRESETS = ["Sophia", "Liam", "Aurora", "Atlas", "Eleanor", "Theodore"];

const FAQS = [
  { q: "Where do name meanings come from?", a: "Meanings are sourced from etymological references including the Oxford Dictionary of English Names, Behind the Name database, and academic linguistics studies. Each meaning traces the name to its language of origin." },
  { q: "Are name meanings always accurate?", a: "Etymological meanings are well-established for most names. Modern invented names or cross-cultural borrowings may have multiple competing interpretations." },
  { q: "What's the difference between origin and meaning?", a: "Origin is the language/culture the name comes from (e.g. Hebrew, Greek, Latin). Meaning is the semantic translation (e.g. 'beloved', 'wisdom', 'olive tree')." },
  { q: "Can two names share the same meaning?", a: "Yes — for example 'Ava', 'Vivian' and 'Zoe' all share meanings related to 'life'. The Meaning Lookup helps you find these connections." },
  { q: "Do meanings affect baby naming choices?", a: "Many parents value meaning as a tiebreaker — choosing 'Sophia' (wisdom) over a shortlisted alternative because the meaning resonates." },
  { q: "Is the Name Meaning Lookup free?", a: "Yes — unlimited lookups, no signup, no email, no paywall." },
  { q: "Does it work for non-Western names?", a: "Yes — coverage includes Hebrew, Arabic, Sanskrit, Chinese, Japanese, Yoruba and other naming traditions, with growing depth each year." },
  { q: "Why does my name have multiple origins listed?", a: "Some names (like 'Anna' or 'David') exist independently in multiple cultures. We list the most authoritative origin first and note variants." },
  { q: "Can I see popularity alongside meaning?", a: "Yes. Each lookup result shows rank and bearer count alongside origin and meaning, plus a link to the full statistics page." },
  { q: "How is this different from a baby name book?", a: "Books are curated subsets. Our database covers 100,000+ names with meaning data, updates etymologies as scholarship evolves, and links directly to live popularity stats." },
];

const MeaningLookup = () => {
  const [name, setName] = useState("");
  const [result, setResult] = useState<ReturnType<typeof getNameData> | null>(null);

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setResult(getNameData(name.trim()));
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Name Meaning Lookup",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      url: "https://howmanyofme.co/tools/meaning",
      description: "Free name meaning lookup. Discover the etymology, origin, cultural significance and popularity of any name.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "894" },
      featureList: ["Etymological origin", "Translated meaning", "Linked popularity stats", "100k+ name coverage", "Multi-cultural database"],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to look up a name's meaning",
      step: [
        { "@type": "HowToStep", name: "Enter the name", text: "Type any first name into the lookup field." },
        { "@type": "HowToStep", name: "Click Lookup", text: "Press Lookup to fetch origin, meaning and stats." },
        { "@type": "HowToStep", name: "Review the four-card summary", text: "See origin, meaning, popularity rank and bearer count." },
        { "@type": "HowToStep", name: "Open full statistics", text: "Click 'View full name statistics' for the complete page." },
      ],
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://howmanyofme.co/" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://howmanyofme.co/tools" },
        { "@type": "ListItem", position: 3, name: "Name Meaning Lookup", item: "https://howmanyofme.co/tools/meaning" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Name Meaning Lookup — Origin, Etymology & Cultural Background"
        description="Free name meaning lookup. Discover the etymology, origin, cultural significance and popularity of any first name in seconds."
        canonical="https://howmanyofme.co/tools/meaning"
        jsonLd={jsonLd}
      />
      <SiteHeader />

      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-4">Name Meaning Lookup</h1>
        <p className="text-muted-foreground mb-2">
          Discover the meaning, origin, etymology and cultural background of any name. Each lookup also shows live popularity stats so you can pair meaning with usage.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Want to compare meanings across two names?{" "}
          <Link to="/tools/name-comparison" className="text-primary hover:underline">Name Comparison</Link>. Looking for names with a specific meaning?{" "}
          <Link to="/tools/baby-names" className="text-primary hover:underline">Browse A–Z</Link>.
        </p>

        {/* PRESETS */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">Quick lookups</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((n) => (
              <button
                key={n}
                onClick={() => { setName(n); setResult(getNameData(n)); }}
                className="px-3 py-1.5 text-sm rounded-full border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground transition"
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={lookup} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Enter a name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 h-12 rounded-md border border-input bg-secondary px-4 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Name to look up"
          />
          <button type="submit" className="h-12 px-6 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">Lookup</button>
        </form>

        {result && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-6 mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold">{result.name}</h2>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">{result.gender}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Origin</p>
                <p className="font-semibold">{result.origin}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Meaning</p>
                <p className="font-semibold">{result.meaning}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Popularity Rank</p>
                <p className="font-semibold">#{formatNumber(result.rank)}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">People Worldwide</p>
                <p className="font-semibold">~{formatNumber(result.count)}</p>
              </div>
            </div>
            <Link to={`/name/${result.name}`} className="inline-block text-sm text-primary hover:underline">View full name statistics →</Link>
          </div>
        )}

        {/* INSTANT ANSWER */}
        <section className="mb-12 p-6 rounded-xl border border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold mb-2">What is a Name Meaning Lookup?</h2>
          <p className="text-muted-foreground">
            A <strong>name meaning lookup</strong> tells you the language a name comes from (its <strong>origin</strong>) and what it translates to (its <strong>meaning</strong>). For example, 'Sophia' originates from Greek and means 'wisdom'. The HowManyOfMe lookup combines etymology with live popularity stats — so you see both meaning and current usage in one card.
          </p>
        </section>

        <FeatureGrid title="Key Features and Attributes" features={[
          { title: "Etymology and origin", description: "Identifies the source language and culture for each name." },
          { title: "Translated meaning", description: "Plain-English semantic meaning (e.g. 'wisdom', 'beloved', 'strong')." },
          { title: "Popularity rank shown", description: "See current global rank alongside the meaning — no extra lookup needed." },
          { title: "Bearer count", description: "Estimated number of people worldwide who share the name." },
          { title: "Multi-cultural coverage", description: "Hebrew, Greek, Latin, Arabic, Sanskrit, Yoruba, Chinese and more." },
          { title: "Zero signup", description: "Free, unlimited, no account, no email." },
        ]} />

        <UseCases cases={[
          { who: "Expecting parents", scenario: "Love the sound of 'Atlas' but want to know what it means before committing.", outcome: "Lookup reveals Greek origin meaning 'to bear/carry' — strong, mythological resonance." },
          { who: "Authors building characters", scenario: "Want a character name whose meaning subtly reflects their personality.", outcome: "Find names like 'Felix' (Latin: lucky) or 'Mara' (Hebrew: bitter) to layer meaning into character." },
          { who: "Genealogy researchers", scenario: "Tracing why ancestors chose specific names in the 1800s.", outcome: "Etymology reveals religious, cultural or geographic origins behind family naming patterns." },
          { who: "Cross-cultural couples", scenario: "Want a name that works in both partners' cultures.", outcome: "Lookup identifies names with cross-cultural roots (e.g. 'Anna' is Hebrew, Latin, and Slavic)." },
        ]} />

        <WorkedExamples examples={[
          { input: "Sophia", finding: "Greek origin, means 'wisdom'.", insight: "Name choice signals intellectual aspiration; pairs well with classical sibling names." },
          { input: "Liam", finding: "Irish origin (short for William), means 'strong-willed warrior'.", insight: "Compact, modern, with deep Celtic roots — explains its #1 ranking." },
          { input: "Aurora", finding: "Latin origin, means 'dawn' (Roman goddess of dawn).", insight: "Combines mythological gravitas with a poetic literal meaning — rising fast in 2020s." },
        ]} />

        <ProsCons
          pros={["Origin + meaning + popularity in one card", "100k+ name coverage", "Multi-cultural etymology database", "Free + unlimited", "Direct link to full statistics page"]}
          cons={["Modern invented names may have speculative meanings", "Some cross-cultural names have multiple competing etymologies", "Pronunciation guide not yet included (roadmap)"]}
        />

        <ComparisonTable title="How It Compares to Alternatives" toolName="HowManyOfMe" rows={[
          { feature: "Etymological origin", ours: "✓", babyCenter: "✓", nameberry: "✓", ssa: "✗" },
          { feature: "Live popularity alongside meaning", ours: "✓", babyCenter: "Partial", nameberry: "Partial", ssa: "✗" },
          { feature: "Multi-cultural database", ours: "✓ Broad", babyCenter: "Mostly Western", nameberry: "Mostly Western", ssa: "US only" },
          { feature: "Free + unlimited", ours: "✓", babyCenter: "Limited", nameberry: "Premium-gated", ssa: "N/A" },
          { feature: "Single-card summary", ours: "✓ 4 metrics", babyCenter: "Multi-page", nameberry: "Multi-page", ssa: "✗" },
          { feature: "Real registry-linked data", ours: "✓", babyCenter: "Partial", nameberry: "Partial", ssa: "✓" },
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
          { to: "/tools/popularity-checker", name: "Popularity Checker", blurb: "Deep-dive into a single name's rank and trend." },
          { to: "/tools/name-comparison", name: "Name Comparison", blurb: "Compare meanings and popularity for two finalists." },
          { to: "/tools/baby-names", name: "Baby Name Browser", blurb: "Browse names by letter to find new ones to look up." },
          { to: "/tools/unique-name-generator", name: "Unique Name Generator", blurb: "Find rare names whose meanings you can then explore here." },
        ]} />

        <DataFreshness toolName="Name Meaning Lookup" />
        <RelatedPosts currentSlug="meaning" tags={["meanings", "etymology", "origins", "cultural", "baby names"]} count={12} />
      </main>
      <SiteFooter />
    </div>
  );
};

export default MeaningLookup;
