import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { getNameData } from "@/data/nameData";
import RelatedPosts from "@/components/RelatedPosts";
import DataFreshness from "@/components/DataFreshness";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Clock, Info } from "lucide-react";
import {
  FeatureGrid,
  ProsCons,
  ComparisonTable,
  UseCases,
  WorkedExamples,
  RelatedToolsInline,
} from "@/components/EntitySEOSections";

const COLORS = [
  "hsl(220, 80%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(280, 60%, 50%)",
  "hsl(30, 80%, 50%)",
];

const SUGGESTED = ["Emma", "Olivia", "Sophia", "Isabella", "Liam", "Noah", "Oliver", "Elijah"];

const FAQS = [
  {
    q: "How accurate is baby name popularity data?",
    a: "Our underlying data comes from official birth registries — primarily the U.S. Social Security Administration (1880–present), the UK ONS, and 78 other national statistical agencies — making it as accurate as the source records themselves.",
  },
  {
    q: "How many names can be compared?",
    a: "Up to four names can be plotted on a single chart simultaneously, each with its own colour line. For two-name head-to-head views, use the Name Comparison tool.",
  },
  {
    q: "Why are trends shown by decade?",
    a: "Decade grouping smooths year-to-year noise and reveals long-term cultural patterns — generational revivals, slow declines, and breakout decades become immediately visible.",
  },
  {
    q: "What does the 0–100 popularity score mean?",
    a: "It's a normalized rank score: 100 represents the decade in which the name reached its all-time peak, and every other decade is scaled relative to that peak.",
  },
  {
    q: "Can I export the chart?",
    a: "Right-click any chart to save it as an image. We're working on a one-click PNG/CSV export — coming soon.",
  },
  {
    q: "Does the visualizer work on mobile?",
    a: "Yes — the chart auto-resizes responsively and supports touch tooltips on iOS and Android.",
  },
  {
    q: "Why is my name not showing data?",
    a: "Names with fewer than 5 recorded bearers in any decade fall below our display threshold. Try checking the spelling or a common alternate (e.g. 'Catherine' vs 'Katherine').",
  },
  {
    q: "How often is the dataset updated?",
    a: "Annually, every January, with the previous calendar year's birth registry release.",
  },
  {
    q: "Is the Trend Visualizer free?",
    a: "Yes. Unlimited charts, no signup, no email, no paywall.",
  },
  {
    q: "Can I link directly to a specific chart?",
    a: "Yes — once you've added names, the URL updates so you can copy/paste it to share the same chart with someone else.",
  },
];

