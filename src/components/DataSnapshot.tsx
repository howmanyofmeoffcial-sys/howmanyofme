import { Database, TrendingUp, TrendingDown, Minus, CalendarDays } from "lucide-react";

export interface DataSnapshotMetric {
  label: string;
  value: string;
  /** Optional sub-line for context (e.g. "vs ~3,800 in 2015") */
  context?: string;
  /** "up" = rising / rare-rising, "down" = declining, "flat" = stable */
  trend?: "up" | "down" | "flat";
}

export interface DataSnapshotProps {
  /** Headline shown at top of the widget. */
  title?: string;
  /** Plain-language one-liner that frames the data. */
  summary?: string;
  /** 2–4 metric cards. */
  metrics: DataSnapshotMetric[];
  /** Source labels / links — e.g. "SSA 2025", "US Census 2020". */
  sources?: { label: string; url?: string }[];
  /** ISO date string the dataset was last refreshed (e.g. "2026-03-01"). */
  lastUpdated?: string;
  /** Display-friendly version of lastUpdated (e.g. "March 2026"). */
  lastUpdatedLabel?: string;
}

const trendIcon = (t?: DataSnapshotMetric["trend"]) => {
  if (t === "up") return <TrendingUp className="h-3.5 w-3.5 text-primary" aria-hidden />;
  if (t === "down") return <TrendingDown className="h-3.5 w-3.5 text-destructive" aria-hidden />;
  if (t === "flat") return <Minus className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />;
  return null;
};

const DataSnapshot = ({
  title = "US Popularity Snapshot",
  summary,
  metrics,
  sources = [],
  lastUpdated,
  lastUpdatedLabel,
}: DataSnapshotProps) => {
  return (
    <aside
      aria-label="Data snapshot"
      className="my-8 rounded-xl border border-border bg-secondary/40 p-5 md:p-6"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Database className="h-4.5 w-4.5 text-primary" aria-hidden />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg md:text-xl font-bold leading-tight">{title}</h3>
          {summary && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{summary}</p>
          )}
        </div>
      </div>

      <dl
        className={`grid gap-3 ${metrics.length >= 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}
      >
        {metrics.map((m, i) => (
          <div key={i} className="rounded-lg bg-card border border-border p-3">
            <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {trendIcon(m.trend)}
              {m.label}
            </dt>
            <dd className="font-semibold text-foreground mt-1 text-base">{m.value}</dd>
            {m.context && (
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{m.context}</p>
            )}
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {lastUpdated && (
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            Last updated:{" "}
            <time dateTime={lastUpdated} className="font-medium text-foreground">
              {lastUpdatedLabel ?? lastUpdated}
            </time>
          </span>
        )}
        {sources.length > 0 && (
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <span>Sources:</span>
            {sources.map((s, i) => (
              <span key={i}>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    {s.label}
                  </a>
                ) : (
                  <span className="font-medium text-foreground">{s.label}</span>
                )}
                {i < sources.length - 1 ? "," : ""}
              </span>
            ))}
          </span>
        )}
      </div>
    </aside>
  );
};

export default DataSnapshot;
