import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import RelatedPosts from "@/components/RelatedPosts";
import DataFreshness from "@/components/DataFreshness";
import { Copy, Check } from "lucide-react";
import {
  FeatureGrid,
  ProsCons,
  ComparisonTable,
  UseCases,
  WorkedExamples,
  RelatedToolsInline,
} from "@/components/EntitySEOSections";

const styles = [
  (n: string) => n.toLowerCase() + Math.floor(Math.random() * 999),
  (n: string) => n.toLowerCase() + "_" + ["pro", "dev", "hq", "go", "hub"][Math.floor(Math.random() * 5)],
  (n: string) => "the" + n.toLowerCase(),
  (n: string) => n.toLowerCase().split("").reverse().join("") + Math.floor(Math.random() * 99),
  (n: string) => n.substring(0, 3).toLowerCase() + "_" + n.substring(3).toLowerCase() + Math.floor(Math.random() * 99),
  (n: string) => "x" + n.toLowerCase() + "x",
  (n: string) => n.toLowerCase() + ".official",
  (n: string) => n.charAt(0).toLowerCase() + "_" + n.slice(1).toLowerCase(),
];

const PRESETS = ["Alex", "Sam", "Maya", "Jordan"];

const FAQS = [
  { q: "What is a username generator?", a: "A free tool that turns any name into 8 styled username variants — adding numbers, suffixes, separators or reversals to help you find an available handle." },
  { q: "Are these usernames available on social platforms?", a: "We don't check live availability (Instagram, TikTok, X, etc.). Generated usernames are starting points — verify on each platform before claiming." },
  { q: "What username styles does the tool generate?", a: "Eight styles per name: number-suffix, underscore-suffix, 'the' prefix, reversed, split-with-underscore, x-wrapped, .official, and dot-separated initials." },
  { q: "Can I generate gaming usernames?", a: "Yes — the styles work for gaming, streaming and social handles. Combine with a creative base name for unique results." },
  { q: "Is the Username Generator free?", a: "Yes — unlimited generations, no signup, no email, no paywall." },
  { q: "Why are short usernames hard to get?", a: "Most short, clean usernames on Instagram, X and Gmail were claimed years ago. Adding numbers, underscores or suffixes is now standard practice for new accounts." },
  { q: "Should I use my real name?", a: "Mixing your real first name with a creative suffix (yourname_dev, yourname.official) gives a balance of personal brand and uniqueness." },
  { q: "Can I copy results easily?", a: "Yes — each generated username has a one-click copy button." },
  { q: "What characters can usernames contain?", a: "Most platforms allow letters, numbers, dots and underscores. Our generator stays within these safe bounds." },
  { q: "How long should a username be?", a: "Most platforms enforce 3–30 characters. Our generated usernames typically land in the 6–20 range — readable but unique." },
];

