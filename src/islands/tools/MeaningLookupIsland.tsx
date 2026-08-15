import React, { useState } from "react";
import { getNameData, formatNumber } from "../../data/nameData";
import { getSurname } from "../../lib/surnames/data";
import { Search, Sparkles, BookOpen, Globe2, BarChart3, TrendingUp, ArrowRight, HelpCircle } from "lucide-react";
import { trackEvent } from "../../lib/analytics/events";

type NameType = "first" | "surname";

const FIRST_NAME_PRESETS = ["Liam", "Sophia", "Luca", "Freya", "Ezra", "Aurora", "Eleanor", "Theodore"];
const SURNAME_PRESETS = ["Smith", "Garcia", "Johnson", "Williams", "Miller", "Rodriguez"];

const POPULAR_THEMES = [
  { label: "Strength", name: "Liam", desc: "Resolute protector / strong-willed warrior" },
  { label: "Wisdom", name: "Sophia", desc: "Divine wisdom / knowledge" },
  { label: "Light", name: "Luca", desc: "Bringer of light / luminous" },
  { label: "Noble", name: "Freya", desc: "Noble lady / goddess of love" },
  { label: "Help", name: "Ezra", desc: "Help / protector" },
  { label: "Dawn", name: "Aurora", desc: "Goddess of the dawn / new beginnings" },
];

