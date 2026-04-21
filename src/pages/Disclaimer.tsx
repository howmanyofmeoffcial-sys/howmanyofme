import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";

const Disclaimer = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Disclaimer — HowManyOfMe"
      description="Read the disclaimer for HowManyOfMe. Understand the limitations of our name statistics data and estimates."
      canonical="https://howmanyofme.co/disclaimer"
    />
    <SiteHeader />
    <main className="container py-12 max-w-3xl prose-content">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Disclaimer</h1>
      <p className="text-muted-foreground mb-8">Last updated: March 2026</p>

      <h2>General Information</h2>
      <p>The information provided on HowManyOfMe (howmanyofme.co) is for general informational and entertainment purposes only. All name frequency statistics, population estimates, and trend analyses presented on this website are <strong>estimates</strong> derived from statistical modeling and publicly available government data.</p>

      <h2>No Guarantee of Accuracy</h2>
      <p>While we make every effort to ensure the accuracy of our data, we cannot guarantee that the information on this site is complete, current, or error-free. Actual name frequencies may vary due to factors including but not limited to:</p>
      <ul>
        <li>Variations in data collection methods across countries</li>
        <li>Time lag in official data publication</li>
        <li>Limitations in demographic modeling</li>
        <li>Immigration and emigration patterns not captured in source data</li>
        <li>Names not registered in official government systems</li>
      </ul>

      <h2>Not Professional Advice</h2>
      <p>The content on this website does not constitute legal, medical, financial, or professional advice of any kind. Do not make important decisions based solely on data from this website.</p>

      <h2>Third-Party Data Sources</h2>
      <p>Our data is derived from publicly available records from agencies including the U.S. Social Security Administration, UK Office for National Statistics, Statistics Canada, and others. We are not affiliated with these agencies, and they do not endorse this website.</p>

      <h2>External Links</h2>
      <p>This website may contain links to external sites. We are not responsible for the content, accuracy, or practices of any third-party websites.</p>

      <h2>Changes</h2>
      <p>We reserve the right to update this disclaimer at any time without notice. Your continued use of the website constitutes acceptance of any changes.</p>

      <h2>Contact</h2>
      <p>If you have questions about this disclaimer, please visit our <a href="/contact" className="text-primary hover:underline">Contact</a> page.</p>
    </main>
    <SiteFooter />
  </div>
);

export default Disclaimer;
