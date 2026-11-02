import { NEPTU_DAY, NEPTU_PASARAN, PANCAWARA_NAMES, SAPTAWARA_NAMES } from '../constants/neptu.js';
import type { PancawaraIndex, RuleOutcome, SaptawaraIndex, Weton } from '../types.js';
import { mod } from '../calendar/weton.js';

/**
 * U-01: Pati Ternary Wedding Day Selection Rule
 * Formula: (coupleNeptu + weddingDayNeptu) mod 3 == 2
 * Source: Skripsi FIB Undip (Bayu Candra Setiaji / Manuskrip Desa Kropak, Winong, Pati)
 */
export function evaluateU01(coupleNeptu: number, weddingDayNeptu: number): RuleOutcome {
  const sum = coupleNeptu + weddingDayNeptu;
  const r = sum % 3;
  const isPass = r === 2;

  return {
    ruleId: 'U-01',
    verdict: isPass ? 'pass' : 'fail',
    labelJv: isPass ? 'Gathuk (Langgeng)' : `Sisa ${r}`,
    explanationId: isPass
      ? `(${coupleNeptu} + ${weddingDayNeptu}) mod 3 = 2. Memenuhi kaidah gathuk tradisi Pesisiran Pati.`
      : `(${coupleNeptu} + ${weddingDayNeptu}) mod 3 = ${r}. Tidak memenuhi sisa 2 tradisi Pesisiran Pati.`,
  };
}

/**
 * Calculates the Dina Pengapesan of a person.
 * Count `birthNeptu` days inclusively starting from the birth weton.
 * (birthIndex + birthNeptu - 1)
 */
export function calculateDinaPengapesan(birthWeton: Weton): Weton {
  const offset = birthWeton.neptu - 1;
  const dayIndex = mod(birthWeton.dayIndex + offset, 7) as SaptawaraIndex;
  const pasaranIndex = mod(birthWeton.pasaranIndex + offset, 5) as PancawaraIndex;
  const neptu = (NEPTU_DAY[dayIndex] ?? 0) + (NEPTU_PASARAN[pasaranIndex] ?? 0);

  return {
    dayIndex,
    pasaranIndex,
    neptu,
  };
}

function wetonEquals(w1: Weton, w2: Weton): boolean {
  return w1.dayIndex === w2.dayIndex && w1.pasaranIndex === w2.pasaranIndex;
}

function formatWetonName(w: Weton): string {
  return `${SAPTAWARA_NAMES[w.dayIndex] ?? ''} ${PANCAWARA_NAMES[w.pasaranIndex] ?? ''}`;
}

/**
 * U-02: Pantangan Weton Calon Penganten
 * The wedding day must not fall on the groom's or bride's birth weton.
 */
export function evaluateU02(
  weddingWeton: Weton,
  groomWeton: Weton,
  brideWeton: Weton
): RuleOutcome {
  const matchesGroom = wetonEquals(weddingWeton, groomWeton);
  const matchesBride = wetonEquals(weddingWeton, brideWeton);
  const isFail = matchesGroom || matchesBride;

  return {
    ruleId: 'U-02',
    verdict: isFail ? 'fail' : 'pass',
    labelJv: isFail ? 'Weton Penganten' : 'Bukan Weton Penganten',
    explanationId: isFail
      ? `Hari akad bertepatan dengan weton kelahiran mempelai (${formatWetonName(weddingWeton)}).`
      : 'Bukan weton kelahiran calon mempelai.',
  };
}

/**
 * U-03: Pantangan Weton Orang Tua Kandung
 */
export function evaluateU03(
  weddingWeton: Weton,
  parentsBirthWetons: readonly Weton[]
): RuleOutcome {
  const matched = parentsBirthWetons.find((w) => wetonEquals(weddingWeton, w));

  return {
    ruleId: 'U-03',
    verdict: matched ? 'fail' : 'pass',
    labelJv: matched ? 'Weton Wong Tuwa' : 'Bukan Weton Wong Tuwa',
    explanationId: matched
      ? `Hari akad bertepatan dengan weton orang tua kandung (${formatWetonName(matched)}).`
      : 'Bukan weton kelahiran orang tua kandung.',
  };
}

/**
 * U-04: Pantangan Dina Geblak Orang Tua
 */
export function evaluateU04(
  weddingWeton: Weton,
  geblakWetons: readonly Weton[]
): RuleOutcome {
  const matched = geblakWetons.find((w) => wetonEquals(weddingWeton, w));

  return {
    ruleId: 'U-04',
    verdict: matched ? 'fail' : 'pass',
    labelJv: matched ? 'Dina Geblak' : 'Bukan Dina Geblak',
    explanationId: matched
      ? `Hari akad bertepatan dengan hari geblak wafatnya orang tua (${formatWetonName(matched)}).`
      : 'Bukan hari geblak orang tua.',
  };
}

/**
 * U-05: Pantangan Dina Pengapesan
 */
export function evaluateU05(
  weddingWeton: Weton,
  personBirthWeton: Weton
): RuleOutcome {
  const pengapesan = calculateDinaPengapesan(personBirthWeton);
  const isFail = wetonEquals(weddingWeton, pengapesan);

  return {
    ruleId: 'U-05',
    verdict: isFail ? 'fail' : 'pass',
    labelJv: isFail ? 'Dina Pengapesan' : 'Bukan Pengapesan',
    explanationId: isFail
      ? `Hari akad bertepatan dengan dina pengapesan (${formatWetonName(pengapesan)}).`
      : 'Bukan dina pengapesan.',
  };
}
