import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

const styles = [
  (n: string) => n.toLowerCase() + Math.floor(Math.random() * 999),
  (n: string) => n.toLowerCase() + "_" + ["pro", "dev", "hq", "go", "hub"][Math.floor(Math.random() * 5)],
  (n: string) => "the" + n.toLowerCase(),
  (n: string) => n.toLowerCase().split("").reverse().join("") + Math.floor(Math.random() * 99),
  (n: string) => n.substring(0, 3).toLowerCase() + "_" + n.substring(3).toLowerCase() + Math.floor(Math.random() * 99),
  (n: string) => "x" + n.toLowerCase() + "x",
  (n: string) => n.toLowerCase() + ".official",
  (n: string) => n.charAt(0).toLowerCase() + "_" + n.slice(1).toLowerCase(),
];

const PRESETS = ["Alex", "Sam", "Maya", "Jordan"];

export default function UsernameGeneratorIsland() {
  const [name, setName] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = (n: string) => {
    if (n.trim()) setResults(styles.map((fn) => fn(n.trim())));
  };

  const copy = (s: string) => {
    navigator.clipboard.writeText(s);
    setCopied(s);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      {/* PRESETS */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
          Try a preset
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setName(p);
                generate(p);
              }}
              className="px-3 py-1.5 text-sm rounded-full border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-foreground transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter any name or word..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate(name)}
          className="flex-1 h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground"
        />
        <button
          type="button"
          onClick={() => generate(name)}
          className="h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Generate Usernames
        </button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
          {results.map((u) => (
            <div
              key={u}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
            >
              <span className="font-mono text-sm font-semibold text-foreground">{u}</span>
              <button
                type="button"
                onClick={() => copy(u)}
                className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
                title="Copy username"
              >
                {copied === u ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
