import { Database, CheckCircle2, RefreshCw } from "lucide-react";

/**
 * Centralized dataset metadata. Update these values when refreshing the
 * underlying name data so every tool page shows the same trust signals.
 */
export const DATASET = {
  lastUpdated: "March 2026",
  records: "100M+ names",
  sources: [
    "U.S. Social Security Administration (SSA) birth records, 1880–2025",
    "UK Office for National Statistics (ONS) baby names",
    "International census & demographic registries (80+ countries)",
  ],
  coverage: "First names, gender, popularity rank, decade-by-decade trend, and regional distribution.",
  refreshCadence: "Quarterly",
} as const;

interface DataFreshnessProps {
  toolName?: string;
  className?: string;
}

const DataFreshness = ({ toolName, className = "" }: DataFreshnessProps) => {
  return (
    <section
      aria-label="Data freshness and sources"
      className={`my-10 rounded-xl border border-border bg-secondary/40 p-5 md:p-6 ${className}`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Database className="h-5 w-5 text-primary" aria-hidden />
        </div>
        <div>
          <h2 className="font-display text-lg md:text-xl font-bold leading-tight">
            Data Freshness {toolName ? `— ${toolName}` : ""}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Transparent, sourced, and regularly refreshed so you can trust every result.
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="rounded-lg bg-card border border-border p-3">
          <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden />
            Last updated
          </dt>
          <dd className="font-semibold text-foreground mt-1">
            <time dateTime="2026-03">{DATASET.lastUpdated}</time>
          </dd>
        </div>
        <div className="rounded-lg bg-card border border-border p-3">
          <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <Database className="h-3.5 w-3.5 text-primary" aria-hidden />
            Dataset size
          </dt>
          <dd className="font-semibold text-foreground mt-1">{DATASET.records}</dd>
        </div>
        <div className="rounded-lg bg-card border border-border p-3">
          <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <RefreshCw className="h-3.5 w-3.5 text-primary" aria-hidden />
            Refresh cadence
          </dt>
          <dd className="font-semibold text-foreground mt-1">{DATASET.refreshCadence}</dd>
        </div>
      </dl>

      <div className="mt-4">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
          What this dataset covers
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{DATASET.coverage}</p>
        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
          {DATASET.sources.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DataFreshness;
