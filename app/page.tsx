import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NameSearchHero from "@/components/NameSearchHero";
import HomeBelowFold from "@/components/home/HomeBelowFold";
import { getPopularNames } from "@/data/nameData";

export const metadata: Metadata = {
  title: "How Many People Have My Name? Check Instantly 🌍",
  description:
    "How many people have your name? Check instantly using 100M+ global records. See rarity, popularity & origin in seconds. Free, no signup needed.",
  alternates: {
    canonical: "https://howmanyofme.co/",
  },
};

// All FAQ items for JSON-LD
const faqGroups = [
  {
    category: "Curiosity",
    items: [
      { q: "How many people have my exact name worldwide right now?", a: "Type your first name into the checker above to see a live estimate of global bearers, based on 100M+ records from 80+ countries. Most common English first names have between 500,000 and 10 million living bearers worldwide." },
      { q: "How many people share my first name in the United States?", a: "We combine U.S. Social Security Administration birth records (1880–present) with actuarial life tables to estimate how many living Americans share your first name. Results appear in under 1 second with no signup." },
      { q: "Am I the only person in the world with my name?", a: "For truly unique first-name + surname combinations, yes — our tool can flag a name as 'likely unique' (fewer than 5 estimated bearers). Enter your full name to check if you may be the only one." },
      { q: "Is it possible that no one else has my exact full name?", a: "Yes. Roughly 1 in 8 full-name combinations in the U.S. are estimated to be unique. Add your surname in the optional field to see whether your first + last name combination is one-of-a-kind." },
      { q: "How many babies were born with my name last year?", a: "Our popularity checker shows year-by-year birth counts back to 1880 and forward to the most recent release (typically prior year). You'll see exact annual figures for the U.S., UK, and major English-speaking countries." },
      { q: "Which country has the most people with my first name?", a: "After you search a name, the results page lists the top 10 countries by estimated living bearers, so you'll see instantly whether your name is most common in the US, India, Brazil, Nigeria, or elsewhere." },
    ],
  },
  {
    category: "Comparison",
    items: [
      { q: "Is my name rarer than the average American name?", a: "The average U.S. first name is held by about 45,000 living people. If your name has fewer bearers, it's rarer than average. Our tool shows a percentile rarity score so you can compare against the full U.S. population." },
      { q: "Is my name more common than Michael or Jennifer?", a: "Michael (~4.4M living U.S. bearers) and Jennifer (~1.5M) are benchmark 'very common' names. Search your name to see a side-by-side bearer count against these anchors." },
      { q: "How does my name rank among the top 1000 most popular names?", a: "If your name is in the top 1,000, we display its exact rank (e.g. #247) plus how that rank has changed decade by decade since 1880." },
      { q: "Is my name considered rare, uncommon, common, or very common?", a: "We label every name with a rarity tier: Very Common (top 100), Common (top 1,000), Uncommon (top 10,000), Rare (under 1 in 100,000 bearers), or Ultra-Rare (fewer than 100 bearers globally)." },
      { q: "How does the popularity of my name compare to my parents' generation?", a: "Our decade-by-decade popularity chart shows whether your name peaked in the 1950s, 1980s, or today — so you can see exactly how your name's popularity compares to when your parents were born." },
      { q: "Which is rarer — my first name or my last name?", a: "Enter both your first name and surname. The results page shows separate rarity scores and bearer estimates for each, so you can compare which one makes you more unique." },
    ],
  },
  {
    category: "Accuracy Doubt",
    items: [
      { q: "How accurate is the data behind your name popularity checker?", a: "For common names in well-documented countries (US, UK, Canada, Australia), our estimates are accurate within ±5%. For rarer names or countries with less comprehensive records, accuracy ranges from ±10% to ±25%. Each estimate includes a confidence score." },
      { q: "Where do you get your name data from and can I trust it?", a: "We aggregate data from official government sources: the U.S. SSA (350M+ records since 1880), UK ONS, Statistics Canada, Australian ABS, Eurostat, and peer-reviewed academic research. All sources are cited on our Methodology page." },
      { q: "Why do different name checker tools give different numbers?", a: "Different sites use different data sources, time periods, and methodologies. Some only count current-year births; we estimate total living bearers using actuarial survival modeling. Some use only U.S. data; we aggregate globally across 80+ countries." },
      { q: "How often do you update your name frequency database?", a: "We refresh our core dataset quarterly, incorporating newly released birth registration data. Most countries release annual name data with a 6–18 month lag, so our figures are typically current to within a year." },
      { q: "Can I really find out how many people have my name in 1 second?", a: "Yes. Results are pre-computed and served from an indexed database, so you'll see your name's bearer count, rarity score, and global distribution in well under 1 second — no signup, no waiting, no email required." },
      { q: "Is the result an exact number or an estimate?", a: "For U.S. first names, we use SSA-recorded counts plus survival modeling — these are point estimates with ±5% confidence. Global numbers are always estimates because not every country publishes full name data." },
    ],
  },
  {
    category: "Tool Usage",
    items: [
      { q: "What's the best free tool to check how many people share my name?", a: "HowManyOfMe.co is free, requires no signup, and covers 100M+ name records across 80+ countries — the most comprehensive free tool available. Type your name into the search bar above to try it now." },
      { q: "Do I have to sign up or enter my email to use this name checker?", a: "No. The tool is 100% free with zero signup, no email required, and no download. Just type your first name and get instant results." },
      { q: "Can I check how many people have my name without downloading an app?", a: "Yes — everything runs in your browser. No app, no install, no account. Works on phone, tablet, and desktop." },
      { q: "Is my name stored or tracked when I search?", a: "No. We do not store, log, or associate your name search with any personal identifier. Searches are anonymous and your privacy is protected." },
      { q: "Can I use this name checker on my phone?", a: "Yes — our tool is fully mobile-optimized. Search, see rarity scores, and browse the A–Z name directory on any device." },
      { q: "Are there voice-assistant friendly queries I can ask about my name?", a: "Yes. You can ask voice assistants things like 'how many people have my name' or 'is my name rare' and our pages are structured for AI answer engines and AI overviews." },
    ],
  },
  {
    category: "Personalization",
    items: [
      { q: "How many people have my full name including my surname?", a: "Add your last name in the optional field. We'll estimate how many people share your exact first + last name combination using linked birth and census records." },
      { q: "Can I check how many people share my name with a specific middle name?", a: "Middle name support is limited — most public records index first + last name. You can, however, check each name separately and multiply approximate frequencies for a rough middle-name combo estimate." },
      { q: "How many people have the same first and last name as me in my country?", a: "Our country filter lets you narrow a full-name search to a specific country (e.g. 'how many John Smiths live in the UK'), returning a country-specific bearer estimate." },
      { q: "How many people in my age group share my name?", a: "Our decade-by-decade breakdown shows how many people in each birth-year cohort were given your name, so you can see how many people your age share your name specifically." },
      { q: "Can I check how rare my name is for my gender?", a: "Yes. Every name page shows a gender split percentage (e.g. 97% female / 3% male) so you can see whether your name is rare for your specific gender." },
      { q: "How many people share my name and were born in the same decade as me?", a: "Enter your name and check the historical popularity chart — it shows the exact number of bearers born in the 1980s, 1990s, 2000s, 2010s, and 2020s, so you can isolate your own cohort." },
    ],
  },
];

const allFaqs = faqGroups.flatMap((g) => g.items);

const ctrVariations = [
  "How many people have my name instantly",
  "Check how many people share my name — free tool",
  "How many of me are there worldwide?",
  "Is my name rare or common? Find out in 1 second",
  "How many people have my exact full name?",
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HowManyOfMe",
    url: "https://howmanyofme.co",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://howmanyofme.co/name/{search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export default function HomePage() {
  const popularNames = getPopularNames().slice(0, 20);

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD — server-rendered in <head> equivalent */}
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <SiteHeader />
      <NameSearchHero />

      {/* CTR-optimized query variations */}
      <section
        aria-label="Popular ways people ask this question"
        className="border-b border-border bg-secondary/30"
      >
        <div className="container py-5">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
              People also ask:
            </span>
            {ctrVariations.map((v) => (
              <span
                key={v}
                className="px-3 py-1.5 rounded-full bg-card border border-border text-foreground/90 hover:border-primary/40 hover:text-primary transition-colors"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </section>

      <HomeBelowFold popularNames={popularNames} faqGroups={faqGroups} />
      <SiteFooter />
    </div>
  );
}
