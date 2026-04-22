import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TrendVisualizer from "@/components/tools/TrendVisualizer";

export const metadata: Metadata = {
  title: "Name Trend Visualizer — Chart Name Popularity Over Time",
  description: "Visualize name popularity trends over decades. Compare up to 4 names on an interactive chart. Free tool.",
  alternates: { canonical: "https://howmanyofme.co/tools/trend-visualizer" },
};

export default function Page() {
  return (<div className="min-h-screen bg-background"><SiteHeader /><TrendVisualizer /><SiteFooter /></div>);
}
