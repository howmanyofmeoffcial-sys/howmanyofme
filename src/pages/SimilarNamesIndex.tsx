import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Search } from "lucide-react";
import { getAllIndexableNames } from "@/lib/similarNames";
import { validateSingleName } from "@/lib/nameValidation";
import { toast } from "sonner";

const POPULAR = [
  "James", "Mary", "Michael", "Jennifer", "David", "Linda", "Robert", "Patricia",
  "John", "Elizabeth", "William", "Sarah", "Emma", "Liam", "Olivia", "Noah",
  "Sophia", "Ava", "Aaron", "Aaban", "Ethan", "Mia", "Lucas", "Isabella",
];

const FAQ = [
  {
    q: "What does 'similar names' mean?",
    a: "Similar names are first names that share key features with a target name — same starting letter, similar length, similar sound (low edit distance), or shared cultural origin. Parents browse them when picking baby names; writers use them when naming related characters.",
  },
  {
    q: "How do you generate the list of similar names?",
    a: "We combine three signals: phonetic similarity (Levenshtein edit distance ≤ 2), names that begin with the same letter, and names of the same length. Results are de-duplicated and ranked so the closest matches appear first.",
  },
  {
    q: "Are these similar-name suggestions free to use?",
    a: "Yes. Every page on howmanyofme.co/similar-names is free, with no signup or download. Click any name to see its detailed popularity, rarity, and origin data.",
  },
  {
    q: "Can I find similar names for any first name?",
    a: "Yes. Type any name in the box above. We support thousands of US, UK, Canadian, Australian, and globally common first names with a dedicated page each.",
  },
  {
    q: "Will similar names match my name's gender?",
    a: "The similar-names list is gender-neutral by design so you can discover cross-gender variants. Each name links to its detail page where the SSA-based gender split is shown.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Similar Names Finder",
    url: "https://howmanyofme.co/similar-names",
    description: "Find names similar to any first name — by sound, length, and starting letter. Free, no signup.",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

const SimilarNamesIndex = () => {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const allNames = useMemo(() => getAllIndexableNames(), []);
  const suggestions = useMemo(() => {
    if (!q) return [];
    const lq = q.toLowerCase();
    return allNames.filter((n) => n.toLowerCase().startsWith(lq)).slice(0, 8);
  }, [q, allNames]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateSingleName(q);
    if (!v.ok) {
      toast.warning(v.reason, { duration: 1500 });
      return;
    }
    navigate(`/similar-names/${v.value.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Similar Names Finder — Free Name Similarity Tool"
        description="Find names similar to any first name. Browse thousands of similar-name pages by sound, length, and letter. Free, instant, no signup."
        canonical="https://howmanyofme.co/similar-names"
        jsonLd={jsonLd}
      />
      <SiteHeader />
      <main className="container py-10">
        <Breadcrumbs
          className="mb-6"
          items={[{ label: "Home", href: "/" }, { label: "Similar Names" }]}
        />

        <header className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Find Names Similar to Any First Name
          </h1>
          <p className="text-muted-foreground text-lg">
            Search a name to discover phonetically similar, same-letter, and same-length alternatives — perfect for baby names, characters, and brainstorming.
          </p>
        </header>

        <form onSubmit={submit} className="max-w-xl mx-auto mb-10 relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Enter a name (e.g. Aaban)"
                aria-label="Enter a name to find similar names"
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  {suggestions.map((s) => (
                    <li key={s}>
                      <Link
                        to={`/similar-names/${s.toLowerCase()}`}
                        className="block px-4 py-2 text-sm hover:bg-secondary/50"
                      >
                        {s}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="submit"
              className="h-12 px-6 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
            >
              Find Similar
            </button>
          </div>
        </form>

        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-4">Popular Names — Pick One to See Similar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {POPULAR.map((n) => (
              <Link
                key={n}
                to={`/similar-names/${n.toLowerCase()}`}
                className="p-3 text-center rounded-lg border border-border bg-card hover:border-primary/40 hover:text-primary text-sm font-medium transition-colors"
              >
                {n}
              </Link>
            ))}
          </div>
        </section>

        <section className="prose-content max-w-3xl mx-auto mb-12">
          <h2>What Are Similar Names?</h2>
          <p>
            <strong>Similar names</strong> are first names that share important features with a target name — they may
            sound alike, share a starting letter, have the same number of syllables, or come from the same cultural
            origin. People search for similar names for many reasons: parents picking a baby name often want a list
            of close alternatives in case a top pick is too common; writers naming siblings or related characters
            want subtle variations; and people researching their own name like to discover the broader "name family"
            it belongs to.
          </p>
          <p>
            On HowManyOfMe.co we generate similar-name pages for thousands of first names. Each page combines three
            signals: <strong>phonetic similarity</strong> (small edit distance, so spellings sound alike),{" "}
            <strong>same starting letter</strong> (the strongest visual cluster), and <strong>matching length</strong>{" "}
            (a fast proxy for rhythm). Click any suggestion to open its own statistics page with global bearer
            counts, US SSA popularity rank, gender split, and decade-by-decade trend data.
          </p>
          <p>
            Looking for inspiration? Try{" "}
            <Link to="/similar-names/aaban" className="text-primary hover:underline">names similar to Aaban</Link>,{" "}
            <Link to="/similar-names/emma" className="text-primary hover:underline">names similar to Emma</Link>, or{" "}
            <Link to="/similar-names/liam" className="text-primary hover:underline">names similar to Liam</Link>. You
            can also browse the full <Link to="/names/a" className="text-primary hover:underline">A–Z directory</Link>.
          </p>
        </section>

        <section className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.q} className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-semibold mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default SimilarNamesIndex;
