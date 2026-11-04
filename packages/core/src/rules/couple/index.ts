import b01Data from '../../data/primbon/b01_pegat_pesthi.json' with { type: 'json' };
import b02Data from '../../data/primbon/b02_bale_kedhawang.json' with { type: 'json' };
import j15Data from '../../data/primbon/j15_pasatohan.json' with { type: 'json' };
import j16Data from '../../data/primbon/j16_mod4.json' with { type: 'json' };
import j17Data from '../../data/primbon/j17_saptawara_pairs.json' with { type: 'json' };
import j22Data from '../../data/primbon/j22_pancasuda.json' with { type: 'json' };
import j23Data from '../../data/primbon/j23_mod5.json' with { type: 'json' };
import {
  NEPTU_SASI_JAWA,
  NEPTU_TAHUN_WINDU,
  SAPTAWARA_NAMES,
} from '../../constants/neptu.js';
import type {
  CulturalTabooAnalysis,
  JavaneseDate,
  RuleOutcome,
  SaptawaraIndex,
  Weton,
} from '../../types.js';

interface B01Entry {
  readonly sum: number;
  readonly remainderMod9: number;
  readonly category: string;
  readonly descriptionJv: string;
  readonly descriptionId?: string;
  readonly verdict: 'pass' | 'fail' | 'info';
}

interface MeaningEntry {
  readonly name?: string;
  readonly meaningJv?: string;
  readonly meaningId?: string;
  readonly verdict: 'pass' | 'fail' | 'info';
}

const b01Table = b01Data as unknown as Record<string, B01Entry>;
const b02Table = b02Data as unknown as Record<string, MeaningEntry>;
const j15Table = j15Data as unknown as Record<string, MeaningEntry>;
const j16Table = j16Data as unknown as Record<string, MeaningEntry>;
const j17Table = j17Data as unknown as Record<string, MeaningEntry>;
const j22Table = j22Data as unknown as Record<string, MeaningEntry>;
const j23Table = j23Data as unknown as Record<string, MeaningEntry>;

/**
 * B-01: Popular 8-category couple rule (mod 9)
 * Formula: (groomNeptu + brideNeptu) mod 9 -> Pegat..Pesthi
 */
export function evaluateB01(groomNeptu: number, brideNeptu: number): RuleOutcome {
  const sum = groomNeptu + brideNeptu;
  const r = sum % 9;
  const entry = b01Table[String(sum)] ?? {
    sum,
    remainderMod9: r,
    category: 'Pegat',
    descriptionJv: 'Asil petungan ora kacathet.',
    descriptionId: 'Hasil perhitungan tidak tercatat.',
    verdict: 'info' as const,
  };

  const sisaDesc = r === 0 ? 'habis (jatuh ke-9)' : `sisa ${r}`;
  return {
    ruleId: 'B-01',
    verdict: entry.verdict,
    labelJv: entry.category,
    explanationId: `(Neptu ${groomNeptu} + ${brideNeptu} = ${sum}) ${sum} mod 9 = ${r} (${sisaDesc}) -> ${entry.category}. ${entry.descriptionId ?? entry.descriptionJv}`,
  };
}

/**
 * B-02: Popular 7-category couple rule (mod 7 Bale Kedhawang)
 * Formula: (groomNeptu + brideNeptu) mod 7 -> Pisang Pinanggel..Bale Kedhawang
 */
export function evaluateB02(groomNeptu: number, brideNeptu: number): RuleOutcome {
  const sum = groomNeptu + brideNeptu;
  const r = sum % 7;
  const entry = b02Table[String(r)] ?? b02Table['0'] ?? {
    name: 'Bale Kedhawang',
    meaningJv: 'rahayu',
    meaningId: 'selamat dan bahagia',
    verdict: 'pass' as const,
  };

  const sisaDesc = r === 0 ? 'habis (jatuh ke-7)' : `sisa ${r}`;
  return {
    ruleId: 'B-02',
    verdict: entry.verdict,
    labelJv: entry.name ?? 'Bale Kedhawang',
    explanationId: `(Neptu ${groomNeptu} + ${brideNeptu} = ${sum}) mod 7 = ${r} (${sisaDesc}) -> ${entry.name ?? ''}. ${entry.meaningId ?? entry.meaningJv ?? ''}`,
  };
}

/**
 * J-15: Pasatohan 9x9 (Betaljemur No. 15, pp. 12-13)
 * Coordinate: (groomNeptu mod 9, brideNeptu mod 9) where 0 -> 9
 */
