import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Privacy Policy — HowManyOfMe" description="Privacy policy for HowManyOfMe name statistics platform." />
    <SiteHeader />
    <main className="container py-12 max-w-3xl prose-content">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
      <p>Last updated: March 2026</p>

      <h2>Information We Collect</h2>
      <p>We collect anonymous usage data including search queries and page views to improve our service. We do not collect personally identifiable information unless you voluntarily provide it.</p>

      <h2>Cookies</h2>
      <p>We use essential cookies for site functionality and analytics cookies to understand usage patterns. You can disable cookies in your browser settings.</p>

      <h2>Third-Party Services</h2>
      <p>We may use third-party analytics and advertising services that collect anonymous data. These services have their own privacy policies.</p>

      <h2>Data Security</h2>
      <p>We implement industry-standard security measures to protect any data we collect. Name search data is processed in real-time and not stored in association with any user identity.</p>

      <h2>Contact</h2>
      <p>For privacy-related questions, please contact us through our website.</p>
    </main>
    <SiteFooter />
  </div>
);

export default Privacy;
