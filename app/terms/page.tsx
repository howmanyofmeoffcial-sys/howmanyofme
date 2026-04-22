import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing your use of HowManyOfMe.",
  alternates: { canonical: "https://howmanyofme.co/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
        <div className="prose-content">
          <p>By using HowManyOfMe, you agree to these terms of service.</p>
          <h2>Use of Service</h2>
          <p>HowManyOfMe provides name statistics for informational and entertainment purposes only. All data is estimated and should not be relied upon for legal, medical, or financial decisions.</p>
          <h2>Accuracy</h2>
          <p>While we strive for accuracy, all statistics are estimates based on available data sources. We make no guarantees about the precision of any individual name count.</p>
          <h2>Intellectual Property</h2>
          <p>The content, design, and functionality of this website are protected by copyright. The underlying name data is sourced from public-domain government datasets.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
