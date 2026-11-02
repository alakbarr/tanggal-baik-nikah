import io, sys, datetime as dt
from verify import jdn, weton, javanese, greg, wuku, WUKU, HARI, NEPTU_HARI, NEPTU_PASARAN
import funnel2 as F
from funnel2 import filters, dow, neptu, SI

R11 = {"Alip": {1}, "Ehe": {1, 2, 6, 7, 8, 10}, "Jimawal": {7, 8, 10}, "Je": {4, 5, 6, 7, 8, 9, 12}, "Dal": {6, 7, 9, 10}, "Be": {6, 12}, "Wawu": {2, 3, 4, 5, 9}, "Jimakir": {3, 5, 7, 8, 10, 12}}
PRIMARY = {6, 7, 8, 12}
HARJA3 = {("Jumuah", 1), ("Akad", 2), ("Senen", 2), ("Selasa", 4), ("Rebo", 2), ("Kemis", 3)}
DN = {5: "Jumuah", 6: "Setu", 0: "Akad", 1: "Senen", 2: "Selasa", 3: "Rebo", 4: "Kemis"}
HIJ = ["Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir", "Jumadil Awal", "Jumadil Akhir", "Rajab", "Syaban", "Ramadan", "Syawal", "Zulkaidah", "Zulhijah"]
K = [(2026,6,16),(2026,7,16),(2026,8,14),(2026,9,13),(2026,10,12),(2026,11,11),(2026,12,10),(2027,1,9),(2027,2,8),(2027,3,10),(2027,4,8),(2027,5,8)]
starts = [jdn(*k) for k in K]
def hijri(j):
    for i in range(11, -1, -1):
        if j >= starts[i]: return (j - starts[i] + 1, HIJ[i], 1448)
    return None
def kaping(j):
    d, s, y, t = javanese(j)
    return (d - 1) // 7 + 1 if False else None

# occurrence index within Javanese month: count same weekday from day 1
def occ(j):
    d = javanese(j)[0]
    return (d - 1) // 7 + 1

CRIT = ["J-11 bulan becik", "J-33 bulan utama", "J-34 tiga tabel harja"]
rows = []
couple = 28
for j in range(jdn(2027, 1, 1), jdn(2028, 1, 1)):
    if dow(j) not in (0, 6): continue
    if set(filters(j)) & {"J-07", "J-08", "J-12", "J-13", "J-26", "J-27", "J-28", "J-29", "J-31", "J-32", "J-33-avoid"}: continue
    d, s, y, t = javanese(j)
    m = SI[s]
    c = [m in R11[t], m in PRIMARY, (DN[dow(j)], occ(j)) in HARJA3]
    g = greg(j); h, p = weton(j)
    hj = hijri(j)
    rows.append((sum(c), j, g, h, p, d, s, y, t, c, hj, (couple + neptu(j)) % 3))
rows.sort(key=lambda r: (-r[0], r[1]))
print("eligible (keraton strict, weekends 2027):", len(rows))
for r in rows:
    print(r[0], r[2], r[3], r[4], f"{r[5]} {r[6]} {r[7]} {r[8]}", r[9], r[10], "U01mod", r[11])
