import React, { useState, useMemo } from "react";
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
import { Plus, X, Sparkles, TrendingUp, BarChart3, AlertCircle, ExternalLink } from "lucide-react";
import { resolveNameSearch } from "../../lib/estimation/resolveNameSearch";
import type { NameEstimateResult } from "../../lib/estimation/types";
import { trackEvent } from "../../lib/analytics/events";

const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
];

const PRESETS = [
  {
    label: "Top Modern Names",
    names: ["Olivia", "Liam", "Emma", "Noah"],
  },
  {
    label: "Vintage Revivals",
    names: ["Oliver", "Hazel", "Theodore", "Eleanor"],
  },
  {
    label: "Mid-Century Classics",
    names: ["James", "Mary", "Robert", "Linda"],
  },
  {
    label: "Fast Climbers",
    names: ["Nova", "Kai", "Harper", "Luna"],
  },
];

export default function TrendVisualizerIsland() {
  const [names, setNames] = useState<string[]>(["Emma", "Olivia"]);
  const [inputVal, setInputVal] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addName = (rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    if (names.length >= 4) {
      setError("You can compare up to 4 names simultaneously.");
      return;
    }

    if (names.some((n) => n.toLowerCase() === trimmed.toLowerCase())) {
      setError(`"${trimmed}" is already in the comparison chart.`);
      return;
    }

    setError(null);
    setNames([...names, trimmed]);
    setInputVal("");

    trackEvent("name_search_submitted", {
      search_mode: "first_name",
      source_page_type: "tool",
    });
  };

  const removeName = (idxToRemove: number) => {
    if (names.length <= 1) {
      setError("Please keep at least one name on the chart.");
      return;
    }
    setError(null);
    setNames(names.filter((_, i) => i !== idxToRemove));
  };

  // Resolve all active names deterministically
  const resolvedProfiles: Array<{ name: string; estimate: NameEstimateResult }> = useMemo(() => {
    return names.map((n) => ({
      name: n,
      estimate: resolveNameSearch({ firstName: n }),
    }));
  }, [names]);

  // Aligned chart timeline data from 1880s through 2020s
  const chartData = useMemo(() => {
    const allDecades = new Set<string>();
    const seriesMaps: Record<string, Map<string, number>> = {};

    resolvedProfiles.forEach(({ name, estimate }) => {
      const hist = estimate.richInsights?.history?.history ?? [];
      const map = new Map<string, number>();
      hist.forEach((pt) => {
        allDecades.add(pt.decade);
        map.set(pt.decade, pt.count);
      });
      seriesMaps[name] = map;
    });

    const sortedDecades = Array.from(allDecades).sort();

    return sortedDecades.map((decade) => {
      const row: Record<string, any> = { decade };
      resolvedProfiles.forEach(({ name }) => {
        row[name] = seriesMaps[name]?.get(decade) ?? 0;
      });
      return row;
    });
  }, [resolvedProfiles]);

  return (
    <div className="space-y-8">
      {/* Interactive Controls Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-lg space-y-6">
        <div>
          <label htmlFor="trend-name-input" className="block text-base font-bold text-foreground mb-1">
            Explore &amp; Compare Popularity Curves (1880–2024)
          </label>
          <p className="text-xs text-muted-foreground">
            Add up to 4 names to plot historical birth registration trajectories across 14 consecutive decades.
          </p>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addName(inputVal);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              id="trend-name-input"
              type="text"
              placeholder="Enter a first name to add (e.g. Liam, Sophia, Theodore)..."
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (error) setError(null);
              }}
              disabled={names.length >= 4}
              className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={names.length >= 4 || !inputVal.trim()}
            className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Add to Chart
          </button>
        </form>

        {error && (
          <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
          </p>
        )}

        {/* Active Name Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground font-semibold mr-1">Active Names:</span>
          {names.map((name, i) => (
            <span
              key={name}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border border-border bg-background shadow-2xs transition-all"
              style={{ borderLeftColor: COLORS[i % COLORS.length], borderLeftWidth: 4 }}
            >
              <span>{name}</span>
              {names.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeName(i)}
                  className="h-4 w-4 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center text-[11px] transition-colors"
                  title={`Remove ${name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>

        {/* Thematic Presets */}
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2.5 font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Curated Historical Matchups:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setNames([...p.names]);
                  setError(null);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-secondary/30 hover:border-primary/50 hover:text-primary text-foreground transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Historical Chart Card */}
      <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
              U.S. Popularity Trends Across 140+ Years (1880–2024)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Official recorded births per decade from the U.S. Social Security Administration.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-foreground flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-primary" /> SSA Official Records
          </span>
        </div>

        {/* Chart Area */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="decade"
                tick={{ fontSize: 11, fill: "currentColor" }}
                opacity={0.7}
              />
              <YAxis
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)}
                tick={{ fontSize: 11, fill: "currentColor" }}
                opacity={0.7}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "0.75rem",
                  fontSize: "0.75rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                formatter={(val: number) => [`${val.toLocaleString()} recorded births`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }} />
              {names.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Metric Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/50">
          {resolvedProfiles.map(({ name, estimate }, i) => {
            const hist = estimate.richInsights?.history;
            return (
              <div
                key={name}
                className="p-4 rounded-xl border border-border bg-background space-y-2"
                style={{ borderTopColor: COLORS[i % COLORS.length], borderTopWidth: 3 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-foreground">{name}</h3>
                  <a
                    href={`/name/${estimate.firstName || name}`}
                    className="text-[11px] text-primary hover:underline flex items-center gap-0.5"
                    title={`View full ${name} profile`}
                  >
                    Profile <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>
                    Peak Era: <strong className="text-foreground">{hist?.peakYear ? `${hist.peakYear}s` : "N/A"}</strong>
                  </div>
                  <div>
                    Peak Births: <strong className="text-foreground">{hist?.peakCount ? `~${hist.peakCount.toLocaleString()}/yr` : "N/A"}</strong>
                  </div>
                  <div className="flex items-center gap-1">
                    Trend:{" "}
                    <strong className="text-foreground capitalize flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-primary" />
                      {hist?.trendDirection ?? "Stable"}
                    </strong>
                  </div>
                  <div>
                    Rarity: <strong className="text-foreground">{estimate.richInsights?.rarity.level ?? "Standard"}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
