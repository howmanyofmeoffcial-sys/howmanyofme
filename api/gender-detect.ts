type ServerlessRequest = {
  method?: string;
  body?: unknown;
};

type ServerlessResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (payload: unknown) => void;
    end: (payload?: string) => void;
  };
};

const FALLBACK_RESPONSE = { ok: false, fallback: true };
const TIMEOUT_MS = 1200;

function sendJson(res: ServerlessResponse, status: number, payload: unknown) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(status).json(payload);
}

function parseBody(body: unknown): Record<string, unknown> {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof body === "object") return body as Record<string, unknown>;
  return {};
}

function cleanName(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/[^A-Za-z]/g, "").slice(0, 80) : "";
}

function cleanCountry(value: unknown) {
  if (typeof value !== "string") return "";
  const country = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(country) ? country : "";
}

function logEvent(event: string, meta: Record<string, unknown> = {}) {
  // Structured log with no secrets — safe to surface in Vercel logs.
  try {
    console.log(JSON.stringify({ scope: "gender-detect", event, ...meta }));
  } catch {
    /* ignore */
  }
}

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    return res.status(204).end();
  }

  // Health check — never exposes the key, only whether it is configured.
  if (req.method === "GET") {
    return sendJson(res, 200, {
      ok: true,
      service: "gender-detect",
      apiKeyConfigured: Boolean(process.env.GENDERIZE_API_KEY),
      timeoutMs: TIMEOUT_MS,
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    return sendJson(res, 405, { ok: false, error: "METHOD_NOT_ALLOWED" });
  }

  const body = parseBody(req.body);
  const name = cleanName(body.name);
  const country = cleanCountry(body.country);
  const apiKey = process.env.GENDERIZE_API_KEY;

  if (!name) {
    logEvent("invalid_name", { hasKey: Boolean(apiKey) });
    return sendJson(res, 200, FALLBACK_RESPONSE);
  }
  if (!apiKey) {
    logEvent("missing_api_key");
    return sendJson(res, 200, FALLBACK_RESPONSE);
  }

  const nameLen = name.length;
  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = new URL("https://api.genderize.io/");
    url.searchParams.set("name", name);
    url.searchParams.set("apikey", apiKey);
    if (country) url.searchParams.set("country_id", country);

    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      logEvent("upstream_error", { status: response.status, nameLen, country, durationMs: Date.now() - start });
      return sendJson(res, 200, FALLBACK_RESPONSE);
    }

    const data = (await response.json()) as {
      name?: unknown;
      gender?: unknown;
      probability?: unknown;
      count?: unknown;
    };

    if ((data.gender !== "male" && data.gender !== "female") || typeof data.probability !== "number") {
      logEvent("unrecognized", { nameLen, country, durationMs: Date.now() - start });
      return sendJson(res, 200, FALLBACK_RESPONSE);
    }

    logEvent("ok", { nameLen, country, gender: data.gender, durationMs: Date.now() - start });
    return sendJson(res, 200, {
      ok: true,
      fallback: false,
      name: typeof data.name === "string" ? data.name : name,
      gender: data.gender,
      confidence: Math.round(Math.max(0, Math.min(1, data.probability)) * 100),
      count: typeof data.count === "number" ? data.count : 0,
      source: "genderize",
    });
  } catch (err) {
    const aborted = (err as { name?: string } | null)?.name === "AbortError";
    logEvent(aborted ? "timeout" : "exception", {
      nameLen,
      country,
      durationMs: Date.now() - start,
      errorType: (err as { name?: string } | null)?.name || "Error",
    });
    return sendJson(res, 200, FALLBACK_RESPONSE);
  } finally {
    clearTimeout(timeout);
  }
}