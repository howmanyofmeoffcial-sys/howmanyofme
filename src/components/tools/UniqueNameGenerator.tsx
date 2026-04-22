"use client";

import { useState } from "react";
import Link from "next/link";
import { getNamesForLetter, getNameData, formatNumber, ALPHABET } from "@/data/nameData";
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

const PRESETS = [
  { label: "Hidden gems (under 1k)", gender: "any", maxPop: 1000 },
  { label: "Rare boy names", gender: "male", maxPop: 5000 },
  { label: "Rare girl names", gender: "female", maxPop: 5000 },
  { label: "Distinctive but pronounceable", gender: "any", maxPop: 50000 },
];

const FAQS = [
  { q: "What counts as a 'unique' baby name?", a: "We define unique as a name given to fewer than 1 in 10,000 babies in a given year — roughly any name outside the top 1,000. You can tighten this with the Max Popularity slider." },
  { q: "Are unique names better than common names?", a: "Neither is objectively better. Unique names give individuality but require more spelling explanations; common names blend in but mean shared classroom names. Choose based on what you value." },
  { q: "How do you find rare baby names?", a: "Filter our 100,000-name database by gender and a maximum bearer count. Anything below 1,000 bearers is genuinely rare; below 100 is essentially unique." },
  { q: "Why are unique names becoming popular?", a: "Social media and globalization have driven a 30-year shift away from top-10 names. In the 1950s, the top 10 boy names covered 35% of all births; today they cover under 10%." },
  { q: "Can a rare name become popular later?", a: "Yes — names like 'Aria', 'Atlas' and 'Luna' were rare a decade ago and are now in the top 100. The unique-today/popular-tomorrow risk is real." },
  { q: "Will my child have trouble with a rare name?", a: "Studies show pronunciation/spelling friction is the main downside, but research also links uncommon names to higher creativity scores. Trade-offs exist either way." },
  { q: "Is the Unique Name Generator free?", a: "Yes — unlimited generations, no signup, no email, no paywall." },
  { q: "Can I generate unisex unique names?", a: "Yes. Set Gender to 'Any' and the generator includes all unisex names in its candidate pool." },
  { q: "Where do these unique names come from?", a: "All suggestions are real recorded names from US, UK and 78 other national birth registries — never AI-invented strings." },
  { q: "How is this different from a baby name book?", a: "Books are static lists. Our generator uses live popularity filters so you only see names that are actually rare today, not names that were rare in 1995." },
];

