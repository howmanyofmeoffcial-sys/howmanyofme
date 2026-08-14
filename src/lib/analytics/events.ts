declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export type AnalyticsEventName =
  | "name_search_submitted"
  | "name_result_viewed"
  | "full_name_search_submitted"
  | "modelled_result_viewed"
  | "verified_result_viewed"
  | "detailed_profile_clicked"
  | "search_again_clicked"
  | "second_search_clicked"
  | "full_name_cta_clicked"
  | "related_name_clicked"
  | "birth_year_submitted"
  | "birth_date_added_to_personalization"
  | "personalized_insights_viewed"
  | "id_card_download_clicked"
  | "social_share_clicked"
  | "citation_copied"
  | "dataset_downloaded"
  | "affiliate_resource_clicked"
  | "comparison_completed"
  | "swap_names_clicked";

export interface AnalyticsEventPayload {
  search_mode?: "first_name" | "full_name";
  result_found?: boolean;
  result_mode?: "verified" | "modelled" | "insufficient" | "invalid";
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
