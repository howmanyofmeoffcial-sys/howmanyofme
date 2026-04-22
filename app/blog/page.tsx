import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BlogIndexClient from "./BlogIndexClient";
import { blogArticles } from "@/data/blogData";

export const metadata: Metadata = {
  title: "Baby Name Blog — Trends, Guides & Insights",
  description: "Explore baby name trends, guides, popularity data, and expert insights. Articles on naming trends, regional data, and name meanings.",
  alternates: { canonical: "https://howmanyofme.co/blog" },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12">
        <div className="max-w-3xl mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Baby Name Blog</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">Data-driven articles, guides, and insights about baby names — from popularity trends and regional data to naming guides and expert analysis.</p>
        </div>
        <BlogIndexClient articles={blogArticles} />
      </main>
      <SiteFooter />
    </div>
  );
}
