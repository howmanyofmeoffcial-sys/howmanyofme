import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { Users, Database, Globe, BarChart3, Zap, Layout, Search, Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="About HowManyOfMe — How Many People Have My Name | Creator Story"
      description="Learn about HowManyOfMe, the platform that answers 'how many of me are there?' Discover name popularity, how common is my name, and explore 100M+ names across 80+ countries."
      canonical="https://howmanyofme.co/about"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About HowManyOfMe",
          description: "Learn about the creator and mission behind HowManyOfMe, a name statistics platform covering 100M+ names.",
          url: "https://howmanyofme.co/about",
        },
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Ziven Borceg",
          url: "https://medium.com/@zivenborceg",
          sameAs: ["https://medium.com/@zivenborceg"],
          jobTitle: "Creator of HowManyOfMe",
        },
      ]}
    />
    <SiteHeader />
    <main className="container py-12 max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
        About HowManyOfMe
      </h1>
      <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
        Ever wondered "how many people have my name?" or "how common is my name?" — you're in the right place. HowManyOfMe is the platform built to answer exactly that, using real data from over 100 million names across 80+ countries.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-14">
        {[
          { icon: Database, label: "100M+", desc: "Names in database" },
          { icon: Globe, label: "80+", desc: "Countries covered" },
          { icon: Users, label: "Millions", desc: "Monthly searches" },
          { icon: BarChart3, label: "140+", desc: "Years of data" },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-xl border border-border bg-card text-center">
            <s.icon className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{s.label}</div>
            <div className="text-sm text-muted-foreground">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Section 1: About the Author */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-4">Meet the Creator</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          I'm <strong className="text-foreground">Ziven Borceg</strong> — a builder, tinkerer, and someone who genuinely enjoys making useful things on the internet. I've always been drawn to the intersection of data and everyday curiosity. The kind of questions you Google at 2 AM — "how many people are named Ziven?" or "is my name rare?" — those are the questions I love solving.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          I'm not a big corporation or a faceless team. I'm one person who believes the web needs more tools that are simple, fast, and actually helpful. HowManyOfMe is my attempt to build exactly that.
        </p>
      </section>

      {/* Section 2: Origin Story */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-4">How Did This Idea Come to Me?</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          It started with a simple question: "How many people share my name?" I searched online, and what I found was frustrating. One site gave me U.S.-only data. Another had outdated numbers from 2010. A third required me to sign up just to see basic info. None of them felt complete.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-3">
          I kept bouncing between five or six different websites just to piece together what should have been a single, straightforward answer. That wasted time kept nagging at me.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Then one evening, I thought: <em>"What if there was one place that just… had it all?"</em> A platform where you could type any name and instantly see how many people share it worldwide, its popularity trends over decades, where it's most common, what it means, and whether it's rising or fading — all without jumping between tabs.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          That's how HowManyOfMe was born. Not from a business plan or a boardroom meeting — from genuine frustration and a desire to build something better.
        </p>
      </section>

      {/* Section 3: What Makes It Unique */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-4">What Makes HowManyOfMe Different?</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          There are other name sites out there. But here's why people keep coming back to this one:
        </p>
        <div className="space-y-4">
          {[
            { icon: Layout, title: "Everything in one place", desc: "Name frequency, popularity trends, meanings, origins, gender data, regional distribution — all on a single page. No tab-hopping." },
            { icon: Zap, title: "Instant and lightweight", desc: "Results load in under a second. No sign-ups, no paywalls, no bloated interfaces. Just type a name and go." },
            { icon: Search, title: "Real data, real answers", desc: "Our statistics draw from official government records — the SSA, ONS, Stats Canada, ABS, Eurostat, and dozens more. Not guesswork." },
            { icon: Users, title: "Built for everyone", desc: "Whether you're a curious individual, an expecting parent, a writer choosing character names, or a researcher — this platform is designed to be useful to you." },
            { icon: Heart, title: "Made with care", desc: "Every feature was added because a real person needed it. There's no feature bloat. Every tool earns its place." },
          ].map(item => (
            <div key={item.title} className="flex gap-4 p-4 rounded-lg border border-border bg-card">
              <item.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-foreground text-sm mb-1">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Vision */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-4">Our Vision</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          The goal has always been simple: <strong className="text-foreground">make name data accessible to everyone.</strong> Not locked behind paywalls. Not scattered across unreliable sources. Not buried in academic databases.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-3">
          I want HowManyOfMe to be the first place people go when they wonder about a name — any name. Whether it's "how many of me are there in the world?" or "what's the rarest name in America?", the answer should be one search away.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This platform is continuously improving. New data sources get added, tools get refined, and the experience keeps getting faster. If you have ideas, I'm always listening.
        </p>
      </section>

      {/* Section 5: Our Data */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-4">Our Data</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          HowManyOfMe combines official government records from the world's most trusted statistical agencies. Our primary sources include:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1.5 mb-4 text-sm">
          <li>U.S. Social Security Administration (SSA)</li>
          <li>UK Office for National Statistics (ONS)</li>
          <li>Statistics Canada</li>
          <li>Australian Bureau of Statistics (ABS)</li>
          <li>Eurostat and national registries across 80+ countries</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          We apply demographic modeling techniques to estimate the number of living bearers of each name, accounting for birth rates, life expectancy, immigration patterns, and historical naming trends. For a deeper look at our process, visit our <Link to="/methodology" className="text-primary hover:underline">Methodology</Link> page.
        </p>
      </section>

      {/* Section 6: Connect */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-4">Connect With Me</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          I write about data, names, and building useful tools on the internet. Feel free to follow my journey or read my thoughts on Medium.
        </p>
        <a
          href="https://medium.com/@zivenborceg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          Follow me on Medium
          <ExternalLink className="h-4 w-4" />
        </a>
      </section>

      {/* Internal Links */}
      <section className="border-t border-border pt-8">
        <h2 className="font-display text-xl font-bold mb-4">Explore HowManyOfMe</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Name Popularity Checker", to: "/tools/popularity-checker" },
            { label: "Baby Name Ideas", to: "/tools/baby-names" },
            { label: "Name Comparison", to: "/tools/name-comparison" },
            { label: "Trend Visualizer", to: "/tools/trend-visualizer" },
            { label: "Blog & Guides", to: "/blog" },
            { label: "Browse Names A–Z", to: "/names/a" },
          ].map(link => (
            <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline">
              {link.label} →
            </Link>
          ))}
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default About;
