import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { ExternalLink, Mail } from "lucide-react";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Contact HowManyOfMe — Get In Touch"
      description="Have questions, feedback, or data licensing inquiries? Contact the HowManyOfMe team. We'd love to hear from you."
      canonical="https://howmanyofme.co/contact"
    />
    <SiteHeader />
    <main className="container py-12 max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        Whether you have a question about our data, want to report an issue, or have a partnership idea — I'd love to hear from you.
      </p>

      <div className="space-y-6 mb-12">
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">General Inquiries</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            For general questions, feedback, or suggestions about HowManyOfMe, feel free to reach out through Medium or leave a comment on any of our published articles.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-3">
            <ExternalLink className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Follow on Medium</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            I regularly write about names, data, and the tools I build. The best way to stay in touch is through my Medium profile.
          </p>
          <a
            href="https://medium.com/@zivenborceg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
          >
            Visit my Medium profile
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Response times may vary. I'm a solo creator building this project with care, so I appreciate your patience.</p>
      </div>
    </main>
    <SiteFooter />
  </div>
);

export default Contact;