export function evaluateJ15(groomNeptu: number, brideNeptu: number): RuleOutcome {
  const mGroom = groomNeptu % 9 === 0 ? 9 : groomNeptu % 9;
  const mBride = brideNeptu % 9 === 0 ? 9 : brideNeptu % 9;
  const key = `${mGroom},${mBride}`;
  const entry = j15Table[key] ?? {
    meaningJv: 'sedheng',
    meaningId: 'sedang dan cukup',
    verdict: 'info' as const,
  };

  return {
    ruleId: 'J-15',
    verdict: entry.verdict,
    labelJv: `${mGroom}, ${mBride}`,
    explanationId: `Koordinat pasatohan (${mGroom}, ${mBride}) [${entry.meaningJv ?? 'sedheng'}]: ${entry.meaningId ?? 'sedang dan cukup'}`,
  };
}

/**
 * J-16: Modulo 4 (Betaljemur No. 16, p. 13)
 * Formula: (groomNeptu + brideNeptu) mod 4 -> Gendheng, Gembili, Sri, Punggel
 */
export function evaluateJ16(groomNeptu: number, brideNeptu: number): RuleOutcome {
  const sum = groomNeptu + brideNeptu;
  const r = sum % 4;
  const entry = j16Table[String(r)] ?? {
    name: 'Punggel',
    meaningJv: 'mati salah siji',
    meaningId: 'berisiko kehilangan salah satu pasangan',
    verdict: 'fail' as const,
  };

  const sisaDesc = r === 0 ? 'habis (jatuh ke-4)' : `sisa ${r}`;
  return {
    ruleId: 'J-16',
    verdict: entry.verdict,
    labelJv: entry.name ?? 'Punggel',
    explanationId: `(${groomNeptu} + ${brideNeptu} = ${sum}) mod 4 = ${r} (${sisaDesc}) -> ${entry.name ?? ''} (${entry.meaningId ?? entry.meaningJv ?? ''})`,
  };
}

/**
 * J-17: Saptawara Day Pairs (Betaljemur No. 17, p. 13)
 * 28 combinations of bride and groom birth weekdays
 */
export function evaluateJ17(
  groomDayIndex: SaptawaraIndex,
  brideDayIndex: SaptawaraIndex
): RuleOutcome {
  const key = `${groomDayIndex},${brideDayIndex}`;
  const entry = j17Table[key] ?? {
    meaningJv: 'sedheng',
    meaningId: 'sedang dan cukup',
    verdict: 'info' as const,
  };

  const day1 = SAPTAWARA_NAMES[groomDayIndex] ?? '';
  const day2 = SAPTAWARA_NAMES[brideDayIndex] ?? '';
  const labelJv = `${day1} & ${day2}`;

  return {
    ruleId: 'J-17',
    verdict: entry.verdict,
    labelJv,
    explanationId: `Kombinasi hari lahir ${labelJv} [${entry.meaningJv ?? 'sedheng'}]: ${entry.meaningId ?? 'sedang dan cukup'}`,
  };
}

/**
 * J-22: Pancasuda Salaki Rabi (Betaljemur No. 22, p. 17)
 * Formula: Jumlah neptu dibagi 10. Jika sisa > 7 atau sisa 0, dibagi 7.
 * 1 Wasésasegara, 2 Tunggaksemi, 3 Satriya Wibawa, 4 Sumursinaba, 5 Satriyawirang, 6 Bumikapetak, 7 Lebu Katiup Angin.
 */
export function evaluateJ22(groomNeptu: number, brideNeptu: number): RuleOutcome {
  const sum = groomNeptu + brideNeptu;
  let r = sum % 10;
  let divisor = 10;
  if (r > 7 || r === 0) {
    divisor = 7;
    r = sum % 7 === 0 ? 7 : sum % 7;
  }
  const entry = j22Table[String(r)] ?? {
    name: 'Wasésasegara',
    meaningJv: 'rahayu',
    meaningId: 'lapang hati dan sejahtera',
    verdict: 'pass' as const,
  };

  return {
    ruleId: 'J-22',
    verdict: entry.verdict,
    labelJv: entry.name ?? 'Wasésasegara',
    explanationId: `(${groomNeptu} + ${brideNeptu} = ${sum}) dibagi ${divisor} sisa ${r} -> ${entry.name ?? ''}. ${entry.meaningId ?? entry.meaningJv ?? ''}`,
  };
}

/**
 * J-23: Modulo 5 (Betaljemur No. 23, p. 17)
 * Formula: (groomNeptu + brideNeptu) mod 5 -> Sri, Lungguh, Gedhong, Lara, Pati
 */
