/**
 * Unified content registry for cross-linking blog articles and tool pages.
 * Each entry has tags for relevance matching and a type to distinguish content.
 */

import { blogArticles } from "./blogData";

export interface ContentItem {
  slug: string;
  title: string;
  description: string;
  path: string;
  type: "article" | "tool";
  tags: string[];
  category?: string;
  readTime?: number;
}

// Tag mappings for blog articles based on slug keywords
const articleTagMap: Record<string, string[]> = {
  "rare-baby-names-us": ["rare names", "baby names", "unique names", "SSA data", "US names"],
  "unusual-baby-names-alphabet": ["unusual names", "rare names", "A-Z names", "baby names", "unique names"],
  "why-baby-names-becoming-unique": ["name trends", "unique names", "baby names", "SSA data", "statistics"],
  "uncommon-girl-vs-boy-names": ["gender", "unique names", "girl names", "boy names", "statistics"],
  "baby-name-trends-2026": ["trends", "baby names", "predictions", "2026", "popular names"],
  "baby-names-by-decade": ["history", "decades", "trends", "popular names", "baby names"],
  "vintage-baby-names-comeback": ["vintage names", "trends", "baby names", "comeback", "retro"],
  "nature-inspired-baby-names": ["nature names", "baby names", "earthy", "botanical", "trends"],
  "celebrity-baby-name-trends": ["celebrity", "baby names", "trends", "popular names", "Hollywood"],
  "top-google-baby-name-searches-2026": ["Google trends", "search data", "baby names", "2026", "popular names"],
  "seasonal-patterns-baby-naming": ["seasonal", "birth months", "baby names", "patterns", "statistics"],
  "urban-vs-rural-baby-naming": ["urban", "rural", "regional", "baby names", "statistics"],
  "boy-girl-name-trends": ["gender", "trends", "boy names", "girl names", "crossover"],
  "names-switched-genders": ["gender", "unisex", "history", "trends", "name evolution"],
  "top-50-baby-names-meanings": ["popular names", "meanings", "baby names", "US names", "top names"],
  "baby-names-meaning-love": ["meanings", "love", "baby names", "themes", "etymology"],
  "baby-names-by-theme": ["themes", "nature", "virtue", "mythology", "baby names"],
  "ancient-greek-roman-names": ["Greek names", "Roman names", "history", "mythology", "origins"],
  "mythological-baby-names": ["mythology", "baby names", "trends", "Greek", "popular names"],
  "irish-baby-names": ["Irish names", "cultural", "boy names", "girl names", "origins"],
  "gender-neutral-nature-names": ["gender-neutral", "unisex", "nature names", "baby names", "trends"],
  "unique-unisex-names-az": ["unisex", "A-Z names", "unique names", "baby names", "gender-neutral"],
  "rare-surnames-america": ["surnames", "rare names", "US names", "family names", "statistics"],
  "most-uncommon-names-by-state": ["state data", "regional", "uncommon names", "US names", "statistics"],
  "popular-baby-names-california": ["California", "popular names", "regional", "state data", "2026"],
  "popular-baby-names-texas": ["Texas", "popular names", "regional", "state data", "2026"],
  "baby-name-popularity-by-state": ["state data", "regional", "map", "popular names", "interactive"],
  "name-rarity-score-explained": ["rarity score", "methodology", "statistics", "tools", "help"],
  "how-to-interpret-popularity-charts": ["charts", "popularity", "guide", "tools", "statistics"],
  "why-name-not-in-ssa-data": ["SSA data", "troubleshooting", "help", "methodology", "missing data"],
  "first-name-vs-surname-popularity": ["surnames", "first names", "comparison", "statistics", "methodology"],
  "how-many-people-have-my-name-questions": ["how many of me", "name rarity", "FAQ", "AI search", "voice search", "long-tail", "popularity", "guide"],
};

