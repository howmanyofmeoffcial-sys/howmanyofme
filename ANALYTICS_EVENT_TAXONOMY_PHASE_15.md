# Phase 15 — Analytics Event Taxonomy & Telemetry Specification
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Event Taxonomy Specification

| Event Name | Trigger | Parameters | Purpose | Analytics Destination | Privacy Guardrails |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name_search_submitted` | User submits the search form | `search_mode` (`"first_name"`, `"full_name"`), `result_found` (`true`/`false`) | Measure search conversion & discovery | GA4 / DataLayer | **NO raw user name string logged**; only search category & success boolean. |
| `second_search_clicked` | User clicks "Check another name" | `source_page_type` (`"first_name"`, `"full_name"`, `"tool"`) | Track session depth & repeat usage | GA4 / DataLayer | Anonymous aggregate counter. |
| `full_name_cta_clicked` | User clicks full-name combination button | `source_name_rank_tier` (`"top100"`, `"top500"`, `"other"`) | Measure first-name $\to$ full-name cross-pollination | GA4 / DataLayer | Tier category only. |
| `related_name_clicked` | User clicks a related name suggestion | `position_index` (`1`–`6`) | Optimize recommendation relevance | GA4 / DataLayer | Relative position index only. |
| `citation_copied` | User clicks "Copy Citation" button | `citation_topic` (`"historical_births"`, `"census"`, `"living_model"`) | Measure academic & journalistic research utility | GA4 / DataLayer | Topic identifier. |
| `dataset_downloaded` | User downloads CSV or JSON dataset | `dataset_format` (`"json"`, `"csv"`), `dataset_id` | Track open data demand | GA4 / DataLayer | File format. |
| `affiliate_resource_clicked` | User clicks a contextual research resource | `partner_category` (`"genealogy"`, `"ancestry"`), `placement_location` | Monitor external conversion interest | GA4 / DataLayer | Partner category only. |

---

## 2. Privacy & PII Safeguards

1. **Zero Personally Identifiable Information (PII)**: No IP addresses, email addresses, phone numbers, or physical names are collected or transmitted.
2. **Aggregated Telemetry**: All events report sanitized behavioral categorizations rather than raw inputs.
3. **No Heavy Tracking Scripts**: Telemetry dispatches through standard browser `window.dataLayer` or non-blocking beacon APIs.
