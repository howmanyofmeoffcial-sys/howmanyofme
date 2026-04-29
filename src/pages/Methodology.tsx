import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";

const FAQ = [
  {
    q: "Where does HowManyOfMe get its name data?",
    a: "Primarily from the U.S. Social Security Administration baby names dataset (1880–present), the U.S. Census Bureau surname files, the UK Office for National Statistics, Statistics Canada, the Australian Bureau of Statistics, and demographic indicators published by UNICEF Data and the United Nations Population Division.",
  },
  {
    q: "How accurate are your population estimates?",
    a: "Common names in well-documented countries (e.g. James, Mary in the US) typically land within ±5% of true counts. Rarer names, or names common in countries with less complete birth records, can have ±15–25% uncertainty. Each name page surfaces a confidence indicator.",
  },
  {
    q: "How often is the dataset updated?",
    a: "We refresh source datasets quarterly. The SSA publishes new birth-year data each May, and we re-run the survival model within 30 days of release.",
  },
  {
    q: "Why does my name show 0 results?",
    a: "Either the name has fewer than 5 registered births in any source year (the SSA suppresses these for privacy), or the spelling variant is not in our index. Try a common variant and check our Similar Names tool.",
  },
];

const Methodology = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Methodology — How We Estimate Name Frequency | HowManyOfMe"
      description="Inside our name statistics methodology: government data sources, actuarial survival modelling, migration adjustments, and confidence scoring."
      canonical="https://howmanyofme.co/methodology"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Methodology",
          url: "https://howmanyofme.co/methodology",
          description: "Detailed methodology behind HowManyOfMe's name frequency estimates.",
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
      ]}
    />
    <SiteHeader />
    <main className="container py-12 max-w-3xl prose-content">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Our Methodology</h1>
      <p className="text-lg text-muted-foreground">
        Every estimate on HowManyOfMe is built from public data and a transparent statistical model. This
        page explains exactly how we get from raw birth records to a number like
        "<em>about 4.8 million people are named James in the United States today</em>."
      </p>

      <h2>1. Data Collection</h2>
      <p>
        We aggregate first-name and surname registration data from official government sources across
        80+ countries. Our largest single source is the{" "}
        <a className="text-primary hover:underline" href="https://www.ssa.gov/oact/babynames/" rel="noopener noreferrer" target="_blank">
          U.S. Social Security Administration baby names dataset
        </a>, which records every name given to 5 or more newborns each year since 1880. We pair this
        with surname frequency files from the{" "}
        <a className="text-primary hover:underline" href="https://www.census.gov/topics/population/genealogy/data/2010_surnames.html" rel="noopener noreferrer" target="_blank">
          U.S. Census Bureau
        </a>, and international birth and population indicators published by{" "}
        <a className="text-primary hover:underline" href="https://data.unicef.org/" rel="noopener noreferrer" target="_blank">
          UNICEF Data
        </a>{" "}
        and the United Nations Population Division.
      </p>

      <h2>2. Survival Modeling</h2>
      <p>
        Birth counts alone tell you how many people were ever named something — not how many are still
        alive today. We apply country- and gender-specific actuarial life tables (sourced from the WHO
        Global Health Observatory and the SSA Period Life Table) to estimate the share of each birth
        cohort that is still living. The result is a per-year survival weight applied to historical
        birth counts.
      </p>

      <h2>3. Migration Adjustment</h2>
      <p>
        Pure birth data overstates the resident population for emigration-heavy countries and understates
        it for immigration-heavy ones. We adjust country totals using UN International Migration Stock
        figures, distributing immigrants to their reported country of birth and decaying by years of
        residence.
      </p>

      <h2>4. Confidence Scoring</h2>
      <p>
        Each estimate is published with a confidence band derived from three signals: (a) sample size in
        the source data, (b) data freshness — penalising countries with reporting lags &gt; 3 years, and
        (c) cross-source agreement when multiple datasets cover the same name. Confidence is shown on
        every name page so you can judge how much weight to give the number.
      </p>

      <h2>5. Update Frequency</h2>
      <p>
        Source datasets are pulled on a quarterly cadence. Major refreshes (e.g. the annual SSA release
        in May) trigger a full re-run of survival and migration models, usually within 30 days.
      </p>

      <h2>Frequently Asked Questions</h2>
      <div className="space-y-4 not-prose">
        {FAQ.map((f) => (
          <details key={f.q} className="p-4 rounded-lg border border-border bg-card">
            <summary className="font-semibold cursor-pointer">{f.q}</summary>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <h2 className="mt-10">Read Next</h2>
      <ul>
        <li><a className="text-primary hover:underline" href="/about">About HowManyOfMe</a> — the team and mission</li>
        <li><a className="text-primary hover:underline" href="/tools">All name tools</a> — popularity, comparison, trends</li>
        <li><a className="text-primary hover:underline" href="/blog">Blog</a> — long-form analysis and naming trends</li>
      </ul>
    </main>
    <SiteFooter />
  </div>
);

export default Methodology;
