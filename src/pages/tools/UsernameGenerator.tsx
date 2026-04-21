import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RelatedPosts from "@/components/RelatedPosts";

const styles = [
  (n: string) => n.toLowerCase() + Math.floor(Math.random() * 999),
  (n: string) => n.toLowerCase() + "_" + ["pro", "dev", "hq", "go", "hub"][Math.floor(Math.random() * 5)],
  (n: string) => "the" + n,
  (n: string) => n.toLowerCase().split("").reverse().join("") + Math.floor(Math.random() * 99),
  (n: string) => n.substring(0, 3).toLowerCase() + "_" + n.substring(3).toLowerCase() + Math.floor(Math.random() * 99),
  (n: string) => "x" + n.toLowerCase() + "x",
  (n: string) => n.toLowerCase() + ".official",
  (n: string) => n.charAt(0).toLowerCase() + "_" + n.slice(1).toLowerCase(),
];

const UsernameGenerator = () => {
  const [name, setName] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setResults(styles.map(fn => fn(name.trim())));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12 max-w-2xl">
        <h1 className="font-display text-4xl font-bold mb-4">Username Generator</h1>
        <p className="text-muted-foreground mb-8">Generate creative username ideas from any name.</p>
        <form onSubmit={generate} className="flex gap-3 mb-8">
          <input type="text" placeholder="Enter your name..." value={name} onChange={e => setName(e.target.value)} className="flex-1 h-12 rounded-md border border-input bg-secondary px-4 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          <button type="submit" className="h-12 px-6 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">Generate</button>
        </form>
        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="p-4 rounded-lg border border-border bg-card font-mono text-sm">{r}</div>
            ))}
          </div>
        )}
        <RelatedPosts currentSlug="username-generator" tags={["username", "generator", "social media"]} count={12} />
      </main>
      <SiteFooter />
    </div>
  );
};

export default UsernameGenerator;
