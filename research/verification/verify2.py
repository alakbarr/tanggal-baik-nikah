"""Second pass: TASKS.md anchors, PRD July-2027 grid, pawukon sub-cycles."""
from verify import jdn, weton, wuku, WUKU, javanese, NEPTU_HARI, NEPTU_PASARAN

def show(y, m, d):
    j = jdn(y, m, d)
    h, p = weton(j)
    n = NEPTU_HARI[(j + 1) % 7] + NEPTU_PASARAN[j % 5]
    print(f"{y}-{m:02d}-{d:02d} {h} {p} neptu={n} wuku={WUKU[wuku(j)]} jawa={javanese(j)}")

print("--- TASKS anchors ---")
show(2024, 7, 7)
show(2024, 4, 10)

print("--- PRD July 2027 grid (real values) ---")
for d in range(1, 12):
    show(2027, 7, d)

print("--- pawukon day index offset vs jdn%6 ---")
j = jdn(2026, 11, 1)  # Sunday, first day of Sinta per formula
print("d =", (j - 146) % 210, " jdn%6 =", j % 6, " jdn%8 =", j % 8)

SAD = ["Tungle", "Aryang", "Wurukung", "Paningron", "Uwas", "Mawulu"]
AST = ["Sri", "Indra", "Guru", "Yama", "Rudra", "Brama", "Kala", "Uma"]
SANGA = ["Dangu", "Jagur", "Gigis", "Kerangan", "Nohan", "Wogan", "Tulus", "Wurung", "Dadi"]

def sub(j):
    d = (j - 146) % 210
    ast = d % 8 if d <= 70 else (6 if d <= 72 else (d - 2) % 8)
    san = 0 if d <= 3 else (d - 3) % 9
    return SAD[d % 6], AST[ast], SANGA[san]

print("--- candidate sub-cycles (Bali-style Kala tiga d=70..72, Dangu pat d=0..3) ---")
for (y, m, d) in [(2026, 11, 1), (2026, 11, 2), (2024, 2, 25), (2024, 2, 28)]:
    j = jdn(y, m, d)
    print(y, m, d, weton(j), WUKU[wuku(j)], sub(j))
print("naive jdn%8 padewan for 2026-11-02:", AST[jdn(2026, 11, 2) % 8], "| pawukon-based:", sub(jdn(2026, 11, 2))[1])
