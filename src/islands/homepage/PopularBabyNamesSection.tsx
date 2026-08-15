import React, { useState } from "react";
import ssa2025Raw from "../../data/raw/ssa/ssa_2025.json";
import canonicalNamesList from "../../data/generated/canonical-names.json";
import { DATA_FRESHNESS } from "../../lib/data-freshness";
import { ArrowRight, Sparkles, Search } from "lucide-react";

interface NameEntry {
  rank: number;
  name: string;
  count: number;
  sex: "M" | "F";
}

const CANONICAL_INDEXED_SET = new Set((canonicalNamesList as any[]).map((n) => n.name.toLowerCase()));

export const PopularBabyNamesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"boys" | "girls">("boys");
  const year = DATA_FRESHNESS.latestAvailableBirthYear;

  const topBoys: NameEntry[] = (ssa2025Raw as any)?.topMale?.slice(0, 30) || [];
  const topGirls: NameEntry[] = (ssa2025Raw as any)?.topFemale?.slice(0, 30) || [];

  const currentList = activeTab === "boys" ? topBoys : topGirls;

  return (
    <section className="space-y-6" aria-labelledby="popular-baby-names-heading">
      {/* Header with Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
            <Sparkles className="h-3 w-3" />
            Official SSA Release
          </div>
          <h2 id="popular-baby-names-heading" className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Popular Baby Names in {year}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            The most popular U.S. baby names from the latest available Social Security Administration data.
          </p>
        </div>

        {/* Gender Toggle Tabs */}
        <div
          role="tablist"
          aria-label="Filter baby names by gender"
          className="flex items-center bg-secondary/60 p-1 rounded-xl border border-border shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "boys"}
            aria-controls="boys-panel"
            id="boys-tab"
            onClick={() => setActiveTab("boys")}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              activeTab === "boys"
                ? "bg-background text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Boys (Top 30)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "girls"}
            aria-controls="girls-panel"
            id="girls-tab"
            onClick={() => setActiveTab("girls")}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              activeTab === "girls"
                ? "bg-background text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Girls (Top 30)
          </button>
        </div>
      </div>

      {/* Grid of Top 30 Names */}
      <div
        role="tabpanel"
        id={`${activeTab}-panel`}
        aria-labelledby={`${activeTab}-tab`}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
      >
        {currentList.map((item) => {
          const isIndexed = CANONICAL_INDEXED_SET.has(item.name.toLowerCase());
          const targetUrl = isIndexed
            ? `/name/${encodeURIComponent(item.name)}`
            : `/tools/popularity-checker?name=${encodeURIComponent(item.name)}`;

          return (
            <a
              key={item.rank}
              href={targetUrl}
              aria-label={`${item.name}, rank #${item.rank} with ${item.count.toLocaleString()} registered births`}
              className="p-3.5 sm:p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all group block"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-foreground group-hover:text-primary transition-colors text-base">
                  {item.name}
                </span>
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                    item.rank <= 3
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold border border-amber-500/30"
                      : "bg-secondary text-muted-foreground font-semibold"
                  }`}
                >
                  #{item.rank}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {item.count.toLocaleString()} births
              </div>
            </a>
          );
        })}
      </div>

      {/* Explanatory Source Note & Discovery CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          Rankings reflect U.S. baby-name data from the Social Security Administration for the {year} birth year.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/tools/baby-names"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm"
          >
            <span>Browse All 200 Baby Names</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <a
            href="/tools/popularity-checker"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-semibold hover:bg-secondary transition-all"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Check a Name's Popularity</span>
          </a>
        </div>
      </div>
    </section>
  );
};
