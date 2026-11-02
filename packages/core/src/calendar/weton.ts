import {
  NEPTU_DAY,
  NEPTU_PASARAN,
  PANCAWARA_NAMES,
  SAPTAWARA_NAMES,
} from '../constants/neptu.js';
import type { PancawaraIndex, SaptawaraIndex, Weton } from '../types.js';
import { gregorianToJdn } from './jdn.js';

/**
 * Standard non-negative modulo helper.
 */
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/**
 * Computes weton (Saptawara, Pancawara, and Neptu) from Julian Day Number (JDN).
 *
 * Fliegel-Van Flandern alignment:
 * - dayIndex: (JDN + 1) mod 7 (0=Ahad, 1=Senin, ..., 6=Sabtu)
 * - pasaranIndex: JDN mod 5 (0=Legi, 1=Pahing, 2=Pon, 3=Wage, 4=Kliwon)
 */
export function getWetonFromJdn(jdn: number): Weton {
  const dayIndex = mod(jdn + 1, 7) as SaptawaraIndex;
  const pasaranIndex = mod(jdn, 5) as PancawaraIndex;
  const dayNeptu = NEPTU_DAY[dayIndex] ?? 0;
  const pasaranNeptu = NEPTU_PASARAN[pasaranIndex] ?? 0;
  const neptu = dayNeptu + pasaranNeptu;

  return {
    dayIndex,
    pasaranIndex,
    neptu,
    dayName: SAPTAWARA_NAMES[dayIndex]!,
    pasaranName: PANCAWARA_NAMES[pasaranIndex]!,
  };
}

/**
 * Computes weton directly from a Gregorian date.
 */
export function getWetonFromGregorian(year: number, month: number, day: number): Weton {
  const jdn = gregorianToJdn(year, month, day);
  return getWetonFromJdn(jdn);
}

/**
 * Formats a weton into a human-readable string (e.g. "Jumat Legi").
 */
export function formatWeton(weton: Weton): string {
  const dayName = SAPTAWARA_NAMES[weton.dayIndex] ?? '';
  const pasaranName = PANCAWARA_NAMES[weton.pasaranIndex] ?? '';
  return `${dayName} ${pasaranName}`;
}
