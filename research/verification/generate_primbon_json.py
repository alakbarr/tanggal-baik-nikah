import json
import os
import re

OUT_DIR = r"D:\tanggal_baik_nikah\packages\core\src\data\primbon"
W = r"D:\tanggal_baik_nikah\research\betaljemur-wikisource"
os.makedirs(OUT_DIR, exist_ok=True)

# -----------------------------------------------------------------
# 1. B-01: Popular 8-category couple table (Pegat..Pesthi)
# -----------------------------------------------------------------
CATEGORIES_8 = [
    "Pegat",     # 0
    "Pegat",     # 1
    "Ratu",      # 2
    "Jodoh",     # 3
    "Topo",      # 4
    "Tinari",    # 5
    "Padu",      # 6
    "Sujanan",   # 7
    "Pesthi",    # 8
]

CATEGORY_DESC = {
    "Pegat": "Asil pegat ngemu teges kerep nemoni masalah, bisa awujud pasulayan, masalah ékonomi, utawa pisah.",
    "Ratu": "Asil ratu ngemu teges kajèn-keringan, diajèni déning tangga teparo lan kinurmatan.",
    "Jodoh": "Asil jodoh ngemu teges cocog lan runtut, bisa nampa kaluwihan lan kakuranganing pasangan.",
    "Topo": "Asil topo ngemu teges wiwitané ngalami keprihatinan nanging pungkasané nemu kamulyan lan kabungahan.",
    "Tinari": "Asil tinari ngemu teges gampang golèk rejeki lan kaparingan sandhang pangan kang lumintu.",
    "Padu": "Asil padu ngemu teges kerep padudon babagan cilik, nanging ora nganti nuwuhaké pisahan.",
    "Sujanan": "Asil sujanan ngemu teges kerep ngadhepi rasa was-sumelang utawa pasulayan ing babagan kasetyan.",
    "Pesthi": "Asil pesthi ngemu teges tentrem, ayem, rukun nganti tuwa tanpa rubéda kang gedhé.",
}

b01_table = {}
for n in range(14, 37):  # Neptu sums from 7+7=14 to 18+18=36
    r = n % 9
    cat = CATEGORIES_8[r]
    b01_table[str(n)] = {
        "sum": n,
        "remainderMod9": r,
        "category": cat,
        "descriptionJv": CATEGORY_DESC[cat],
        "verdict": "pass" if cat in ["Ratu", "Jodoh", "Tinari", "Pesthi"] else "info",
    }

with open(os.path.join(OUT_DIR, "b01_pegat_pesthi.json"), "w", encoding="utf-8") as f:
    json.dump(b01_table, f, indent=2, ensure_ascii=False)

# -----------------------------------------------------------------
# 2. J-15: Pasatohan 9x9 (Betaljemur No. 15, pp. 12-13)
# -----------------------------------------------------------------
p13_14 = open(os.path.join(W, "p13.txt"), encoding="utf-8").read() + "\n" + open(os.path.join(W, "p14.txt"), encoding="utf-8").read()

j15_cells = {}
for a, b, t in re.findall(r"\|\s*(\d)\s*\|\|\s*(?:lan|\{\{c\|\"\}\})\s*\|\|\s*(\d)\.?\s*\|\|\s*([^\n]+)", p13_14):
    ia, ib = int(a), int(b)
    text = t.strip()
    j15_cells[f"{ia},{ib}"] = text
    j15_cells[f"{ib},{ia}"] = text

if "8,9" not in j15_cells:
    j15_cells["8,9"] = "kapotan, iku sedheng"
    j15_cells["9,8"] = "kapotan, iku sedheng"
if "9,9" not in j15_cells:
    j15_cells["9,9"] = "nemu lara, iku ala"

j15_full = {}
for i in range(1, 10):
    for j in range(1, 10):
        key = f"{i},{j}"
        txt = j15_cells.get(key, "sedheng")
        is_ala = any(w in txt.lower() for w in ["ala", "pegat", "mlarat", "mati", "bilahi", "bilai", "lara", "satru", "kasurang", "godan", "rencanan", "pangkalan", "kalah", "sambekala", "giras"])
        is_becik = not is_ala and any(w in txt.lower() for w in ["becik", "slamet", "rahayu", "sugih", "kinasihan", "nugraha", "rukun", "rijeki", "rejeki", "begja", "sandhang", "tulus"])
        j15_full[key] = {
            "groomMod9": i,
            "brideMod9": j,
            "meaningJv": txt,
            "verdict": "pass" if is_becik else ("fail" if is_ala else "info"),
        }

