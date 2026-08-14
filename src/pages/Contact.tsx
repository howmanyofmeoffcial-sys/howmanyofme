import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import { ExternalLink, Mail, MessageSquare, Clock } from "lucide-react";

const EMAIL = "hello@howmanyofme.co";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Contact HowManyOfMe — Email, Feedback & Data Inquiries"
      description="Get in touch with HowManyOfMe. Email hello@howmanyofme.co for feedback, bug reports, data licensing, press, or partnership inquiries."
      canonical="https://howmanyofme.co/contact"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact HowManyOfMe",
        url: "https://howmanyofme.co/contact",
        mainEntity: {
          "@type": "Organization",
          name: "HowManyOfMe",
          email: EMAIL,
          url: "https://howmanyofme.co",
        },
      }}
    />
    <SiteHeader />
    <main className="container py-12 max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        Have a question, found a bug, or want to talk about data licensing or partnerships? I read every
        message personally and aim to reply within 2–3 business days.
      </p>

      <div className="space-y-6 mb-12">
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Email</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            The fastest way to reach the team is by email. Use this for feedback, corrections, takedown
            requests, press, or partnership inquiries.
          </p>
          <a
            href={`mailto:${EMAIL}?subject=HowManyOfMe%20Inquiry`}
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
          >
            {EMAIL}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Quick Message Form</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Prefer a form? This opens your email app pre-filled — no account, no tracking.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const name = (form.elements.namedItem("name") as HTMLInputElement).value;
              const subject = (form.elements.namedItem("subject") as HTMLInputElement).value;
              const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
              const body = `From: ${name}\n\n${message}`;
              window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
            className="space-y-3"
          >
            <input
              name="name"
              required
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
            />
            <input
              name="subject"
              required
              placeholder="Subject"
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Your message"
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm resize-y"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
            >
              Send via Email
            </button>
          </form>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Response Times</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            HowManyOfMe is built and maintained by an independent creator. Most emails get a reply within
            48–72 hours on weekdays. For urgent data corrections (e.g. an inaccurate name page), please
            include the URL in your message so we can fix it quickly.
          </p>
        </div>
      </div>

      <h2 className="font-display text-2xl font-bold mb-4">Other Ways to Connect</h2>
      <p className="text-muted-foreground text-sm leading-relaxed mb-3">
        I also publish long-form notes about names, data sourcing, and the tools I build. You can follow
        along on Medium.
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
    </main>
    <SiteFooter />
  </div>
);

export default Contact;
