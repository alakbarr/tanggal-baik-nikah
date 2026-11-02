import {
  HASTAWARA_NAMES,
  SADWARA_NAMES,
  SANGAWARA_NAMES,
  WUKU_NAMES,
} from '../constants/neptu.js';
import type {
  HastawaraName,
  PawukonPosition,
  SadwaraName,
  SangawaraName,
  WukuName,
} from '../types.js';
import { gregorianToJdn } from './jdn.js';
import { mod } from './weton.js';

/**
 * Computes Hastawara (8-day Padewan) for a given Pawukon day in cycle (0..209).
 * Exception: Kala Tiga at days 70..72 (wuku Dunggulan #10).
 * - d <= 70: d mod 8
 * - d == 71, 72: Kala (index 6)
 * - d >= 73: (d - 2) mod 8
 */
export function getHastawara(dayInCycle: number): HastawaraName {
  const d = mod(dayInCycle, 210);
  const idx = d <= 70 ? d % 8 : d <= 72 ? 6 : (d - 2) % 8;
  return (HASTAWARA_NAMES[idx] ?? 'Sri') as HastawaraName;
}

/**
 * Computes Sangawara (9-day Padangon) for a given Pawukon day in cycle (0..209).
 * Exception: Dangu Pat at days 0..3 (wuku Sinta #0).
 * - d <= 3: Dangu (index 0)
 * - d >= 4: (d - 3) mod 9
 */
export function getSangawara(dayInCycle: number): SangawaraName {
  const d = mod(dayInCycle, 210);
  const idx = d <= 3 ? 0 : (d - 3) % 9;
  return (SANGAWARA_NAMES[idx] ?? 'Dangu') as SangawaraName;
}

/**
 * Computes Pawukon 210-day cycle position, Wuku name (30 wuku),
 * Sadwara (6-day Paringkelan), Hastawara (8-day Padewan with Kala Tiga),
 * and Sangawara (9-day Padangon with Dangu Pat) from Julian Day Number (JDN).
 *
 * Formulas:
 * - Day in cycle: d = (JDN - 146) mod 210 (d=0 is Sunday of wuku Sinta)
 * - Wuku index: floor(d / 7) (0=Sinta, ..., 29=Watugunung)
 * - Sadwara: d mod 6 (0=Tungle, 1=Aryang, ..., 5=Mawulu)
 */
export function getPawukonFromJdn(jdn: number): PawukonPosition {
  const dayInCycle = mod(jdn - 146, 210);
  const wukuIndex = Math.floor(dayInCycle / 7);
  const wuku = (WUKU_NAMES[wukuIndex] ?? 'Sinta') as WukuName;
  const sadwara = (SADWARA_NAMES[mod(dayInCycle, 6)] ?? 'Tungle') as SadwaraName;
  const hastawara = getHastawara(dayInCycle);
  const sangawara = getSangawara(dayInCycle);

  return {
    dayInCycle,
    wukuIndex,
    wuku,
    sadwara,
    hastawara,
    sangawara,
  };
}

/**
 * Computes Pawukon position directly from a Gregorian date.
 */
export function getPawukonFromGregorian(
  year: number,
  month: number,
  day: number
): PawukonPosition {
  const jdn = gregorianToJdn(year, month, day);
  return getPawukonFromJdn(jdn);
}