with open(os.path.join(OUT_DIR, "j15_pasatohan.json"), "w", encoding="utf-8") as f:
    json.dump(j15_full, f, indent=2, ensure_ascii=False)

# -----------------------------------------------------------------
# 3. J-16: Modulo 4 (Betaljemur No. 16, p. 13)
# -----------------------------------------------------------------
j16_data = {
    "1": {"name": "Gendheng", "meaningJv": "nemu sugih, nanging kerep lara", "verdict": "info"},
    "2": {"name": "Gembili", "meaningJv": "sugih anak lan sugih rejeki", "verdict": "pass"},
    "3": {"name": "Sri", "meaningJv": "rahayu lan kajèn-keringan", "verdict": "pass"},
    "0": {"name": "Punggel", "meaningJv": "mati salah siji", "verdict": "fail"},
}
with open(os.path.join(OUT_DIR, "j16_mod4.json"), "w", encoding="utf-8") as f:
    json.dump(j16_data, f, indent=2, ensure_ascii=False)

# -----------------------------------------------------------------
# 4. J-17: Weekday Pairs (Betaljemur No. 17, p. 13)
# -----------------------------------------------------------------
def normalize_day(d):
    d = d.strip().replace(".", "").lower()
    if "akad" in d: return 0
    if "sen" in d: return 1
    if "selas" in d: return 2
    if "reb" in d: return 3
    if "kem" in d: return 4
    if "jum" in d: return 5
    if "sap" in d or "set" in d: return 6
    return None

j17_pairs = {}
current_left = None

for line in open(os.path.join(W, "p14.txt"), encoding="utf-8"):
    l = line.strip()
    m1 = re.match(r"^\|\s*([A-Za-z\.\']+)\s*\|\|\s*lan\s*\|\|\s*([A-Za-zèé\.\']+),\s*(.+)", l)
    m2 = re.match(r"^\|\s*\{\{c\|\"\}\}\s*\|\|\s*\{\{c\|\"\}\}\s*\|\|\s*([A-Za-zèé\.\']+),\s*(.+)", l)
    if m1:
        d1 = normalize_day(m1.group(1))
        d2 = normalize_day(m1.group(2))
        current_left = d1
        txt = m1.group(3).strip()
    elif m2 and current_left is not None:
        d1 = current_left
        d2 = normalize_day(m2.group(1))
        txt = m2.group(2).strip()
    else:
        continue

    if d1 is not None and d2 is not None:
        v = "pass" if any(w in txt.lower() for w in ["becik", "yuwana", "juwana", "sugih", "berkat"]) else ("fail" if any(w in txt.lower() for w in ["ala", "pegat", "mlarat", "lara", "padu", "cilaka"]) else "info")
        val = {"day1": d1, "day2": d2, "meaningJv": txt, "verdict": v}
        j17_pairs[f"{d1},{d2}"] = val
        j17_pairs[f"{d2},{d1}"] = val

print(f"J-17 parsed pairs: {len(j17_pairs)}")

with open(os.path.join(OUT_DIR, "j17_saptawara_pairs.json"), "w", encoding="utf-8") as f:
    json.dump(j17_pairs, f, indent=2, ensure_ascii=False)

# -----------------------------------------------------------------
# 5. J-22: Pancasuda Penganten (Betaljemur No. 22, p. 17)
# -----------------------------------------------------------------
j22_data = {
    "1": {"name": "Pisang Pinanggel", "meaningJv": "gethingan, kerep pasulayan", "verdict": "fail"},
    "2": {"name": "Tebu Manteb", "meaningJv": "mantep lan mantheng atiné, rahayu", "verdict": "pass"},
    "3": {"name": "Gedhang Ditumpangi", "meaningJv": "nemu susah lan rubéda", "verdict": "fail"},
    "4": {"name": "Rondha Keli", "meaningJv": "kerep ngalami kapitunan", "verdict": "fail"},
    "5": {"name": "Semut Ngusung Gula", "meaningJv": "nemu rejeki lumintu lan karukunan", "verdict": "pass"},
    "6": {"name": "Tunggak Gugur", "meaningJv": "nemu cilaka", "verdict": "fail"},
    "0": {"name": "Bale Kedhawang", "meaningJv": "nemu kamulyan lan karaharjan", "verdict": "pass"},
}
with open(os.path.join(OUT_DIR, "j22_pancasuda.json"), "w", encoding="utf-8") as f:
    json.dump(j22_data, f, indent=2, ensure_ascii=False)

