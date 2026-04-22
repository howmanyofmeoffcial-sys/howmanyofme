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
import { Users, TrendingUp, Globe, BarChart3 } from "lucide-react";
import React from "react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ name: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name: rawName } = await params;
  const nameStr = decodeURIComponent(rawName);
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
  const nameStr = decodeURIComponent(rawName);
  const data = getNameData(nameStr);
  const similar = getSimilarNames(nameStr);
  const topRegion = Object.entries(data.regions).sort((a, b) => b[1] - a[1])[0];
  const decades = Object.entries(data.decade_popularity);

  const content = generateContentForName(data.name, data.count, data.origin, data.rank, data.isExact);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    description: `Approximately ${formatNumber(data.count)} people are named ${data.name} worldwide. Popularity rank #${formatNumber(data.rank)}. Origin: ${data.origin}.`,
  };

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="container py-12">
        <Breadcrumbs className="mb-6" items={[
          { label: "Home", href: "/" },
          { label: `Names: ${data.name.charAt(0).toUpperCase()}`, href: `/names/${data.name.charAt(0).toLowerCase()}` },
          { label: data.name },
        ]} />

        <h1 className="font-display text-4xl md:text-6xl font-bold mb-3">How Many People Are Named {data.name}?</h1>
        <p className="text-xl text-muted-foreground mb-8">Comprehensive statistics and insights for the name <strong className="text-foreground">{data.name}</strong></p>

        {!data.isExact && (
          <div className="mb-10 p-5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-800 dark:text-yellow-200">
            <h2 className="font-bold text-lg mb-2">No exact data found for {data.name}. Showing estimated results.</h2>
            <p className="text-sm opacity-90 mb-3">We do not have official registry data for this exact spelling. The statistics below are <strong>estimated</strong> based on demographic models, phonetic similarities, and linguistic patterns.</p>
            <div className="p-3 bg-yellow-500/20 rounded-md border border-yellow-500/30">
              <p className="text-sm font-medium mb-1"><strong>Estimation Logic:</strong></p>
              <p className="text-sm">{data.explanation}</p>
              <p className="text-sm mt-2"><strong>Confidence Level:</strong> {data.confidenceLevel === 'medium' ? 'Medium (Close match found)' : 'Low (Mathematical estimate)'}</p>
              <p className="text-sm"><strong>Estimated Popularity:</strong> {data.estimatedPopularity} ({data.estimatedRange})</p>
            </div>
          </div>
        )}

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
