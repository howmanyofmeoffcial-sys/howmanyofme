import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Your privacy matters. Read the HowManyOfMe privacy policy.",
  alternates: { canonical: "https://howmanyofme.co/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose-content">
          <p>Your privacy is important to us. This privacy policy explains how HowManyOfMe collects, uses, and protects your information.</p>
          <h2>Information We Collect</h2>
          <p>We do not collect, store, or log any personal information. Name searches are anonymous and not associated with any personal identifier.</p>
          <h2>Cookies &amp; Analytics</h2>
          <p>We use Google Analytics to understand how visitors use our site. This service may use cookies. No personally identifiable information is collected.</p>
          <h2>Advertising</h2>
          <p>We use Google AdSense to display advertisements. AdSense may use cookies to serve relevant ads based on your browsing history.</p>
          <h2>Contact</h2>
          <p>If you have questions about this policy, please visit our contact page.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
