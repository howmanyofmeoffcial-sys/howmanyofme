import { useEffect, useRef, useState, memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Wrench, FileText, Tag } from "lucide-react";
import { getRelatedContent, topicHubs, type ContentItem } from "@/data/contentRegistry";

interface RelatedPostsProps {
  currentSlug: string;
  tags: string[];
  count?: number;
}

const RelatedPosts = memo(({ currentSlug, tags, count = 12 }: RelatedPostsProps) => {
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<ContentItem[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // Lazy load: only compute and render when scrolled into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible) {
      setItems(getRelatedContent(currentSlug, tags, count));
    }
  }, [visible, currentSlug, tags, count]);

  // Relevant topic hubs based on current tags
  const relevantHubs = topicHubs.filter(hub =>
    tags.some(t => t.toLowerCase().includes(hub.tag) || hub.tag.includes(t.toLowerCase()))
  ).slice(0, 5);

  return (
    <div ref={ref} className="mt-12 md:mt-16">
      {visible && items.length > 0 && (
        <section aria-label="Related content">
          {/* Topic hubs */}
          {relevantHubs.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Tag className="h-3.5 w-3.5" />
                Explore Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {relevantHubs.map(hub => (
                  <Link
                    key={hub.tag}
                    to={hub.path}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-secondary/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    {hub.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tags display */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Article Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 8).map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs rounded-md bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Related posts grid */}
          <div className="pt-6 border-t border-border">
            <h2 className="font-display text-2xl font-bold mb-2">You May Also Like</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Explore related articles and tools based on this topic
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => (
                <Link
                  key={item.slug}
                  to={item.path}
                  className="group flex flex-col p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    {item.type === "tool" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                        <Wrench className="h-3 w-3" />
                        Tool
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent-foreground">
                        <FileText className="h-3 w-3" />
                        Article
                      </span>
                    )}
                    {item.readTime && (
                      <span className="text-[10px] text-muted-foreground">{item.readTime} min</span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold leading-snug mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-primary font-medium mt-3 pt-2.5 border-t border-border/50 group-hover:gap-2 transition-all">
                    {item.type === "tool" ? "Try it" : "Read more"}
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
});

RelatedPosts.displayName = "RelatedPosts";

export default RelatedPosts;
