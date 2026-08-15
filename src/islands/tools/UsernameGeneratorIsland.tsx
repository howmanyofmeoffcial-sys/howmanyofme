import React, { useState, useEffect } from "react";
import { Sparkles, Copy, Check, RotateCcw, FileText, ShieldAlert } from "lucide-react";
import { trackEvent } from "../../lib/analytics/events";

type Platform = "general" | "instagram" | "tiktok" | "gaming";
type Style = "all" | "clean" | "aesthetic" | "gaming" | "professional";

interface UsernameResult {
  handle: string;
  style: string;
  platform: Platform;
  length: number;
}

const RANDOM_SEEDS = [
  "Nova", "Luna", "Kai", "Echo", "Atlas", "Sage", "Viper", "Pixel",
  "Aura", "Zen", "Orion", "Blaze", "Haven", "Drift", "Cosmo", "Frost"
];

const PRESETS = [
  { label: "Instagram Creator", seed: "Maya", platform: "instagram" as Platform, style: "aesthetic" as Style },
  { label: "Gaming Handle", seed: "Shadow", platform: "gaming" as Platform, style: "gaming" as Style },
  { label: "TikTok Viral", seed: "Alex", platform: "tiktok" as Platform, style: "clean" as Style },
  { label: "Professional Studio", seed: "Jordan", platform: "general" as Platform, style: "professional" as Style },
  { label: "Random Handles", seed: "", platform: "general" as Platform, style: "all" as Style },
];

