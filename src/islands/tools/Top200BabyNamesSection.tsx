import React, { useState } from "react";
import ssa2025Raw from "../../data/raw/ssa/ssa_2025.json";
import canonicalNamesList from "../../data/generated/canonical-names.json";
import { DATA_FRESHNESS } from "../../lib/data-freshness";
import { Sparkles, Trophy, Search } from "lucide-react";

interface NameEntry {
  rank: number;
  name: string;
  count: number;
  sex: "M" | "F";
}

const CANONICAL_INDEXED_SET = new Set((canonicalNamesList as any[]).map((n) => n.name.toLowerCase()));

export const Top200BabyNamesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"boys" | "girls">("boys");
  const [filterRank, setFilterRank] = useState<number>(200);
  const [tableSearch, setTableSearch] = useState<string>("");

  const year = DATA_FRESHNESS.latestAvailableBirthYear;

  const allBoys: NameEntry[] = (ssa2025Raw as any)?.topMale || [];
  const allGirls: NameEntry[] = (ssa2025Raw as any)?.topFemale || [];

  const rawList = activeTab === "boys" ? allBoys : allGirls;
  const top10 = rawList.slice(0, 10);

  // Filter list by selected cutoff and search
  const filteredList = rawList
    .slice(0, filterRank)
    .filter((item) =>
      tableSearch.trim() ? item.name.toLowerCase().includes(tableSearch.trim().toLowerCase()) : true
    );

  return (
    <section className="my-12 space-y-8" aria-labelledby="top-200-heading">
      {/* Header & Context */}
      <div className="border-b border-border/60 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          Official {year} Federal Cohort
        </div>
        <h2 id="top-200-heading" className="font-display text-2xl md:text-4xl font-bold text-foreground tracking-tight">
          Popular Baby Names in {year}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed max-w-3xl">
          See the most popular U.S. baby names from the latest available Social Security Administration data. These rankings show which names were most frequently recorded in the {year} calendar year.
        </p>
      </div>

      {/* Top 10 Highlight Cards (Quick Visual Summary) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-amber-500" />
            Top 10 {activeTab === "boys" ? "Baby Boy" : "Baby Girl"} Names Preview
          </h3>
          <span className="text-xs text-muted-foreground font-medium">Rank #1 to #10</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {top10.map((item) => {
            const isIndexed = CANONICAL_INDEXED_SET.has(item.name.toLowerCase());
            const targetUrl = isIndexed
              ? `/name/${encodeURIComponent(item.name)}`
              : `/tools/popularity-checker?name=${encodeURIComponent(item.name)}`;

            return (
              <a
                key={item.rank}
                href={targetUrl}
                className="p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-xs transition-all block group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-foreground group-hover:text-primary transition-colors text-sm truncate">
                    {item.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      item.rank <= 3
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold border border-amber-500/30"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    #{item.rank}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {item.count.toLocaleString()} births
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Interactive Tabs & Table Filter Controls */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Gender Selector Tabs */}
          <div
            role="tablist"
            aria-label="Popular Baby Names Gender Selector"
            className="flex items-center bg-secondary/60 p-1 rounded-xl border border-border shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "boys"}
              aria-controls="top-200-boys-panel"
              id="top-boys-tab"
              onClick={() => setActiveTab("boys")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                activeTab === "boys"
                  ? "bg-background text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Top 200 Boys
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "girls"}
              aria-controls="top-200-girls-panel"
              id="top-girls-tab"
              onClick={() => setActiveTab("girls")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                activeTab === "girls"
                  ? "bg-background text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Top 200 Girls
            </button>
          </div>

          {/* Quick Cutoff Filters (Top 50, 100, 200) */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground font-medium mr-1 hidden sm:inline">Show:</span>
            {[50, 100, 200].map((cutoff) => (
              <button
                key={cutoff}
                type="button"
                onClick={() => setFilterRank(cutoff)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                  filterRank === cutoff
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Top {cutoff}
              </button>
            ))}
          </div>
        </div>

        {/* Filter within table */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={`Filter ${activeTab === "boys" ? "boy" : "girl"} names in this ranking (e.g. Liam, Emma)...`}
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="w-full h-11 rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Semantic HTML Table */}
        <div
          role="tabpanel"
          id={activeTab === "boys" ? "top-200-boys-panel" : "top-200-girls-panel"}
          aria-labelledby={activeTab === "boys" ? "top-boys-tab" : "top-girls-tab"}
          className="rounded-xl border border-border/70 overflow-hidden"
        >
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              <caption className="sr-only">
                Top {filterRank} {activeTab === "boys" ? "Baby Boy" : "Baby Girl"} Names in the United States ({year})
              </caption>
              <thead className="bg-secondary/60 text-muted-foreground text-xs uppercase tracking-wider sticky top-0 z-10 border-b border-border">
                <tr>
                  <th scope="col" className="py-3 px-4 w-20 font-bold">Rank</th>
                  <th scope="col" className="py-3 px-4 font-bold">Baby Name</th>
                  <th scope="col" className="py-3 px-4 text-right font-bold">Recorded Births</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 bg-card">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground text-sm">
                      No names matching "{tableSearch}" found in the Top {filterRank} ranking.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((entry) => {
                    const isIndexed = CANONICAL_INDEXED_SET.has(entry.name.toLowerCase());
                    const targetUrl = isIndexed
                      ? `/name/${encodeURIComponent(entry.name)}`
                      : `/tools/popularity-checker?name=${encodeURIComponent(entry.name)}`;

                    return (
                      <tr key={entry.rank} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-muted-foreground text-xs">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-xs ${
                              entry.rank <= 3
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold"
                                : ""
                            }`}
                          >
                            #{entry.rank}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-foreground">
                          <a
                            href={targetUrl}
                            className="hover:text-primary hover:underline transition-colors"
                            aria-label={`View demographic profile for ${entry.name}`}
                          >
                            {entry.name}
                          </a>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-xs text-muted-foreground">
                          {entry.count.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Source Note Directly Below Table */}
        <div className="pt-2 text-xs text-muted-foreground space-y-1">
          <p>
            <strong>Source:</strong> U.S. Social Security Administration. The ranking reflects baby names recorded in U.S. birth-related Social Security card application data for the {year} calendar year.
          </p>
          <p>
            <em>Note:</em> Annual birth-name rankings measure newborn registrations and do not represent the total number of living people with each name.
          </p>
        </div>
      </div>
    </section>
  );
};
