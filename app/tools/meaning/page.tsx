import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MeaningLookup from "@/components/tools/MeaningLookup";

export const metadata: Metadata = {
  title: "Name Meaning & Origin Lookup — Discover What Your Name Means",
  description: "Look up the meaning, origin, and cultural background of any name. Free, instant results from our database of 100M+ names.",
  alternates: { canonical: "https://howmanyofme.co/tools/meaning" },
};

export default function Page() {
  return (<div className="min-h-screen bg-background"><SiteHeader /><MeaningLookup /><SiteFooter /></div>);
}
