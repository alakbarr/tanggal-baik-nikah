from verify import jdn, weton, greg, wuku, WUKU, javanese
e = 2428252 - 42524
print("Aboge epoch", e, greg(e), weton(e))
for ymd in [(2024, 7, 8), (2026, 6, 17), (2027, 6, 6)]:
    j = jdn(*ymd); print(ymd, j, weton(j), WUKU[wuku(j)], javanese(j))
# perpetual aboge: 1 Sura 1960 under Aboge (no drop since 1747)
j = e; y = 1747
L = [354, 355, 354, 354, 355, 354, 354, 355]
while y < 1960:
    j += L[(y - 1747) % 8]; y += 1
print("Aboge-perpetual 1 Sura 1960:", greg(j), weton(j))
