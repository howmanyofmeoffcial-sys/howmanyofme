import { getName } from "../names";
import { buildNameEntityProfile, type NameEntityProfile } from "../names/entityProfile";

export interface NameComparisonPair {
  slug: string;
  nameA: string;
  nameB: string;
  category: "Modern Top Names" | "Historical Classics" | "Rising Trends";
}

export const COMPARISON_PAIRS: NameComparisonPair[] = [
  { slug: "liam-vs-noah", nameA: "Liam", nameB: "Noah", category: "Modern Top Names" },
  { slug: "emma-vs-olivia", nameA: "Emma", nameB: "Olivia", category: "Modern Top Names" },
  { slug: "james-vs-william", nameA: "James", nameB: "William", category: "Historical Classics" },
  { slug: "sophia-vs-isabella", nameA: "Sophia", nameB: "Isabella", category: "Modern Top Names" },
  { slug: "lucas-vs-oliver", nameA: "Lucas", nameB: "Oliver", category: "Modern Top Names" },
  { slug: "mia-vs-charlotte", nameA: "Mia", nameB: "Charlotte", category: "Modern Top Names" },
  { slug: "benjamin-vs-henry", nameA: "Benjamin", nameB: "Henry", category: "Rising Trends" },
  { slug: "grace-vs-harper", nameA: "Grace", nameB: "Harper", category: "Modern Top Names" },
  { slug: "elijah-vs-mateo", nameA: "Elijah", nameB: "Mateo", category: "Rising Trends" },
  { slug: "alexander-vs-daniel", nameA: "Alexander", nameB: "Daniel", category: "Historical Classics" },
  { slug: "michael-vs-david", nameA: "Michael", nameB: "David", category: "Historical Classics" },
  { slug: "mary-vs-patricia", nameA: "Mary", nameB: "Patricia", category: "Historical Classics" },
  { slug: "robert-vs-john", nameA: "Robert", nameB: "John", category: "Historical Classics" },
  { slug: "jennifer-vs-linda", nameA: "Jennifer", nameB: "Linda", category: "Historical Classics" },
  { slug: "ethan-vs-logan", nameA: "Ethan", nameB: "Logan", category: "Rising Trends" },
  { slug: "evelyn-vs-abigail", nameA: "Evelyn", nameB: "Abigail", category: "Rising Trends" },
  { slug: "jacob-vs-mason", nameA: "Jacob", nameB: "Mason", category: "Modern Top Names" },
  { slug: "ava-vs-ella", nameA: "Ava", nameB: "Ella", category: "Modern Top Names" },
  { slug: "jack-vs-leo", nameA: "Jack", nameB: "Leo", category: "Rising Trends" },
  { slug: "harper-vs-emily", nameA: "Harper", nameB: "Emily", category: "Modern Top Names" },
];

export interface ComparisonDetails {
  pair: NameComparisonPair;
  profileA: NameEntityProfile;
  profileB: NameEntityProfile;
}

export function getAllComparisonPairs(): NameComparisonPair[] {
  return COMPARISON_PAIRS;
}

export function getComparisonDetails(slug: string): ComparisonDetails | null {
  const cleanSlug = slug.toLowerCase().trim();
  const pair = COMPARISON_PAIRS.find((p) => p.slug === cleanSlug);
  if (!pair) return null;

  const recordA = getName(pair.nameA, false);
  const recordB = getName(pair.nameB, false);
  if (!recordA || !recordB) return null;

  const profileA = buildNameEntityProfile(recordA);
  const profileB = buildNameEntityProfile(recordB);

  return { pair, profileA, profileB };
}

export function getComparisonsForName(name: string): NameComparisonPair[] {
  const clean = name.toLowerCase().trim();
  return COMPARISON_PAIRS.filter(
    (p) => p.nameA.toLowerCase() === clean || p.nameB.toLowerCase() === clean
  );
}


