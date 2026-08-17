import React, { useState, useEffect } from "react";
import { getNamesForLetter, getNameData, formatNumber, ALPHABET } from "../../data/nameData";
import { getAllSurnames } from "../../lib/surnames/data";
import { Sparkles, Copy, Check, RotateCcw, ExternalLink, FileText } from "lucide-react";
import { trackEvent } from "../../lib/analytics/events";

interface GeneratedItem {
  id: string;
  display: string;
  firstName?: string;
  lastName?: string;
  type: "first" | "last" | "full";
  gender?: string;
  count?: number;
  origin?: string;
  meaning?: string;
  url: string;
}

const PRESETS = [
  { label: "10 Random Full Names", format: "full", gender: "any", count: 10 },
  { label: "10 Random Boy Names", format: "first", gender: "male", count: 10 },
  { label: "10 Random Girl Names", format: "first", gender: "female", count: 10 },
  { label: "10 Random Surnames", format: "last", gender: "any", count: 10 },
  { label: "20 Fast Test Names", format: "full", gender: "any", count: 20 },
];

export default function RandomNameIsland() {
  const [format, setFormat] = useState<"first" | "last" | "full">("full");
  const [gender, setGender] = useState<string>("any");
  const [batchCount, setBatchCount] = useState<number>(10);
  const [results, setResults] = useState<GeneratedItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = (
    fmt = format,
    g = gender,
    cnt = batchCount
  ) => {
    const allFirstNames = ALPHABET.flatMap((l) => getNamesForLetter(l));
    const allSurnames = getAllSurnames();

    const candidateFirstNames = g === "any"
      ? allFirstNames
      : allFirstNames.filter((n) => {
          const d = getNameData(n);
          return d.gender === g || d.gender === "unisex";
        });

    const generatedSet = new Set<string>();
    const items: GeneratedItem[] = [];

    let safetyAttempts = 0;
    while (items.length < cnt && safetyAttempts < 300) {
      safetyAttempts++;

      if (fmt === "first") {
        const randFirst = candidateFirstNames[Math.floor(Math.random() * candidateFirstNames.length)];
        if (!randFirst || generatedSet.has(randFirst)) continue;

        generatedSet.add(randFirst);
        const data = getNameData(randFirst);
        items.push({
          id: `first-${randFirst}-${items.length}`,
          display: randFirst,
          firstName: randFirst,
          type: "first",
          gender: data.gender,
          count: data.count,
          origin: data.origin,
          meaning: data.meaning,
          url: `/name/${encodeURIComponent(randFirst)}`,
        });
      } else if (fmt === "last") {
        const randSur = allSurnames[Math.floor(Math.random() * allSurnames.length)];
        if (!randSur || generatedSet.has(randSur.name)) continue;

        generatedSet.add(randSur.name);
        items.push({
          id: `last-${randSur.name}-${items.length}`,
          display: randSur.name,
          lastName: randSur.name,
          type: "last",
          count: randSur.count,
          url: `/last-name/${encodeURIComponent(randSur.slug)}`,
        });
      } else {
        // Full name
        const randFirst = candidateFirstNames[Math.floor(Math.random() * candidateFirstNames.length)];
        const randSur = allSurnames[Math.floor(Math.random() * allSurnames.length)];
        if (!randFirst || !randSur) continue;

        const fullName = `${randFirst} ${randSur.name}`;
        if (generatedSet.has(fullName)) continue;

        generatedSet.add(fullName);
        const firstData = getNameData(randFirst);

        items.push({
          id: `full-${randFirst}-${randSur.name}-${items.length}`,
          display: fullName,
          firstName: randFirst,
          lastName: randSur.name,
          type: "full",
          gender: firstData.gender,
          url: `/people/${randFirst.toLowerCase()}-${randSur.slug.toLowerCase()}`,
        });
      }
    }

    setResults(items);
    setCopiedAll(false);

    trackEvent("name_search_submitted", {
      search_mode: "full_name",
      source_page_type: "tool",
    });
  };

  useEffect(() => {
    generate("full", "any", 10);
  }, []);

  const handleCopyOne = (item: GeneratedItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(item.display);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCopyAll = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard && results.length > 0) {
      const text = results.map((r) => r.display).join("\n");
      navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    }
  };

  const handleReset = () => {
    setFormat("full");
    setGender("any");
    setBatchCount(10);
    generate("full", "any", 10);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Controls Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-lg space-y-6">
        <div>
          <label className="block text-base font-bold text-foreground mb-1">
            Generate Random Real First, Last &amp; Full Names
          </label>
          <p className="text-xs text-muted-foreground">
            Sample real recorded names from official U.S. Social Security birth cohorts and Census surname registries.
          </p>
        </div>

        {/* Quick Presets */}
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2.5 font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Quick Presets:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setFormat(p.format as any);
                  setGender(p.gender);
                  setBatchCount(p.count);
                  generate(p.format as any, p.gender, p.count);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-secondary/30 hover:border-primary/50 hover:text-primary text-foreground transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/50">
          <div>
            <label htmlFor="rand-format" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Name Format
            </label>
            <select
              id="rand-format"
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="full">Full Name (First + Last)</option>
              <option value="first">First Name Only</option>
              <option value="last">Last Name / Surname Only</option>
            </select>
          </div>

          <div>
            <label htmlFor="rand-gender" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Gender (First Names)
            </label>
            <select
              id="rand-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={format === "last"}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            >
              <option value="any">Any Gender</option>
              <option value="male">Male Names</option>
              <option value="female">Female Names</option>
            </select>
          </div>

          <div>
            <label htmlFor="rand-count" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Batch Quantity
            </label>
            <select
              id="rand-count"
              value={batchCount}
              onChange={(e) => setBatchCount(Number(e.target.value))}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value={5}>5 Random Names</option>
              <option value={10}>10 Random Names</option>
              <option value={20}>20 Random Names</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => generate()}
              className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" /> Generate {batchCount} Random Names
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="h-12 px-4 rounded-xl text-muted-foreground hover:text-foreground text-sm font-medium flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          {results.length > 0 && (
            <button
              type="button"
              onClick={handleCopyAll}
              className="h-12 px-5 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-foreground text-xs font-bold flex items-center gap-2 transition-colors"
            >
              {copiedAll ? <Check className="h-4 w-4 text-emerald-500" /> : <FileText className="h-4 w-4 text-primary" />}
              {copiedAll ? "Copied All to Clipboard!" : `Copy All (${results.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Generated Result Cards */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Generated Random Names ({results.length} Results)
            </span>
            <span className="text-xs text-muted-foreground">
              Format: {format === "full" ? "First + Last" : format === "first" ? "First Name" : "Surname"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((item) => {
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {item.gender && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">
                          {item.gender === "male" ? "Male" : item.gender === "female" ? "Female" : "Unisex"}
                        </span>
                      )}
                      <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.display}
                      </h3>
                      {item.count && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ~{formatNumber(item.count)} estimated bearers
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleCopyOne(item, e)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                      title={`Copy ${item.display}`}
                    >
                      {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs font-semibold">
                    <a
                      href={item.url}
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      View Statistics <ExternalLink className="h-3 w-3" />
                    </a>
                    {item.origin && (
                      <span className="text-muted-foreground text-[11px]">
                        {item.origin}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
