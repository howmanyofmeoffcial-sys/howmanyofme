import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PopularityChecker from "@/components/tools/PopularityChecker";

export const metadata: Metadata = {
  title: "Name Popularity Checker — Rank, Trends & Bearers Worldwide",
  description: "Free name popularity checker. Instantly see global rank, decade-by-decade trends, gender split and how many people share any name worldwide.",
  alternates: { canonical: "https://howmanyofme.co/tools/popularity-checker" },
};

export default function Page() {
  return (<div className="min-h-screen bg-background"><SiteHeader /><PopularityChecker /><SiteFooter /></div>);
}
