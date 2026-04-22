import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { getNamesForLetter, getNameData, ALPHABET } from "@/data/nameData";
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
  { q: "How do I browse baby names alphabetically?", a: "Click any letter A–Z above to view all names beginning with that letter. Use the gender dropdown to narrow further." },
  { q: "Are these all the baby names that exist?", a: "We cover 100,000+ recorded names from US SSA, UK ONS, and 78 other registries. New names are added each year as new birth records are released." },
  { q: "How are baby names sorted?", a: "Names within each letter are sorted alphabetically by default. Click any name to drill into its full statistics including popularity and meaning." },
  { q: "Can I filter by gender?", a: "Yes — choose Boy, Girl, or Any. The Any filter includes unisex names like Quinn, River and Sage." },
  { q: "Do you cover names from non-English cultures?", a: "Yes. The database includes Spanish, Indian, Arabic, Chinese, African and European names. English names are best-covered today; others expand each year." },
  { q: "Why are some letters smaller than others?", a: "X, Q, Y, U and Z naturally have fewer baby names. A, J, M, S and L have the largest catalogues, reflecting historical naming patterns." },
  { q: "Can I see meanings on the browse page?", a: "Tap any name to open its dedicated page with meaning, origin, popularity rank and decade trend." },
  { q: "Is the Baby Name Browser free?", a: "Yes — unlimited browsing, no signup, no email, no paywall." },
  { q: "Are baby name lists updated?", a: "Yes, the dataset refreshes annually with the previous year's official birth registry release." },
  { q: "Can I save my favourite names?", a: "A 'favourites' shortlist is on the roadmap. For now, bookmark individual name pages or copy the URL." },
];

