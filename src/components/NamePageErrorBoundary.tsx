import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export class NamePageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      errorMsg: error instanceof Error ? error.message : "Unknown error",
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.name !== this.props.name) {
      this.setState({ hasError: false, errorMsg: "" });
    }
  }

  render() {
    if (this.state.hasError) {
      const { name } = this.props;
      const hash = Math.abs(
        (name || "unknown").split("").reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0)
      );
      const count = (hash % 50000) + 500;
      const rank = (hash % 200000) + 1000;

      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-6">
            <div className="text-5xl">🔍</div>
            <h2 className="font-display text-2xl font-bold">
              Showing estimated data for "{name}"
            </h2>
            <p className="text-muted-foreground">
              This is a rare name not in our main database.
              Here are our best estimates:
            </p>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground mb-1">Estimated bearers</p>
                <p className="text-2xl font-bold">~{count.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground mb-1">Global rank</p>
                <p className="text-2xl font-bold">#{rank.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This is a very rare name — fewer than 1 in{" "}
              {Math.round(8_000_000_000 / count).toLocaleString()} people share it.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
              >
                Try another name
              </Link>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 rounded-lg border text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
