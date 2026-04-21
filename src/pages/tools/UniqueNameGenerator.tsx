import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { getNamesForLetter, getNameData, formatNumber, ALPHABET } from "@/data/nameData";
import RelatedPosts from "@/components/RelatedPosts";

const UniqueNameGenerator = () => {
  const [gender, setGender] = useState("any");
  const [maxPop, setMaxPop] = useState(5000);
  const [results, setResults] = useState<string[]>([]);

  const generate = () => {
    const allNames = ALPHABET.flatMap(l => getNamesForLetter(l));

    const filtered = allNames.filter(n => {
      const d = getNameData(n);

      const genderOk = gender === "any" || d.gender === gender || d.gender === "unisex";

      return genderOk && d.count <= maxPop;
    });

    const shuffled = filtered.sort(() => Math.random() - 0.5);

    setResults([...new Set(shuffled.slice(0, 12))]);
  };

  return (

    <div className="min-h-screen bg-background">

      <SEOHead
        title="Unique Baby Name Generator | HowManyOfMe"
        description="Generate unique and rare baby name ideas with customizable filters for gender and popularity. Discover uncommon baby names instantly."
      />

      <SiteHeader />

      <main className="container py-12 max-w-3xl">

        <h1 className="font-display text-4xl font-bold mb-4">Unique Baby Name Generator</h1>

        <p className="text-muted-foreground mb-8">
          Find rare and unique baby names. Filter by gender and set a maximum popularity threshold to discover hidden gem names.
        </p>

        <div className="flex flex-wrap gap-4 mb-6 items-end">

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Gender</label>

            <select
              value={gender}
              onChange={e => setGender(e.target.value)}
              className="h-10 rounded-md border border-input bg-secondary px-3 text-sm"
            >
              <option value="any">Any Gender</option>
              <option value="male">Boy Names</option>
              <option value="female">Girl Names</option>
            </select>

          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Max Popularity (people)</label>

            <select
              value={maxPop}
              onChange={e => setMaxPop(Number(e.target.value))}
              className="h-10 rounded-md border border-input bg-secondary px-3 text-sm"
            >
              <option value={1000}>Under 1,000</option>
              <option value={5000}>Under 5,000</option>
              <option value={10000}>Under 10,000</option>
              <option value={50000}>Under 50,000</option>
            </select>

          </div>

          <button
            onClick={generate}
            className="h-10 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Generate
          </button>

        </div>

        {results.length > 0 && (

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {results.map(n => {

              const d = getNameData(n);

              return (

                <Link
                  key={n}
                  to={`/name/${n}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
                >

                  <div>
                    <span className="font-semibold">{n}</span>
                    <span className="text-xs text-muted-foreground ml-2 capitalize">{d.gender}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">~{formatNumber(d.count)}</span>
                    <span className="text-xs text-muted-foreground ml-2">Rank #{formatNumber(d.rank)}</span>
                  </div>

                </Link>

              );

            })}

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
                    "name": "What is a unique baby name generator?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "A unique baby name generator helps parents discover rare or uncommon names by filtering popularity data and suggesting names that are used by fewer people."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How do you find rare baby names?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Rare baby names are typically found by analyzing popularity datasets and selecting names that have lower usage counts across birth records."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Why are unique baby names becoming popular?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Modern parents often prefer distinctive names to give their child a unique identity rather than choosing very common names."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Are rare names better than common names?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Both rare and common names have advantages. Rare names stand out, while common names are familiar and easy to recognize."
                    }
                  }
                ]
              })
            }}
          />


          {/* ARTICLE INTRO */}

          <div className="max-w-3xl mx-auto text-center">

            <h1 className="font-display text-4xl font-bold mb-6">
              Unique Baby Name Generator: Discover Rare and Beautiful Name Ideas
            </h1>

            <p className="text-lg text-muted-foreground">
              When parents start searching for baby names, they often discover the same lists appearing everywhere. Names like Emma, Liam, Noah, and Olivia dominate popularity charts year after year. While these names are beautiful, many parents today want something a little different — a name that feels special, rare, and memorable.
            </p>

            <p className="text-muted-foreground mt-4">
              This is where a <strong>Unique Baby Name Generator</strong> becomes incredibly useful. Instead of manually browsing hundreds of name lists, the tool instantly generates uncommon names based on popularity data and customizable filters.
            </p>

          </div>


          {/* SECTION 1 */}

          <div className="grid md:grid-cols-2 gap-12">

            <div>

              <h2 className="text-2xl font-bold mb-4">Why Parents Are Choosing Unique Baby Names</h2>

              <p className="text-muted-foreground mb-4">
                In previous generations, it was common for classrooms to have multiple students with the same name. For example, names like Michael, Jennifer, and David were so popular that teachers often had to add last initials to distinguish students.
              </p>

              <p className="text-muted-foreground">
                Today, many parents prefer names that are distinctive yet meaningful. A unique name helps children stand out while still feeling culturally relevant.
              </p>

            </div>

            <div className="p-8 border rounded-xl bg-secondary/30">

              <h3 className="font-semibold mb-3">Reasons Parents Choose Rare Names</h3>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✨ Individuality and identity</li>
                <li>🌍 Cultural inspiration</li>
                <li>📚 Literary or mythological origins</li>
                <li>🎬 Influence from movies and media</li>
                <li>🌿 Nature inspired names</li>
              </ul>

            </div>

          </div>


          {/* SECTION 2 */}

          <div>

            <h2 className="text-2xl font-bold mb-6">How the Unique Name Generator Works</h2>

            <div className="grid md:grid-cols-3 gap-6">

              <div className="p-6 border rounded-xl bg-card">
                <h3 className="font-semibold mb-2">Step 1: Choose Gender</h3>
                <p className="text-sm text-muted-foreground">Select boy, girl, or unisex names.</p>
              </div>

              <div className="p-6 border rounded-xl bg-card">
                <h3 className="font-semibold mb-2">Step 2: Set Popularity Limit</h3>
                <p className="text-sm text-muted-foreground">Control how rare the names should be by adjusting popularity limits.</p>
              </div>

              <div className="p-6 border rounded-xl bg-card">
                <h3 className="font-semibold mb-2">Step 3: Generate Ideas</h3>
                <p className="text-sm text-muted-foreground">The generator produces unique names instantly based on filters.</p>
              </div>

            </div>

          </div>


          {/* SECTION 3 */}

          <div className="grid md:grid-cols-2 gap-12">

            <div>

              <h2 className="text-2xl font-bold mb-4">Understanding Name Popularity Data</h2>

              <p className="text-muted-foreground mb-4">
                Name popularity is typically measured using birth records and census statistics. These datasets track how frequently certain names appear each year.
              </p>

              <p className="text-muted-foreground">
                By filtering names that appear less frequently, the generator highlights hidden gems that many parents may never discover otherwise.
              </p>

            </div>

            <div className="p-8 border rounded-xl bg-card">

              <h3 className="font-semibold mb-3">Common Unique Name Styles</h3>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>🌿 Nature names (River, Willow)</li>
                <li>🏛 Mythology names (Atlas, Freya)</li>
                <li>✨ Vintage revivals (Arthur, Eleanor)</li>
                <li>🌍 Global inspired names</li>
              </ul>

            </div>

          </div>


          {/* FAQ UI */}

          <div className="max-w-3xl mx-auto">

            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>

            <div className="space-y-6">

              <div className="p-6 border rounded-xl">
                <h3 className="font-semibold mb-2">What is a unique baby name generator?</h3>
                <p className="text-sm text-muted-foreground">It generates uncommon baby name ideas using popularity filters.</p>
              </div>

              <div className="p-6 border rounded-xl">
                <h3 className="font-semibold mb-2">How do I find rare baby names?</h3>
                <p className="text-sm text-muted-foreground">Use tools that filter names by popularity and rarity.</p>
              </div>

              <div className="p-6 border rounded-xl">
                <h3 className="font-semibold mb-2">Are unique names trending?</h3>
                <p className="text-sm text-muted-foreground">Yes, modern parents increasingly prefer distinctive names.</p>
              </div>

              <div className="p-6 border rounded-xl">
                <h3 className="font-semibold mb-2">Can rare names become popular?</h3>
                <p className="text-sm text-muted-foreground">Yes, many names start rare but gain popularity through culture and media.</p>
              </div>

            </div>

          </div>


          {/* CTA */}

          <div className="text-center py-12">

            <h2 className="text-3xl font-bold mb-4">Generate Unique Baby Names Now</h2>

            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover hidden gem names instantly using the generator above and find the perfect unique name for your baby.
            </p>

          </div>

        </section>

        <RelatedPosts currentSlug="unique-name-generator" tags={["unique names", "rare names", "generator", "baby names"]} count={12} />

      </main>

      <SiteFooter />

    </div>
  );
};

export default UniqueNameGenerator;
