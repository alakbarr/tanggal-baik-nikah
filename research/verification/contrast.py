def lum(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

def cr(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)

pairs = [("#FFFFFF", "#C5A059", "white text on prada-500 button"),
         ("#0B0C0F", "#C5A059", "obsidian text on prada-500"),
         ("#A89F8B", "#FFFFFF", "sand-500 text on white"),
         ("#A89F8B", "#FAF9F5", "sand-500 text on sand-50"),
         ("#8A816E", "#FFFFFF", "sand-600 text on white"),
         ("#C5A059", "#FAF9F5", "prada-500 text on sand-50 (light)"),
         ("#A6803F", "#FFFFFF", "prada-600 text on white"),
         ("#85622C", "#FFFFFF", "prada-700 text on white"),
         ("#10B981", "#111318", "emerald-500 on obsidian-900 (dark)"),
         ("#FFFFFF", "#10B981", "white on emerald-500"),
         ("#D97706", "#FFFFFF", "amber-600 text on white"),
         ("#A89F8B", "#111318", "sand-500 on obsidian-900"),
         ("#6A6353", "#111318", "sand-700 border on obsidian-900 (3:1 needed)"),
         ("#3D382E", "#161920", "sand-800 border on obsidian-850 (3:1 needed)")]
for a, b, n in pairs:
    r = cr(a, b)
    print(f"{r:5.2f}:1  {'OK ' if r >= 4.5 else ('3:1' if r >= 3 else 'FAIL')}  {n}")
