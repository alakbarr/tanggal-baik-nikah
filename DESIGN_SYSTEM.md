# Design System Specification: "Nawa Rahayu & Sakinah"
# Tanggal Baik Nikah — Javanese Tradition & Islamic Sunnah Wedding Advisor

**Document ID:** DS-TBN-2026-V2  
**Version:** 3.0 (contrast-safe tokens, count-based date cards; audit of 2 Nov 2026)  
**Status:** Approved Standard  
**Release Date:** November 2, 2026  
**Author:** Principal UI/UX Architect & Frontend Engineering Team  
**Workspace:** `D:\tanggal_baik_nikah`  
**Visual Interactive Showcase:** [`design-system.html`](file:///D:/tanggal_baik_nikah/design-system.html)

---

## 1. Design Philosophy: "Nawa Rahayu & Sakinah"

**Tanggal Baik Nikah** is not a generic calendar calculator. It accompanies families through a sacred life milestone: **the marriage contract (*akad nikah*)**.

Its visual architecture balances three distinct aesthetic pillars:
1. **Dignity of the Javanese Royal Court (*Prada & Deep Teak*):**  
   Expresses courtly heritage through royal gold accents (*Prada Gold*), deep teak tones, and subtle geometric patterns such as *Truntum* (symbolizing enduring, budding love) and *Kawung* (symbolizing purity of heart and self-restraint).
2. **Serenity and Purity of the Islamic Sunnah (*Emerald & Sapphire Sakinah*):**  
   Communicates inner peace, procedural ease (*taysir*), and pure monotheism (*tawhid*) through emerald green (*Emerald Sakinah*) and midnight blue (*Midnight Sapphire*), reflecting the tranquil atmosphere of a courtyard mosque and the openness of a blessed marriage.
3. **Precision of Modern Digital Craftsmanship (*High-Craft Digital*):**  
   Employs fluid typography, subtle 1px micro-borders, ambient multi-layered shadows, and ergonomic hit targets designed for clarity and visual comfort across all viewports.

---

## 2. Visual Hierarchy & Ergonomic Layout

The interface implements a strict visual hierarchy (Levels L0 through L5) allowing users to parse essential guidance within **under 3 seconds**:

| Level | Purpose & Meaning | Interface Element | Visual Treatment Characteristics |
|---|---|---|---|
| **L0** | **Theological & Ethical Anchor** | Permanent Anti-Tathayyur Banner | Fixed at top; calm emerald background; calm, reassuring tone: *"Marriage is a sacred covenant. Dates do not dictate destiny; place all reliance on Allah alone."* |
| **L1** | **Primary Workspace (Minimalist Input)** | 3-Field Compact Form Card | Clean royal card containing: Prospective Spouses' Names, Birth Dates (with instant weton feedback), Target Wedding Year, and Weekend Filter toggle. Primary action button accented in Prada Gold. |
| **L2** | **Couple Profile** | Static panel | Neutral surface (no gold glow, no colour-coded verdicts); each rule shows its arithmetic, source tier and the standing reminder that it does not decide validity or fate. |
| **L3** | **Top eligible dates** | Date cards | Gold border on the first card only; badge text "memenuhi N dari M kriteria" (a count, never stars or percentages); recommended sa'at line. |
| **L4** | **Dropped dates and conflicts** | Disclosure list | Each dropped date shows the rule and page that removed it; conflicts (Nos. 26/27, 14/30) shown side by side. |
| **L5** | **Transparent provenance** | Drawer ("Mengapa?") | Islamic guidance column and adat column; verbatim short Javanese line, rule number, printed page, source tier, `dataStatus`. |

---

## 3. Design Tokens

### 3.1 Color Palette & Semantic Tokens

The design supports dual display modes: **Royal Light Mode** (inspired by ivory silk and court gold) and **Obsidian Dark Mode** (inspired by nocturnal palace courtyards and radiant emerald stone).

```json
{
  "colors": {
    "prada": {
      "50": "#FDFBF7",
      "100": "#FBF6EC",
      "200": "#F4E7CA",
      "300": "#EBD49F",
      "400": "#DEC071",
      "500": "#C5A059",
      "600": "#A6803F",
      "700": "#85622C",
      "800": "#63471E",
      "900": "#453013",
      "950": "#2C1E0A"
    },
    "emerald": {
      "50": "#F0FDF4",
      "100": "#DCFCE7",
      "200": "#BBF7D0",
      "400": "#4ADE80",
      "500": "#10B981",
      "600": "#059669",
      "700": "#047857",
      "800": "#065F46",
      "900": "#064E3B",
      "950": "#022C22"
    },
    "sand": {
      "50": "#FAF9F5",
      "100": "#F5F3EC",
      "200": "#EBE7DC",
      "300": "#DDD7C8",
      "400": "#C5BDAA",
      "500": "#A89F8B",
      "600": "#8A816E",
      "700": "#6A6353",
      "800": "#3D382E",
      "850": "#1D1A15",
      "900": "#24211A",
      "950": "#14120E"
    },
    "obsidian": {
      "700": "#232731",
      "750": "#1F222B",
      "800": "#1A1D24",
      "850": "#161920",
      "900": "#111318",
      "950": "#0B0C0F"
    }
  }
}
```

#### Semantic Mapping & Dark Mode Elevation Hierarchy:
- **Primary Brand (Royal Gold / Prada):** `#C5A059` (Light) / `#DEC071` (Dark)  
  *Used for primary CTA buttons (with dark text, see §3.2), the first date card border and focus rings.*
- **Secondary Spiritual (Emerald Sakinah):** `#065F46` (Light) / `#10B981` (Dark)  
  *Used for Shariah guidance banners, Sunnah indicators, and safe status badges.*
- **Dark Mode Elevation Hierarchy (Obsidian Karaton & Emerald):**
  - *L0 Canvas Background:* `#0B0C0F` (`obsidian-950`) with faint radial gold pattern (`rgba(222, 192, 113, 0.09)`).
  - *L1 Container Surface:* `#111318` (`obsidian-900`) with 1px border `rgba(222, 192, 113, 0.20)`.
  - *L2 Elevated Nested Wells (Input Cards & Modals):* `#161920` (`obsidian-850`) with border `border-sand-800/80`.
  - *L3 Input Fields & Control Bases:* `#0B0C0F` (`obsidian-950`) with border `border-sand-700` and native `color-scheme: dark;`.
- **Adat Notice / Warning (Non-Crimson):** `#B45309` (amber-700) text on light surfaces, `#F59E0B` (amber-500) on dark. Cultural notices are neutral and never alarm-red.
- **Customary taboo (Pantangan adat):** amber family only. The v2.0 "Ruby Red `#DC2626`" token for "Pantangan Keras" is removed: it contradicted the zero-stigma policy in the PRD.

#### 3.2 Contrast-safe pairings (v3, measured with `research/verification/contrast_v3.py`)
The v2.0 palette failed WCAG 2.2 AA in several places: white on `prada-500` 2.46:1, `sand-500` text on white 2.63:1, white on `emerald-500` 2.54:1, `prada-500` text on `sand-50` 2.33:1. Use only these pairings.

| Use | Foreground | Background | Ratio |
|---|---|---|---|
| Primary button (light and dark) | `#0B0C0F` obsidian-950 | `#C5A059` prada-500 | 7.96:1 |
| Gold text, light | `#85622C` prada-700 | `#FFFFFF` / `#FAF9F5` | 5.55 / 5.27 |
| Body text, light | `#24211A` sand-900 | `#FAF9F5` | ≥ 14:1 |
| Secondary text, light | `#6A6353` sand-700 | `#FFFFFF` / `#FAF9F5` | 5.96 / 5.66 |
| Emerald button | `#FFFFFF` | `#047857` emerald-700 | 5.48:1 |
| Emerald text, light | `#047857` | `#FFFFFF` / `#FAF9F5` | 5.48 / 5.21 |
| Amber text, light | `#B45309` | `#FFFFFF` / `#FAF9F5` | 5.02 / 4.77 |
| Gold text, dark | `#DEC071` prada-400 | `#0B0C0F` / `#111318` | 11.07 / 10.52 |
| Secondary text, dark | `#A89F8B` sand-500 | `#161920` | 6.70:1 |
| Emerald text, dark | `#10B981` | `#161920` | 6.93:1 |
| Control border, light | `#8A816E` sand-600 | `#FFFFFF` / `#FAF9F5` | 3.86 / 3.66 (≥ 3:1) |
| Control border, dark | `#8A816E` sand-600 | `#161920` | ≥ 4.5:1 (`sand-700` is 2.95:1 on `obsidian-850` and is not allowed for controls) |

Decorative hairlines (card borders such as `border-sand-800/80`) may stay below 3:1 because they are not the only indicator of a component's boundary.

---

## 4. Typography & Lining Numerals Standard

Typography balances traditional gravitas with contemporary digital legibility, enforcing a strict standard for numerical presentation:

### 4.1 Font Selection & Elimination of Old-Style Figures
- **Why Cormorant Garamond Was Eliminated:**  
  *Cormorant Garamond* defaults to *old-style (non-lining) figures*, where digits 3, 4, 5, 7, and 9 drop below the baseline with descenders, while 6 and 8 ascend above the mean line. In calendar displays (e.g., "10 July 2027", "1449 H", "1961 Jawa", "#1"), this creates uneven, wavy text baselines unsuited for tabular dates and neptu figures.
- **The Upright Standard (Playfair Display + Plus Jakarta Sans):**
  1. **Headings & Primary Dates:** **Playfair Display** (SemiBold 600 & Bold 700) — High-contrast editorial serif with **uniform, upright lining figures that sit strictly flush on the baseline**.
  2. **Honorific Badges & Section Accents:** **Cinzel** (Classical Roman/Court serif for formal labels and badges).
  3. **Interface Body & Labels:** **Plus Jakarta Sans** (Modern geometric sans-serif engineered for digital legibility).
  4. **Calendar Numerals & Astronomical Hours:** **JetBrains Mono** or **Plus Jakarta Sans Tabular Numerals**.

### 4.2 Mandatory OpenType Lining & Tabular Declaration
All stylesheet rules must declare:
```css
*, html, body, h1, h2, h3, h4, h5, h6, span, p, div, input, select, button {
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: "lnum" 1, "tnum" 1;
}
```
Result: All years (2027), calendar dates (10, 22, 18), neptu values (15, 13, 28), and academic hours (08:25–10:11) align evenly without baseline drops.

### 4.3 Typography Scale (1.25 Modular Scale)

| Level | Tailwind Class | Size / Line Height | Weight | Usage |
|---|---|---|---|---|
| **Display Hero** | `text-4xl md:text-5xl` | 36px / 44px (md: 48px / 56px) | Bold (700) | Main Hero Title (*Playfair Display*) |
| **Heading 1** | `text-2xl md:text-3xl` | 24px / 32px (md: 30px / 38px) | SemiBold (600) | Top Recommended Date (*Playfair Display - Lining Nums*) |
| **Heading 2** | `text-xl md:text-2xl` | 20px / 28px (md: 24px / 32px) | Medium (500) | Section Titles (Form, Results Header) |
| **Heading 3** | `text-lg` | 18px / 26px | SemiBold (600) | Card Headers & Spouses' Names |
| **Body Large** | `text-base` | 16px / 24px | Regular (400) | Intro copy, summary explanations (*Plus Jakarta Sans*) |
| **Body Regular**| `text-sm` | 14px / 20px | Regular / Medium (400/500) | Card bodies, system checklists, status text |
| **Caption / Tag**| `text-xs` | 12px / 16px | Medium / SemiBold (500/600) | Badges, academic hours, manuscript chapter tags |

---

## 5. Core Component Specifications

### 5.1 Date Card (replaces the v2.0 "Crown Jewel" consensus card)
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


## 6. Accessibility, Ergonomics & WCAG 2.2 AA Compliance

1. **Color Contrast Compliance:**  
   - All standard body text exceeds **4.5:1** contrast ratio against its background.
   - Large display headings exceed **3.0:1** contrast ratio.
   - Interactive components (buttons, active borders) exceed **3.0:1** contrast ratio against adjacent surfaces.
2. **Touch Target Sizing:**  
   - Every clickable element (buttons, date inputs, result cards, toggles) maintains an active target area of at least **$44 \times 44$ pixels** on mobile touchscreens.
3. **Screen Readers & ARIA Semantics:**  
   - Recommendation cards use `role="article"` with explicit `aria-label` attributes.
   - Drawers and modals implement `role="dialog"`, `aria-modal="true"`, and standard keyboard focus traps with `Escape` key listeners.
4. **Reduced Motion:**  
   - Full support for `@media (prefers-reduced-motion: reduce)`, disabling non-essential slide animations for vestibular-sensitive users.

---

## 7. Interactive Visual Prototype Reference

To evaluate all tokens, color palettes, typography, and interactive components directly in a web browser, open the standalone prototype:

👉 **[`design-system.html`](file:///D:/tanggal_baik_nikah/design-system.html)**

This prototype includes:
- **Design Token Swatches:** Interactive color swatches for Prada Gold, Emerald Sakinah, Sand, and Obsidian surfaces.
- **Typography Showcase:** Displays Playfair Display (Lining Figures), Cinzel, and Plus Jakarta Sans.
- **Live Interactive System:**
  - 3-field input form with real-time weton calculation.
  - Date cards with criteria counts (the prototype still shows the v2.0 tier cards; see TASKS 0.8).
  - Segmented View Switcher toggling between List View and the 3-System Monthly Calendar Grid.
  - Weton Breakdown Modal (`#wetonDetailModal`) displaying complete astrological coordinates.
  - Manuscript Provenance Drawer (`#provenanceDrawer`).
  - Dark Mode / Light Mode instant theme toggle with persistent preferences.

---
*This Design System Specification is the binding visual and ergonomic blueprint for all user interface development in the Tanggal Baik Nikah project.*
