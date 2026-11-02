# Tanggal Baik Nikah

Advisor for wedding dates that combines Javanese petungan (Kitab Primbon Betaljemur Adammakna) with Islamic guidance. All computation runs in the browser. No code exists yet; this repository holds the audited specification.

**Status (2 November 2026):** documents audited and rewritten; primary tables transcribed and checked; implementation not started.

## Documents

| File | Content |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Rules for agents: writing standard, engineering gates, domain canon |
| [`RESEARCH.md`](RESEARCH.md) | Evidence: corrected calendar maths, full Betaljemur tables with page numbers, Islamic sources, rule registry with `dataStatus` |
| [`PRD.md`](PRD.md) | Product requirements (two-layer model, inputs, solver, screens) |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Two-workspace design, types, algorithms, tests |
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) | Visual system with contrast-safe pairings |
| [`TASKS.md`](TASKS.md) | Work breakdown by phase with verification commands |
| [`design-system.html`](design-system.html) | Visual prototype (sample data not computed; flagged in file) |
| [`research/`](research) | Raw Wikisource pages 7–28 and the Python scripts behind every number in the documents |

## Corrections that matter

1. The popular Pegat…Pesthi table is `(sum of neptu) mod 9` with remainders 0 and 1 both Pegat. `mod 8` reproduces 8 of 35 published entries; `mod 9` reproduces all 35.
2. Couple-only rules (that value is the same on every date) are shown in a Couple Profile and never rank dates. Only date-dependent rules filter and rank.
3. Rules that print a weton for a Javanese date (Kunarpaning and Sangaring Warsa) were computed in Kurup Aboge; the app computes from the definition (last day of Besar; 3 Sura).
4. Mahr is obligatory but not a pillar of the nikah (KHI Pasal 34 ayat 1). Friday is the best day of the week (Muslim 854); an akad on Friday is a scholarly recommendation, not a specific Sunnah.
5. Real sizes: for the example couple, 21 of 104 weekend days in 2027 pass every keraton filter.

## Re-run the checks

```powershell
cd research\verification
python verify.py       # calendar anchors, Aboge/Asapon tables, 8-category proof
python verify4.py      # Rule 15 parse, Rule 34 consensus, wuku checks (paths inside point to the audit scratch folder)
python funnel2.py      # how many dates survive the filters
python contrast_v3.py  # WCAG ratios of the v3 colour pairings
```

## Next step
Phase 0 open items in `TASKS.md` (official Hijri tables, Setiaji thesis text, Rule 18 page image), then Phase 1.
