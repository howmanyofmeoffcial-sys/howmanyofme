import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
  resetKey: string;
};

type State = {
  hasError: boolean;
};

class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Route render failed", { message: error.message, stack: info.componentStack });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <section className="max-w-md text-center space-y-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Page could not be displayed</h1>
          <p className="text-muted-foreground">
            This name lookup could not be rendered, but the site is still working. Try another name or return home.
          </p>
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            Back to home
          </Link>
        </section>
      </main>
    );
  }
}

export default RouteErrorBoundary;