import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Zap, Globe, ShieldCheck, ArrowRight } from "lucide-react";
import { searchNames } from "@/data/nameData";

const NameSearchHero = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleFirstNameChange = (val: string) => {
    setFirstName(val);
    if (val.length >= 2) {
      setSuggestions(searchNames(val));
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const name = firstName.trim() || "James";
    navigate(`/name/${encodeURIComponent(name)}`);
    setSuggestions([]);
  };

  const tryExample = (name: string) => {
    navigate(`/name/${encodeURIComponent(name)}`);
  };

  const selectSuggestion = (name: string) => {
    setFirstName(name);
    setSuggestions([]);
  };

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{ background: "var(--hero-gradient)" }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* Soft glow accents */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT — Headline + copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-primary-foreground/90 text-sm font-medium border border-primary-foreground/20 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Instant results · 100M+ names · 80+ countries
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-5 leading-[1.1]">
              How many people<br />
              have{" "}
              <span className="underline decoration-wavy decoration-primary-foreground/40 underline-offset-8">
                your name
              </span>
              ?
            </h1>

            <p className="text-lg text-primary-foreground/85 max-w-xl mx-auto lg:mx-0 mb-6">
              Are you 1 in a million — or 1 of millions? Check your name instantly against 100M+ global records and see popularity, rarity, and origin in seconds.
            </p>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-primary-foreground/80 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> Instant results
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe className="h-4 w-4" /> 80+ countries
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> No signup
              </span>
            </div>
          </div>

          {/* RIGHT — Product-style search card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/40 via-primary-foreground/30 to-accent/40 rounded-2xl blur-lg opacity-60" />
            <div className="relative bg-card rounded-2xl shadow-2xl p-6 md:p-8 border border-border/50">
              <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg leading-tight">Check your name</h2>
                  <p className="text-xs text-muted-foreground">Free · Results in under 1 second</p>
                </div>
              </div>

              <form onSubmit={handleSearch} className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Try James, Liam, Sophia…"
                    value={firstName}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 150)}
                    aria-label="Enter your first name"
                    className={`w-full h-14 rounded-xl border-2 bg-background pl-11 pr-4 text-foreground text-base placeholder:text-muted-foreground/70 focus:outline-none transition-all ${
                      focused
                        ? "border-primary ring-4 ring-primary/15"
                        : "border-border hover:border-primary/40"
                    }`}
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-popover border border-border rounded-xl shadow-xl z-20 max-h-56 overflow-y-auto">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => selectSuggestion(s)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors text-foreground first:rounded-t-xl last:rounded-b-xl"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Last name (optional)"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  aria-label="Enter your last name (optional)"
                  className="w-full h-12 rounded-xl border-2 border-border bg-background px-4 text-foreground text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 hover:border-primary/40 transition-all"
                />

                <button
                  type="submit"
                  className="group relative w-full h-14 rounded-xl font-semibold text-base text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--primary)), hsl(280 60% 55%))",
                  }}
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    Check Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>

                <p className="text-center text-xs text-muted-foreground pt-1">
                  🔒 Your name is never stored
                </p>
              </form>

              {/* Example chips */}
              <div className="mt-5 pt-5 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2.5">Popular searches:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["James", "Mary", "Olivia", "Liam", "Muhammad", "Sophia"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => tryExample(n)}
                      className="px-3 py-1 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-xs font-medium border border-border transition-colors"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12 pt-8 border-t border-primary-foreground/15">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary-foreground">100M+</div>
            <div className="text-xs md:text-sm text-primary-foreground/70">Names indexed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary-foreground">80+</div>
            <div className="text-xs md:text-sm text-primary-foreground/70">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary-foreground">±5%</div>
            <div className="text-xs md:text-sm text-primary-foreground/70">Accuracy</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NameSearchHero;
