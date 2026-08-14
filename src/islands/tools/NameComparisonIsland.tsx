import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowRightLeft,
  Sparkles,
  BarChart3,
  Award,
  AlertCircle,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { resolveNameSearch } from "../../lib/estimation/resolveNameSearch";
import type { NameEstimateResult } from "../../lib/estimation/types";
import { trackEvent } from "../../lib/analytics/events";

const EXAMPLE_PAIRS = [
  { a: "Emma", b: "Olivia" },
  { a: "James", b: "Liam" },
  { a: "Sophia", b: "Isabella" },
  { a: "Rahul", b: "Arjun" },
  { a: "José", b: "Maria" },
];

export default function NameComparisonIsland() {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [resultA, setResultA] = useState<NameEstimateResult | null>(null);
  const [resultB, setResultB] = useState<NameEstimateResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [sameNameWarning, setSameNameWarning] = useState<string | null>(null);
  const [hasCompared, setHasCompared] = useState(false);

  // Initialize from URL query parameters if present (e.g. ?a=Emma&b=Olivia)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const paramA = sp.get("a") || sp.get("nameA");
      const paramB = sp.get("b") || sp.get("nameB");
      if (paramA && paramB) {
        setNameA(paramA);
        setNameB(paramB);
        executeComparison(paramA, paramB);
      }
    }
  }, []);

  const executeComparison = (inputA: string, inputB: string) => {
    const cleanA = inputA.trim();
    const cleanB = inputB.trim();

    if (!cleanA || !cleanB) {
      setValidationError("Please enter both names to compare.");
      return;
    }

    setValidationError(null);

    if (cleanA.toLowerCase() === cleanB.toLowerCase()) {
      setSameNameWarning(
        `Both names are identical ("${cleanA}"), so their demographic statistics will match. Try entering two different names for a side-by-side comparison.`
      );
    } else {
      setSameNameWarning(null);
    }

    const resA = resolveNameSearch({ firstName: cleanA });
    const resB = resolveNameSearch({ firstName: cleanB });

    setResultA(resA);
    setResultB(resB);
    setHasCompared(true);

    trackEvent("comparison_completed", {
      name_a: cleanA,
      name_b: cleanB,
      mode_a: resA.mode,
      mode_b: resB.mode,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeComparison(nameA, nameB);
  };

  const handleSwap = () => {
    const tempA = nameA;
    const tempB = nameB;
    setNameA(tempB);
    setNameB(tempA);
    if (resultA && resultB) {
      setResultA(resultB);
      setResultB(resultA);
    }
    trackEvent("swap_names_clicked", { name_a: tempB, name_b: tempA });
  };

  const handleReset = () => {
    setNameA("");
    setNameB("");
    setResultA(null);
    setResultB(null);
    setValidationError(null);
    setSameNameWarning(null);
    setHasCompared(false);
  };

  // Comparative insights computation
  const comparisonInsights = useMemo(() => {
    if (!resultA || !resultB) return null;

    const countA = resultA.estimatedPeople ?? 0;
    const countB = resultB.estimatedPeople ?? 0;

    let populationLeader: "A" | "B" | "tie" = "tie";
    let ratioText = "";

    if (countA > 0 && countB > 0) {
      const diffPct = Math.abs(countA - countB) / Math.max(countA, countB);
      if (diffPct < 0.05) {
        populationLeader = "tie";
        ratioText = "Nearly identical in national living population scale";
      } else if (countA > countB) {
        populationLeader = "A";
        const ratio = (countA / countB).toFixed(1);
        ratioText = `${resultA.displayName} has approximately ${ratio}× more living bearers in the U.S. than ${resultB.displayName}.`;
      } else {
        populationLeader = "B";
        const ratio = (countB / countA).toFixed(1);
        ratioText = `${resultB.displayName} has approximately ${ratio}× more living bearers in the U.S. than ${resultA.displayName}.`;
      }
    }

    // Historical comparison
    const historyA = resultA.richInsights?.history;
    const historyB = resultB.richInsights?.history;

    let peakComparisonText = "";
    if (historyA?.peakYear && historyB?.peakYear) {
      if (historyA.peakYear === historyB.peakYear) {
        peakComparisonText = `Both names peaked in the ${historyA.peakYear}s decade.`;
      } else if (historyA.peakYear < historyB.peakYear) {
        peakComparisonText = `${resultA.displayName} peaked earlier (${historyA.peakYear}s) than ${resultB.displayName} (${historyB.peakYear}s).`;
      } else {
        peakComparisonText = `${resultB.displayName} peaked earlier (${historyB.peakYear}s) than ${resultA.displayName} (${historyA.peakYear}s).`;
      }
    }

    return {
      populationLeader,
      ratioText,
      peakComparisonText,
      historyA,
      historyB,
    };
  }, [resultA, resultB]);

  // Aligned chart timeline data
  const chartData = useMemo(() => {
    if (!resultA || !resultB) return [];
    const histA = resultA.richInsights?.history?.history ?? [];
    const histB = resultB.richInsights?.history?.history ?? [];

    if (histA.length === 0 && histB.length === 0) return [];

    const decadesSet = new Set<string>();
    histA.forEach((h) => decadesSet.add(h.decade));
    histB.forEach((h) => decadesSet.add(h.decade));

    const sortedDecades = Array.from(decadesSet).sort();
    const mapA = new Map(histA.map((h) => [h.decade, h.count]));
    const mapB = new Map(histB.map((h) => [h.decade, h.count]));

    return sortedDecades.map((decade) => ({
      decade,
      [resultA.displayName]: mapA.get(decade) ?? 0,
      [resultB.displayName]: mapB.get(decade) ?? 0,
    }));
  }, [resultA, resultB]);

  return (
    <div className="space-y-8">
      {/* Search and Comparison Form */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-lg space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="compare-name-a" className="block text-sm font-bold text-foreground mb-1.5">
                First Name (Name A)
              </label>
              <input
                id="compare-name-a"
                type="text"
                placeholder="e.g. Emma, James, Rahul..."
                value={nameA}
                onChange={(e) => {
                  setNameA(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            <div>
              <label htmlFor="compare-name-b" className="block text-sm font-bold text-foreground mb-1.5">
                Second Name (Name B)
              </label>
              <input
                id="compare-name-b"
                type="text"
                placeholder="e.g. Olivia, Liam, Arjun..."
                value={nameB}
                onChange={(e) => {
                  setNameB(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {validationError && (
            <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              {validationError}
            </p>
          )}

          {sameNameWarning && (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {sameNameWarning}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Compare Names
            </button>

            <button
              type="button"
              onClick={handleSwap}
              disabled={!nameA && !nameB}
              className="h-12 px-4 rounded-xl border border-border bg-secondary/50 text-foreground font-semibold text-sm hover:bg-secondary transition-colors flex items-center gap-1.5 disabled:opacity-40"
              title="Swap Name A and Name B"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Swap
            </button>

            {hasCompared && (
              <button
                type="button"
                onClick={handleReset}
                className="h-12 px-4 rounded-xl text-muted-foreground hover:text-foreground text-sm font-medium flex items-center gap-1.5 ml-auto"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Quick Example Chips */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2.5 font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Popular Name Matchups:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PAIRS.map((p) => (
              <button
                key={`${p.a}-${p.b}`}
                type="button"
                onClick={() => {
                  setNameA(p.a);
                  setNameB(p.b);
                  executeComparison(p.a, p.b);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-secondary/30 hover:border-primary/50 hover:text-primary text-foreground transition-colors"
              >
                {p.a} <span className="text-muted-foreground">vs</span> {p.b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Results Card */}
      {hasCompared && resultA && resultB && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-3 duration-300">
          {/* Top Level Winner / Summary Callout */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                Comparison: {resultA.displayName} vs {resultB.displayName}
              </h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-foreground">
                U.S. Demographic Data
              </span>
            </div>

            {/* Ratio Summary */}
            {comparisonInsights?.ratioText && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground font-medium flex items-center gap-2.5">
                <Award className="h-5 w-5 text-primary shrink-0" />
                <span>{comparisonInsights.ratioText}</span>
              </div>
            )}

            {/* Side-by-Side Dual Headings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Name A Card */}
              <div className="p-5 rounded-xl border border-border bg-background space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold text-foreground">{resultA.displayName}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                    Name A
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-foreground tracking-tight">
                  ~{resultA.displayEstimate}
                  <span className="text-xs font-normal text-muted-foreground ml-1.5">living bearers</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>
                    Rarity: <strong className="text-foreground">{resultA.richInsights?.rarity.level}</strong>
                  </div>
                  <div>
                    Confidence: <strong className="text-foreground capitalize">{resultA.confidence ?? "standard"}</strong>
                  </div>
                </div>
                <a
                  href={`/name/${resultA.firstName}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-2"
                >
                  View Full {resultA.displayName} Profile <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Name B Card */}
              <div className="p-5 rounded-xl border border-border bg-background space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold text-foreground">{resultB.displayName}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-foreground">
                    Name B
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-foreground tracking-tight">
                  ~{resultB.displayEstimate}
                  <span className="text-xs font-normal text-muted-foreground ml-1.5">living bearers</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>
                    Rarity: <strong className="text-foreground">{resultB.richInsights?.rarity.level}</strong>
                  </div>
                  <div>
                    Confidence: <strong className="text-foreground capitalize">{resultB.confidence ?? "standard"}</strong>
                  </div>
                </div>
                <a
                  href={`/name/${resultB.firstName}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-2"
                >
                  View Full {resultB.displayName} Profile <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Metric Table */}
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-secondary/70 text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border">
                <tr>
                  <th scope="col" className="p-3.5">Metric</th>
                  <th scope="col" className="p-3.5">{resultA.displayName}</th>
                  <th scope="col" className="p-3.5">{resultB.displayName}</th>
                  <th scope="col" className="p-3.5">Difference / Takeaway</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <th scope="row" className="p-3.5 font-semibold text-foreground">Estimated Living Bearers</th>
                  <td className="p-3.5 font-mono">~{resultA.displayEstimate}</td>
                  <td className="p-3.5 font-mono">~{resultB.displayEstimate}</td>
                  <td className="p-3.5 text-xs text-muted-foreground">
                    {comparisonInsights?.populationLeader === "A"
                      ? `${resultA.displayName} has a larger living cohort.`
                      : comparisonInsights?.populationLeader === "B"
                      ? `${resultB.displayName} has a larger living cohort.`
                      : "Cohorts are virtually equal in size."}
                  </td>
                </tr>

                <tr className="hover:bg-secondary/20 transition-colors">
                  <th scope="row" className="p-3.5 font-semibold text-foreground">Rarity Classification</th>
                  <td className="p-3.5">{resultA.richInsights?.rarity.level}</td>
                  <td className="p-3.5">{resultB.richInsights?.rarity.level}</td>
                  <td className="p-3.5 text-xs text-muted-foreground">
                    {resultA.richInsights?.rarity.level === resultB.richInsights?.rarity.level
                      ? "Both share the same rarity tier."
                      : "Distinct demographic rarity tiers."}
                  </td>
                </tr>

                <tr className="hover:bg-secondary/20 transition-colors">
                  <th scope="row" className="p-3.5 font-semibold text-foreground">Historical Peak Decade</th>
                  <td className="p-3.5">
                    {resultA.richInsights?.history?.peakYear ? `${resultA.richInsights.history.peakYear}s` : "N/A"}
                  </td>
                  <td className="p-3.5">
                    {resultB.richInsights?.history?.peakYear ? `${resultB.richInsights.history.peakYear}s` : "N/A"}
                  </td>
                  <td className="p-3.5 text-xs text-muted-foreground">
                    {comparisonInsights?.peakComparisonText || "Comparative historical peaks."}
                  </td>
                </tr>

                <tr className="hover:bg-secondary/20 transition-colors">
                  <th scope="row" className="p-3.5 font-semibold text-foreground">Recent 10-Year Trend</th>
                  <td className="p-3.5 capitalize">
                    {resultA.richInsights?.history?.trendDirection ?? "Stable"}
                  </td>
                  <td className="p-3.5 capitalize">
                    {resultB.richInsights?.history?.trendDirection ?? "Stable"}
                  </td>
                  <td className="p-3.5 text-xs text-muted-foreground">
                    Trajectories among modern newborn registrations.
                  </td>
                </tr>

                <tr className="hover:bg-secondary/20 transition-colors">
                  <th scope="row" className="p-3.5 font-semibold text-foreground">Primary Gender Split</th>
                  <td className="p-3.5">{resultA.richInsights?.gender?.label ?? "N/A"}</td>
                  <td className="p-3.5">{resultB.richInsights?.gender?.label ?? "N/A"}</td>
                  <td className="p-3.5 text-xs text-muted-foreground">
                    Historical registration balance in federal archives.
                  </td>
                </tr>

                <tr className="hover:bg-secondary/20 transition-colors">
                  <th scope="row" className="p-3.5 font-semibold text-foreground">Data Confidence Status</th>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${resultA.mode === "verified" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"}`}>
                      {resultA.mode === "verified" ? "Source-Backed" : "Modelled"}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${resultB.mode === "verified" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"}`}>
                      {resultB.mode === "verified" ? "Source-Backed" : "Modelled"}
                    </span>
                  </td>
                  <td className="p-3.5 text-xs text-muted-foreground">
                    Deterministic indexing verification.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Historical Comparison Line Chart */}
          {chartData.length > 0 && (
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Historical Decade-by-Decade Comparison (1880–2024)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Total recorded U.S. Social Security birth registrations per decade.
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">
                  SSA Official Data
                </span>
              </div>

              <div className="h-72 w-full pt-2">
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
                      formatter={(val: number) => [`${val.toLocaleString()} births`, ""]}
                    />
                    <Legend wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }} />
                    <Line
                      type="monotone"
                      dataKey={resultA.displayName}
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey={resultB.displayName}
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
                <strong>Timeline Takeaway:</strong> {comparisonInsights?.peakComparisonText}{" "}
                The trajectory illustrates how cultural preferences and generational shifts shaped the popularity of each name across 140+ years.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
