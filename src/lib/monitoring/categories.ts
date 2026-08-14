import type { HealthCategory, HealthSeverity } from "./types";

export interface CategoryMetadata {
  name: string;
  description: string;
  criticalThreshold: string;
  defaultPriority: HealthSeverity;
}

export const HEALTH_CATEGORIES_CONFIG: Record<HealthCategory, CategoryMetadata> = {
  technical: {
    name: "Technical Infrastructure & Routing",
    description: "Astro build, 404 handling, server response codes, and hydration status",
    criticalThreshold: "Any unhandled 500 error or broken production build",
    defaultPriority: "critical",
  },
  indexation: {
    name: "Search Engine Indexation & Coverage",
    description: "Sitemap inclusion, robots.txt directives, and GSC coverage status",
    criticalThreshold: "Accidental global noindex or robots.txt blocking",
    defaultPriority: "high",
  },
  seo: {
    name: "On-Page SEO & Metadata",
    description: "Titles, meta descriptions, canonical URLs, and single H1 headings",
    criticalThreshold: "Canonical domain mismatch or missing canonicals",
    defaultPriority: "medium",
  },
  content: {
    name: "Programmatic Page Quality & Uniqueness",
    description: "Thin content, duplicate templates, and dynamic FAQ correctness",
    criticalThreshold: "Empty demographic calculations or missing entity profiles",
    defaultPriority: "high",
  },
  data: {
    name: "Data Freshness & Provenance",
    description: "SSA single-year cohorts, Census 2020 tabulations, and surname models",
    criticalThreshold: "Data schema corruption, missing cohorts, or zero-bearer bugs",
    defaultPriority: "critical",
  },
  performance: {
    name: "Core Web Vitals & Page Speed",
    description: "LCP, INP, CLS layout stability, and client bundle size",
    criticalThreshold: "CLS > 0.100 or JS payload exceeding 350KB",
    defaultPriority: "medium",
  },
  links: {
    name: "Internal Link Graph & Crawl Depth",
    description: "Broken links, orphan pages, and cross-entity reciprocal links",
    criticalThreshold: "Orphan rate > 10% or broken internal links > 0",
    defaultPriority: "medium",
  },
  analytics: {
    name: "Telemetry & Privacy Compliance",
    description: "Event dispatches, dataLayer pushes, and zero-PII enforcement",
    criticalThreshold: "Collection of raw personal names or PII strings",
    defaultPriority: "high",
  },
  revenue: {
    name: "Monetization & Ad Stability",
    description: "Ad container sizing, Session RPM, and affiliate link validity",
    criticalThreshold: "Ad overlap with primary answer or revenue drop > 40%",
    defaultPriority: "high",
  },
  security: {
    name: "Security & Header Compliance",
    description: "HTTPS enforcement, CSP policies, and dependency vulnerability audits",
    criticalThreshold: "Exposed API secrets or insecure external script injection",
    defaultPriority: "critical",
  },
  deployment: {
    name: "Production Release Safety",
    description: "Release-over-release parity, route counts, and rollback readiness",
    criticalThreshold: "Missing > 1% of expected canonical production routes",
    defaultPriority: "critical",
  },
};
