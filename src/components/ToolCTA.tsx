"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Sparkles, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { searchNames } from "@/data/nameData";

interface ToolCTAProps {
  variant?: "full" | "compact";
  headline?: string;
  subhead?: string;
  prefill?: string;
}

const ToolCTA = ({
  variant = "full",
  headline = "Check How Many People Have This Name",
  subhead = "Free · No signup · Results in under 1 second — across 100M+ records from 80+ countries.",
  prefill = "",
}: ToolCTAProps) => {
  const [name, setName] = useState(prefill);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleChange = (val: string) => {
    setName(val);
    setSuggestions(val.length >= 2 ? searchNames(val) : []);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim().replace(/\s+/g, "-") || "James";
    router.push(`/name/${encodeURIComponent(n)}`);
  };

  if (variant === "compact") {
    return (
      <div className="my-8 p-5 md:p-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-display font-bold text-base md:text-lg">{headline}</h3>
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input type="text" value={name} onChange={(e) => handleChange(e.target.value)} placeholder="Enter a first name…" aria-label="First name" className="w-full h-11 rounded-lg border-2 border-border bg-background pl-9 pr-3 text-sm focus:outline-none focus:border-primary" />
          </div>
          <button type="submit" className="h-11 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity">
            Check <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <section aria-label="Name popularity checker" className="my-10 md:my-14 p-6 md:p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Try the tool
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">{headline}</h2>
        <p className="text-muted-foreground mb-6">{subhead}</p>
        <form onSubmit={submit} className="relative max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <input type="text" value={name} onChange={(e) => handleChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)} placeholder="Try James, Liam, Sophia…" aria-label="First name" className={`w-full h-14 rounded-xl border-2 bg-background pl-12 pr-36 text-base focus:outline-none transition-all ${focused ? "border-primary ring-4 ring-primary/15" : "border-border"}`} />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-11 px-5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity">
              Check Now <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-popover border border-border rounded-xl shadow-xl z-20 max-h-56 overflow-y-auto text-left">
              {suggestions.map((s) => (
                <Link key={s} href={`/name/${s}`} className="block px-4 py-2.5 text-sm hover:bg-secondary transition-colors">{s}</Link>
              ))}
            </div>
          )}
        </form>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground mt-5">
          <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> Instant</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> No signup</span>
          <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> 100M+ names · 80+ countries</span>
        </div>
      </div>
    </section>
  );
};

export default ToolCTA;
