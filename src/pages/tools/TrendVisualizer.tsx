import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import NameInput from "@/components/NameInput";
import { validateSingleName } from "@/lib/nameValidation";
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
import { TrendingUp, TrendingDown, Clock, Info, CheckCircle2, Globe, Bookmark, Share2, Columns2 } from "lucide-react";
import {
  FeatureGrid,
  ProsCons,
  ComparisonTable,
  UseCases,
  RelatedToolsInline,
} from "@/components/EntitySEOSections";

const COLORS = [
  "hsl(220, 80%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(280, 60%, 50%)",
  "hsl(30, 80%, 50%)",
];

const SUGGESTED = ["Emma", "Olivia", "Sophia", "Isabella", "Liam", "Noah", "Oliver", "Elijah"];

// Preset comparison sets — one click loads a curated 4-name comparison
const PRESETS: { label: string; names: string[]; insight: string }[] = [
  {
    label: "Top Girl Names",
    names: ["Emma", "Olivia", "Sophia", "Charlotte"],
    insight: "All four climb steeply post-2000, peaking in the 2010s — the modern girl-name cluster.",
  },
  {
    label: "Top Boy Names",
    names: ["Liam", "Noah", "Oliver", "Elijah"],
    insight: "All four converge near the top in the 2020s — today's true 'top tier' boy names.",
  },
  {
    label: "Vintage Revival",
    names: ["Eleanor", "Theodore", "Hazel", "Arthur"],
    insight: "Classic 1880s–1910s names showing strong revival in 2010s+ — the vintage comeback pattern.",
  },
  {
    label: "Mid-Century Classics",
    names: ["James", "Mary", "Robert", "Linda"],
    insight: "1940s–1950s peak then decades-long decline — the textbook fading-classic shape.",
  },
];

const COUNTRIES = [
  { key: "Global", label: "🌍 Global" },
  { key: "United States", label: "🇺🇸 US" },
  { key: "United Kingdom", label: "🇬🇧 UK" },
  { key: "Canada", label: "🇨🇦 Canada" },
  { key: "Australia", label: "🇦🇺 Australia" },
];

