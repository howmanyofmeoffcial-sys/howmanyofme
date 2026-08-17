import React, { useState, useMemo } from "react";
import { getNamesForLetter, getNameData, formatNumber, ALPHABET } from "../../data/nameData";
import { getNameUrl } from "../../lib/seo/canonicalUrl";
import { Search, ChevronRight } from "lucide-react";
import { trackEvent } from "../../lib/analytics/events";

export default function BabyNamesBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [letter, setLetter] = useState("a");
  const [gender, setGender] = useState<string>("any");
  const [sortBy, setSortBy] = useState<"alpha" | "pop" | "length">("alpha");
  const [visibleCount, setVisibleCount] = useState(24);

  // Filtered candidate names based on active letter or search query
  const names = useMemo(() => {
    let candidatePool: string[] = [];

    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase().trim();
      // Scan all letters for partial matches
      candidatePool = ALPHABET.flatMap((l) => getNamesForLetter(l)).filter((n) =>
        n.toLowerCase().includes(q)
      );
    } else {
      candidatePool = getNamesForLetter(letter);
    }

    // Filter by gender
    let filtered = candidatePool.filter((n) => {
      if (gender === "any") return true;
      const d = getNameData(n);
      return d.gender === gender || d.gender === "unisex";
    });

    // Sort names
    if (sortBy === "pop") {
      filtered.sort((a, b) => {
        const popA = getNameData(a).count || 0;
        const popB = getNameData(b).count || 0;
        return popB - popA;
      });
    } else if (sortBy === "length") {
      filtered.sort((a, b) => a.length - b.length || a.localeCompare(b));
    } else {
      filtered.sort((a, b) => a.localeCompare(b));
    }

    return filtered;
  }, [letter, searchQuery, gender, sortBy]);

  const handleLetterClick = (l: string) => {
    setLetter(l);
    setSearchQuery("");
    setVisibleCount(24);

    trackEvent("letter_clicked", {
      letter: l,
      source_page_type: "tool",
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(24);
  };

  const handleReset = () => {
    setSearchQuery("");
    setLetter("a");
    setGender("any");
    setSortBy("alpha");
    setVisibleCount(24);
  };

  const displayedNames = names.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-lg space-y-6">
        <div>
          <label htmlFor="baby-name-search" className="block text-base font-bold text-foreground mb-1">
            Search &amp; Browse Baby Names by Letter, Gender &amp; Popularity
          </label>
          <p className="text-xs text-muted-foreground">
            Explore thousands of real recorded names from official U.S. Social Security birth cohorts (1880–2024).
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="baby-name-search"
            type="text"
            placeholder="Search by name (e.g. Emma, Liam, Alexander, Maya)..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-12 rounded-xl border border-input bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded bg-secondary text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* A–Z Alphabet Bar */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Browse by Starting Letter (A–Z):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {ALPHABET.map((l) => {
              const isActive = !searchQuery && l === letter;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleLetterClick(l)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-bold uppercase transition-all flex items-center justify-center ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm scale-105"
                      : "bg-secondary/60 text-foreground hover:bg-primary/20 hover:text-primary"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/50">
          <div>
            <label htmlFor="baby-gender" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Gender
            </label>
            <select
              id="baby-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="any">All Genders</option>
              <option value="male">Boy Names</option>
              <option value="female">Girl Names</option>
            </select>
          </div>

          <div>
            <label htmlFor="baby-sort" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Sort By
            </label>
            <select
              id="baby-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="alpha">Alphabetical (A–Z)</option>
              <option value="pop">Most Popular (Living Count)</option>
              <option value="length">Name Length (Shortest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {searchQuery
              ? `Search Results for "${searchQuery}" (${names.length} Found)`
              : `Names Starting with "${letter.toUpperCase()}" (${names.length} Found)`}
          </span>
          <span className="text-xs text-muted-foreground">
            Showing {Math.min(visibleCount, names.length)} of {names.length}
          </span>
        </div>

        {names.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {displayedNames.map((name) => {
                const data = getNameData(name);

                return (
                  <a
                    key={name}
                    href={getNameUrl(name)}
                    className="p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-0.5">
                          {data.gender === "male" ? "Boy Name" : data.gender === "female" ? "Girl Name" : "Unisex"}
                        </span>
                        <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {name}
                        </h3>
                        {data.count > 0 && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            ~{formatNumber(data.count)} living bearers
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </div>

                    {data.meaning && (
                      <p className="text-xs text-muted-foreground line-clamp-1 italic">
                        "{data.meaning}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                      <span>{data.origin || "Historical record"}</span>
                      <span className="text-primary font-semibold group-hover:underline">
                        View Profile →
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Load More Button */}
            {visibleCount < names.length && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs transition-colors shadow-2xs"
                >
                  Load More Names (+24)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 rounded-2xl border border-border bg-card text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              No baby names matched your search criteria.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
