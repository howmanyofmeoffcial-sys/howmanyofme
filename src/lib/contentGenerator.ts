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
  
  // Internal Links Array
  const allInternalLinks = [
    { text: "check how common this name is", href: "/tools/popularity-checker" },
    { text: "see similar names", href: `/names/${name.charAt(0).toLowerCase()}` },
    { text: "compare this name", href: "/tools/name-comparison" },
    { text: "find unique names", href: "/tools/unique-name-generator" },
    { text: "explore name meanings", href: "/tools/meaning" }
  ];

  const link1 = allInternalLinks[hash % allInternalLinks.length];
  const link2 = allInternalLinks[(hash + 1) % allInternalLinks.length];

  // Data Interpretation Logic
  const isRare = count < 5000;
  const isCommon = count > 100000;
  const popularityText = isRare ? "rare and highly unique" : isCommon ? "extremely popular and widespread" : "moderately common";
  
  // 1. Intro Variations (Data-driven)
  const intros = [
    `If you've ever wondered how many people share the name **${name}**, our demographic analysis estimates there are approximately ${count.toLocaleString()} individuals worldwide. Being a ${popularityText} name, it ranks #${rank.toLocaleString()} globally. You can also [${link1.text}](${link1.href}).`,
    `Is **${name}** a rare name? Based on global birth registries, we estimate that ${count.toLocaleString()} people currently hold this name. This makes it a ${popularityText} choice globally. Want more insights? [${link1.text}](${link1.href}).`,
    `The name **${name}** has maintained a fascinating presence. Our statistical models indicate a global population of roughly ${count.toLocaleString()} people sharing this name today, placing it at rank #${rank.toLocaleString()}.`,
    `With roots tracing back to ${origin} origins, **${name}** is carried by an estimated ${count.toLocaleString()} people worldwide. It stands out as a ${popularityText} name. Let's dive into the data. You can also [${link1.text}](${link1.href}).`,
    `Ever met someone named **${name}**? Our analysis shows approximately ${count.toLocaleString()} people bear this name. Given that it is ${popularityText}, it ranks #${rank.toLocaleString()} worldwide. [${link1.text}](${link1.href}) for more context.`,
    `**${name}** is more than just a name — it carries ${origin} heritage and is shared by roughly ${count.toLocaleString()} individuals. Discover what makes this ${popularityText} name stand out below.`,
    `Looking into the frequency of **${name}**? Our global data engines have detected roughly ${count.toLocaleString()} occurrences. It's a ${popularityText} name with deep ${origin} roots.`,
    `From historical records to modern usage, **${name}** ranks #${rank.toLocaleString()} globally with about ${count.toLocaleString()} bearers. If you want to dive deeper, you can [${link1.text}](${link1.href}).`,
    `The statistical footprint of **${name}** shows an estimated ${count.toLocaleString()} people worldwide. It is considered a ${popularityText} name in our database.`,
    `What does the data say about **${name}**? With ${count.toLocaleString()} individuals globally, it ranks #${rank.toLocaleString()}. This makes it ${popularityText}. [${link1.text}](${link1.href}) to learn more.`
  ];
  
  // 2. Explanation Variations (Data-driven)
  const explanations = [];
  if (isRare) {
    explanations.push(`The rarity of ${name} makes it incredibly distinct. It frequently appears in specialized geographical pockets rather than widespread global trends. If you're curious, [${link2.text}](${link2.href}).`);
    explanations.push(`Because ${name} is relatively uncommon, people with this name often enjoy a strong sense of individuality. Its ${origin} roots contribute to its unique phonetic structure.`);
    explanations.push(`Finding someone named ${name} is quite rare. Our algorithms suggest its usage is highly localized, maintaining its distinct charm.`);
  } else if (isCommon) {
    explanations.push(`The name ${name} is a global staple. It heavily influences historical naming trends and crosses multiple cultural boundaries. If you're curious, [${link2.text}](${link2.href}).`);
    explanations.push(`Due to its widespread appeal, ${name} has consistently remained at the top of birth registries across various decades and countries.`);
    explanations.push(`With its massive footprint, ${name} represents a universal naming pattern that has adapted across many languages and regions.`);
  } else {
    explanations.push(`The name ${name} strikes a balance between familiarity and uniqueness. It has gained varying levels of popularity over the decades. If you're curious, [${link2.text}](${link2.href}).`);
    explanations.push(`Our data shows that ${name} is widely used in specific regions, pointing to deep cultural factors and generational traditions. Feel free to [${link2.text}](${link2.href}).`);
    explanations.push(`As a moderately popular name, ${name} avoids being overly saturated while still remaining highly recognizable globally.`);
  }

  if (!isExact) {
    explanations.push(`Because precise official registry data for ${name} is currently limited, our demographic model leverages phonetic similarity, cultural suffixes, and historical patterns to estimate its footprint. You might want to [${link2.text}](${link2.href}).`);
    explanations.push(`We utilized an advanced heuristic model to project the statistics for ${name}, analyzing linguistic roots and similar verified names to produce this highly accurate estimate.`);
  }

  // 3. Section Order Variation (10 permutations)
  const orders = [
    ['intro', 'stats', 'meaning', 'history', 'age', 'regional', 'faqs', 'similar'],
    ['intro', 'stats', 'regional', 'age', 'history', 'meaning', 'faqs', 'similar'],
    ['intro', 'meaning', 'regional', 'stats', 'faqs', 'age', 'history', 'similar'],
    ['intro', 'history', 'meaning', 'stats', 'age', 'regional', 'similar', 'faqs'],
    ['intro', 'regional', 'history', 'age', 'stats', 'meaning', 'faqs', 'similar'],
    ['intro', 'stats', 'age', 'meaning', 'history', 'regional', 'faqs', 'similar'],
    ['intro', 'meaning', 'stats', 'history', 'regional', 'age', 'similar', 'faqs'],
    ['intro', 'regional', 'stats', 'age', 'history', 'meaning', 'faqs', 'similar'],
    ['intro', 'history', 'stats', 'regional', 'meaning', 'age', 'faqs', 'similar'],
    ['intro', 'age', 'stats', 'meaning', 'regional', 'history', 'similar', 'faqs']
  ];

  // 4. FAQ Variation
  const allFaqs = [
    {
      question: `Is ${name} a rare name?`,
      answer: isRare ? `Yes, with an estimated ${count.toLocaleString()} bearers globally, it is considered quite rare and unique.` : `No, with approximately ${count.toLocaleString()} people, it is ${popularityText}.`
    },
    {
      question: `What is the origin of the name ${name}?`,
      answer: `Linguistic and cultural patterns strongly suggest that ${name} has deep ${origin} origins.`
    },
    {
      question: `How does ${name} rank globally?`,
      answer: `According to our data models, it ranks roughly #${rank.toLocaleString()} in worldwide popularity out of millions of recorded names.`
    },
    {
      question: `Is ${name} outdated?`,
      answer: `Naming trends are cyclical. While certain decades saw spikes in usage, ${name} continues to maintain its presence in modern naming conventions.`
    },
    {
      question: `How common is ${name} in the United States?`,
      answer: `In the United States alone, we estimate approximately ${Math.floor(count * 0.45).toLocaleString()} people are named ${name}, making it ${count * 0.45 > 50000 ? 'relatively common' : 'quite distinctive'} within the country.`
    },
    {
      question: `What does the name ${name} mean?`,
      answer: `The name ${name}, with ${origin} roots, has been associated with various cultural meanings throughout history. Its usage patterns suggest strong ties to ${origin.toLowerCase()} naming traditions.`
    },
    {
      question: `Has the popularity of ${name} changed over time?`,
      answer: `Yes, like most names, ${name} experiences fluctuations in popularity depending on generational trends and regional cultural shifts.`
    },
    {
      question: `Can ${name} be used for multiple genders?`,
      answer: `While traditionally associated with specific linguistic suffixes from its ${origin} origins, modern naming is increasingly flexible.`
    }
  ];

  // Deterministic selection
  const intro = intros[hash % intros.length];
  const explanation = explanations[hash % explanations.length];
  const sectionOrder = orders[hash % orders.length];
  
  // Pick 4 random but deterministic FAQs
  const faqSubset = [
    allFaqs[hash % allFaqs.length],
    allFaqs[(hash + 1) % allFaqs.length],
    allFaqs[(hash + 2) % allFaqs.length],
    allFaqs[(hash + 3) % allFaqs.length],
  ];
  // Deduplicate FAQs
  const faqs = Array.from(new Set(faqSubset.map(f => f.question)))
    .map(q => faqSubset.find(f => f.question === q)!);

  // Popular names linking
  const pop = getPopularNames();
  const startIdx = hash % Math.max(1, pop.length - 5);
  const popularLinks = pop.slice(startIdx, startIdx + 5).map(p => ({
    name: p.name,
    href: `/name/${p.name.toLowerCase()}`
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
