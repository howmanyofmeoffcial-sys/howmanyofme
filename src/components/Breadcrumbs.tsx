import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => (
  <nav className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`} aria-label="Breadcrumb">
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-2">
        {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
        {item.href ? (
          <Link href={item.href} className="hover:text-primary transition-colors">
            {item.label}
          </Link>
        ) : (
          <span className="text-foreground truncate max-w-[200px]">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumbs;