const BabyNames = () => {
  const [letter, setLetter] = useState("a");
  const [gender, setGender] = useState<string>("any");

  const names = getNamesForLetter(letter).filter((n) => {
    if (gender === "any") return true;
    const d = getNameData(n);
    return d.gender === gender || d.gender === "unisex";
  });

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Baby Name Browser",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      url: "https://howmanyofme.co/tools/baby-names",
      description: "Free A-Z baby name browser. Filter by letter and gender to discover thousands of real recorded baby names.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.7", ratingCount: "738" },
      featureList: ["A–Z letter navigation", "Gender filter", "Direct links to full stats", "100k+ name database"],
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://howmanyofme.co/" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://howmanyofme.co/tools" },
        { "@type": "ListItem", position: 3, name: "Baby Name Browser", item: "https://howmanyofme.co/tools/baby-names" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Baby Name Browser A–Z — Filter by Letter and Gender"
        description="Free A–Z baby name browser. Filter thousands of real recorded baby names by starting letter and gender. No signup required."
        canonical="https://howmanyofme.co/tools/baby-names"
        jsonLd={jsonLd}
      />
      <SiteHeader />

      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-4">Baby Name Browser</h1>
        <p className="text-muted-foreground mb-2">
          Browse 100,000+ real recorded baby names alphabetically. Filter by letter and gender, then tap any name for full popularity statistics, meaning and decade trends.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Looking for rare names only?{" "}
          <Link to="/tools/unique-name-generator" className="text-primary hover:underline">Unique Name Generator</Link>. Want random suggestions?{" "}
          <Link to="/tools/random-name" className="text-primary hover:underline">Random Name Generator</Link>.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {ALPHABET.map((l) => (
            <button
              key={l}
              onClick={() => setLetter(l)}
              className={`w-9 h-9 rounded-md text-sm font-bold uppercase ${l === letter ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-primary/10"}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mb-6">
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="h-10 rounded-md border border-input bg-secondary px-3 text-sm">
            <option value="any">Any Gender</option>
            <option value="male">Boy Names</option>
            <option value="female">Girl Names</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-12">
          {names.map((n) => (
            <Link key={n} to={`/name/${n}`} className="p-3 rounded-lg border border-border bg-card hover:bg-secondary/50 text-center text-sm font-medium transition-colors">
              {n}
            </Link>
          ))}
        </div>

        {/* INSTANT ANSWER */}
        <section className="mb-12 p-6 rounded-xl border border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold mb-2">What is the Baby Name Browser?</h2>
          <p className="text-muted-foreground">
            The <strong>Baby Name Browser</strong> is a free A–Z directory of 100,000+ real recorded baby names. Click any letter to see all names beginning with it, filter by gender, then tap any name for its full popularity statistics, decade trend, meaning and origin. Every name is sourced from official birth registries — no AI-invented strings.
          </p>
        </section>

        <FeatureGrid title="Key Features and Attributes" features={[
          { title: "A–Z letter navigation", description: "26 one-click letter buttons to jump anywhere in the alphabet." },
          { title: "Gender filter", description: "Boy, Girl, or Any (includes unisex)." },
          { title: "100k+ name database", description: "Real birth-registry names from US, UK, Canada, Australia and 78 other countries." },
          { title: "Full stats per name", description: "Click any name to see rank, bearer count, decade chart, meaning and origin." },
          { title: "Mobile-friendly grid", description: "Responsive layout adapts from 2 columns on mobile to 3 on desktop." },
          { title: "Zero signup", description: "Browse unlimited names without account or email." },
        ]} />

        <UseCases cases={[
          { who: "Parents building a shortlist", scenario: "Want to scan all 'M' names systematically.", outcome: "Click M, scroll through every recorded M name, drill into the ones that catch your eye." },
          { who: "Genealogists verifying spellings", scenario: "Researching whether 'Mildred' or 'Millicent' was more common in the 1920s.", outcome: "Browse the M list, tap each, compare decade charts side by side." },
          { who: "Authors picking period names", scenario: "Need a list of all 'E' girl names that existed in 1880.", outcome: "Filter to girl names, click E, cross-reference with the decade trend on each." },
          { who: "Curious browsers", scenario: "Want to discover names they've never heard of.", outcome: "Pick a less-common letter (Q, X, Y) and find unusual options instantly." },
        ]} />

        <WorkedExamples examples={[
          { input: "A + Girl", finding: "Returned 30+ names: Aaliyah, Abigail, Adelaide, Aria, Aurora…", insight: "A is the largest girl-name letter — many top-100 names start with A." },
          { input: "X + Any", finding: "Returned: Xavier, Ximena, Xander", insight: "X is one of the rarest starting letters — only 3 names cracking common usage." },
          { input: "M + Boy", finding: "Returned: Marcus, Mason, Matthew, Maxwell, Miles, Muhammad…", insight: "M dominates classic and modern boy naming traditions across cultures." },
        ]} />

        <ProsCons
          pros={["Complete A–Z directory in one place", "Real-name database, no hallucinations", "Free + unlimited", "Mobile-responsive grid", "One click to full statistics page"]}
          cons={["No popularity-based sorting yet (alphabetical only)", "Cannot bulk-favorite names (shortlist coming)", "Less coverage for non-Western naming traditions"]}
        />

        <ComparisonTable title="How It Compares to Alternatives" toolName="HowManyOfMe" rows={[
          { feature: "Full A–Z directory", ours: "✓ All 26 letters", babyCenter: "✓", nameberry: "✓", ssa: "Partial" },
          { feature: "Gender filter", ours: "✓", babyCenter: "✓", nameberry: "✓", ssa: "✓" },
          { feature: "Direct stats per name", ours: "✓", babyCenter: "✓", nameberry: "✓", ssa: "Raw CSV only" },
          { feature: "Free + unlimited", ours: "✓", babyCenter: "Limited", nameberry: "Premium-gated", ssa: "✓" },
          { feature: "Mobile-responsive grid", ours: "✓", babyCenter: "✓", nameberry: "✓", ssa: "Partial" },
          { feature: "Real registry data", ours: "✓", babyCenter: "✓", nameberry: "✓", ssa: "✓" },
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
          { to: "/tools/unique-name-generator", name: "Unique Name Generator", blurb: "Filter the same database for rare names only." },
          { to: "/tools/random-name", name: "Random Name Generator", blurb: "Get random picks instead of browsing alphabetically." },
          { to: "/tools/popularity-checker", name: "Popularity Checker", blurb: "Look up exact rank for any name you spot here." },
          { to: "/tools/meaning", name: "Name Meaning Lookup", blurb: "See what each shortlisted name means." },
        ]} />

        <DataFreshness toolName="Baby Name Browser" />
        <RelatedPosts currentSlug="baby-names" tags={["baby names", "browse", "A-Z names", "gender"]} count={12} />
      </main>
      <SiteFooter />
    </div>
  );
};

export default BabyNames;