export function evaluateJ23(groomNeptu: number, brideNeptu: number): RuleOutcome {
  const sum = groomNeptu + brideNeptu;
  const r = sum % 5;
  const entry = j23Table[String(r)] ?? {
    name: 'Pati',
    meaningJv: 'mati salah siji',
    meaningId: 'berisiko duka atau perpisahan',
    verdict: 'fail' as const,
  };

  const sisaDesc = r === 0 ? 'habis (jatuh ke-5)' : `sisa ${r}`;
  return {
    ruleId: 'J-23',
    verdict: entry.verdict,
    labelJv: entry.name ?? 'Pati',
    explanationId: `(${groomNeptu} + ${brideNeptu} = ${sum}) mod 5 = ${r} (${sisaDesc}) -> ${entry.name ?? ''} (${entry.meaningId ?? entry.meaningJv ?? ''})`,
  };
}

/**
 * J-24: Koordinat Tanggal Lahir Jawa Modulo 9 (Betaljemur No. 24, p. 18)
 * Sum of (neptu hari + neptu pasaran + neptu sasi + tanggal Jawa + neptu tahun) for both spouses mod 9.
 * 1, 4, 7 -> Wali (kurang baik)
 * 2, 5, 8 -> Panghulu (sedang)
 * 3, 6, 9 -> Panganten (baik)
 */
export function evaluateJ24(
  groomWeton: Weton,
  groomJav: JavaneseDate,
  brideWeton: Weton,
  brideJav: JavaneseDate
): RuleOutcome {
  const gCoord =
    groomWeton.neptu +
    (NEPTU_SASI_JAWA[groomJav.sasi] ?? 0) +
    groomJav.day +
    (NEPTU_TAHUN_WINDU[groomJav.tahun] ?? 0);
  const bCoord =
    brideWeton.neptu +
    (NEPTU_SASI_JAWA[brideJav.sasi] ?? 0) +
    brideJav.day +
    (NEPTU_TAHUN_WINDU[brideJav.tahun] ?? 0);
  const total = gCoord + bCoord;
  const r = total % 9 === 0 ? 9 : total % 9;

  let labelJv = 'Pangantèn';
  let meaningId = 'baik dan harmonis bagi calon pengantin';
  let verdict: 'pass' | 'fail' | 'info' = 'pass';

  if (r === 1 || r === 4 || r === 7) {
    labelJv = 'Wali';
    meaningId = 'jatuh pada hitungan Wali (kurang diutamakan)';
    verdict = 'fail';
  } else if (r === 2 || r === 5 || r === 8) {
    labelJv = 'Panghulu';
    meaningId = 'jatuh pada hitungan Penghulu (sedang/cukup)';
    verdict = 'info';
  }

  return {
    ruleId: 'J-24',
    verdict,
    labelJv,
    explanationId: `Koordinat lahir Jawa (${gCoord} + ${bCoord} = ${total}) mod 9 = ${r} -> ${labelJv} (${meaningId}).`,
  };
}

/**
 * J-25: Koordinat Tanggal Lahir Jawa Modulo 3 (Betaljemur No. 25, p. 18)
 * Sum of coordinates mod 3: 1 Begja (baik), 2 Lara (kurang baik), 3 Pati (kurang baik).
 */
export function evaluateJ25(
  groomWeton: Weton,
  groomJav: JavaneseDate,
  brideWeton: Weton,
  brideJav: JavaneseDate
): RuleOutcome {
  const gCoord =
    groomWeton.neptu +
    (NEPTU_SASI_JAWA[groomJav.sasi] ?? 0) +
    groomJav.day +
    (NEPTU_TAHUN_WINDU[groomJav.tahun] ?? 0);
  const bCoord =
    brideWeton.neptu +
    (NEPTU_SASI_JAWA[brideJav.sasi] ?? 0) +
    brideJav.day +
    (NEPTU_TAHUN_WINDU[brideJav.tahun] ?? 0);
  const total = gCoord + bCoord;
  const r = total % 3 === 0 ? 3 : total % 3;

  let labelJv = 'Begja';
  let meaningId = 'memperoleh keberuntungan dan keselamatan';
  let verdict: 'pass' | 'fail' | 'info' = 'pass';

  if (r === 2) {
    labelJv = 'Lara';
    meaningId = 'menghadapi cobaan kesehatan atau rintangan';
    verdict = 'fail';
  } else if (r === 3) {
    labelJv = 'Pati';
    meaningId = 'memerlukan kehati-hatian ekstra dan doa kelanggengan';
    verdict = 'fail';
  }

  return {
    ruleId: 'J-25',
    verdict,
    labelJv,
    explanationId: `Koordinat lahir Jawa (${gCoord} + ${bCoord} = ${total}) mod 3 = ${r} -> ${labelJv} (${meaningId}).`,
  };
}



