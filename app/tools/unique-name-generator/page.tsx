import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import UniqueNameGenerator from "@/components/tools/UniqueNameGenerator";

export const metadata: Metadata = {
  title: "Name Rarity Score — How Rare Is Your Name?",
  description: "Check your name rarity score. Find out if your name is common, uncommon, rare, or ultra-rare. Free, instant results.",
  alternates: { canonical: "https://howmanyofme.co/tools/unique-name-generator" },
};

export default function Page() {
  return (<div className="min-h-screen bg-background"><SiteHeader /><UniqueNameGenerator /><SiteFooter /></div>);
}
