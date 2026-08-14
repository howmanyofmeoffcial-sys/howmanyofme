import React, { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { resolveNameSearch } from "../../lib/estimation/resolveNameSearch";
import type { NameEstimateResult } from "../../lib/estimation/types";
import { NameEstimateCard } from "../homepage/NameEstimateCard";
import { trackEvent } from "../../lib/analytics/events";

const SUGGESTED = ["Emma", "Olivia", "Sophia", "Liam", "Noah", "Oliver", "David Smith", "James Johnson"];

export default function PopularityCheckerIsland() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<NameEstimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = (inputName: string) => {
    const trimmed = inputName.trim();
    if (!trimmed) {
      setError("Please enter a name to check");
      return;
    }

    setError(null);
    const estimate = resolveNameSearch({
      firstName: trimmed,
    });

    setResult(estimate);

    trackEvent(estimate.queryType === "full-name" ? "full_name_search_submitted" : "name_search_submitted", {
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
      {/* Quick suggested chips */}
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Try a popular name or combination
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
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:border-primary/50 hover:text-primary text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
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
            type="text"
            placeholder="Enter first name or full name (e.g. David, José, Sophia Brown)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError(null);
            }}
            className="w-full h-12 rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        <button
          type="submit"
          className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          Check Popularity
        </button>
      </form>

      {error && <p className="text-xs text-destructive font-medium">{error}</p>}

      {/* Inline result presentation */}
      {result && (
        <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <NameEstimateCard result={result} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}
