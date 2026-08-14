import React, { useState } from "react";
import { Search, Sparkles } from "lucide-react";
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
      setError("Please enter a name to check.");
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
            Enter a first name, last name, or full name
          </label>
          <p className="text-xs text-muted-foreground">
            Enter a single name for first-name demographics, or enter "First Last" for a full-name living estimate.
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
              placeholder="e.g. James, Olivia, Rahul, José, David Smith..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (error) setError(null);
              }}
              aria-label="Enter a first name, last name, or full name"
              className="w-full h-12 rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm shrink-0 disabled:opacity-50"
          >
            {isLoading ? "Checking..." : "Check Name"}
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

      {/* Inline result presentation (Phase B2 Rich Result Card) */}
      {result && (
        <div className="pt-2 animate-in fade-in slide-in-from-top-3 duration-300">
          <NameEstimateCard result={result} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}
