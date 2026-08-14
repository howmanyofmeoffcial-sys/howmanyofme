import { useEffect, useState } from "react";

interface HealthResponse {
  ok: boolean;
  service: string;
  apiKeyConfigured: boolean;
  timeoutMs: number;
  timestamp: string;
}

interface ProbeResult {
  ok?: boolean;
  fallback?: boolean;
  gender?: string;
  confidence?: number;
  source?: string;
  error?: string;
  durationMs?: number;
}

const ADMIN_TOKEN_KEY = "admin_token";

export default function AdminGenderHealth() {
  const [token, setToken] = useState<string>(() => localStorage.getItem(ADMIN_TOKEN_KEY) || "");
  const [authed, setAuthed] = useState(false);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [probe, setProbe] = useState<ProbeResult | null>(null);
  const [probeName, setProbeName] = useState("Dawnga");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Token gate is purely a UX guard — endpoint itself never returns secrets.
  // Default unlock token is "admin" unless overridden by VITE_ADMIN_TOKEN at build time.
  const expected = (import.meta.env.VITE_ADMIN_TOKEN as string | undefined) || "admin";

  useEffect(() => {
    document.title = "Gender Detect — Health";
  }, []);

  const unlock = () => {
    if (token.trim() === expected) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token.trim());
      setAuthed(true);
      void loadHealth();
    } else {
      setError("Incorrect token.");
    }
  };

  const loadHealth = async () => {
    setError(null);
    setLoading(true);
    try {
      const r = await fetch("/api/gender-detect", { method: "GET" });
      setHealth((await r.json()) as HealthResponse);
    } catch (e) {
      setError(`Health check failed: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const runProbe = async () => {
    setError(null);
    setProbe(null);
    setLoading(true);
    const start = performance.now();
    try {
      const r = await fetch("/api/gender-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: probeName }),
      });
      const data = (await r.json()) as ProbeResult;
      setProbe({ ...data, durationMs: Math.round(performance.now() - start) });
    } catch (e) {
      setProbe({ error: (e as Error).message, durationMs: Math.round(performance.now() - start) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token === expected) {
      setAuthed(true);
      void loadHealth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm rounded-2xl border bg-card p-6 space-y-3">
          <h1 className="font-display text-xl font-bold">Admin Access</h1>
          <p className="text-sm text-muted-foreground">
            Enter the admin token to view <code>/api/gender-detect</code> health.
          </p>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="admin token"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            onClick={unlock}
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Unlock
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Gender Detect — Health</h1>
          <button
            onClick={loadHealth}
            disabled={loading}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-secondary"
          >
            {loading ? "Checking…" : "Refresh"}
          </button>
        </header>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <section className="rounded-2xl border bg-card p-5 space-y-2">
          <h2 className="font-semibold">Service status</h2>
          {health ? (
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">Service</dt>
              <dd>{health.service}</dd>
              <dt className="text-muted-foreground">OK</dt>
              <dd>{String(health.ok)}</dd>
              <dt className="text-muted-foreground">API key configured</dt>
              <dd>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                    health.apiKeyConfigured
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "bg-red-500/15 text-red-700 dark:text-red-300"
                  }`}
                >
                  {health.apiKeyConfigured ? "yes" : "no (fallback only)"}
                </span>
              </dd>
              <dt className="text-muted-foreground">Timeout (ms)</dt>
              <dd>{health.timeoutMs}</dd>
              <dt className="text-muted-foreground">Timestamp</dt>
              <dd>{health.timestamp}</dd>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">Loading…</p>
          )}
        </section>

        <section className="rounded-2xl border bg-card p-5 space-y-3">
          <h2 className="font-semibold">Live probe</h2>
          <div className="flex gap-2">
            <input
              value={probeName}
              onChange={(e) => setProbeName(e.target.value)}
              placeholder="Name to probe"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={runProbe}
              disabled={loading || !probeName.trim()}
              className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              Probe
            </button>
          </div>
          {probe && (
            <pre className="overflow-auto rounded-md bg-secondary/50 p-3 text-xs">
              {JSON.stringify(probe, null, 2)}
            </pre>
          )}
          <p className="text-xs text-muted-foreground">
            Last fallback reasons (timeout, missing_api_key, upstream_error, unrecognized) appear
            in Vercel function logs without exposing the probed name or the API key.
          </p>
        </section>
      </div>
    </main>
  );
}
