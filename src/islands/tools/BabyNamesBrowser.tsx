import React, { useState } from "react";
import { getNamesForLetter, getNameData, ALPHABET } from "../../data/nameData";

export default function BabyNamesBrowser() {
  const [letter, setLetter] = useState("a");
  const [gender, setGender] = useState<string>("any");

  const names = getNamesForLetter(letter).filter((n) => {
    if (gender === "any") return true;
    const d = getNameData(n);
    return d.gender === gender || d.gender === "unisex";
  });

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {ALPHABET.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLetter(l)}
            className={`w-9 h-9 rounded-md text-sm font-bold uppercase transition-colors ${
              l === letter
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-primary/10"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-12">
        {names.map((n) => (
          <a
            key={n}
            href={`/name/${n}`}
            className="p-3 rounded-lg border border-border bg-card hover:bg-secondary/50 text-center text-sm font-medium text-foreground transition-colors"
          >
            {n}
          </a>
        ))}
      </div>
    </div>
  );
}
