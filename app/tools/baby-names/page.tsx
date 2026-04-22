import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BabyNames from "@/components/tools/BabyNames";

export const metadata: Metadata = {
  title: "Baby Name Ideas — Browse by Gender & Letter",
  description: "Browse baby name ideas filtered by gender and starting letter. See popularity data for each name. Free, no signup.",
  alternates: { canonical: "https://howmanyofme.co/tools/baby-names" },
};

export default function Page() {
  return (<div className="min-h-screen bg-background"><SiteHeader /><BabyNames /><SiteFooter /></div>);
}