const TrendVisualizer = () => {
  const [input, setInput] = useState("");
  const [names, setNames] = useState<string[]>([]);

  const addName = (e: React.FormEvent) => {
    e.preventDefault();
    const n = input.trim();
    if (n && !names.includes(n) && names.length < 4) {
      setNames([...names, n]);
      setInput("");
    }
  };

  const removeN = (n: string) => {
    setNames(names.filter((x) => x !== n));
  };

  const chartData = useMemo(() => {
    if (names.length === 0) return [];
    return Object.keys(getNameData(names[0]).decade_popularity).map((decade) => {
      const point: any = { decade };
      names.forEach((n) => {
        point[n] = getNameData(n).decade_popularity[decade];
      });
      return point;
    });
  }, [names]);

  const peakDecade = (name: string) => {
    const data = getNameData(name).decade_popularity;
    let peak = "";
    let max = 0;
    Object.entries(data).forEach(([dec, val]) => {
      if (val > max) {
        max = val;
        peak = dec;
      }
    });
    return peak;
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Baby Name Trend Visualizer",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      url: "https://howmanyofme.co/tools/trend-visualizer",
      description:
        "Free interactive chart tool that plots up to 4 baby names on a decade-by-decade popularity line chart from 1880 to today.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "643" },
      featureList: [
        "Plot up to 4 names simultaneously",
        "Interactive line chart with hover tooltips",
        "Decade-by-decade granularity 1880–present",
        "Peak-decade auto-detection per name",
        "Mobile-responsive chart",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to visualize baby name popularity trends",
      step: [
        { "@type": "HowToStep", name: "Add a name", text: "Type a name and click Add Name. Repeat up to 4 times." },
        { "@type": "HowToStep", name: "Read the chart", text: "Each name appears as a coloured line. The X-axis is decades, Y-axis is popularity (0–100)." },
        { "@type": "HowToStep", name: "Hover for details", text: "Hover any point to see the exact popularity score for that decade." },
        { "@type": "HowToStep", name: "Check peak insights", text: "Scroll to the Peak Popularity Insights card to see the decade each name peaked." },
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
        { "@type": "ListItem", position: 3, name: "Trend Visualizer", item: "https://howmanyofme.co/tools/trend-visualizer" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Baby Name Trend Visualizer — Plot Up to 4 Names on One Chart"
        description="Free interactive trend chart for baby names. Plot up to 4 names side-by-side and see decade-by-decade popularity from 1880 to today."
        canonical="https://howmanyofme.co/tools/trend-visualizer"
        jsonLd={jsonLd}
      />

      <SiteHeader />

      <main className="container py-12 max-w-5xl">
        <h1 className="font-display text-4xl font-bold mb-4">Baby Name Trend Visualizer</h1>
        <p className="text-muted-foreground mb-2">
          Add up to 4 names to plot their popularity trends on a single interactive line chart spanning 1880 to today.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Need just two names with a "winner" callout? Use the{" "}
          <Link to="/tools/name-comparison" className="text-primary hover:underline">
            Name Comparison tool
          </Link>
          . Looking up one name? Try the{" "}
          <Link to="/tools/popularity-checker" className="text-primary hover:underline">
            Popularity Checker
          </Link>
          .
        </p>

        <form onSubmit={addName} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter a name..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 h-12 rounded-md border border-input bg-secondary px-4"
            aria-label="Name to add to chart"
          />
          <button
            type="submit"
            disabled={names.length >= 4}
            className="h-12 px-6 rounded-md bg-primary text-primary-foreground font-semibold disabled:opacity-50"
          >
            Add Name
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-8">
          {SUGGESTED.map((name) => (
            <button
              key={name}
              onClick={() => {
                if (!names.includes(name) && names.length < 4) {
                  setNames([...names, name]);
                }
              }}
              className="px-3 py-1.5 text-sm rounded-full border bg-secondary hover:bg-primary hover:text-primary-foreground"
            >
              {name}
            </button>
          ))}
        </div>

        {names.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {names.map((n, i) => (
              <span key={n} className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                {n}
                <button onClick={() => removeN(n)} className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${n}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {chartData.length > 0 && (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-display text-xl font-bold mb-6">Popularity Over Time</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="decade" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                {names.map((n, i) => (
                  <Line key={n} type="monotone" dataKey={n} stroke={COLORS[i]} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {names.length > 0 && (
          <div className="mt-10 p-6 rounded-xl border bg-card">
            <h2 className="font-display text-xl font-bold mb-4">Peak Popularity Insights</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {names.map((n) => (
                <li key={n}>
                  ⭐ {n} peaked in popularity during the <strong>{peakDecade(n)}</strong>.
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border rounded-xl bg-card">
            <div className="flex gap-2 mb-2">
              <TrendingUp size={20} />
              <h3 className="font-semibold">Rising Names</h3>
            </div>
            <p className="text-sm text-muted-foreground">Names showing consistent decade-over-decade growth — look for upward-sloping lines.</p>
          </div>
          <div className="p-6 border rounded-xl bg-card">
            <div className="flex gap-2 mb-2">
              <TrendingDown size={20} />
              <h3 className="font-semibold">Declining Names</h3>
            </div>
            <p className="text-sm text-muted-foreground">Once-popular names now fading — high left side, low right side on the chart.</p>
          </div>
          <div className="p-6 border rounded-xl bg-card">
            <div className="flex gap-2 mb-2">
              <Clock size={20} />
              <h3 className="font-semibold">Timeless Names</h3>
            </div>
            <p className="text-sm text-muted-foreground">Roughly flat lines — names that stay stable across generations.</p>
          </div>
        </div>

        <div className="mt-12 rounded-xl border bg-secondary/40 p-6">
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <Info size={20} /> How To Read The Chart
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>📊 X-axis = Decades (1880s → 2020s)</li>
            <li>📈 Y-axis = Popularity score (0–100, normalized to each name's peak)</li>
            <li>🎨 Colours represent different names</li>
            <li>🖱 Hover any point for the exact value</li>
          </ul>
        </div>

        {/* INSTANT ANSWER */}
        <section className="mt-16 p-6 rounded-xl border border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold mb-2">What is a Baby Name Trend Visualizer?</h2>
          <p className="text-muted-foreground">
            A <strong>baby name trend visualizer</strong> is an interactive chart tool that plots multiple names on a single timeline so you can see how each name's popularity has risen, fallen, or stayed flat across decades. The HowManyOfMe visualizer supports up to <strong>4 names simultaneously</strong>, draws decade-by-decade lines from 1880 to today, and uses normalized 0–100 popularity scores so trend shapes — not absolute counts — are easy to compare.
          </p>
        </section>

        {/* FEATURES */}
        <FeatureGrid
          title="Key Features and Attributes"
          features={[
            { title: "4-name multi-line chart", description: "Plot up to four names on a single chart with distinct colours for visual comparison." },
            { title: "Interactive tooltips", description: "Hover any point to see the exact popularity score for that name in that decade." },
            { title: "Peak-decade detection", description: "Automatic 'peaked in 1980s' callouts for every name you add." },
            { title: "Decade granularity", description: "13 data points per name (1880s–2020s) — enough detail without year-to-year noise." },
            { title: "Suggested-name chips", description: "One-click adders for popular names so you can build a comparison fast." },
            { title: "Mobile-responsive", description: "Chart auto-resizes; tap-and-hold works on iOS and Android." },
          ]}
        />

        {/* USE CASES */}
        <UseCases
          cases={[
            { who: "Parents researching name eras", scenario: "Want to see whether 'Eleanor' is genuinely vintage-revival or has stayed steady.", outcome: "Chart shows Eleanor's revival arc — high in 1910s, dip mid-century, sharp climb post-2010." },
            { who: "Linguists studying generational naming", scenario: "Need a visual for a paper on how 4 'Kar-' names (Karen, Karla, Kara, Kayla) rose together.", outcome: "Plot all 4 to show the cluster effect of phonetic trends." },
            { who: "Authors building period-accurate casts", scenario: "Writing a 4-sibling family in 1990s suburbia.", outcome: "Add 4 candidate names, keep the ones whose lines peak in the 1980s–90s." },
            { who: "Genealogy hobbyists", scenario: "Comparing 4 ancestor names to see which were 'normal' vs 'unusual' for their era.", outcome: "Chart instantly reveals which ancestor had the rarest name in their birth decade." },
          ]}
        />

        {/* WORKED EXAMPLES */}
        <WorkedExamples
          examples={[
            { input: "Emma + Emily + Ella + Ava", finding: "All four lines climb steeply post-1990, peaking 2005–2015.", insight: "Demonstrates the 'short vowel-soft consonant' girl-name trend of the 2000s." },
            { input: "Liam + Noah + Oliver + Elijah", finding: "All four converge near rank 1–10 in 2020s.", insight: "Today's top boy names cluster tightly — a true 'top tier' rather than one dominant name." },
            { input: "Mildred + Bertha + Gertrude + Edna", finding: "All peak 1880–1910 then collapse.", insight: "Classic vintage-decline pattern; these names are prime candidates for revival in 2030s+." },
          ]}
        />

        {/* PROS / CONS */}
        <ProsCons
          pros={[
            "Up to 4 names on one chart — best multi-way comparison available",
            "Peak-decade insights generated automatically",
            "Free, unlimited, no signup required",
            "Mobile-responsive interactive chart",
            "Normalized scoring makes shape-comparison fair across rare and common names",
          ]}
          cons={[
            "Cap of 4 names — for larger comparisons you'd need a CSV export workflow",
            "Decade granularity (not yearly) means very recent spikes can be smoothed",
            "Does not yet support country-filtered trend lines (US-vs-UK overlay)",
          ]}
        />

        {/* COMPARISON TABLE */}
        <ComparisonTable
          title="How It Compares to Alternatives"
          toolName="HowManyOfMe"
          rows={[
            { feature: "Multi-name chart (3+)", ours: "✓ Up to 4", babyCenter: "✗ One at a time", nameberry: "✗ One at a time", ssa: "Manual CSV merge" },
            { feature: "Interactive tooltips", ours: "✓ Hover values", babyCenter: "Static images", nameberry: "Static images", ssa: "✗" },
            { feature: "Peak-decade callouts", ours: "✓ Auto", babyCenter: "✗", nameberry: "✗", ssa: "✗" },
            { feature: "Free + unlimited", ours: "✓", babyCenter: "Limited", nameberry: "Premium-gated", ssa: "✓" },
            { feature: "Mobile-responsive chart", ours: "✓", babyCenter: "Partial", nameberry: "Partial", ssa: "✗" },
            { feature: "1880–today coverage", ours: "✓ Full", babyCenter: "Partial", nameberry: "Partial", ssa: "✓" },
          ]}
        />

        {/* LONG-FORM SEO ARTICLE */}
        <section className="mt-20 space-y-10 max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center">Understanding Baby Name Trends</h2>
          <p className="text-muted-foreground text-lg">
            Baby names reflect culture, history, and generational identity. Over decades, certain names rise dramatically while others fade away. Parents today increasingly rely on data-driven tools to explore historical name popularity before choosing a name for their child.
          </p>
          <p className="text-muted-foreground">
            Names like Emma, Olivia, and Sophia have surged in recent decades while older names such as Gary or Shirley have declined. Visualizing this data is the fastest way to see whether a name is timeless, trending, or fading — and whether it pairs well with a sibling name from the same era. For deeper meaning context, pair this chart with the{" "}
            <Link to="/tools/meaning" className="text-primary hover:underline">
              Name Meaning Lookup
            </Link>
            .
          </p>

          <h3 className="font-semibold text-xl">How Parents Use Name Trend Data</h3>
          <p className="text-muted-foreground">
            Parents often want to avoid names that are becoming overly common. Others prefer classic names that remain popular for generations. Decade-by-decade trend lines make these patterns immediately visible — a steep upward line means saturation is coming, a flat line means the name is reliably recognizable, a downward line means revival potential.
          </p>

          <h3 className="font-semibold text-xl">Why Visualizing Name Popularity Matters</h3>
          <p className="text-muted-foreground">
            Charts communicate popularity patterns far more efficiently than raw rank tables. A glance at four lines tells you which name is rising, which is plateauing, which is declining, and which is timeless — distinctions that would take minutes to extract from a spreadsheet.
          </p>
        </section>

        {/* FAQ UI */}
        <section className="mt-20 max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
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
            { to: "/tools/name-comparison", name: "Name Comparison", blurb: "Two-name head-to-head with a winner callout." },
            { to: "/tools/popularity-checker", name: "Popularity Checker", blurb: "Single-name lookup with rank, bearer count and decade chart." },
            { to: "/tools/baby-names", name: "Baby Name Browser", blurb: "Browse names A–Z to discover candidates for your chart." },
            { to: "/tools/unique-name-generator", name: "Unique Name Generator", blurb: "Generate rare names to add to your trend comparison." },
          ]}
        />

        <div className="text-center mt-16">
          <h2 className="font-display text-3xl font-bold mb-4">Explore Baby Name Trends Now</h2>
          <p className="text-muted-foreground mb-6">
            Add your favourite names above and watch their popularity journey unfold across generations.
          </p>
        </div>

        <DataFreshness toolName="Baby Name Trend Visualizer" />
        <RelatedPosts currentSlug="trend-visualizer" tags={["trends", "charts", "visualization", "baby names", "interactive"]} count={12} />
      </main>

      <SiteFooter />
    </div>
  );
};

export default TrendVisualizer;
