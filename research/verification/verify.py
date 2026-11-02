"""Independent verification of every numeric claim in the repo documents."""

HARI = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
PASARAN = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"]
NEPTU_HARI = [5, 4, 3, 7, 8, 6, 9]
NEPTU_PASARAN = [5, 9, 7, 4, 8]
WUKU = ["Sinta", "Landep", "Wukir", "Kurantil", "Tolu", "Gumbreg", "Warigalit", "Warigagung",
        "Julungwangi", "Sungsang", "Galungan", "Kuningan", "Langkir", "Mandasiya", "Julungpujut",
        "Pahang", "Kuruwelut", "Marakeh", "Tambir", "Medangkungan", "Maktal", "Wuye", "Manahil",
        "Prangbakat", "Bala", "Wugu", "Wayang", "Kulawu", "Dukut", "Watugunung"]
SASI = ["Sura", "Sapar", "Mulud", "Bakdamulud", "Jumadilawal", "Jumadilakir", "Rejeb", "Ruwah",
        "Pasa", "Sawal", "Dulkangidah", "Besar"]
TAHUN = ["Alip", "Ehe", "Jimawal", "Je", "Dal", "Be", "Wawu", "Jimakir"]
YEAR_LEN = [354, 355, 354, 354, 355, 354, 354, 355]


def jdn(y, m, d):
    a = (14 - m) // 12
    yy = y + 4800 - a
    mm = m + 12 * a - 3
    return d + (153 * mm + 2) // 5 + 365 * yy + yy // 4 - yy // 100 + yy // 400 - 32045


