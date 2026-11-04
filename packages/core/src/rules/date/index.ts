import j05Data from '../../data/primbon/j05_taliwangke_wuku.json' with { type: 'json' };
import j06Data from '../../data/primbon/j06_samparwangke_wuku.json' with { type: 'json' };
import j11Data from '../../data/primbon/j11_pati_uriping_sasi.json' with { type: 'json' };
import j13Data from '../../data/primbon/j13_larangan_sasi.json' with { type: 'json' };
import j14Data from '../../data/primbon/j14_sangaring_tanggal.json' with { type: 'json' };
import j26Data from '../../data/primbon/j26_dina_ala.json' with { type: 'json' };
import j27Data from '../../data/primbon/j27_dina_sangaring_asal.json' with { type: 'json' };
import j28Data from '../../data/primbon/j28_naasing_para_nabi.json' with { type: 'json' };
import j29Data from '../../data/primbon/j29_naasing_tanggal.json' with { type: 'json' };
import j30Data from '../../data/primbon/j30_sangaring_tanggal.json' with { type: 'json' };
import j31Data from '../../data/primbon/j31_bangas_padewan.json' with { type: 'json' };
import j32Data from '../../data/primbon/j32_taliwangke_sasi.json' with { type: 'json' };
import j33Data from '../../data/primbon/j33_ala_beciking_sasi.json' with { type: 'json' };
import j34Data from '../../data/primbon/j34_rupa_tiga.json' with { type: 'json' };
import j35Data from '../../data/primbon/j35_saat_pasaran.json' with { type: 'json' };
import j36Data from '../../data/primbon/j36_saat_tanggal.json' with { type: 'json' };
import { SASI_JAWA_NAMES } from '../../constants/neptu.js';
import type { DayPoint, RuleOutcome, SaatEntry, SaatTanggalEntry, SasiJawa } from '../../types.js';
import { jdnToJavanese } from '../../calendar/javanese.js';
import { getWetonFromJdn } from '../../calendar/weton.js';

interface J14Entry {
  readonly dates: readonly number[];
  readonly taliwangkeWeton: string;
  readonly dayIndex: number;
  readonly pasaranIndex: number;
}

interface J32Entry {
  readonly dayIndex: number;
  readonly pasaranIndex: number;
}

interface J33Entry {
  readonly quality: string;
  readonly noteJv: string;
  readonly noteId?: string;
}

interface J34Entry {
  readonly dayIndex: number;
  readonly kaping: number;
}

interface J35Data {
  readonly windows: readonly { readonly start: string; readonly end: string }[];
  readonly ratings: Readonly<Record<string, readonly string[]>>;
}

interface J11Entry {
  readonly becik: readonly number[];
  readonly ala: readonly number[];
}

const j11Table = j11Data as unknown as Record<string, J11Entry>;
const j13Table = j13Data as unknown as Record<string, readonly number[]>;
const j14Table = j14Data as unknown as Record<string, J14Entry>;
const j26Table = j26Data as unknown as Record<string, readonly number[]>;
const j27Table = j27Data as unknown as Record<string, readonly number[]>;
const j28Table = j28Data as unknown as Record<string, readonly number[]>;
const j29Table = j29Data as unknown as Record<string, readonly number[]>;
const j30Table = j30Data as unknown as Record<string, readonly number[]>;
const j31Table = j31Data as unknown as Record<string, readonly number[]>;
const j32Table = j32Data as unknown as Record<string, J32Entry>;
const j33Table = j33Data as unknown as Record<string, J33Entry>;
const j34List = j34Data as unknown as readonly J34Entry[];
const j35Table = j35Data as unknown as J35Data;

interface WukuTabooEntry {
  readonly wuku: string;
  readonly dayIndex: number;
  readonly pasaranIndex: number;
}

interface J36RatingItem {
  readonly angel: string;
  readonly quality: string;
  readonly verdict: 'pass' | 'fail' | 'info';
}

interface J36Data {
  readonly windows: readonly { readonly start: string; readonly end: string }[];
  readonly ratings: Readonly<Record<string, readonly J36RatingItem[]>>;
}

const j05List = j05Data as unknown as readonly WukuTabooEntry[];
const j06List = j06Data as unknown as readonly WukuTabooEntry[];
const j36Table = j36Data as unknown as J36Data;
const selasaKliwonCache = new Map<string, boolean>();

/**
 * Checks whether a specific Javanese month contains any Tuesday Kliwon (Selasa Kliwon / Anggaraksih).
 */
