import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Search, Home, BookOpen, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-20 text-center max-w-2xl mx-auto">
        <div className="text-8xl font-bold text-primary/20 mb-6">404</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground text-lg mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/" className="p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors">
            <Home className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="font-semibold text-sm">Go Home</div>
          </Link>
          <Link href="/tools" className="p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors">
            <Wrench className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="font-semibold text-sm">Browse Tools</div>
          </Link>
          <Link href="/blog" className="p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors">
            <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="font-semibold text-sm">Read Blog</div>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
