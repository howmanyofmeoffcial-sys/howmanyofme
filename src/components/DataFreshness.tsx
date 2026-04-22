interface DataFreshnessProps {
  toolName: string;
}

const DataFreshness = ({ toolName }: DataFreshnessProps) => (
  <div className="mt-8 p-4 rounded-lg bg-secondary/50 border border-border text-center">
    <p className="text-xs text-muted-foreground">
      <strong className="text-foreground">{toolName}</strong> data sourced from U.S. SSA, UK ONS, and 78 additional
      countries. Last updated: Q1 2025.
    </p>
  </div>
);

export default DataFreshness;
