import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Users, Database, Globe, BarChart3, Zap, Layout, Search, Heart, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "About HowManyOfMe — How Many People Have My Name | Creator Story",
  description: "Learn about HowManyOfMe, the platform that answers 'how many of me are there?' Discover name popularity, how common is my name, and explore 100M+ names across 80+ countries.",
  alternates: { canonical: "https://howmanyofme.co/about" },
};

export default function AboutPage() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "AboutPage", name: "About HowManyOfMe", description: "Learn about the creator and mission behind HowManyOfMe.", url: "https://howmanyofme.co/about" },
    { "@context": "https://schema.org", "@type": "Person", name: "Ziven Borceg", url: "https://medium.com/@zivenborceg", jobTitle: "Creator of HowManyOfMe" },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://howmanyofme.co/" },
        { "@type": "ListItem", "position": 2, "name": "About", "item": "https://howmanyofme.co/about" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "HowManyOfMe",
      "url": "https://howmanyofme.co",
      "logo": "https://howmanyofme.co/og-image.webp",
      "description": "HowManyOfMe uses a multi-step process to estimate how many people share any given name worldwide."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {jsonLd.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <SiteHeader />
      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">About HowManyOfMe</h1>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">Ever wondered <Link href="/" className="text-foreground hover:text-primary transition-colors hover:underline">&quot;how many people have my name?&quot;</Link> or <Link href="/" className="text-foreground hover:text-primary transition-colors hover:underline">&quot;how common is my name?&quot;</Link> — you&apos;re in the right place. HowManyOfMe is the platform built to answer exactly that, using real data from over 100 million names across 80+ countries.</p>
        <div className="grid grid-cols-2 gap-4 mb-14">
          {[{ icon: Database, label: "100M+", desc: "Names in database" }, { icon: Globe, label: "80+", desc: "Countries covered" }, { icon: Users, label: "Millions", desc: "Monthly searches" }, { icon: BarChart3, label: "140+", desc: "Years of data" }].map(s => (
            <div key={s.label} className="p-5 rounded-xl border border-border bg-card text-center"><s.icon className="h-6 w-6 text-primary mx-auto mb-2" /><div className="text-2xl font-bold">{s.label}</div><div className="text-sm text-muted-foreground">{s.desc}</div></div>
          ))}
        </div>
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-4">Meet the Creator</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">I&apos;m <strong className="text-foreground">Ziven Borceg</strong> — a builder, tinkerer, and someone who genuinely enjoys making useful things on the internet.</p>
          <p className="text-muted-foreground leading-relaxed">I&apos;m not a big corporation or a faceless team. I&apos;m one person who believes the web needs more tools that are simple, fast, and actually helpful.</p>
        </section>
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-4">Connect With Me</h2>
          <a href="https://medium.com/@zivenborceg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">Follow me on Medium <ExternalLink className="h-4 w-4" /></a>
        </section>
        <section className="border-t border-border pt-8">
          <h2 className="font-display text-xl font-bold mb-4">Explore HowManyOfMe</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[{ label: "Name Popularity Checker", to: "/tools/popularity-checker" }, { label: "Baby Name Ideas", to: "/tools/baby-names" }, { label: "Blog & Guides", to: "/blog" }, { label: "Browse Names A–Z", to: "/names/a" }].map(link => (
              <Link key={link.to} href={link.to} className="text-sm text-primary hover:underline">{link.label} →</Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
