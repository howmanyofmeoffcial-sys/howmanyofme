# Internal Linking Architecture & Silo Hierarchy

## 1. Graph Topology & Link Budget

HowManyOfMe.co enforces a structured topical silo hierarchy that ensures all 2,015+ canonical routes are reachable within 3 clicks of the homepage:

```text
                        Homepage (/)
                             ↓
       ┌─────────────────────┼─────────────────────┐
       ↓                     ↓                     ↓
Alphabet Directory     Surname Hub         Interactive Tools
(/names/[letter])      (/last-names)          (/tools/*)
       ↓                     ↓                     ↓
Given Names Profile    Surname Profile     Comparisons & Reports
  (/name/[name])     (/last-name/[surname]) (/name-comparison/*)
       └──────────────┬──────┘
                      ↓
              Full Name Profile
            (/people/[first-last])
```

---

## 2. Reciprocal Linking Rules

1. **Given Name (`/name/[name]`)**:
   - Links upward to parent letter directory (`/names/[letter]`).
   - Links horizontally to `/similar-names/[name]`.
   - Links downward to top full-name combinations (`/people/[name]-[surname]`).
2. **Surname (`/last-name/[surname]`)**:
   - Links upward to `/last-names`.
   - Links horizontally to related surnames in the same frequency bracket.
   - Links downward to verified full-name combinations with this surname.
3. **Full Name (`/people/[first-last]`)**:
   - Links reciprocally back to the given name profile (`/name/[first]`).
   - Links reciprocally back to the surname profile (`/last-name/[last]`).
   - Links to popular sibling full-name combinations.

---

## 3. Automated Validation

`scripts/validate_internal_links.mjs` executes after every build to verify:
- **Zero broken internal links** across all 135,000+ internal anchor tags.
- Strict crawl depth distribution (99%+ of pages within Depth $\le 3$).
- Automated detection of orphan pages.