export function monthHasSelasaKliwon(
  year: number,
  sasi: SasiJawa,
  hintJdn?: number,
  dayInMonth?: number
): boolean {
  const cacheKey = `${year}-${sasi}`;
  const cached = selasaKliwonCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const sasiIdx = SASI_JAWA_NAMES.indexOf(sasi);
  if (sasiIdx === -1) return false;

  let jStart: number;
  if (hintJdn !== undefined && dayInMonth !== undefined) {
    jStart = hintJdn - dayInMonth + 1;
  } else {
    // Jump close to the year and month
    jStart = 2428252 + Math.floor((year - 1867) * 354.36);
    let jd = jdnToJavanese(jStart);
    const diffDays = (year - jd.year) * 354 + (sasiIdx - jd.sasiIndex) * 30 - (jd.day - 1);
    jStart += diffDays;

    // Fine-tune to exactly day 1 of (year, sasiIdx)
    while (true) {
      jd = jdnToJavanese(jStart);
      if (jd.year === year && jd.sasiIndex === sasiIdx && jd.day === 1) {
        break;
      }
      if (jd.year > year || (jd.year === year && jd.sasiIndex > sasiIdx)) {
        jStart--;
      } else {
        jStart++;
      }
    }
  }

  const jdMonth = jdnToJavanese(jStart);
  let monthLen = sasiIdx % 2 === 0 ? 30 : 29;
  if (sasiIdx === 11 && jdMonth.isLongYear) {
    monthLen = 30;
  }

  let hasKliwon = false;
  for (let d = 0; d < monthLen; d++) {
    const w = getWetonFromJdn(jStart + d);
    if (w.dayIndex === 2 && w.pasaranIndex === 4) {
      hasKliwon = true;
      break;
    }
  }

  selasaKliwonCache.set(cacheKey, hasKliwon);
  return hasKliwon;
}

/**
 * J-07: Kunarpaning Warsa (last day of Besar)
 */
export function evaluateJ07(day: DayPoint): RuleOutcome {
  const isBesar = day.javanese.sasi === 'Besar';
  const lastDay = day.javanese.isLongYear ? 30 : 29;
  const isKunarpa = isBesar && day.javanese.day === lastDay;

  return {
    ruleId: 'J-07',
    verdict: isKunarpa ? 'fail' : 'pass',
    labelJv: isKunarpa ? 'Kunarpaning Warsa' : 'Bukan Kunarpaning Warsa',
    explanationId: isKunarpa
      ? `Hari terakhir bulan Besar (${day.javanese.day} Besar ${day.javanese.year}) merupakan pantangan tahunan Kunarpaning Warsa.`
      : 'Bukan hari terakhir bulan Besar.',
  };
}

/**
 * J-08: Sangaring Warsa (3 Sura)
 */
export function evaluateJ08(day: DayPoint): RuleOutcome {
  const isSangaringWarsa = day.javanese.sasi === 'Sura' && day.javanese.day === 3;

  return {
    ruleId: 'J-08',
    verdict: isSangaringWarsa ? 'fail' : 'pass',
    labelJv: isSangaringWarsa ? 'Sangaring Warsa' : 'Bukan Sangaring Warsa',
    explanationId: isSangaringWarsa
      ? `Tanggal 3 Sura (${day.javanese.year} ${day.javanese.tahun}) merupakan naas tahunan Sangaring Warsa.`
      : 'Bukan tanggal 3 Sura.',
  };
}

/**
 * J-12: Anggaraksih (Sasi kang ora ana dinane Anggaraksih ora kena kanggo ngijabake panganten)
 */
export function evaluateJ12(day: DayPoint): RuleOutcome {
  const hasAnggara = monthHasSelasaKliwon(
    day.javanese.year,
    day.javanese.sasi,
    day.jdn,
    day.javanese.day
  );
  if (!hasAnggara) {
    return {
      ruleId: 'J-12',
      verdict: 'fail',
      labelJv: 'Sasi Tanpa Anggaraksih',
      explanationId: `Bulan ${day.javanese.sasi} ${day.javanese.year} tidak memiliki hari Selasa Kliwon (bulan kosong/suwung).`,
    };
  }

  return {
    ruleId: 'J-12',
    verdict: 'pass',
    labelJv: 'Sasi Ngandhut Anggaraksih',
    explanationId: `Bulan ${day.javanese.sasi} ${day.javanese.year} memiliki hari Selasa Kliwon (Anggaraksih).`,
  };
}

/**
 * J-11: Pati Uriping Sasi (Bulan Becik & Ala Miturut Taun)
 */
