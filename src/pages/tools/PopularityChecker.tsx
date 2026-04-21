import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { getNameData, formatNumber } from "@/data/nameData";
import RelatedPosts from "@/components/RelatedPosts";
import DataFreshness from "@/components/DataFreshness";

const SUGGESTED = ["Emma","Olivia","Sophia","Liam","Noah","Oliver","Isabella","Lucas"];

const PopularityChecker = () => {
  const [name, setName] = useState("");
  const [result, setResult] = useState<ReturnType<typeof getNameData> | null>(null);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setResult(getNameData(name.trim()));
  };

  return (
    <div className="min-h-screen bg-background">

      <SEOHead
        title="Name Popularity Checker | HowManyOfMe"
        description="Check how popular a name is worldwide. See rankings, historical popularity trends, and insights about baby names."
      />

      <SiteHeader />

      <main className="container py-12 max-w-4xl">

        <h1 className="font-display text-4xl font-bold mb-4">Name Popularity Checker</h1>

        <p className="text-muted-foreground mb-8">
          Enter a name to see its popularity ranking, estimated number of people with the name,
          and historical trends across decades.
        </p>

        <form onSubmit={check} className="flex gap-3 mb-6">

          <input
            type="text"
            placeholder="Enter a name..."
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 h-12 rounded-md border border-input bg-secondary px-4 text-base"
          />

          <button
            type="submit"
            className="h-12 px-6 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90"
          >
            Check
          </button>

        </form>

        {/* Suggested names */}

        <div className="flex flex-wrap gap-2 mb-10">
          {SUGGESTED.map(n => (
            <button
              key={n}
              onClick={() => { setName(n); setResult(getNameData(n)); }}
              className="px-3 py-1 text-sm rounded-full border bg-secondary hover:bg-primary hover:text-white transition"
            >
              {n}
            </button>
          ))}
        </div>

        {result && (

          <div className="rounded-xl border border-border bg-card p-6 mb-12">

            <h2 className="font-display text-2xl font-bold mb-1">{result.name}</h2>

            <p className="text-muted-foreground mb-4">
              Rank #{formatNumber(result.rank)} · ~{formatNumber(result.count)} people worldwide
            </p>

            <div className="space-y-3">

              {Object.entries(result.decade_popularity).map(([decade, score]) => (

                <div key={decade} className="flex items-center gap-3">

                  <span className="w-16 text-sm text-muted-foreground">{decade}</span>

                  <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">

                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${score}%` }}
                    />

                  </div>

                  <span className="w-8 text-sm text-right font-medium">{score}</span>

                </div>

              ))}

            </div>

            <Link
              to={`/name/${result.name}`}
              className="inline-block mt-6 text-sm text-primary hover:underline"
            >
              View full statistics →
            </Link>

          </div>

        )}

        {/* Infographic Cards */}

        <div className="grid md:grid-cols-3 gap-6 mb-16">

          <div className="p-6 rounded-xl border bg-card">
            <h3 className="font-semibold mb-2">📈 Rising Names</h3>
            <p className="text-sm text-muted-foreground">
              Some names experience dramatic growth in popularity over time due to cultural trends,
              celebrities, or popular media.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card">
            <h3 className="font-semibold mb-2">📉 Declining Names</h3>
            <p className="text-sm text-muted-foreground">
              Certain names become less popular as generations change and new naming styles emerge.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card">
            <h3 className="font-semibold mb-2">⏳ Timeless Names</h3>
            <p className="text-sm text-muted-foreground">
              Classic names often remain stable for decades and continue to feel elegant and familiar.
            </p>
          </div>

        </div>

        {/* Article Section */}

        {/* Article Section */}

        <section className="mt-24 space-y-16">

          {/* FAQ Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How accurate is the Name Popularity Checker?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Most name popularity data comes from government birth registries and large demographic datasets, making it a reliable indicator of how common a name is across populations."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I check any name with this tool?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. The Name Popularity Checker supports thousands of names and instantly retrieves historical popularity scores and estimated counts."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Why do some names suddenly become popular?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Pop culture, celebrities, movies, historical events, and social media trends can cause dramatic spikes in name popularity within a short period of time."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can name popularity trends predict future trends?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "While trends cannot guarantee future popularity, consistent growth over several decades often indicates that a name may continue rising."
                    }
                  }
                ]
              })
            }}
          />

          {/* Opening Story */}

          <div className="max-w-3xl mx-auto text-center">

            <h1 className="font-display text-4xl font-bold mb-6">
              Name Popularity Checker: Discover How Common a Name Really Is
            </h1>

            <p className="text-lg text-muted-foreground">
              When Maya and Arjun were expecting their first child, choosing a name felt like one of the most exciting — yet surprisingly difficult — decisions they had ever faced. They loved the name "Aarav," but wondered: how popular is it really? Would their child share the same name with five classmates? Or was it still relatively unique?
            </p>

            <p className="text-muted-foreground mt-4">
              Like millions of parents around the world, they wanted more than just a beautiful name — they wanted insight. That curiosity led them to explore name popularity data. Tools like the <strong>Name Popularity Checker</strong> make this process simple by transforming large datasets into clear visual insights.
            </p>

          </div>

          {/* Section 1 */}

          <div className="grid md:grid-cols-2 gap-12 items-start">

            <div>

              <h2 className="text-2xl font-bold mb-4">Understanding Name Popularity</h2>

              <p className="text-muted-foreground mb-4">
                Name popularity refers to how frequently a particular name appears within a population. Some names become extremely common within a generation, while others remain rare or unique. By analyzing birth records and demographic datasets, researchers can estimate how many people share a given name and how its popularity has changed over time.
              </p>

              <p className="text-muted-foreground">
                For example, according to historical naming statistics, names like <strong>Michael</strong>, <strong>Jessica</strong>, and <strong>David</strong> dominated birth records in the late twentieth century. Meanwhile, more modern names such as <strong>Liam</strong>, <strong>Noah</strong>, and <strong>Olivia</strong> have surged in popularity during the past decade.
              </p>

            </div>

            <div className="p-8 rounded-xl border bg-secondary/30">

              <h3 className="font-semibold mb-3">Major Factors That Influence Name Trends</h3>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>🎬 Movies and television characters</li>
                <li>⭐ Celebrity influence</li>
                <li>📱 Social media and internet culture</li>
                <li>📚 Historical and cultural traditions</li>
                <li>🌍 Globalization and cross-cultural naming</li>
              </ul>

            </div>

          </div>

          {/* Section 2 */}

          <div>

            <h2 className="text-2xl font-bold mb-6">How the Name Popularity Checker Works</h2>

            <div className="grid md:grid-cols-3 gap-6">

              <div className="p-6 border rounded-xl bg-card">
                <h3 className="font-semibold mb-2">Step 1: Enter a Name</h3>
                <p className="text-sm text-muted-foreground">
                  Simply type any name into the search field above. The system will instantly retrieve popularity data associated with that name.
                </p>
              </div>

              <div className="p-6 border rounded-xl bg-card">
                <h3 className="font-semibold mb-2">Step 2: View Rankings</h3>
                <p className="text-sm text-muted-foreground">
                  The tool calculates an approximate ranking based on historical data and displays an estimate of how many people share the name globally.
                </p>
              </div>

              <div className="p-6 border rounded-xl bg-card">
                <h3 className="font-semibold mb-2">Step 3: Explore Trends</h3>
                <p className="text-sm text-muted-foreground">
                  Visual popularity bars show how the name has evolved across decades, revealing whether it is rising, declining, or staying consistent.
                </p>
              </div>

            </div>

          </div>

          {/* Section 3 */}

          <div className="grid md:grid-cols-2 gap-12">

            <div>

              <h2 className="text-2xl font-bold mb-4">Why Name Popularity Matters</h2>

              <p className="text-muted-foreground mb-4">
                For parents, understanding name popularity helps strike the right balance between uniqueness and familiarity. Some parents prefer distinctive names that stand out, while others appreciate classic names that feel timeless and widely recognized.
              </p>

              <p className="text-muted-foreground">
                Data-driven insights allow families to make informed decisions rather than relying on guesswork. For example, a name that seems uncommon may actually rank within the top 20 baby names in a particular country.
              </p>

            </div>

            <div className="p-8 rounded-xl border bg-card">

              <h3 className="font-semibold mb-4">Benefits of Checking Name Popularity</h3>

              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>📊 Identify whether a name is rare or common</li>
                <li>📈 Discover rising trends before they peak</li>
                <li>📉 Avoid names that are quickly losing popularity</li>
                <li>⏳ Find timeless names that remain stable</li>
              </ul>

            </div>

          </div>

          {/* Section 4 */}

          <div>

            <h2 className="text-2xl font-bold mb-6">The Data Behind Name Popularity</h2>

            <p className="text-muted-foreground mb-4">
              The data used by name popularity tools often originates from large public datasets such as national birth registries, census reports, and demographic studies. Governments track millions of births each year, recording the names given to newborns.
            </p>

            <p className="text-muted-foreground">
              By analyzing these records across decades, researchers can detect patterns that reveal how naming preferences evolve over time. For instance, traditional names often experience revival cycles every 80–100 years as new generations rediscover them.
            </p>

          </div>

          {/* Section 5 */}

          <div className="grid md:grid-cols-2 gap-12 items-start">

            <div>

              <h2 className="text-2xl font-bold mb-4">Examples of Popular Name Trends</h2>

              <p className="text-muted-foreground mb-4">
                Throughout history, certain names have experienced dramatic rises and falls in popularity. Cultural moments often trigger these shifts.
              </p>

              <p className="text-muted-foreground">
                For example, the name "Jennifer" surged dramatically during the 1970s and remained one of the most popular names for decades. Similarly, names like "Luna" and "Aria" have seen rapid growth in the 2010s.
              </p>

            </div>

            <div className="p-8 rounded-xl border bg-secondary/30">

              <h3 className="font-semibold mb-3">Common Trend Patterns</h3>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>📈 Sudden popularity spikes</li>
                <li>📉 Long-term decline</li>
                <li>🔄 Vintage revival cycles</li>
                <li>⏳ Consistent timeless popularity</li>
              </ul>

            </div>

          </div>

          {/* FAQ Section */}

          <div className="max-w-3xl mx-auto">

            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>

            <div className="space-y-6">

              <div className="p-6 border rounded-xl">
                <h3 className="font-semibold mb-2">How accurate is the Name Popularity Checker?</h3>
                <p className="text-sm text-muted-foreground">
                  The popularity data is derived from large historical datasets and demographic statistics, making it a reliable approximation of real-world naming patterns.
                </p>
              </div>

              <div className="p-6 border rounded-xl">
                <h3 className="font-semibold mb-2">Can I search rare or unique names?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. The system can analyze thousands of names and provide approximate popularity metrics.
                </p>
              </div>

              <div className="p-6 border rounded-xl">
                <h3 className="font-semibold mb-2">Why do some names suddenly become trendy?</h3>
                <p className="text-sm text-muted-foreground">
                  Movies, celebrities, viral social media trends, and cultural shifts can rapidly influence naming choices worldwide.
                </p>
              </div>

              <div className="p-6 border rounded-xl">
                <h3 className="font-semibold mb-2">Can popularity trends help predict the future?</h3>
                <p className="text-sm text-muted-foreground">
                  While predictions are not guaranteed, steady upward trends often indicate that a name may continue growing in popularity.
                </p>
              </div>

            </div>

          </div>

          {/* CTA */}

          <div className="text-center py-12">

            <h2 className="text-3xl font-bold mb-4">Check Your Name's Popularity Now</h2>

            <p className="text-muted-foreground max-w-xl mx-auto">
              Curious about how common your name really is? Use the Name Popularity Checker above to instantly discover ranking insights, historical trends, and global estimates.
            </p>

          </div>

        </section>

        <DataFreshness toolName="Name Popularity Checker" />

        <RelatedPosts currentSlug="popularity-checker" tags={["popularity", "charts", "trends", "statistics", "baby names"]} count={12} />
      </main>

      <SiteFooter />

    </div>
  );
};

export default PopularityChecker;
