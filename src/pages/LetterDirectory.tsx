import { useParams, Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import AdSlot from "@/components/AdSlot";
import ToolCTA from "@/components/ToolCTA";
import { getNamesForLetter, ALPHABET } from "@/data/nameData";
import RelatedPosts from "@/components/RelatedPosts";

const LetterDirectory = () => {
  const { letter } = useParams<{ letter: string }>();
  const l = (letter || "a").toLowerCase();
  const L = l.toUpperCase();
  const names = getNamesForLetter(l);
  const idx = ALPHABET.indexOf(l);
  const prev = ALPHABET[(idx - 1 + 26) % 26];
  const next = ALPHABET[(idx + 1) % 26];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Names Starting with ${L} — Popularity & Meanings (A–Z Directory)`}
        description={`Browse ${names.length.toLocaleString()} first names beginning with ${L}. Click any name to see how many people have it worldwide, decade-by-decade popularity, and regional data. Free, no signup.`}
        canonical={`https://howmanyofme.co/names/${l}`}
      />
      <SiteHeader />
      <main className="container py-12">
        <nav className="flex flex-wrap gap-1.5 mb-8">
          {ALPHABET.map(a => (
            <Link
              key={a}
              to={`/names/${a}`}
              className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-bold uppercase transition-colors ${a === l ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-primary/10'}`}
            >
              {a}
            </Link>
          ))}
        </nav>

        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">Names Starting with "{l.toUpperCase()}"</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Browse {names.length.toLocaleString()} names beginning with the letter {l.toUpperCase()}. Click any name to see detailed statistics.
        </p>

        <AdSlot />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 my-8">
          {names.map(name => (
            <Link
              key={name}
              to={`/name/${name}`}
              className="p-3 rounded-lg border border-border bg-card hover:bg-secondary/50 text-sm font-medium text-foreground hover:text-primary transition-colors text-center"
            >
              {name}
            </Link>
          ))}
        </div>

        {names.length === 0 && (
          <p className="text-muted-foreground text-center py-20">No names found for this letter yet. Our database is continuously expanding.</p>
        )}

        <AdSlot />

        <div className="prose-content mt-12">
          <h2>About Names Starting with {l.toUpperCase()}</h2>
          <p>
            The letter {l.toUpperCase()} contains {names.length > 20 ? "a rich variety" : "a selection"} of names spanning multiple cultures, languages, and historical periods. Names beginning with {l.toUpperCase()} include both timeless classics that have been popular for centuries and modern innovations that reflect contemporary naming trends.
          </p>
          <p>
            Each name links to a comprehensive statistics page where you can discover how many people share that name, its historical popularity trends, gender distribution, regional presence across 80+ countries, and lists of similar names to explore.
          </p>
        </div>
        <RelatedPosts currentSlug={`letter-${l}`} tags={["A-Z names", "baby names", "browse", "popular names", "trends"]} count={12} />
      </main>
      <SiteFooter />
    </div>
  );
};

export default LetterDirectory;
