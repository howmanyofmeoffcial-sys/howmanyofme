# Production URL Inventory — Phase 7
## HowManyOfMe.co Canonical Route Parity & Route Verification

Date: August 14, 2026  
Scope: 100% canonical URL parity comparison between Vite SPA routes and Astro static pre-rendered routes.

---

## 1. Executive Parity Summary

| URL Category | Expected Canonical Routes | Generated Astro Static Routes | Matched | Missing | Discrepancies |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Homepage** | 1 | 1 | 1 | 0 | 0 |
| **Programmatic Name Pages (`/name/[name]`)** | 583 | 583 | 583 | 0 | 0 |
| **Alphabet Directory Pages (`/names/[letter]`)** | 26 | 26 | 26 | 0 | 0 |
| **Verification Asset (`/google...`)** | 1 | 1 | 1 | 0 | 0 |
| **Total Pre-Rendered Production Routes** | **611** | **611** | **611** | **0** | **0** |

---

## 2. Representative Name Route Sample (50 Names)

All names follow exact casing, clean routing without trailing slashes, and identical canonical URL signals:

```text
/name/Aaron          https://howmanyofme.co/name/Aaron
/name/Abigail        https://howmanyofme.co/name/Abigail
/name/Adam           https://howmanyofme.co/name/Adam
/name/Adrian         https://howmanyofme.co/name/Adrian
/name/Aiden          https://howmanyofme.co/name/Aiden
/name/Alan           https://howmanyofme.co/name/Alan
/name/Albert         https://howmanyofme.co/name/Albert
/name/Alex           https://howmanyofme.co/name/Alex
/name/Alexander      https://howmanyofme.co/name/Alexander
/name/Alexandra      https://howmanyofme.co/name/Alexandra
/name/Alice          https://howmanyofme.co/name/Alice
/name/Alicia         https://howmanyofme.co/name/Alicia
/name/Allen          https://howmanyofme.co/name/Allen
/name/Allison        https://howmanyofme.co/name/Allison
/name/Amanda         https://howmanyofme.co/name/Amanda
/name/Amber          https://howmanyofme.co/name/Amber
/name/Amy            https://howmanyofme.co/name/Amy
/name/Andrea         https://howmanyofme.co/name/Andrea
/name/Andrew         https://howmanyofme.co/name/Andrew
/name/Angela         https://howmanyofme.co/name/Angela
/name/Ann            https://howmanyofme.co/name/Ann
/name/Anna           https://howmanyofme.co/name/Anna
/name/Anne           https://howmanyofme.co/name/Anne
/name/Anthony        https://howmanyofme.co/name/Anthony
/name/Antonio        https://howmanyofme.co/name/Antonio
/name/April          https://howmanyofme.co/name/April
/name/Aria           https://howmanyofme.co/name/Aria
/name/Ariana         https://howmanyofme.co/name/Ariana
/name/Arthur         https://howmanyofme.co/name/Arthur
/name/Ashley         https://howmanyofme.co/name/Ashley
/name/Audrey         https://howmanyofme.co/name/Audrey
/name/Aurora         https://howmanyofme.co/name/Aurora
/name/Austin         https://howmanyofme.co/name/Austin
/name/Ava            https://howmanyofme.co/name/Ava
/name/Avery          https://howmanyofme.co/name/Avery
/name/David          https://howmanyofme.co/name/David
/name/James          https://howmanyofme.co/name/James
/name/Logan          https://howmanyofme.co/name/Logan
/name/Mary           https://howmanyofme.co/name/Mary
/name/Michael        https://howmanyofme.co/name/Michael
/name/Patricia       https://howmanyofme.co/name/Patricia
/name/Robert         https://howmanyofme.co/name/Robert
/name/Sophia         https://howmanyofme.co/name/Sophia
/name/Uma            https://howmanyofme.co/name/Uma
/name/William        https://howmanyofme.co/name/William
/name/Xander         https://howmanyofme.co/name/Xander
/name/Zachary        https://howmanyofme.co/name/Zachary
/name/Zoe            https://howmanyofme.co/name/Zoe
```

---

## 3. Directory Routes (`/names/[letter]`)

All 26 letters (A–Z) pre-rendered with exact canonical URLs:
- `/names/a` → `https://howmanyofme.co/names/a`
- `/names/b` → `https://howmanyofme.co/names/b`
- ...
- `/names/z` → `https://howmanyofme.co/names/z`