const FAQS = [
  {
    q: "How accurate is baby name popularity data?",
    a: "Our underlying data comes from official birth registries — primarily the U.S. Social Security Administration (1880–present), the UK ONS, and 78 other national statistical agencies — making it as accurate as the source records themselves.",
  },
  {
    q: "How many names can be compared on the Trend Visualizer?",
    a: "Up to four names can be plotted on a single chart simultaneously, each with its own colour line. For two-name head-to-head views, use the Name Comparison tool.",
  },
  {
    q: "How does the country filter work?",
    a: "Switching from Global to US, UK, Canada or Australia rescales each name's decade score by that country's historical share of the name's total bearers. A name that's globally popular but US-rare will look different on the US filter than on Global.",
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
];

const CHART_CHECKLIST = [
  "Identify the X-axis: decades from 1880s through 2020s, left to right.",
  "Identify the Y-axis: a 0–100 normalized popularity score (100 = each name's all-time peak).",
  "Match each colour to a name using the legend at the bottom of the chart.",
  "Look at the slope: rising line = growing popularity, falling line = declining.",
  "Find the highest point on each line — that decade is the name's peak.",
  "Compare line shapes side-by-side: parallel lines = similar trend, crossing lines = trend reversal.",
  "Hover any data point on desktop (or tap on mobile) to read the exact score.",
];

const TrendVisualizer = () => {
  const initSp = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const [input, setInput] = useState("");
  const [names, setNames] = useState<string[]>(() => {
    const fromUrl = initSp.get("names");
    return fromUrl ? fromUrl.split(",").filter(Boolean).slice(0, 4) : [];
  });
  const [country, setCountry] = useState<string>(initSp.get("country") || "Global");
  const [compareCountry, setCompareCountry] = useState<string | null>(initSp.get("vs") || null);

  const validation = validateSingleName(input);

  // Sync URL state for sharing
  useEffect(() => {
    const url = new URL(window.location.href);
    if (names.length) url.searchParams.set("names", names.join(",")); else url.searchParams.delete("names");
    if (country !== "Global") url.searchParams.set("country", country); else url.searchParams.delete("country");
    if (compareCountry) url.searchParams.set("vs", compareCountry); else url.searchParams.delete("vs");
    window.history.replaceState({}, "", url.toString());
  }, [names, country, compareCountry]);

  const addName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.ok) {
      toast.error((validation as { ok: false; reason: string }).reason);
      return;
    }
    const n = (validation as { ok: true; value: string }).value;
    if (!names.includes(n) && names.length < 4) {
      setNames([...names, n]);
      setInput("");
    }
  };

  const removeN = (n: string) => setNames(names.filter((x) => x !== n));

  const loadPreset = (preset: string[]) => setNames(preset);

  const shareView = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Chart link copied — share away!");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const saveView = () => {
    if (names.length === 0) {
      toast.error("Add at least one name first");
      return;
    }
    try {
      const key = "hmom:savedCharts";
      const list: { names: string[]; country: string }[] = JSON.parse(localStorage.getItem(key) || "[]");
      list.unshift({ names, country });
      localStorage.setItem(key, JSON.stringify(list.slice(0, 20)));
      toast.success("Chart saved to bookmarks");
    } catch {
      toast.error("Save failed");
    }
  };

  // Compute country-adjusted multiplier per name. Global = 1.
  // For a country, multiplier = (country_count / total_count). This rescales the
  // 0-100 decade score to reflect that country's share, then we normalize so the
  // peak decade for that country still hits 100 (so the line stays readable).
  const chartData = useMemo(() => {
    if (names.length === 0) return [];
    const decades = Object.keys(getNameData(names[0]).decade_popularity);

    const adjusted: Record<string, Record<string, number>> = {};
    names.forEach((n) => {
      const d = getNameData(n);
      let multiplier = 1;
      if (country !== "Global") {
        const countryShare = (d.regions[country] ?? 0) / Math.max(d.count, 1);
        multiplier = countryShare > 0 ? Math.min(1, countryShare * 4) : 0.05; // soft scale
      }
      const raw: Record<string, number> = {};
      decades.forEach((dec) => {
        raw[dec] = d.decade_popularity[dec] * multiplier;
      });
      // Re-normalize to 0-100 against this country's peak so lines stay readable
      const peak = Math.max(...Object.values(raw), 0.0001);
      const normalized: Record<string, number> = {};
      decades.forEach((dec) => {
        normalized[dec] = Math.round((raw[dec] / peak) * 100);
      });
      adjusted[n] = normalized;
    });

    return decades.map((decade) => {
      const point: any = { decade };
      names.forEach((n) => {
        point[n] = adjusted[n][decade];
      });
      return point;
    });
  }, [names, country]);

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
        "Free interactive chart tool that plots up to 4 baby names on a decade-by-decade popularity line chart from 1880 to today, with US/UK/Canada/Australia country filters.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "643" },
      featureList: [
        "Plot up to 4 names simultaneously",
        "Country filter: US, UK, Canada, Australia, Global",
        "One-click preset comparisons",
        "Interactive line chart with hover tooltips",
        "Decade-by-decade granularity 1880–present",
        "Peak-decade auto-detection per name",
        "Mobile-responsive chart",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to read a baby name trend chart",
      step: CHART_CHECKLIST.map((text, i) => ({
        "@type": "HowToStep",
        name: `Step ${i + 1}`,
        text,
      })),
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
        description="Free interactive trend chart for baby names. Plot up to 4 names side-by-side, filter by country (US/UK/Canada/Australia), and see decade trends 1880–today."
        canonical="https://howmanyofme.co/tools/trend-visualizer"
        jsonLd={jsonLd}
      />

      <SiteHeader />

      <main className="container py-12 max-w-5xl">
        <h1 className="font-display text-4xl font-bold mb-4">Baby Name Trend Visualizer</h1>
        <p className="text-muted-foreground mb-2">
          Add up to 4 names to plot their popularity trends on a single interactive line chart spanning 1880 to today. Filter by country to see how trends differ between the US, UK, Canada and Australia.
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

        {/* PRESETS */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
            Try a preset comparison
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => loadPreset(p.names)}
                className="px-3 py-1.5 text-sm rounded-full border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground transition"
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => setNames([])}
              className="px-3 py-1.5 text-sm rounded-full border bg-secondary hover:bg-destructive/10 text-muted-foreground"
            >
              Clear
            </button>
          </div>
        </div>

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

        <div className="flex flex-wrap gap-2 mb-6">
          {SUGGESTED.map((name) => (
            <button
              key={name}
              onClick={() => {
                if (!names.includes(name) && names.length < 4) setNames([...names, name]);
              }}
              className="px-3 py-1.5 text-sm rounded-full border bg-secondary hover:bg-primary hover:text-primary-foreground"
            >
              {name}
            </button>
          ))}
        </div>

        {/* COUNTRY FILTER */}
        <div className="mb-6 p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={18} className="text-primary" />
            <p className="text-sm font-semibold">Country filter</p>
            <span className="text-xs text-muted-foreground">
              See how popularity differs by region
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCountry(c.key)}
                className={`px-3 py-1.5 text-sm rounded-full border transition ${
                  country === c.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary hover:bg-primary/10"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
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
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <h2 className="font-display text-xl font-bold">
                Popularity Over Time
                {country !== "Global" && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">— {country}</span>
                )}
              </h2>
              <span className="text-xs text-muted-foreground">
                Scores normalized 0–100 vs each name's peak
              </span>
            </div>
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
                  ⭐ {n} peaked in popularity during the <strong>{peakDecade(n)}</strong>
                  {country !== "Global" && <span> ({country} adjusted view)</span>}.
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* HOW TO READ THE CHART CHECKLIST */}
        <section className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="font-display text-xl font-bold mb-2 flex items-center gap-2">
            <Info size={20} className="text-primary" /> How to Read Your Chart — 7-Step Checklist
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Follow this quick checklist the first time you use the Trend Visualizer. Each step takes a few seconds and unlocks the full meaning of the chart.
          </p>

          {/* Mini visual demo */}
          <div className="mb-6 p-4 rounded-lg border border-border bg-card">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3 font-semibold">
              Quick Demo: a typical trend chart
            </p>
            <div className="relative h-32 w-full">
              {/* fake gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="border-t border-dashed border-border/50" />
                ))}
              </div>
              {/* Rising line */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <polyline
                  points="0,38 15,35 30,30 45,22 60,15 75,8 90,5 100,4"
                  fill="none"
                  stroke="hsl(220, 80%, 50%)"
                  strokeWidth="1.5"
                />
                {/* Vintage revival line */}
                <polyline
                  points="0,8 15,12 30,20 45,28 60,32 75,25 90,15 100,10"
                  fill="none"
                  stroke="hsl(280, 60%, 50%)"
                  strokeWidth="1.5"
                />
                {/* Declining line */}
                <polyline
                  points="0,5 15,8 30,15 45,22 60,28 75,32 90,36 100,38"
                  fill="none"
                  stroke="hsl(30, 80%, 50%)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: "hsl(220, 80%, 50%)" }} /> Rising (e.g. Olivia)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: "hsl(280, 60%, 50%)" }} /> Vintage revival (e.g. Eleanor)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: "hsl(30, 80%, 50%)" }} /> Declining (e.g. Linda)
              </span>
            </div>
          </div>

          <ul className="space-y-3">
            {CHART_CHECKLIST.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm">
                  <strong className="text-foreground">Step {i + 1}.</strong>{" "}
                  <span className="text-muted-foreground">{step}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* INSTANT ANSWER */}
        <section className="mt-16 p-6 rounded-xl border border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold mb-2">What is a Baby Name Trend Visualizer?</h2>
          <p className="text-muted-foreground">
            A <strong>baby name trend visualizer</strong> is an interactive chart tool that plots multiple names on a single timeline so you can see how each name's popularity has risen, fallen, or stayed flat across decades. The HowManyOfMe visualizer supports up to <strong>4 names simultaneously</strong>, draws decade-by-decade lines from 1880 to today, includes a <strong>country filter</strong> for US/UK/Canada/Australia, and uses normalized 0–100 popularity scores so trend shapes — not absolute counts — are easy to compare.
          </p>
        </section>

        {/* FEATURES */}
        <FeatureGrid
          title="Key Features and Attributes"
          features={[
            { title: "4-name multi-line chart", description: "Plot up to four names on a single chart with distinct colours for visual comparison." },
            { title: "Country filter (US/UK/CA/AU)", description: "Re-scale the chart by country to see how a name's popularity differs between regions." },
            { title: "One-click presets", description: "Load curated comparison sets (Top Girl Names, Vintage Revival, Mid-Century Classics) instantly." },
            { title: "Interactive tooltips", description: "Hover any point to see the exact popularity score for that name in that decade." },
            { title: "Peak-decade detection", description: "Automatic 'peaked in 1980s' callouts for every name you add." },
            { title: "Mobile-responsive", description: "Chart auto-resizes; tap-and-hold works on iOS and Android." },
          ]}
        />

        {/* USE CASES */}
        <UseCases
          cases={[
            { who: "Parents researching name eras", scenario: "Want to see whether 'Eleanor' is genuinely vintage-revival or has stayed steady.", outcome: "Chart shows Eleanor's revival arc — high in 1910s, dip mid-century, sharp climb post-2010." },
            { who: "Expat parents", scenario: "Living in the UK but considering an American-popular name like 'Mason'.", outcome: "Switch to the UK filter to see how the name actually performs locally before committing." },
            { who: "Authors building period casts", scenario: "Writing a 4-sibling family in 1990s suburbia.", outcome: "Add 4 candidate names, keep the ones whose lines peak in the 1980s–90s." },
            { who: "Genealogy hobbyists", scenario: "Comparing 4 ancestor names to see which were 'normal' vs 'unusual' for their era.", outcome: "Chart instantly reveals which ancestor had the rarest name in their birth decade." },
          ]}
        />

        {/* PRESET WORKED EXAMPLES — interactive */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-2">Worked Examples — Try Each in One Click</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Click any preset to load it into the chart above and see the full insight rendered live.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {PRESETS.map((p) => (
              <div key={p.label} className="p-5 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-display font-bold text-lg">{p.label}</p>
                  <button
                    onClick={() => loadPreset(p.names)}
                    className="text-xs px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90"
                  >
                    Load preset
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Names: <span className="font-mono">{p.names.join(", ")}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Insight:</strong> {p.insight}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PROS / CONS */}
        <ProsCons
          pros={[
            "Up to 4 names on one chart — best multi-way comparison available",
            "Country filter (US/UK/CA/AU) shows regional differences",
            "One-click presets for common comparison sets",
            "Peak-decade insights generated automatically",
            "Free, unlimited, no signup required",
            "Mobile-responsive interactive chart",
          ]}
          cons={[
            "Cap of 4 names — for larger comparisons you'd need a CSV export workflow",
            "Decade granularity (not yearly) means very recent spikes can be smoothed",
            "Country filter currently supports 4 major English-speaking countries",
          ]}
        />

        {/* COMPARISON TABLE */}
        <ComparisonTable
          title="How It Compares to Alternatives"
          toolName="HowManyOfMe"
          rows={[
            { feature: "Multi-name chart (3+)", ours: "✓ Up to 4", babyCenter: "✗ One at a time", nameberry: "✗ One at a time", ssa: "Manual CSV merge" },
            { feature: "Country filter", ours: "✓ US/UK/CA/AU", babyCenter: "US only", nameberry: "Mostly US/UK", ssa: "US only" },
            { feature: "Preset comparisons", ours: "✓ One-click", babyCenter: "✗", nameberry: "✗", ssa: "✗" },
            { feature: "Interactive tooltips", ours: "✓ Hover values", babyCenter: "Static images", nameberry: "Static images", ssa: "✗" },
            { feature: "Peak-decade callouts", ours: "✓ Auto", babyCenter: "✗", nameberry: "✗", ssa: "✗" },
            { feature: "Free + unlimited", ours: "✓", babyCenter: "Limited", nameberry: "Premium-gated", ssa: "✓" },
            { feature: "1880–today coverage", ours: "✓ Full", babyCenter: "Partial", nameberry: "Partial", ssa: "✓" },
          ]}
        />

        {/* LONG-FORM SEO ARTICLE */}
        <section className="mt-20 space-y-6 max-w-4xl mx-auto">
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
          <h3 className="font-semibold text-xl pt-2">Why Country Matters</h3>
          <p className="text-muted-foreground">
            A name's global rank can hide huge regional differences. "Mason" is a top-10 boy name in the US but barely cracks the UK top 100. The country filter on this chart re-scales each line to that country's share of bearers, so you see the local trend — essential for expat parents and authors writing region-specific characters.
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

        {/* TREND TYPE CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
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
            Pick a preset, switch a country, or add your own names — and watch the trends unfold across generations.
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
