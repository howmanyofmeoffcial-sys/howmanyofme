import React, { useState, useEffect } from "react";
import { getNameData, formatNumber } from "../../data/nameData";
import { validateSingleName } from "../../lib/nameValidation";

export default function NameComparisonIsland() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [results, setResults] = useState<{
    a: ReturnType<typeof getNameData>;
    b: ReturnType<typeof getNameData>;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const a = sp.get("a");
      const b = sp.get("b");
      if (a && b) {
        setName1(a);
        setName2(b);
        setResults({ a: getNameData(a), b: getNameData(b) });
      }
    }
  }, []);

  const compare = (e: React.FormEvent) => {
    e.preventDefault();
    const v1 = validateSingleName(name1);
    const v2 = validateSingleName(name2);
    if (!v1.ok || !v2.ok) return;

    setResults({ a: getNameData(name1.trim()), b: getNameData(name2.trim()) });

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("a", name1.trim());
      url.searchParams.set("b", name2.trim());
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <div>
      <form onSubmit={compare} className="grid sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">
            First Name
          </label>
          <input
            type="text"
            placeholder="e.g. Emma"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            className="w-full h-11 rounded-xl border border-input bg-secondary px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">
            Second Name
          </label>
          <input
            type="text"
            placeholder="e.g. Olivia"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            className="w-full h-11 rounded-xl border border-input bg-secondary px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
          >
            Compare Both Names
          </button>
        </div>
      </form>

      {results && (
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <h3 className="font-display text-2xl font-bold text-foreground mb-1">
              {results.a.name}
            </h3>
            <p className="text-xs uppercase font-semibold text-primary mb-4">
              {results.a.origin} Origin • {results.a.gender}
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <div>
                <strong className="text-foreground">Living Bearers:</strong> ~
                {formatNumber(results.a.count)}
              </div>
              <div>
                <strong className="text-foreground">Global Rank:</strong> #
                {formatNumber(results.a.rank)}
              </div>
              <div>
                <strong className="text-foreground">Meaning:</strong> {results.a.meaning}
              </div>
            </div>
            <a
              href={`/name/${results.a.name}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              View Full {results.a.name} Profile →
            </a>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card">
            <h3 className="font-display text-2xl font-bold text-foreground mb-1">
              {results.b.name}
            </h3>
            <p className="text-xs uppercase font-semibold text-primary mb-4">
              {results.b.origin} Origin • {results.b.gender}
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <div>
                <strong className="text-foreground">Living Bearers:</strong> ~
                {formatNumber(results.b.count)}
              </div>
              <div>
                <strong className="text-foreground">Global Rank:</strong> #
                {formatNumber(results.b.rank)}
              </div>
              <div>
                <strong className="text-foreground">Meaning:</strong> {results.b.meaning}
              </div>
            </div>
            <a
              href={`/name/${results.b.name}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              View Full {results.b.name} Profile →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
