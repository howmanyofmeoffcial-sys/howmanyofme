import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Link } from "react-router-dom";
import { getNamesForLetter, getNameData, formatNumber, ALPHABET } from "@/data/nameData";
import RelatedPosts from "@/components/RelatedPosts";

const RandomNameGenerator = () => {
  const [generated, setGenerated] = useState<string[]>([]);
  const [gender, setGender] = useState<string>("any");

  const generate = () => {
    const allNames = ALPHABET.flatMap(l => getNamesForLetter(l));
    const filtered = gender === "any" ? allNames : allNames.filter(n => {
      const d = getNameData(n);
      return d.gender === gender || d.gender === 'unisex';
    });
    const result: string[] = [];
    for (let i = 0; i < 10; i++) {
      result.push(filtered[Math.floor(Math.random() * filtered.length)]);
    }
    setGenerated([...new Set(result)]);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12 max-w-2xl">
        <h1 className="font-display text-4xl font-bold mb-4">Random Name Generator</h1>
        <p className="text-muted-foreground mb-8">Generate random names from our database of 100 million+ names.</p>
        <div className="flex gap-3 mb-6">
          <select value={gender} onChange={e => setGender(e.target.value)} className="h-10 rounded-md border border-input bg-secondary px-3 text-sm">
            <option value="any">Any Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <button onClick={generate} className="h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Generate Names
          </button>
        </div>
        {generated.length > 0 && (
          <div className="space-y-2">
            {generated.map(n => (
              <Link key={n} to={`/name/${n}`} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors">
                <span className="font-semibold">{n}</span>
                <span className="text-sm text-muted-foreground">~{formatNumber(getNameData(n).count)} people</span>
              </Link>
            ))}
          </div>
        )}
        <RelatedPosts currentSlug="random-name" tags={["generator", "random", "baby names"]} count={12} />
      </main>
      <SiteFooter />
    </div>
  );
};

export default RandomNameGenerator;
