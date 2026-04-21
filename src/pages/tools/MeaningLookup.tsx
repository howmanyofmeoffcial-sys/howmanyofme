import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { getNameData, formatNumber } from "@/data/nameData";
import RelatedPosts from "@/components/RelatedPosts";
import DataFreshness from "@/components/DataFreshness";

const MeaningLookup = () => {
  const [name, setName] = useState("");
  const [result, setResult] = useState<ReturnType<typeof getNameData> | null>(null);

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setResult(getNameData(name.trim()));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Name Meaning Lookup | HowManyOfMe" description="Discover the meaning, origin, etymology, and cultural significance of any name. Look up detailed name meanings from our database." />
      <SiteHeader />
      <main className="container py-12 max-w-2xl">
        <h1 className="font-display text-4xl font-bold mb-4">Name Meaning Lookup</h1>
        <p className="text-muted-foreground mb-8">Enter any name to discover its meaning, origin, and cultural significance.</p>
        <form onSubmit={lookup} className="flex gap-3 mb-8">
          <input type="text" placeholder="Enter a name..." value={name} onChange={e => setName(e.target.value)} className="flex-1 h-12 rounded-md border border-input bg-secondary px-4 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          <button type="submit" className="h-12 px-6 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">Lookup</button>
        </form>
        {result && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div>
              <h2 className="font-display text-3xl font-bold">{result.name}</h2>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">{result.gender}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Origin</p>
                <p className="font-semibold">{result.origin}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Meaning</p>
                <p className="font-semibold">{result.meaning}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Popularity Rank</p>
                <p className="font-semibold">#{formatNumber(result.rank)}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">People Worldwide</p>
                <p className="font-semibold">~{formatNumber(result.count)}</p>
              </div>
            </div>
            <Link to={`/name/${result.name}`} className="inline-block text-sm text-primary hover:underline">View full name statistics →</Link>
          </div>
        )}
        <DataFreshness toolName="Name Meaning Lookup" />
        <RelatedPosts currentSlug="meaning" tags={["meanings", "etymology", "origins", "cultural", "baby names"]} count={12} />
      </main>
      <SiteFooter />
    </div>
  );
};

export default MeaningLookup;