# -----------------------------------------------------------------
# 6. J-23: Modulo 5 (Betaljemur No. 23, p. 17)
# -----------------------------------------------------------------
j23_data = {
    "1": {"name": "Sri", "meaningJv": "murah rejeki", "verdict": "pass"},
    "2": {"name": "Lungguh", "meaningJv": "antuk pangkat kalungguhan", "verdict": "pass"},
    "3": {"name": "Gedhong", "meaningJv": "sugih bandha", "verdict": "pass"},
    "4": {"name": "Lara", "meaningJv": "nemu lelara", "verdict": "fail"},
    "0": {"name": "Pati", "meaningJv": "nemu pati salah siji", "verdict": "fail"},
}
with open(os.path.join(OUT_DIR, "j23_mod5.json"), "w", encoding="utf-8") as f:
    json.dump(j23_data, f, indent=2, ensure_ascii=False)

# -----------------------------------------------------------------
# 7. Date Rules: J-05, J-06, J-14, J-26, J-27, J-28, J-29, J-30, J-31, J-32, J-33, J-34, J-35
# -----------------------------------------------------------------
j05_data = [
    {"wuku": "Wuye", "dayIndex": 1, "pasaranIndex": 4},
    {"wuku": "Wayang", "dayIndex": 2, "pasaranIndex": 0},
    {"wuku": "Landep", "dayIndex": 3, "pasaranIndex": 1},
    {"wuku": "Warigalit", "dayIndex": 4, "pasaranIndex": 2},
    {"wuku": "Kuningan", "dayIndex": 5, "pasaranIndex": 3},
    {"wuku": "Kuruwelut", "dayIndex": 6, "pasaranIndex": 4},
]
with open(os.path.join(OUT_DIR, "j05_taliwangke_wuku.json"), "w", encoding="utf-8") as f:
    json.dump(j05_data, f, indent=2, ensure_ascii=False)

j06_data = [
    {"wuku": "Warigalit", "dayIndex": 1, "pasaranIndex": 4},
    {"wuku": "Bala", "dayIndex": 1, "pasaranIndex": 0},
    {"wuku": "Langkir", "dayIndex": 1, "pasaranIndex": 1},
    {"wuku": "Sinta", "dayIndex": 1, "pasaranIndex": 2},
    {"wuku": "Tambir", "dayIndex": 1, "pasaranIndex": 3},
]
with open(os.path.join(OUT_DIR, "j06_samparwangke_wuku.json"), "w", encoding="utf-8") as f:
    json.dump(j06_data, f, indent=2, ensure_ascii=False)

j14_data = {
    "Sura": {"dates": [11, 14, 17, 27], "taliwangkeWeton": "Rabu Pahing", "dayIndex": 3, "pasaranIndex": 1},
    "Sapar": {"dates": [1, 12, 20, 22], "taliwangkeWeton": "Kamis Pon", "dayIndex": 4, "pasaranIndex": 2},
    "Mulud": {"dates": [10, 13, 15, 23], "taliwangkeWeton": "Jumat Wage", "dayIndex": 5, "pasaranIndex": 3},
    "Bakdamulud": {"dates": [10, 15, 20, 25], "taliwangkeWeton": "Sabtu Kliwon", "dayIndex": 6, "pasaranIndex": 4},
    "Jumadilawal": {"dates": [10, 11, 16, 26], "taliwangkeWeton": "Senin Kliwon", "dayIndex": 1, "pasaranIndex": 4},
    "Jumadilakir": {"dates": [3, 11, 14, 21], "taliwangkeWeton": "Selasa Legi", "dayIndex": 2, "pasaranIndex": 0},
    "Rejeb": {"dates": [2, 11, 12, 22], "taliwangkeWeton": "Rabu Pahing", "dayIndex": 3, "pasaranIndex": 1},
    "Ruwah": {"dates": [14, 19, 24, 28], "taliwangkeWeton": "Kamis Pon", "dayIndex": 4, "pasaranIndex": 2},
    "Pasa": {"dates": [10, 15, 20, 25], "taliwangkeWeton": "Jumat Wage", "dayIndex": 5, "pasaranIndex": 3},
    "Sawal": {"dates": [2, 17, 20, 27], "taliwangkeWeton": "Sabtu Kliwon", "dayIndex": 6, "pasaranIndex": 4},
    "Dulkangidah": {"dates": [6, 11, 12, 21], "taliwangkeWeton": "Senin Kliwon", "dayIndex": 1, "pasaranIndex": 4},
    "Besar": {"dates": [1, 13, 20, 23], "taliwangkeWeton": "Selasa Legi", "dayIndex": 2, "pasaranIndex": 0},
}
with open(os.path.join(OUT_DIR, "j14_sangaring_tanggal.json"), "w", encoding="utf-8") as f:
    json.dump(j14_data, f, indent=2, ensure_ascii=False)

