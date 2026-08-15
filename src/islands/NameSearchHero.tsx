import React, { useState, useRef } from "react";
import { Sparkles, Zap, Globe, ShieldCheck } from "lucide-react";
import { NameCheckerForm, type SearchFormData } from "./homepage/NameCheckerForm";
import { NameEstimateCard } from "./homepage/NameEstimateCard";
import { resolveNameSearch } from "../lib/estimation/resolveNameSearch";
import type { NameEstimateResult } from "../lib/estimation/types";
import { trackEvent } from "../lib/analytics/events";

export default function NameSearchHero() {
  const [result, setResult] = useState<NameEstimateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSearchSubmit = (data: SearchFormData) => {
    setIsLoading(true);

    const isFullName = data.searchMode === "full_name" || (Boolean(data.lastName) && data.lastName.trim().length > 0);

    trackEvent(isFullName ? "full_name_search_submitted" : "name_search_submitted", {
      search_mode: isFullName ? "full_name" : "first_name",
      source_page_type: "homepage",
    });

    // Resolve query through estimation engine
    const estimate = resolveNameSearch({
      firstName: data.firstName,
      lastName: data.lastName,
    });

    setResult(estimate);
    setIsLoading(false);

    trackEvent("name_result_viewed", {
      result_mode: estimate.mode,
      search_mode: isFullName ? "full_name" : "first_name",
      source_page_type: "homepage",
    });

    if (estimate.mode === "verified") {
      trackEvent("verified_result_viewed", { source_page_type: "homepage" });
    } else if (estimate.mode === "modelled") {
      trackEvent("modelled_result_viewed", { source_page_type: "homepage" });
    }

    // Smooth scroll result into view if supported
    setTimeout(() => {
      if (resultRef.current && typeof resultRef.current.scrollIntoView === "function" && typeof window !== "undefined") {
        const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
        resultRef.current.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "nearest",
        });
      }
    }, 50);
  };

  const handleReset = () => {
    setResult(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
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
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* LEFT — Headline + copy */}
          <div className="text-center lg:text-left pt-2">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-primary-foreground/90 text-sm font-medium border border-primary-foreground/20 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Instant demographic results · Official SSA & Census data
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-5 leading-[1.1]">
              How Many People Have Your Name?
            </h1>

            <p className="text-lg text-primary-foreground/85 max-w-xl mx-auto lg:mx-0 mb-6 leading-relaxed">
              Check how common your first name, last name, or full name may be in the United States using public name statistics and clearly labelled estimates.
            </p>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-primary-foreground/80 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> Free & instant
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> No signup required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe className="h-4 w-4" /> Source-backed where available
              </span>
            </div>
          </div>

          {/* RIGHT — Product-style search card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/40 via-primary-foreground/30 to-accent/40 rounded-2xl blur-lg opacity-60" />
            <div className="relative bg-card rounded-2xl shadow-2xl p-6 md:p-8 border border-border/50 space-y-6">
              <div>
                <h2 className="font-display font-bold text-[23px] sm:text-[24px] md:text-[28px] leading-tight text-card-foreground">
                  Check name demographics
                </h2>
                <p className="text-[16px] md:text-[16.5px] text-muted-foreground mt-1 leading-normal">
                  Enter your first name or full name to check living population estimates
                </p>
              </div>

              {/* Form Component */}
              <NameCheckerForm
                inputRef={inputRef}
                isLoading={isLoading}
                onSubmit={handleSearchSubmit}
              />
            </div>
          </div>
        </div>

        {/* FULL-WIDTH INLINE RESULT CONTAINER (Centered below search grid) */}
        {result && (
          <div ref={resultRef} className="mt-10 md:mt-14 max-w-4xl mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
            <NameEstimateCard result={result} onReset={handleReset} />
          </div>
        )}

        {/* Stats strip (Visible when no result is rendered) */}
        {!result && (
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12 pt-8 border-t border-primary-foreground/15">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-foreground">145 Yrs</div>
              <div className="text-xs md:text-sm text-primary-foreground/70">SSA birth records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-foreground">330M+</div>
              <div className="text-xs md:text-sm text-primary-foreground/70">Population baseline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-foreground">&lt; 1s</div>
              <div className="text-xs md:text-sm text-primary-foreground/70">Instant inline result</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
