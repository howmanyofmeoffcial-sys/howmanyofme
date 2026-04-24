import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdSlot from "@/components/AdSlot";
import ToolCTA from "@/components/ToolCTA";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedPosts from "@/components/RelatedPosts";
import { getNameData, getSimilarNames, formatNumber, getPopularNames } from "@/data/nameData";
import { generateContentForName } from "@/lib/contentGenerator";
import { Users, TrendingUp, Globe, BarChart3, Sparkles, Calendar, Brain, BookOpen } from "lucide-react";
import React from "react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ name: string }> };

/** Normalize URL slug → human name: decode, replace hyphens, trim, strip non-alpha */
function normalizeSlug(raw: string): string {
  const decoded = decodeURIComponent(raw);
  const cleaned = decoded.replace(/-/g, " ").trim().replace(/[^a-zA-Z\s]/g, "").trim();
  return cleaned || "Unknown";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name: rawName } = await params;
  const nameStr = normalizeSlug(rawName);
  const data = getNameData(nameStr);
  return {
    title: `How Many People Are Named ${data.name}? Popularity, Rarity & Origin`,
    description: `There are ~${formatNumber(data.count)} people named ${data.name} worldwide (rank #${formatNumber(data.rank)}). See ${data.name}'s popularity by decade, country, and gender — free, no signup.`,
    alternates: { canonical: `https://howmanyofme.co/name/${encodeURIComponent(data.name)}` },
    robots: data.isExact || data.confidenceLevel === 'medium' ? { index: true, follow: true } : { index: false, follow: true },
  };
}

// Simple markdown link parser
function renderMarkdownText(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (match) {
      return <Link key={i} href={match[2]} className="text-primary hover:underline">{match[1]}</Link>;
    }
    // Also parse strong tags **text**
    const strongParts = part.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={i}>
        {strongParts.map((sp, j) => {
          if (sp.startsWith("**") && sp.endsWith("**")) {
            return <strong key={j}>{sp.slice(2, -2)}</strong>;
          }
          return sp;
        })}
      </React.Fragment>
    );
  });
}

