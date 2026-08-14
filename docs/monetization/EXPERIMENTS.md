# Experimentation Framework & Telemetry Taxonomy

## 1. Privacy-Preserving Event Taxonomy

Client telemetry is implemented in `src/lib/analytics/events.ts`:

| Event Name | Category | Trigger Condition |
| :--- | :--- | :--- |
| `name_search` | Search | User submits a search query in SiteHeader autocomplete |
| `name_click` | Navigation | User selects a name suggestion or related card |
| `tool_interaction` | Tools | User calculates, filters, or generates names in tools |
| `citation_copied` | Authority | User clicks "Copy Citation" button |
| `data_downloaded` | Authority | User downloads JSON/CSV from Open Data Hub |
| `ad_impression` | Monetization | Ad slot container enters viewport |

---

## 2. Active CRO Experiment Log

| Experiment ID | Surface | Hypothesis | Result / Decision |
| :--- | :--- | :--- | :--- |
| **EXP-15-01** | ToolCTA Placement | Adding bottom ToolCTA cards increases pageviews per session by $>15\%$. | **WINNER (Retained in core templates)** |
| **EXP-15-02** | Zero-CLS Ad Containers | Enforcing `min-h-[250px]` with `contain-layout` drops CLS from 0.04 to 0.00. | **WINNER (Retained in core templates)** |
| **EXP-15-03** | Academic Citation Block | Providing 1-click citation copy increases backlinks and dwell time. | **ACTIVE (Monitoring)** |
