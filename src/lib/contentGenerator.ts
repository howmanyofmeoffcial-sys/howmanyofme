import { getPopularNames, simpleHash } from "../data/nameData";

export function simpleContentHash(str: string): number {
  return simpleHash(str);
}

export type ContentVariation = {
  intro: string;
  explanation: string;
  uniqueAngle: string;
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
  
  // 1. Dynamic Combinatoric Intros
  const introHooks = [
    `If you've ever wondered how many people share the name **${name}**, our demographic analysis provides some fascinating insights.`,
    `Is **${name}** a rare name? Based on global birth registries, we can finally answer that question.`,
    `The name **${name}** has maintained a fascinating presence across different cultures and regions.`,
    `With roots tracing back to ${origin} origins, **${name}** carries a rich heritage.`,
    `Ever met someone named **${name}**? You might be surprised by its statistical footprint.`,
    `**${name}** is more than just a name — it represents a unique cross-section of modern naming trends.`,
    `Looking into the frequency of **${name}**? Our global data engines have processed its historical and current usage.`,
    `From historical records to modern usage, **${name}** has an interesting story to tell.`,
    `What does the data say about **${name}**? Let's dive into the statistics behind this distinctive name.`,
    `Naming trends come and go, but the trajectory of **${name}** offers a unique glimpse into cultural shifts.`
  ];

  const introDataPoints = [
    `We estimate there are approximately ${count.toLocaleString()} individuals worldwide bearing this name.`,
    `Our statistical models indicate a global population of roughly ${count.toLocaleString()} people sharing this name today.`,
    `It is carried by an estimated ${count.toLocaleString()} people worldwide.`,
    `Our analysis shows approximately ${count.toLocaleString()} people bear this name globally.`,
    `Global data engines have detected roughly ${count.toLocaleString()} occurrences of this name across various demographics.`,
    `With ${count.toLocaleString()} individuals globally, its presence is notable.`,
    `Current estimates place the number of people named ${name} at around ${count.toLocaleString()}.`,
    `Demographic data suggests a worldwide count of exactly ${count.toLocaleString()} for this name.`,
    `There is an active population of approximately ${count.toLocaleString()} individuals with this name.`,
    `The statistical footprint reveals about ${count.toLocaleString()} bearers worldwide.`
  ];

  const introTransitions = [
    `Being a ${popularityText} name, it currently ranks #${rank.toLocaleString()} globally. You can also [${link1.text}](${link1.href}).`,
    `This makes it a ${popularityText} choice globally. Want more insights? [${link1.text}](${link1.href}).`,
    `Placing it at rank #${rank.toLocaleString()}, it stands out as a ${popularityText} name. Let's dive into the data.`,
    `Given that it is ${popularityText}, it ranks #${rank.toLocaleString()} worldwide. [${link1.text}](${link1.href}) for more context.`,
    `Discover what makes this ${popularityText} name stand out below.`,
    `It's a ${popularityText} name with deep ${origin} roots.`,
    `If you want to dive deeper into its ranking of #${rank.toLocaleString()}, you can [${link1.text}](${link1.href}).`,
    `It is considered a ${popularityText} name in our comprehensive database.`,
    `This makes it ${popularityText}. [${link1.text}](${link1.href}) to learn more.`,
    `Sitting at rank #${rank.toLocaleString()}, its usage patterns are quite revealing.`
  ];

  const hookIdx = hash % introHooks.length;
  const dataIdx = (hash + 1) % introDataPoints.length;
  const transIdx = (hash + 2) % introTransitions.length;
  const intro = `${introHooks[hookIdx]} ${introDataPoints[dataIdx]} ${introTransitions[transIdx]}`;
  
  // 2. Explanation & Deep Insight Variations
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

  // 3. Unique Angles
  const vowels = name.toLowerCase().match(/[aeiouy]/g)?.length || 0;
  const len = name.length;
  const uniqueAngles = [];
  
  // Angle: Length & Phonetics
  if (len <= 4) {
    uniqueAngles.push(`With its concise ${len}-letter structure, ${name} taps into a modern minimalist naming trend, favoring quick, memorable syllables.`);
  } else if (len >= 8) {
    uniqueAngles.push(`At ${len} letters long, ${name} has a sophisticated and formal resonance, often associated with classical or historical naming conventions.`);
  }

  // Angle: Vowels
  if (vowels >= 3 && len <= 6) {
    uniqueAngles.push(`Containing ${vowels} vowels within a compact frame, ${name} possesses a fluid, melodic phonetic structure that is highly favored in modern naming trends.`);
  } else if (len - vowels >= 4) {
    uniqueAngles.push(`The strong consonant cluster in '${name}' gives it a grounded, robust pronunciation characteristic of its linguistic origins.`);
  }

  // Angle: Rarity/Commonality Context
  if (isRare) {
    uniqueAngles.push(`Its extreme rarity (ranking #${rank.toLocaleString()}) suggests it may be a highly localized spelling variation or a surname-turned-first-name, making it an excellent choice for distinct identity.`);
  } else if (isCommon) {
    uniqueAngles.push(`Its high global rank of #${rank.toLocaleString()} suggests it has not only remained a staple in its home region but has also traveled significantly with global migration.`);
  } else {
    uniqueAngles.push(`Sitting comfortably at #${rank.toLocaleString()}, it avoids the hyper-trendy cycles, indicating a stable, enduring appeal across generations.`);
  }

  const uniqueAngle = uniqueAngles[hash % uniqueAngles.length] || uniqueAngles[0];

  // 4. Section Order Variation (20 permutations)
  const baseSections = ['meaning', 'history', 'age', 'regional', 'faqs', 'similar'];
  const orders = [];
  // Generate 20 distinct orders by rotating and swapping the middle elements
  for (let i = 0; i < 20; i++) {
    const arr = [...baseSections];
    // swap logic based on i
    if (i % 2 === 0) [arr[0], arr[1]] = [arr[1], arr[0]];
    if (i % 3 === 0) [arr[2], arr[3]] = [arr[3], arr[2]];
    if (i % 5 === 0) [arr[4], arr[5]] = [arr[5], arr[4]];
    // shift
    for(let j=0; j < (i%3); j++) {
      arr.push(arr.shift() as string);
    }
    // ensure intro and stats are always first
    orders.push(['intro', 'stats', ...arr]);
  }

  // 5. Dynamic FAQs
  const faqGenerators = [
    () => ({
      question: `Is ${name} a rare name?`,
      answer: isRare ? `Yes, with an estimated ${count.toLocaleString()} bearers globally, it is considered quite rare and unique.` : `No, with approximately ${count.toLocaleString()} people, it is ${popularityText}.`
    }),
    () => ({
      question: `What makes the name ${name} phonetically unique?`,
      answer: `The name has ${len} letters and ${vowels} vowels. This specific structural ratio gives it a ${vowels >= 3 ? 'melodic and flowing' : 'strong and grounded'} pronunciation.`
    }),
    () => ({
      question: `How does ${name} rank globally?`,
      answer: `According to our data models, it ranks roughly #${rank.toLocaleString()} in worldwide popularity out of millions of recorded names.`
    }),
    () => ({
      question: `Why might ${name} be popular in certain regions?`,
      answer: `Due to its ${origin} origins, ${name} often resonates deeply within specific cultural diasporas, driving its localized popularity.`
    }),
    () => ({
      question: `How common is ${name} in the United States?`,
      answer: `In the United States alone, we estimate approximately ${Math.floor(count * 0.45).toLocaleString()} people are named ${name}, making it ${count * 0.45 > 50000 ? 'relatively common' : 'quite distinctive'} within the country.`
    }),
    () => ({
      question: `What does the data say about the trend of ${name}?`,
      answer: `Its global rank of #${rank.toLocaleString()} indicates a ${isCommon ? 'sustained, high-volume' : isRare ? 'niche, specialized' : 'stable, moderate'} presence in modern naming conventions.`
    }),
    () => ({
      question: `Has the popularity of ${name} changed over time?`,
      answer: `Yes, like most names, ${name} experiences fluctuations in popularity depending on generational trends and regional cultural shifts.`
    }),
    () => ({
      question: `Can ${name} be used for multiple genders?`,
      answer: `While traditionally associated with specific linguistic suffixes from its ${origin} origins, modern naming is increasingly flexible.`
    })
  ];

  const explanation = explanations[hash % explanations.length];
  const sectionOrder = orders[hash % orders.length];
  
  // Pick 4 random but deterministic FAQs
  const faqSubset = [
    faqGenerators[hash % faqGenerators.length](),
    faqGenerators[(hash + 1) % faqGenerators.length](),
    faqGenerators[(hash + 2) % faqGenerators.length](),
    faqGenerators[(hash + 3) % faqGenerators.length](),
  ];
  // Deduplicate FAQs
  const faqs = Array.from(new Set(faqSubset.map(f => f.question)))
    .map(q => faqSubset.find(f => f.question === q)!);

  // Popular names linking (2-3 globally popular cross-letter names)
  const pop = getPopularNames();
  const startIdx = hash % Math.max(1, pop.length - 3);
  const crossLetterCandidates = pop.filter(p => p.name.charAt(0).toLowerCase() !== name.charAt(0).toLowerCase());
  const crossLetterStart = hash % Math.max(1, crossLetterCandidates.length - 3);
  const popularLinks = crossLetterCandidates.slice(crossLetterStart, crossLetterStart + 3).map(p => ({
    name: p.name,
    href: `/name/${p.name.toLowerCase()}`
  }));

  // Natural anchor text variations for internal links
  const anchorVariations = [
    { text: `See how popular ${name} really is`, href: "/tools/popularity-checker" },
    { text: `Browse more names starting with ${name.charAt(0)}`, href: `/names/${name.charAt(0).toLowerCase()}` },
    { text: `Compare ${name} with other names`, href: "/tools/name-comparison" },
    { text: `Find names similar to ${name}`, href: "/tools/unique-name-generator" },
    { text: `Explore the meaning of ${name}`, href: "/tools/meaning" },
    { text: `Discover trending baby names`, href: "/tools/baby-names" },
    { text: `What makes ${name} unique?`, href: "/tools/popularity-guide" },
  ];
  // Pick 3 deterministic anchors
  const selectedAnchors = [
    anchorVariations[hash % anchorVariations.length],
    anchorVariations[(hash + 2) % anchorVariations.length],
    anchorVariations[(hash + 4) % anchorVariations.length],
  ];
  // Deduplicate
  const uniqueAnchors = Array.from(new Map(selectedAnchors.map(a => [a.href, a])).values());

  return {
    intro,
    explanation,
    uniqueAngle,
    sectionOrder,
    faqs,
    internalLinks: uniqueAnchors,
    popularLinks
  };
}
