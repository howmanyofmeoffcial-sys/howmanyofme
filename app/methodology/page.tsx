import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Our Methodology",
  description: "Learn how HowManyOfMe calculates name statistics using government data, actuarial modeling, and migration adjustment.",
  alternates: { canonical: "https://howmanyofme.co/methodology" },
};

export default function MethodologyPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://howmanyofme.co/" },
        { "@type": "ListItem", "position": 2, "name": "Methodology", "item": "https://howmanyofme.co/methodology" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {jsonLd.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <SiteHeader />
      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Our Methodology</h1>
        <div className="prose-content">
          <p>HowManyOfMe uses a multi-step process to estimate <Link href="/" className="text-primary hover:underline">how many people have your name</Link> worldwide.</p>
          <h2>Data Sources</h2>
          <p>We aggregate data from official government sources including the U.S. Social Security Administration (350M+ records since 1880), UK ONS, Statistics Canada, Australian ABS, Eurostat, and peer-reviewed academic research across 80+ countries. Our <Link href="/tools/popularity-checker" className="text-primary hover:underline">Name Popularity Checker</Link> relies on these primary registries.</p>
          <h2>Survival Modeling</h2>
          <p>Raw birth counts are adjusted using actuarial life tables from the <a href="https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">World Health Organization (WHO)</a> and CDC to estimate how many bearers from each birth year are still alive today.</p>
          <h2>Migration Adjustment</h2>
          <p>International migration flow data from the <a href="https://unstats.un.org/unsd/demographic-social/sconcerns/migration/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">UN Statistics Division</a> adjusts country-specific estimates to account for people moving between countries.</p>
          <h2>Confidence Scoring</h2>
          <p>Each estimate receives a confidence score — typically ±5% for common names in well-documented countries, and ±15-25% for rarer names with less data. You can try testing a rare name using our <Link href="/tools/unique-name-generator" className="text-primary hover:underline">Unique Name Generator</Link>.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
