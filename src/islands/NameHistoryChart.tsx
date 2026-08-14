import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export interface TimelinePoint {
  year: number;
  births: number;
  male: number;
  female: number;
}

interface NameHistoryChartProps {
  name: string;
  history: TimelinePoint[];
  peakYear: number;
  peakBirths: number;
}

export default function NameHistoryChart({
  name,
  history,
  peakYear,
  peakBirths,
}: NameHistoryChartProps) {
  const [viewMode, setViewMode] = useState<"total" | "split">("total");

  if (!history || history.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-border bg-card text-center text-muted-foreground">
        Historical timeline data unavailable for this name.
      </div>
    );
  }

  return (
    <div className="p-5 md:p-6 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Annual U.S. Birth Registrations for {name} (1880–2024)
          </h3>
          <p className="text-xs text-muted-foreground">
            Peak Year: <strong className="text-foreground">{peakYear}</strong> (~{peakBirths.toLocaleString()} recorded births)
          </p>
        </div>
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-secondary text-xs">
          <button
            type="button"
            onClick={() => setViewMode("total")}
            className={`px-3 py-1 rounded-md font-medium transition ${
              viewMode === "total"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Total Births
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`px-3 py-1 rounded-md font-medium transition ${
              viewMode === "split"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            By Sex (M vs F)
          </button>
        </div>
      </div>

      <div className="w-full h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
            <XAxis
              dataKey="year"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "0.75rem",
                color: "hsl(var(--foreground))",
                fontSize: "0.85rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: any, name: any) => [
                Number(value).toLocaleString(),
                name === "births" ? "Total Births" : name === "male" ? "Male Births" : "Female Births",
              ]}
              labelFormatter={(label: any) => `Year: ${label}`}
            />
            <Legend
              wrapperStyle={{ fontSize: "0.8rem", paddingTop: "0.5rem" }}
              formatter={(val: string) =>
                val === "births" ? "Total Annual Births" : val === "male" ? "Male Births" : "Female Births"
              }
            />
            {viewMode === "total" ? (
              <Line
                type="monotone"
                dataKey="births"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="male"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="female"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Source: U.S. Social Security Administration (SSA 1880–2024)</span>
        <span>Includes births with $\ge 5$ annual occurrences</span>
      </div>
    </div>
  );
}
