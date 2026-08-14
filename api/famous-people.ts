type ServerlessRequest = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
};

type ServerlessResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (payload: unknown) => void;
    end: (payload?: string) => void;
  };
};

interface Person {
  name: string;
  description: string;
  extract: string;
  image: string | null;
  url: string;
}

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const raw = req.query?.name;
  const name = (Array.isArray(raw) ? raw[0] : raw ?? "").toString().trim().slice(0, 60);

  if (!name) {
    return res.status(200).json({ people: [] });
  }

  try {
    const searchUrl =
      `https://en.wikipedia.org/w/api.php?` +
      `action=query&list=search&srsearch=${encodeURIComponent(name + " person biography")}` +
      `&srlimit=10&srnamespace=0&format=json&origin=*`;

    const searchRes = await fetch(searchUrl, {
      headers: { "User-Agent": "HowManyOfMe/1.0 (name statistics tool)" },
    });

    if (!searchRes.ok) {
      return res.status(200).json({ people: [] });
    }

    const searchData = (await searchRes.json()) as {
      query?: { search?: Array<{ title: string; snippet: string }> };
    };

    const hits = searchData?.query?.search ?? [];

    const results = await Promise.allSettled(
      hits.slice(0, 8).map(async (hit): Promise<Person | null> => {
        const summaryUrl =
          `https://en.wikipedia.org/api/rest_v1/page/summary/` +
          encodeURIComponent(hit.title);

        const summaryRes = await fetch(summaryUrl, {
          headers: { "User-Agent": "HowManyOfMe/1.0 (name statistics tool)" },
        });

        if (!summaryRes.ok) return null;

        const data = (await summaryRes.json()) as {
          type?: string;
          title?: string;
          description?: string;
          extract?: string;
          thumbnail?: { source?: string };
          content_urls?: { desktop?: { page?: string } };
        };

        if (data.type !== "standard") return null;
        if (!data.description) return null;

        const desc = (data.description ?? "").toLowerCase();
        const isPlace = /city|town|village|municipality|country|river|mountain|district/.test(desc);
        const isConcept = /film|movie|album|song|book|novel|television|tv series/.test(desc);
        if (isPlace || isConcept) return null;

        return {
          name: data.title ?? hit.title,
          description: data.description ?? "",
          extract: (data.extract ?? "").slice(0, 220),
          image: data.thumbnail?.source ?? null,
          url:
            data.content_urls?.desktop?.page ??
            `https://en.wikipedia.org/wiki/${encodeURIComponent(hit.title)}`,
        };
      }),
    );

    const people = results
      .filter((r): r is PromiseFulfilledResult<Person> => r.status === "fulfilled" && r.value !== null)
      .map((r) => r.value)
      .slice(0, 6);

    return res.status(200).json({ people });
  } catch {
    return res.status(200).json({ people: [] });
  }
}