// Tool pages as content items
const toolItems: ContentItem[] = [
  {
    slug: "popularity-checker",
    title: "Name Popularity Checker",
    description: "Track how any name's popularity has changed decade by decade with detailed charts.",
    path: "/tools/popularity-checker",
    type: "tool",
    tags: ["popularity", "charts", "trends", "statistics", "baby names", "tools"],
  },
  {
    slug: "name-comparison",
    title: "Name Popularity Comparison Tool",
    description: "Compare two names side by side — popularity, trends, and regional differences.",
    path: "/tools/name-comparison",
    type: "tool",
    tags: ["comparison", "popularity", "trends", "statistics", "tools"],
  },
  {
    slug: "trend-visualizer",
    title: "Baby Name Trend Visualizer",
    description: "Visualize popularity trends for up to 4 names with interactive time-series charts.",
    path: "/tools/trend-visualizer",
    type: "tool",
    tags: ["trends", "charts", "visualization", "baby names", "tools", "interactive"],
  },
  {
    slug: "unique-name-generator",
    title: "Unique Baby Name Generator",
    description: "Discover rare and unique baby names with customizable filters for gender and popularity.",
    path: "/tools/unique-name-generator",
    type: "tool",
    tags: ["generator", "unique names", "rare names", "baby names", "tools"],
  },
  {
    slug: "random-name",
    title: "Random Name Generator",
    description: "Generate random names from our database with filters for gender and origin.",
    path: "/tools/random-name",
    type: "tool",
    tags: ["generator", "random", "baby names", "tools"],
  },
  {
    slug: "baby-names",
    title: "Baby Name Ideas",
    description: "Browse curated baby name suggestions filtered by letter and gender.",
    path: "/tools/baby-names",
    type: "tool",
    tags: ["baby names", "browse", "A-Z names", "gender", "tools"],
  },
  {
    slug: "username-generator",
    title: "Username Generator",
    description: "Create unique username ideas based on any name for social media and gaming.",
    path: "/tools/username-generator",
    type: "tool",
    tags: ["username", "generator", "social media", "tools"],
  },
  {
    slug: "meaning",
    title: "Name Meaning Lookup",
    description: "Discover the etymology, origin, and cultural significance of any name.",
    path: "/tools/meaning",
    type: "tool",
    tags: ["meanings", "etymology", "origins", "cultural", "tools"],
  },
  {
    slug: "popularity-guide",
    title: "How to Use the Popularity Checker",
    description: "Step-by-step guide to getting the most out of our name popularity tools.",
    path: "/tools/popularity-guide",
    type: "tool",
    tags: ["guide", "popularity", "help", "tools", "charts"],
  },
];

// Build the full registry
const articleItems: ContentItem[] = blogArticles.map(a => ({
  slug: a.slug,
  title: a.title,
  description: a.description,
  path: `/blog/${a.slug}`,
  type: "article" as const,
  tags: articleTagMap[a.slug] || [a.category, "baby names"],
  category: a.category,
  readTime: a.readTime,
}));

export const allContent: ContentItem[] = [...articleItems, ...toolItems];

/**
 * Get related content for a given page, scored by tag overlap.
 * Mixes both articles and tools for cross-linking.
 */
export function getRelatedContent(
  currentSlug: string,
  tags: string[],
  count = 12
): ContentItem[] {
  const tagsLower = tags.map(t => t.toLowerCase());

  const scored = allContent
    .filter(item => item.slug !== currentSlug)
    .map(item => {
      const itemTagsLower = item.tags.map(t => t.toLowerCase());
      let score = 0;
      for (const tag of tagsLower) {
        for (const itemTag of itemTagsLower) {
          if (itemTag === tag) score += 3;
          else if (itemTag.includes(tag) || tag.includes(itemTag)) score += 1;
        }
      }
      return { item, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // Ensure mix of both types if possible
  const results: ContentItem[] = [];
  const articles = scored.filter(s => s.item.type === "article");
  const tools = scored.filter(s => s.item.type === "tool");

  // Take at least 2-3 tools if available
  const minTools = Math.min(3, tools.length);
  const toolPicks = tools.slice(0, minTools).map(s => s.item);
  const articlePicks = articles.slice(0, count - minTools).map(s => s.item);

  results.push(...articlePicks, ...toolPicks);

  // Fill remaining from scored if needed
  if (results.length < count) {
    for (const s of scored) {
      if (results.length >= count) break;
      if (!results.find(r => r.slug === s.item.slug)) {
        results.push(s.item);
      }
    }
  }

  return results.slice(0, count);
}

/** Get tags for a blog article by slug */
export function getTagsForSlug(slug: string): string[] {
  return articleTagMap[slug] || ["baby names"];
}

/** Topic hubs for internal linking */
export const topicHubs = [
  { label: "Popular Names", tag: "popular names", path: "/tools/popularity-checker" },
  { label: "Rare & Unique Names", tag: "rare names", path: "/tools/unique-name-generator" },
  { label: "Name Trends", tag: "trends", path: "/tools/trend-visualizer" },
  { label: "Baby Name Ideas", tag: "baby names", path: "/tools/baby-names" },
  { label: "Name Meanings", tag: "meanings", path: "/tools/meaning" },
  { label: "Gender & Names", tag: "gender", path: "/blog/uncommon-girl-vs-boy-names" },
  { label: "Regional Data", tag: "regional", path: "/blog/most-uncommon-names-by-state" },
  { label: "Name History", tag: "history", path: "/blog/baby-names-by-decade" },
];
