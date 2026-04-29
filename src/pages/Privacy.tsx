import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Privacy Policy — HowManyOfMe"
      description="How HowManyOfMe collects, uses, and protects data — including cookies, analytics, advertising, and your GDPR/CCPA rights."
      canonical="https://howmanyofme.co/privacy"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Privacy Policy",
        url: "https://howmanyofme.co/privacy",
        description: "Privacy practices, cookies, advertising disclosures and user rights for HowManyOfMe.",
      }}
    />
    <SiteHeader />
    <main className="container py-12 max-w-3xl prose-content">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: April 2026</p>

      <p>
        HowManyOfMe ("we", "us", "the Service") is operated by Ziven Borceg. This policy explains what
        information we collect when you visit <strong>howmanyofme.co</strong>, how we use it, who we share
        it with, and the choices you have. We designed the Service to answer one simple question — "how
        many people have my name?" — without asking you to sign up or share personal details.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We collect two kinds of information. First, <strong>name searches you type</strong> into our tools
        (e.g. "James" or "Olivia"). These are processed in real time against public datasets and are not
        linked to you personally. Second, we collect <strong>standard web analytics</strong> — pages
        viewed, referring site, approximate region (country/state level), device type, and timestamps.
        We do not ask for, and we do not knowingly store, your name, email, address, phone number, or
        date of birth.
      </p>

      <h2>Cookies and Similar Technologies</h2>
      <p>
        We use a small number of cookies. <strong>Essential cookies</strong> keep the site working
        (e.g. preserving theme or recently viewed names). <strong>Analytics cookies</strong>, set by
        Google Analytics 4, help us understand which pages are popular. <strong>Advertising cookies</strong>
        may be set by Google AdSense and its partners to show ads and measure ad performance. You can
        disable cookies in your browser settings or opt out of personalised advertising at{" "}
        <a className="text-primary hover:underline" href="https://www.google.com/settings/ads" rel="noopener noreferrer" target="_blank">
          Google Ads Settings
        </a>{" "}
        and{" "}
        <a className="text-primary hover:underline" href="https://www.aboutads.info/choices/" rel="noopener noreferrer" target="_blank">
          aboutads.info/choices
        </a>.
      </p>

      <h2>Advertising and Third-Party Vendors</h2>
      <p>
        Third-party vendors, including Google, use cookies to serve ads based on your prior visits to
        this and other websites. Google's use of advertising cookies enables it and its partners to serve
        ads to our users based on their visit to our sites and/or other sites on the Internet. Users may
        opt out of personalised advertising by visiting{" "}
        <a className="text-primary hover:underline" href="https://policies.google.com/technologies/ads" rel="noopener noreferrer" target="_blank">
          Google Ads policies
        </a>.
      </p>

      <h2>Data Sources</h2>
      <p>
        Our name statistics come from public records published by agencies such as the{" "}
        <a className="text-primary hover:underline" href="https://www.ssa.gov/oact/babynames/" rel="noopener noreferrer" target="_blank">
          U.S. Social Security Administration
        </a>, the{" "}
        <a className="text-primary hover:underline" href="https://www.census.gov/" rel="noopener noreferrer" target="_blank">
          U.S. Census Bureau
        </a>, and demographic datasets from{" "}
        <a className="text-primary hover:underline" href="https://data.unicef.org/" rel="noopener noreferrer" target="_blank">
          UNICEF Data
        </a>. These datasets do not contain personally identifying information.
      </p>

      <h2>Your Rights (GDPR / CCPA)</h2>
      <p>
        If you are in the EU, UK, or California, you have the right to access, correct, or request
        deletion of any personal data we hold about you, and to object to processing for direct
        marketing. Because we do not collect account data, most requests can be honoured by clearing
        your cookies. For anything else, contact us through the <a className="text-primary hover:underline" href="/contact">Contact page</a>.
      </p>

      <h2>Data Security &amp; Retention</h2>
      <p>
        Search queries are processed in memory and are not stored against any user identity. Aggregated
        analytics are retained for up to 26 months. We use HTTPS site-wide and rely on reputable hosting
        providers that maintain industry-standard security controls.
      </p>

      <h2>Children's Privacy</h2>
      <p>
        HowManyOfMe is a general-audience website and is not directed to children under 13. We do not
        knowingly collect personal information from children.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Material changes will be reflected in the
        "Last updated" date at the top of this page.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Reach us via the <a className="text-primary hover:underline" href="/contact">Contact page</a>{" "}
        or read more about our data approach in our <a className="text-primary hover:underline" href="/methodology">Methodology</a>.
      </p>
    </main>
    <SiteFooter />
  </div>
);

export default Privacy;
