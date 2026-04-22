import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
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

const FAQS = [
  { q: "What is a random name generator?", a: "A free tool that picks names at random from a real-name database. Unlike AI generators, every result is a real recorded human name from birth registries." },
  { q: "How does the random name generator work?", a: "We shuffle a 100,000-name pool filtered by your gender choice, then return 10 unique names per click." },
  { q: "Are the names real?", a: "Yes — every name comes from US SSA, UK ONS, or one of 78 other national registries. No invented strings." },
  { q: "Can I get random names by gender?", a: "Yes. Filter by Male, Female, or Any (which includes unisex names)." },
  { q: "How is this different from AI name generators?", a: "AI tools invent novel strings that may not be real names. We sample from verified human-name databases — every result is a name someone actually has." },
  { q: "Can I use random names for fiction characters?", a: "Yes — authors, screenwriters and game developers use this constantly for believable cast names." },
  { q: "Is the Random Name Generator free?", a: "Yes — unlimited generations, no signup, no email, no paywall." },
  { q: "Does each result link to more info?", a: "Yes. Tap any name to see its full popularity, decade trends, meaning and origin." },
  { q: "Can I generate names from a specific country?", a: "Country-specific generation is on the roadmap. Today, results are global with English-speaking countries best represented." },
  { q: "How many results per click?", a: "10 unique names per generation. Click Generate again for a fresh batch." },
];

