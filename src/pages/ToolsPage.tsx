import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import {
  TrendingUp, Shuffle, Baby, User, BookOpen, Globe, GitCompare,
  LineChart, Sparkles, HelpCircle, Search,
} from "lucide-react";
import RelatedPosts from "@/components/RelatedPosts";

const tools = [
  { icon: TrendingUp, title: "Name Popularity Checker", desc: "Track how any name's popularity has changed decade by decade with detailed charts.", link: "/tools/popularity-checker", keyword: "name popularity checker" },
  { icon: GitCompare, title: "Name Popularity Comparison", desc: "Compare two names side by side — popularity, trends, and regional differences.", link: "/tools/name-comparison", keyword: "compare names" },
  { icon: LineChart, title: "Baby Name Trend Visualizer", desc: "Visualize popularity trends for up to 4 names with interactive time-series charts.", link: "/tools/trend-visualizer", keyword: "baby name trends" },
  { icon: Sparkles, title: "Unique Baby Name Generator", desc: "Discover rare and unique baby names with customizable filters for gender and popularity.", link: "/tools/unique-name-generator", keyword: "unique baby names" },
  { icon: Shuffle, title: "Random Name Generator", desc: "Generate random real names from our database with filters for gender and origin.", link: "/tools/random-name", keyword: "random name generator" },
  { icon: Baby, title: "Baby Name Ideas", desc: "Browse curated baby name suggestions filtered by letter and gender.", link: "/tools/baby-names", keyword: "baby name ideas" },
  { icon: User, title: "Username Generator", desc: "Create unique username ideas based on any name for social media and gaming.", link: "/tools/username-generator", keyword: "username generator" },
  { icon: BookOpen, title: "Name Meaning Lookup", desc: "Discover the etymology, origin, and cultural significance of any name.", link: "/tools/meaning", keyword: "name meaning" },
  { icon: Search, title: "Similar Names Finder", desc: "Find names that look or sound like any first name — great for shortlists and alternatives.", link: "/similar-names", keyword: "similar names" },
  { icon: Globe, title: "How Many People Have My Name?", desc: "Find out how many people worldwide share your name with detailed statistics.", link: "/", keyword: "how many people have my name" },
  { icon: HelpCircle, title: "How to Use the Popularity Checker", desc: "Step-by-step guide to getting the most out of our name popularity tools.", link: "/tools/popularity-guide", keyword: "popularity guide" },
];

const faqs = [
  { q: "Are these name tools really free to use?", a: "Yes — every tool on HowManyOfMe is 100% free, with no signup, no email capture, and no paywall. You can run unlimited searches, comparisons, and generations." },
  { q: "Where does the data behind these tools come from?", a: "We aggregate data from official government sources, primarily the U.S. Social Security Administration (350M+ records since 1880), UK ONS, Statistics Canada, Australian ABS, and Eurostat — covering 100M+ names across 80+ countries." },
  { q: "Which tool should I start with?", a: "If you want to know how rare your name is, start with the Name Popularity Checker. If you're picking a baby name, try the Unique Baby Name Generator or the Trend Visualizer. For social media, use the Username Generator." },
  { q: "Do the tools work on mobile?", a: "Yes — every tool is fully responsive and works on phone, tablet, and desktop. No app installation required." },
  { q: "How accurate are the popularity estimates?", a: "For common names in well-documented countries (US, UK, Canada, Australia), our estimates are accurate within ±5%. For rarer names, accuracy ranges from ±10% to ±25% — every estimate carries a confidence score." },
  { q: "Can I share my results?", a: "Yes — every tool result preserves its inputs in the URL, so you can copy the link and share the exact same view with anyone." },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Name Tools & Utilities",
    url: "https://howmanyofme.co/tools",
    description: "Suite of 10 free name tools: popularity checker, comparison, trend visualizer, unique baby name generator, random names, username generator, meaning lookup and more.",
    isPartOf: { "@id": "https://howmanyofme.co/#website" },
    inLanguage: "en-US",
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://howmanyofme.co${t.link}`,
      name: t.title,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
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
    ],
  },
];

const ToolsPage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Free Name Tools — Popularity, Trends, Generators & Meaning"
      description="10 free name tools backed by 100M+ records: popularity checker, comparison, trend visualizer, unique baby name generator, username generator, meaning lookup. No signup."
      canonical="https://howmanyofme.co/tools"
      jsonLd={jsonLd}
    />
    <SiteHeader />
    <main className="container py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Tools</span>
      </nav>

      <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
        Free Name Tools & Utilities
      </h1>
      <p className="text-lg text-muted-foreground mb-3 max-w-3xl">
        Ten free, no-signup name tools powered by a database of 100 million+ real names from
        official U.S. SSA, UK ONS and global sources. Check popularity, compare two names
        side-by-side, visualize decade trends, generate unique baby names, find similar
        names, build usernames or look up meaning and origin — all in one place.
      </p>
      <p className="text-sm text-muted-foreground mb-10 max-w-3xl">
        Every tool runs instantly in your browser, works on mobile, and lets you share results
        via a clean URL. Pick a tool below to get started.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <Link
            key={tool.title}
            to={tool.link}
            title={tool.keyword}
            className="group p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all"
          >
            <tool.icon className="h-10 w-10 text-primary mb-4" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {tool.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{tool.desc}</p>
          </Link>
        ))}
      </div>

      {/* Key insights — programmatic-SEO topical authority */}
      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
          Which name tool should you use?
        </h2>
        <ul className="space-y-3 text-muted-foreground">
          <li><strong className="text-foreground">Curious how rare your name is?</strong> Use the <Link to="/tools/popularity-checker" className="text-primary hover:underline">Popularity Checker</Link> for a rank, bearer count and decade trend.</li>
          <li><strong className="text-foreground">Choosing between two baby names?</strong> The <Link to="/tools/name-comparison" className="text-primary hover:underline">Name Comparison</Link> tool shows them side-by-side.</li>
          <li><strong className="text-foreground">Want hidden-gem names?</strong> Try the <Link to="/tools/unique-name-generator" className="text-primary hover:underline">Unique Baby Name Generator</Link> with a rarity threshold.</li>
          <li><strong className="text-foreground">Looking for alternatives to a name you like?</strong> The <Link to="/similar-names" className="text-primary hover:underline">Similar Names Finder</Link> surfaces close matches.</li>
          <li><strong className="text-foreground">Need a social handle?</strong> The <Link to="/tools/username-generator" className="text-primary hover:underline">Username Generator</Link> turns any name into 8 variants.</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {faqs.map(f => (
            <details key={f.q} className="group p-4 rounded-lg border border-border bg-card">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                {f.q}
                <span className="text-primary text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <RelatedPosts currentSlug="tools-page" tags={["tools", "baby names", "popularity", "generator", "trends"]} count={12} />
    </main>
    <SiteFooter />
  </div>
);

export default ToolsPage;