export default function MeaningLookupIsland() {
  const [nameType, setNameType] = useState<NameType>("first");
  const [query, setQuery] = useState("Liam");
  const [firstNameResult, setFirstNameResult] = useState<ReturnType<typeof getNameData> | null>(() => getNameData("Liam"));
  const [surnameResult, setSurnameResult] = useState<ReturnType<typeof getSurname> | null>(null);
  const [hasSearched, setHasSearched] = useState(true);

  const handleLookup = (inputName: string, type = nameType) => {
    const clean = inputName.trim();
    if (!clean) return;

    setHasSearched(true);
    if (type === "first") {
      const res = getNameData(clean);
      setFirstNameResult(res);
      setSurnameResult(null);
    } else {
      const res = getSurname(clean);
      setSurnameResult(res);
      setFirstNameResult(null);
    }

    trackEvent("name_search_submitted", {
      search_mode: type === "first" ? "first_name" : "first_name",
      source_page_type: "tool",
    });
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Container */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-lg space-y-6">
        {/* Name Type Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-border/50">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Search Mode:
          </label>
          <div className="flex gap-1.5 p-1 rounded-xl bg-secondary/50 border border-border/60">
            <button
              type="button"
              onClick={() => {
                setNameType("first");
                setQuery("Liam");
                handleLookup("Liam", "first");
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                nameType === "first"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              First Name Meaning
            </button>
            <button
              type="button"
              onClick={() => {
                setNameType("surname");
                setQuery("Smith");
                handleLookup("Smith", "surname");
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                nameType === "surname"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Surname &amp; Last Name Origin
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2.5 font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Quick Examples:
          </p>
          <div className="flex flex-wrap gap-2">
            {(nameType === "first" ? FIRST_NAME_PRESETS : SURNAME_PRESETS).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setQuery(p);
                  handleLookup(p, nameType);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  query.toLowerCase() === p.toLowerCase()
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-border bg-secondary/30 hover:border-primary/50 text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup(query, nameType);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={nameType === "first" ? "Enter any first name (e.g. Liam, Freya, Luca, Ezra)..." : "Enter a surname (e.g. Smith, Garcia, Miller)..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 rounded-xl border border-input bg-background pl-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <button
            type="submit"
            className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0"
          >
            <Search className="h-4 w-4" /> Look Up Meaning &amp; Origin
          </button>
        </form>

        {/* Themed Meaning Chips */}
        {nameType === "first" && (
          <div className="pt-2 border-t border-border/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Explore Popular Meanings:
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_THEMES.map((theme) => (
                <button
                  key={theme.label}
                  type="button"
                  onClick={() => {
                    setQuery(theme.name);
                    handleLookup(theme.name, "first");
                  }}
                  className="px-2.5 py-1 rounded-md bg-secondary/60 hover:bg-secondary border border-border/60 text-xs text-foreground flex items-center gap-1.5 transition-colors"
                >
                  <span className="font-semibold text-primary">{theme.label}:</span>
                  <span className="text-muted-foreground">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result Container (Same Page) */}
      {hasSearched && (
        <div>
          {nameType === "first" && firstNameResult && (
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-md space-y-6">
              {firstNameResult.meaning || firstNameResult.origin ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                        First Name Etymology Record
                      </span>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                        {firstNameResult.name}
                      </h2>
                    </div>
                    {firstNameResult.origin && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs">
                        <Globe2 className="h-3.5 w-3.5" />
                        {firstNameResult.origin} Linguistic Origin
                      </span>
                    )}
                  </div>

                  {/* Core Meaning Showcase (Always First) */}
                  <div className="p-5 rounded-xl bg-secondary/30 border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>Primary Meaning &amp; Definition</span>
                    </div>
                    <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
                      "{firstNameResult.meaning || "Cherished, noble identity"}"
                    </p>
                  </div>

                  {/* Contextual Attributes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl border border-border/60 bg-background space-y-1">
                      <span className="text-muted-foreground font-semibold uppercase tracking-wider block">
                        Gender Tradition
                      </span>
                      <span className="font-bold text-foreground text-sm capitalize">
                        {firstNameResult.gender === "unisex" ? "Gender-Neutral / Unisex" : `Traditionally ${firstNameResult.gender}`}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-border/60 bg-background space-y-1">
                      <span className="text-muted-foreground font-semibold uppercase tracking-wider block">
                        U.S. Living Bearers
                      </span>
                      <span className="font-bold text-foreground text-sm">
                        {firstNameResult.count > 0 ? `~${formatNumber(firstNameResult.count)} people` : "Distinctive / Rare"}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-border/60 bg-background space-y-1">
                      <span className="text-muted-foreground font-semibold uppercase tracking-wider block">
                        National Popularity Rank
                      </span>
                      <span className="font-bold text-foreground text-sm">
                        {firstNameResult.rank > 0 ? `#${formatNumber(firstNameResult.rank)} in U.S.` : "Beyond Top Tier"}
                      </span>
                    </div>
                  </div>

                  {/* Cross-Tool Discovery Funnel */}
                  <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                    <a
                      href={`/name/${encodeURIComponent(firstNameResult.name)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      View Full {firstNameResult.name} Demographic Profile <ArrowRight className="h-3.5 w-3.5" />
                    </a>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href="/tools/popularity-checker"
                        className="px-3 py-1.5 rounded-lg border border-border bg-secondary/40 hover:bg-secondary text-xs font-semibold text-foreground flex items-center gap-1.5 transition-colors"
                      >
                        <BarChart3 className="h-3 w-3 text-primary" /> Popularity Checker
                      </a>
                      <a
                        href="/tools/trend-visualizer"
                        className="px-3 py-1.5 rounded-lg border border-border bg-secondary/40 hover:bg-secondary text-xs font-semibold text-foreground flex items-center gap-1.5 transition-colors"
                      >
                        <TrendingUp className="h-3 w-3 text-primary" /> 140-Yr Trends
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-bold text-foreground">
                    No Etymology Record Found for "{query}"
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    We do not have a verified historical meaning entry for this spelling in our current reference dataset. Try searching an alternate spelling or browse our popular verified names.
                  </p>
                </div>
              )}
            </div>
          )}

          {nameType === "surname" && (
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-md space-y-6">
              {surnameResult ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                        Surname Origin &amp; Etymology Record
                      </span>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                        {surnameResult.name}
                      </h2>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs">
                      <Globe2 className="h-3.5 w-3.5" />
                      U.S. Decennial Census Archive
                    </span>
                  </div>

                  {/* Core Origin Showcase */}
                  <div className="p-5 rounded-xl bg-secondary/30 border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>Historical Origin &amp; Etymology Classification</span>
                    </div>
                    <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
                      {surnameResult.origin || "Historical surname of traditional European / international origin."}
                    </p>
                  </div>

                  {/* Surname Demographic Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl border border-border/60 bg-background space-y-1">
                      <span className="text-muted-foreground font-semibold uppercase tracking-wider block">
                        U.S. Surname Rank
                      </span>
                      <span className="font-bold text-foreground text-sm">
                        #{formatNumber(surnameResult.rank)} in United States
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-border/60 bg-background space-y-1">
                      <span className="text-muted-foreground font-semibold uppercase tracking-wider block">
                        Census Population Count
                      </span>
                      <span className="font-bold text-foreground text-sm">
                        ~{formatNumber(surnameResult.count)} individuals
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-border/60 bg-background space-y-1">
                      <span className="text-muted-foreground font-semibold uppercase tracking-wider block">
                        Frequency Proportion
                      </span>
                      <span className="font-bold text-foreground text-sm">
                        {surnameResult.prop100k} per 100,000 Americans
                      </span>
                    </div>
                  </div>

                  {/* Profile Link */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <a
                      href={`/surname/${encodeURIComponent(surnameResult.slug)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      View Full {surnameResult.name} Surname Census Profile <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-bold text-foreground">
                    No Surname Record Found for "{query}"
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    This surname is not currently listed in our indexed top Census surname records. Try searching a common alternative spelling or check our first name meaning finder.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
