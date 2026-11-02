import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
from verify import jdn, weton, wuku, WUKU, HARI, PASARAN
W = r"C:\Users\ADVAN\.gemini\antigravity-cli\brain\7d066cfa-cbb9-44f7-9d22-4c29b0194972\scratch"
src = open(W + r"\wikisource\p13.txt", encoding="utf-8").read() + open(W + r"\wikisource\p14.txt", encoding="utf-8").read()

# ---- Rule 15 from primary text
cells = {}
for a, b, t in re.findall(r"\|\s*(\d)\s*\|\|\s*(?:lan|\{\{c\|\"\}\})\s*\|\|\s*(\d)\.?\s*\|\|\s*([^\n]+)", src):
    cells[(int(a), int(b))] = t.strip()
print("rule15 parsed pairs:", len(cells))
missing = [(i, j) for i in range(1, 10) for j in range(i, 10) if (i, j) not in cells]
print("missing:", missing)
dups = {}
for a, b, t in re.findall(r"\|\s*(\d)\s*\|\|\s*(?:lan|\{\{c\|\"\}\})\s*\|\|\s*(\d)\.?\s*\|\|\s*([^\n]+)", src):
    dups.setdefault((int(a), int(b)), []).append(t.strip())
print("duplicate keys:", {k: v for k, v in dups.items() if len(v) > 1})

# ---- compare with subagent matrix
md = open(W + r"\research_couple_rules.md", encoding="utf-8").read().splitlines()
rows = [l for l in md if re.match(r"\| \*\*\d\*\* \|", l)][:9]
agent = {}
for r in rows:
    parts = [p.strip() for p in r.strip().strip("|").split("|")]
    i = int(parts[0].strip("*"))
    for j, t in enumerate(parts[1:], 1):
        agent[(i, j)] = t
def norm(s): return re.sub(r"[^a-z ]", "", s.lower().replace("é", "e").replace("è", "e").replace("j", "j")).replace("rijeki", "rejeki").replace("rejeki", "rijeki")
bad = []
for (i, j), t in cells.items():
    a = agent.get((i, j))
    if a is None or norm(a) != norm(t):
        bad.append(((i, j), t, a))
print("rule15 mismatches vs subagent table:", len(bad))
for b in bad: print("  ", b)
print("(8,9) subagent:", agent[(8, 9)], "| (9,9) subagent:", agent[(9, 9)])

# ---- Rule 34 consensus
def tab(text):
    out = {}
    for day in ["Jumuah", "Setu", "Akad", "Senèn", "Selasa", "Rebo", "Kemis"]:
        pass
    return out
p23 = open(W + r"\wikisource\p23.txt", encoding="utf-8").read()
p24 = open(W + r"\wikisource\p24.txt", encoding="utf-8").read()
def parse_tables(text):
    res, cur = [], None
    for blk in re.split(r"\|-\s*style=\"text-align: center;\"", text):
        lines = [l[1:].strip() for l in blk.strip().splitlines() if l.startswith("|") and not l.startswith("|}") and not l.startswith("|-")]
        lines = [l for l in lines]
        res.append(lines)
    return res
rowsall = []
for t in (p23, p24):
    for blk in re.split(r"\|-\s*style=\"text-align: center;\"", t):
        ls = [l.strip() for l in blk.strip().splitlines() if l.startswith("|") and not l.startswith("|}") and not l.startswith("|-") and not l.startswith("|+")]
        ls = [re.sub(r"^\|\s*", "", l) for l in ls]
        ls = [l for l in ls if not l.startswith("rowspan") and l != "" and not l.startswith("colspan")]
        if len(ls) == 6 and ls[0] in ["Jumuah", "Setu", "Akad", "Senèn", "Selasa", "Rebo", "Kemis"]:
            rowsall.append(ls)
print("rule34 rows parsed:", len(rowsall))
T = [rowsall[0:7], rowsall[7:14], rowsall[14:21]]
GOOD = {"harja", "begja", "begja harja", "kasembadan"}
print("cells where all three tables are favourable (harja/begja/kasembadan):")
for k in range(7):
    for n in range(1, 6):
        vals = [T[t][k][n].strip().lower() for t in range(3)]
        if all(v in GOOD for v in vals):
            print("  ", T[0][k][0], "kaping", n, vals)
print("cells where all three say 'harja' exactly:")
for k in range(7):
    for n in range(1, 6):
        vals = [T[t][k][n].strip().lower() for t in range(3)]
        if all(v == "harja" for v in vals):
            print("  ", T[0][k][0], "kaping", n)

# ---- Rule 5/6 wuku day checks
HNAME = {"Senèn": 1, "Slasa": 2, "Rebo": 3, "Kemis": 4, "Jumuah": 5, "Setu": 6}
def day_in_wuku(wk, hari_idx, pas):
    # find JDN in 2026-2027 with given wuku, weekday idx, pasaran
    for j in range(jdn(2026, 1, 1), jdn(2030, 1, 1)):
        if wuku(j) == WUKU.index(wk) and (j + 1) % 7 == hari_idx and j % 5 == pas:
            return j
    return None
P = {n: i for i, n in enumerate(PASARAN)}
print("\nRule 5 taliwangke wuku check (wuku, hari, pasaran -> exists in cycle?):")
for wk, hi, pn in [("Wuye", 1, "Kliwon"), ("Wayang", 2, "Legi"), ("Landep", 3, "Pahing"), ("Warigalit", 4, "Pon"), ("Kuningan", 5, "Wage"), ("Kuruwelut", 6, "Kliwon")]:
    j = day_in_wuku(wk, hi, P[pn]); print(" ", wk, HARI[hi], pn, "->", "OK" if j else "NEVER (pasaran mismatch)")
print("Rule 6 samparwangke:")
for wk, pn in [("Warigalit", "Kliwon"), ("Bala", "Legi"), ("Langkir", "Pahing"), ("Sinta", "Pon"), ("Tambir", "Wage")]:
    j = day_in_wuku(wk, 1, P[pn]); print(" ", wk, "Senin", pn, "->", "OK" if j else "NEVER")
# general: Senin Pon/Kliwon... in each wuku? list monday pasaran per wuku
print("Monday pasaran by wuku index (first 8):", [PASARAN[(jdn(2026,11,2) + 7*k) % 5] for k in range(8)])
