import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdSlot from "@/components/AdSlot";
import ToolCTA from "@/components/ToolCTA";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedPosts from "@/components/RelatedPosts";
import { getNamesForLetter, ALPHABET } from "@/data/nameData";
import { getNamesForLetterServer } from "@/data/serverNameData";

export function generateStaticParams() {
  return ALPHABET.map((letter) => ({ letter }));
}

type Props = { params: Promise<{ letter: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { letter } = await params;
  const l = letter.toLowerCase();
  const L = l.toUpperCase();
  const baseNames = getNamesForLetter(l);
  const names = getNamesForLetterServer(l, baseNames);
  return {
    title: `Names Starting with ${L} — Popularity & Meanings (A–Z Directory)`,
    description: `Browse ${names.length.toLocaleString()} first names beginning with ${L}. Click any name to see how many people have it worldwide, decade-by-decade popularity, and regional data.`,
    alternates: { canonical: `https://howmanyofme.co/names/${l}` },
  };
}

export default async function LetterDirectoryPage({ params }: Props) {
  const { letter } = await params;
  const l = letter.toLowerCase();
  const L = l.toUpperCase();
  const baseNames = getNamesForLetter(l);
  const names = getNamesForLetterServer(l, baseNames);
  const idx = ALPHABET.indexOf(l);
  const prev = ALPHABET[(idx - 1 + 26) % 26];
  const next = ALPHABET[(idx + 1) % 26];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12">
        <Breadcrumbs className="mb-6" items={[
          { label: "Home", href: "/" },
          { label: "Browse Names A–Z", href: "/names/a" },
          { label: `Names starting with ${L}` },
        ]} />
        <nav className="flex flex-wrap gap-1.5 mb-8">
          {ALPHABET.map(a => (
            <Link key={a} href={`/names/${a}`} className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-bold uppercase transition-colors ${a === l ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-primary/10"}`}>{a}</Link>
          ))}
        </nav>

        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">Names Starting with &quot;{L}&quot;</h1>
        <p className="text-muted-foreground text-lg mb-8">Browse {names.length.toLocaleString()} names beginning with the letter {L}. Click any name to see detailed statistics.</p>

        <AdSlot />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 my-8">
          {names.map(name => (
            <Link key={name} href={`/name/${name}`} className="p-3 rounded-lg border border-border bg-card hover:bg-secondary/50 text-sm font-medium text-foreground hover:text-primary transition-colors text-center">{name}</Link>
          ))}
        </div>

        {names.length === 0 && <p className="text-muted-foreground text-center py-20">No names found for this letter yet.</p>}

        <AdSlot />

        <div className="prose-content mt-12">
          <h2>About Names Starting with {L}</h2>
          <p>The letter {L} contains {names.length > 20 ? "a rich variety" : "a selection"} of names spanning multiple cultures, languages, and historical periods.</p>
          <p>Each name links to a comprehensive statistics page where you can discover how many people share that name, its historical popularity trends, gender distribution, regional presence across 80+ countries, and lists of similar names.</p>
        </div>

        <ToolCTA headline={`Check any ${L}-name's popularity instantly`} subhead={`Type a name starting with ${L} and see how many people share it worldwide.`} />

        <div className="mt-10 grid grid-cols-2 gap-4">
          <Link href={`/names/${prev}`} className="p-4 rounded-xl border border-border hover:bg-secondary/50 transition-colors">
            <div className="text-xs text-muted-foreground mb-1">← Previous letter</div>
            <div className="font-semibold">Names starting with {prev.toUpperCase()}</div>
          </Link>
          <Link href={`/names/${next}`} className="p-4 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-right">
            <div className="text-xs text-muted-foreground mb-1">Next letter →</div>
            <div className="font-semibold">Names starting with {next.toUpperCase()}</div>
          </Link>
        </div>

        <RelatedPosts currentSlug={`letter-${l}`} tags={["A-Z names", "baby names", "browse", "popular names", "trends"]} count={12} />
      </main>
      <SiteFooter />
    </div>
  );
}
