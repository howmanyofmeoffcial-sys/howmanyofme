import React, { useState } from "react";
import {
  CheckCircle2,
  Info,
  ArrowRight,
  RotateCcw,
  Sparkles,
  MapPin,
  Users,
  Compass,
  Calendar,
  Gift,
  Award,
  Database,
  TrendingUp,
} from "lucide-react";
import type { NameEstimateResult, DecadeHistoryPoint } from "../../lib/estimation/types";
import { trackEvent } from "../../lib/analytics/events";
import { calculatePersonalizedInsights, type PersonalizedBirthYearInsight } from "../../lib/estimation/personalization";
import NameHistoryChart, { type TimelinePoint } from "../NameHistoryChart";
import { ShareIdCardButton } from "./ShareIdCardButton";

interface NameEstimateCardProps {
  result: NameEstimateResult;
  onReset: () => void;
}

function mapDecadeHistoryToTimeline(history: DecadeHistoryPoint[]): TimelinePoint[] {
  return history.map((pt) => {
    const year = parseInt(pt.decade.replace(/\D/g, ""), 10) || 1900;
    return {
      year,
      births: pt.count,
      male: 0,
      female: 0,
    };
  });
}

export const NameEstimateCard: React.FC<NameEstimateCardProps> = ({ result, onReset }) => {
  const isVerified = result.mode === "verified";
  const isInvalid = result.mode === "invalid";

  // Personalization state
  const [birthYearInput, setBirthYearInput] = useState("");
  const [birthDateInput, setBirthDateInput] = useState("");
  const [personalizedInsight, setPersonalizedInsight] = useState<PersonalizedBirthYearInsight | null>(null);
  const [personalizeError, setPersonalizeError] = useState<string | null>(null);

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

  const handlePersonalizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = parseInt(birthYearInput.trim(), 10);
    const currentYear = new Date().getFullYear();

    if (isNaN(year) || year < 1900 || year > currentYear) {
      setPersonalizeError(`Please enter a valid birth year between 1900 and ${currentYear}.`);
      return;
    }

    setPersonalizeError(null);

    let mm: number | undefined = undefined;
    let dd: number | undefined = undefined;

    if (birthDateInput.trim()) {
      const match = birthDateInput.match(/^\d{4}-(\d{2})-(\d{2})$/);
      if (match) {
        mm = Number(match[1]);
        dd = Number(match[2]);
        trackEvent("birth_date_added_to_personalization", {
          birth_month: mm,
        });
      }
    }

    const insight = calculatePersonalizedInsights(result.firstName, year, mm, dd);
    setPersonalizedInsight(insight);

    trackEvent("birth_year_submitted", {
      birth_year_decade: `${Math.floor(year / 10) * 10}s`,
    });
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

  const rich = result.richInsights;

  return (
    <div
      role="region"
      aria-label="Name Estimation Results"
      aria-live="polite"
      className="relative rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-xl shadow-primary/5 transition-all animate-in fade-in slide-in-from-top-4 duration-300 space-y-6"
    >
      {/* 0. Gradient Summary Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-indigo-600 p-4 md:p-5 text-white text-sm md:text-base font-medium text-center shadow-lg leading-relaxed">
        {result.displayName} is{" "}
        {rich?.rarity.level === "Very Rare" || rich?.rarity.level === "Rare"
          ? "a distinctive, rare name that stands out nationwide"
          : "a familiar name found across the United States"}
        .{" "}
        {result.estimatedPeople
          ? `About ${result.estimatedPeople.toLocaleString()} ${
              result.estimatedPeople === 1 ? "person shares" : "people share"
            } this exact name`
          : `Roughly ${result.displayEstimate} people share this exact name`}
        {rich?.rarity.oneInX ? `, making it roughly 1 in every ${rich.rarity.oneInX.toLocaleString()} Americans.` : "."}
      </div>

      {/* 1. Top Header: Badge & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {result.queryType === "full-name" ? "Full Name Analysis" : "First Name Analysis"}
          </span>
          <h3 className="font-display text-2xl md:text-4xl font-bold text-card-foreground tracking-tight">
            {result.displayName}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

      {/* 2. Main Estimated Stat Hero */}
      <div className="rounded-2xl bg-primary/5 p-6 text-center border border-primary/20">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Estimated U.S. Living Bearers
        </p>
        <div className="mt-2 font-display text-4xl md:text-6xl font-extrabold text-primary tracking-tight">
          {result.displayEstimate}
        </div>
        <p className="mt-2 text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
          {isVerified
            ? "Calculated by applying CDC actuarial life table survival models to official 1880–2024 Social Security birth cohort registrations."
            : "Derived demographic estimate based on national given-name distribution brackets and Census surname frequencies."}
        </p>
      </div>

      {/* 2b. Latest SSA 2025/2026 Popularity Section (When Available) */}
      {result.latestSsa && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                Official {result.latestSsa.year} SSA Popularity
              </span>
              <span className="text-sm font-medium text-foreground">
                Ranked <strong className="text-indigo-600 dark:text-indigo-400 font-bold">#{result.latestSsa.rank}</strong> for {result.latestSsa.sex === "M" ? "Boys" : "Girls"} nationwide
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground bg-background/80 px-3 py-1.5 rounded-lg border border-border">
            {result.latestSsa.count.toLocaleString()} registered births
          </div>
        </div>
      )}

      {/* 3. Summary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-secondary/30 p-3.5 text-center">
          <span className="text-xs text-muted-foreground block mb-1">Rarity Level</span>
          <div className="text-base font-bold text-foreground">{rich?.rarity.level || "Distinctive"}</div>
        </div>

        <div className="rounded-xl border border-border bg-secondary/30 p-3.5 text-center">
          <span className="text-xs text-muted-foreground block mb-1">National Ratio</span>
          <div className="text-base font-bold text-foreground">
            {rich?.rarity.oneInX ? `1 in ~${rich.rarity.oneInX.toLocaleString()}` : "1 in ~50k"}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-secondary/30 p-3.5 text-center">
          <span className="text-xs text-muted-foreground block mb-1">Primary Source</span>
          <div className="text-base font-bold text-foreground">{isVerified ? "SSA & Census" : "Modelled"}</div>
        </div>

        <div className="rounded-xl border border-border bg-secondary/30 p-3.5 text-center">
          <span className="text-xs text-muted-foreground block mb-1">Confidence</span>
          <div className="text-base font-bold text-foreground capitalize">{result.confidence || "Moderate"}</div>
        </div>
      </div>

      {/* 3b. Rarity Badge Card */}
      <div className="flex justify-center my-2">
        <div
          className={`rounded-2xl px-8 py-5 text-center text-white shadow-md w-full max-w-md ${
            rich?.rarity.level === "Very Rare"
              ? "bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700"
              : rich?.rarity.level === "Rare"
              ? "bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600"
              : "bg-gradient-to-br from-indigo-600 to-purple-700 border border-indigo-500/30"
          }`}
        >
          <span className="text-2xl block mb-1">⭐</span>
          <div className="font-display text-lg font-bold">{rich?.rarity.level ?? "Distinctive"} Name Tier</div>
          <p className="text-xs text-white/80 mt-1 max-w-sm mx-auto leading-relaxed">{rich?.rarity.description}</p>
        </div>
      </div>

      {/* 4. First Name & Surname Signals Breakdown (For Full-Name Queries) */}
      {result.supportingData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.supportingData.firstName && (
            <div className="rounded-xl border border-border/70 bg-background/60 p-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                First Name Signal ({result.supportingData.firstName.name})
              </span>
              <div className="text-xl font-bold text-foreground">
                ~{result.supportingData.firstName.count.toLocaleString("en-US")} living
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {result.supportingData.firstName.rank ? (
                  <span>Rank: #{result.supportingData.firstName.rank.toLocaleString()}</span>
                ) : (
                  <span>Unindexed Name</span>
                )}
                {result.supportingData.firstName.peakYear && (
                  <span>· Peak Era: {result.supportingData.firstName.peakYear}</span>
                )}
              </div>
            </div>
          )}

          {result.supportingData.lastName && (
            <div className="rounded-xl border border-border/70 bg-background/60 p-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Surname Signal ({result.supportingData.lastName.surname})
              </span>
              <div className="text-xl font-bold text-foreground">
                ~{result.supportingData.lastName.censusCount.toLocaleString("en-US")} in Census
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {result.supportingData.lastName.censusRank ? (
                  <span>National Rank: #{result.supportingData.lastName.censusRank.toLocaleString()}</span>
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

      {/* 5. Gender / Sex Distribution (If Supported by Data) */}
      {rich?.gender && (
        <div className="rounded-xl border border-border/70 bg-background/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              Sex Distribution in Official SSA Records
            </span>
            <span className="text-xs text-muted-foreground font-medium">{rich.gender.label}</span>
          </div>

          <div className="h-3 w-full rounded-full bg-secondary overflow-hidden flex">
            <div
              style={{ width: `${rich.gender.malePct}%` }}
              className="bg-blue-500 transition-all duration-500"
              title={`Male: ${rich.gender.malePct}%`}
            />
            <div
              style={{ width: `${rich.gender.femalePct}%` }}
              className="bg-pink-500 transition-all duration-500"
              title={`Female: ${rich.gender.femalePct}%`}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> Male: {rich.gender.malePct}%
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-pink-500" /> Female: {rich.gender.femalePct}%
            </span>
          </div>
        </div>
      )}

      {/* 6. Historical Popularity Line Chart (Recharts) */}
      {rich?.history && rich.history.history.length > 0 && (
        <NameHistoryChart
          name={result.displayName}
          history={mapDecadeHistoryToTimeline(rich.history.history)}
          peakYear={rich.history.peakYear}
          peakBirths={rich.history.peakCount}
        />
      )}

      {/* 7. Geographic Distribution (Top 5 States) */}
      {rich?.geography && (
        <div className="rounded-xl border border-border/70 bg-background/60 p-4 space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Estimated Top States by Living Bearer Count
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {rich.geography.topStates.map((st, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-border/60 bg-secondary/20 text-center">
                  <span className="text-xs font-bold text-foreground block truncate">{st.state}</span>
                  <span className="text-xs text-muted-foreground block">~{st.estimatedBearers.toLocaleString()}</span>
                  <span className="text-[10px] text-primary font-medium block">~{st.percentage}% of U.S.</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7b. Top Cities with That Name */}
          {rich.geography.topCities && rich.geography.topCities.length > 0 && (
            <div className="pt-2 border-t border-border/50">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Top Cities with That Name (Estimated Concentration)
              </span>
              <ul className="divide-y divide-border/50">
                {rich.geography.topCities.map((c, idx) => (
                  <li key={idx} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-foreground font-medium">
                      {c.city}, <span className="text-muted-foreground font-normal">{c.state}</span>
                    </span>
                    <span className="text-muted-foreground text-xs font-mono">
                      ~{c.estimatedBearers.toLocaleString()} people
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 8. Fun Facts Section */}
      {rich?.funFacts && rich.funFacts.length > 0 && (
        <div className="rounded-xl border border-border/70 bg-background/60 p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Demographic Scale &amp; Fast Facts
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {rich.funFacts.map((fact, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-border/50 bg-secondary/20 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block mb-1">{fact.title}</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{fact.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8b. Data Sources & Provenance Legend */}
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
          <Database className="h-3.5 w-3.5 text-primary" />
          Data Sources &amp; Provenance Legend
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/60 border border-border/50">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span><strong>Source-backed:</strong> Official SSA 1880–2024 records &amp; Census 2020</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/60 border border-border/50">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0" />
            <span><strong>Derived:</strong> Actuarial cohort life table survival modeling</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/60 border border-border/50">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
            <span><strong>Estimated:</strong> National demographic distribution frequency model</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/60 border border-border/50">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-400 shrink-0" />
            <span><strong>Not Available:</strong> Unrecorded in primary federal census/SSA registry</span>
          </div>
        </div>
      </div>

      {/* 9. Personalized Birth-Year & Zodiac Insights */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 md:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/10 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded bg-primary/10 inline-block mb-1">
              Personalized Entertainment
            </span>
            <h4 className="font-display text-lg font-bold text-foreground flex items-center gap-1.5">
              <Gift className="h-4 w-4 text-primary" />
              Zodiac, Generation &amp; Birth Year Insights
            </h4>
          </div>
          <span className="text-xs text-muted-foreground">For entertainment purposes</span>
        </div>

        <form onSubmit={handlePersonalizeSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              placeholder="Birth Year (e.g. 1998, 2002)..."
              value={birthYearInput}
              onChange={(e) => {
                setBirthYearInput(e.target.value);
                if (personalizeError) setPersonalizeError(null);
              }}
              required
              className="w-full h-11 rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="relative flex-1">
            <input
              type="date"
              value={birthDateInput}
              onChange={(e) => setBirthDateInput(e.target.value)}
              aria-label="Birthday (optional for Western Zodiac)"
              className="w-full h-11 rounded-xl border border-input bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <button
            type="submit"
            className="h-11 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm shrink-0"
          >
            Reveal Insights
          </button>
        </form>

        {personalizeError && <p className="text-xs text-destructive font-medium">{personalizeError}</p>}

        {personalizedInsight && (
          <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Chinese Zodiac
                </span>
                <div className="text-base font-bold text-foreground mt-1">
                  {personalizedInsight.chineseZodiacEmoji} Year of the {personalizedInsight.chineseZodiac}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Calculated by lunar annual cycle.</p>
              </div>

              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  Western Zodiac
                </span>
                {personalizedInsight.westernZodiac ? (
                  <div className="text-base font-bold text-foreground mt-1">
                    {personalizedInsight.westernZodiac.symbol} {personalizedInsight.westernZodiac.sign}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">Select full birthdate above to reveal sign.</p>
                )}
              </div>

              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Generational Era
                </span>
                <div className="text-base font-bold text-foreground mt-1">{personalizedInsight.generation}</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{personalizedInsight.generationDescription}</p>
              </div>
            </div>

            {personalizedInsight.historicalEraContext && (
              <div className="rounded-2xl bg-gradient-to-r from-primary to-indigo-600 p-4 md:p-5 text-white text-sm shadow-md">
                <p className="font-bold text-base mb-1">
                  Birth Year Popularity Match: {personalizedInsight.birthYear}
                </p>
                <p className="text-white/90 leading-relaxed">{personalizedInsight.historicalEraContext}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 10. Related Names Quick Discovery */}
      {rich?.relatedNames && rich.relatedNames.length > 0 && (
        <div className="pt-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2 flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-primary" />
            Explore Related Names
          </span>
          <div className="flex flex-wrap gap-2">
            {rich.relatedNames.map((rName, idx) => (
              <a
                key={idx}
                href={`/name/${encodeURIComponent(rName)}`}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-secondary/30 hover:border-primary/50 hover:text-primary text-foreground transition-colors"
              >
                {rName}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 11. Share & Download Name ID Card */}
      <ShareIdCardButton result={result} />

      {/* 12. Disclaimers & Limitations */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="rounded-xl bg-muted/40 p-3.5 text-xs text-muted-foreground border border-border/40 space-y-1">
          {result.warnings.map((w, idx) => (
            <p key={idx} className="leading-relaxed">
              • {w}
            </p>
          ))}
        </div>
      )}

      {/* 13. Actions Bar: Check Another Name & Detailed Profile */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
        <button
          type="button"
          onClick={handleSearchAgain}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Check Another Name
        </button>

        {result.detailedProfileUrl && (
          <a
            href={result.detailedProfileUrl}
            onClick={handleProfileClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg transition-all"
          >
            <span>View Detailed Profile Statistics</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
};
