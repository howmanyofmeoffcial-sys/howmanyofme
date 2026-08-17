/**
 * Canonical URL Resolver for HowManyOfMe.co
 * Single source of truth for generating internal canonical URLs across the application.
 */

import { normalizeName } from "../names/normalizeName.ts";

const SITE_URL = "https://howmanyofme.co";

/**
 * Returns the canonical URL path for a name entity page.
 * @example getNameUrl("James") => "/name/James"
 */
export function getNameUrl(name: string): string {
  const norm = normalizeName(name);
  return `/name/${encodeURIComponent(norm.slug)}`;
}

/**
 * Returns the full canonical absolute URL for a name entity page.
 * @example getNameAbsoluteUrl("James") => "https://howmanyofme.co/name/James"
 */
export function getNameAbsoluteUrl(name: string): string {
  return `${SITE_URL}${getNameUrl(name)}`;
}

/**
 * Returns the canonical URL path for an alphabet directory page.
 * @example getLetterUrl("a") => "/names/a"
 */
export function getLetterUrl(letter: string): string {
  const l = (letter || "a").trim().toLowerCase().charAt(0);
  return `/names/${l}`;
}

/**
 * Returns the canonical URL path for a similar names page.
 * @example getSimilarNamesUrl("James") => "/similar-names/james"
 */
export function getSimilarNamesUrl(name: string): string {
  const norm = normalizeName(name);
  return `/similar-names/${encodeURIComponent(norm.lowerSlug)}`;
}

/**
 * Returns the canonical URL path for a tool page.
 * @example getToolUrl("popularity-checker") => "/tools/popularity-checker"
 */
export function getToolUrl(toolSlug: string): string {
  const cleaned = toolSlug.replace(/^\/tools\//, "").replace(/^\//, "");
  return `/tools/${cleaned}`;
}

/**
 * Returns the canonical URL path for a blog post.
 * @example getBlogUrl("how-many-people-share-my-name") => "/blog/how-many-people-share-my-name"
 */
export function getBlogUrl(blogSlug: string): string {
  const cleaned = blogSlug.replace(/^\/blog\//, "").replace(/^\//, "");
  return `/blog/${cleaned}`;
}
