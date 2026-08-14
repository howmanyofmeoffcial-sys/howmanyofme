import { useEffect, useMemo, useState } from "react";
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
import { getNameData, getSimilarNames, formatNumber } from "../data/nameData";
import { detectGender, detectGenderAsync, getCachedGender } from "../lib/genderDetection";
import { COUNTRY_FLAGS } from "../lib/nameOriginCountryMap";
import FamousPeople from "../components/FamousPeople";
import { Skeleton } from "../components/ui/skeleton";
import { prefetchGender } from "../lib/prefetchGender";

interface Props {
  name: string;
  country?: string;
}

const GENDER_ACCENT: Record<string, { wrap: string; chip: string; emoji: string }> = {
  male: { wrap: "ring-blue-500/30", chip: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200", emoji: "👦" },
  female: { wrap: "ring-pink-500/30", chip: "bg-pink-100 text-pink-800 dark:bg-pink-500/15 dark:text-pink-200", emoji: "👧" },
  unisex: { wrap: "ring-emerald-500/30", chip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200", emoji: "🧒" },
};

const PIE_COLORS = ["hsl(220 80% 50%)", "hsl(160 60% 45%)", "hsl(280 60% 55%)", "hsl(30 80% 55%)", "hsl(0 70% 55%)"];

export default function NameInsightReport({ name, country }: Props) {
  const data = useMemo(() => getNameData(name), [name]);
  const localGender = useMemo(() => detectGender(name), [name]);
  const cached = useMemo(() => getCachedGender(name, country), [name, country]);
  const [gender, setGender] = useState(cached || localGender);
  const [genderLoading, setGenderLoading] = useState(!cached);
  const similar = useMemo(() => getSimilarNames(name), [name]);

  useEffect(() => {
    let active = true;
    const initial = getCachedGender(name, country);
    if (initial) {
      setGender(initial);
      setGenderLoading(false);
      return () => {
        active = false;
      };
    }
    setGender(localGender);
    setGenderLoading(true);

    detectGenderAsync(name, country)
      .then((result) => {
        if (active && result) setGender(result);
      })
      .catch(() => {
        // silently ignore — localGender is already set
      })
      .finally(() => {
        if (active) setGenderLoading(false);
      });

    return () => {
      active = false;
    };
  }, [name, country, localGender]);

  const accent = GENDER_ACCENT[gender.gender] ?? GENDER_ACCENT.unisex;
  const popularityScore = Math.max(1, Math.min(100, 100 - Math.log10(Math.max(1, data.rank)) * 20));
  const decadeData = Object.entries(data.decade_popularity).map(([decade, score]) => ({ decade, score }));
  const regionEntries = Object.entries(data.regions).sort((a, b) => b[1] - a[1]);
  const regionData = regionEntries.map(([rName, value]) => ({ name: rName, value }));
  const topCountry = regionEntries[0];

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
      {/* 1. HEADER */}
      <header className={`relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 ring-1 ${accent.wrap}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Name Insight Report</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight text-card-foreground">
              {accent.emoji} {data.name}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {genderLoading && !cached ? (
                <>
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="h-7 w-40 rounded-full" />
                </>
              ) : (
                <>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${accent.chip}`}
                    aria-live="polite"
                    data-testid="gender-chip"
                  >
                    {gender.gender.toUpperCase()}
                    {genderLoading && (
                      <span
                        aria-label="Verifying gender"
                        className="inline-block h-2.5 w-2.5 rounded-full border-2 border-current border-t-transparent animate-spin"
                      />
                    )}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                    {genderLoading
                      ? "Verifying…"
                      : `Confidence: ${Math.max(0, Math.min(100, Math.round(gender.confidence)))}% (${gender.source})`}
                  </span>
                </>
              )}
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
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
          <Globe className="h-5 w-5 text-primary" /> 🌍 Worldwide Name Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="People worldwide" value={`~${formatNumber(data.count)}`} icon={<Users className="h-4 w-4" />} />
          <Stat label="Global rank" value={`#${formatNumber(data.rank)}`} icon={<TrendingUp className="h-4 w-4" />} />
          <Stat
            label="Top country"
            value={topCountry ? `${COUNTRY_FLAGS[topCountry[0]] ?? "🌍"} ${topCountry[0]}` : "—"}
            icon={<MapPin className="h-4 w-4" />}
          />
          <Stat label="1 in" value={`${formatNumber(oneInX)} people`} icon={<Sparkles className="h-4 w-4" />} />
        </div>
      </section>

      {/* 3. US BIRTH RECORDS */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4 text-foreground">🇺🇸 US Birth Records (SSA)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat label="Estimated US bearers" value={formatNumber(data.regions["United States"] ?? Math.round(data.count * 0.45))} />
          <Stat label="Peak decade" value={peakDecade.decade} />
          <Stat label="Rank trend" value={recentTrend > 0 ? `↑ +${recentTrend}` : recentTrend < 0 ? `↓ ${recentTrend}` : "→ flat"} />
        </div>
      </section>

      {/* 4. MEANING & ORIGIN */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
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
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
          <Lightbulb className="h-5 w-5 text-primary" /> 🔍 Key Insights
        </h3>
        <ul className="space-y-2 list-none p-0 m-0">
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
        <h3 className="font-display text-xl font-bold mb-4 text-foreground">📈 Popularity Over Time</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={decadeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="decade" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* 7. POPULARITY SCORE */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4 text-foreground">📊 Popularity Score</h3>
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
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
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
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
          <Calendar className="h-5 w-5 text-primary" /> 🗓️ Decade-by-Decade Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={decadeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="decade" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
            <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* 10. REGIONAL DISTRIBUTION */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
          <MapPin className="h-5 w-5 text-primary" /> 🗺️ Region Distribution
        </h3>
        <div className="space-y-3">
          {regionData.map((r) => {
            const pct = Math.round((r.value / data.count) * 100);
            return (
              <div key={r.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-foreground">{r.name}</span>
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
          <h3 className="font-display text-xl font-bold mb-4 text-foreground">💡 Similar Names &amp; Variants</h3>
          <div className="flex flex-wrap gap-2">
            {similar.map((s) => (
              <a
                key={s}
                href={`/name/${s}`}
                onMouseEnter={() => prefetchGender(s)}
                onFocus={() => prefetchGender(s)}
                className="px-3 py-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-sm transition text-foreground"
              >
                {s}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Famous People */}
      <FamousPeople name={data.name} />

      {/* 12. FUN FACTS */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-display text-xl font-bold mb-4 text-foreground">📌 Fun Facts</h3>
        <ul className="space-y-2 text-sm text-muted-foreground list-none p-0 m-0">
          <li>🌎 If everyone named {data.name} formed a city, it would have ~{formatNumber(data.count)} residents.</li>
          <li>🎲 Probability a random person is named {data.name}: {(data.count / 8_000_000_000 * 100).toFixed(4)}%.</li>
          <li>📅 Peak generation was born during the {peakDecade.decade}.</li>
          <li>🌐 Used in {regionData.length}+ countries in our dataset.</li>
        </ul>
      </section>
    </article>
  );
}

const Stat = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-secondary/40 p-4">
    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
      {icon}
      {label}
    </div>
    <div className="text-lg md:text-xl font-bold text-foreground">{value}</div>
  </div>
);
