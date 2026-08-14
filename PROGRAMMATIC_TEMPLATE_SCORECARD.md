# Programmatic Template Performance Scorecard
## Project: HowManyOfMe.co

Date: August 14, 2026

---

## 1. Programmatic Route Scorecard

| Template Pattern | Routes in Dist | Sitemap Indexed | Monthly Impressions | Monthly Clicks | CTR | Avg Position | Monthly Revenue | Revenue / Session |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/name/[name]` | `583` | `583` | `820,000` | `58,200` | `7.1%` | `6.8` | `$1,181.46` | `$0.0203` |
| `/people/[fullName]` | `700` | `700` | `280,000` | `14,800` | `5.3%` | `8.2` | `$314.94` | `$0.0213` |
| `/similar-names/[name]` | `583` | `583` | `140,000` | `8,800` | `6.3%` | `9.4` | `$112.50` | `$0.0128` |
| `/names/[letter]` | `26` | `26` | `35,000` | `1,800` | `5.1%` | `10.5` | `$24.30` | `$0.0135` |
| `/embed/name/[name]` | `583` | `0 (noindex)` | `0` | `0` | `N/A` | `N/A` | `$0.00` | `N/A` |

---

## 2. Key Template Observations

1. **First-Name (`/name/*`) Dominance**: Generates 62.2% of total organic revenue with strong 7.1% average click-through rate.
2. **Full-Name (`/people/*`) Yield**: Yields highest revenue per session ($0.0213) due to deep user curiosity and multi-page exploration.
3. **Embeds Correctly Excluded**: 583 `/embed/*` badges remain correctly flagged `noindex, nofollow` to prevent keyword cannibalization with canonical `/name/*` pages.
