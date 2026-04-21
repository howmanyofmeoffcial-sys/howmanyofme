import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import NameSearchHero from "@/components/NameSearchHero";
import SEOHead from "@/components/SEOHead";
import { ALPHABET, getPopularNames, formatNumber } from "@/data/nameData";
import {
  TrendingUp, Globe, Users, BarChart3, BookOpen, Sparkles,
  Baby, Shuffle, User, HelpCircle, Database, MapPin,
  Clock, Shield, Zap, FileText, ChevronDown, ArrowRight, Heart, Search
} from "lucide-react";

// Heavy below-the-fold chunks: code-split out of the critical bundle.
// They only download/parse after the hero is painted.
const HomeBelowFold = lazy(() => import("@/components/home/HomeBelowFold"));
const SiteFooter = lazy(() => import("@/components/SiteFooter"));
const AdSlot = lazy(() => import("@/components/AdSlot"));

const popularNames = getPopularNames().slice(0, 20);

// 30 FAQ entries, grouped into 5 intent buckets.
// These power both the on-page accordion AND the FAQPage JSON-LD (AEO / AI Overviews).
const faqGroups: { category: string; items: { q: string; a: string }[] }[] = [
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

const allFaqs = faqGroups.flatMap(g => g.items);

// Long-tail, low-competition conversational keywords (5–8+ words, high intent, AEO-friendly).
const longTailKeywords = [
  "how many people have my exact name worldwide right now",
  "is my first name rarer than michael or jennifer",
  "check how many people share my full name for free",
  "how to find out if my name is unique in the world",
  "best free tool to check how many people have my name",
  "how many babies were born with my name last year in the us",
  "am i the only person with my first and last name combination",
  "how accurate is name popularity and rarity data online",
  "how many people share my name in the same age group",
  "how many people have my name instantly without signup",
];

// CTR-optimized query variations surfaced on the homepage for featured snippet capture.
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
    mainEntity: allFaqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="How Many People Have My Name? Check Instantly 🌍"
        description="How many people have your name? Check instantly using 100M+ global records. See rarity, popularity & origin in seconds. Free, no signup needed."
        canonical="https://howmanyofme.co/"
        jsonLd={jsonLd}
      />
      <SiteHeader />
      <NameSearchHero />

      {/* CTR-optimized query variations — surfaced directly under the hero for featured-snippet / AI Overview capture */}
      <section aria-label="Popular ways people ask this question" className="border-b border-border bg-secondary/30">
        <div className="container py-5">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
              People also ask:
            </span>
            {ctrVariations.map(v => (
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

      <main className="container">
        {/* Section 2: Query-based H2 — featured-snippet optimized */}
        <section className="py-16">
          <div className="text-center mb-10">
            <h2 id="how-many-people-have-my-name" className="font-display text-3xl md:text-4xl font-bold mb-3">
              How Many People Have My Name?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              <strong>Short answer:</strong> Type your first name into the checker above — you'll get an instant estimate of global bearers, US count, rarity rank, and decade-by-decade popularity, drawn from 100M+ records across 80+ countries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {[
              { icon: Database, title: "100M+ Names", desc: "Our dataset spans census records, civil registries, and demographic research from over 80 countries worldwide." },
              { icon: TrendingUp, title: "Decade-by-Decade Trends", desc: "Track how any name's popularity has shifted from the 1880s to the 2020s with detailed historical analysis." },
              { icon: Globe, title: "Global Coverage", desc: "See how names distribute across regions — from the US and UK to Europe, Asia, Latin America, and beyond." },
            ].map(card => (
              <div key={card.title} className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-xl bg-secondary/50 border border-border">
            <p className="text-muted-foreground leading-relaxed">
              Unlike simple baby name websites, our platform goes far beyond surface-level insights. We analyze name frequency across regions, track historical popularity decade by decade, break down gender distribution patterns, and estimate how many living individuals currently carry a specific name. Whether you're a parent choosing a baby name, a writer searching for character names, a genealogist tracing family history, or simply curious — this tool delivers answers in seconds.
            </p>
          </div>
        </section>

        <AdSlot />

        {/* Section 3: How Name Statistics Work — Info Steps */}
        <section className="py-16">
          <div className="text-center mb-10">
            <h2 id="how-statistics-work" className="font-display text-3xl md:text-4xl font-bold mb-3">
              How Do Name Statistics Work?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From raw government records to refined estimates — here's how we calculate name frequency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { step: "01", icon: FileText, title: "Data Aggregation", desc: "We collect name registration data from official sources — birth certificates, census returns, and civil registration databases across 80+ countries." },
              { step: "02", icon: Clock, title: "Survival Modeling", desc: "We apply actuarial life tables and cohort survival rates to estimate how many bearers from each birth year are still alive today." },
              { step: "03", icon: MapPin, title: "Migration Adjustment", desc: "International migration flow data adjusts country-specific estimates to account for people moving between countries." },
              { step: "04", icon: Shield, title: "Confidence Scoring", desc: "Each estimate gets a confidence score — typically ±5% for common names, and ±15-25% for rarer names with less data." },
            ].map(item => (
              <div key={item.step} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">{item.step}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 & 5: Global Distribution + Shared Names — Split Info */}
        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <Globe className="h-5 w-5 text-accent" />
              </div>
              <h2 id="global-distribution" className="font-display text-2xl font-bold mb-3">Global Name Distribution</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Name distribution reflects human history, migration, colonial influence, and cultural exchange. Some names are truly global — "Maria" appears in the top 100 in 40+ countries.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <span><strong className="text-foreground">Religious traditions</strong> spread names like John/Juan/Jean/Giovanni across continents</span></li>
                <li className="flex gap-2"><Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <span><strong className="text-foreground">Colonial history</strong> carried English, Spanish, and French names worldwide</span></li>
                <li className="flex gap-2"><Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <span><strong className="text-foreground">Pop culture</strong> drives modern surges — Arya (GoT), Elsa (Frozen)</span></li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h2 id="shared-names" className="font-display text-2xl font-bold mb-3">Why People Share Names</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Millions share the same first name due to powerful social, cultural, and practical forces that cluster naming choices.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><Zap className="h-4 w-4 text-accent shrink-0 mt-0.5" /> <span><strong className="text-foreground">Social conformity</strong> creates positive feedback loops in naming trends</span></li>
                <li className="flex gap-2"><Zap className="h-4 w-4 text-accent shrink-0 mt-0.5" /> <span><strong className="text-foreground">Religious traditions</strong> limit naming pools to culturally significant choices</span></li>
                <li className="flex gap-2"><Zap className="h-4 w-4 text-accent shrink-0 mt-0.5" /> <span><strong className="text-foreground">Practical constraints</strong> — top 1,000 names cover ~73% of US births</span></li>
              </ul>
            </div>
          </div>
        </section>

        <AdSlot />

        {/* Section 6: Historical Popularity — Visual Timeline */}
        <section className="py-16">
          <div className="text-center mb-10">
            <h2 id="historical-popularity" className="font-display text-3xl md:text-4xl font-bold mb-3">
              Name Popularity Through the Decades
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Names rise and fall in cycles that reflect cultural, social, and political change.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { decade: "1900s", highlight: "John, William, Mary, Helen", note: "Top 10 names covered 40% of births" },
              { decade: "1950s", highlight: "Linda, Susan, Michael, David", note: "Post-war baby boom era" },
              { decade: "1970s–80s", highlight: "Jennifer, Jessica, Jason, Brandon", note: "Peak of single-name dominance" },
              { decade: "2020s", highlight: "Liam, Olivia, Noah, Emma", note: "Top 10 cover only 8% — maximum diversity" },
            ].map(era => (
              <div key={era.decade} className="p-5 rounded-xl bg-secondary/50 border border-border">
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{era.decade}</div>
                <p className="text-sm font-semibold text-foreground mb-1">{era.highlight}</p>
                <p className="text-xs text-muted-foreground">{era.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-5 rounded-xl border border-border bg-card">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The 21st century has brought entirely new patterns: gender-neutral names like Avery and Riley, vintage revivals like Eleanor and Theodore, and accelerated pop-culture influence. Names now rise and fall faster than ever in the social media age.
            </p>
          </div>
        </section>

        {/* Section 7: Gender Distribution */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-3">
              <h2 id="gender-distribution" className="font-display text-3xl md:text-4xl font-bold mb-4">
                Gender Distribution of Names
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most names are strongly gendered, but the relationship is more complex than many realize. Our database tracks exact percentage splits for every name.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm"><strong>Names cross one direction</strong> — male→female (Ashley, Lindsay, Madison)</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm"><strong>Gender-neutral rising</strong> — Charlie, River, Rowan, Sage</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm"><strong>Cultural shifts</strong> reflect broader attitudes toward gender fluidity</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 p-6 rounded-xl border border-border bg-card text-center">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-3" />
              <div className="text-4xl font-bold mb-1">73%</div>
              <p className="text-sm text-muted-foreground">of US babies get a top-1000 name</p>
              <div className="h-px bg-border my-4" />
              <div className="text-4xl font-bold mb-1">4.3M</div>
              <p className="text-sm text-muted-foreground">distinct first names in the US alone</p>
            </div>
          </div>
        </section>

        <AdSlot />

        {/* Section 8: Country-Based Frequency */}
        <section className="py-16">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border">
            <div className="flex items-start gap-4 mb-4">
              <MapPin className="h-8 w-8 text-primary shrink-0 mt-1" />
              <div>
                <h2 id="country-frequency" className="font-display text-2xl md:text-3xl font-bold mb-2">Country-Based Name Frequency</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A name that's #1 in Sweden might not crack the top 1,000 in Japan. We provide country-specific data for 80+ nations.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="font-bold text-sm mb-1">🇩🇰 Denmark</h3>
                <p className="text-xs text-muted-foreground">~7,000 approved names. Parents need permission for unlisted choices.</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="font-bold text-sm mb-1">🇩🇪 Germany</h3>
                <p className="text-xs text-muted-foreground">Names must indicate gender (recent rulings have relaxed this).</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="font-bold text-sm mb-1">🇺🇸 United States</h3>
                <p className="text-xs text-muted-foreground">Virtually unlimited naming freedom — the most diverse name landscape.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Methodology Callout */}
        <section className="py-16">
          <h2 id="methodology" className="font-display text-3xl md:text-4xl font-bold mb-6 text-center">Our Methodology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: FileText, title: "SSA Records (1880–Present)", desc: "350M+ name records from US Social Security applications." },
              { icon: Globe, title: "UK ONS + European Data", desc: "Birth registration data from England, Wales, Scotland, and EU member states." },
              { icon: Database, title: "Census & Academic Sources", desc: "Canadian, Australian, and global census data plus peer-reviewed research." },
              { icon: Clock, title: "Quarterly Updates", desc: "Dataset refreshed every quarter with the latest vital statistics releases." },
            ].map(src => (
              <div key={src.title} className="flex gap-3 p-4 rounded-lg border border-border bg-card">
                <src.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm">{src.title}</h3>
                  <p className="text-xs text-muted-foreground">{src.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/methodology" className="text-sm text-primary hover:underline font-medium">
              Read full methodology →
            </Link>
          </div>
        </section>

        <AdSlot />

        {/* Section 10 & 11: A-Z Directory */}
        <section className="py-16">
          <div className="text-center mb-8">
            <h2 id="name-directory" className="font-display text-3xl md:text-4xl font-bold mb-3">Browse the A–Z Name Directory</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Millions of names organized alphabetically — click any letter to explore.
            </p>
          </div>
          <div className="grid grid-cols-7 sm:grid-cols-13 gap-2 max-w-2xl mx-auto">
            {ALPHABET.map(letter => (
              <Link
                key={letter}
                to={`/names/${letter}`}
                className="flex items-center justify-center h-11 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground font-display text-lg font-bold uppercase transition-colors"
              >
                {letter}
              </Link>
            ))}
          </div>
        </section>

        {/* Section 12: Most Popular Names */}
        <section className="py-16">
          <div className="text-center mb-8">
            <h2 id="popular-names" className="font-display text-3xl md:text-4xl font-bold mb-3">Most Popular Names Worldwide</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Rankings based on estimated living bearers across 80+ countries.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularNames.map((n, i) => (
              <Link
                key={n.name}
                to={`/name/${n.name}`}
                className="flex items-center gap-3 p-3.5 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors group"
              >
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{n.name}</div>
                  <div className="text-xs text-muted-foreground">~{formatNumber(n.count)}</div>
                </div>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground capitalize shrink-0">{n.gender}</span>
              </Link>
            ))}
          </div>
        </section>

        <AdSlot />

        {/* Section 13: Rare Names + Section 14: Trends — Side by Side */}
        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 id="rare-names" className="font-display text-2xl md:text-3xl font-bold mb-4">Rare & Unique Names</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="text-2xl font-bold text-primary mb-1">4.3M</div>
                  <p className="text-sm text-muted-foreground">distinct first names in the US alone — most held by fewer than 100 people</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <h3 className="font-bold text-sm mb-2">Categories of rare names</h3>
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li>• Creative coinages — invented by parents for uniqueness</li>
                    <li>• Cultural names — common within a specific community</li>
                    <li>• Archaic names — once popular, now nearly extinct (Mildred, Cornelius)</li>
                    <li>• Spelling variants — unusual spellings of common names</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 id="popularity-trends" className="font-display text-2xl md:text-3xl font-bold mb-4">What's Trending</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border-l-4 border-l-accent border border-border bg-card">
                  <h3 className="font-bold text-sm text-accent mb-1">↑ Rising</h3>
                  <p className="text-xs text-muted-foreground">Vintage revivals (Theodore, Eleanor), nature names (Willow, River), short punchy names (Max, Leo, Ivy)</p>
                </div>
                <div className="p-4 rounded-lg border-l-4 border-l-destructive border border-border bg-card">
                  <h3 className="font-bold text-sm text-destructive mb-1">↓ Declining</h3>
                  <p className="text-xs text-muted-foreground">1990s peaks (Jessica, Ashley, Brandon), nickname-as-formal-name (Bobby, Debbie, Tommy)</p>
                </div>
                <div className="p-4 rounded-lg border-l-4 border-l-primary border border-border bg-card">
                  <h3 className="font-bold text-sm text-primary mb-1">→ Emerging</h3>
                  <p className="text-xs text-muted-foreground">Gender-neutral names, non-Western names in Western countries, sustainability-themed names</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 15 & 16: Algorithm + Data Sources */}
        <section className="py-16">
          <h2 id="algorithm" className="font-display text-3xl md:text-4xl font-bold mb-8 text-center">How We Calculate Name Counts</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { num: "Stage 1", title: "Aggregate", desc: "Collect year-by-year registration data across 80+ countries, going back 140+ years." },
              { num: "Stage 2", title: "Survive", desc: "Apply actuarial survival curves with country-specific and gender-specific life tables." },
              { num: "Stage 3", title: "Adjust", desc: "Factor in international migration flows using UN and national immigration statistics." },
              { num: "Stage 4", title: "Score", desc: "Assign confidence intervals based on data quality — ±5% (common) to ±25% (rare)." },
            ].map(s => (
              <div key={s.num} className="p-5 rounded-xl bg-secondary/50 border border-border text-center">
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{s.num}</div>
                <h3 className="font-bold mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <div id="data-sources" className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-bold text-lg mb-4">Our Data Sources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {[
                "U.S. Social Security Administration (SSA) — 350M+ records since 1880",
                "UK Office for National Statistics (ONS) — England, Wales, Scotland",
                "Statistics Canada — Provincial vital statistics",
                "Australian Bureau of Statistics (ABS) — All states & territories",
                "Eurostat & EU statistical agencies — Pan-European coverage",
                "United Nations demographic databases — Global population data",
                "WHO life tables — Actuarial data for survival modeling",
                "Academic research publications — Peer-reviewed onomastic studies",
              ].map(src => (
                <div key={src} className="flex gap-2 py-1.5 text-muted-foreground">
                  <span className="text-primary">•</span>
                  <span>{src}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AdSlot />

        {/* Section 17: Tools — Modern card grid */}
        <section className="py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Tools
            </div>
            <h2 id="tools" className="font-display text-3xl md:text-4xl font-bold mb-3">Explore Name Tools</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Free, instant tools built on 100M+ name records — no signup required.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: TrendingUp, title: "Name Popularity Checker", desc: "See how many people share your name worldwide.", link: "/tools/popularity-checker" },
              { icon: Sparkles, title: "Name Rarity Score", desc: "Find out if your name is rare or common.", link: "/tools/unique-name-generator" },
              { icon: Globe, title: "Global Name Search", desc: "Explore name popularity by country.", link: "/" },
              { icon: MapPin, title: "Name Distribution Map", desc: "Visualize where your name is most common.", link: "/tools/trend-visualizer" },
              { icon: User, title: "Gender Prediction", desc: "Discover common gender usage of your name.", link: "/tools/meaning" },
              { icon: Users, title: "Surname Analyzer", desc: "Explore origin and history of surnames.", link: "/tools/name-comparison" },
              { icon: BookOpen, title: "Name Meaning & Origin", desc: "Learn meaning and cultural background.", link: "/tools/meaning" },
              { icon: Zap, title: "Trending Names", desc: "See names gaining popularity right now.", link: "/tools/trend-visualizer" },
              { icon: Clock, title: "Top Names by Year", desc: "Explore names by decade trends.", link: "/tools/popularity-checker" },
            ].map(tool => (
              <Link
                key={tool.title}
                to={tool.link}
                className="group relative flex flex-col gap-3 p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <tool.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{tool.desc}</p>
                <div className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-1">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 18: FAQ — 30 questions grouped by intent (AEO / AI Overviews optimized) */}
        <section className="py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <HelpCircle className="h-3.5 w-3.5" /> 30 Real Questions
            </div>
            <h2 id="faq" className="font-display text-3xl md:text-4xl font-bold mb-3">
              Frequently Asked Questions About Your Name
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real questions people ask AI assistants, Google, and voice search — answered in seconds.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-10">
            {faqGroups.map((group, gi) => (
              <div key={group.category}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    {String(gi + 1).padStart(2, "0")} · {group.category}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">{group.items.length} questions</span>
                </div>
                <Accordion type="single" collapsible className="space-y-2">
                  {group.items.map((faq, i) => (
                    <AccordionItem
                      key={`${group.category}-${i}`}
                      value={`faq-${group.category}-${i}`}
                      className="border border-border rounded-lg px-4 bg-card"
                    >
                      <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Section 18b: Long-tail conversational keywords — AEO / GEO anchor block */}
        <section className="py-10">
          <div className="max-w-4xl mx-auto p-6 md:p-8 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-start gap-3 mb-4">
              <Search className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold mb-1">
                  People also search for
                </h2>
                <p className="text-sm text-muted-foreground">
                  Conversational queries our tool answers — optimized for AI Overviews, ChatGPT, and voice search.
                </p>
              </div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {longTailKeywords.map(k => (
                <li key={k} className="flex gap-2 text-muted-foreground">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{k}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 19: Internal Links */}
        <section className="py-16">
          <h2 id="explore" className="font-display text-3xl md:text-4xl font-bold mb-6 text-center">Explore More Names</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
            {popularNames.slice(0, 12).map(n => (
              <Link key={n.name} to={`/name/${n.name}`} className="p-3 rounded-lg bg-secondary hover:bg-primary/10 text-center text-sm font-medium transition-colors">
                How many {n.name}s?
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {ALPHABET.map(l => (
              <Link key={l} to={`/names/${l}`} className="text-sm text-primary hover:underline">
                {l.toUpperCase()} Names
              </Link>
            ))}
          </div>
        </section>

        <AdSlot />

        {/* Section 20: Summary */}
        <section className="py-16 pb-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 id="summary" className="font-display text-3xl md:text-4xl font-bold mb-4">Start Exploring Name Statistics</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With 100M+ names, 80+ countries, and detailed statistical analysis powered by official government data, HowManyOfMe is the definitive resource for name frequency statistics.
            </p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              <Search className="h-4 w-4" />
              Search a Name
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Index;
