import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getNamesForLetter, getNameData, formatNumber, ALPHABET } from "@/data/nameData";
import RelatedPosts from "@/components/RelatedPosts";
import DataFreshness from "@/components/DataFreshness";

const BabyNames = () => {
  const [letter, setLetter] = useState("a");
  const [gender, setGender] = useState<string>("any");

  const names = getNamesForLetter(letter).filter(n => {
    if (gender === "any") return true;
    const d = getNameData(n);
    return d.gender === gender || d.gender === 'unisex';
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-4">Baby Name Ideas</h1>
        <p className="text-muted-foreground mb-8">Browse baby name ideas filtered by letter and gender.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {ALPHABET.map(l => (
            <button key={l} onClick={() => setLetter(l)} className={`w-9 h-9 rounded-md text-sm font-bold uppercase ${l === letter ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-primary/10'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-3 mb-6">
          <select value={gender} onChange={e => setGender(e.target.value)} className="h-10 rounded-md border border-input bg-secondary px-3 text-sm">
            <option value="any">Any Gender</option>
            <option value="male">Boy Names</option>
            <option value="female">Girl Names</option>
          </select>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {names.map(n => (
            <Link key={n} to={`/name/${n}`} className="p-3 rounded-lg border border-border bg-card hover:bg-secondary/50 text-center text-sm font-medium transition-colors">
              {n}
            </Link>
          ))}
        </div>
        <DataFreshness toolName="Baby Name Ideas" />
        <RelatedPosts currentSlug="baby-names" tags={["baby names", "browse", "A-Z names", "gender"]} count={12} />
      </main>
      <SiteFooter />
    </div>
  );
};

export default BabyNames;