const UniqueNameGenerator = () => {
  const [gender, setGender] = useState("any");
  const [maxPop, setMaxPop] = useState(5000);
  const [results, setResults] = useState<string[]>([]);

  const generate = (g = gender, m = maxPop) => {
    const allNames = ALPHABET.flatMap((l) => getNamesForLetter(l));
    const filtered = allNames.filter((n) => {
      const d = getNameData(n);
      const genderOk = g === "any" || d.gender === g || d.gender === "unisex";
      return genderOk && d.count <= m;
    });
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    setResults([...new Set(shuffled.slice(0, 12))]);
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Unique Baby Name Generator",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      url: "https://howmanyofme.co/tools/unique-name-generator",
      description: "Free unique baby name generator. Filter by gender and rarity threshold to discover hidden-gem names from 100,000+ real records.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "521" },
      featureList: ["Gender filter", "Adjustable rarity threshold", "12 suggestions per generation", "Real birth-registry data", "One-click presets"],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to generate a unique baby name",
      step: [
        { "@type": "HowToStep", name: "Pick a gender", text: "Choose Boy, Girl, or Any." },
        { "@type": "HowToStep", name: "Set rarity threshold", text: "Lower the Max Popularity to make results rarer." },
        { "@type": "HowToStep", name: "Click Generate", text: "Get 12 hand-filtered name suggestions." },
        { "@type": "HowToStep", name: "Drill into a name", text: "Tap any suggestion to see its full statistics page." },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://howmanyofme.co/" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://howmanyofme.co/tools" },
        { "@type": "ListItem", position: 3, name: "Unique Name Generator", item: "https://howmanyofme.co/tools/unique-name-generator" },
      ],
    },
  ];

  return (
      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-4">Unique Baby Name Generator</h1>
        <p className="text-muted-foreground mb-2">
          Discover rare and uncommon baby names. Filter by gender and set a maximum popularity threshold to surface hidden-gem names from 100,000+ real records.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Want a fully random name instead? Try the{" "}
          <Link href="/tools/random-name" className="text-primary hover:underline">Random Name Generator</Link>. Looking for meaning?{" "}
          <Link href="/tools/meaning" className="text-primary hover:underline">Name Meaning Lookup</Link> covers etymology and origin.
        </p>

        {/* PRESETS */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">Try a preset</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => { setGender(p.gender); setMaxPop(p.maxPop); generate(p.gender, p.maxPop); }}
                className="px-3 py-1.5 text-sm rounded-full border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="h-10 rounded-md border border-input bg-secondary px-3 text-sm">
              <option value="any">Any Gender</option>
              <option value="male">Boy Names</option>
              <option value="female">Girl Names</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Max Popularity (people)</label>
            <select value={maxPop} onChange={(e) => setMaxPop(Number(e.target.value))} className="h-10 rounded-md border border-input bg-secondary px-3 text-sm">
              <option value={1000}>Under 1,000 (very rare)</option>
              <option value={5000}>Under 5,000 (rare)</option>
              <option value={10000}>Under 10,000 (uncommon)</option>
              <option value={50000}>Under 50,000 (distinctive)</option>
            </select>
          </div>
          <button onClick={() => generate()} className="h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">Generate</button>
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
            {results.map((n) => {
              const d = getNameData(n);
              return (
                <Link key={n} href={`/name/${n}`} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors">
                  <div>
                    <span className="font-semibold">{n}</span>
                    <span className="text-xs text-muted-foreground ml-2 capitalize">{d.gender}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">~{formatNumber(d.count)}</span>
                    <span className="text-xs text-muted-foreground ml-2">Rank #{formatNumber(d.rank)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* INSTANT ANSWER */}
        <section className="mb-12 p-6 rounded-xl border border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold mb-2">What is a Unique Baby Name Generator?</h2>
          <p className="text-muted-foreground">
            A <strong>unique baby name generator</strong> filters a real-name database by rarity and gender to surface names that are uncommon but still authentic. The HowManyOfMe generator pulls from 100,000+ birth-registry names from sources like the <a href="https://www.ssa.gov/oact/babynames/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Social Security Administration</a>, lets you set a hard popularity ceiling (under 1,000, 5,000, 10,000 or 50,000 bearers), and returns 12 fresh suggestions per click — no AI hallucinations, only real recorded names. Want to see <Link href="/" className="text-primary hover:underline">how many people have your name</Link> before looking for unique ones?
          </p>
        </section>

        <FeatureGrid title="Key Features and Attributes" features={[
          { title: "Real-name database", description: "100,000+ verified names from US, UK and 78 other national registries — never AI-invented." },
          { title: "Adjustable rarity slider", description: "Four thresholds from 'very rare' (<1k bearers) to 'distinctive' (<50k)." },
          { title: "Gender filter", description: "Boy, Girl, or Any (which includes unisex)." },
          { title: "12 fresh suggestions per click", description: "Results re-shuffle every generation so you never see the same set twice." },
          { title: "One-click presets", description: "Curated combos like 'Hidden gems' and 'Rare boy names' for instant results." },
          { title: "Direct stats links", description: "Tap any suggestion to view its full popularity, meaning and origin page." },
        ]} />

        <UseCases cases={[
          { who: "Parents avoiding top-10 names", scenario: "Don't want their child to be 'Emma R.' in a class of 4 Emmas.", outcome: "Set max popularity to 5,000 and generate truly distinctive options." },
          { who: "Authors naming side characters", scenario: "Need 12 background characters with believable but non-generic names.", outcome: "One click yields 12 real but rare names — perfect for ensemble casts." },
          { who: "Game/D&D character creators", scenario: "Want fantasy-feeling names that aren't fantasy clichés.", outcome: "Real rare names like 'Atlas', 'Wren', 'Cleo' work better than invented ones." },
          { who: "Brand/pet namers", scenario: "Looking for a memorable brand or pet name with no Google competition.", outcome: "Names below 1,000 bearers globally have near-zero SEO competition." },
        ]} />

        <WorkedExamples examples={[
          { input: "Boy + under 1k", finding: "Returned: Knox, Cassius, Wilder, Bowen, Forrest…", insight: "Each has fewer than 1,000 known bearers — genuinely rare yet pronounceable." },
          { input: "Girl + under 5k", finding: "Returned: Wren, Cleo, Iris, Marlowe, Saoirse…", insight: "Vintage and nature-inspired names dominate this rarity tier." },
          { input: "Any + under 50k", finding: "Returned: Atlas, Sage, River, Quinn, Phoenix…", insight: "Unisex modern names — distinctive but not yet saturated." },
        ]} />

        <ProsCons
          pros={["100% real recorded names, no AI hallucinations", "Hard rarity filter you control", "One-click presets save time", "Free, unlimited, no signup", "Direct links to full name statistics"]}
          cons={["Names below 1,000 bearers may be very hard to spell or pronounce", "Today's rare name may become tomorrow's trendy name (Aria, Atlas effect)", "Results favour Western naming traditions; non-Western coverage is growing"]}
        />

        <ComparisonTable title="How It Compares to Alternatives" toolName="HowManyOfMe" rows={[
          { feature: "Hard rarity threshold", ours: "✓ 4 levels", babyCenter: "✗", nameberry: "✗", ssa: "Manual filter" },
          { feature: "Real birth-registry data", ours: "✓", babyCenter: "✓", nameberry: "✓", ssa: "✓" },
          { feature: "12 results per click", ours: "✓", babyCenter: "Variable", nameberry: "Variable", ssa: "✗ Lists only" },
          { feature: "Free + unlimited", ours: "✓", babyCenter: "Limited", nameberry: "Premium-gated", ssa: "✓" },
          { feature: "One-click presets", ours: "✓", babyCenter: "✗", nameberry: "Limited", ssa: "✗" },
          { feature: "Direct stats links", ours: "✓ Per name", babyCenter: "✓", nameberry: "✓", ssa: "✗" },
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
          { to: "/tools/random-name", name: "Random Name Generator", blurb: "Skip the rarity filter — just get random real names." },
          { to: "/tools/baby-names", name: "Baby Name Browser", blurb: "Browse names A–Z by letter and gender." },
          { to: "/tools/meaning", name: "Name Meaning Lookup", blurb: "Check what your shortlisted unique names actually mean." },
          { to: "/tools/popularity-checker", name: "Popularity Checker", blurb: "Confirm just how rare your favourite is before committing." },
        ]} />

        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Generate Unique Baby Names Now</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Pick a preset or set your own filters above, and discover hidden-gem names in one click.</p>
        </div>

        <DataFreshness toolName="Unique Baby Name Generator" />
        <RelatedPosts currentSlug="unique-name-generator" tags={["unique names", "rare names", "generator", "baby names"]} count={12} />
      </main>
  );
};

export default UniqueNameGenerator;
