import { getAllIndexableNames } from "@/data/serverNameData";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://howmanyofme.co";

  const indexedNames = getAllIndexableNames();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${indexedNames.map(
    (nameData: any) => `
  <url>
    <loc>${baseUrl}/name/${encodeURIComponent(nameData.name.toLowerCase())}</loc>
    <changefreq>monthly</changefreq>
    <priority>${nameData.score >= 95 ? '0.9' : nameData.score >= 85 ? '0.8' : '0.7'}</priority>
  </url>`
  ).join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