export function evaluateJ11(day: DayPoint): RuleOutcome {
  const entry = j11Table[day.javanese.tahun];
  const sasiNum = day.javanese.sasiIndex + 1;
  const isBecik = entry?.becik.includes(sasiNum);
  const isAla = entry?.ala.includes(sasiNum);

  const verdict = isBecik ? 'pass' : isAla ? 'fail' : 'info';
  const labelJv = isBecik
    ? `Sasi Becik (${day.javanese.sasi} ${day.javanese.tahun})`
    : isAla
      ? `Sasi Ala (${day.javanese.sasi} ${day.javanese.tahun})`
      : `Sasi Sedheng (${day.javanese.sasi} ${day.javanese.tahun})`;

  return {
    ruleId: 'J-11',
    verdict,
    labelJv,
    explanationId: isBecik
      ? `Bulan ${day.javanese.sasi} termasuk bulan baik pada tahun ${day.javanese.tahun} (Betaljemur No. 11).`
      : isAla
        ? `Bulan ${day.javanese.sasi} termasuk bulan pantangan/kurang baik pada tahun ${day.javanese.tahun} (Betaljemur No. 11).`
        : `Bulan ${day.javanese.sasi} termasuk bulan netral pada tahun ${day.javanese.tahun}.`,
  };
}

/**
 * J-13: Larangan Sasi
 */
export function evaluateJ13(day: DayPoint): RuleOutcome {
  const forbiddenMonths = j13Table[day.javanese.tahun] ?? [];
  const sasiNum = day.javanese.sasiIndex + 1;
  const isForbidden = forbiddenMonths.includes(sasiNum);

  return {
    ruleId: 'J-13',
    verdict: isForbidden ? 'fail' : 'pass',
    labelJv: isForbidden ? 'Larangan Sasi' : 'Bebas Larangan Sasi',
    explanationId: isForbidden
      ? `Bulan ${day.javanese.sasi} termasuk larangan bulan pada tahun ${day.javanese.tahun} (Betaljemur No. 13).`
      : `Bulan ${day.javanese.sasi} bebas dari larangan bulan pada tahun ${day.javanese.tahun}.`,
  };
}

/**
 * J-14: Sangaring Tanggal (Varian 4+1)
 */
export function evaluateJ14(day: DayPoint): RuleOutcome {
  const entry = j14Table[day.javanese.sasi];
  if (!entry) {
    return { ruleId: 'J-14', verdict: 'pass', labelJv: 'Bebas Sangar', explanationId: 'Bukan sangaring tanggal.' };
  }

  const isSangarDate = entry.dates.includes(day.javanese.day);
  const isTaliwangkeWeton =
    day.weton.dayIndex === entry.dayIndex && day.weton.pasaranIndex === entry.pasaranIndex;

  if (isSangarDate || isTaliwangkeWeton) {
    return {
      ruleId: 'J-14',
      verdict: 'fail',
      labelJv: isSangarDate ? 'Sangaring Tanggal' : 'Taliwangke Bulanan',
      explanationId: isSangarDate
        ? `Tanggal ${day.javanese.day} bulan ${day.javanese.sasi} termasuk sangaring tanggal (Betaljemur No. 14).`
        : `Weton ${entry.taliwangkeWeton} merupakan taliwangke bulan ${day.javanese.sasi}.`,
    };
  }

  return {
    ruleId: 'J-14',
    verdict: 'pass',
    labelJv: 'Bebas Sangar Tanggal',
    explanationId: 'Bukan sangaring tanggal atau taliwangke bulanan.',
  };
}

/**
 * J-26: Dina Ala (Hari Buruk Bulanan)
 */
export function evaluateJ26(day: DayPoint): RuleOutcome {
  const forbiddenDays = j26Table[day.javanese.sasi] ?? [];
  const isForbidden = forbiddenDays.includes(day.weton.dayIndex);

  return {
    ruleId: 'J-26',
    verdict: isForbidden ? 'fail' : 'pass',
    labelJv: isForbidden ? 'Dina Ala' : 'Bebas Dina Ala',
    explanationId: isForbidden
      ? `Hari dipantangkan dalam bulan ${day.javanese.sasi} berdasarkan Dina Ala (Betaljemur No. 26).`
      : `Hari diperbolehkan dalam bulan ${day.javanese.sasi}.`,
  };
}

/**
 * J-27: Dina Sangaring Asal
 */
