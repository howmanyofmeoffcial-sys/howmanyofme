import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { TrendingUp, Shuffle, Baby, User, BookOpen, Globe, GitCompare, LineChart, Sparkles, HelpCircle } from "lucide-react";
import RelatedPosts from "@/components/RelatedPosts";

const tools = [
  { icon: TrendingUp, title: "Name Popularity Checker", desc: "Track how any name's popularity has changed decade by decade with detailed charts.", link: "/tools/popularity-checker" },
  { icon: GitCompare, title: "Name Popularity Comparison", desc: "Compare two names side by side — popularity, trends, and regional differences.", link: "/tools/name-comparison" },
  { icon: LineChart, title: "Baby Name Trend Visualizer", desc: "Visualize popularity trends for up to 4 names with interactive time-series charts.", link: "/tools/trend-visualizer" },
  { icon: Sparkles, title: "Unique Baby Name Generator", desc: "Discover rare and unique baby names with customizable filters for gender and popularity.", link: "/tools/unique-name-generator" },
  { icon: Shuffle, title: "Random Name Generator", desc: "Generate random names from our database with filters for gender and origin.", link: "/tools/random-name" },
  { icon: Baby, title: "Baby Name Ideas", desc: "Browse curated baby name suggestions filtered by letter and gender.", link: "/tools/baby-names" },
  { icon: User, title: "Username Generator", desc: "Create unique username ideas based on any name for social media and gaming.", link: "/tools/username-generator" },
  { icon: BookOpen, title: "Name Meaning Lookup", desc: "Discover the etymology, origin, and cultural significance of any name.", link: "/tools/meaning" },
  { icon: Globe, title: "How Many People Have My Name?", desc: "Find out how many people worldwide share your name with detailed statistics.", link: "/" },
  { icon: HelpCircle, title: "How to Use the Popularity Checker", desc: "Step-by-step guide to getting the most out of our name popularity tools.", link: "/tools/popularity-guide" },
];

const ToolsPage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Name Tools & Utilities | HowManyOfMe" description="Free name tools: popularity checker, comparison tool, trend visualizer, unique name generator, baby name ideas, and more." />
    <SiteHeader />
    <main className="container py-12">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Name Tools & Utilities</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        Explore our suite of free name tools, all powered by our database of 100 million+ names.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <Link key={tool.title} to={tool.link} className="group p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all">
            <tool.icon className="h-10 w-10 text-primary mb-4" />
            <h2 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">{tool.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{tool.desc}</p>
          </Link>
        ))}
      </div>
      <RelatedPosts currentSlug="tools-page" tags={["tools", "baby names", "popularity", "generator", "trends"]} count={12} />
    </main>
    <SiteFooter />
  </div>
);

export default ToolsPage;
