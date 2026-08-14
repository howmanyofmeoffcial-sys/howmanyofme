import React, { useState, useMemo } from "react";
import { getNameData } from "../../data/nameData";
import { validateSingleName } from "../../lib/nameValidation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "hsl(220, 80%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(280, 60%, 50%)",
  "hsl(30, 80%, 50%)",
];

const DECADE_KEYS = ["1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

const PRESETS = [
  {
    label: "Top Girl Names",
    names: ["Emma", "Olivia", "Sophia", "Charlotte"],
  },
  {
    label: "Top Boy Names",
    names: ["Liam", "Noah", "Oliver", "Elijah"],
  },
  {
    label: "Vintage Revival",
    names: ["Eleanor", "Theodore", "Hazel", "Arthur"],
  },
  {
    label: "Mid-Century Classics",
    names: ["James", "Mary", "Robert", "Linda"],
  },
];

export default function TrendVisualizerIsland() {
  const [names, setNames] = useState<string[]>(["Emma", "Liam"]);
  const [inputVal, setInputVal] = useState("");

  const addName = (n: string) => {
    const trimmed = n.trim();
    if (!trimmed || names.length >= 4) return;
    const v = validateSingleName(trimmed);
    if (!v.ok) return;
    if (!names.includes(trimmed)) {
      setNames([...names, trimmed]);
      setInputVal("");
    }
  };

  const removeName = (idx: number) => {
    setNames(names.filter((_, i) => i !== idx));
  };

  const chartData = useMemo(() => {
    if (names.length === 0) return [];
    const nameRecords = names.map((n) => getNameData(n));

    return DECADE_KEYS.map((decade) => {
      const entry: Record<string, any> = { decade };
      nameRecords.forEach((rec) => {
        entry[rec.name] = rec.decade_popularity[decade] || 0;
      });
      return entry;
    });
  }, [names]);

  return (
    <div>
      {/* PRESETS */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
          Curated comparison presets
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setNames([...p.names])}
              className="px-3 py-1.5 text-sm rounded-full border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-foreground transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Name Chips */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {names.map((n, i) => (
          <span
            key={n}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold border border-border bg-card text-foreground"
            style={{ borderLeftColor: COLORS[i % COLORS.length], borderLeftWidth: 4 }}
          >
            {n}
            {names.length > 1 && (
              <button
                type="button"
                onClick={() => removeName(i)}
                className="text-muted-foreground hover:text-foreground text-xs ml-1"
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>

      {names.length < 4 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addName(inputVal);
          }}
          className="flex gap-3 mb-8"
        >
          <input
            type="text"
            placeholder="Add another name to compare (up to 4)..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground"
          />
          <button
            type="submit"
            className="h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Add Name
          </button>
        </form>
      )}

      {/* Chart */}
      <div className="p-6 rounded-2xl border border-border bg-card mb-12">
        <h3 className="font-display text-lg font-bold mb-4 text-foreground">
          Historical Popularity Trends (1940s–2020s)
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="decade" tick={{ fill: "currentColor", fontSize: 12 }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "currentColor", fontSize: 12 }}
                label={{
                  value: "Popularity Index (0-100)",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fontSize: 12 },
                }}
              />
              <Tooltip />
              <Legend />
              {names.map((n, i) => (
                <Line
                  key={n}
                  type="monotone"
                  dataKey={n}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
