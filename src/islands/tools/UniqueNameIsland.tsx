import React, { useState } from "react";
import { getNamesForLetter, getNameData, formatNumber, ALPHABET } from "../../data/nameData";

const PRESETS = [
  { label: "Hidden gems (under 1k)", gender: "any", maxPop: 1000 },
  { label: "Rare boy names", gender: "male", maxPop: 5000 },
  { label: "Rare girl names", gender: "female", maxPop: 5000 },
  { label: "Distinctive (under 50k)", gender: "any", maxPop: 50000 },
];

export default function UniqueNameIsland() {
  const [gender, setGender] = useState("any");
  const [maxPop, setMaxPop] = useState(5000);
  const [results, setResults] = useState<string[]>([]);

  const generate = (g = gender, m = maxPop) => {
    const allNames = ALPHABET.flatMap((l) => getNamesForLetter(l));
    const filtered = allNames.filter((n) => {
      const d = getNameData(n);
      const genderOk = g === "any" || d.gender === g || d.gender === "unisex";
      return genderOk && d.count <= m;
    });
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    setResults([...new Set(shuffled.slice(0, 12))]);
  };

  return (
    <div>
      {/* Quick presets */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
          Quick presets
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setGender(p.gender);
                setMaxPop(p.maxPop);
                generate(p.gender, p.maxPop);
              }}
              className="px-3 py-1.5 text-sm rounded-full border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-foreground transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground"
          >
            <option value="any">Any Gender</option>
            <option value="male">Boy Names</option>
            <option value="female">Girl Names</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">
            Max Bearers: ~{formatNumber(maxPop)}
          </label>
          <select
            value={maxPop}
            onChange={(e) => setMaxPop(Number(e.target.value))}
            className="h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground"
          >
            <option value={500}>Under 500 (Extremely rare)</option>
            <option value={1000}>Under 1,000 (Very rare)</option>
            <option value={5000}>Under 5,000 (Rare)</option>
            <option value={20000}>Under 20,000 (Uncommon)</option>
            <option value={50000}>Under 50,000 (Distinctive)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => generate()}
          className="h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Find Rare Names
        </button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
          {results.map((n) => (
            <a
              key={n}
              href={`/name/${n}`}
              className="p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 text-center transition-colors group"
            >
              <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {n}
              </div>
              <div className="text-xs text-muted-foreground">
                ~{formatNumber(getNameData(n).count)} bearers
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
