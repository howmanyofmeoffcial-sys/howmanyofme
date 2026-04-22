"use client";

import { useState } from "react";
import Link from "next/link";
import { blogCategories, type BlogArticle } from "@/data/blogData";
import { TrendingUp, BookOpen, MapPin, HelpCircle, Clock, ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ElementType> = { TrendingUp, BookOpen, MapPin, HelpCircle };

const categoryColors: Record<BlogArticle["category"], string> = {
  trends: "bg-primary/10 text-primary",
  guides: "bg-accent/10 text-accent",
  location: "bg-orange-100 text-orange-700",
  help: "bg-purple-100 text-purple-700",
};

interface Props {
  articles: BlogArticle[];
}

export default function BlogIndexClient({ articles }: Props) {
  const [active, setActive] = useState<BlogArticle["category"] | "all">("all");
  const filtered = active === "all" ? articles : articles.filter(a => a.category === active);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        <button onClick={() => setActive("all")} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${active === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-primary/10"}`}>
          All Articles ({articles.length})
        </button>
        {blogCategories.map(cat => {
          const Icon = iconMap[cat.icon];
          const count = articles.filter(a => a.category === cat.id).length;
          return (
            <button key={cat.id} onClick={() => setActive(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${active === cat.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-primary/10"}`}>
              {Icon && <Icon className="h-4 w-4" />}
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {active === "all" && (
        <Link href={`/blog/${articles[0].slug}`} className="group block mb-10 rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-8 md:p-10">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${categoryColors[articles[0].category]}`}>Featured</span>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">{articles[0].title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4 max-w-2xl">{articles[0].description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{articles[0].readTime} min read</span>
              <span>{new Date(articles[0].date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(active === "all" ? filtered.slice(1) : filtered).map(article => (
          <Link key={article.slug} href={`/blog/${article.slug}`} className="group flex flex-col p-6 rounded-xl border border-border bg-card hover:shadow-md transition-all">
            <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold mb-3 ${categoryColors[article.category]}`}>
              {blogCategories.find(c => c.id === article.category)?.label}
            </span>
            <h2 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors leading-snug">{article.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{article.description}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-3 border-t border-border">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.readTime} min</span>
              <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">Read <ArrowRight className="h-3.5 w-3.5" /></span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
