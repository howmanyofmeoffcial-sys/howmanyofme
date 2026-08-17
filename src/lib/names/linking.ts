import { getNamesByLetter } from "./getAllNames";
import { getSimilarNames } from "./getSimilarNames";
import { getRelatedNames, type RelatedNameLink } from "./getRelatedNames";
import type { NameRecord } from "./getName";
import { getNameUrl, getLetterUrl, getToolUrl, getBlogUrl } from "../seo/canonicalUrl";

export interface AlphabetNeighbor {
  name: string;
  url: string;
}

export interface ContextualArticleLink {
  title: string;
  url: string;
  description: string;
}

export interface ContextualToolLink {
  name: string;
  url: string;
  description: string;
}

export interface NameLinkGraph {
  letterHub: {
    letter: string;
    url: string;
    label: string;
  };
  prevName: AlphabetNeighbor | null;
  nextName: AlphabetNeighbor | null;
  similarNames: Array<{ name: string; url: string }>;
  relatedByOrigin: Array<RelatedNameLink & { url: string }>;
  contextualTools: ContextualToolLink[];
  contextualArticles: ContextualArticleLink[];
}

/**
 * Generates the complete contextual internal link graph for an indexable name entity page.
 */
export function getNameLinkGraph(record: NameRecord): NameLinkGraph {
  const firstLetter = record.name.charAt(0).toLowerCase();
  const letterNames = getNamesByLetter(firstLetter);

  // Find index within the alphabetical letter group
  const currentIndex = letterNames.findIndex(
    (n) => n.name.toLowerCase() === record.name.toLowerCase()
  );

  let prevName: AlphabetNeighbor | null = null;
  let nextName: AlphabetNeighbor | null = null;

  if (currentIndex > 0) {
    const prev = letterNames[currentIndex - 1];
    prevName = { name: prev.name, url: getNameUrl(prev.name) };
  } else if (letterNames.length > 1) {
    const last = letterNames[letterNames.length - 1];
    prevName = { name: last.name, url: getNameUrl(last.name) };
  }

  if (currentIndex >= 0 && currentIndex < letterNames.length - 1) {
    const next = letterNames[currentIndex + 1];
    nextName = { name: next.name, url: getNameUrl(next.name) };
  } else if (letterNames.length > 1) {
    const first = letterNames[0];
    nextName = { name: first.name, url: getNameUrl(first.name) };
  }

  // Similar names
  const sim = getSimilarNames(record.name, 10);
  const similarNames = sim.combined.map((m) => ({
    name: m.name,
    url: getNameUrl(m.name),
  }));

  // Related names by origin
  const rel = getRelatedNames(record, 6);
  const relatedByOrigin = rel.map((r) => ({
    ...r,
    url: getNameUrl(r.name),
  }));

  // Contextual tools
  const contextualTools: ContextualToolLink[] = [
    {
      name: "Popularity Checker",
      url: getToolUrl("popularity-checker"),
      description: `Check how many people share ${record.name} worldwide`,
    },
    {
      name: `Compare ${record.name}`,
      url: getToolUrl("name-comparison"),
      description: `Compare ${record.name} side-by-side with another name`,
    },
    {
      name: "Trend Visualizer",
      url: getToolUrl("trend-visualizer"),
      description: `See ${record.name}'s popularity trend across decades`,
    },
  ];

  // Contextual articles
  const contextualArticles: ContextualArticleLink[] = [
    {
      title: "What Is a Name Rarity Score?",
      url: getBlogUrl("name-rarity-score-explained"),
      description: "Understand the statistical percentile behind name rarity scores.",
    },
    {
      title: "How to Interpret Name Popularity Charts",
      url: getBlogUrl("how-to-interpret-popularity-charts"),
      description: "Learn how decade-by-decade popularity curves are calculated.",
    },
    {
      title: "Baby Name Trends: Classic vs. Modern",
      url: getBlogUrl("baby-name-trends-classic-vs-modern"),
      description: "How names shift from generation to generation.",
    },
  ];

  return {
    letterHub: {
      letter: firstLetter.toUpperCase(),
      url: getLetterUrl(firstLetter),
      label: `Names starting with ${firstLetter.toUpperCase()}`,
    },
    prevName,
    nextName,
    similarNames,
    relatedByOrigin,
    contextualTools,
    contextualArticles,
  };
}