export default function UsernameGeneratorIsland() {
  const [seed, setSeed] = useState("Alex");
  const [platform, setPlatform] = useState<Platform>("general");
  const [style, setStyle] = useState<Style>("all");
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSeparators, setIncludeSeparators] = useState(true);
  const [results, setResults] = useState<UsernameResult[]>([]);
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const cleanSeed = (raw: string) => {
    return raw
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
  };

  const generate = (
    currentSeed = seed,
    currentPlat = platform,
    currentStyle = style,
    numOk = includeNumbers,
    sepOk = includeSeparators
  ) => {
    let base = cleanSeed(currentSeed);
    if (!base) {
      base = cleanSeed(RANDOM_SEEDS[Math.floor(Math.random() * RANDOM_SEEDS.length)]);
    }

    const sep = sepOk ? ["_", ".", ""][Math.floor(Math.random() * 3)] : "";
    const randNum = () => (numOk ? `${Math.floor(Math.random() * 89 + 10)}` : "");

    const patterns: Array<{ fn: () => string; style: string }> = [
      // Clean
      { fn: () => `${base}${sep}daily${randNum()}`, style: "Clean" },
      { fn: () => `the${sep}${base}${randNum()}`, style: "Clean" },
      { fn: () => `its${sep}${base}${randNum()}`, style: "Clean" },
      { fn: () => `${base}${sep}hq${randNum()}`, style: "Clean" },

      // Aesthetic
      { fn: () => `${base}${sep}studio${randNum()}`, style: "Aesthetic" },
      { fn: () => `pure${sep}${base}${randNum()}`, style: "Aesthetic" },
      { fn: () => `${base}${sep}frames${randNum()}`, style: "Aesthetic" },
      { fn: () => `velvet${sep}${base}${randNum()}`, style: "Aesthetic" },
      { fn: () => `${base}${sep}notes${randNum()}`, style: "Aesthetic" },
      { fn: () => `soft${sep}${base}${randNum()}`, style: "Aesthetic" },

      // Gaming
      { fn: () => `${base}${sep}forge${randNum()}`, style: "Gaming" },
      { fn: () => `pixel${sep}${base}${randNum()}`, style: "Gaming" },
      { fn: () => `${base}${sep}rush${randNum()}`, style: "Gaming" },
      { fn: () => `shadow${sep}${base}${randNum()}`, style: "Gaming" },
      { fn: () => `${base}${sep}byte${randNum()}`, style: "Gaming" },
      { fn: () => `x_${base}_x`, style: "Gaming" },

      // Professional / Creator
      { fn: () => `${base}${sep}creates${randNum()}`, style: "Professional" },
      { fn: () => `${base}${sep}media${randNum()}`, style: "Professional" },
      { fn: () => `${base}${sep}design${randNum()}`, style: "Professional" },
      { fn: () => `${base}${sep}lab${randNum()}`, style: "Professional" },
      { fn: () => `hello${sep}${base}${randNum()}`, style: "Professional" },

      // Platform-specific
      { fn: () => `${base}${sep}tok${randNum()}`, style: "TikTok" },
      { fn: () => `${base}${sep}vids${randNum()}`, style: "TikTok" },
      { fn: () => `${base}${sep}gram${randNum()}`, style: "Instagram" },
      { fn: () => `${base}${sep}feed${randNum()}`, style: "Instagram" },
    ];

    // Filter patterns by selected style & platform
    let candidates = patterns;
    if (currentStyle !== "all") {
      candidates = patterns.filter((p) => p.style.toLowerCase() === currentStyle);
    }
    if (currentPlat === "instagram") {
      candidates = candidates.filter((p) => p.style !== "Gaming");
    } else if (currentPlat === "gaming") {
      candidates = candidates.filter((p) => p.style === "Gaming" || p.style === "Clean");
    } else if (currentPlat === "tiktok") {
      candidates = candidates.filter((p) => p.style === "TikTok" || p.style === "Clean" || p.style === "Aesthetic");
    }

    if (candidates.length < 10) {
      candidates = patterns;
    }

    // Generate 10 unique handles
    const set = new Set<string>();
    const items: UsernameResult[] = [];

    const shuffled = [...candidates].sort(() => Math.random() - 0.5);

    let safety = 0;
    while (items.length < 10 && safety < 150) {
      safety++;
      const p = shuffled[safety % shuffled.length];
      const handle = p.fn().toLowerCase();

      // Avoid impersonation terms
      if (handle.includes("admin") || handle.includes("support") || handle.includes("official") || handle.includes("verified")) {
        continue;
      }

      if (!set.has(handle)) {
        set.add(handle);
        items.push({
          handle,
          style: p.style,
          platform: currentPlat,
          length: handle.length,
        });
      }
    }

    setResults(items);
    setCopiedAll(false);

    trackEvent("name_search_submitted", {
      search_mode: "first_name",
      source_page_type: "tool",
    });
  };

  useEffect(() => {
    generate("Alex", "general", "all", false, true);
  }, []);

  const handleCopyOne = (handle: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(handle);
      setCopiedHandle(handle);
      setTimeout(() => setCopiedHandle(null), 2000);
    }
  };

  const handleCopyAll = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard && results.length > 0) {
      const text = results.map((r) => `@${r.handle}`).join("\n");
      navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    }
  };

  const handleRandomize = () => {
    const rand = RANDOM_SEEDS[Math.floor(Math.random() * RANDOM_SEEDS.length)];
    setSeed(rand);
    generate(rand, platform, style, includeNumbers, includeSeparators);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Controls Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-lg space-y-6">
        <div>
          <label htmlFor="user-seed-input" className="block text-base font-bold text-foreground mb-1">
            Generate Creative Usernames &amp; Social Handles
          </label>
          <p className="text-xs text-muted-foreground">
            Enter your name, nickname, or keyword, or leave blank to generate completely random handles.
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
                  setSeed(p.seed);
                  setPlatform(p.platform);
                  setStyle(p.style);
                  generate(p.seed, p.platform, p.style, includeNumbers, includeSeparators);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-secondary/30 hover:border-primary/50 hover:text-primary text-foreground transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Field */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              id="user-seed-input"
              type="text"
              placeholder="Enter name, nickname, or niche (e.g. Maya, Shadow, coffee, gaming)..."
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={handleRandomize}
            className="h-12 px-4 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-foreground text-xs font-semibold shrink-0 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Random Word
          </button>
        </div>

        {/* Platform & Style Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-border/50">
          <div>
            <label htmlFor="user-plat" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Target Platform
            </label>
            <select
              id="user-plat"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="general">General / All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="gaming">Gaming &amp; Discord</option>
            </select>
          </div>

          <div>
            <label htmlFor="user-style" className="text-xs font-bold text-muted-foreground mb-1.5 block">
              Username Style
            </label>
            <select
              id="user-style"
              value={style}
              onChange={(e) => setStyle(e.target.value as Style)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Styles</option>
              <option value="clean">Clean &amp; Minimal</option>
              <option value="aesthetic">Aesthetic &amp; Soft</option>
              <option value="gaming">Gaming &amp; Cyber</option>
              <option value="professional">Professional &amp; Creator</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              id="user-num"
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary/30"
            />
            <label htmlFor="user-num" className="text-xs font-medium text-foreground cursor-pointer">
              Include digits
            </label>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              id="user-sep"
              type="checkbox"
              checked={includeSeparators}
              onChange={(e) => setIncludeSeparators(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary/30"
            />
            <label htmlFor="user-sep" className="text-xs font-medium text-foreground cursor-pointer">
              Allow dots/underscores
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => generate()}
            className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> Generate 10 Usernames
          </button>

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

      {/* Generated Results Grid */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Generated Handles ({results.length} Suggestions)
            </span>
            <span className="text-xs text-muted-foreground">
              Mode: {platform === "general" ? "Multi-Platform" : platform.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.map((item) => {
              const isCopied = copiedHandle === item.handle;

              return (
                <div
                  key={item.handle}
                  className="p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-primary">
                        {item.style}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {item.length} chars
                      </span>
                    </div>
                    <span className="font-mono text-base font-bold text-foreground group-hover:text-primary transition-colors block">
                      @{item.handle}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleCopyOne(item.handle, e)}
                    className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary text-foreground transition-colors shrink-0 flex items-center gap-1.5 text-xs font-semibold"
                    title={`Copy @${item.handle}`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl border border-border/60 bg-secondary/20 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
            <span>
              <strong>Note:</strong> Username suggestions are creative ideas. Live availability varies by platform. Check your desired app directly before committing.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
