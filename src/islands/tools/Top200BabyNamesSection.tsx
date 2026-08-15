import React, { useState } from "react";
import ssa2025Raw from "../../data/raw/ssa/ssa_2025.json";
import canonicalNamesList from "../../data/generated/canonical-names.json";
import { Sparkles, Trophy, Search, ChevronDown } from "lucide-react";

interface NameEntry {
  rank: number;
  name: string;
  count: number;
  sex: "M" | "F";
}

const CANONICAL_INDEXED_SET = new Set((canonicalNamesList as any[]).map((n) => n.name.toLowerCase()));

interface GenderRankingProps {
  gender: "M" | "F";
  title: string;
  description: string;
  id: string;
  data: NameEntry[];
  badgeColor: string;
  year: number;
}

const GenderRankingBlock: React.FC<GenderRankingProps> = ({
  gender,
  title,
  description,
  id,
  data,
  badgeColor,
  year,
}) => {
  const [cutoff, setCutoff] = useState<number>(200);
  const [query, setQuery] = useState<string>("");

  const top10 = data.slice(0, 10);
  const filteredList = data
    .slice(0, cutoff)
    .filter((item) => (query.trim() ? item.name.toLowerCase().includes(query.trim().toLowerCase()) : true));

  return (
    <div id={id} className="space-y-6 pt-4 scroll-mt-20">
      {/* Section Heading */}
      <div className="border-b border-border/60 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={`h-3 w-3 rounded-full ${badgeColor}`} />
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h2>
        </div>
        <p className="text-sm md:text-base text-muted-foreground mt-1 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Top 10 Editorial Summary Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-amber-500" />
            Top 10 {gender === "M" ? "Boy" : "Girl"} Names Summary
          </h3>
          <span className="text-xs text-muted-foreground font-medium">Rank #1–#10</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {top10.map((item) => {
            const isIndexed = CANONICAL_INDEXED_SET.has(item.name.toLowerCase());
            const targetUrl = isIndexed
              ? `/name/${encodeURIComponent(item.name)}`
              : `/tools/popularity-checker?name=${encodeURIComponent(item.name)}`;
            const isTop3 = item.rank <= 3;

            return (
              <a
                key={item.rank}
                href={targetUrl}
                aria-label={`Rank ${item.rank}, ${item.name}, ${item.count.toLocaleString()} births`}
                className="p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-secondary/30 transition-all block group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base truncate">
                    {item.name}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                      isTop3
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold border border-amber-500/30"
                        : "bg-secondary text-muted-foreground"
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
      </div>

      {/* Controls & Table Card */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-4">
        {/* Controls: Cutoff & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Quick Cutoff Filters */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground font-semibold mr-1">Display:</span>
            {[50, 100, 200].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setCutoff(count)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                  cutoff === count
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Top {count}
              </button>
            ))}
          </div>

          {/* Real-time search inside table */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={`Search ${gender === "M" ? "boy" : "girl"} names in the ${year} ranking...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-9 rounded-lg border border-input bg-background pl-9 pr-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Semantic HTML Table */}
        <div className="rounded-xl border border-border/70 overflow-hidden">
          <div className="max-h-[560px] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              <caption className="sr-only">
                Top {cutoff} {gender === "M" ? "Baby Boy" : "Baby Girl"} Names in the United States ({year})
              </caption>
              <thead className="bg-secondary/70 text-muted-foreground text-xs uppercase tracking-wider sticky top-0 z-10 border-b border-border">
                <tr>
                  <th scope="col" className="py-3 px-4 w-20 font-bold">
                    Rank
                  </th>
                  <th scope="col" className="py-3 px-4 font-bold">
                    Baby Name
                  </th>
                  <th scope="col" className="py-3 px-4 text-right font-bold">
                    Recorded Births
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 bg-card">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground text-sm">
                      No {gender === "M" ? "boy" : "girl"} names matching "{query}" found in Top {cutoff}.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((entry) => {
                    const isIndexed = CANONICAL_INDEXED_SET.has(entry.name.toLowerCase());
                    const targetUrl = isIndexed
                      ? `/name/${encodeURIComponent(entry.name)}`
                      : `/tools/popularity-checker?name=${encodeURIComponent(entry.name)}`;
                    const isTop3 = entry.rank <= 3;

                    return (
                      <tr key={entry.rank} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-3 px-4 text-xs font-bold text-muted-foreground">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded ${
                              isTop3
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold"
                                : ""
                            }`}
                          >
                            #{entry.rank}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-foreground text-base">
                          <a
                            href={targetUrl}
                            className="hover:text-primary hover:underline transition-colors"
                            aria-label={`View demographic profile for ${entry.name}`}
                          >
                            {entry.name}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-sm text-muted-foreground">
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
      </div>
    </div>
  );
};

export const Top200BabyNamesSection: React.FC = () => {
  const year = 2026;

  const allBoys: NameEntry[] = (ssa2025Raw as any)?.topMale || [];
  const allGirls: NameEntry[] = (ssa2025Raw as any)?.topFemale || [];

  return (
    <section className="my-10 space-y-12" aria-labelledby="top-200-main-heading">
      {/* Header with Year Context & Quick Anchor Navigation */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Official Social Security Administration Release (May 2026)
          </div>
          <h2 id="top-200-main-heading" className="font-display text-2xl md:text-4xl font-bold text-foreground tracking-tight">
            Popular Baby Names in {year}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed max-w-3xl">
            See the most popular U.S. baby names from the latest available Social Security Administration data. Below are the complete <strong>Top 200 Boy Names</strong> and <strong>Top 200 Girl Names</strong> recorded nationwide in the {year} birth year.
          </p>
        </div>

        {/* Quick Anchor Navigation */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/50">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Jump to Ranking:
          </span>
          <a
            href="#popular-boy-names"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-500/20 transition-colors"
          >
            <span>Top 200 Boy Names</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </a>
          <a
            href="#popular-girl-names"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-500/20 transition-colors"
          >
            <span>Top 200 Girl Names</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* 1. Top 200 Boy Names Section */}
      <GenderRankingBlock
        gender="M"
        title={`Top 200 Boy Names in ${year}`}
        description="The 200 most frequently recorded boy names in the latest available U.S. Social Security Administration baby-name data."
        id="popular-boy-names"
        data={allBoys}
        badgeColor="bg-blue-500"
        year={year}
      />

      {/* 2. Top 200 Girl Names Section */}
      <GenderRankingBlock
        gender="F"
        title={`Top 200 Girl Names in ${year}`}
        description="The 200 most frequently recorded girl names in the latest available U.S. Social Security Administration baby-name data."
        id="popular-girl-names"
        data={allGirls}
        badgeColor="bg-rose-500"
        year={year}
      />

      {/* Unified Official Source & Methodology Note */}
      <div className="rounded-2xl border border-border/80 bg-secondary/30 p-5 md:p-6 text-xs text-muted-foreground space-y-2">
        <p className="font-semibold text-foreground">
          Data Notes &amp; Official Attribution:
        </p>
        <p>
          <strong>Source:</strong> U.S. Social Security Administration, {year} baby-name rankings. Latest available birth-year data was released in May 2026.
        </p>
        <p>
          These figures refer to names recorded in U.S. birth-related Social Security card application data and do not represent the total number of living people with each name.
        </p>
      </div>
    </section>
  );
};
