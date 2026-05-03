// Vercel Serverless Function: secure proxy to genderize.io
// Keeps GENDERIZE_API_KEY on the server. Never returns the key to the client.

export const config = { runtime: "edge" };

interface GenderizeResponse {
  name: string;
  gender: "male" | "female" | null;
  probability: number;
  count: number;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: { name?: string; country?: string } = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const name = (body.name || "").trim();
  const country = (body.country || "").trim();

  if (!name) return json({ error: "Missing 'name'" }, 400);

  const apiKey = process.env.GENDERIZE_API_KEY;
  if (!apiKey) {
    // Signal a soft failure so the frontend can fall back to local heuristics.
    return json({ error: "Service unavailable", fallback: true }, 503);
  }

  const url = new URL("https://api.genderize.io/");
  url.searchParams.set("name", name);
  if (country) url.searchParams.set("country_id", country);
  url.searchParams.set("apikey", apiKey);

  try {
    const upstream = await fetch(url.toString(), { method: "GET" });

    if (!upstream.ok) {
      // 402 = quota, 401 = bad key, 429 = rate limit, etc.
      return json({ error: "Upstream error", fallback: true, status: upstream.status }, 502);
    }

    const data = (await upstream.json()) as GenderizeResponse;

    return json({
      name: data.name,
      gender: data.gender, // "male" | "female" | null
      probability: data.probability,
      count: data.count,
      country: country || null,
      source: "genderize.io",
    });
  } catch {
    return json({ error: "Network error", fallback: true }, 502);
  }
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
