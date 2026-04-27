import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <SEOHead noindex
      title="Terms of Service — HowManyOfMe"
      description="Read the Terms of Service for HowManyOfMe. Understand the rules and guidelines for using our name statistics platform."
      canonical="https://howmanyofme.co/terms"
    />
    <SiteHeader />
    <main className="container py-12 max-w-3xl prose-content">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: March 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using HowManyOfMe ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access the Service.</p>

      <h2>2. Description of Service</h2>
      <p>HowManyOfMe provides estimated name frequency statistics, popularity trends, and related tools for informational and entertainment purposes. All data presented is based on statistical modeling and publicly available records.</p>

      <h2>3. Accuracy of Data</h2>
      <p>While we strive for accuracy, all name statistics, population estimates, and trend data are <strong>estimates only</strong> and should not be treated as definitive or official counts. We source data from government agencies and apply demographic modeling, but results may differ from actual figures.</p>

      <h2>4. Permitted Use</h2>
      <p>You may use the Service for personal, educational, or research purposes. You may not:</p>
      <ul>
        <li>Scrape, crawl, or systematically download data from the Service</li>
        <li>Use the Service for any unlawful purpose</li>
        <li>Attempt to interfere with the Service's infrastructure</li>
        <li>Reproduce or redistribute content without permission</li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>All content, design, and tools on HowManyOfMe are the intellectual property of Ziven Borceg unless otherwise stated. Data sourced from government agencies remains subject to their respective terms.</p>

      <h2>6. Third-Party Links</h2>
      <p>The Service may contain links to third-party websites. We are not responsible for the content or practices of these external sites.</p>

      <h2>7. Limitation of Liability</h2>
      <p>HowManyOfMe is provided "as is" without warranties of any kind. We shall not be liable for any damages arising from the use or inability to use the Service.</p>

      <h2>8. Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the updated terms.</p>

      <h2>9. Contact</h2>
      <p>For questions about these Terms, please visit our <a href="/contact" className="text-primary hover:underline">Contact</a> page.</p>
    </main>
    <SiteFooter />
  </div>
);

export default Terms;
