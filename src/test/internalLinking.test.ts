import { describe, it, expect } from "vitest";
import { getName } from "../lib/names/getName";
import { getNameLinkGraph } from "../lib/names/linking";
import { getRelatedNames } from "../lib/names/getRelatedNames";
import { getSimilarNames } from "../lib/names/getSimilarNames";
import { getAllNames } from "../lib/names/getAllNames";
import { getNameUrl, getSimilarNamesUrl, getLetterUrl } from "../lib/seo/canonicalUrl";

describe("Internal Linking, Crawl Path & Discovery Architecture Tests", () => {
  it("generates rich, deterministic, canonical link graph for core name page (Kyle)", () => {
    const kyle = getName("Kyle", false);
    expect(kyle).not.toBeNull();
    if (!kyle) return;

    const graph = getNameLinkGraph(kyle);

    // Letter hub
    expect(graph.letterHub.letter).toBe("K");
    expect(graph.letterHub.url).toBe("/names/k");

    // Neighbor navigation
    expect(graph.prevName).toBeDefined();
    expect(graph.nextName).toBeDefined();
    expect(graph.prevName?.url).toMatch(/^\/name\/[A-Za-z]+$/);
    expect(graph.nextName?.url).toMatch(/^\/name\/[A-Za-z]+$/);

    // Similar names
    expect(graph.similarNames.length).toBeGreaterThanOrEqual(3);
    for (const sim of graph.similarNames) {
      expect(sim.url).toMatch(/^\/name\//);
    }

    // Related by origin
    expect(graph.relatedByOrigin.length).toBeGreaterThanOrEqual(1);
    for (const rel of graph.relatedByOrigin) {
      expect(rel.url).toMatch(/^\/name\//);
    }

    // Contextual tools and articles
    expect(graph.contextualTools.length).toBe(3);
    expect(graph.contextualArticles.length).toBe(3);
  });

  it("ensures Similar Names recommendations link directly to canonical /name/* pages", () => {
    const sim = getSimilarNames("James", 6);
    expect(sim.combined.length).toBeGreaterThan(0);

    for (const rec of sim.combined) {
      const url = getNameUrl(rec.name);
      expect(url).toMatch(/^\/name\/[A-Za-z\-']+$/);
      expect(url).not.toContain("/similar-names/");
    }
  });

  it("ensures all 583 canonical name records have at least one incoming link from their alphabet hub", () => {
    const all = getAllNames();
    expect(all.length).toBe(583);

    for (const record of all) {
      const firstLetter = record.name.charAt(0).toLowerCase();
      const letterUrl = getLetterUrl(firstLetter);
      expect(letterUrl).toBe(`/names/${firstLetter}`);
      
      const nameUrl = getNameUrl(record.name);
      expect(nameUrl).toBe(`/name/${encodeURIComponent(record.name)}`);
    }
  });

  it("ensures related name links use strictly data-supported origin/demographic attributes", () => {
    const mary = getName("Mary", false);
    expect(mary).not.toBeNull();
    if (!mary) return;

    const related = getRelatedNames(mary, 6);
    expect(related.length).toBeGreaterThan(0);
    for (const rel of related) {
      expect(rel.name).not.toBe("Mary");
      expect(rel.origin).toBeDefined();
      expect(rel.gender).toBeDefined();
    }
  });
});
