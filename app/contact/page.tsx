import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ExternalLink, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the HowManyOfMe team.",
  alternates: { canonical: "https://howmanyofme.co/contact" },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-8">Have questions, feedback, or suggestions? We would love to hear from you.</p>
        <div className="space-y-4">
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-2"><Mail className="h-5 w-5 text-primary" /><h2 className="font-bold">Email</h2></div>
            <p className="text-muted-foreground text-sm">Reach us at hello@howmanyofme.co</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-2"><ExternalLink className="h-5 w-5 text-primary" /><h2 className="font-bold">Medium</h2></div>
            <a href="https://medium.com/@zivenborceg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">Follow on Medium →</a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
