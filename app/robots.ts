import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: [
      "https://howmanyofme.co/sitemap.xml",
      "https://howmanyofme.co/sitemap_names.xml",
    ],
  };
}