j26_data = {
    "Jumadilakir": [5],
    "Rejeb": [5],
    "Ruwah": [5],
    "Pasa": [6, 0],
    "Sawal": [6, 0],
    "Dulkangidah": [6, 0],
    "Besar": [1, 2],
    "Sura": [1, 2],
    "Sapar": [1, 2],
    "Mulud": [3, 4],
    "Bakdamulud": [3, 4],
    "Jumadilawal": [3, 4],
}
with open(os.path.join(OUT_DIR, "j26_dina_ala.json"), "w", encoding="utf-8") as f:
    json.dump(j26_data, f, indent=2, ensure_ascii=False)

j27_data = {
    "Jumadilakir": [3, 4],
    "Rejeb": [3, 4],
    "Ruwah": [3, 4],
    "Pasa": [5],
    "Sawal": [5],
    "Dulkangidah": [5],
    "Besar": [6, 0],
    "Sura": [6, 0],
    "Sapar": [6, 0],
    "Mulud": [1, 2],
    "Bakdamulud": [1, 2],
    "Jumadilawal": [1, 2],
}
with open(os.path.join(OUT_DIR, "j27_dina_sangaring_asal.json"), "w", encoding="utf-8") as f:
    json.dump(j27_data, f, indent=2, ensure_ascii=False)

j28_data = {
    "Sura": [13],
    "Mulud": [3],
    "Bakdamulud": [16],
    "Jumadilawal": [5],
    "Pasa": [12, 21],
    "Dulkangidah": [24],
    "Besar": [25],
}
with open(os.path.join(OUT_DIR, "j28_naasing_para_nabi.json"), "w", encoding="utf-8") as f:
    json.dump(j28_data, f, indent=2, ensure_ascii=False)

j29_data = {
    "Sura": [6, 11],
    "Sapar": [1, 20],
    "Mulud": [10, 20],
    "Bakdamulud": [10, 20],
    "Jumadilawal": [1, 11],
    "Jumadilakir": [10, 14],
    "Rejeb": [2, 14],
    "Ruwah": [12, 13],
    "Pasa": [9, 20],
    "Sawal": [10, 20],
    "Dulkangidah": [9, 13],
    "Besar": [10, 12],
}
with open(os.path.join(OUT_DIR, "j29_naasing_tanggal.json"), "w", encoding="utf-8") as f:
    json.dump(j29_data, f, indent=2, ensure_ascii=False)

j30_data = {
    "Sura": [18],
    "Sapar": [10],
    "Mulud": [8],
    "Bakdamulud": [28],
    "Jumadilawal": [28],
    "Jumadilakir": [18],
    "Rejeb": [18],
    "Ruwah": [26],
    "Pasa": [24],
    "Sawal": [2],
    "Dulkangidah": [28],
    "Besar": [],
}
with open(os.path.join(OUT_DIR, "j30_sangaring_tanggal.json"), "w", encoding="utf-8") as f:
    json.dump(j30_data, f, indent=2, ensure_ascii=False)

j31_data = {
    "Sura": [11],
    "Sapar": [20],
    "Mulud": [1, 15],
    "Bakdamulud": [10, 20],
    "Jumadilawal": [10, 11],
    "Jumadilakir": [10, 14],
    "Rejeb": [13, 27],
    "Ruwah": [4, 28],
    "Pasa": [7, 9, 20],
    "Sawal": [10],
    "Dulkangidah": [2, 22],
    "Besar": [6, 20],
}
with open(os.path.join(OUT_DIR, "j31_bangas_padewan.json"), "w", encoding="utf-8") as f:
    json.dump(j31_data, f, indent=2, ensure_ascii=False)

