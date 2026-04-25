import { getIndexedSitemapTargets } from "@/data/serverNameData";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://howmanyofme.co";

  const targets = getIndexedSitemapTargets();
  const indexedNames = targets.filter((nameData: any) => nameData.status === "index");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${indexedNames.map(
    (nameData: any) => `
  <url>
    <loc>${baseUrl}/name/${encodeURIComponent(nameData.name)}</loc>
    <changefreq>monthly</changefreq>
    <priority>${nameData.tier ? (nameData.tier === 1 ? '0.9' : nameData.tier === 2 ? '0.8' : '0.7') : '0.6'}</priority>
  </url>`
  ).join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
