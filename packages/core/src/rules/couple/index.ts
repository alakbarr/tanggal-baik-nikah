import b01Data from '../../data/primbon/b01_pegat_pesthi.json' with { type: 'json' };
import j15Data from '../../data/primbon/j15_pasatohan.json' with { type: 'json' };
import j16Data from '../../data/primbon/j16_mod4.json' with { type: 'json' };
import j17Data from '../../data/primbon/j17_saptawara_pairs.json' with { type: 'json' };
import j22Data from '../../data/primbon/j22_pancasuda.json' with { type: 'json' };
import j23Data from '../../data/primbon/j23_mod5.json' with { type: 'json' };
import { SAPTAWARA_NAMES } from '../../constants/neptu.js';
import type { RuleOutcome, SaptawaraIndex } from '../../types.js';

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
    explanationId: `(${groomNeptu} + ${brideNeptu}) mod 4 = ${r} (${sisaDesc}) -> ${entry.name ?? ''} (${entry.meaningId ?? entry.meaningJv ?? ''})`,
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
    explanationId: `Kombinasi hari ${labelJv} [${entry.meaningJv ?? 'sedheng'}]: ${entry.meaningId ?? 'sedang dan cukup'}`,
  };
}

/**
 * J-22: Pancasuda Penganten (Betaljemur No. 22, p. 17)
 * Formula: (groomNeptu + brideNeptu + 10) mod 7
 */
export function evaluateJ22(groomNeptu: number, brideNeptu: number): RuleOutcome {
  const sum = groomNeptu + brideNeptu + 10;
  const r = sum % 7;
  const entry = j22Table[String(r)] ?? {
    name: 'Bale Kedhawang',
    meaningJv: 'rahayu',
    meaningId: 'selamat, tenteram, dan sejahtera',
    verdict: 'pass' as const,
  };

  const sisaDesc = r === 0 ? 'habis (jatuh ke-7)' : `sisa ${r}`;
  return {
    ruleId: 'J-22',
    verdict: entry.verdict,
    labelJv: entry.name ?? 'Pancasuda',
    explanationId: `(${groomNeptu} + ${brideNeptu} + 10) mod 7 = ${r} (${sisaDesc}) -> ${entry.name ?? ''} (${entry.meaningId ?? entry.meaningJv ?? ''})`,
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
    explanationId: `(${groomNeptu} + ${brideNeptu}) mod 5 = ${r} (${sisaDesc}) -> ${entry.name ?? ''} (${entry.meaningId ?? entry.meaningJv ?? ''})`,
  };
}
