p = r"D:\tanggal_baik_nikah\RESEARCH.md"
t = open(p, encoding="utf-8-sig").read()
a = t.index("## 5. Local Tradition")
b = t.index("## 6. Feasibility")
new = '''## 5. Local Tradition: Setiaji (Undip) *Petungan Cara Jawa*

**Source (opened and read in full on 2 Nov 2026).** Bayu Candra Setiaji, *Ramalan Weton Pernikahan dalam Petungan Cara Jawa (Suntingan Teks dan Kajian Pragmatik)*, "Jurnal Skripsi Mahasiswa", S1 Sastra Indonesia, Fakultas Ilmu Budaya, Universitas Diponegoro. Supervisors: Dra. Rukiyah, M.Hum. and Fajrul Falah, M.Hum. The PDF cover says "Semarang 2021"; UNDIP-IR record **83993** was deposited on 24 Feb 2022 (<http://eprints.undip.ac.id/83993/>, 25-page PDF, 714 KB, public). This is a short journal version of the skripsi, not the full text with the diplomatic edition.

**Corrections to earlier notes.** (a) The object is a single printed-copy manuscript owned by **Pak Suyadi (65), Desa Kropak, Kecamatan Winong, Kabupaten Pati**. Desa Godo was visited (Pak Suwito's primbon) but is not the object. (b) The manuscript is in Javanese script, is a *naskah tunggal*, and its owners ask that it not be published. (c) It is a local source for one village's practice, not a regional standard. (d) The author reports no explanation for the "remainder 2" rule beyond the informant's remark that remainder 2 "melambangkan kedua calon pengantin untuk selalu bersama" (p. 21–22 of the PDF). Labels such as "Lara", "Pati", "Slamet" for remainders 1 and 0 that appeared in a research draft are **not in the source** and must not be used.

| ID | Rule as stated (PDF page) | dataStatus |
|---|---|---|
| U-01 | Add the two spouses' wetons and the candidate day's weton neptu; the sum must leave **2** when divided by 3. Example: couple 7 + 15 = 22; Senin Legi 9 → 31 → remainder 1, rejected; Selasa Wage 7 → 29 → 2, accepted; Selasa Pon 10 → 32 → 2, accepted (pp. 21–22) | verified (T1-L) |
| U-02 | The wedding day must not equal either spouse's birth weton (pp. 22, 24) | verified |
| U-03 | Nor either parent's birth weton (p. 22) | verified |
| U-04 | Nor the day of death of a deceased parent (pp. 22, 24) | verified |
| U-05 | *Hari naas* (taliwangke) of **the two spouses only**, not the parents: count from the spouse's weton as many days as the weton's neptu, inclusively. Selasa Wage (7) → counting 7 days from Selasa Wage lands on Senin Kliwon (p. 23). Inscription quoted: "Taliwake, nassase kawittane sura" | verified |
| U-06 | *Mempertemukan pengantin* (meeting the couple), Table 3.2: Jumat 3, 4, 5 sore; Sabtu 9, 10 pagi; Minggu 3, 4, 5 sore; Senin 1, 2, 3 sore; Selasa 3, 4, 5 sore; Rabu 9, 10 pagi; Kamis 9, 10 pagi (p. 23) | verified |
| U-07 | *Pelaksanaan hajat*, Table 3.3, "baik / kurang baik": Jumat 3, 4, 5 sore / 11 pagi; Sabtu 9, 10 pagi / 2 sore; Minggu 3, 4, 5 sore / 2 sore; Senin 1, 3, 4 sore (as printed) / 8 pagi; Selasa 3, 4, 5 sore / 11 pagi; Rabu 9, 10 pagi / 1, 2 sore; Kamis 9, 10 pagi / 1, 2 sore (pp. 23–24). A research draft merged U-06 and U-07 and mis-stated Senin and Selasa | verified |

Further statements worth quoting in the UI: the informant says "sebenarnya tidak ada hari yang buruk untuk melaksanakan pernikahan; semua itu tergantung dari perhitungan kedua calon pengantin" (p. 24), and the dates to avoid are those tied to the spouses' own wetons and their parents' death days. The manuscript's Javanese month list gives *Apit* for Dulkangidah.

The manuscript's 35-day table (Tabel 3.1.1, starting and ending Selasa Wage) is the weton (selapan) cycle and needs no separate rule. The thesis states the neptu values Ahad 5, Senin 4, Selasa 3, Rabu 7, Kamis 8, Jumat 6, Sabtu 9 and Wage 4, Kliwon 8, Legi 5, Pahing 9, Pon 7, matching Betaljemur p. 7.

---

'''
t = t[:a] + new + t[b:]
t = t.replace("| 12 | Undip thesis: \"master's thesis, 2021\" | S1 *skripsi*, 2022, Bayu Candra Setiaji, FIB Undip (search results; repository record not opened) | §6 |",
              "| 12 | Undip thesis: \"master's thesis, 2021\", fieldwork in Godo | S1 *skripsi* (journal version), cover 2021, deposited 24 Feb 2022, Bayu Candra Setiaji, FIB Undip; manuscript of Pak Suyadi, **Desa Kropak**, Winong, Pati. Rule U-01 confirmed from the PDF; invented remainder labels removed | §5 |")
t = t.replace("| U-01..U-06 | Setiaji | date | thesis | T1-L, unverified text | local profile only |",
              "| U-01..U-07 | Setiaji | date | PDF pp. 21–24 | verified (T1-L) | Pati profile only; U-06/U-07 informational |")
open(p, "w", encoding="utf-8-sig").write(t)
print("done", "Godo" in t)
