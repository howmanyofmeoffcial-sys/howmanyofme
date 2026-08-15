import React from "react";
import ssa2025Raw from "../../data/raw/ssa/ssa_2025.json";
import canonicalNamesList from "../../data/generated/canonical-names.json";
import { Sparkles, ArrowRight } from "lucide-react";

interface NameEntry {
  rank: number;
  name: string;
  count: number;
  sex: "M" | "F";
}

const CANONICAL_INDEXED_SET = new Set((canonicalNamesList as any[]).map((n) => n.name.toLowerCase()));

export const PopularBabyNamesSection: React.FC = () => {
  const year = 2026;

  const topBoys: NameEntry[] = (ssa2025Raw as any)?.topMale?.slice(0, 30) || [];
  const topGirls: NameEntry[] = (ssa2025Raw as any)?.topFemale?.slice(0, 30) || [];

  const renderNameRow = (item: NameEntry) => {
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
        className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-secondary/40 transition-all group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`flex items-center justify-center h-6 w-7 rounded text-xs font-bold shrink-0 ${
              isTop3
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold border border-amber-500/30"
                : "bg-secondary text-muted-foreground font-semibold"
            }`}
          >
            #{item.rank}
          </span>
          <span className="font-bold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base truncate">
            {item.name}
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-mono shrink-0 pl-2">
          {item.count.toLocaleString()} births
        </span>
      </a>
    );
  };

  return (
    <section className="my-10 space-y-8" aria-labelledby="homepage-popular-names-heading">
      {/* Header with Title & AEO Summary */}
      <div className="border-b border-border/60 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2.5">
          <Sparkles className="h-3.5 w-3.5" />
          Official SSA Release (May 2026)
        </div>
        <h2 id="homepage-popular-names-heading" className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Popular Baby Names in {year}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">
          The latest U.S. baby-name rankings from the Social Security Administration. In the official data, <strong>Liam</strong> led boy registrations and <strong>Olivia</strong> led girl registrations nationwide.
        </p>
      </div>

      {/* Side-by-Side Ranked Editorial Lists (Desktop: 2 columns, Mobile: 1 column) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Top 30 Boy Names Column */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500/80" />
              Top 30 Boy Names
            </h3>
            <span className="text-xs text-muted-foreground font-medium">{year} SSA Data</span>
          </div>

          <div className="space-y-2">
            {topBoys.map(renderNameRow)}
          </div>
        </div>

        {/* Top 30 Girl Names Column */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              Top 30 Girl Names
            </h3>
            <span className="text-xs text-muted-foreground font-medium">{year} SSA Data</span>
          </div>

          <div className="space-y-2">
            {topGirls.map(renderNameRow)}
          </div>
        </div>
      </div>

      {/* Explanatory Source Note & Single Primary CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          Source: U.S. Social Security Administration, {year} baby-name rankings (released May 2026).
        </p>

        <a
          href="/tools/baby-names"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shrink-0"
        >
          <span>Browse All 200 Boys &amp; Girls</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};
