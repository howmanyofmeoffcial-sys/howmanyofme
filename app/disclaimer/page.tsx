import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Data accuracy and limitations disclaimer for HowManyOfMe.",
  alternates: { canonical: "https://howmanyofme.co/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Disclaimer</h1>
        <div className="prose-content">
          <p>The information provided on HowManyOfMe is for general informational purposes only. All name statistics are estimates based on publicly available data sources.</p>
          <h2>No Guarantees</h2>
          <p>We do not guarantee the accuracy, completeness, or reliability of any data displayed on this site. Estimates may vary from actual figures due to data limitations, modeling assumptions, and coverage gaps.</p>
          <h2>Not Professional Advice</h2>
          <p>Nothing on this site constitutes legal, financial, medical, or professional advice. Do not make important decisions based solely on name statistics from this tool.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
