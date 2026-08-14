import React, { useState } from "react";
import { Search, Sparkles, TrendingUp, BarChart3, RotateCcw } from "lucide-react";
import { resolveNameSearch } from "../../lib/estimation/resolveNameSearch";
import type { NameEstimateResult } from "../../lib/estimation/types";
import { NameEstimateCard } from "../homepage/NameEstimateCard";
import { trackEvent } from "../../lib/analytics/events";

const SUGGESTED = ["James", "Olivia", "Rahul", "José", "David Smith", "Sophia Brown"];

export default function PopularityCheckerIsland() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<NameEstimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = (inputName: string) => {
    const trimmed = inputName.trim();
    if (!trimmed) {
      setError("Please enter a name to check its popularity.");
      return;
    }

    setError(null);
    setIsLoading(true);

    const estimate = resolveNameSearch({
      firstName: trimmed,
    });

    setResult(estimate);
    setIsLoading(false);

    trackEvent(estimate.queryType === "full-name" ? "full_name_search_submitted" : "name_search_submitted", {
      search_mode: estimate.queryType === "full-name" ? "full_name" : "first_name",
      source_page_type: "tool",
    });

    trackEvent("name_result_viewed", {
      result_mode: estimate.mode,
      search_mode: estimate.queryType === "full-name" ? "full_name" : "first_name",
      source_page_type: "tool",
    });
  };

  const handleReset = () => {
    setResult(null);
    setQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Search Form Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-lg space-y-4">
        <div>
          <label htmlFor="popularity-name-input" className="block text-base font-bold text-foreground mb-1">
            Check How Popular, Common, or Rare Any Name Is
          </label>
          <p className="text-xs text-muted-foreground">
            Enter a first name, surname, or full name combination to analyze U.S. popularity rankings, historical peak eras, and rarity tiers.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCheck(query);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              id="popularity-name-input"
              type="text"
              placeholder="e.g. Olivia, James, Rahul, José, David Smith..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (error) setError(null);
              }}
              aria-label="Enter a name to check its popularity"
              className="w-full h-12 rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            {isLoading ? "Analyzing..." : "Check Popularity"}
          </button>
        </form>

        {error && <p className="text-xs text-destructive font-medium">{error}</p>}

        {/* Example Chips */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Try these example names:
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setQuery(s);
                  handleCheck(s);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-secondary/30 hover:border-primary/50 hover:text-primary text-foreground transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inline result presentation (Phase B2 Rich Result Card with Popularity Lead) */}
      {result && (
        <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-3 duration-300">
          {/* Dedicated Popularity Summary Banner */}
          <div className="p-6 rounded-2xl border border-primary/25 bg-primary/5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-0.5">
                  Popularity &amp; Rarity Analysis
                </span>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  How Popular Is {result.displayName}?
                </h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 p-2 rounded-lg bg-background border border-border"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Check Another Name
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-card border border-border">
                <span className="text-muted-foreground block mb-1">Rarity Classification</span>
                <strong className="text-foreground text-sm font-bold text-primary">
                  {result.richInsights?.rarity.level ?? "Standard"}
                </strong>
                <span className="text-[11px] text-muted-foreground block mt-0.5">
                  {result.richInsights?.rarity.description ?? "Demographic tier"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border">
                <span className="text-muted-foreground block mb-1">National Ratio</span>
                <strong className="text-foreground text-sm font-bold">
                  {result.richInsights?.rarity.oneInX
                    ? `1 in ~${result.richInsights.rarity.oneInX.toLocaleString()}`
                    : "Available"}
                </strong>
                <span className="text-[11px] text-muted-foreground block mt-0.5">U.S. population frequency</span>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border">
                <span className="text-muted-foreground block mb-1">Historical Peak Era</span>
                <strong className="text-foreground text-sm font-bold">
                  {result.richInsights?.history?.peakYear
                    ? `${result.richInsights.history.peakYear}s`
                    : "Historical"}
                </strong>
                <span className="text-[11px] text-muted-foreground block mt-0.5">
                  {result.richInsights?.history?.peakCount
                    ? `~${result.richInsights.history.peakCount.toLocaleString()} peak births/yr`
                    : "Recorded peak"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border">
                <span className="text-muted-foreground block mb-1">Recent 10-Yr Trajectory</span>
                <strong className="text-foreground text-sm font-bold capitalize flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  {result.richInsights?.history?.trendDirection ?? "Stable"}
                </strong>
                <span className="text-[11px] text-muted-foreground block mt-0.5">Newborn birth trajectory</span>
              </div>
            </div>
          </div>

          {/* Full B2 Rich Result Card */}
          <NameEstimateCard result={result} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}
