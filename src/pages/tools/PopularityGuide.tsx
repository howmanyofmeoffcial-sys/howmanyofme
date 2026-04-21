import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { CheckCircle, ArrowRight } from "lucide-react";
import RelatedPosts from "@/components/RelatedPosts";
import DataFreshness from "@/components/DataFreshness";

const steps = [
  { title: "Enter a Name", desc: "Type any first name into the search box. Our tool accepts names from any origin, language, or cultural tradition." },
  { title: "View the Results", desc: "You'll see the estimated number of people with that name, its popularity rank, and a gender distribution breakdown." },
  { title: "Explore Historical Trends", desc: "The decade popularity chart shows how the name's popularity has changed from the 1900s to today." },
  { title: "Check Regional Data", desc: "See how the name is distributed across different countries and regions worldwide." },
  { title: "Discover Similar Names", desc: "Find related names, alternative spellings, and names with similar origins or meanings." },
  { title: "Compare Names", desc: "Use our comparison tool to see two names side by side with detailed statistical analysis." },
];

const PopularityGuide = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="How to Use the Name Popularity Checker: Step-by-Step | HowManyOfMe" description="A complete step-by-step guide on using the HowManyOfMe Name Popularity Checker to find name statistics, trends, and rankings." />
    <SiteHeader />
    <main className="container py-12 max-w-3xl">
      <h1 className="font-display text-4xl font-bold mb-4">How to Use the Name Popularity Checker</h1>
      <p className="text-muted-foreground mb-10 text-lg">A step-by-step guide to getting the most out of our name popularity tools.</p>
      <div className="space-y-6 mb-12">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{i + 1}</div>
            <div>
              <h2 className="font-display text-lg font-bold mb-1">{step.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-6">
        <h2 className="font-display text-xl font-bold mb-3">Tips for Best Results</h2>
        <ul className="space-y-2">
          {["Use the standard spelling for the most accurate data", "Try alternative spellings to see how variants compare", "Check decade trends to see if a name is rising or falling", "Use the comparison tool when deciding between two names"].map(tip => (
            <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />{tip}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/tools/popularity-checker" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">Try the Popularity Checker <ArrowRight className="h-4 w-4" /></Link>
        <Link to="/tools/name-comparison" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card font-semibold text-sm hover:bg-secondary transition-colors">Compare Names <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <DataFreshness toolName="Popularity Checker Guide" />
      <RelatedPosts currentSlug="popularity-guide" tags={["guide", "popularity", "help", "charts", "statistics"]} count={12} />
    </main>
    <SiteFooter />
  </div>
);

export default PopularityGuide;
