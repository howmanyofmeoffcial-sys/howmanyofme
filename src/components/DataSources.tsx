// Compact "Data Sources & Methodology" trust block.
// Pure presentation — no external network calls.

import { Link } from "react-router-dom";
import { Database, ExternalLink } from "lucide-react";

interface Props {
  /** Optional context line (e.g., "Bearer estimates for Emma combine…"). */
  context?: string;
  className?: string;
}

const DataSources = ({ context, className = "" }: Props) => {
  return (
    <aside
      className={`p-5 rounded-xl border border-border bg-card/60 ${className}`}
      aria-labelledby="data-sources-heading"
    >
      <div className="flex items-center gap-2 mb-2">
        <Database className="h-4 w-4 text-primary" aria-hidden />
        <h3 id="data-sources-heading" className="font-semibold text-sm">
          Data sources &amp; methodology
        </h3>
      </div>
      {context && <p className="text-xs text-muted-foreground mb-3">{context}</p>}
      <ul className="text-xs text-muted-foreground space-y-1.5">
        <li>
          <a
            href="https://www.ssa.gov/oact/babynames/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-primary"
          >
            U.S. Social Security Administration — Baby Names
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        </li>
        <li>
          <a
            href="https://www.census.gov/topics/population/genealogy/data/2010_surnames.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-primary"
          >
            U.S. Census Bureau — Population &amp; Surnames
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        </li>
        <li>
          <a
            href="https://data.unicef.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-primary"
          >
            UNICEF — Global population &amp; birth data
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        </li>
        <li>
          Read our full{" "}
          <Link to="/methodology" className="text-primary hover:underline">
            methodology
          </Link>{" "}
          for how estimates are calculated.
        </li>
      </ul>
    </aside>
  );
};

export default DataSources;
