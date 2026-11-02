import io
p = r"D:\tanggal_baik_nikah\DESIGN_SYSTEM.md"
lines = open(p, encoding="utf-8").read().split("\n")
start = next(i for i, l in enumerate(lines) if l.startswith("### 5.1 "))
end = next(i for i, l in enumerate(lines) if l.startswith("## 6. "))
new = '''### 5.1 Date Card (replaces the v2.0 "Crown Jewel" consensus card)
A date card shows a **count of criteria met**, never stars, tiers or percentages. Values below are real (computed for the example couple, `keraton` profile).

```
+------------------------------------------------------------------------------------------+
|  Ahad Wage, 17 Januari 2027                              [ memenuhi 2 dari 3 kriteria ]  |
|  8 Ruwah 1960 Be  .  9 Syaban 1448 H (Kemenag)  .  wuku Kuningan                         |
|------------------------------------------------------------------------------------------|
|  [v] Bulan utama: Ruwah (No. 33)        [v] Ahad kaping 2: harja di 3 tabel (No. 34)     |
|  [ ] Bulan becik tahun Be (No. 11)                                                       |
|  Lolos filter keraton: Nos. 7, 8, 12, 13, 26, 27, 28, 29, 31, 32                         |
|  Saat ijab: 15.36-17.59 Slamet (No. 35, pasaran Wage)                                    |
|------------------------------------------------------------------------------------------|
|  [ Lihat sumber dan dalil > ]                                                            |
+------------------------------------------------------------------------------------------+
```

Visual parameters:
- Border: `1px` `sand-400` (light) / `rgba(222,192,113,0.30)` (dark). Only the first card of the list gets the `1.5px` gold border.
- Badge "memenuhi N dari M kriteria": `bg-prada-100 text-prada-800` (light), `bg-prada-950/80 text-prada-300` (dark); text always paired as in §3.2.
- Criteria rows use a check or an empty box **with a text label**, never colour alone.
- Dropped dates use the same card in a collapsed list, with the rule name and printed page in amber text.

### 5.2 Input Form
- Fields: groom and bride birth dates (native date input with instant weton: *"Kamis Pon (neptu 15)"*, *"Kamis Legi (neptu 13)"*), optional names, date window, day filter (weekend / all / custom), tradition profile, and collapsed optional sections: birth time, parents' wetons and *geblak*, end of iddah, ihram window, reckoning (Asapon / Aboge), variant choices for Nos. 26/27 and 14/30.
- Primary button: "Cari tanggal", `bg-prada-500` with `text-obsidian-950` (7.96:1). No gradient is needed.
- Inline help for every optional field; error messages in text, associated via `aria-describedby`.

### 5.3 Provenance Drawer ("Mengapa?")
- Right-hand slide-over on desktop, bottom sheet on mobile. Two columns: *Panduan Islam* and *Petungan adat*.
- Adat column: for each rule the arithmetic, the short Javanese quotation, rule number, printed page, source tier and `dataStatus`.
- Toggle: "Abaikan aturan ini dalam pencarian ini". Focus trap, Escape closes, scroll lock.

### 5.4 Tri-System Month Grid (`CalendarGridView`, `DateCellTriSystem`)
```
+-------------------------------------------------------------+
| 9 Syaban                                     memenuhi 2/3   |
|                                                             |
|                            17                               |
|                                                             |
| 8 Ruwah 1960 Be                       Ahad Wage (neptu 9)   |
+-------------------------------------------------------------+
```
- Size: desktop at least 96 x 96 px; mobile at least 44 x 54 px.
- Layout: top-left Hijri day and month (Kemenag; KHGT in the tooltip when different), top-right criteria count, centre Gregorian day (`Playfair Display` 600, lining numerals), bottom Javanese date and weton with neptu.
- States: *eligible* (gold or emerald border plus text count), *dropped* (opacity 0.6 plus a short reason label such as "No. 32" in amber), *outside window* (muted). State is never conveyed by colour only.
- Keyboard: arrow keys move focus, Enter opens the drawer, `aria-label` reads the full date in Indonesian.

### 5.5 View Switcher
Segmented control: *Daftar* (default) and *Kalender*. Month navigation shows the Gregorian month, the Javanese month(s) spanned and the Hijri month(s) spanned, e.g. *Januari 2027 / Ruwah 1960 / Syaban 1448 H*.

### 5.6 Weton Breakdown (`WetonDetailCard`)
Shows: day and pasaran with neptu, wuku, sadwara (`d mod 6`), Javanese date, year name and kurup, Hijri date, Nos. 24/25 neptu sum with its arithmetic, and the *dina pengapesan*. The 8-day *padewan* is not shown until it passes anchor tests (RESEARCH §2.1). The Couple Profile panel lists every couple rule with its table value; it is visually neutral.

'''.split("\n")
lines[start:end] = new
open(p, "w", encoding="utf-8").write("\n".join(lines))
print("replaced", start, end)