export function evaluateJ27(day: DayPoint): RuleOutcome {
  const forbiddenDays = j27Table[day.javanese.sasi] ?? [];
  const isForbidden = forbiddenDays.includes(day.weton.dayIndex);

  return {
    ruleId: 'J-27',
    verdict: isForbidden ? 'fail' : 'pass',
    labelJv: isForbidden ? 'Dina Sangaring Asal' : 'Bebas Sangar Asal',
    explanationId: isForbidden
      ? `Hari dipantangkan dalam bulan ${day.javanese.sasi} berdasarkan Sangaring Asal (Betaljemur No. 27).`
      : `Hari diperbolehkan dalam bulan ${day.javanese.sasi}.`,
  };
}

/**
 * J-28: Na'asing Para Nabi
 */
export function evaluateJ28(day: DayPoint): RuleOutcome {
  const dates = j28Table[day.javanese.sasi] ?? [];
  const isNaas = dates.includes(day.javanese.day);

  return {
    ruleId: 'J-28',
    verdict: isNaas ? 'fail' : 'pass',
    labelJv: isNaas ? "Na'asing Para Nabi" : "Bukan Na'as Nabi",
    explanationId: isNaas
      ? `Tanggal ${day.javanese.day} bulan ${day.javanese.sasi} merupakan Na'asing Para Nabi (Betaljemur No. 28).`
      : 'Bukan tanggal naas para Nabi.',
  };
}

/**
 * J-29: Na'asing Tanggal
 */
export function evaluateJ29(day: DayPoint): RuleOutcome {
  const dates = j29Table[day.javanese.sasi] ?? [];
  const isNaas = dates.includes(day.javanese.day);

  return {
    ruleId: 'J-29',
    verdict: isNaas ? 'fail' : 'pass',
    labelJv: isNaas ? "Na'asing Tanggal" : "Bukan Na'as Tanggal",
    explanationId: isNaas
      ? `Tanggal ${day.javanese.day} bulan ${day.javanese.sasi} merupakan Na'asing Tanggal (Betaljemur No. 29).`
      : 'Bukan naas tanggal.',
  };
}

/**
 * J-30: Sangaring Tanggal (Varian 1)
 */
export function evaluateJ30(day: DayPoint): RuleOutcome {
  const dates = j30Table[day.javanese.sasi] ?? [];
  const isSangar = dates.includes(day.javanese.day);

  return {
    ruleId: 'J-30',
    verdict: isSangar ? 'fail' : 'pass',
    labelJv: isSangar ? 'Sangaring Tanggal' : 'Bebas Sangar',
    explanationId: isSangar
      ? `Tanggal ${day.javanese.day} bulan ${day.javanese.sasi} merupakan Sangaring Tanggal (Betaljemur No. 30).`
      : 'Bukan sangaring tanggal.',
  };
}

/**
 * J-31: Bangas Padewan
 */
export function evaluateJ31(day: DayPoint): RuleOutcome {
  const dates = j31Table[day.javanese.sasi] ?? [];
  const isBangas = dates.includes(day.javanese.day);

  return {
    ruleId: 'J-31',
    verdict: isBangas ? 'fail' : 'pass',
    labelJv: isBangas ? 'Bangas Padéwan' : 'Bebas Bangas Padéwan',
    explanationId: isBangas
      ? `Tanggal ${day.javanese.day} bulan ${day.javanese.sasi} merupakan Bangas Padéwan (Betaljemur No. 31).`
      : 'Bukan bangas padéwan.',
  };
}

/**
 * J-32: Taliwangke Sasi
 */
export function evaluateJ32(day: DayPoint): RuleOutcome {
  const entry = j32Table[day.javanese.sasi];
  const isTaliwangke =
    entry &&
    day.weton.dayIndex === entry.dayIndex &&
    day.weton.pasaranIndex === entry.pasaranIndex;

  return {
    ruleId: 'J-32',
    verdict: isTaliwangke ? 'fail' : 'pass',
    labelJv: isTaliwangke ? 'Taliwangké Sasi' : 'Bebas Taliwangké Sasi',
    explanationId: isTaliwangke
      ? `Hari pasaran ini merupakan taliwangke bulan ${day.javanese.sasi} (Betaljemur No. 32).`
      : 'Bukan taliwangke bulan.',
  };
}

/**
 * J-33: Ala Beciking Sasi Panganten
 */
export function evaluateJ33(day: DayPoint): RuleOutcome {
  const entry = j33Table[day.javanese.sasi] ?? {
    quality: 'sedheng',
    noteJv: 'mubah',
    noteId: 'mubah, diperbolehkan',
  };

  const verdict = entry.quality === 'becik' ? 'pass' : (entry.quality === 'ala' ? 'fail' : 'info');

  return {
    ruleId: 'J-33',
    verdict,
    labelJv: `Sasi ${day.javanese.sasi} (${entry.quality})`,
    explanationId: `Bulan ${day.javanese.sasi}: ${entry.noteId ?? entry.noteJv}`,
  };
}

