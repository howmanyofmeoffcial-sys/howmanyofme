import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdSlot from "@/components/AdSlot";
import ToolCTA from "@/components/ToolCTA";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedPosts from "@/components/RelatedPosts";
import { getNameData, getSimilarNames, formatNumber, getPopularNames } from "@/data/nameData";
import { Users, TrendingUp, Globe, BarChart3 } from "lucide-react";

export const dynamicParams = true;

export function generateStaticParams() {
  const popular = getPopularNames();
  return popular.map((n) => ({ name: n.name }));
}

type Props = { params: Promise<{ name: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name: rawName } = await params;
  const nameStr = decodeURIComponent(rawName);
  const data = getNameData(nameStr);
  return {
    title: `How Many People Are Named ${data.name}? Popularity, Rarity & Origin`,
    description: `There are ~${formatNumber(data.count)} people named ${data.name} worldwide (rank #${formatNumber(data.rank)}). See ${data.name}'s popularity by decade, country, and gender — free, no signup.`,
    alternates: { canonical: `https://howmanyofme.co/name/${encodeURIComponent(data.name)}` },
  };
}

export default async function NameDetailPage({ params }: Props) {
  const { name: rawName } = await params;
  const nameStr = decodeURIComponent(rawName);
  const data = getNameData(nameStr);
  const similar = getSimilarNames(nameStr);
  const topRegion = Object.entries(data.regions).sort((a, b) => b[1] - a[1])[0];
  const decades = Object.entries(data.decade_popularity);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    description: `Approximately ${formatNumber(data.count)} people are named ${data.name} worldwide. Popularity rank #${formatNumber(data.rank)}. Origin: ${data.origin}.`,
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
          <h2>About the Name {data.name}</h2>
          <p>The name <strong>{data.name}</strong> is estimated to be held by approximately <strong>{formatNumber(data.count)}</strong> people worldwide, making it rank <strong>#{formatNumber(data.rank)}</strong> in global name popularity. This {data.gender === "unisex" ? "gender-neutral" : data.gender} name has {data.origin} origins, and its meaning is associated with &quot;{data.meaning}.&quot;</p>
          <p>Based on our analysis of birth registration data, census records, and demographic modeling across more than 80 countries, {data.name} has maintained a {data.count > 1000000 ? "consistently strong" : data.count > 100000 ? "notable" : "modest"} presence in naming records.</p>

          <h2>Historical Popularity of {data.name}</h2>
          <p>The popularity of {data.name} has shifted considerably over time. Below is a decade-by-decade breakdown of the name&apos;s relative popularity.</p>
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

          <AdSlot />

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

          <h2>Gender Distribution</h2>
          <p>{data.name} is {data.gender === "male" ? "predominantly used as a male name" : data.gender === "female" ? "predominantly used as a female name" : "used as a gender-neutral name"}.</p>

          <h2>Cultural Background and Origin</h2>
          <p>The name {data.name} has its roots in {data.origin} linguistic and cultural traditions. The meaning &quot;{data.meaning}&quot; reflects the values and aspirations that were important to the culture from which the name originated.</p>

          <AdSlot />

          <h2>Similar Names to {data.name}</h2>
          <p>If you&apos;re interested in {data.name}, you might also want to explore these related names:</p>
          <div className="flex flex-wrap gap-2 my-6">
            {similar.map(s => (
              <Link key={s} href={`/name/${s}`} className="px-4 py-2 rounded-full bg-secondary hover:bg-primary/10 text-sm font-medium transition-colors">{s}</Link>
            ))}
          </div>

          <h2>Interesting Facts About {data.name}</h2>
          <p>If there are {formatNumber(data.count)} people named {data.name} worldwide, that means approximately 1 in every {formatNumber(Math.round(8000000000 / data.count))} people on Earth shares this name.</p>
        </div>

        <ToolCTA headline={`Check another name like ${data.name}`} subhead="Same free tool — instant popularity, rarity score, and regional breakdown for any first name." />

        <div className="mt-10 p-6 rounded-xl bg-secondary/30 border border-border">
          <h3 className="font-display text-lg font-bold mb-3">Related guides &amp; tools</h3>
          <div className="flex flex-wrap gap-2">
            <Link href="/tools/popularity-checker" className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:border-primary/40 hover:text-primary transition-colors">Name Popularity Checker</Link>
            <Link href="/tools/name-comparison" className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:border-primary/40 hover:text-primary transition-colors">Compare {data.name} to another name</Link>
            <Link href={`/names/${data.name.charAt(0).toLowerCase()}`} className="px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:border-primary/40 hover:text-primary transition-colors">More names starting with {data.name.charAt(0).toUpperCase()}</Link>
          </div>
        </div>
        <RelatedPosts currentSlug={`name-${nameStr.toLowerCase()}`} tags={["baby names", "popularity", "statistics", data.gender === "male" ? "boy names" : data.gender === "female" ? "girl names" : "unisex", "meanings", "trends"]} count={12} />
      </main>
      <SiteFooter />
    </div>
  );
}
