import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NameComparison from "@/components/tools/NameComparison";

export const metadata: Metadata = {
  title: "Name Comparison Tool — Compare Two Names Head-to-Head",
  description: "Compare any two names side-by-side: popularity, bearers, trends, gender split, and regional distribution. Free tool.",
  alternates: { canonical: "https://howmanyofme.co/tools/name-comparison" },
};

export default function Page() {
  return (<div className="min-h-screen bg-background"><SiteHeader /><NameComparison /><SiteFooter /></div>);
}
