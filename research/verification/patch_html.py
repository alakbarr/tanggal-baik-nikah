p = r"D:\tanggal_baik_nikah\design-system.html"
t = open(p, encoding="utf-8").read()
note = ("<!-- PROTOTYPE STATUS (audit 2 Nov 2026): visual mock only. Its sample data is NOT computed by the engine and contains known errors "
        "(e.g. 28 May 1998 is 1 Sapar 1931 Alip, wuku Kuruwelut, not Wawu/Gumbreg; 28 Oct 1999 is 18 Rejeb 1932 Ehe, wuku Sinta; neptu 28 mod 8 is the wrong formula, "
        "the correct popular-table result for 28 is Pegat). Colour tokens fail WCAG in places (see DESIGN_SYSTEM.md 3.2) and fonts load from a CDN. Fix tracked in TASKS.md 0.8. -->\n")
if "PROTOTYPE STATUS" not in t:
    i = t.lower().index("<html")
    j = t.index(">", i) + 1
    t = t[:j] + "\n" + note + t[j:]
    open(p, "w", encoding="utf-8").write(t)
print("ok")