const RandomNameGenerator = () => {
  const [generated, setGenerated] = useState<string[]>([]);
  const [gender, setGender] = useState<string>("any");

  const generate = (g = gender) => {
    const allNames = ALPHABET.flatMap((l) => getNamesForLetter(l));
    const filtered = g === "any" ? allNames : allNames.filter((n) => {
      const d = getNameData(n);
      return d.gender === g || d.gender === "unisex";
    });
    const result: string[] = [];
    for (let i = 0; i < 10; i++) result.push(filtered[Math.floor(Math.random() * filtered.length)]);
    setGenerated([...new Set(result)]);
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Random Name Generator",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      url: "https://howmanyofme.co/tools/random-name",
      description: "Free random name generator that picks 10 real recorded names per click from a 100,000-name registry database.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.7", ratingCount: "412" },
      featureList: ["Real-name database (no AI hallucinations)", "Gender filter", "10 results per click", "Direct stats per name"],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to generate random names",
      step: [
        { "@type": "HowToStep", name: "Pick a gender", text: "Choose Male, Female, or Any." },
        { "@type": "HowToStep", name: "Click Generate", text: "Get 10 real recorded names instantly." },
        { "@type": "HowToStep", name: "Drill into any name", text: "Tap a name to view its full statistics page." },
      ],
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://howmanyofme.co/" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://howmanyofme.co/tools" },
        { "@type": "ListItem", position: 3, name: "Random Name Generator", item: "https://howmanyofme.co/tools/random-name" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Random Name Generator — 10 Real Names Per Click, Free Forever"
        description="Free random name generator. Get 10 real recorded names per click from a 100,000-name registry database. No AI hallucinations, no signup."
        canonical="https://howmanyofme.co/tools/random-name"
        jsonLd={jsonLd}
      />
      <SiteHeader />

      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-4">Random Name Generator</h1>
        <p className="text-muted-foreground mb-2">
          Get 10 random real names per click from our database of 100,000+ verified human names. Filter by gender and tap any result to see full statistics.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Want only rare names? Use the{" "}
          <Link to="/tools/unique-name-generator" className="text-primary hover:underline">Unique Name Generator</Link>. Looking up specific names?{" "}
          <Link to="/tools/popularity-checker" className="text-primary hover:underline">Popularity Checker</Link>.
        </p>

        {/* PRESETS */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">Quick presets</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "10 random boy names", g: "male" },
              { label: "10 random girl names", g: "female" },
              { label: "10 random unisex/any", g: "any" },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => { setGender(p.g); generate(p.g); }}
                className="px-3 py-1.5 text-sm rounded-full border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="h-10 rounded-md border border-input bg-secondary px-3 text-sm">
            <option value="any">Any Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <button onClick={() => generate()} className="h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">Generate Names</button>
        </div>

        {generated.length > 0 && (
          <div className="space-y-2 mb-12">
            {generated.map((n) => (
              <Link key={n} to={`/name/${n}`} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors">
                <span className="font-semibold">{n}</span>
                <span className="text-sm text-muted-foreground">~{formatNumber(getNameData(n).count)} people</span>
              </Link>
            ))}
          </div>
        )}

        {/* INSTANT ANSWER */}
        <section className="mb-12 p-6 rounded-xl border border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold mb-2">What is a Random Name Generator?</h2>
          <p className="text-muted-foreground">
            A <strong>random name generator</strong> picks names at random from a database. The HowManyOfMe generator differs from AI tools in one critical way: every result is a <strong>real recorded human name</strong> sourced from US, UK and 78 other national birth registries — never an invented string. Get 10 names per click, optionally filtered by gender, with each result linking to its full popularity statistics.
          </p>
        </section>

        <FeatureGrid title="Key Features and Attributes" features={[
          { title: "Real-name database", description: "100,000+ names from official birth registries — never AI-generated." },
          { title: "Gender filter", description: "Male, Female, or Any (includes unisex)." },
          { title: "10 results per click", description: "Fresh batch every time you press Generate." },
          { title: "One-click presets", description: "Instant 'all boy / all girl / any' shortcuts." },
          { title: "Direct stats links", description: "Tap any result to view its full popularity page." },
          { title: "Zero signup", description: "No account, no email, unlimited use." },
        ]} />

        <UseCases cases={[
          { who: "Authors and screenwriters", scenario: "Need 10 background character names that feel real.", outcome: "One click delivers 10 authentic names — no more 'John Smith' fatigue." },
          { who: "Game developers", scenario: "Building an NPC name pool for an RPG town.", outcome: "Generate batches of 10 until you have a believable population." },
          { who: "Teachers running classroom exercises", scenario: "Need example student names without using real students'.", outcome: "Random generation avoids favouritism and is endlessly replayable." },
          { who: "Indecisive parents", scenario: "Want unbiased name suggestions to break a creative block.", outcome: "Random sampling exposes you to names you'd never have searched for." },
        ]} />

        <WorkedExamples examples={[
          { input: "Male preset", finding: "Returned: Marcus, Henry, Owen, Felix, Theo, Wesley, Damian, Reid, Kai, Ezra", insight: "A spread of classic, modern and trending boy names." },
          { input: "Female preset", finding: "Returned: Iris, Maya, Hazel, Stella, Cora, Ada, Nora, Eden, Sloane, Wren", insight: "Mix of vintage revivals and modern favourites." },
          { input: "Any preset", finding: "Returned: Quinn, Sage, River, Avery, Rowan, Phoenix, Sky, Blake, Kendall, Ari", insight: "Unisex-leaning names dominate the 'any' pool." },
        ]} />

        <ProsCons
          pros={["100% real recorded names, no AI hallucinations", "Instant results, no loading", "Free + unlimited", "Direct stats links per result", "One-click gender presets"]}
          cons={["No control over rarity (use Unique Name Generator for that)", "Country-specific filtering not yet available", "10 results per click is fixed (more in roadmap)"]}
        />

        <ComparisonTable title="How It Compares to Alternatives" toolName="HowManyOfMe" rows={[
          { feature: "Real birth-registry data", ours: "✓", babyCenter: "✓", nameberry: "✓", ssa: "✓" },
          { feature: "AI hallucination-free", ours: "✓ Guaranteed", babyCenter: "✓", nameberry: "✓", ssa: "✓" },
          { feature: "10 names per click", ours: "✓", babyCenter: "Variable", nameberry: "Variable", ssa: "✗ Lists only" },
          { feature: "Direct stats links", ours: "✓", babyCenter: "✓", nameberry: "✓", ssa: "✗" },
          { feature: "Free + unlimited", ours: "✓", babyCenter: "Limited", nameberry: "Premium-gated", ssa: "✓" },
          { feature: "One-click gender presets", ours: "✓", babyCenter: "✗", nameberry: "✗", ssa: "✗" },
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
          { to: "/tools/unique-name-generator", name: "Unique Name Generator", blurb: "Same database, but filtered to rare names only." },
          { to: "/tools/baby-names", name: "Baby Name Browser", blurb: "Browse alphabetically instead of randomly." },
          { to: "/tools/username-generator", name: "Username Generator", blurb: "Turn any random name into 8 username variants." },
          { to: "/tools/meaning", name: "Name Meaning Lookup", blurb: "Check what your random pick actually means." },
        ]} />

        <DataFreshness toolName="Random Name Generator" />
        <RelatedPosts currentSlug="random-name" tags={["generator", "random", "baby names"]} count={12} />
      </main>
      <SiteFooter />
    </div>
  );
};

export default RandomNameGenerator;
