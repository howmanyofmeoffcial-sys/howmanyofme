import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string; // omit for current page
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

const SITE = "https://howmanyofme.co";

/**
 * Accessible breadcrumb trail with embedded BreadcrumbList JSON-LD.
 * Use on /name/* and /names/* (and any other indexable hierarchy).
 */
const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: c.href ? `${SITE}${c.href}` : undefined,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
        <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
          {items.map((c, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={`${c.label}-${i}`} className="inline-flex items-center gap-1.5">
                {c.href && !isLast ? (
                  <Link to={c.href} className="hover:text-primary transition-colors">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium" aria-current="page">
                    {c.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default Breadcrumbs;
