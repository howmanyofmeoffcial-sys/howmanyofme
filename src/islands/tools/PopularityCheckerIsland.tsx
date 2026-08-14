import React, { useState } from "react";
import { validateSingleName } from "../../lib/nameValidation";

const SUGGESTED = ["Emma", "Olivia", "Sophia", "Liam", "Noah", "Oliver", "Isabella", "Lucas"];

export default function PopularityCheckerIsland() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCheck = (inputName: string) => {
    const trimmed = inputName.trim();
    if (!trimmed) {
      setError("Please enter a name");
      return;
    }
    const val = validateSingleName(trimmed);
    if (val.ok === false) {
      setError(val.reason || "Invalid name");
      return;
    }
    window.location.href = `/name/${encodeURIComponent(trimmed)}`;
  };

  return (
    <div>
      {/* Quick suggested chips */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
          Try a popular name
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleCheck(s)}
              className="px-3 py-1.5 text-sm rounded-full border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCheck(name);
        }}
        className="flex gap-3 mb-4"
      >
        <input
          type="text"
          placeholder="Enter any first name (e.g., David, Sophia)..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          className="flex-1 h-11 rounded-xl border border-input bg-secondary px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
        >
          Check Popularity
        </button>
      </form>

      {error && <p className="text-xs text-destructive mb-6 font-medium">{error}</p>}
    </div>
  );
}
