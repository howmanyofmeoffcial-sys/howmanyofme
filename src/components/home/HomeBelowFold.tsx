import Link from "next/link";
import {
  TrendingUp, Globe, Users, BarChart3, BookOpen, Sparkles,
  User, HelpCircle, Database, MapPin,
  Clock, Shield, Zap, FileText, ArrowRight, Heart, Search
} from "lucide-react";
import { ALPHABET, formatNumber } from "@/data/nameData";
import AdSlot from "@/components/AdSlot";
import FaqAccordion from "@/components/FaqAccordion";

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

interface PopularName { name: string; count: number; gender: string; }
interface FaqGroup { category: string; items: { q: string; a: string }[]; }
interface Props { popularNames: PopularName[]; faqGroups: FaqGroup[]; }

const HomeBelowFold = ({ popularNames, faqGroups }: Props) => {
  return (
    <main className="container">
        <section className="py-16">
          <div className="text-center mb-10">
            <h2 id="how-many-people-have-my-name" className="font-display text-3xl md:text-4xl font-bold mb-3">
              How Many People Have My Name?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              <strong>Short answer:</strong> Type your first name into the checker above — you&apos;ll get an instant estimate of global bearers, US count, rarity rank, and decade-by-decade popularity, drawn from 100M+ records across 80+ countries.
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
              Unlike simple baby name websites, our platform goes far beyond surface-level insights. We analyze name frequency across regions, track historical popularity decade by decade, break down gender distribution patterns, and estimate how many living individuals currently carry a specific name. Whether you&apos;re a parent choosing a baby name, a writer searching for character names, a genealogist tracing family history, or simply curious — this tool delivers answers in seconds.
            </p>
          </div>
        </section>

        <AdSlot />

        <section className="py-16">
          <div className="text-center mb-10">
            <h2 id="how-statistics-work" className="font-display text-3xl md:text-4xl font-bold mb-3">How Do Name Statistics Work?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">From raw government records to refined estimates — here&apos;s how we calculate name frequency.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { step: "01", icon: FileText, title: "Data Aggregation", desc: <span>We collect name registration data from official sources like the <a href="https://www.ssa.gov/oact/babynames/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">US Social Security Administration</a>, the <a href="https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/livebirths" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">UK Office for National Statistics</a>, and civil registration databases across 80+ countries.</span> },
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

        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center mb-4"><Globe className="h-5 w-5 text-accent" /></div>
              <h2 id="global-distribution" className="font-display text-2xl font-bold mb-3">Global Name Distribution</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">Name distribution reflects human history, migration, colonial influence, and cultural exchange. Some names are truly global — &quot;Maria&quot; appears in the top 100 in 40+ countries.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <span><strong className="text-foreground">Religious traditions</strong> spread names like John/Juan/Jean/Giovanni across continents</span></li>
                <li className="flex gap-2"><Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <span><strong className="text-foreground">Colonial history</strong> carried English, Spanish, and French names worldwide</span></li>
                <li className="flex gap-2"><Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <span><strong className="text-foreground">Pop culture</strong> drives modern surges — Arya (GoT), Elsa (Frozen)</span></li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><Users className="h-5 w-5 text-primary" /></div>
              <h2 id="shared-names" className="font-display text-2xl font-bold mb-3">Why People Share Names</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">Millions share the same first name due to powerful social, cultural, and practical forces that cluster naming choices.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><Zap className="h-4 w-4 text-accent shrink-0 mt-0.5" /> <span><strong className="text-foreground">Social conformity</strong> creates positive feedback loops in naming trends</span></li>
                <li className="flex gap-2"><Zap className="h-4 w-4 text-accent shrink-0 mt-0.5" /> <span><strong className="text-foreground">Religious traditions</strong> limit naming pools to culturally significant choices</span></li>
                <li className="flex gap-2"><Zap className="h-4 w-4 text-accent shrink-0 mt-0.5" /> <span><strong className="text-foreground">Practical constraints</strong> — top 1,000 names cover ~73% of US births</span></li>
              </ul>
            </div>
          </div>
        </section>

        <AdSlot />

        <section className="py-16">
          <div className="text-center mb-10">
            <h2 id="historical-popularity" className="font-display text-3xl md:text-4xl font-bold mb-3">Name Popularity Through the Decades</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Names rise and fall in cycles that reflect cultural, social, and political change.</p>
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
            <p className="text-sm text-muted-foreground leading-relaxed">The 21st century has brought entirely new patterns: gender-neutral names like Avery and Riley, vintage revivals like Eleanor and Theodore, and accelerated pop-culture influence. Names now rise and fall faster than ever in the social media age.</p>
          </div>
        </section>

        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-3">
              <h2 id="gender-distribution" className="font-display text-3xl md:text-4xl font-bold mb-4">Gender Distribution of Names</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Most names are strongly gendered, but the relationship is more complex than many realize. Our database tracks exact percentage splits for every name.</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"><ArrowRight className="h-4 w-4 text-primary shrink-0" /><span className="text-sm"><strong>Names cross one direction</strong> — male→female (Ashley, Lindsay, Madison)</span></div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"><ArrowRight className="h-4 w-4 text-primary shrink-0" /><span className="text-sm"><strong>Gender-neutral rising</strong> — Charlie, River, Rowan, Sage</span></div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"><ArrowRight className="h-4 w-4 text-primary shrink-0" /><span className="text-sm"><strong>Cultural shifts</strong> reflect broader attitudes toward gender fluidity</span></div>
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

        <section className="py-16">
          <div className="text-center mb-8">
            <h2 id="name-directory" className="font-display text-3xl md:text-4xl font-bold mb-3">Browse the A–Z Name Directory</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Millions of names organized alphabetically — click any letter to explore.</p>
          </div>
          <div className="grid grid-cols-7 sm:grid-cols-13 gap-2 max-w-2xl mx-auto">
            {ALPHABET.map(letter => (
              <Link key={letter} href={`/names/${letter}`} className="flex items-center justify-center h-11 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground font-display text-lg font-bold uppercase transition-colors">
                {letter}
              </Link>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="text-center mb-8">
            <h2 id="popular-names" className="font-display text-3xl md:text-4xl font-bold mb-3">Most Popular Names Worldwide</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Rankings based on estimated living bearers across 80+ countries.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularNames.map((n, i) => (
              <Link key={n.name} href={`/name/${n.name}`} className="flex items-center gap-3 p-3.5 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors group">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
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

        <section className="py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Tools
            </div>
            <h2 id="tools" className="font-display text-3xl md:text-4xl font-bold mb-3">Explore Name Tools</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Free, instant tools built on 100M+ name records — no signup required.</p>
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
              <Link key={tool.title} href={tool.link} className="group relative flex flex-col gap-3 p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-200">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <tool.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{tool.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{tool.desc}</p>
                <div className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-1">Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <HelpCircle className="h-3.5 w-3.5" /> 30 Real Questions
            </div>
            <h2 id="faq" className="font-display text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions About Your Name</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Real questions people ask AI assistants, Google, and voice search — answered in seconds.</p>
          </div>
          <FaqAccordion groups={faqGroups} />
        </section>

        <section className="py-10">
          <div className="max-w-4xl mx-auto p-6 md:p-8 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-start gap-3 mb-4">
              <Search className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold mb-1">People also search for</h2>
                <p className="text-sm text-muted-foreground">Conversational queries our tool answers — optimized for AI Overviews, ChatGPT, and voice search.</p>
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

        <section className="py-16">
          <h2 id="explore" className="font-display text-3xl md:text-4xl font-bold mb-6 text-center">Explore More Names</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
            {popularNames.slice(0, 12).map(n => (
              <Link key={n.name} href={`/name/${n.name}`} className="p-3 rounded-lg bg-secondary hover:bg-primary/10 text-center text-sm font-medium transition-colors">
                How many {n.name}s?
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {ALPHABET.map(l => (
              <Link key={l} href={`/names/${l}`} className="text-sm text-primary hover:underline">{l.toUpperCase()} Names</Link>
            ))}
          </div>
        </section>

        <AdSlot />

        <section className="py-16 pb-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 id="summary" className="font-display text-3xl md:text-4xl font-bold mb-4">Start Exploring Name Statistics</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">With 100M+ names, 80+ countries, and detailed statistical analysis powered by official government data, HowManyOfMe is the definitive resource for name frequency statistics.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              <Search className="h-4 w-4" /> Search a Name
            </Link>
          </div>
        </section>
    </main>
  );
};

export default HomeBelowFold;
