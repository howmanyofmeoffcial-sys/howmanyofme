import { getAllNames } from "./getAllNames";
import type { NameRecord } from "./getName";

export interface RelatedNameLink {
  name: string;
  slug: string;
  count: number;
  origin: string;
  gender: string;
}

/**
 * Finds related names sharing the same origin or demographic profile.
 */
export function getRelatedNames(target: NameRecord, limit = 8): RelatedNameLink[] {
  const all = getAllNames();
  const lower = target.name.toLowerCase();

  // 1. Same origin matches first
  const sameOrigin = all.filter(
    (n) => n.name.toLowerCase() !== lower && n.origin === target.origin && n.gender === target.gender
  );

  // 2. Same origin, any gender
  const sameOriginAnyGender = all.filter(
    (n) => n.name.toLowerCase() !== lower && n.origin === target.origin && n.gender !== target.gender
  );

  // 3. Similar rank band
  const similarRank = all.filter(
    (n) => n.name.toLowerCase() !== lower && Math.abs(n.rank - target.rank) < 50
  );

  const seen = new Set<string>([lower]);
  const results: RelatedNameLink[] = [];

  const add = (list: NameRecord[]) => {
    for (const item of list) {
      const k = item.name.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        results.push({
          name: item.name,
          slug: item.slug,
          count: item.count,
          origin: item.origin,
          gender: item.gender,
        });
        if (results.length >= limit) return;
      }
    }
  };

  add(sameOrigin);
  add(sameOriginAnyGender);
  add(similarRank);

  return results;
}
