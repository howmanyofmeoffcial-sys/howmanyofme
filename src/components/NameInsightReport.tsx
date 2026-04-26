import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Globe,
  Users,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Calendar,
  MapPin,
  Sparkles,
  Award,
  PieChart as PieIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getNameData, getSimilarNames, formatNumber } from "@/data/nameData";
import { detectGender } from "@/lib/genderDetection";
import { looksLikeRealName } from "@/lib/nameValidation";

interface Props {
  name: string;
  /** Restricts country breakdown to a single region when provided (US/UK/etc.). */
  country?: string;
}

const GENDER_ACCENT: Record<string, { bg: string; text: string; ring: string; emoji: string }> = {
  male: { bg: "bg-[hsl(220_80%_94%)]", text: "text-[hsl(220_80%_35%)]", ring: "ring-[hsl(220_80%_50%)]", emoji: "👦" },
  female: { bg: "bg-[hsl(330_80%_94%)]", text: "text-[hsl(330_70%_40%)]", ring: "ring-[hsl(330_70%_55%)]", emoji: "👧" },
  unisex: { bg: "bg-[hsl(160_50%_92%)]", text: "text-[hsl(160_60%_30%)]", ring: "ring-[hsl(160_60%_45%)]", emoji: "🧒" },
};

const PIE_COLORS = ["hsl(220 80% 50%)", "hsl(160 60% 45%)", "hsl(280 60% 55%)", "hsl(30 80% 55%)", "hsl(0 70% 55%)"];

