import Link from "next/link";
import { getRelatedContent } from "@/data/contentRegistry";
import { Clock, ArrowRight } from "lucide-react";

interface RelatedPostsProps {
  currentSlug: string;
  tags: string[];
  count?: number;
}

const RelatedPosts = ({ currentSlug, tags, count = 12 }: RelatedPostsProps) => {
  const items = getRelatedContent(currentSlug, tags, count);

  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold mb-6">Related Articles & Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <Link
            key={item.slug}
            href={item.path}
            className="group flex flex-col p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all"
          >
            <span className={`self-start px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-2 ${
              item.type === "tool" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
            }`}>
              {item.type === "tool" ? "Tool" : item.category || "Article"}
            </span>
            <h3 className="font-bold text-sm mb-1.5 group-hover:text-primary transition-colors leading-snug line-clamp-2">
              {item.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{item.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-2 border-t border-border">
              {item.readTime && (
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.readTime} min</span>
              )}
              <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all ml-auto">
                {item.type === "tool" ? "Try it" : "Read"} <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
