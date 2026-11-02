# Research Dossier — Javanese Wedding Petungan & Islamic Wedding Guidance

**Version:** 3.0 (audited and re-verified against transcribed primary text)  
**Date:** November 2, 2026  
**Supersedes:** `REASEARCH.md` v2.0 (renamed; see §0 for every correction)  
**Language:** English for analysis; Javanese/Arabic/Indonesian kept verbatim where quoted.  
**Verification artefacts:** [`research/verification/`](file:///D:/tanggal_baik_nikah/research/verification) (Python, all runnable), [`research/betaljemur-wikisource/`](file:///D:/tanggal_baik_nikah/research/betaljemur-wikisource) (raw primary transcription, pages 7–28).

---

## 0. Corrections to v2.0 (read first)

| # | v2.0 claim | Finding | Evidence |
|---|---|---|---|
| 1 | Popular 8-category table = `(sum) mod 8` | **Wrong.** The table reproduces 35/35 with `mod 9` (remainders 0 and 1 → Pegat); `mod 8` matches 8/35 | `verify.py` |
| 2 | Table is from *Bektijammal Adammakna* Vol. IV | **Unverified.** Betaljemur (Wikisource, Cap-capan 63) contains no such table; no primary Bektijammal text was reachable. Treat as popular table, tier T3 | §4.8 |
| 3 | Rules 9 and 10 are tautological | **Wrong.** They map month groups to good (Rule 9) and moderate (Rule 10) weekdays; they discriminate | p. 10 of the book |
| 4 | Kunarpaning Warsa day names apply today | **Aboge-era table.** 7 of 8 printed rows match Aboge arithmetic; the Jé row is a printed anomaly. Use the definition (29/30 Besar) | `verify.py`, §3.2 |
| 5 | Rule 8 printed table valid | Same: 7 of 8 rows match Aboge; Bé row prints "Setu Legi" where Aboge arithmetic gives "Setu Pon" | `verify.py` |
| 6 | Rule 15 = `groom + bride` mod 9 | Already corrected in v2.0: it is a 2-D lookup, verified in full (§4.1) | p. 13–14 |
| 7 | Rules 18–20 use one letter table (1…20) | **Wrong.** Rule 18 and Rule 19 each print their own table; only Rule 20 is 1…20. Rule 18's table is incomplete (Dha blank, Nya absent, Ya = 5 in table but 2 in worked example) | p. 15–16 |
| 8 | Rule 22: divide by 10, if > 7 divide by 7 | Confirmed from text, but remainder 0 is unspecified (§4.5) | p. 18 |
| 9 | Rule 34 has 3 tables, one partly illegible | All three tables are fully printed (pp. 22–23); six weekday/occurrence cells read *harja* in all three (§5.12) | p. 23–24 |
| 10 | Kurup ranges Jamngiyah 1555–1674, Amiswon 1675–1794, Aboge 1795–1866 | Secondary sources: Jamngiyah 1555–1626, Kamsiyah/Amiswon 1627–1746, Aboge 1747–1866 (120-year kurups) | §2.2 |
| 11 | Asapon final day "Ahad Pon" | **Ahad Legi** (JDN 2470775) | `verify.py` |
| 12 | Undip thesis: "master's thesis, 2021", fieldwork in Godo | S1 *skripsi* (journal version), cover 2021, deposited 24 Feb 2022, Bayu Candra Setiaji, FIB Undip; manuscript of Pak Suyadi, **Desa Kropak**, Winong, Pati. Rule U-01 confirmed from the PDF; invented remainder labels removed | §5 |
| 13 | Mahr listed among 5 pillars | KHI Pasal 14: groom, bride, wali, two witnesses, ijab-kabul. Mahr is obligatory (Pasal 30) but not a pillar (Pasal 34 ayat 1) | §7.4 |
| 14 | "KHGT 2024", "MABIMS 3° elongation", "Umm al-Qura converter" | KHGT ratified Feb 2024, in force from 1 Muharram 1447 H (26 Jun 2025). MABIMS: altitude ≥ 3°, elongation ≥ 6.4°. Indonesia does not use Umm al-Qura | §7.1 |
| 15 | Friday akad is a Sunnah | No sahih marfu' text singles out the akad on Friday. It is a scholarly *istihbab* by analogy | §7.3 |

---

## 1. Method, Sources and Tiers

**Primary text.** *Kitab Primbon Betaljemur Adammakna*, Cap-capan kaping 63 (2018), Penerbit "Soemodidjojo Mahadewa", Praja Dalem Ngayogyakarta Hadiningrat, with CV Buana Raya; compiled by R. Soemodidjojo from the manuscript of K.P.H. Tjakraningrat. Accessed as the page-by-page transcription on Javanese Wikisource, `Kaca:Kitab_Primbon_Betaljemur_Adammakna.pdf/N`. Every page used here carries Wikisource `pagequality level="4"` (validated). Printed page numbers are the PDF page minus 1 (PDF 14 = printed 13).

**Licence.** Wikisource text is CC BY-SA 4.0. The raw pages in `research/betaljemur-wikisource/` keep that licence and attribution. App copy must quote short excerpts only and cite rule number and printed page.

**Tiers.**

| Tier | Meaning |
|---|---|
| T0 | Qur'an, sahih hadith |
| T1 | Betaljemur text, read directly from the transcription |
| T1-L | Local ethnographic manuscript (Setiaji, Undip) |
| T2 | Institutional text (KHI, Kemenag, Muhammadiyah, MUI, NU) |
| T3 | Secondary or popular compilation; source not independently confirmed |

**Rule of data.** A rule enters the app only when its table is printed in a source we hold, is internally consistent, and appears in the `dataStatus: 'verified'` list in §9. Everything else stays `pending` or `secondary` and is excluded from ranking.

---

## 2. Calendar Mathematics (all values recomputed)

### 2.1 Core formulas
- JDN (Fliegel–Van Flandern): `a=⌊(14−M)/12⌋; y=Y+4800−a; m=M+12a−3; JDN=D+⌊(153m+2)/5⌋+365y+⌊y/4⌋−⌊y/100⌋+⌊y/400⌋−32045`
- Saptawara `(JDN+1) mod 7` (0 Ahad … 6 Sabtu). Pancawara `JDN mod 5` (0 Legi, 1 Pahing, 2 Pon, 3 Wage, 4 Kliwon).
- Neptu: Ahad 5, Senin 4, Selasa 3, Rabu 7, Kamis 8, Jumat 6, Sabtu 9; Legi 5, Pahing 9, Pon 7, Wage 4, Kliwon 8 (Betaljemur p. 7). A weton's neptu ranges 7–18; a couple's 14–36.
- Pawukon: `d=(JDN−146) mod 210`; wuku index `⌊d/7⌋` (0 Sinta … 29 Watugunung). Sadwara `d mod 6`, never `JDN mod 6`.
- Hastawara/Padewan (8) and Sangawara/Padangon (9) do not divide 210, so a plain modulus is wrong. Balinese wariga sources describe the exceptions (*Kala tiga* for the 8-day cycle, *Dangu pat* for the 9-day cycle); whether the Javanese padewan follows the same exceptions is not established here. No Betaljemur rule used by this app needs them, so they stay out until an almanac anchor set exists.
- Javanese year name `(year − 1867) mod 8`: Alip, Ehé, Jimawal, Jé, Dal, Bé, Wawu, Jimakir. Long years (355 d, Besar 30 d): Ehé, Dal, Jimakir. Month lengths: Sura 30, Sapar 29, Mulud 30, Bakdamulud 29, Jumadilawal 30, Jumadilakir 29, Rejeb 30, Ruwah 29, Pasa 30, Sawal 29, Dulkangidah 30, Besar 29/30.

### 2.2 Kurup (120-year cycle)
A windu is 2,835 days (≡ 0 mod 7 and mod 5), so without correction 1 Sura of Alip would always fall on the same weton. 120 mean lunar years ≈ 42,524.05 d versus 15 windu = 42,525 d, so the 120th year (a Jimakir) loses its leap day (*gugur sedina*): 42,524 d per kurup, which shifts the weton of 1 Sura Alip back by one day and one pasaran.

| Kurup | 1 Sura Alip | Java years | Epoch JDN | Status |
|---|---|---|---|---|
| Jamngiyah | Jumat Legi | 1555–1626 | — | historical |
| Kamsiyah (Amiswon) | Kamis Kliwon | 1627–1746 | — | historical |
| **Aboge** | **Rabu Wage** | 1747–1866 | **2385728 (1819-10-20 as computed from the Asapon epoch minus 42,524 d)** | in use by some rural communities |
| **Asapon** | **Selasa Pon** | 1867–1986 | **2428252 (1936-03-24)** | official court/Kemenag-aligned reckoning |
| Anenhing | Senin Pahing | 1987–2106 | 2470776 (2052-08-26) | future |

Note the Aboge row: 1747 J as an Alip epoch follows from subtracting one kurup length from the Asapon epoch. The 1819-10-20 date is a derived value, not a quoted one; do not display it as a historical fact. The Jamngiyah and Kamsiyah epochs are not computed because the app's earliest supported date is 1936-03-24 for the official reckoning and 1819 for Aboge births.

**Kurup dependence of printed tables.** Any Betaljemur table that prints a weton for a Javanese date was compiled under Aboge. Computing from the definition under Asapon moves every printed weton back by one day and one pasaran. The app computes from definitions.

### 2.3 Verified anchors

| Gregorian | JDN | Weton | Wuku | Javanese |
|---|---|---|---|---|
| 1936-03-24 | 2428252 | Selasa Pon | Langkir (#12) | 1 Sura 1867 Alip |
| 1945-08-17 | 2431685 | Jumat Legi | Manahil (#22) | 9 Pasa 1876 Ehé |
| 2024-07-08 | 2460500 | Senin Legi | Watugunung (#29) | 1 Sura 1958 Jé |
| 2025-06-27 | 2460854 | Jumat Kliwon | Medangkungan (#19) | 1 Sura 1959 Dal |
| 2026-06-17 | 2461209 | Rabu Kliwon | Galungan (#10) | 1 Sura 1960 Bé |
| 2026-11-02 | 2461347 | Senin Pon | Sinta (#0) | 21 Jumadilawal 1960 Bé |
| 2027-07-10 | 2461597 | Sabtu Pon | Gumbreg (#5) | 5 Sapar 1961 Wawu |
| 2052-08-25 | 2470775 | Ahad Legi | Kulawu (#27) | 29 Besar 1986 Jimakir |
| 2052-08-26 | 2470776 | Senin Pahing | Kulawu (#27) | 1 Sura 1987 Alip |

Cross-checks: five Balinese Galungan dates (2024-02-28, 2024-09-25, 2025-04-23, 2025-11-19, 2026-06-17) are all Rabu Kliwon in wuku #10. 1 Sura 1959 equals 1 Muharram 1447 (Kemenag, 27 Jun 2025). 17 August 1945 = 9 Pasa 1876 is corroborated by kalenderku.id.

> [!NOTE]
> Hari Jawa and Hijri days begin at sunset (*Maghrib*). A birth after local sunset belongs to the next weton. The app asks for birth time when known and shows both wetons if unknown and close to sunset.

---

## 3. Date-Dependent Rules (Betaljemur, verified)

Printed page = book page. "Effect" is the book's own verdict wording.

### 3.1 Month-level tables

**No. 9 Sasi rahayu** ("becik kanggo samubaranggawe", p. 10) and **No. 10 Sasi sarju** ("sedheng", p. 10) — general-purpose, not wedding-specific; use as optional soft criteria.

| Months | Rahayu days (good) | Sarju days (moderate) |
|---|---|---|
| Besar, Sura, Sapar | Rebo, Kemis | Jumuah |
| Mulud, Rabingulakir, Jumadilawal | Jumuah | Setu, Akad |
| Jumadilakir, Rejeb, Ruwah | Setu, Akad | Senèn, Selasa |
| Pasa, Sawal, Dulkaidah | Senèn, Selasa | Rebo, Kemis |

**No. 11 Pati uriping sasi** (p. 10). Months numbered 1 Sura … 12 Besar. Unlisted months are *sedheng*.

| Year | Becik | Ala |
|---|---|---|
| Alip | 1 | 9, 11 |
| Ehé | 1, 2, 6, 7, 8, 10 | 4, 9, 11, 12 |
| Jimawal | 7, 8, 10 | 1, 2, 3, 5, 12 |
| Jé | 4, 5, 6, 7, 8, 9, 12 | 1, 2, 3, 10, 11 |
| Dal | 6, 7, 9, 10 | 2, 3, 8, 11 |
| Bé | 6, 12 | 1, 2, 7 |
| Wawu | 2, 3, 4, 5, 9 | 1, 10, 11, 12 |
| Jimakir | 3, 5, 7, 8, 10, 12 | 1, 11 |

**No. 12 Anggaraksih** (p. 11): "Sasi kang ora ana dinané Anggarakasih (Selasa Kliwon) ora kena kanggo ngijabaké pangantèn." The printed list per year (Alip: Jumadilakir, Besar; Ehé: Rejeb; Jimawal: Sura, Ruwah; Jé: Sapar, Ruwah; Dal: Mulud, Pasa; Bé: Rabingulakir; Wawu: Rabingulakir, Dulkaidah; Jimakir: Jumadilawal) is Aboge-era. **Compute from the definition** by scanning the month for Selasa Kliwon. In Asapon 1960–1962 the months lacking it are Mulud 1960, Sawal 1960, Bakdamulud 1961, Sawal 1961, Jumadilawal 1962, Dulkangidah 1962.

**No. 13 Larangan sasi** (p. 11, "ora kena nganggo ngijabaké pangantèn"):

| Year | Forbidden months | Consequence |
|---|---|---|
| Alip | Jumadilakir, Dulkaidah | sinung lara klebon wisa |
| Ehé | Rabingulawal (Mulud), Pasa | sinung lara bebalung (printed "lawa") |
| Jimawal | Mulud, Besar | bilai, keli ing kali (printed "Bilal") |
| Jé | Sura, Sawal | sinung lara barah |
| Dal | Ruwah | sinung lara rumab |
| Bé | Sapar, Rejeb | kena prakara gedhé |
| Wawu | Jumadilawal | sinung lara sirah |
| Jimakir | Sura, Dulkaidah | sinung lara édan |

**No. 33 Ala beciking sasi** (p. 21):

| Month | Verdict |
|---|---|
| Sura | tukar padu, nemu karusakan — *aja diterak* |
| Sapar | kekurangan, sugih utang — *kena diterak* |
| Mulud | mati salah siji — *aja diterak* |
| Rabingulakir | tansah dicatur lan nemu ujar ala — *kena diterak* |
| Jumadilawal | kerep kélangan, kapusan, sugih satru — *kena diterak* |
| Jumadilakir | sugih mas salaka |
| Rejeb | sugih anak lan slamet |
| Ruwah | rahayu ing sakabèhé |
| Pasa | cilaka gedhé — *aja diterak* |
| Sawal | kekurangan, sugih utang — *kena diterak* |
| Dulkangidah | gering, kerep pasulayan lan mitra — *aja diterak* |
| Besar | sugih, nemu suka harja |

Book note: the best months are Jumadilakir, Rejeb, Ruwah, Besar, **provided the month contains a Selasa Kliwon** (better still with Jumuah Kliwon). A month without Selasa Kliwon is a bad month. If necessary one may "nerak" Sapar, Rabingulakir, Jumadilawal or Sawal, preferably when they contain Selasa Kliwon.

### 3.2 Year-level days

**No. 7 Kunarpaning warsa** (p. 9): "Ora keno kanggo mantu lan sapadhane. Pitungé ajeg tiba saben tanggal 29 utawa 30 sasi Besar." Invariant: the last day of Besar.

**No. 8 Sangaring warsa** (p. 9): "Pitungé ajeg tiba tanggaping warsa let 3 dina, (saben sasi Suro tanggal 3)." Invariant: 3 Sura.

| Java year | Printed (Aboge) No. 7 | Printed (Aboge) No. 8 | Computed Asapon No. 7 (last Besar) | Computed Asapon No. 8 (3 Sura) |
|---|---|---|---|---|
| Alip | Setu Paing | Jumuah Legi | Jumat Legi | Kamis Kliwon |
| Ehé | Kemis Paing | Slasa Kliwon | Rabu Legi | Senin Wage |
| Jimawal | Senèn Legi | Akad Kliwon | Ahad Kliwon | Sabtu Wage |
| Jé | Jumuah Legi *(anomaly; Aboge gives Jumuah Kliwon)* | Kemis Wagé | Kamis Wage | Rabu Pon |
| Dal | Rebo Kliwon | Senèn Pon | Selasa Wage | Ahad Pahing |
| Bé | Akad Wagé | Setu Legi *(anomaly; Aboge gives Setu Pon)* | Sabtu Pon | Jumat Pahing |
| Wawu | Kemis Pon | Rebo Paing | Rabu Pahing | Selasa Legi |
| Jimakir | Slasa Pon | Akad Legi | Senin Pahing | Sabtu Kliwon |

Asapon columns come from `verify.py` over 1960–1967 J. An earlier research draft listed Je = "Kemis Kliwon" and Alip No. 8 = "Kemis Wage"; both were shifted from an anomalous row and are wrong.

### 3.3 Day-of-month tables (calendar-date invariant)

**No. 14 Sangaring tanggal** (p. 12; "prayoga disirik"): four dates plus a taliwangké weton per month.

| Month | Dates | Taliwangké | Kadadéyané |
|---|---|---|---|
| Sura | 11, 14, 17, 27 | Rebo Paing | luwih gedhé rubédane |
| Sapar | 1, 12, 20, 22 | Kemis Pon | sinung lara kesandung |
| Mulud | 10, 13, 15, 23 | Jumuah Wagé | sinung lara weteng |
| Bakdamulud | 10, 15, 20, 25 | Setu Kliwon | larané lunga teka |
| Jumadilawal | 10, 11, 16, 26 | Senèn Kliwon | sinung lara bebalung |
| Jumadilakir | 3, 11, 14, 21 | Slasa Legi | sinung lara owah |
| Rejeb | 2, 11, 12, 22 | Rebo Paing | sinung klebon wisa |
| Ruwah | 14, 19, 24, 28 | Kemis Pon | kena wisané dhéwé |
| Pasa | 10, 15, 20, 25 | Jumuah Wagé | sinung lara mata |
| Sawal | 2, 17, 20, 27 | Setu Kliwon | gung kena perkara |
| Dulkangidah | 6, 11, 12, 21 | Senèn Kliwon | sinung gring kapit |
| Besar | 1, 13, 20, 23 | Slasa Legi | gung kasusuahan |

**No. 28 Na'asing para Nabi** (p. 19): Sura 13 (Ibrahim), Mulud 3 (Adam), Rabingulakir 16 (Yusuf), Jumadilawal 5 (Nuh), Pasa 21 (Musa; footnote: other primbon say 12, this edition fixes **12 and 21**), Dulkangidah 24 (Yunus), Besar 25 (Muhammad in the cave). "Ora kena kanggo mantu."

**No. 29 Na'asing tanggal** (p. 19; "ora keno kanggo mantu"):

| Month | Dates | Month | Dates |
|---|---|---|---|
| Sura | 6, 11 | Rejeb | 2, 14 |
| Sapar | 1, 20 | Ruwah | 12, 13 |
| Mulud | 10, 20 | Pasa | 9, 20 |
| Bakdamulud | 10, 20 | Sawal | 10, 20 |
| Jumadilawal | 1, 11 | Dulkangidah | 9, 13 |
| Jumadilakir | 10, 14 | Besar | 10, 12 |

**No. 30 Sangaring tanggal** (p. 20; second, single-date list): Sura 18, Sapar 10, Mulud 8, Bakdamulud 28, Jumadilawal 28, Jumadilakir 18, Rejeb 18, Ruwah 26, Pasa 24, Sawal 2, Dulkangidah 28, Besar none. Conflicts with No. 14; show both, let the profile choose.

**No. 31 Bangas padéwan** (p. 20; "yèn tinerak ampuh banget, bakal nemu kesusahan"):

| Month | Dates | Month | Dates |
|---|---|---|---|
| Sura | 11 | Rejeb | 13, 27 |
| Sapar | 20 | Ruwah | 4, 28 |
| Mulud | 1, 15 | Pasa | 7, 9, 20 (footnote: other primbon give 9, 20; this edition fixes 7, 9, 20) |
| Bakdamulud | 10, 20 | Sawal | 10 |
| Jumadilawal | 10, 11 | Dulkangidah | 2, 22 |
| Jumadilakir | 10, 14 | Besar | 6, 20 |

### 3.4 Weekday tables

**No. 26 Dina ala** (p. 18) and **No. 27 Dina sangaring asal** (p. 19), both "ora kena kanggo mantu." Printed together, never reconciled. The quadrant order in No. 27 is rotated by one step relative to No. 26.

| Months | No. 26 forbidden | No. 27 forbidden |
|---|---|---|
| Jumadilakir, Rejeb, Ruwah | Jumuah | Rebo, Kemis |
| Pasa, Sawal, Dulkangidah | Setu, Akad | Jumuah |
| Besar, Sura, Sapar | Senèn, Slasa | Setu, Akad |
| Mulud, Rabingulakir, Jumadilawal | Rebo, Kemis | Senèn, Slasa |

Conflict worth showing to users: under No. 26, Sabtu and Ahad are barred in Pasa–Dulkangidah (includes Sawal, the month the Prophet married in); under No. 27 they are barred in Besar–Sapar.

**No. 32 Taliwangké** (p. 21): Dulkangidah & Jumadilawal Senèn Kliwon; Besar & Jumadilakir Slasa Legi; Sura & Rejeb Rebo Paing; Sapar & Ruwah Kemis Pon; Mulud & Pasa Jumuah Wagé; Rabingulakir & Sawal Setu Kliwon. (Same weton as column "taliwangké" in No. 14 for each month.)

### 3.5 Position-in-month: No. 34 *Pamilihing dina ijabing panganten rupa 3* (pp. 22–23)

*Kaping N* means the N-th occurrence of that weekday inside the Javanese month (book p. 23: "tanggal 1 Jumuah, iku Jumuah kaping 1, tanggal 8 kaping 2, tanggal 15 kaping 3, tanggal 22 kaping 4, tanggal 29 kaping 5").

| Day | Table I (1–5) | Table II (1–5) | Table III (1–5) |
|---|---|---|---|
| Jumuah | harja, satru Allah, pati, begja, olèh anak | harja, satru Allah, pati, kasembadan, harja | harja, satru Allah, dadi tilikan, pati, harja |
| Setu | tuna luput, satru Allah, nepsu gedhé, harja, begja | satru Allah, tuna luput, susah gedhé, begja, harja | satru Allah, tuna luput, nepsu, harja, harja |
| Akad | tuna luput, harja, pati, begja harja, dosa gedhé | tuna luput, harja, satru Allah, begja, harja | tuna luput, harja, susah, harja, harja |
| Senèn | satru Allah, harja, kagèt, begja, suka gedhé | tuna luput, harja, suka gedhé, satru Allah, nemu suka | tuna luput, harja, susah, harja, satru Allah |
| Selasa | tuna luput, satru Allah, dosa gedhé, harja, susah gedhé | tuna luput, suka gedhé, kagèt, harja, karta | satru Allah, tuna luput, kagèt, harja, pati |
| Rebo | tuna luput, harja, pati, suka rena, kagèt | suka gedhé, harja, pati, harja, satru Allah | nyertu, harja, pati, harja, satru Allah |
| Kemis | tuna luput, satru Allah, harja, ugungan, dosa gedhé | tuna luput, satru Allah, harja, olèh sanak, jro pati | tuna luput, satru Allah, harja, dadi rubungan, satru Allah |

Book's resolution: the three tables disagree, so pick a day where all three agree (*tumbuk tibané pada becik*), for example Selasa kaping 4 (harja, harja, harja). Computed: the cells reading *harja* in all three tables are **Jumuah 1, Akad 2, Senèn 2, Selasa 4, Rebo 2, Kemis 3**. Cells favourable under a wider reading (harja/begja/kasembadan in all three) additionally include Setu 4, Setu 5, Akad 4 (`verify4.py`).

### 3.6 Hours: Nos. 35, 36, 37 and 42 (pp. 24–25, 27)

The book states that the three *sa'at* systems are equivalent and the user may use whichever is customary locally (p. 25). Window labels differ between printings (No. 35 prints 8.25–10.11 and 10.18–1.11; No. 36 prints 8.24–10.47 and 10.48–1.11). The consistent grid is five windows of 2 h 24 m: 06:00–08:23, 08:24–10:47, 10:48–13:11, 13:12–15:35, 15:36–17:59. No. 35 text uses 1.12–3.35 and 3.36–5.59 for the last two, i.e. 13:12–15:35 and 15:36–17:59.

**No. 35** (by pasaran; *tanggal* only names the angel): quality per window.

| Pasaran | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Legi | Pitutur | Rejeki | Slamet | Pangkalan | Pacekwesi |
| Paing | Rejeki | Slamet | Pangkalan | Pacekwesi | Pitutur |
| Pon | Slamet | Pangkalan | Pacekwesi | Pitutur | Rejeki |
| Wagé | Pangkalan | Pacekwesi | Pitutur | Rejeki | Slamet |
| Kliwon | Pacekwesi | Pitutur | Rejeki | Slamet | Pangkalan |

Angel by date group (windows 1–5): dates ≡ 1 (mod 5): Akhmad, Jabarail, Ibrahim, Yusup, Ngijrail; ≡ 2: Jabarail, Ibrahim, Yusup, Ngijrail, Akhmad; ≡ 3: Ibrahim, Yusup, Ngijrail, Akhmad, Jabarail; ≡ 4: Yusup, Ngijrail, Akhmad, Jabarail, Ibrahim; ≡ 0: Ngijrail, Akhmad, Jabarail, Ibrahim, Yusup. Example in the book: Rebo Pon, date 1/6/11/16/21/26 → window 1 Slamet ("becik"), window 5 Rejeki ("sedheng"). Nobles use Slamet, merchants Rejeki.

**No. 36** (by date only; angel + quality):

| Dates | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| 1, 6, 11, 16, 21, 26 | Akhmad Tutur | Jabarail Alangan | Ibrahim Pacak | Yusup **Slamet** | Ngijrail Rijeki |
| 2, 7, 12, 17, 22, 27 | Jabarail Rijeki | Ibrahim Tutur | Yusup Alangan | Nijrail Pacak | Akhmad **Slamet** |
| 3, 8, 13, 18, 23, 28 | Ibrahim **Slamet** | Yusup Rijeki | Ngijrail Tutur | Akhmad Alangan | Jabarail Pacak |
| 4, 9, 14, 19, 24, 29 | Yusup Pacak | Ngijrail **Slamet** | Akhmad Rijeki | Jabarail Tutur | Ibrahim Alangan |
| 5, 10, 15, 20, 25, 30 | Ngijrail Alangan | Akhmad Pacak | Jabarail **Slamet** | Ibrahim Rijeki | Yusup Tutur |

Slamet = good, Rijeki = moderate, others to avoid. **No. 37** (lintang suhara/ndadari times) is a third, less common system with an incomplete printed table; leave inactive. **No. 42**: tarub starts also use a sa'at from No. 35, 36 or 37.

### 3.7 Preparation days (Nos. 38–43; informational)

- **No. 39** tarub by weton neptu: 7/13 ayem tentrem becik; 8/14 sèluman lanang ala; 9/15 dodok acung ala; 10/16 temen lan luhur becik; 11/17 sèluman wadon ala; 12/18 bencana ala. Example: Jumuah Pon 13 → becik.
- **No. 40** tarub by date mod 5: 1,6,11,16,21,26 kagunganing ratu (ala); 2,7,… sèluman lanang (ala); 3,8,… sèluman wadon (ala); 4,9,14,19,24,29 slamet lan sempulur rejekiné (**becik**); 5,10,… sampyuh (ala).
- **No. 41** tarub by date mod 7: 1,8,15,22,29 kagunganing ratu; 2,9,16,23,30 sèluman lanang; 3,10,17,24 sèluman wadon (all ala); 4,11,18,25 rahayu seneng and 5,12,19,26 rahayu tentrem (**becik**); 6,13,20,27 pati lanang and 7,14,21,28 pati wadon (ala). The book says choose any of Nos. 39–41.
- **No. 43** attire (jarik cakarayam, truntum, sindur) — cultural note, no computation.

### 3.8 Wuku-based taboo days (Nos. 5 and 6; p. 8)

The book gives **6 *dina taliwangké*** and **5 *dina samparwangké*** (the latter always a Monday, "ringkel Aryang"): both lists were checked against the pawukon arithmetic.

| Dina taliwangké (No. 5) | Wuku | Weton |
|---|---|---|
| Somayé | Wuyé | Senèn Kliwon |
| Anggarayang | Wayang | Slasa Legi |
| Bodanep | Landep | Rebo Paing |
| Warigamis | Warigalit | Kemis Pon |
| Sukraingan | Kuningan | Jumuah Wagé |
| Tumpaklote | Kuruwelut | Setu Kliwon |

| Samparwangké (No. 6) | Weton |
|---|---|
| Warigalit | Senèn Kliwon |
| Bala | Senèn Legi |
| Langkir | Senèn Paing |
| Sinta | Senèn Pon |
| Tambir | Senèn Wagé |

These are not in Nos. 1–43's wedding rules (the book recommends avoiding them for any important undertaking). Offer them as an optional pantangan layer, off by default.

---

## 4. Couple-Profile Rules (Betaljemur, verified)

These depend only on the couple. They go in the Couple Profile panel. They never rank dates.

### 4.1 No. 15 Pétung pasatohan (pp. 12–13)
`R = neptu mod 9` for each spouse, `0 → 9`. Look up (groom R, bride R); the table is symmetric.

| | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| **1** | becik kinasihan | becik | kuat, adoh rijekiné | akèh bilahiné | pegat | adoh sandhang pangané | sugih satru | kasurang-surang | dadi pangauban |
| **2** | | slamet, akèh rijekiné | gelis mati siji | akèh godané | akèh bilahiné | gelis sugih | anaké akèh mati | cepak rijekiné | akèh rijekiné |
| **3** | | | mlarat | akèh bilahiné | gelis pegat | olèh nugraha | akèh bilahiné | gelis mati siji | sugih rejeki |
| **4** | | | | kerep lara | akèh rencanané | sugih rejeki | mlarat | akèh pangkalané | kalah siji |
| **5** | | | | | tulus begjané | cepak rijekiné | tulus sandhang pangané | akèh sambékalané | cepak sandhang pangané |
| **6** | | | | | | gedhé bilahiné | rukun | sugih satru | kasurang-surang |
| **7** | | | | | | | ingukum maring rabiné | nemu bilahi saka awaké dhéwé | tulus palakramané |
| **8** | | | | | | | | kinasihan déning wong | akèh bilahiné |
| **9** | | | | | | | | | giras rijekiné |

Print notes: (a) the cell (8, 9) is printed as "9 lan 9, akeh bilahiné", immediately followed by the true "9 lan 9, giras rijekiné"; the first is read as (8, 9) because the list otherwise skips it (editorial inference, flagged in code comments); (b) OCR spellings *bihahiné* and *bilainé* are normalised to *bilahiné*; (c) an earlier research draft wrote (4, 5) as "akèh rencanané / godhané" and (5, 7) as "…sandhang lan pangkané": both were wrong. Worked example (book): Jumuah Kliwon (14 → 5) × Jumuah Paing (15 → 6) = *cepak rijekiné, iku becik*.

### 4.2 No. 16 (p. 13): `(g + b) mod 4`: 1 Gentho (larang anak), 2 Gembili (sugih anak), 3 Sri (sugih rijeki), 0/4 Punggel (mati siji). Example: 13 + 17 = 30 → 2 Gembili.

### 4.3 No. 17 (p. 13): groom weekday × bride weekday (28 unordered pairs, birth weekday only).

| Pair | Result | Pair | Result |
|---|---|---|---|
| Akad–Akad | kerep lara | Selasa–Jumuah | pegat |
| Akad–Senèn | sugih lara | Selasa–Setu | kerep padu |
| Akad–Selasa | melarat | Rebo–Rebo | ala |
| Akad–Rebo | juwana (yuwana) | Rebo–Kemis | yuwana |
| Akad–Kemis | padu | Rebo–Jumuah | yuwana |
| Akad–Jumuah | yuwana | Rebo–Setu | becik |
| Akad–Setu | mlarat | Kemis–Kemis | yuwana |
| Senèn–Senèn | ala | Kemis–Jumuah | yuwana |
| Senèn–Selasa | yuwana | Kemis–Setu | pegat |
| Senèn–Rebo | anaké wadon | Jumuah–Jumuah | mlarat |
| Senèn–Kemis | disini wong | Jumuah–Setu | cilaka |
| Senèn–Jumuah | yuwana | Setu–Setu | ala |
| Senèn–Setu | berkat | Selasa–Selasa | ala |
| Selasa–Rebo | sugih | Selasa–Kemis | sugih |

### 4.4 Nos. 18–20 (name letters; pp. 14–15)
- **No. 20** (first letters, sum mod 5) is complete with letters Ha 1, Na 2, Ca 3, Ra 4, Ka 5, Da 6, Ta 7, Sa 8, Wa 9, La 10, Pa 11, Dha 12, Ja 13, Ya 14, Nya 15, Ma 16, Ga 17, Ba 18, Tha 19, Nga 20: 1 Sri (slamet lumintu rijekiné), 2 Lungguh (duwé pangkat), 3 Gedhong (sugih), 4 Lara (kangélan), 0/5 Pati (sangsara utawa karep kepatén). Example Markijan (Ma 16) + Dinah (Da 6) = 22 → 2 Lungguh.
- **No. 19** (first + last letters of both names, sum mod 7) uses its own letter table: Ha 6, Na 3, Ca 3, Ra 3, Ka 3, Da 5, Ta 3, Sa 3, Wa 6, La 5, Pa 1, Dha 4, Ja 3, Ya 8, Ma 5, Ga 1, Ba 1, Tha 4, Nga 2 (Nya absent). Outcomes: 1 Tunggak tan semi, 2 Pisang punggel, 3 Lumbung gumilang, 4 Sanggar waringin, 5 Pedaringan kebak, 6 Satriya lelaku, 0/7 Pandhita mukti. Example: Sura**na** (Sa 3 + Na 3 = 6) + Marti**yah** (Ma 5 + Ya 8 = 13): 19 mod 7 = 5.
- **No. 18** (first + last letter per person mod 9, 2-D result) has its own table: Ha 1, Na 3, Ca 5, Ra 7, Ka 2, Da 4, Ta 7, Sa 9, Wa 1, La 1, Pa 7, Ja 6, Ya 5, Ma 4, Ga 2, Ba 9, Tha 9, Nga 10; **Dha is blank and Nya is absent**; the worked example uses Ya = 2, contradicting Ya = 5. Result: **dataStatus `pending`** (cannot be computed without guessing).
- Latin name → aksara mapping is not in the book, and the Hanacaraka spelling of Indonesian names (initial vowel → Ha; final *-h* wignyan ignored; consonant clusters → base letter) is an editorial convention. The app must show the chosen aksara letters and let the user correct them.
- **No. 21** (Kraton mulya) depends on a figure not transcribed; inactive.

### 4.5 No. 22 Pancasuda for couples (p. 17)
Book text: sum the two wetons' neptu, divide by 10 *or* 7: "turahé ora keno luwih saka 7. Manawa kabagé 10 turahé luwih saka 7, iku banjur kabagé 7." Examples: 7 + 9 + 8 + 7 = 31 → mod 10 = 1 → Wasésasegara; 28 → mod 10 = 8 > 7 → mod 7 = 7 → Lebu katiup angin (the "28 / 7" case yields remainder 0, read as 7). 1 Wasésasegara, 2 Tunggaksemi, 3 Satriya wibawa, 4 Sumursinaba, 5 Satriyawirang (antidote: shed blood, e.g. slaughter a chicken), 6 Bumikapetak (antidote: bury earth), 7 Lebu katiup angin (antidote: scatter earth). **Unspecified in the text:** a sum with `mod 10 = 0` (e.g. 20, 30). Rule `I-22-0` in the registry: treat 0 as "luwih saka 7" and divide by 7; flag this as an editorial reading in the UI.
The ritual "antidotes" belong to adat; the app lists them as heritage notes and never as recommendations.

### 4.6 No. 23 (p. 17): `(g + b) mod 5`: 1 sri, 2 dana, 3 lara, 4 pati, 0/5 lungguh. "Kang becik: sri, dana, lungguh; lara utawa pati ala." Example: 9 + 8 = 17 → 2 dana, becik.

### 4.7 Nos. 24 and 25 (p. 18): birth coordinates
Sum for each spouse: neptu dina + neptu pasaran + neptu sasi + tanggal Jawa + neptu taun. Neptu sasi (p. 7): Sura 7, Sapar 2, Rabingulawal 3, Rabingulakir 5, Jumadilawal 6, Jumadilakir 1, Rejeb 2, Ruwah 4, Pasa 5, Sawal 7, Dulkaidah 1, Besar 3. Neptu taun: Alip 1, Ehé 5, Jimawal 3, Jé 7, Dal 4, Bé 2, Wawu 6, Jimakir 3. Add both sums.
- No. 24: mod 9: 1, 4, 7 wali (ala); 2, 5, 8 panghulu (sedheng); 3, 6, 9 pangantèn (becik).
- No. 25: mod 3: 1 begja (becik); 2 lara (ala); 0/3 pati (luwih ala).
Worked example (book): Rebo Kliwon, Suro 20, Allip = 7 + 8 + 7 + 20 + 1 = 43; Jumuah Pon, Sapar 14, Wawu = 6 + 7 + 2 + 14 + 6 = 35; total 78 → 78 mod 9 = 6 pangantèn.
Both rules need each spouse's **Javanese** birth date, which depends on the reckoning in force at birth (Aboge before 24 Mar 1936, Asapon after). The app computes it and shows it; the user can override.

### 4.8 Popular 8-category table (Pegat … Pesthi)
Formula verified numerically: `r = (g + b) mod 9`; r ∈ {0, 1} Pegat, 2 Ratu, 3 Jodoh, 4 Topo, 5 Tinari, 6 Padu, 7 Sujanan, 8 Pesthi. Pegat is 1, 9, 10, 18, 19, 27, 28, 36; Ratu 2, 11, 20, 29; Jodoh 3, 12, 21, 30; Topo 4, 13, 22, 31; Tinari 5, 14, 23, 32; Padu 6, 15, 24, 33; Sujanan 7, 16, 25, 34; Pesthi 8, 17, 26, 35. **Attribution is unverified** (tier T3): circulated widely in popular primbon books and websites; a search found no primary text. A research draft asserted that the "classical" form was `mod 8` in *Bektijammal*; no source supports that, so this repository does not repeat it. Present it as "tabel populer" with an explicit note.

---

## 5. Local Tradition: Setiaji (Undip) *Petungan Cara Jawa*

**Source (opened and read in full on 2 Nov 2026).** Bayu Candra Setiaji, *Ramalan Weton Pernikahan dalam Petungan Cara Jawa (Suntingan Teks dan Kajian Pragmatik)*, "Jurnal Skripsi Mahasiswa", S1 Sastra Indonesia, Fakultas Ilmu Budaya, Universitas Diponegoro. Supervisors: Dra. Rukiyah, M.Hum. and Fajrul Falah, M.Hum. The PDF cover says "Semarang 2021"; UNDIP-IR record **83993** was deposited on 24 Feb 2022 (<http://eprints.undip.ac.id/83993/>, 25-page PDF, 714 KB, public). This is a short journal version of the skripsi, not the full text with the diplomatic edition.

**Corrections to earlier notes.** (a) The object is a single manuscript owned by **Pak Suyadi (65), Desa Kropak, Kecamatan Winong, Kabupaten Pati**. Desa Godo was visited (Pak Suwito's primbon) but is not the object. (b) The manuscript is in Javanese script, is a *naskah tunggal*, and its owners ask that it not be published. (c) It is a local source for one village's practice, not a regional standard. (d) The author reports no explanation for the "remainder 2" rule beyond the informant's remark that remainder 2 "melambangkan kedua calon pengantin untuk selalu bersama" (p. 21–22 of the PDF). Labels such as "Lara", "Pati", "Slamet" for remainders 1 and 0 that appeared in a research draft are **not in the source** and must not be used.

| ID | Rule as stated (PDF page) | dataStatus |
|---|---|---|
| U-01 | Add the two spouses' wetons and the candidate day's weton neptu; the sum must leave **2** when divided by 3. Example: couple 7 + 15 = 22; Senin Legi 9 → 31 → remainder 1, rejected; Selasa Wage 7 → 29 → 2, accepted; Selasa Pon 10 → 32 → 2, accepted (pp. 21–22) | verified (T1-L) |
| U-02 | The wedding day must not equal either spouse's birth weton (pp. 22, 24) | verified |
| U-03 | Nor either parent's birth weton (p. 22) | verified |
| U-04 | Nor the day of death of a deceased parent (pp. 22, 24) | verified |
| U-05 | *Hari naas* (taliwangke) of **the two spouses only**, not the parents: count from the spouse's weton as many days as the weton's neptu, inclusively. Selasa Wage (7) → counting 7 days from Selasa Wage lands on Senin Kliwon (p. 23). Inscription quoted: "Taliwake, nassase kawittane sura" | verified |
| U-06 | *Mempertemukan pengantin* (meeting the couple), Table 3.2: Jumat 3, 4, 5 sore; Sabtu 9, 10 pagi; Minggu 3, 4, 5 sore; Senin 1, 2, 3 sore; Selasa 3, 4, 5 sore; Rabu 9, 10 pagi; Kamis 9, 10 pagi (p. 23) | verified |
| U-07 | *Pelaksanaan hajat*, Table 3.3, "baik / kurang baik": Jumat 3, 4, 5 sore / 11 pagi; Sabtu 9, 10 pagi / 2 sore; Minggu 3, 4, 5 sore / 2 sore; Senin 1, 3, 4 sore (as printed) / 8 pagi; Selasa 3, 4, 5 sore / 11 pagi; Rabu 9, 10 pagi / 1, 2 sore; Kamis 9, 10 pagi / 1, 2 sore (pp. 23–24). A research draft merged U-06 and U-07 and mis-stated Senin and Selasa | verified |

Further statements worth quoting in the UI: the informant says "sebenarnya tidak ada hari yang buruk untuk melaksanakan pernikahan; semua itu tergantung dari perhitungan kedua calon pengantin" (p. 24), and the dates to avoid are those tied to the spouses' own wetons and their parents' death days. The manuscript's Javanese month list gives *Apit* for Dulkangidah.

The manuscript's 35-day table (Tabel 3.1.1, starting and ending Selasa Wage) is the weton (selapan) cycle and needs no separate rule. The thesis states the neptu values Ahad 5, Senin 4, Selasa 3, Rabu 7, Kamis 8, Jumat 6, Sabtu 9 and Wage 4, Kliwon 8, Legi 5, Pahing 9, Pon 7, matching Betaljemur p. 7.

---

## 6. Feasibility: how many dates survive?

`research/verification/funnel2.py` applies the *keraton* hard filters (Nos. 7, 8, 12, 13, 26 and/or 27, 28, 29, 31, 32, plus avoided months of No. 33) to every day:

| Year | Candidate set | All filters (26+27) | Only No. 26 | Only No. 27 | No dina ala |
|---|---|---|---|---|---|
| 2026 | weekends (104) | 25 | 31 | 32 | 38 |
| 2027 | weekends (104) | 21 | 36 | 21 | 36 |
| 2027 | all days (365) | 66 | 103 | 92 | 129 |
| 2028 | weekends (106) | 32 | 46 | 32 | 46 |

Adding U-01 for 2027 weekends (with the dina-ala-free profile) leaves 15 dates for a couple with neptu 28 or 25, and 10 for neptu 30 or 33. A strict *keraton* profile can leave only a few weekend dates. The UI therefore needs (a) a profile switch (keraton / Pati / populer / custom), (b) a reason for every eliminated date, and (c) never presenting "zero results" as a verdict about the couple.

---

## 7. Islamic Guidance (T0 and T2)

### 7.1 Hijri calendars
- **Kemenag (MABIMS)**: criterion of altitude ≥ 3° and elongation ≥ 6.4°, adopted at the MABIMS ministers' meeting in late 2021 and in force in Indonesia from the start of Ramadan 1443 H (April 2022). The three key months (Ramadan, Syawal, Zulhijah) are decided at the *sidang isbat*; the other months follow the Kemenag *Kalender Hijriah Indonesia* / Taqwim Standar. Whether elongation is evaluated topocentrically or geocentrically is not stated in the official text; Indonesian astronomers (e.g. T. Djamaluddin) argue for topocentric.
- **Muhammadiyah KHGT**: ratified at Munas Tarjih XXXII, Pekalongan, 23–25 Feb 2024; in force from 1 Muharram 1447 H (Thursday 26 Jun 2025). Rule: a month starts globally if before 24:00 UTC the geocentric conditions altitude ≥ 5° and elongation ≥ 8° are met anywhere on Earth; if first met after 24:00 UTC, the month still starts if the conjunction precedes dawn in New Zealand and the conditions are met in the Americas.
- **Dates 1447 H** (Kemenag): 1 Muharram 27 Jun 2025; 1 Ramadan 19 Feb 2026; 1 Syawal 21 Mar 2026; 1 Zulhijah 18 May 2026. KHGT began one day earlier in six of twelve 1447 months (e.g. 26 Jun 2025, 18 Feb 2026, 20 Mar 2026).
- **Data policy.** Ship a table `{ year, month, startDate, authority, source, status }`. The twelve 1447 H and twelve 1448 H starts, as collected by the research agent, pass an internal check (each Gregorian date matches its stated weekday; all gaps are 29 or 30 days; 1447 H is 354 days) but were not matched line by line against the Kemenag Taqwim PDF or the KHGT calendar. They stay `status: 'unverified'` until a maintainer pins the official documents. 1448 H Ramadan/Syawal/Zulhijah are still pending a future *sidang isbat*; label every date outside the official table "prakiraan hisab". Mark that Umm al-Qura is not an Indonesian authority.
- Javanese–Hijri offset: 1 Sura 1960 (Rabu Kliwon 17 Jun 2026) falls one day after 1 Muharram 1448 (Selasa 16 Jun 2026, Kemenag). The offset varies by 0–1 day; show both dates, never derive one from the other.

### 7.2 Tawhid and omens
| Text | Reference | Notes |
|---|---|---|
| "At-tiyarah shirk" (3 times) | Tirmidhi 1614, Abu Dawud 3910 | Sahih; Ahmad 3687 |
| "La 'adwa wa la tiyarah wa la hamah wa la safar" | Bukhari 5757, Muslim 2220 | Safar is explicitly named |
| "La 'adwa wa la tiyarah, wa yu'jibuni al-fa'l" | Bukhari 5776 | the good word is liked |
| Kaffarah of tiyarah (Ahmad 7045) | Ahmad 7045 | graded sahih/hasan li-ghayrihi |
| Hadith qudsi on cursing time | Bukhari 4826, Muslim 2246 | |

### 7.3 Times
- Shawwal: Muslim 1423 (Aisha). An-Nawawi (Syarh Muslim) says it is *mustahab* and calls the Jahili aversion baseless. 
- Friday: Muslim 854 states Friday is the best day. **No sahih marfu' hadith specifically recommends the akad on Friday**; the recommendation (and the further "morning" and "in the mosque" refinements found in Shafi'i and Hanbali manuals) is *istihbab* by scholarly analogy. The UI wording: "dianjurkan sebagian ulama, bukan sunnah khusus".
- Weekends: *taysir* for guests; a practical preference only.
- Hard limits relevant to a date: the bride must be out of *'iddah* (QS Al-Baqarah 235); neither party nor the wali may be in *ihram* (Muslim 1409; Hanafis differ and hold the akad valid). Both are optional user inputs.
- Quotations of Arabic text from fiqh manuals returned by the research agent were not re-checked against page images; cite only the hadith numbers in the UI until each manual page is confirmed.

### 7.4 Law
KHI (Inpres 1/1991) Pasal 14: *Calon suami; calon istri; wali nikah; dua orang saksi; ijab dan kabul.* Pasal 30: the groom must pay mahar. Pasal 34 ayat (1): "Kewajiban menyerahkan mahar bukan merupakan rukun dalam perkawinan." Ayat (2): omitting the type/amount does not void the marriage.

### 7.5 Organisation positions (summary, tier T2)
- **MUI**: Fatwa No. 2/MUNAS VII/MUI/6/2005 prohibits claiming knowledge of the unseen (perdukunan, ramalan). Applying it to weton is an interpretation; do not present MUI as having ruled on petungan specifically.
- **Muhammadiyah (Tarjih, Suara Muhammadiyah Q&A)**: rejects believing weton determines fortune (tathayyur); allows picking a day for practical reasons.
- **NU (NU Online / Bahtsul Masail)**: distinguishes belief in independent causal power (forbidden) from using calculation as custom (*'urf*) for family consensus with tawakkul. The three-way classification in the research agent's output is an interpretive summary, not a quoted fatwa.
Before public release, pin each position to a dated, linkable article in the glossary page.

### 7.6 Months
No text forbids marriage in Muharram/Suro or Safar; the Safar superstition is refuted in Bukhari 5757. The Javanese avoidance of Suro is a cultural *prihatin* tradition (see Rule 33, "aja diterak").

---

## 8. Pawukon sub-cycle note
`verify2.py` shows that naive `JDN mod 8` would label 2 Nov 2026 "Yama" while the pawukon-based reading gives "Indra" (a candidate pending almanac anchors). Hastawara/Sangawara must not ship before anchor tests exist.

---

## 9. Rule Registry Snapshot (source of truth for `dataStatus`)

| ID | Rule | Layer | Betaljemur no. / page | dataStatus | Notes |
|---|---|---|---|---|---|
| J-05 | Dina taliwangké (wuku) | date | 5 / p. 8 | verified | optional, off by default |
| J-06 | Samparwangké (wuku) | date | 6 / p. 8 | verified | optional |
| J-07 | Kunarpaning warsa | date | 7 / p. 9 | verified | compute from definition |
| J-08 | Sangaring warsa | date | 8 / p. 9 | verified | compute from definition |
| J-09 | Sasi rahayu | date | 9 / p. 10 | verified | general, soft |
| J-10 | Sasi sarju | date | 10 / p. 10 | verified | general, soft |
| J-11 | Pati uriping sasi | date | 11 / p. 10 | verified | |
| J-12 | Anggaraksih | date | 12 / p. 11 | verified | compute from definition |
| J-13 | Larangan sasi | date | 13 / p. 11 | verified | |
| J-14 | Sangaring tanggal (4+1) | date | 14 / p. 12 | verified | conflicts with J-30 |
| J-15 | Pasatohan 9×9 | couple | 15 / pp. 12–13 | verified | (8,9) editorial |
| J-16 | mod 4 | couple | 16 / p. 13 | verified | |
| J-17 | Weekday pairs | couple | 17 / p. 13 | verified | |
| J-18 | Name letters mod 9 | couple | 18 / p. 14 | **pending** | table gaps |
| J-19 | Name letters mod 7 | couple | 19 / pp. 14–15 | secondary | Nya absent; transliteration is editorial |
| J-20 | Name first letters mod 5 | couple | 20 / p. 15 | secondary | transliteration is editorial |
| J-21 | Kraton mulya | couple | 21 / p. 16 | pending | diagram not transcribed |
| J-22 | Pancasuda | couple | 22 / p. 17 | verified | mod 10 = 0 editorial |
| J-23 | mod 5 | couple | 23 / p. 17 | verified | |
| J-24 | Coordinates mod 9 | couple | 24 / p. 18 | verified | needs Javanese birth date |
| J-25 | Coordinates mod 3 | couple | 25 / p. 18 | verified | |
| J-26 | Dina ala | date | 26 / p. 18 | verified | conflicts with J-27 |
| J-27 | Dina sangaring asal | date | 27 / p. 19 | verified | |
| J-28 | Na'asing para Nabi | date | 28 / p. 19 | verified | |
| J-29 | Na'asing tanggal | date | 29 / p. 19 | verified | |
| J-30 | Sangaring tanggal (1) | date | 30 / p. 20 | verified | |
| J-31 | Bangas padéwan | date | 31 / p. 20 | verified | |
| J-32 | Taliwangké | date | 32 / p. 21 | verified | |
| J-33 | Ala beciking sasi | date | 33 / p. 21 | verified | |
| J-34 | Rupa 3 | date | 34 / pp. 22–23 | verified | 3 tables |
| J-35 | Sa'at (pasaran) | date | 35 / p. 24 | verified | |
| J-36 | Sa'at (tanggal) | date | 36 / p. 25 | verified | |
| J-37 | Sa'at (ndadari) | date | 37 / p. 25 | pending | table incomplete |
| J-39..41 | Tarub | date | 39–41 / pp. 26–27 | verified | informational |
| B-01 | 8-category table | couple | popular | secondary (T3) | `mod 9` |
| U-01..U-07 | Setiaji | date | PDF pp. 21–24 | verified (T1-L) | Pati profile only; U-06/U-07 informational |
| S-01, S-02 | iddah, ihram | shariah | — | T0 | user-supplied |