j32_data = {
    "Dulkangidah": {"dayIndex": 1, "pasaranIndex": 4},
    "Jumadilawal": {"dayIndex": 1, "pasaranIndex": 4},
    "Besar": {"dayIndex": 2, "pasaranIndex": 0},
    "Jumadilakir": {"dayIndex": 2, "pasaranIndex": 0},
    "Sura": {"dayIndex": 3, "pasaranIndex": 1},
    "Rejeb": {"dayIndex": 3, "pasaranIndex": 1},
    "Sapar": {"dayIndex": 4, "pasaranIndex": 2},
    "Ruwah": {"dayIndex": 4, "pasaranIndex": 2},
    "Mulud": {"dayIndex": 5, "pasaranIndex": 3},
    "Pasa": {"dayIndex": 5, "pasaranIndex": 3},
    "Bakdamulud": {"dayIndex": 6, "pasaranIndex": 4},
    "Sawal": {"dayIndex": 6, "pasaranIndex": 4},
}
with open(os.path.join(OUT_DIR, "j32_taliwangke_sasi.json"), "w", encoding="utf-8") as f:
    json.dump(j32_data, f, indent=2, ensure_ascii=False)

j33_data = {
    "Sura": {"quality": "ala", "noteJv": "cilaka gedhé, aja diterak"},
    "Sapar": {"quality": "sedheng", "noteJv": "kekurangan, kena diterak"},
    "Mulud": {"quality": "ala", "noteJv": "mati salah siji, aja diterak"},
    "Bakdamulud": {"quality": "sedheng", "noteJv": "diomong ala, kena diterak"},
    "Jumadilawal": {"quality": "sedheng", "noteJv": "kerep kélangan, kena diterak"},
    "Jumadilakir": {"quality": "becik", "noteJv": "sugih mas salaka"},
    "Rejeb": {"quality": "becik", "noteJv": "sugih anak lan slamet"},
    "Ruwah": {"quality": "becik", "noteJv": "rahayu ing sakabèhé"},
    "Pasa": {"quality": "ala", "noteJv": "cilaka gedhé, aja diterak"},
    "Sawal": {"quality": "sedheng", "noteJv": "kekurangan, sugih utang, kena diterak"},
    "Dulkangidah": {"quality": "ala", "noteJv": "gering, kerep pasulayan, aja diterak"},
    "Besar": {"quality": "becik", "noteJv": "sugih, nemu suka harja"},
}
with open(os.path.join(OUT_DIR, "j33_ala_beciking_sasi.json"), "w", encoding="utf-8") as f:
    json.dump(j33_data, f, indent=2, ensure_ascii=False)

j34_consensus = [
    {"dayIndex": 5, "kaping": 1}, # Jumuah 1
    {"dayIndex": 0, "kaping": 2}, # Akad 2
    {"dayIndex": 1, "kaping": 2}, # Senen 2
    {"dayIndex": 2, "kaping": 4}, # Selasa 4
    {"dayIndex": 3, "kaping": 2}, # Rebo 2
    {"dayIndex": 4, "kaping": 3}, # Kemis 3
]
with open(os.path.join(OUT_DIR, "j34_rupa_tiga.json"), "w", encoding="utf-8") as f:
    json.dump(j34_consensus, f, indent=2, ensure_ascii=False)

WINDOWS = [
    {"start": "06:00", "end": "08:23"},
    {"start": "08:24", "end": "10:47"},
    {"start": "10:48", "end": "13:11"},
    {"start": "13:12", "end": "15:35"},
    {"start": "15:36", "end": "17:59"},
]
j35_table = {
    "0": ["Pitutur", "Rejeki", "Slamet", "Pangkalan", "Pacekwesi"],      # Legi
    "1": ["Rejeki", "Slamet", "Pangkalan", "Pacekwesi", "Pitutur"],      # Pahing
    "2": ["Slamet", "Pangkalan", "Pacekwesi", "Pitutur", "Rejeki"],      # Pon
    "3": ["Pangkalan", "Pacekwesi", "Pitutur", "Rejeki", "Slamet"],      # Wage
    "4": ["Pacekwesi", "Pitutur", "Rejeki", "Slamet", "Pangkalan"],      # Kliwon
}
with open(os.path.join(OUT_DIR, "j35_saat_pasaran.json"), "w", encoding="utf-8") as f:
    json.dump({"windows": WINDOWS, "ratings": j35_table}, f, indent=2, ensure_ascii=False)

print("Generated all primbon JSON datasets successfully.")
