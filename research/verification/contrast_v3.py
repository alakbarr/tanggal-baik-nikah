import sys
sys.path.insert(0, r"D:\tanggal_baik_nikah\research\verification")
from contrast import cr
P = [("#0B0C0F","#C5A059","dark text on prada-500 button"),
("#85622C","#FFFFFF","prada-700 text on white"),("#85622C","#FAF9F5","prada-700 text on sand-50"),
("#63471E","#FAF9F5","prada-800 text on sand-50"),
("#6A6353","#FFFFFF","sand-700 text on white"),("#6A6353","#FAF9F5","sand-700 text on sand-50"),
("#FFFFFF","#047857","white on emerald-700"),("#FFFFFF","#065F46","white on emerald-800"),
("#B45309","#FFFFFF","amber-700 text on white"),("#B45309","#FAF9F5","amber-700 on sand-50"),
("#8A816E","#FFFFFF","sand-600 border on white (3:1)"),("#8A816E","#FAF9F5","sand-600 border on sand-50 (3:1)"),
("#6A6353","#0B0C0F","sand-700 border on obsidian-950 (3:1)"),("#6A6353","#161920","sand-700 border on obsidian-850 (3:1)"),
("#A89F8B","#161920","sand-500 text on obsidian-850"),("#DEC071","#0B0C0F","prada-400 text on obsidian-950"),
("#DEC071","#111318","prada-400 text on obsidian-900"),("#10B981","#161920","emerald-500 on obsidian-850"),
("#F59E0B","#111318","amber-500 on obsidian-900"),("#FAF9F5","#0B0C0F","sand-50 on obsidian-950"),
("#047857","#FFFFFF","emerald-700 text on white"),("#047857","#FAF9F5","emerald-700 text on sand-50"),
("#065F46","#F0FDF4","emerald-800 on emerald-50"),("#85622C","#F4E7CA","prada-700 on prada-200"),
("#63471E","#FBF6EC","prada-800 on prada-100")]
for a,b,n in P:
    r=cr(a,b); print(f"{r:5.2f}:1 {'OK ' if r>=4.5 else ('3:1' if r>=3 else 'FAIL')} {n}")
