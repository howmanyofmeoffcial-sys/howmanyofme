import React, { useState, useEffect, useMemo } from "react";
import canonicalNamesList from "../../data/generated/canonical-names.json";
import { formatNumber, getNameData } from "../../data/nameData";
import { Search, Sparkles, Filter, ArrowRight, BookOpen, BarChart3, Globe2, CheckCircle2, RotateCcw } from "lucide-react";
import { trackEvent } from "../../lib/analytics/events";

interface NameItem {
  name: string;
  count: number;
  gender: "male" | "female" | "unisex";
  origin: string;
  meaning: string;
  rank: number;
}

const ALL_RECORDS = canonicalNamesList as unknown as NameItem[];

const PRESETS = ["Emma", "Liam", "Olivia", "Sophia", "Noah", "Oliver", "Ezra", "James"];

type GenderFilter = "all" | "female" | "male";
type ModeFilter = "best" | "sound" | "origin" | "length";
type PopFilter = "any" | "popular" | "uncommon";

function lev(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

interface MatchResult {
  record: NameItem;
  score: number;
  reasons: string[];
}

export default function SimilarNamesIsland() {
  const [query, setQuery] = useState("Emma");
  const [activeName, setActiveName] = useState("Emma");
  const [gender, setGender] = useState<GenderFilter>("all");
  const [mode, setMode] = useState<ModeFilter>("best");
  const [pop, setPop] = useState<PopFilter>("any");
  const [results, setResults] = useState<MatchResult[]>([]);

  const calculateSimilarity = (targetName: string, gFilter = gender, mFilter = mode, pFilter = pop) => {
    const clean = targetName.trim();
    if (!clean) return;

    setActiveName(clean);
    const targetLower = clean.toLowerCase();
    const targetData = getNameData(clean);

    const candidates: MatchResult[] = [];

    for (const rec of ALL_RECORDS) {
      const recLower = rec.name.toLowerCase();
      if (recLower === targetLower) continue; // Exclude base name

      // Gender filter
      if (gFilter !== "all" && rec.gender !== gFilter && rec.gender !== "unisex") {
        continue;
      }

      // Popularity filter
      if (pFilter === "popular" && rec.rank > 200) continue;
      if (pFilter === "uncommon" && rec.rank <= 200) continue;

      let score = 0;
      const reasons: string[] = [];

      // 1. Edit distance & spelling
      const dist = lev(targetLower, recLower);
      const maxLen = Math.max(targetLower.length, recLower.length);
      const editRatio = (maxLen - dist) / maxLen;

      if (dist === 1) {
        score += 45;
        reasons.push("1-letter spelling variation");
      } else if (dist === 2) {
        score += 30;
        reasons.push("Very close spelling & sound");
      } else if (dist === 3 && maxLen >= 6) {
        score += 15;
        reasons.push("Similar sound structure");
      }

      // 2. Starts with same letter
      if (recLower.charAt(0) === targetLower.charAt(0)) {
        score += 20;
        reasons.push(`Shares initial '${clean.charAt(0).toUpperCase()}'`);
      }

      // 3. Same length
      if (rec.name.length === clean.length) {
        score += 15;
        reasons.push(`${clean.length}-letter length match`);
      }

      // 4. Same origin
      if (targetData.origin && rec.origin && targetData.origin.toLowerCase() === rec.origin.toLowerCase()) {
        score += 25;
        reasons.push(`Shared ${rec.origin} origin`);
      }

      // 5. Ends with same syllable/letter
      if (recLower.slice(-2) === targetLower.slice(-2)) {
        score += 15;
        reasons.push(`Matching '-${recLower.slice(-2)}' ending`);
      }

      // Mode weighting adjustments
      if (mFilter === "sound") {
        score = editRatio * 70 + (recLower.charAt(0) === targetLower.charAt(0) ? 30 : 0);
      } else if (mFilter === "origin") {
        if (targetData.origin && rec.origin && targetData.origin.toLowerCase() === rec.origin.toLowerCase()) {
          score += 50;
        }
      } else if (mFilter === "length") {
        if (rec.name.length === clean.length) score += 40;
      }

      if (score > 15) {
        candidates.push({
          record: rec,
          score,
          reasons: reasons.slice(0, 3), // Top 3 reasons
        });
      }
    }

    // Sort by descending score
    candidates.sort((a, b) => b.score - a.score);

    setResults(candidates.slice(0, 10));

    trackEvent("name_search_submitted", {
      search_mode: "first_name",
      source_page_type: "tool",
    });
  };

  useEffect(() => {
    calculateSimilarity("Emma", "all", "best", "any");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    calculateSimilarity(query, gender, mode, pop);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Search & Controls Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-lg space-y-6">
        <div>
          <label htmlFor="similar-name-input" className="block text-base font-bold text-foreground mb-1">
            Find Names Similar to Any Name
          </label>
          <p className="text-xs text-muted-foreground">
            Enter a favorite name below to discover soundalikes, spelling variants, shared origins, and stylistic alternatives.
          </p>
        </div>

        {/* Quick Presets */}
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2.5 font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Quick Example Names:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setQuery(p);
                  calculateSimilarity(p, gender, mode, pop);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  activeName.toLowerCase() === p.toLowerCase()
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
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              id="similar-name-input"
              type="text"
              placeholder="Enter a name (e.g. Emma, Liam, Olivia, Noah, Sophia)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 rounded-xl border border-input bg-background pl-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <button
            type="submit"
            className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0"
          >
            <Search className="h-4 w-4" /> Find Similar Names
          </button>
        </form>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/50">
          <div>
            <label htmlFor="sim-gender" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Gender Preference
            </label>
            <select
              id="sim-gender"
              value={gender}
              onChange={(e) => {
                const val = e.target.value as GenderFilter;
                setGender(val);
                calculateSimilarity(activeName, val, mode, pop);
              }}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Genders</option>
              <option value="female">Girls / Feminine</option>
              <option value="male">Boys / Masculine</option>
            </select>
          </div>

          <div>
            <label htmlFor="sim-mode" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Similarity Priority
            </label>
            <select
              id="sim-mode"
              value={mode}
              onChange={(e) => {
                const val = e.target.value as ModeFilter;
                setMode(val);
                calculateSimilarity(activeName, gender, val, pop);
              }}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="best">Best Overall Match</option>
              <option value="sound">Sound &amp; Spelling Priority</option>
              <option value="origin">Same Linguistic Origin</option>
              <option value="length">Same Length &amp; Cadence</option>
            </select>
          </div>

          <div>
            <label htmlFor="sim-pop" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Popularity Tier
            </label>
            <select
              id="sim-pop"
              value={pop}
              onChange={(e) => {
                const val = e.target.value as PopFilter;
                setPop(val);
                calculateSimilarity(activeName, gender, mode, val);
              }}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="any">Any Popularity</option>
              <option value="popular">Top 200 Popular</option>
              <option value="uncommon">Less Common / Hidden Gems</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section (Same Page) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              Names Like <span className="text-primary">{activeName}</span> ({results.length} Alternatives)
            </h2>
            <p className="text-xs text-muted-foreground">
              Ranked by multi-dimensional phonetic, structural, and etymological similarity.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-foreground">
            Target: {activeName}
          </span>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {results.map(({ record, reasons }) => (
              <div
                key={record.name}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {record.name}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary capitalize">
                      {record.gender}
                    </span>
                  </div>

                  {/* Match Reasons Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {reasons.map((r) => (
                      <span
                        key={r}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-secondary/80 text-muted-foreground border border-border/50"
                      >
                        ✓ {r}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-1">
                    <strong>Meaning:</strong> {record.meaning || "Cherished identity"} ({record.origin || "Traditional"})
                  </p>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    ~{formatNumber(record.count)} bearers (Rank #{formatNumber(record.rank)})
                  </span>

                  <a
                    href={`/name/${encodeURIComponent(record.name)}`}
                    className="font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    View Profile <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 p-6 rounded-2xl border border-border bg-card space-y-2">
            <h3 className="text-base font-bold text-foreground">No Similar Names Found</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              No matching records met your selected filter criteria. Try setting Gender to 'All Genders' or choosing 'Any Popularity'.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
