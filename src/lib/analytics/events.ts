declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export type AnalyticsEventName =
  | "name_search_submitted"
  | "second_search_clicked"
  | "full_name_cta_clicked"
  | "related_name_clicked"
  | "citation_copied"
  | "dataset_downloaded"
  | "affiliate_resource_clicked";

export interface AnalyticsEventPayload {
  search_mode?: "first_name" | "full_name";
  result_found?: boolean;
  source_page_type?: "first_name" | "full_name" | "tool" | "homepage" | "research";
  source_name_rank_tier?: "top100" | "top500" | "other";
  position_index?: number;
  citation_topic?: string;
  dataset_format?: "json" | "csv";
  dataset_id?: string;
  partner_category?: "genealogy" | "ancestry" | "demographics";
  placement_location?: string;
  [key: string]: unknown;
}

/**
 * Privacy-preserving event dispatcher that avoids collecting any PII.
 */
export function trackEvent(
  eventName: AnalyticsEventName,
  payload: AnalyticsEventPayload = {}
): void {
  if (typeof window === "undefined") return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      timestamp: Date.now(),
      ...payload,
    });
  } catch (err) {
    // Fail silently without blocking UI
  }
}
