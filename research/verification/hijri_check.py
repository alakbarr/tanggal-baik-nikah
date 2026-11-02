import io, sys, datetime as dt
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
ID = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
K1447 = [(2025,6,27,"Jumat"),(2025,7,26,"Sabtu"),(2025,8,25,"Senin"),(2025,9,23,"Selasa"),(2025,10,23,"Kamis"),(2025,11,22,"Sabtu"),(2025,12,21,"Minggu"),(2026,1,20,"Selasa"),(2026,2,19,"Kamis"),(2026,3,21,"Sabtu"),(2026,4,19,"Minggu"),(2026,5,18,"Senin"),(2026,6,16,"Selasa")]
K1448 = [(2026,6,16,"Selasa"),(2026,7,16,"Kamis"),(2026,8,14,"Jumat"),(2026,9,13,"Minggu"),(2026,10,12,"Senin"),(2026,11,11,"Rabu"),(2026,12,10,"Kamis"),(2027,1,9,"Sabtu"),(2027,2,8,"Senin"),(2027,3,10,"Rabu"),(2027,4,8,"Kamis"),(2027,5,8,"Sabtu")]
for name, tab in (("1447", K1447), ("1448", K1448)):
    print(name)
    prev = None
    for y, m, d, hn in tab:
        date = dt.date(y, m, d)
        ok = ID[date.weekday()] == hn
        gap = (date - prev).days if prev else None
        print("  ", date, hn, "weekday OK" if ok else "WEEKDAY MISMATCH ->" + ID[date.weekday()], "len(prev)=", gap)
        prev = date
