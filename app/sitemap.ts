import type { MetadataRoute } from "next";
import { ALPHABET, getPopularNames, getNamesForLetter } from "@/data/nameData";
import { getNamesForLetterServer } from "@/data/serverNameData";
import { blogArticles } from "@/data/blogData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://howmanyofme.co";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/methodology`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Tool pages
  const toolSlugs = [
    "popularity-checker", "random-name", "baby-names", "username-generator",
    "name-comparison", "trend-visualizer", "unique-name-generator", "popularity-guide", "meaning",
  ];
  const toolPages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Letter directory pages (26)
  const letterPages: MetadataRoute.Sitemap = ALPHABET.map((letter) => ({
    url: `${baseUrl}/names/${letter}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Name detail pages (popular names + all extended names)
  const popularNames = getPopularNames().map((n) => n.name);
  const allNames = new Set<string>(popularNames);
  ALPHABET.forEach((letter) => {
    if (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].includes(letter.toLowerCase())) return; // Handled in sitemap_names.xml
    const baseNames = getNamesForLetter(letter);
    getNamesForLetterServer(letter, baseNames).forEach((item) => {
      // Only add to this generic sitemap if it's considered high quality
      if (item.score >= 80) allNames.add(item.name);
    });
  });
  const namePages: MetadataRoute.Sitemap = Array.from(allNames).map((name) => ({
    url: `${baseUrl}/name/${encodeURIComponent(name)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = blogArticles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...letterPages, ...namePages, ...blogPages];
}
