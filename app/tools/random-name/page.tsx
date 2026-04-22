import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RandomNameGenerator from "@/components/tools/RandomNameGenerator";

export const metadata: Metadata = {
  title: "Random Name Generator — Get Instant Name Ideas",
  description: "Generate random baby names filtered by gender. Get instant ideas from 100M+ records. Free, no signup.",
  alternates: { canonical: "https://howmanyofme.co/tools/random-name" },
};

export default function Page() {
  return (<div className="min-h-screen bg-background"><SiteHeader /><RandomNameGenerator /><SiteFooter /></div>);
}
