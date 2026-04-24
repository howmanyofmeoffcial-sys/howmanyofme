import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { TrendingUp, Sparkles, Globe, MapPin, User, Users, BookOpen, Zap, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Name Tools — Popularity, Rarity, Trends & More",
  description: "Free name tools: popularity checker, rarity score, trend visualizer, baby name browser, comparison tool, and more. No signup required.",
  alternates: { canonical: "https://howmanyofme.co/tools" },
};

const tools = [
  { icon: TrendingUp, title: "Name Popularity Checker", desc: "See how many people share your name worldwide.", link: "/tools/popularity-checker" },
  { icon: Sparkles, title: "Name Rarity Score", desc: "Find out if your name is rare or common.", link: "/tools/unique-name-generator" },
  { icon: Globe, title: "Global Name Search", desc: "Explore name popularity by country.", link: "/" },
  { icon: MapPin, title: "Name Distribution Map", desc: "Visualize where your name is most common.", link: "/tools/trend-visualizer" },
  { icon: User, title: "Gender Prediction", desc: "Discover common gender usage of your name.", link: "/tools/meaning" },
  { icon: Users, title: "Name Comparison", desc: "Compare popularity between two names.", link: "/tools/name-comparison" },
  { icon: BookOpen, title: "Name Meaning & Origin", desc: "Learn meaning and cultural background.", link: "/tools/meaning" },
  { icon: Zap, title: "Trending Names", desc: "See names gaining popularity right now.", link: "/tools/trend-visualizer" },
  { icon: Clock, title: "Top Names by Year", desc: "Explore names by decade trends.", link: "/tools/popularity-checker" },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Name Tools</h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl">Free, instant tools built on 100M+ name records — no signup required.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map(tool => (
            <Link key={tool.title} href={tool.link} className="group relative flex flex-col gap-3 p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-200">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                <tool.icon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{tool.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{tool.desc}</p>
              <div className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-1">Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