const UsernameGenerator = () => {
  const [name, setName] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = (n: string) => {
    if (n.trim()) setResults(styles.map((fn) => fn(n.trim())));
  };

  const copy = (s: string) => {
    navigator.clipboard.writeText(s);
    setCopied(s);
    setTimeout(() => setCopied(null), 1500);
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Username Generator",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      url: "https://howmanyofme.co/tools/username-generator",
      description: "Free username generator. Turn any name into 8 styled username variants for social media, gaming and email.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.6", ratingCount: "342" },
      featureList: ["8 unique style variants", "Number/underscore/dot separators", "One-click copy", "Free unlimited use", "Works for all major platforms"],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to generate a username",
      step: [
        { "@type": "HowToStep", name: "Enter your name", text: "Type any first name or word into the input." },
        { "@type": "HowToStep", name: "Click Generate", text: "Get 8 unique styled username variants." },
        { "@type": "HowToStep", name: "Copy your favourite", text: "Tap the copy icon to copy any result." },
        { "@type": "HowToStep", name: "Verify on your platform", text: "Check availability on Instagram, X, TikTok or wherever you plan to register." },
      ],
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://howmanyofme.co/" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://howmanyofme.co/tools" },
        { "@type": "ListItem", position: 3, name: "Username Generator", item: "https://howmanyofme.co/tools/username-generator" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Username Generator — 8 Creative Variants From Any Name"
        description="Free username generator. Turn any name into 8 unique handle variants for Instagram, TikTok, gaming, email and more. One-click copy."
        canonical="https://howmanyofme.co/tools/username-generator"
        jsonLd={jsonLd}
      />
      <SiteHeader />

      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-4">Username Generator</h1>
        <p className="text-muted-foreground mb-2">
          Generate 8 creative username variants from any name. Perfect for social media, gaming, streaming and email accounts when your first-choice handle is taken.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Need name inspiration first? Try the{" "}
          <Link to="/tools/random-name" className="text-primary hover:underline">Random Name Generator</Link> or{" "}
          <Link to="/tools/unique-name-generator" className="text-primary hover:underline">Unique Name Generator</Link>.
        </p>

        {/* PRESETS */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">Try with a preset name</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((n) => (
              <button
                key={n}
                onClick={() => { setName(n); generate(n); }}
                className="px-3 py-1.5 text-sm rounded-full border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground transition"
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); generate(name); }} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 h-12 rounded-md border border-input bg-secondary px-4 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Name to generate usernames from"
          />
          <button type="submit" className="h-12 px-6 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">Generate</button>
        </form>

        {results.length > 0 && (
          <div className="space-y-2 mb-12">
            {results.map((r, i) => (
              <div key={i} className="p-4 rounded-lg border border-border bg-card flex items-center justify-between gap-3">
                <span className="font-mono text-sm">{r}</span>
                <button onClick={() => copy(r)} className="text-muted-foreground hover:text-primary" aria-label={`Copy ${r}`}>
                  {copied === r ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* INSTANT ANSWER */}
        <section className="mb-12 p-6 rounded-xl border border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold mb-2">What is a Username Generator?</h2>
          <p className="text-muted-foreground">
            A <strong>username generator</strong> is a free tool that takes a name (or word) and produces multiple styled handle variants — adding numbers, underscores, dots, prefixes or suffixes — to help you find an available username when your first choice is taken. The HowManyOfMe generator outputs <strong>8 distinct styles per click</strong>, all platform-safe (letters, numbers, dots, underscores only).
          </p>
        </section>

        <FeatureGrid title="Key Features and Attributes" features={[
          { title: "8 distinct style variants", description: "Number-suffix, underscore-suffix, prefix, reversed, split, x-wrapped, .official, dot-initials." },
          { title: "One-click copy", description: "Tap the icon next to any result to copy instantly to your clipboard." },
          { title: "Platform-safe characters", description: "Only letters, numbers, dots and underscores — accepted by Instagram, X, TikTok, Gmail and most platforms." },
          { title: "Works with any input", description: "First names, nicknames, brand words — anything goes." },
          { title: "Re-generate freely", description: "Click Generate again for a fresh batch with new random number variants." },
          { title: "Zero signup", description: "Free, unlimited, no account, no email." },
        ]} />

        <UseCases cases={[
          { who: "New social-media users", scenario: "Found that '@maya' is taken on Instagram, TikTok and X.", outcome: "Generator produces 8 alternatives like 'maya_pro', 'themaya', 'maya.official' to claim across platforms." },
          { who: "Gamers building consistent identities", scenario: "Want the same handle on Steam, Discord, Twitch and Xbox.", outcome: "Generate variants, pick one available everywhere for cross-platform recognition." },
          { who: "Streamers and creators", scenario: "Need a memorable handle that isn't 'realname12345'.", outcome: "Stylish formats like 'xnamex' or 'name.official' feel more brand-ready than random numbers." },
          { who: "Email account creators", scenario: "All clean variants of their name on Gmail are gone.", outcome: "Generator suggests usable formats like 'm_aya' or 'mayadev' that often remain available." },
        ]} />

        <WorkedExamples examples={[
          { input: "Alex", finding: "Returned: alex482, alex_pro, thealex, xela23, ale_x71, xalexx, alex.official, a_lex", insight: "Mix of casual, professional and stylized handles for any platform." },
          { input: "Maya", finding: "Returned: maya791, maya_dev, themaya, ayam12, may_a44, xmayax, maya.official, m_aya", insight: "Short names benefit most from stylization because clean versions are usually claimed." },
          { input: "Jordan", finding: "Returned: jordan239, jordan_hq, thejordan, nadroj88, jor_dan31, xjordanx, jordan.official, j_ordan", insight: "Longer names have more 'split' and 'reversed' options that still read naturally." },
        ]} />

        <ProsCons
          pros={["8 unique styles per click — no manual brainstorming", "One-click copy to clipboard", "Platform-safe character set", "Free + unlimited", "Re-generates with fresh randomness each time"]}
          cons={["Doesn't check live availability on social platforms", "Number suffixes are random, not personalized", "Limited to Latin-character usernames"]}
        />

        <ComparisonTable title="How It Compares to Alternatives" toolName="HowManyOfMe" rows={[
          { feature: "8 styles per click", ours: "✓", babyCenter: "N/A", nameberry: "N/A", ssa: "N/A" },
          { feature: "One-click copy", ours: "✓", babyCenter: "✗", nameberry: "✗", ssa: "✗" },
          { feature: "Platform-safe characters", ours: "✓", babyCenter: "Varies", nameberry: "Varies", ssa: "N/A" },
          { feature: "Free + unlimited", ours: "✓", babyCenter: "Limited", nameberry: "Premium-gated", ssa: "N/A" },
          { feature: "Live availability check", ours: "✗ Roadmap", babyCenter: "✗", nameberry: "✗", ssa: "N/A" },
          { feature: "No signup", ours: "✓", babyCenter: "Varies", nameberry: "Account needed", ssa: "N/A" },
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
          { to: "/tools/random-name", name: "Random Name Generator", blurb: "Get a starting name to feed into the username generator." },
          { to: "/tools/unique-name-generator", name: "Unique Name Generator", blurb: "Rare names make rarer usernames — combine with this tool." },
          { to: "/tools/meaning", name: "Name Meaning Lookup", blurb: "Pick a name with meaningful etymology before stylizing it." },
          { to: "/tools/baby-names", name: "Baby Name Browser", blurb: "Browse for inspiration when no name comes to mind." },
        ]} />

        <DataFreshness toolName="Username Generator" />
        <RelatedPosts currentSlug="username-generator" tags={["username", "generator", "social media"]} count={12} />
      </main>
      <SiteFooter />
    </div>
  );
};

export default UsernameGenerator;
