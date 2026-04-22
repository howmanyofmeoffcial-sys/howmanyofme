import { getPopularNames, simpleHash } from "../data/nameData";

export function simpleContentHash(str: string): number {
  return simpleHash(str);
}

export type ContentVariation = {
  intro: string;
  explanation: string;
  sectionOrder: string[];
  faqs: { question: string; answer: string }[];
  internalLinks: { text: string; href: string }[];
  popularLinks: { name: string; href: string }[];
};

export function generateContentForName(name: string, count: number, origin: string, rank: number, isExact: boolean): ContentVariation {
  const hash = simpleContentHash(name);
  
  // Internal Links Array (to be injected)
  const allInternalLinks = [
    { text: "check how common this name is", href: "/tools/popularity-checker" },
    { text: "see similar names", href: `/names/${name.charAt(0).toLowerCase()}` },
    { text: "compare this name", href: "/tools/name-comparison" },
    { text: "find unique names", href: "/tools/unique-name-generator" }
  ];

  const link1 = allInternalLinks[hash % allInternalLinks.length];
  const link2 = allInternalLinks[(hash + 1) % allInternalLinks.length];

  // 1. Intro Variations
  const intros = [
    // Style A: Direct answer
    `If you've ever wondered how many people share the name **${name}**, our latest demographic analysis estimates there are approximately ${count.toLocaleString()} individuals worldwide. You can also [${link1.text}](${link1.href}).`,
    // Style B: Question-based
    `Is **${name}** a rare name? Based on global birth registries and census data, we estimate that ${count.toLocaleString()} people currently hold this name, making it rank #${rank.toLocaleString()} globally. Want more insights? [${link1.text}](${link1.href}).`,
    // Style C: Context-based
    `The name **${name}** has maintained a fascinating presence across different regions. Our statistical models indicate a global population of roughly ${count.toLocaleString()} people sharing this name today.`,
    // Style D: Cultural explanation
    `With roots tracing back to ${origin} origins, **${name}** is carried by an estimated ${count.toLocaleString()} people worldwide. Let's dive into the data behind this unique name. You can also [${link1.text}](${link1.href}).`
  ];
  
  // 2. Explanation / Sentence Variations
  const explanations = [
    `The name ${name} appears frequently in our models, heavily influenced by historical naming trends and regional cultural shifts. If you're curious, [${link2.text}](${link2.href}).`,
    `${name} has gained varying levels of popularity over the decades, reflecting a combination of traditional usage and modern naming patterns.`,
    `Our data shows that ${name} is widely used in specific regions, pointing to deep cultural factors and generational traditions. Feel free to [${link2.text}](${link2.href}).`
  ];

  if (!isExact) {
    explanations.push(`Because precise registry data for ${name} is limited, this model leverages phonetic similarity and cultural suffixes to estimate its footprint. You might want to [${link2.text}](${link2.href}).`);
  }

  // 3. Section Order Variation
  const orders = [
    ['intro', 'stats', 'history', 'regional', 'faqs', 'similar'],
    ['intro', 'stats', 'regional', 'history', 'faqs', 'similar'],
    ['intro', 'regional', 'stats', 'faqs', 'history', 'similar']
  ];

  // 4. FAQ Variation
  const allFaqs = [
    {
      question: `Is ${name} a rare name?`,
      answer: count < 50000 ? `Yes, with an estimated ${count.toLocaleString()} bearers globally, it is considered quite rare.` : `No, with approximately ${count.toLocaleString()} people, it is a relatively well-known name.`
    },
    {
      question: `What is the origin of the name ${name}?`,
      answer: `Linguistic and cultural patterns suggest that ${name} has ${origin} origins.`
    },
    {
      question: `How does ${name} rank globally?`,
      answer: `According to our models, it ranks roughly #${rank.toLocaleString()} in worldwide popularity.`
    },
    {
      question: `Is ${name} outdated?`,
      answer: `Naming trends are cyclical. While certain decades saw spikes in usage, ${name} continues to be used by modern parents.`
    }
  ];

  // Deterministic selection
  const intro = intros[hash % intros.length];
  const explanation = explanations[hash % explanations.length];
  const sectionOrder = orders[hash % orders.length];
  
  // Pick 3 random but deterministic FAQs
  const faqSubset = [
    allFaqs[hash % allFaqs.length],
    allFaqs[(hash + 1) % allFaqs.length],
    allFaqs[(hash + 2) % allFaqs.length],
  ];
  // Deduplicate FAQs
  const faqs = Array.from(new Set(faqSubset.map(f => f.question)))
    .map(q => faqSubset.find(f => f.question === q)!);

  // Popular names linking
  const pop = getPopularNames();
  const startIdx = hash % Math.max(1, pop.length - 5);
  const popularLinks = pop.slice(startIdx, startIdx + 5).map(p => ({
    name: p.name,
    href: `/name/${p.name}`
  }));

  return {
    intro,
    explanation,
    sectionOrder,
    faqs,
    internalLinks: allInternalLinks,
    popularLinks
  };
}
