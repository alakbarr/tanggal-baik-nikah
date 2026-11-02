# Product Requirements Document
# Tanggal Baik Nikah — Javanese Tradition & Islamic Sunnah Wedding Advisor

**Document ID:** PRD-TBN-2026-V3  
**Version:** 3.0 (supersedes v2.0; audit of November 2, 2026)  
**Status:** Approved for implementation  
**Repository:** `D:\tanggal_baik_nikah`  
**Companions:** [`RESEARCH.md`](file:///D:/tanggal_baik_nikah/RESEARCH.md) (data and evidence) · [`ARCHITECTURE.md`](file:///D:/tanggal_baik_nikah/ARCHITECTURE.md) · [`DESIGN_SYSTEM.md`](file:///D:/tanggal_baik_nikah/DESIGN_SYSTEM.md) · [`TASKS.md`](file:///D:/tanggal_baik_nikah/TASKS.md)  
**Language policy:** documents in English; **all user-facing copy in Bahasa Indonesia**, with Javanese and Arabic terms kept verbatim.

---

## 1. What changed from v2.0

1. **Two layers, never mixed.** v2.0 scored dates with seven "systems", five of which depend only on the couple (Bektijammal, Pasatohan, mod 4, Pancasuda, names). Those values are identical for every date, so they could only shift all dates together and made some couples unable to reach "Tier 1" on any day. They now live in a **Couple Profile** panel. Only rules that vary by date rank dates.
2. **No stars, no tiers named after Paripurna.** Results show a **count of criteria met** and the reason every other date was dropped.
3. **Corrected data:** the 8-category table is `mod 9`; Kunarpaning/Sangaring Warsa are computed from their definition; anchor tables, the July 2027 wireframe and the example couple were recomputed.
4. **Shariah limits** that really depend on the date (iddah, ihram) are inputs; Friday is no longer called a Sunnah.
5. **Smaller stack:** one pure TypeScript core plus a static Next.js app; no database, no PDF library (see ARCHITECTURE v2).

---

## 2. Vision and principles

A family-friendly, offline, privacy-preserving tool that answers: *"Which dates in the period we have in mind are free of the pantangan of the tradition we follow, and what does the primbon say about us as a couple?"*, next to a clear Islamic frame: dates do not decide fate, a valid marriage needs five pillars, and customary taboos never void it.

| Principle | Consequence |
|---|---|
| Provenance first | Every verdict cites rule number, printed page and source tier. Rules without verified data are not shown as results |
| Transparent conflicts | Where the book disagrees with itself (Nos. 26/27, 14/30, three tables of No. 34) the user sees both and chooses |
| No fatalism | No percentages, no "disaster" score, no red alarm colour. Couple results end with the standard reminder |
| Local and offline | All computation in the browser. Nothing leaves the device |
| Honest uncertainty | Forecast Hijri dates, editorial readings and local traditions are labelled as such |

---

## 3. Personas (unchanged in intent)

- **Sikah & Dimas** (24–32, urban Muslim couple, 6–12 months before the wedding): need weekend dates acceptable to both sets of parents, without superstition.
- **Ibu Rina & Pakde Broto** (50–65, family elders): verify that a date respects the primbon they trust; distrust calculators that omit sources.
- **Ustadz Hadi** (pre-marital counsellor, KUA staff): wants a tool that separates fiqh from custom and can reassure couples frightened by a label like "Pegat".

Core stories: **US-01** find eligible dates in a window; **US-02** audit one date; **US-03** open the source of any verdict; **US-04** compare 2–3 dates side by side; **US-05** choose a tradition profile; **US-06** see the couple profile without it affecting dates.

---

## 4. Scope

### 4.1 In scope
1. **Calendar engine:** Gregorian, Sultan Agungan Javanese (Aboge and Asapon/Anenhing), pawukon (wuku, sadwara), Hijri (Kemenag and KHGT, with basis `official` or `forecast`).
2. **Couple Profile** (static): No. 15, 16, 17, 22, 23, 24, 25 from Betaljemur; name rules 19 and 20 (with visible transliteration); the popular 8-category table labelled "tabel populer".
3. **Date rules and filters** by tradition profile: Nos. 7, 8, 11, 12, 13, 14/30, 26/27, 28, 29, 31, 32, 33, 34, 35/36; optional No. 5, 6, 9, 10; Setiaji U-01…U-05 in the Pati profile.
4. **Hours (sa'at ijab)** from Nos. 35 and 36 for each eligible date.
5. **Islamic panel:** tawhid and anti-tiyarah texts, Shawwal and Friday notes with accurate grading, istikharah, walimah, KHI pillars, optional iddah/ihram limits.
6. **Views:** ranked list, month grid (three calendars), single-date audit, side-by-side comparison, weton checker, standalone calendar.
7. **Exports:** PNG summary card (html-to-image) and print stylesheet for a report; no PDF library.

### 4.2 Out of scope
Divination of any kind; fatwa issuance; KUA bookings; accounts and cloud sync; analytics; the 8-day/9-day wariga cycles (hastawara/sangawara) until anchored; No. 18 name rule (table gaps), No. 21 (diagram), No. 37 (incomplete).

---

## 5. Inputs

| Input | Required | Used by |
|---|---|---|
| Groom and bride birth date | yes | Couple Profile, personal pantangan |
| Birth time or "unknown" | no | day-boundary at sunset |
| Names (for the name rules only) | no | J-19, J-20; shows the aksara letters used and lets the user correct them |
| Date window (start–end, ≤ 24 months) and day filter (weekend / all / custom) | yes | candidate generation |
| Tradition profile (`keraton`, `pati`, `populer`, `custom`) | yes, default `keraton` | filters and criteria |
| Variant choices: No. 26 / 27 / both; No. 14 / 30 | default "both" | conservative filtering |
| Parents' birth wetons; deceased parents' death wetons | no | U-03, U-04 |
| End of the bride's iddah; ihram window | no | hard limits S-01, S-02 |
| Reckoning (Asapon official / Aboge) | default Asapon | Javanese date |

Birth dates before 24 March 1936 use Aboge automatically. The Javanese birth date shown is computed, and the user can override it for Nos. 24–25.

---

## 6. Solver behaviour

1. Candidate days = every day in the window that matches the day filter.
2. Hard limits (S-01, S-02), then the profile's **filters** (all failing rules are collected, not just the first).
3. Eligible dates are sorted by: criteria met (descending) → user's preferences matched (Shawwal, Friday, weekend; descending) → date ascending.
4. Dropped dates stay available in a collapsible list with reasons.
5. If the eligible list is empty, the UI says which filter removed the most dates and offers to relax it. It never suggests anything about the couple.

**Sizes (real, 2027 weekends, `keraton` with all filters):** 21 of 104 weekend days survive; 66 of 365 days. With No. 26 only: 36 of 104. Showing why dates drop matters because the strict profile removes about 80 % of weekend days.

**Criteria in `keraton`:** No. 11 month is *becik* for the Java year; No. 33 month is a primary month (Jumadilakir, Rejeb, Ruwah, Besar); No. 34 reads *harja* in all three tables; optional No. 9 rahayu weekday. **Preferences (tie-breakers, never filters):** Shawwal (Hijri, Kemenag), Friday, weekend.

---

## 7. Screens

### 7.1 Home / Cari tanggal (illustrative, real computed values)
Couple: Dimas Wicaksono (Kamis Pon, neptu 15) and Siti Rahayu (Kamis Legi, neptu 13); window 2027; weekends; profile `keraton`.

```
+--------------------------------------------------------------------------------------+
| Tanggal Baik Nikah      Cari tanggal | Cek weton | Kalender | Glosarium & sumber     |
+--------------------------------------------------------------------------------------+
| Pernikahan adalah akad yang suci. Tanggal tidak menentukan takdir; bergantunglah     |
| hanya kepada Allah. Petungan di sini hanyalah warisan budaya yang disajikan apa      |
| adanya.                                                                              |
+--------------------------------------------------------------------------------------+
| [Mempelai pria]  Dimas Wicaksono   28-05-1998  Kamis Pon (neptu 15)                  |
| [Mempelai wanita] Siti Rahayu       28-10-1999  Kamis Legi (neptu 13)                |
| Rentang: 2027   Hari: (o) Akhir pekan ( ) Semua   Tradisi: [Keraton v]               |
|                                      [ Cari tanggal ]                                |
+--------------------------------------------------------------------------------------+
| PROFIL PASANGAN (tidak memengaruhi urutan tanggal)                                   |
|  Tabel populer: 15 + 13 = 28 -> Pegat   Pasatohan (6, 4) -> sugih rejeki             |
|  Mod 4: 28 -> Punggel   Mod 5: 28 -> Lara   Pancasuda: 28 -> Lebu katiup angin       |
|                               [ Penjelasan & catatan fikih ]                         |
+--------------------------------------------------------------------------------------+
| 21 TANGGAL LOLOS SEMUA FILTER KERATON  (83 tanggal gugur - lihat alasannya)          |
|                                                                                      |
|  Ahad Wage, 17 Januari 2027                          memenuhi 2 dari 3 kriteria      |
|  8 Ruwah 1960 Be  .  9 Syaban 1448 H (Kemenag)  .  wuku Kuningan                     |
|  [v] Bulan utama (Ruwah, No. 33)  [v] Ahad kaping 2: harja di 3 tabel (No. 34)       |
|  [ ] Bulan becik tahun Be (No. 11)                                                   |
|  Saat ijab: 15.36-17.59 Slamet (No. 35, pasaran Wage)                                |
|  [ Lihat sumber & dalil ]                                                            |
|                                                                                      |
|  Sabtu Pon, 16 Januari 2027                          memenuhi 1 dari 3 kriteria      |
|  ...                                                                                 |
+--------------------------------------------------------------------------------------+
```

All values above were computed with `research/verification/` scripts (Pasatohan cell (4, 6); popular table 28 mod 9 = 1 → Pegat; No. 16 28 mod 4 = 0 → Punggel; No. 23 28 mod 5 = 3 → Lara; No. 22 28 mod 10 = 8 > 7 so 28 mod 7 = 0 → 7). The example is chosen on purpose: this couple reads badly on four couple rules, yet 21 weekend dates in 2027 pass every keraton filter, which is the case for keeping the layers apart. Regenerate the wireframe from the engine in Phase 5. The copy for each couple result ends with: "Hasil ini tidak menentukan sah atau tidaknya pernikahan (KHI Pasal 14) dan bukan ramalan takdir."

### 7.2 Month grid
Seven columns Senin–Ahad (Indonesian convention) or Ahad–Sabtu (Javanese convention) as a setting. Each cell: Gregorian day (large, lining numerals), Javanese date + weton + neptu, Hijri day (Kemenag; KHGT in tooltip), and a state: eligible with criteria count, dropped (reason on focus/tap), outside window. Keyboard: arrow navigation, Enter opens the drawer.

### 7.3 Provenance drawer ("Mengapa?")
For a date: left column *Panduan Islam*, right column *Petungan adat*. The adat column lists each rule with the arithmetic, the verbatim Javanese line (short), rule number, printed page, tier and `dataStatus`. A toggle excludes a rule from this search.

### 7.4 Weton checker
Weton, neptu, wuku, sadwara, Javanese and Hijri date, neptu sums for No. 24/25, dina pengapesan, geblak weton calculator.

---

## 8. Hijri behaviour
- Show Kemenag date by default; show KHGT beside it when it differs.
- Label `official` (from a published table) or `prakiraan hisab` (computed).
- Note: one-day differences do not affect the validity of the marriage.
- Preference "Syawal" uses the Kemenag Hijri month 10.

---

## 9. Accessibility and quality
- WCAG 2.2 AA: contrast, 24 px minimum target (44 px on touch), focus not obscured, drag alternatives (none used).
- Palette tokens that failed contrast in the audit are replaced in DESIGN_SYSTEM v3 (e.g. white on `prada-500` was 2.46:1).
- Indonesian screen-reader labels; `lang="id"` with `lang="jv"` on quoted Javanese.
- Reduced motion respected; dark mode with `color-scheme: dark`.
- Performance: initial JS ≤ 150 KB gzipped; solver ≤ 20 ms for a one-year window.

---

## 10. Privacy
No telemetry, no third-party requests at runtime (fonts self-hosted at build time), no storage by default. "Simpan di perangkat ini" saves names and dates to localStorage with a visible "Hapus data" control.

---

## 11. Verified test anchors
See ARCHITECTURE §6. In addition the product must reproduce these book examples: Pasatohan (5, 6) = "cepak rijekiné"; No. 16 30 → Gembili; No. 17 listing; No. 22 31 → Wasésasegara and 28 → Lebu katiup angin; No. 23 17 → Dana; No. 24 example 78 → pangantèn; No. 35 Rebo Pon date 1 → 06.00–08.23 Slamet; No. 39 Jumuah Pon 13 → becik; U-01 examples; dina pengapesan Selasa Wage → Senin Kliwon.

---

## 12. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Users read petungan as destiny | Critical | Fixed banner; couple results labelled informational; no scores; istikharah and KHI notes |
| Engagements strained by "Pegat"/"Punggel" | High | Couple Profile separated from ranking; wording "tabel populer"; counsellor-written note |
| Wrong table silently shipped | High | `dataStatus` gate; provenance per row; tests reproduce book examples |
| Hijri date wrong or unofficial | Medium | `official`/`forecast` label; pin official documents before release |
| Strict profile returns few or no dates | Medium | Show elimination reasons; offer relaxing one filter at a time |
| Copyright of the printed book | Medium | Rules (formulas, tables of facts) with short quotations and citation; the Wikisource transcription is CC BY-SA |
| Name transliteration errors (J-19/J-20) | Medium | Show aksara letters used; let the user edit |

---

## 13. Roadmap
1. **Phase 0** — documents fixed (this audit). Pin official Hijri documents.
2. **Phase 1** — workspace and tooling.
3. **Phase 2** — `packages/core` calendar with anchors.
4. **Phase 3** — rules as data and evaluators.
5. **Phase 4** — solver and explanations.
6. **Phase 5** — web app.
7. **Phase 6** — PWA and exports.
8. **Phase 7** — audits (a11y, fuzz, e2e, budget).

Detailed work breakdown: `TASKS.md`.
