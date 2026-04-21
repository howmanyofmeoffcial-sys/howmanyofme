import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { getNameData, formatNumber } from "@/data/nameData";
import RelatedPosts from "@/components/RelatedPosts";
import DataFreshness from "@/components/DataFreshness";

const NameComparison = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [results, setResults] = useState<{ a: ReturnType<typeof getNameData>; b: ReturnType<typeof getNameData> } | null>(null);

  const compare = (e: React.FormEvent) => {
    e.preventDefault();
    if (name1.trim() && name2.trim()) {
      setResults({ a: getNameData(name1.trim()), b: getNameData(name2.trim()) });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Name Popularity Comparison Tool | HowManyOfMe" description="Compare the popularity of two names side by side. See which name is more common, historical trends, and regional differences." />
      <SiteHeader />

      <main className="container py-12 max-w-3xl">

        <h1 className="font-display text-4xl font-bold mb-4">Name Popularity Comparison</h1>

        <p className="text-muted-foreground mb-8">
          Compare two names side by side to see popularity differences, historical trends, and more.
        </p>

        <form onSubmit={compare} className="flex flex-col sm:flex-row gap-3 mb-8">

          <input
            type="text"
            placeholder="First name..."
            value={name1}
            onChange={e => setName1(e.target.value)}
            className="flex-1 h-12 rounded-md border border-input bg-secondary px-4 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <span className="text-muted-foreground self-center font-bold">vs</span>

          <input
            type="text"
            placeholder="Second name..."
            value={name2}
            onChange={e => setName2(e.target.value)}
            className="flex-1 h-12 rounded-md border border-input bg-secondary px-4 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <button
            type="submit"
            className="h-12 px-6 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Compare
          </button>

        </form>

        {results && (
          <div className="space-y-6">

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">

              {[results.a, results.b].map((r, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 text-center">

                  <Link
                    to={`/name/${r.name}`}
                    className="font-display text-2xl font-bold hover:text-primary transition-colors"
                  >
                    {r.name}
                  </Link>

                  <p className="text-muted-foreground text-sm mt-1">Rank #{formatNumber(r.rank)}</p>

                  <p className="text-3xl font-bold text-primary mt-2">~{formatNumber(r.count)}</p>

                  <p className="text-xs text-muted-foreground">people worldwide</p>

                </div>
              ))}

            </div>

            {/* Decade comparison */}

            <div className="rounded-xl border border-border bg-card p-6">

              <h2 className="font-display text-xl font-bold mb-4">Popularity by Decade</h2>

              <div className="space-y-3">

                {Object.keys(results.a.decade_popularity).map(decade => (
                  <div key={decade} className="flex items-center gap-3">

                    <span className="w-12 text-xs text-muted-foreground font-mono">{decade}</span>

                    <div className="flex-1 flex gap-1">

                      <div className="flex-1 flex justify-end">
                        <div
                          className="h-4 rounded-l-full bg-primary"
                          style={{ width: `${results.a.decade_popularity[decade]}%` }}
                        />
                      </div>

                      <div className="flex-1">
                        <div
                          className="h-4 rounded-r-full bg-accent"
                          style={{ width: `${results.b.decade_popularity[decade]}%` }}
                        />
                      </div>

                    </div>

                  </div>
                ))}

              </div>

              <div className="flex justify-center gap-6 mt-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  {results.a.name}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-accent" />
                  {results.b.name}
                </span>
              </div>

            </div>

            {/* Winner */}

            <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 text-center">

              <p className="text-sm text-muted-foreground mb-1">More Popular Name</p>

              <p className="font-display text-3xl font-bold text-primary">
                {results.a.count >= results.b.count ? results.a.name : results.b.name}
              </p>

              <p className="text-sm text-muted-foreground mt-1">
                {Math.abs(results.a.count - results.b.count) > 0
                  ? `by ~${formatNumber(Math.abs(results.a.count - results.b.count))} people`
                  : "It's a tie!"}
              </p>

            </div>

          </div>
        )}


        {/* ================= ARTICLE SECTION ================= */}

        <section className="mt-24 space-y-16">

          {/* FAQ SCHEMA */}

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is a name popularity comparison tool?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "A name popularity comparison tool analyzes historical naming data and shows how two names compare in popularity across decades or populations."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Why should parents compare baby names?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Comparing baby names helps parents understand which names are trending, which are unique, and which have timeless popularity."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How is name popularity calculated?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Popularity is calculated using birth records, census data, and demographic statistics that track how often names appear over time."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can name trends change quickly?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. Movies, celebrities, viral culture, and global trends can cause names to suddenly rise or fall in popularity."
                    }
                  }
                ]
              })
            }}
          />


          {/* ARTICLE INTRO */}

          <div className="max-w-3xl mx-auto text-center">

            <h1 className="font-display text-4xl font-bold mb-6">
              Name Popularity Comparison Tool: Discover Which Name Wins
            </h1>

            <p className="text-lg text-muted-foreground">
              Choosing a name is one of the most exciting parts of welcoming a baby. But sometimes the hardest decision is choosing between two beautiful names. Maybe you love "Emma" but your partner prefers "Olivia." Or perhaps you're deciding between "Liam" and "Noah." Which one is more popular? Which one is more unique?
            </p>

            <p className="text-muted-foreground mt-4">
              This is where a <strong>Name Popularity Comparison Tool</strong> becomes incredibly useful. Instead of guessing or scrolling through endless baby name lists, you can instantly compare two names side by side and see which one is more common, which one is trending, and how each name has evolved over time.
            </p>

          </div>


          {/* SECTION 1 */}

          <div className="grid md:grid-cols-2 gap-12">

            <div>

              <h2 className="text-2xl font-bold mb-4">Why Comparing Baby Names Matters</h2>

              <p className="text-muted-foreground mb-4">
                Many parents today want a name that feels special yet familiar. A name that is too common may lead to multiple children sharing the same name in school, while a name that is too rare may feel unfamiliar or difficult to pronounce.
              </p>

              <p className="text-muted-foreground">
                By comparing names directly, you can quickly identify which one is more widely used and which one stands out as unique. This helps parents make a more informed and confident naming decision.
              </p>

            </div>

            <div className="p-8 border rounded-xl bg-secondary/30">

              <h3 className="font-semibold mb-3">Factors That Influence Name Popularity</h3>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>🎬 Movies and television characters</li>
                <li>⭐ Celebrity influence</li>
                <li>📱 Social media trends</li>
                <li>📚 Cultural traditions</li>
                <li>🌍 Global cultural exchange</li>
              </ul>

            </div>

          </div>


          {/* SECTION 2 */}

          <div>

            <h2 className="text-2xl font-bold mb-6">How the Name Comparison Tool Works</h2>

            <div className="grid md:grid-cols-3 gap-6">

              <div className="p-6 border rounded-xl bg-card">
                <h3 className="font-semibold mb-2">Step 1: Enter Two Names</h3>
                <p className="text-sm text-muted-foreground">
                  Type two names into the comparison tool to instantly generate popularity statistics.
                </p>
              </div>

              <div className="p-6 border rounded-xl bg-card">
                <h3 className="font-semibold mb-2">Step 2: Analyze Rankings</h3>
                <p className="text-sm text-muted-foreground">
                  The system shows estimated global counts and popularity ranks for each name.
                </p>
              </div>

              <div className="p-6 border rounded-xl bg-card">
                <h3 className="font-semibold mb-2">Step 3: Compare Trends</h3>
                <p className="text-sm text-muted-foreground">
                  Visual bars display how each name has changed in popularity across decades.
                </p>
              </div>

            </div>

          </div>


          {/* SECTION 3 */}

          <div className="grid md:grid-cols-2 gap-12">

            <div>

              <h2 className="text-2xl font-bold mb-4">Understanding Historical Name Trends</h2>

              <p className="text-muted-foreground mb-4">
                Name trends are constantly evolving. Some names dominate an era before fading away, while others remain stable for generations.
              </p>

              <p className="text-muted-foreground">
                For example, names like "Michael" and "Jennifer" were extremely popular in the 1980s and 1990s, while modern favorites such as "Liam" and "Olivia" dominate recent birth records.
              </p>

            </div>

            <div className="p-8 border rounded-xl bg-card">

              <h3 className="font-semibold mb-3">Common Trend Patterns</h3>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>📈 Rapid popularity spikes</li>
                <li>📉 Long-term decline</li>
                <li>🔄 Vintage revival cycles</li>
                <li>⏳ Stable timeless names</li>
              </ul>

            </div>

          </div>


          {/* FAQ UI */}

          <div className="max-w-3xl mx-auto">

            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>

            <div className="space-y-6">

              <div className="p-6 border rounded-xl">
                <h3 className="font-semibold mb-2">What is a name popularity comparison tool?</h3>
                <p className="text-sm text-muted-foreground">It allows users to compare two names side by side using historical popularity data.</p>
              </div>

              <div className="p-6 border rounded-xl">
                <h3 className="font-semibold mb-2">Why compare baby names?</h3>
                <p className="text-sm text-muted-foreground">Parents often want a name that balances uniqueness with familiarity.</p>
              </div>

              <div className="p-6 border rounded-xl">
                <h3 className="font-semibold mb-2">Where does the data come from?</h3>
                <p className="text-sm text-muted-foreground">Data is based on large birth record datasets and demographic statistics.</p>
              </div>

              <div className="p-6 border rounded-xl">
                <h3 className="font-semibold mb-2">Can popularity trends change?</h3>
                <p className="text-sm text-muted-foreground">Yes. Cultural events and media can quickly influence name popularity.</p>
              </div>

            </div>

          </div>


          {/* CTA */}

          <div className="text-center py-12">

            <h2 className="text-3xl font-bold mb-4">Compare Your Favorite Names Now</h2>

            <p className="text-muted-foreground max-w-xl mx-auto">
              Curious which name is more popular? Use the comparison tool above to instantly analyze name trends, rankings, and historical popularity.
            </p>

          </div>

        </section>

        <DataFreshness toolName="Name Popularity Comparison" />

        <RelatedPosts currentSlug="name-comparison" tags={["comparison", "popularity", "trends", "statistics"]} count={12} />

      </main>

      <SiteFooter />

    </div>
  );
};

export default NameComparison;
