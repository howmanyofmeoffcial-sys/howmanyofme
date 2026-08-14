import React, { useState } from "react";
import { getNamesForLetter, getNameData, formatNumber, ALPHABET } from "../../data/nameData";

export default function RandomNameIsland() {
  const [generated, setGenerated] = useState<string[]>([]);
  const [gender, setGender] = useState<string>("any");

  const generate = (g = gender) => {
    const allNames = ALPHABET.flatMap((l) => getNamesForLetter(l));
    const filtered =
      g === "any"
        ? allNames
        : allNames.filter((n) => {
            const d = getNameData(n);
            return d.gender === g || d.gender === "unisex";
          });
    const result: string[] = [];
    for (let i = 0; i < 10; i++) {
      result.push(filtered[Math.floor(Math.random() * filtered.length)]);
    }
    setGenerated([...new Set(result)]);
  };

  return (
    <div>
      {/* Quick presets */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
          Quick presets
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "10 random boy names", g: "male" },
            { label: "10 random girl names", g: "female" },
            { label: "10 random unisex/any", g: "any" },
          ].map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setGender(p.g);
                generate(p.g);
              }}
              className="px-3 py-1.5 text-sm rounded-full border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-foreground transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground"
        >
          <option value="any">Any Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button
          type="button"
          onClick={() => generate()}
          className="h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Generate Names
        </button>
      </div>

      {generated.length > 0 && (
        <div className="space-y-2 mb-12">
          {generated.map((n) => (
            <a
              key={n}
              href={`/name/${n}`}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
            >
              <span className="font-semibold text-foreground">{n}</span>
              <span className="text-sm text-muted-foreground">
                ~{formatNumber(getNameData(n).count)} people
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