/**
 * J-34: Pilihan Dina Rupa 3 (Konsensus 3 Tabel)
 * Kaping N: N-th occurrence of weekday in Javanese month (floor((day - 1) / 7) + 1)
 */
export function evaluateJ34(day: DayPoint): RuleOutcome {
  const kaping = Math.floor((day.javanese.day - 1) / 7) + 1;
  const isConsensus = j34List.some(
    (c) => c.dayIndex === day.weton.dayIndex && c.kaping === kaping
  );

  return {
    ruleId: 'J-34',
    verdict: isConsensus ? 'pass' : 'info',
    labelJv: isConsensus ? 'Tumbuk Tibané Padha Becik' : `Kaping ${kaping}`,
    explanationId: isConsensus
      ? `Hari ke-${kaping} dalam bulan ${day.javanese.sasi} merupakan pilihan unggul konsensus 3 tabel (harja/baik).`
      : `Hari ke-${kaping} dalam bulan ${day.javanese.sasi}.`,
  };
}

/**
 * J-35: Sa'at Pasaran (5 Jendela Waktu Pelaksanaan)
 */
export function evaluateJ35(day: DayPoint): readonly SaatEntry[] {
  const ratings = j35Table.ratings[String(day.weton.pasaranIndex)] ?? [];
  return j35Table.windows.map((w, idx) => ({
    start: w.start,
    end: w.end,
    labelJv: ratings[idx] ?? 'Slamet',
  }));
}

/**
 * J-05: Dina Taliwangké Wuku (Betaljemur No. 5, p. 8)
 * 6 pantangan wuku: Somayé (Wuyé), Anggarayang (Wayang), Bodanep (Landep),
 * Warigamis (Warigalit), Sukraingan (Kuningan), Tumpaklote (Kuruwelut).
 */
export function evaluateJ05(day: DayPoint): RuleOutcome {
  const match = j05List.find(
    (e) =>
      e.wuku === day.pawukon.wuku &&
      e.dayIndex === day.weton.dayIndex &&
      e.pasaranIndex === day.weton.pasaranIndex
  );

  return {
    ruleId: 'J-05',
    verdict: match ? 'fail' : 'pass',
    labelJv: match ? `Taliwangké Wuku (${match.wuku})` : 'Bebas Taliwangké Wuku',
    explanationId: match
      ? `Hari pasaran ini merupakan dina taliwangké pada wuku ${match.wuku} (Betaljemur No. 5).`
      : `Bebas dari taliwangké wuku 30.`,
  };
}

/**
 * J-06: Samparwangké Wuku (Betaljemur No. 6, p. 8)
 * 5 pantangan hari Senin: Warigalit (Kliwon), Bala (Legi), Langkir (Pahing), Sinta (Pon), Tambir (Wage).
 */
export function evaluateJ06(day: DayPoint): RuleOutcome {
  const match = j06List.find(
    (e) =>
      e.wuku === day.pawukon.wuku &&
      e.dayIndex === day.weton.dayIndex &&
      e.pasaranIndex === day.weton.pasaranIndex
  );

  return {
    ruleId: 'J-06',
    verdict: match ? 'fail' : 'pass',
    labelJv: match ? `Samparwangké (${match.wuku})` : 'Bebas Samparwangké',
    explanationId: match
      ? `Hari Senin ini merupakan samparwangké pada wuku ${match.wuku} (Betaljemur No. 6).`
      : 'Bebas dari samparwangké wuku.',
  };
}



/**
 * J-36: Sa'at Tanggal (Betaljemur No. 36, p. 25)
 * 5 kelompok tanggal Jawa mod 5 dengan naungan Malaikat/Nabi dan kualitas waktu.
 */
export function evaluateJ36(day: DayPoint): readonly SaatTanggalEntry[] {
  const r = String(day.javanese.day % 5);
  const items = j36Table.ratings[r] ?? j36Table.ratings['1'] ?? [];
  return j36Table.windows.map((w, idx) => {
    const item = items[idx] ?? { angel: 'Akhmad', quality: 'Slamet', verdict: 'pass' as const };
    return {
      start: w.start,
      end: w.end,
      angel: item.angel,
      quality: item.quality,
      verdict: item.verdict,
    };
  });
}