def greg(j):
    a = j + 32044
    b = (4 * a + 3) // 146097
    c = a - 146097 * b // 4
    d = (4 * c + 3) // 1461
    e = c - 1461 * d // 4
    m = (5 * e + 2) // 153
    return (100 * b + d - 4800 + m // 10, m + 3 - 12 * (m // 10), e - (153 * m + 2) // 5 + 1)


def weton(j):
    return HARI[(j + 1) % 7], PASARAN[j % 5]


def wuku(j):
    return ((j - 146) // 7) % 30


ASAPON_EPOCH = jdn(1936, 3, 24)  # 1 Sura Alip 1867


def javanese(j):
    """Asapon/Anenhing arithmetic calendar. Year 1986 (Jimakir, 15th windu) loses its leap day."""
    assert j >= ASAPON_EPOCH
    year, start = 1867, ASAPON_EPOCH
    while True:
        idx = (year - 1867) % 8
        length = YEAR_LEN[idx]
        if (year - 1867 + 1) % 120 == 0:  # last year of a kurup: gugur sedina
            length -= 1
        if j < start + length:
            break
        start += length
        year += 1
    doy = j - start
    leap = length == 355
    for mi in range(12):
        ml = 30 if mi % 2 == 0 else 29
        if mi == 11 and leap:
            ml = 30
        if doy < ml:
            return doy + 1, SASI[mi], year, TAHUN[(year - 1867) % 8]
        doy -= ml


def fmt(y, m, d):
    j = jdn(y, m, d)
    h, p = weton(j)
    jd, s, jy, t = javanese(j)
    return f"{y:04d}-{m:02d}-{d:02d} JDN={j} {h} {p} wuku={WUKU[wuku(j)]}(#{wuku(j)}) | {jd} {s} {jy} {t}"


print("=== Document anchors ===")
for ymd in [(1945, 8, 17), (1936, 3, 24), (2052, 8, 25), (2052, 8, 26), (2027, 7, 10),
            (2027, 8, 22), (2027, 9, 18), (2026, 11, 2), (2025, 6, 27), (2026, 6, 16),
            (1998, 5, 28), (1999, 10, 28)]:
    print(fmt(*ymd))

end = ASAPON_EPOCH + 42524
print("\nAsapon epoch JDN", ASAPON_EPOCH, "| first day of next kurup JDN", end, greg(end), weton(end))
print("last Asapon day", greg(end - 1), weton(end - 1), javanese(end - 1))

print("\n=== Galungan (Bali: Rabu Kliwon wuku Dungulan = idx 10) ===")
for ymd in [(2024, 2, 28), (2024, 9, 25), (2025, 4, 23), (2025, 11, 19), (2026, 6, 17)]:
    print(fmt(*ymd))

print("\n=== Kunarpaning Warsa (last day of Besar) & Sangaring Warsa (3 Sura) computed per kurup ===")
starts = {}
j = jdn(2024, 1, 1)
while len(starts) < 14:
    jd, s, y, _ = javanese(j)
    if jd == 1 and s == "Sura":
        starts[y] = j
    j += 1
for y in range(1960, 1968):
    first, nxt = starts[y], starts[y + 1]
    print(f"{y} {TAHUN[(y-1867)%8]:8s} 1 Sura={greg(first)} {weton(first)}  3 Sura={weton(first+2)}  last Besar={weton(nxt-1)} {greg(nxt-1)}")

print("\nAboge reconstruction (1 Sura Alip = Rabu Wage):")
d, p = 3, 3
for i, t in enumerate(TAHUN):
    L = YEAR_LEN[i]
    print(f"{t:8s} 1 Sura={HARI[d]} {PASARAN[p]}  last day={HARI[(d+L-1)%7]} {PASARAN[(p+L-1)%5]}")
    d, p = (d + L) % 7, (p + L) % 5

print("\n=== Bektijammal: doc table vs mod 8 vs mod 9 (0,1 -> Pegat) ===")
names9 = {0: "Pegat", 1: "Pegat", 2: "Ratu", 3: "Jodoh", 4: "Topo", 5: "Tinari", 6: "Padu", 7: "Sujanan", 8: "Pesthi"}
names8 = {1: "Pegat", 2: "Ratu", 3: "Jodoh", 4: "Topo", 5: "Tinari", 6: "Padu", 7: "Sujanan", 0: "Pesthi"}
table = {"Pegat": [9, 10, 18, 19, 27, 28, 36], "Ratu": [2, 11, 20, 29], "Jodoh": [3, 12, 21, 30],
         "Topo": [4, 13, 22, 31], "Tinari": [5, 14, 23, 32], "Padu": [6, 15, 24, 33],
         "Sujanan": [7, 16, 25, 34], "Pesthi": [8, 17, 26, 35]}
m8 = m9 = 0
total = 0
for cat, vals in table.items():
    for v in vals:
        total += 1
        m8 += names8[v % 8] == cat
        m9 += names9[v % 9] == cat
print(f"doc table entries={total}; mod8 agrees={m8}; mod9 agrees={m9}")
for v in (25, 28, 35):
    print(f"  neptu {v}: mod8 -> {names8[v % 8]}, mod9 -> {names9[v % 9]}")
possible = sorted({a + b for a in range(7, 19) for b in range(7, 19)})
print("possible couple neptu range", possible[0], "-", possible[-1])
indiv = sorted({NEPTU_HARI[h] + NEPTU_PASARAN[p] for h in range(7) for p in range(5)})
print("possible individual neptu", indiv)

print("\n=== Undip mod 3 worked examples ===")
for c, w in [(22, 9), (22, 7), (22, 10), (28, 16), (28, 14)]:
    print(f"  ({c}+{w}) mod 3 = {(c + w) % 3}")

print("\n=== Weekday index check used in ARCHITECTURE solver ===")
print("Saturday index =", (jdn(2027, 7, 10) + 1) % 7, "Sunday index =", (jdn(2027, 7, 11) + 1) % 7)

print("\n=== Dina pengapesan example: Selasa Wage +6 (inclusive count of 7) ===")
j = jdn(2026, 11, 3)
while weton(j) != ("Selasa", "Wage"):
    j += 1
print("  ", weton(j + 6))

print("\n=== Months lacking Selasa Kliwon, years 1960-1962 ===")
j = jdn(2026, 6, 1)
seen = {}
while javanese(j)[2] <= 1962:
    _, s, y, _ = javanese(j)
    seen.setdefault((y, s), False)
    if weton(j) == ("Selasa", "Kliwon"):
        seen[(y, s)] = True
    j += 1
print("  ", [k for k, v in seen.items() if not v and k[0] >= 1960])