/**
 * Analyzes common cultural marriage taboos:
 * - Gehing: Wage ketemu Pahing
 * - Jilu: Anak pertama menikah dengan anak ketiga
 * - Tunggal Weton: Hari dan pasaran kedua mempelai sama persis
 */
export function evaluateCulturalTaboos(
  groomWeton: Weton,
  brideWeton: Weton,
  groomChildOrder?: number,
  brideChildOrder?: number
): CulturalTabooAnalysis[] {
  const analyses: CulturalTabooAnalysis[] = [];

  // 1. Gehing (Wage ketemu Pahing)
  const isGehing =
    (groomWeton.pasaranIndex === 3 && brideWeton.pasaranIndex === 1) ||
    (groomWeton.pasaranIndex === 1 && brideWeton.pasaranIndex === 3);

  analyses.push({
    id: 'gehing',
    name: 'Gehing (Wage ketemu Pahing)',
    isTriggered: isGehing,
    adatView:
      'Dalam mitos sebagian masyarakat Jawa, pertemuan pasaran Wage (air/utara) dan Pahing (api/selatan) dikhawatirkan sering memicu perselisihan watak.',
    fiqhView:
      'Syariat Islam menegaskan tidak ada hari atau pasaran pembawa sial (anti-tathayyur). Perbedaan karakter disikapi dengan saling pengertian dan takwa.',
    advice:
      isGehing
        ? 'Bila keluarga mengkhawatirkan hal ini, tradisi menganjurkan ikhtiar musyawarah dengan memprioritaskan hari akad yang tenteram serta memperbanyak sedekah.'
        : 'Tidak ada pantangan pasaran Gehing pada pasangan Anda.',
  });

  // 2. Jilu (Anak ke-1 & Anak ke-3)
  const hasChildOrderData =
    typeof groomChildOrder === 'number' && typeof brideChildOrder === 'number';
  const isJilu =
    hasChildOrderData &&
    ((groomChildOrder === 1 && brideChildOrder === 3) ||
      (groomChildOrder === 3 && brideChildOrder === 1));

  let jiluAdvice = '';
  if (!hasChildOrderData) {
    jiluAdvice =
      'Data urutan kelahiran anak belum diisi pada formulir. Silakan pilih urutan kelahiran calon pengantin jika keluarga menghendaki peninjauan pantangan Jilu (anak ke-1 & ke-3).';
  } else if (isJilu) {
    jiluAdvice =
      'Terdeteksi kombinasi anak sulung (ke-1) dan anak ke-3 (siji karo telu). Syariat Islam menegaskan pernikahan ini sah dan halal mutlak. Secara adat Jawa, dapat diselaraskan melalui rembug keluarga dengan saling memahami peran dan kedewasaan.';
  } else {
    jiluAdvice = `Bukan kombinasi anak ke-1 dan ke-3 (Pria anak ke-${groomChildOrder}, Wanita anak ke-${brideChildOrder}). Bebas dari pantangan urutan kelahiran Jilu.`;
  }

  analyses.push({
    id: 'jilu',
    name: 'Jilu (Anak ke-1 & Anak ke-3)',
    isTriggered: Boolean(isJilu),
    isApplicable: hasChildOrderData,
    adatView:
      'Sebagian adat tradisi Jawa menghindari pernikahan antara anak sulung (ke-1) dan anak ke-3 (siji karo telu) karena khawatir terjadi ketimpangan kedewasaan.',
    fiqhView:
      'Islam membolehkan pernikahan tanpa membedakan urutan kelahiran anak. Kunci keharmonisan adalah kesiapan memimpin, saling menghormati, dan ketakwaan.',
    advice: jiluAdvice,
  });

  // 3. Tunggal Weton (Weton Sama Persis)
  const isTunggalWeton =
    groomWeton.dayIndex === brideWeton.dayIndex &&
    groomWeton.pasaranIndex === brideWeton.pasaranIndex;

  analyses.push({
    id: 'tunggal_weton',
    name: 'Tunggal Weton (Hari & Pasaran Sama)',
    isTriggered: isTunggalWeton,
    adatView:
      'Weton kelahiran yang persis sama dipandang memiliki frekuensi watak serupa yang bisa sangat rukun atau sebaliknya sama-sama keras kepala.',
    fiqhView:
      'Kesamaan watak justru menjadi modal saling memahami bila dibarengi akhlak mulia dan kesabaran.',
    advice:
      isTunggalWeton
        ? 'Kedua mempelai dianjurkan saling mengalah saat menghadapi perbedaan pendapat.'
        : 'Kedua mempelai memiliki weton yang berbeda.',
  });

  return analyses;
}
