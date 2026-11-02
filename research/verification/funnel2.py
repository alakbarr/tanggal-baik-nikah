import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
from verify import jdn, weton, javanese, greg, NEPTU_HARI, NEPTU_PASARAN, TAHUN

S = ["Sura", "Sapar", "Mulud", "Bakdamulud", "Jumadilawal", "Jumadilakir", "Rejeb", "Ruwah", "Pasa", "Sawal", "Dulkangidah", "Besar"]
SI = {n: i + 1 for i, n in enumerate(S)}
neptu = lambda j: NEPTU_HARI[(j + 1) % 7] + NEPTU_PASARAN[j % 5]

R13 = {"Alip": {6, 11}, "Ehe": {3, 9}, "Jimawal": {3, 12}, "Je": {1, 10}, "Dal": {8}, "Be": {2, 7}, "Wawu": {5}, "Jimakir": {1, 11}}
R28 = {1: {13}, 3: {3}, 4: {16}, 5: {5}, 9: {12, 21}, 11: {24}, 12: {25}}
R29 = {1: {11, 6}, 2: {1, 20}, 3: {10, 20}, 4: {10, 20}, 5: {1, 11}, 6: {10, 14}, 7: {2, 14}, 8: {12, 13}, 9: {9, 20}, 10: {10, 20}, 11: {9, 13}, 12: {12, 10}}
R31 = {1: {11}, 2: {20}, 3: {1, 15}, 4: {10, 20}, 5: {10, 11}, 6: {10, 14}, 7: {13, 27}, 8: {4, 28}, 9: {7, 9, 20}, 10: {10}, 11: {2, 22}, 12: {6, 20}}
R14 = {1: {17, 27, 11, 14}, 2: {12, 22, 1, 20}, 3: {13, 23, 10, 15}, 4: {15, 25, 10, 20}, 5: {16, 26, 10, 11}, 6: {11, 21, 3, 14}, 7: {2, 22, 11, 12}, 8: {14, 24, 19, 28}, 9: {15, 25, 10, 20}, 10: {17, 27, 2, 20}, 11: {11, 21, 6, 12}, 12: {13, 23, 1, 20}}
R30 = {1: 18, 2: 10, 3: 8, 4: 28, 5: 28, 6: 18, 7: 18, 8: 26, 9: 24, 10: 2, 11: 28}
TALI = {11: (1, 4), 5: (1, 4), 12: (2, 0), 6: (2, 0), 1: (3, 1), 7: (3, 1), 2: (4, 2), 8: (4, 2), 3: (5, 3), 9: (5, 3), 4: (6, 4), 10: (6, 4)}  # (weekday idx, pasaran idx)
QA = {frozenset([6, 7, 8]): {5}, frozenset([9, 10, 11]): {6, 0}, frozenset([12, 1, 2]): {1, 2}, frozenset([3, 4, 5]): {3, 4}}
QB = {frozenset([9, 10, 11]): {5}, frozenset([12, 1, 2]): {6, 0}, frozenset([3, 4, 5]): {1, 2}, frozenset([6, 7, 8]): {3, 4}}
AVOID_M = {1, 3, 9, 11}

def dow(j): return (j + 1) % 7
def bad_q(tab, m, j):
    for k, v in tab.items():
        if m in k: return dow(j) in v

# month has Selasa Kliwon (computed)
has_ak = {}
for j in range(jdn(2026, 1, 1), jdn(2032, 1, 1)):
    d, s, y, _ = javanese(j)
    has_ak.setdefault((y, s), False)
    if weton(j) == ("Selasa", "Kliwon"): has_ak[(y, s)] = True

# last day of each Besar
last_besar = set()
for j in range(jdn(2026, 1, 1), jdn(2032, 1, 1)):
    d, s, y, _ = javanese(j)
    if s == "Besar" and javanese(j + 1)[1] == "Sura": last_besar.add(j)

def filters(j):
    d, s, y, t = javanese(j)
    m = SI[s]
    out = []
    if j in last_besar: out.append("J-07")
    if d == 3 and m == 1: out.append("J-08")
    if not has_ak[(y, s)]: out.append("J-12")
    if m in R13[t]: out.append("J-13")
    if bad_q(QA, m, j): out.append("J-26")
    if bad_q(QB, m, j): out.append("J-27")
    if d in R28.get(m, ()): out.append("J-28")
    if d in R29[m]: out.append("J-29")
    if d in R31[m]: out.append("J-31")
    if TALI[m] == (dow(j), j % 5): out.append("J-32")
    if m in AVOID_M: out.append("J-33-avoid")
    return out

def funnel(year, weekend_only, rules_sets):
    days = [j for j in range(jdn(year, 1, 1), jdn(year + 1, 1, 1)) if (not weekend_only or dow(j) in (0, 6))]
    ev = {j: set(filters(j)) for j in days}
    res = {"total": len(days)}
    for name, rs in rules_sets.items():
        res[name] = sum(1 for j in days if not (ev[j] & rs))
    return res

sets = {
    "keraton-strict (7,8,12,13,26,27,28,29,31,32,33)": {"J-07", "J-08", "J-12", "J-13", "J-26", "J-27", "J-28", "J-29", "J-31", "J-32", "J-33-avoid"},
    "keraton, A only (26) not 27": {"J-07", "J-08", "J-12", "J-13", "J-26", "J-28", "J-29", "J-31", "J-32", "J-33-avoid"},
    "keraton, B only (27) not 26": {"J-07", "J-08", "J-12", "J-13", "J-27", "J-28", "J-29", "J-31", "J-32", "J-33-avoid"},
    "keraton w/o dina ala (7,8,12,13,28,29,31,32,33)": {"J-07", "J-08", "J-12", "J-13", "J-28", "J-29", "J-31", "J-32", "J-33-avoid"},
    "core (7,8,12,32)": {"J-07", "J-08", "J-12", "J-32"},
}
for y in (2026, 2027, 2028):
    for we in (True, False):
        r = funnel(y, we, sets)
        print(y, "weekend" if we else "all-days", r)

# how many eligible dates also pass pati (couple 28)
y = 2027
days = [j for j in range(jdn(y, 1, 1), jdn(y + 1, 1, 1)) if dow(j) in (0, 6)]
for cname, c in (("couple 28", 28), ("couple 25", 25), ("couple 30", 30), ("couple 33", 33)):
    ok = [j for j in days if not (set(filters(j)) & sets["keraton w/o dina ala (7,8,12,13,28,29,31,32,33)"]) and (c + neptu(j)) % 3 == 2]
    print(cname, "keraton-without-dina-ala + U-01 (2027 weekend):", len(ok))
print("Besar last-day examples:", [(greg(j), weton(j)) for j in sorted(last_besar)[:8]])
