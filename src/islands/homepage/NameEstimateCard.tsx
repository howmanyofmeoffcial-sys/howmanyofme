import React from "react";
import { CheckCircle2, Info, ArrowRight, RotateCcw, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import type { NameEstimateResult } from "../../lib/estimation/types";
import { trackEvent } from "../../lib/analytics/events";

interface NameEstimateCardProps {
  result: NameEstimateResult;
  onReset: () => void;
}

export const NameEstimateCard: React.FC<NameEstimateCardProps> = ({ result, onReset }) => {
  const isVerified = result.mode === "verified";
  const isModelled = result.mode === "modelled";
  const isInvalid = result.mode === "invalid";

  const handleProfileClick = () => {
    trackEvent("detailed_profile_clicked", {
      result_mode: result.mode,
      search_mode: result.queryType === "full-name" ? "full_name" : "first_name",
      source_page_type: "homepage",
    });
  };

  const handleSearchAgain = () => {
    trackEvent("search_again_clicked", {
      source_page_type: "homepage",
    });
    onReset();
  };

  if (isInvalid) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Info className="h-6 w-6" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">Invalid Name Input</h3>
        <p className="mt-1 text-sm text-muted-foreground">{result.errorReason || "Please enter a valid name to check."}</p>
        <button
          type="button"
          onClick={handleSearchAgain}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      className="relative rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-xl shadow-primary/5 transition-all animate-in fade-in slide-in-from-top-4 duration-300"
    >
      {/* Top Header: Badge & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {result.queryType === "full-name" ? "Full Name Analysis" : "First Name Analysis"}
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-card-foreground">
            {result.displayName}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {isVerified ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Source-Backed Profile
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <Info className="h-3.5 w-3.5" />
              Statistical Estimate
            </span>
          )}

          {result.confidence && (
            <span className="hidden sm:inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Confidence: {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Main Estimated Stat Hero */}
      <div className="my-6 rounded-xl bg-secondary/40 p-5 text-center border border-border/40">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Estimated U.S. Living Bearers
        </p>
        <div className="mt-1 font-display text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          {result.displayEstimate}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {isVerified
            ? "Calculated from official SSA birth cohorts & actuarial survival curves"
            : "Derived demographic model based on national distribution and frequency boundaries"}
        </p>
      </div>

      {/* Supporting Data Grid */}
      {result.supportingData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {result.supportingData.firstName && (
            <div className="rounded-xl border border-border/50 bg-background/60 p-3.5 text-left">
              <span className="text-xs text-muted-foreground">First Name Living Estimate</span>
              <div className="text-lg font-bold text-foreground">
                ~{result.supportingData.firstName.count.toLocaleString("en-US")}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {result.supportingData.firstName.rank ? (
                  <span>Rank: #{result.supportingData.firstName.rank.toLocaleString()}</span>
                ) : (
                  <span>Unranked / Unique Name</span>
                )}
                {result.supportingData.firstName.peakYear && (
                  <span>· Peak: {result.supportingData.firstName.peakYear}</span>
                )}
              </div>
            </div>
          )}

          {result.supportingData.lastName && (
            <div className="rounded-xl border border-border/50 bg-background/60 p-3.5 text-left">
              <span className="text-xs text-muted-foreground">Surname U.S. Census Count</span>
              <div className="text-lg font-bold text-foreground">
                ~{result.supportingData.lastName.censusCount.toLocaleString("en-US")}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {result.supportingData.lastName.censusRank ? (
                  <span>Rank: #{result.supportingData.lastName.censusRank.toLocaleString()}</span>
                ) : (
                  <span>U.S. Decennial Census</span>
                )}
                {result.supportingData.lastName.origin && (
                  <span>· {result.supportingData.lastName.origin}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disclaimers & Methodology Note */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="mb-6 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground border border-border/40 space-y-1">
          {result.warnings.map((w, idx) => (
            <p key={idx} className="leading-relaxed">
              • {w}
            </p>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleSearchAgain}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Check Another Name
        </button>

        {result.detailedProfileUrl ? (
          <a
            href={result.detailedProfileUrl}
            onClick={handleProfileClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg transition-all"
          >
            <span>View Detailed Profile</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        ) : (
          <div className="text-xs text-muted-foreground text-center sm:text-right">
            <span>✨ Modelled estimate for entertainment</span>
          </div>
        )}
      </div>
    </div>
  );
};
