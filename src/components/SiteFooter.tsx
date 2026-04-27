import { Link } from "react-router-dom";
import { ALPHABET } from "@/data/nameData";
import { ExternalLink } from "lucide-react";

const SiteFooter = () => (
  <footer className="border-t border-border bg-secondary/30 mt-20">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-lg font-bold mb-3">HowManyOfMe</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Discover how many people share your name using our database of over 100 million names worldwide.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Browse by Letter</h4>
          <div className="flex flex-wrap gap-1.5">
            {ALPHABET.map(l => (
              <Link key={l} to={`/names/${l}`} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors uppercase w-6 h-6 flex items-center justify-center rounded bg-secondary hover:bg-primary/10">
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Tools</h4>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li><Link to="/tools" className="hover:text-foreground transition-colors">All Tools</Link></li>
            <li><Link to="/tools/popularity-checker" className="hover:text-foreground transition-colors">Popularity Checker</Link></li>
            <li><Link to="/tools/name-comparison" className="hover:text-foreground transition-colors">Name Comparison</Link></li>
            <li><Link to="/tools/trend-visualizer" className="hover:text-foreground transition-colors">Trend Visualizer</Link></li>
            <li><Link to="/tools/unique-name-generator" className="hover:text-foreground transition-colors">Unique Name Generator</Link></li>
            <li><Link to="/tools/random-name" className="hover:text-foreground transition-colors">Random Name Generator</Link></li>
            <li><Link to="/tools/baby-names" className="hover:text-foreground transition-colors">Baby Name Ideas</Link></li>
            <li><Link to="/tools/username-generator" className="hover:text-foreground transition-colors">Username Generator</Link></li>
            <li><Link to="/tools/meaning" className="hover:text-foreground transition-colors">Name Meaning</Link></li>
            <li><Link to="/similar-names" className="hover:text-foreground transition-colors">Similar Names</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Resources</h4>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
            <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
            <li><Link to="/methodology" className="hover:text-foreground transition-colors">Methodology</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            <li><Link to="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      {/* Author Section */}
      <div className="border-t border-border mt-8 pt-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold text-foreground mb-2">Built by Ziven Borceg</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Hi, I'm Ziven Borceg. Welcome to howmanyofme.co — your all-in-one platform to discover how many people around the world share your first or last name, explore name popularity trends, and uncover the origins and meaning behind names.
          </p>
          <a
            href="https://medium.com/@zivenborceg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Follow me on Medium
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="border-t border-border mt-6 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HowManyOfMe. All rights reserved. Data is estimated and for informational purposes only.
      </div>
    </div>
  </footer>
);

export default SiteFooter;
