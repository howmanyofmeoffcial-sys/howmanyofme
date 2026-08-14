import React, { useState } from "react";
import { getNameData, formatNumber } from "../../data/nameData";

const PRESETS = ["Sophia", "Liam", "Aurora", "Atlas", "Eleanor", "Theodore"];

export default function MeaningLookupIsland() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<ReturnType<typeof getNameData> | null>(null);

  const lookup = (n: string) => {
    if (n.trim()) setResult(getNameData(n.trim()));
  };

  return (
    <div>
      {/* Quick presets */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
          Try a popular name
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setName(p);
                lookup(p);
              }}
              className="px-3 py-1.5 text-sm rounded-full border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-foreground transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(name);
        }}
        className="flex gap-3 mb-8"
      >
        <input
          type="text"
          placeholder="Enter any first name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground"
        />
        <button
          type="submit"
          className="h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Look Up Meaning
        </button>
      </form>

      {result && (
        <div className="p-6 rounded-2xl border border-border bg-card mb-12">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="font-display text-2xl font-bold text-foreground">
              {result.name}
            </h3>
            <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
              {result.origin} Origin
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-foreground leading-relaxed">
              <strong>Meaning:</strong> {result.meaning}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Gender association:</strong> {result.gender}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Living popularity:</strong> ~{formatNumber(result.count)} bearers worldwide (rank #{formatNumber(result.rank)})
            </p>
          </div>

          <a
            href={`/name/${result.name}`}
            className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
          >
            View full {result.name} demographic report →
          </a>
        </div>
      )}
    </div>
  );
}
