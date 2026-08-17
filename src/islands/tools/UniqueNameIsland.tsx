import React, { useState, useEffect } from "react";
import { getNamesForLetter, getNameData, formatNumber, ALPHABET } from "../../data/nameData";
import { Sparkles, Copy, Check, RotateCcw, ExternalLink } from "lucide-react";
import { trackEvent } from "../../lib/analytics/events";

const PRESETS = [
  { label: "Hidden Gems (<1k)", gender: "any", maxPop: 1000, letter: "all", length: "all" },
  { label: "Rare Boy Names", gender: "male", maxPop: 5000, letter: "all", length: "all" },
  { label: "Rare Girl Names", gender: "female", maxPop: 5000, letter: "all", length: "all" },
  { label: "Distinctive (<50k)", gender: "any", maxPop: 50000, letter: "all", length: "all" },
  { label: "Short & Distinctive (3-5 Letters)", gender: "any", maxPop: 20000, letter: "all", length: "short" },
];

export default function UniqueNameIsland() {
  const [gender, setGender] = useState("any");
  const [maxPop, setMaxPop] = useState(5000);
  const [startingLetter, setStartingLetter] = useState("all");
  const [lengthFilter, setLengthFilter] = useState("all");
  const [results, setResults] = useState<string[]>([]);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const generate = (
    g = gender,
    m = maxPop,
    letter = startingLetter,
    len = lengthFilter
  ) => {
    const lettersToScan = letter === "all" ? ALPHABET : [letter.toLowerCase()];
    const allCandidateNames = lettersToScan.flatMap((l) => getNamesForLetter(l));

    const filtered = allCandidateNames.filter((n) => {
      const d = getNameData(n);
      const genderOk = g === "any" || d.gender === g || d.gender === "unisex";
      const popOk = d.count <= m;

      let lenOk = true;
      if (len === "short") lenOk = n.length <= 5;
      else if (len === "medium") lenOk = n.length >= 6 && n.length <= 7;
      else if (len === "long") lenOk = n.length >= 8;

      return genderOk && popOk && lenOk;
    });

    const shuffled = filtered.sort(() => Math.random() - 0.5);
    const selected = Array.from(new Set(shuffled)).slice(0, 12);
    setResults(selected);

    trackEvent("name_search_submitted", {
      search_mode: "first_name",
      source_page_type: "tool",
    });
  };

  // Initial generation on load
  useEffect(() => {
    generate("any", 5000, "all", "all");
  }, []);

  const handleCopy = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(name);
      setCopiedName(name);
      setTimeout(() => setCopiedName(null), 2000);
    }
  };

  const handleReset = () => {
    setGender("any");
    setMaxPop(5000);
    setStartingLetter("all");
    setLengthFilter("all");
    generate("any", 5000, "all", "all");
  };

  return (
    <div className="space-y-6">
      {/* Generator Controls Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-lg space-y-6">
        <div>
          <label className="block text-base font-bold text-foreground mb-1">
            Discover Rare, Distinctive &amp; Uncommon Real Baby Names
          </label>
          <p className="text-xs text-muted-foreground">
            Filter real recorded names by demographic frequency thresholds, gender, starting letters, and length.
          </p>
        </div>

        {/* Quick Presets */}
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2.5 font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Curated Discovery Presets:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setGender(p.gender);
                  setMaxPop(p.maxPop);
                  setStartingLetter(p.letter);
                  setLengthFilter(p.length);
                  generate(p.gender, p.maxPop, p.letter, p.length);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-secondary/30 hover:border-primary/50 hover:text-primary text-foreground transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-border/50">
          <div>
            <label htmlFor="gen-gender" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Gender
            </label>
            <select
              id="gen-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="any">Any Gender</option>
              <option value="male">Boy Names</option>
              <option value="female">Girl Names</option>
            </select>
          </div>

          <div>
            <label htmlFor="gen-rarity" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Rarity Threshold
            </label>
            <select
              id="gen-rarity"
              value={maxPop}
              onChange={(e) => setMaxPop(Number(e.target.value))}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value={1000}>Under 1,000 (Very Rare)</option>
              <option value={5000}>Under 5,000 (Rare)</option>
              <option value={20000}>Under 20,000 (Uncommon)</option>
              <option value={50000}>Under 50,000 (Distinctive)</option>
            </select>
          </div>

          <div>
            <label htmlFor="gen-letter" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Starting Letter
            </label>
            <select
              id="gen-letter"
              value={startingLetter}
              onChange={(e) => setStartingLetter(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">Any Letter (A–Z)</option>
              {ALPHABET.map((l) => (
                <option key={l} value={l}>
                  Starts with {l.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="gen-length" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Name Length
            </label>
            <select
              id="gen-length"
              value={lengthFilter}
              onChange={(e) => setLengthFilter(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">Any Length</option>
              <option value="short">Short (3–5 Letters)</option>
              <option value="medium">Medium (6–7 Letters)</option>
              <option value="long">Long (8+ Letters)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => generate()}
            className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> Generate 12 Rare Names
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="h-12 px-4 rounded-xl text-muted-foreground hover:text-foreground text-sm font-medium flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Generated Result Cards */}
      {results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Generated Suggestions ({results.length} Names Found)
            </span>
            <span className="text-xs text-muted-foreground">
              Threshold: Max ~{formatNumber(maxPop)} living bearers
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((name) => {
              const data = getNameData(name);
              const isCopied = copiedName === name;

              return (
                <div
                  key={name}
                  className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {data.gender === "male" ? "Boy Name" : data.gender === "female" ? "Girl Name" : "Unisex"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(name, e)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      title={`Copy ${name} to clipboard`}
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ~{formatNumber((data as any).actuarial?.estimatedLiving || Math.round(data.count * 0.65))} estimated living bearers
                    </p>
                  </div>

                  {data.meaning && (
                    <p className="text-xs text-muted-foreground line-clamp-2 italic">
                      "{data.meaning}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs font-semibold">
                    <a
                      href={`/name/${name}`}
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      View Profile <ExternalLink className="h-3 w-3" />
                    </a>
                    {data.origin && (
                      <span className="text-muted-foreground text-[11px]">
                        {data.origin}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-border bg-card text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            No recorded names matched this exact combination of filters.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
