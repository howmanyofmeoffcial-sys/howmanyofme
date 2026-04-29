// Dynamic content variator — keeps programmatic pages from looking templated.
// All variation is deterministic (seeded by name) so prerender = runtime.

function seedFromName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(arr: T[], seed: number, salt = 0): T {
  return arr[(seed + salt) % arr.length];
}

export type PopularityTier = "iconic" | "common" | "familiar" | "uncommon" | "rare";

export function tierFromRank(rank: number): PopularityTier {
  if (rank <= 50) return "iconic";
  if (rank <= 250) return "common";
  if (rank <= 1000) return "familiar";
  if (rank <= 5000) return "uncommon";
  return "rare";
}

interface IntroCtx {
  name: string;
  origin: string;
  meaning: string;
  rank: number;
  count: number;
  similarSample: string[]; // 3-5 names
  formatNumber: (n: number) => string;
}

// Returns 2 unique paragraphs, varied by name + tier so pages don't read identical.
export function buildSimilarIntro(ctx: IntroCtx): { lead: string; body: string; cta: string } {
  const { name, origin, meaning, rank, count, similarSample, formatNumber } = ctx;
  const seed = seedFromName(name);
  const tier = tierFromRank(rank);
  const sample = similarSample.slice(0, 4).join(", ") || "Avery, Riley, Jordan";
  const initial = name.charAt(0).toUpperCase();

  const leadOpeners = [
    `If you like ${name}, you'll likely connect with ${sample}.`,
    `${name} sits inside a small family of related names — ${sample} are the closest matches.`,
    `Searching for a name with the same feel as ${name}? ${sample} share its sound or shape.`,
    `${name} is one of several names with a similar rhythm; the nearest siblings are ${sample}.`,
  ];

  const tierLines: Record<PopularityTier, string[]> = {
    iconic: [
      `As a top-50 name, ${name} carries a long cultural footprint, so its neighbors often feel just as recognizable.`,
      `${name} is among the most-used names in our dataset — alternatives below tend to share that mainstream familiarity.`,
    ],
    common: [
      `${name} ranks comfortably inside the top 250, which means most look-alikes are also widely used today.`,
      `Because ${name} is solidly common (rank #${rank}), the matches below sit in the same well-known band.`,
    ],
    familiar: [
      `${name} is familiar without being overused (rank #${rank}), and its nearest matches share that balanced profile.`,
      `Most readers will recognize ${name}, but it's not crowding birth charts — the related names below feel similar.`,
    ],
    uncommon: [
      `${name} is uncommon (rank #${rank}), so the alternatives below skew toward distinctive but pronounceable picks.`,
      `Because ${name} is on the rarer side, expect related names with a similar quiet, less-used feel.`,
    ],
    rare: [
      `${name} is rare in our dataset, so the matches below are grouped by sound and shape rather than shared popularity.`,
      `Few people share ${name}, which makes its closest siblings interesting picks for parents seeking something distinctive.`,
    ],
  };

  const bodyTemplates = [
    `${pick(tierLines[tier], seed)} The list draws on three signals: names that begin with "${initial}", names of the same length (${name.length} letters), and names within a small phonetic edit distance of ${name}. Together those filters surface options that feel related without being copies.`,
    `${pick(tierLines[tier], seed, 1)} We assemble matches from names sharing the starting letter "${initial}", names with ${name.length} letters, and names that sound close to ${name} — covering visual, structural, and phonetic similarity.`,
    `${pick(tierLines[tier], seed)} Origin matters too: ${name} traces back to ${origin} roots with the meaning "${meaning}", and several alternatives below share an overlapping cultural background.`,
  ];

  const ctas = [
    `Open the full ${name} statistics page for bearer counts (~${formatNumber(count)}), decade-by-decade trends, and gender split.`,
    `Want hard numbers? The ${name} stats page shows rank movement, regional spread across the US and UK, and historical popularity.`,
    `For deeper data — global bearer estimate (~${formatNumber(count)}), US SSA rank, and decade trends — open the dedicated ${name} page.`,
  ];

  return {
    lead: pick(leadOpeners, seed),
    body: pick(bodyTemplates, seed, 2),
    cta: pick(ctas, seed, 3),
  };
}

// Dynamic FAQ generator — varies the *set* of questions per name (not just the answers).
export interface DynamicFaq {
  q: string;
  a: string;
}

export function buildSimilarFaqs(ctx: IntroCtx): DynamicFaq[] {
  const { name, origin, meaning, rank, count, similarSample, formatNumber } = ctx;
  const seed = seedFromName(name);
  const tier = tierFromRank(rank);
  const top = similarSample.slice(0, 6).join(", ") || "—";
  const initial = name.charAt(0).toUpperCase();

  const pool: DynamicFaq[] = [
    {
      q: `What names are similar to ${name}?`,
      a: `Names similar to ${name} include ${top}. They share the starting letter "${initial}", a comparable length, or a close phonetic match.`,
    },
    {
      q: `How many people are named ${name}?`,
      a: `Roughly ${formatNumber(count)} people are estimated to share the name ${name} worldwide, based on our combined US SSA, census, and international name datasets.`,
    },
    {
      q: `Is ${name} a rare name?`,
      a:
        tier === "iconic" || tier === "common"
          ? `${name} is widely used — it ranks around #${rank}, putting it among well-known first names.`
          : tier === "familiar"
          ? `${name} is recognized but not extremely common, ranking around #${rank} in our dataset.`
          : `${name} is on the rarer side, ranking near #${rank} with about ${formatNumber(count)} known bearers.`,
    },
    {
      q: `What does ${name} mean?`,
      a: `${name} is of ${origin} origin and traditionally means "${meaning}". Meanings can vary slightly across cultures and historical periods.`,
    },
    {
      q: `Are there shorter alternatives to ${name}?`,
      a: `Yes — try names with fewer letters than ${name}. Many parents looking for a shorter match prefer single-syllable or four-letter alternatives drawn from the list above.`,
    },
    {
      q: `Does ${name} work in the US?`,
      a: `${name} ${tier === "rare" || tier === "uncommon" ? "is uncommon in current US births but is fully usable" : "is well-established in US naming records"} according to Social Security Administration data.`,
    },
    {
      q: `Which names sound most like ${name}?`,
      a: `The closest-sounding matches use a small edit distance from ${name}. Top phonetic siblings: ${similarSample.slice(0, 4).join(", ") || "—"}.`,
    },
  ];

  // Pick 4 questions, varied by name seed — Q1 always present, then 3 rotated.
  const rotated = [pool[0], pool[(seed % 6) + 1], pool[((seed >> 2) % 6) + 1], pool[((seed >> 4) % 6) + 1]];
  // De-dupe by question text
  const seen = new Set<string>();
  return rotated.filter((f) => (seen.has(f.q) ? false : seen.add(f.q)));
}
