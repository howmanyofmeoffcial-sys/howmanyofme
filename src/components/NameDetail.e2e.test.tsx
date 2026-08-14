import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import NameDetail from "@/pages/NameDetail";

const renderRoute = (path: string) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <RouteErrorBoundary resetKey={path}>
          <Routes>
            <Route path="/name/:name" element={<NameDetail />} />
          </Routes>
        </RouteErrorBoundary>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("NameDetail e2e", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders full report for unknown name without hitting the error boundary", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: false, fallback: true }),
    }));

    renderRoute("/name/Mapuii");

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1, name: /Mapuii/i })).toBeInTheDocument();
    });
    expect(screen.queryByText(/could not be displayed/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Results are unavailable/i)).not.toBeInTheDocument();
  });

  it("renders deeply unique names without crashing", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    renderRoute("/name/Zxqvbnpqrt");

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1, name: /Zxqvbnpqrt/i })).toBeInTheDocument();
    });
    expect(screen.queryByText(/could not be displayed/i)).not.toBeInTheDocument();
  });
});