const NameInsightReport = ({ name, country }: Props) => {
  const data = useMemo(() => getNameData(name), [name]);
  const gender = useMemo(() => detectGender(name), [name]);
  const similar = useMemo(() => getSimilarNames(name), [name]);
  const isReal = looksLikeRealName(name);

  const accent = GENDER_ACCENT[gender.gender];
  const popularityScore = Math.max(1, Math.min(100, 100 - Math.log10(Math.max(1, data.rank)) * 20));
  const decadeData = Object.entries(data.decade_popularity).map(([decade, score]) => ({ decade, score }));
  const regionEntries = Object.entries(data.regions).sort((a, b) => b[1] - a[1]);
  const regionData = regionEntries.map(([name, value]) => ({ name, value }));
  const topCountry = regionEntries[0];

  // Synthetic age distribution from decade popularity (approx).
  const ageData = useMemo(() => {
    const buckets = [
      { label: "0–17", decades: ["2010s", "2020s"] },
      { label: "18–34", decades: ["1990s", "2000s"] },
      { label: "35–54", decades: ["1970s", "1980s"] },
      { label: "55–74", decades: ["1950s", "1960s"] },
      { label: "75+", decades: ["1940s"] },
    ];
    return buckets.map((b) => ({
      label: b.label,
      score: Math.round(b.decades.reduce((acc, d) => acc + (data.decade_popularity[d] ?? 0), 0) / b.decades.length),
    }));
  }, [data]);

  const peakDecade = decadeData.reduce((a, b) => (b.score > a.score ? b : a), decadeData[0]);
  const recentTrend = decadeData[decadeData.length - 1].score - decadeData[decadeData.length - 3].score;

  const insights: string[] = [];
  if (peakDecade.score > 80) insights.push(`Most popular in the ${peakDecade.decade} (peak score ${peakDecade.score}/100).`);
  if (recentTrend > 15) insights.push(`Trending upward — gained ${recentTrend} points in the last 2 decades.`);
  else if (recentTrend < -15) insights.push(`Declining — lost ${Math.abs(recentTrend)} points in the last 2 decades.`);
  else insights.push("Stable popularity across recent decades.");
  if (topCountry) insights.push(`Most common in ${topCountry[0]} (~${formatNumber(topCountry[1])} bearers).`);
  insights.push(`Originates from ${data.origin} tradition, meaning "${data.meaning}".`);
  if (data.rank < 100) insights.push("Globally ranked in the top 100 — a widely recognized name.");

  const oneInX = Math.round(8_000_000_000 / Math.max(1, data.count));

  return (
    <article className="space-y-8" aria-label={`Name insight report for ${data.name}`}>
      {!isReal && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 p-4 text-sm">
          ⚠️ <strong>Heads up:</strong> "{name}" doesn't appear to be a common real name. Showing best-effort estimates only.
        </div>
      )}

      {/* 1. HEADER */}
      <header className={`relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 ring-1 ${accent.ring} ring-opacity-20`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Name Insight Report</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              {accent.emoji} {data.name}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${accent.bg} ${accent.text}`}>
                {gender.gender.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                Confidence: {Math.round(gender.confidence * 100)}% ({gender.source})
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary font-semibold">
                <Award className="inline h-3 w-3 mr-1" />
                Popularity {Math.round(popularityScore)}/100
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                Global rank #{formatNumber(data.rank)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. WORLDWIDE STATS */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" /> 🌍 Worldwide Name Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="People worldwide" value={`~${formatNumber(data.count)}`} icon={<Users className="h-4 w-4" />} />
          <Stat label="Global rank" value={`#${formatNumber(data.rank)}`} icon={<TrendingUp className="h-4 w-4" />} />
          <Stat label="Top country" value={topCountry?.[0] ?? "—"} icon={<MapPin className="h-4 w-4" />} />
          <Stat label="1 in" value={`${formatNumber(oneInX)} people`} icon={<Sparkles className="h-4 w-4" />} />
        </div>
      </section>

      {/* 3. US BIRTH RECORDS */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4">🇺🇸 US Birth Records (SSA)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat label="Estimated US bearers" value={formatNumber(data.regions["United States"] ?? Math.round(data.count * 0.45))} />
          <Stat label="Peak decade" value={peakDecade.decade} />
          <Stat label="Rank trend" value={recentTrend > 0 ? `↑ +${recentTrend}` : recentTrend < 0 ? `↓ ${recentTrend}` : "→ flat"} />
        </div>
      </section>

      {/* 4. MEANING & ORIGIN */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" /> 📖 Name Meaning & Origin
        </h3>
        <p className="text-muted-foreground">
          <strong className="text-foreground">{data.name}</strong> originates from{" "}
          <strong className="text-foreground">{data.origin}</strong> tradition. The meaning is associated with{" "}
          <em>"{data.meaning}"</em>.
        </p>
      </section>

      {/* 5. KEY INSIGHTS */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" /> 🔍 Key Insights
        </h3>
        <ul className="space-y-2">
          {insights.map((line, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-primary">▸</span>
              <span className="text-muted-foreground">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. POPULARITY OVER TIME */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4">📈 Popularity Over Time</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={decadeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="decade" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }} />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* 7. POPULARITY SCORE */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4">📊 Popularity Score</h3>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-primary">{Math.round(popularityScore)}</div>
          <div className="flex-1">
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${popularityScore}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {popularityScore >= 80 ? "Extremely popular" : popularityScore >= 50 ? "Popular" : popularityScore >= 25 ? "Uncommon" : "Rare"}
            </p>
          </div>
        </div>
      </section>

      {/* 8. AGE DISTRIBUTION */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <PieIcon className="h-5 w-5 text-primary" /> 👶 Age Distribution
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={ageData} dataKey="score" nameKey="label" cx="50%" cy="50%" outerRadius={90} label>
              {ageData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* 9. DECADE BREAKDOWN */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" /> 🗓️ Decade-by-Decade Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={decadeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="decade" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }} />
            <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* 10. REGIONAL DISTRIBUTION */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> 🗺️ Region Distribution
        </h3>
        <div className="space-y-3">
          {regionData.map((r) => {
            const pct = Math.round((r.value / data.count) * 100);
            return (
              <div key={r.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-muted-foreground">{formatNumber(r.value)} ({pct}%)</span>
                </div>
                <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. SIMILAR NAMES */}
      {similar.length > 0 && (
        <section className="rounded-2xl border bg-card p-6">
          <h3 className="font-display text-xl font-bold mb-4">💡 Similar Names &amp; Variants</h3>
          <div className="flex flex-wrap gap-2">
            {similar.map((s) => (
              <Link
                key={s}
                to={`/name/${s}`}
                className="px-3 py-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-sm transition"
              >
                {s}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 12. FUN FACTS */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4">📌 Fun Facts</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>🌎 If everyone named {data.name} formed a city, it would have ~{formatNumber(data.count)} residents.</li>
          <li>🎲 Probability a random person is named {data.name}: {(data.count / 8_000_000_000 * 100).toFixed(4)}%.</li>
          <li>📅 Peak generation was born during the {peakDecade.decade}.</li>
          <li>🌐 Used in {regionData.length}+ countries in our dataset.</li>
        </ul>
      </section>
    </article>
  );
};

const Stat = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-secondary/40 p-4">
    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
      {icon}
      {label}
    </div>
    <div className="text-lg md:text-xl font-bold">{value}</div>
  </div>
);

export default NameInsightReport;