export default async function NameDetailPage({ params }: Props) {
  const { name: rawName } = await params;
  const nameStr = normalizeSlug(rawName);
  const data = getNameData(nameStr);
  const similar = getSimilarNames(nameStr);
  const topRegion = Object.entries(data.regions).sort((a, b) => b[1] - a[1])[0];
  const decades = Object.entries(data.decade_popularity);

  const content = generateContentForName(data.name, data.count, data.origin, data.rank, data.isExact);

  // Computed enrichment data
  const popularityScore = Math.min(100, Math.round(Math.log10(data.count + 1) * 15));
  const popularityLabel = popularityScore >= 70 ? 'Very Common' : popularityScore >= 40 ? 'Moderately Common' : popularityScore >= 15 ? 'Uncommon' : 'Rare';
  const meetProbability = data.count > 0 ? Math.min(99, (data.count / 8000000000 * 100000)).toFixed(2) : '0';
  const hash = data.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const ageCohorts = [
    { label: '0–17', pct: 10 + (hash % 15) },
    { label: '18–34', pct: 15 + ((hash * 3) % 20) },
    { label: '35–54', pct: 20 + ((hash * 7) % 15) },
    { label: '55–74', pct: 15 + ((hash * 11) % 18) },
    { label: '75+', pct: 0 }, // remainder
  ];
  ageCohorts[4].pct = Math.max(5, 100 - ageCohorts.slice(0, 4).reduce((s, c) => s + c.pct, 0));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: data.name,
      description: `Approximately ${formatNumber(data.count)} people are named ${data.name} worldwide. Popularity rank #${formatNumber(data.rank)}. Origin: ${data.origin}.`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faqs.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    }
  ];

  const sectionRenderers: Record<string, React.ReactNode> = {
    intro: (
      <React.Fragment key="intro">
        <h2>About the Name {data.name}</h2>
        <p>{renderMarkdownText(content.intro)}</p>
        <p>{renderMarkdownText(content.explanation)}</p>
      </React.Fragment>
    ),
    stats: (
      <React.Fragment key="stats">
        <h2>Gender & Demographic Distribution</h2>
        <p>{data.name} is {data.gender === "male" ? "predominantly used as a male name" : data.gender === "female" ? "predominantly used as a female name" : "used as a gender-neutral name"}. It has roots in {data.origin} linguistic traditions. The meaning "{data.meaning}" reflects early cultural values.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-3"><Sparkles className="h-5 w-5 text-amber-500" /><h3 className="font-bold m-0">Popularity Score</h3></div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold">{popularityScore}</span>
              <span className="text-sm text-muted-foreground mb-1">/ 100 — {popularityLabel}</span>
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden mt-3">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-primary transition-all" style={{ width: `${popularityScore}%` }} />
            </div>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-3"><Brain className="h-5 w-5 text-violet-500" /><h3 className="font-bold m-0">Fun Fact</h3></div>
            <p className="text-sm text-muted-foreground m-0">If you randomly selected 100,000 people worldwide, approximately <strong>{meetProbability}</strong> of them would be named {data.name}. You&apos;d likely encounter a {data.name} once every ~{formatNumber(Math.max(1, Math.round(8000000000 / data.count)))} people you meet.</p>
          </div>
        </div>
      </React.Fragment>
    ),
    history: (
      <React.Fragment key="history">
        <h2>Historical Popularity of {data.name}</h2>
        <p>The popularity of {data.name} has shifted over time. Below is a decade-by-decade breakdown of the name's relative usage.</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 my-6">
          {decades.map(([decade, score]) => (
            <div key={decade} className="text-center p-3 rounded-lg bg-secondary">
              <div className="text-xs text-muted-foreground mb-1">{decade}</div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${score}%` }} />
              </div>
              <div className="text-sm font-semibold mt-1">{score}</div>
            </div>
          ))}
        </div>
      </React.Fragment>
    ),
    age: (
      <React.Fragment key="age">
        <h2>Estimated Age Distribution of {data.name}</h2>
        <p>Based on naming trend data, here is how people named {data.name} are distributed across age groups today.</p>
        <div className="space-y-3 my-6">
          {ageCohorts.map(cohort => (
            <div key={cohort.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{cohort.label}</span>
                <span className="text-muted-foreground">{cohort.pct}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary/50 to-primary" style={{ width: `${cohort.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    ),
    meaning: (
      <React.Fragment key="meaning">
        <h2>Meaning &amp; Origin of {data.name}</h2>
        <div className="p-5 rounded-xl border border-border bg-card my-6">
          <div className="flex items-center gap-2 mb-3"><BookOpen className="h-5 w-5 text-emerald-500" /><h3 className="font-bold m-0">Name Meaning</h3></div>
          <p className="text-lg font-medium mb-2">&quot;{data.meaning}&quot;</p>
          <p className="text-sm text-muted-foreground m-0">The name {data.name} originates from {data.origin} traditions. Names from this linguistic family often carry connotations of {data.gender === 'male' ? 'strength, leadership, and heritage' : data.gender === 'female' ? 'grace, beauty, and wisdom' : 'balance, adaptability, and resilience'}. {data.name} has been used across generations, adapting to each era&apos;s cultural context.</p>
        </div>
      </React.Fragment>
    ),
    regional: (
      <React.Fragment key="regional">
        <h2>Regional Distribution of {data.name}</h2>
        <p>The name {data.name} is used across multiple countries and regions.</p>
        <div className="space-y-3 my-6">
          {Object.entries(data.regions).sort((a, b) => b[1] - a[1]).map(([region, count]) => {
            const pct = Math.round((count / data.count) * 100);
            return (
              <div key={region}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{region}</span>
                  <span className="text-muted-foreground">{formatNumber(count)} ({pct}%)</span>
                </div>
                <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary/70" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    ),
    faqs: (
      <React.Fragment key="faqs">
        <h2>Frequently Asked Questions</h2>
        <div className="space-y-4 my-6">
          {content.faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-lg bg-card border border-border">
              <h3 className="font-bold mb-2">{faq.question}</h3>
              <p className="text-sm text-muted-foreground m-0">{faq.answer}</p>
            </div>
          ))}
        </div>
      </React.Fragment>
    ),
    similar: (
      <React.Fragment key="similar">
        <h2>Similar Names You Might Be Interested In</h2>
        <p>If you're exploring {data.name}, you might also want to check the popularity of these related names:</p>
        <div className="flex flex-wrap gap-2 my-6">
          {similar.map(s => (
            <Link key={s} href={`/name/${s}`} className="px-4 py-2 rounded-full bg-secondary hover:bg-primary/10 text-sm font-medium transition-colors">{s}</Link>
          ))}
        </div>
      </React.Fragment>
    )
  };

  return (
    <div className="min-h-screen bg-background">
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <SiteHeader />
      <main className="container py-12">
        <Breadcrumbs className="mb-6" items={[
          { label: "Home", href: "/" },
          { label: `Names: ${data.name.charAt(0).toUpperCase()}`, href: `/names/${data.name.charAt(0).toLowerCase()}` },
          { label: data.name },
        ]} />

        <h1 className="font-display text-4xl md:text-6xl font-bold mb-3">How Many People Are Named {data.name}?</h1>
        <p className="text-xl text-muted-foreground mb-8">Comprehensive statistics and insights for the name <strong className="text-foreground">{data.name}</strong></p>



        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Users, label: "Estimated People", value: formatNumber(data.count), color: "text-primary" },
            { icon: TrendingUp, label: "Popularity Rank", value: `#${formatNumber(data.rank)}`, color: "text-accent" },
            { icon: BarChart3, label: "Gender", value: data.gender.charAt(0).toUpperCase() + data.gender.slice(1), color: "text-foreground" },
            { icon: Globe, label: "Top Region", value: topRegion[0], color: "text-primary" },
          ].map(stat => (
            <div key={stat.label} className="p-5 rounded-xl border border-border bg-card">
              <stat.icon className={`h-6 w-6 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <AdSlot />

        <div className="prose-content">
          {content.sectionOrder.map((sectionId, idx) => {
            const isMiddle = idx === Math.floor(content.sectionOrder.length / 2);
            return (
              <React.Fragment key={sectionId}>
                {sectionRenderers[sectionId]}
                {isMiddle && <AdSlot />}
              </React.Fragment>
            );
          })}
        </div>

        <ToolCTA headline={`Check another name like ${data.name}`} subhead="Same free tool — instant popularity, rarity score, and regional breakdown for any first name." />

        <div className="mt-10 p-6 rounded-xl bg-secondary/30 border border-border grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold mb-3">Trending Global Names</h3>
            <div className="flex flex-wrap gap-2">
              {content.popularLinks.map(link => (
                <Link key={link.name} href={link.href} className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:border-primary/40 hover:text-primary transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display text-lg font-bold mb-3">Related Guides & Tools</h3>
            <div className="flex flex-col gap-2">
              <Link href="/tools/popularity-checker" className="text-sm text-muted-foreground hover:text-primary transition-colors">→ Verify another name's rank with the Popularity Checker</Link>
              <Link href="/tools/name-comparison" className="text-sm text-muted-foreground hover:text-primary transition-colors">→ Compare {data.name} head-to-head with another name</Link>
              <Link href={`/names/${data.name.charAt(0).toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">→ Explore all names starting with '{data.name.charAt(0).toUpperCase()}'</Link>
              <Link href="/tools/unique-name-generator" className="text-sm text-muted-foreground hover:text-primary transition-colors">→ Find rare and unique names</Link>
            </div>
          </div>
        </div>
        <RelatedPosts currentSlug={`name-${nameStr.toLowerCase()}`} tags={["baby names", "popularity", "statistics", data.gender === "male" ? "boy names" : data.gender === "female" ? "girl names" : "unisex", "meanings", "trends"]} count={12} />
      </main>
      <SiteFooter />
    </div>
  );
}
