import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NameSearchHero from "@/components/NameSearchHero";
import AdSlot from "@/components/AdSlot";
import SEOHead from "@/components/SEOHead";
import { ALPHABET, getPopularNames, formatNumber } from "@/data/nameData";
import {
  TrendingUp, Globe, Users, BarChart3, BookOpen, Sparkles,
  Baby, Shuffle, User, HelpCircle, Database, MapPin,
  Clock, Shield, Zap, FileText, ChevronDown, ArrowRight, Heart, Search
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const popularNames = getPopularNames().slice(0, 20);

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HowManyOfMe",
    url: "https://howmanyofme.site",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://howmanyofme.site/name/{search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "How many people have my name?", acceptedAnswer: { "@type": "Answer", text: "Type your first name into our checker to see an instant estimate of how many people share it worldwide, based on 100M+ records from 80+ countries." } },
      { "@type": "Question", name: "Is my name rare or common?", acceptedAnswer: { "@type": "Answer", text: "Names ranked in the top 1,000 are considered common; under 1 in 100,000 bearers makes a name rare. Our tool labels rarity instantly." } },
      { "@type": "Question", name: "How many of me are there in the US?", acceptedAnswer: { "@type": "Answer", text: "We combine SSA birth data with actuarial life tables to estimate living US bearers of any first or last name." } },
      { "@type": "Question", name: "How accurate are your name frequency estimates?", acceptedAnswer: { "@type": "Answer", text: "Estimates are accurate within ±5% for common names in well-documented countries." } },
      { "@type": "Question", name: "How often is your data updated?", acceptedAnswer: { "@type": "Answer", text: "We refresh our core dataset quarterly with the latest birth registration releases." } },
      { "@type": "Question", name: "What countries do you cover?", acceptedAnswer: { "@type": "Answer", text: "We currently cover over 80 countries across North America, Europe, Asia, Latin America, Africa and Oceania." } },
      { "@type": "Question", name: "Do I need to sign up to check my name?", acceptedAnswer: { "@type": "Answer", text: "No. The tool is 100% free with no signup, no email and no download required." } },
    ],
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="How Many People Have My Name? Check Instantly — Free"
        description="How many people have your name? Check instantly across 100M+ global records from 80+ countries. See popularity, rarity & origin in 1 second. Free, no signup."
        canonical="https://howmanyofme.co/"
        jsonLd={jsonLd}
      />
      <SiteHeader />
      <NameSearchHero />

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

        {/* Section 18: FAQ Accordion */}
        <section className="py-16">
          <div className="text-center mb-8">
            <h2 id="faq" className="font-display text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-2">
              {[
                { q: "How accurate are your name frequency estimates?", a: "For common names in well-documented countries (US, UK, Canada, Australia), our estimates are typically accurate within ±5%. For rarer names or countries with less comprehensive data, accuracy ranges from ±10-25%. We always indicate the confidence level." },
                { q: "How often is your data updated?", a: "We update our core dataset quarterly, incorporating newly released birth registration data and demographic statistics. Most countries release annual name data with a 6-18 month lag." },
                { q: "Can I search for last names / surnames?", a: "Yes! While our most detailed statistics are for first names, we also support surname searches using census records and telephone directory analyses." },
                { q: "Why might the number differ from other websites?", a: "Different sites use different data sources, time periods, and methodologies. Some only count current-year births; we estimate total living bearers. Some use only US data; we aggregate globally." },
                { q: "How do you handle multiple spellings?", a: "Each spelling variant is counted separately. 'Catherine,' 'Katherine,' 'Kathryn,' are each tracked as distinct names. We provide links to common variants on each name's detail page." },
                { q: "What countries do you cover?", a: "We have data for over 80 countries, with the most comprehensive coverage for English-speaking countries, Western Europe, and major Asian nations. Coverage is continuously expanding." },
                { q: "Can I use this data for research?", a: "Personal and educational use is free. For commercial use or academic citations, please contact us for licensing options." },
                { q: "How do you estimate global counts?", a: "For countries with direct data, we use official records. For others, we use linguistic modeling, migration data, and proportional estimation based on cultural naming patterns." },
              ].map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
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
