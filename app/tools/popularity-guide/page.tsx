import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PopularityGuide from "@/components/tools/PopularityGuide";

export const metadata: Metadata = {
  title: "Name Popularity Guide — Understanding Name Rankings",
  description: "Complete guide to understanding name popularity rankings, decade trends, and what the numbers mean. Free resource.",
  alternates: { canonical: "https://howmanyofme.co/tools/popularity-guide" },
};

export default function Page() {
  return (<div className="min-h-screen bg-background"><SiteHeader /><PopularityGuide /><SiteFooter /></div>);
}
