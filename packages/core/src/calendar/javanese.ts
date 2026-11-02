import { SASI_JAWA_NAMES, TAHUN_WINDU_NAMES } from '../constants/neptu.js';
import { CalendarRangeError } from '../errors.js';
import type { JavaneseDate, JavaneseReckoning, KurupName } from '../types.js';
import { gregorianToJdn } from './jdn.js';
import { mod } from './weton.js';

export const ABOGE_EPOCH_JDN = 2385728; // 1 Sura 1747 Alip (1819-10-20)
export const ASAPON_EPOCH_JDN = 2428252; // 1 Sura 1867 Alip (1936-03-24)
export const ANENHING_EPOCH_JDN = 2470776; // 1 Sura 1987 Alip (2052-08-26)

export const YEAR_LENGTHS: readonly [number, number, number, number, number, number, number, number] =
  Object.freeze([354, 355, 354, 354, 355, 354, 354, 355]); // Alip..Jimakir (Ehe, Dal, Jimakir long)

/**
 * Converts a Julian Day Number (JDN) to a Javanese calendar date.
 *
 * @param jdn Julian Day Number
 * @param reckoning 'kurup' (official Sultan Agungan with 120-year gugur sedina) or 'aboge' (community)
 */
export function jdnToJavanese(jdn: number, reckoning: JavaneseReckoning = 'kurup'): JavaneseDate {
  if (jdn < ABOGE_EPOCH_JDN) {
    throw new CalendarRangeError(jdn);
  }

  let year: number;
  let currStart: number;
  let kurup: KurupName;
  let epochYear: number;
  const isKurupReckoning = reckoning === 'kurup';

  if (!isKurupReckoning) {
    kurup = 'Aboge';
    year = 1747;
    currStart = ABOGE_EPOCH_JDN;
    epochYear = 1747;
  } else if (jdn < ASAPON_EPOCH_JDN) {
    kurup = 'Aboge';
    year = 1747;
    currStart = ABOGE_EPOCH_JDN;
    epochYear = 1747;
  } else if (jdn < ANENHING_EPOCH_JDN) {
    kurup = 'Asapon';
    year = 1867;
    currStart = ASAPON_EPOCH_JDN;
    epochYear = 1867;
  } else {
    kurup = 'Anenhing';
    year = 1987;
    currStart = ANENHING_EPOCH_JDN;
    epochYear = 1987;
  }

  let yearLen = 354;

  while (true) {
    const winduIndex = mod(year - 1867, 8);
    yearLen = YEAR_LENGTHS[winduIndex] ?? 354;

    if (isKurupReckoning && (year - epochYear + 1) % 120 === 0) {
      // 120th year of this kurup drops 1 leap day (gugur sedina)
      yearLen -= 1;
    }

    if (jdn < currStart + yearLen) {
      break;
    }

    currStart += yearLen;
    year += 1;
  }

  let doy = jdn - currStart;
  const isLongYear = yearLen === 355;

  for (let m = 0; m < 12; m++) {
    let monthLen = m % 2 === 0 ? 30 : 29;
    if (m === 11 && isLongYear) {
      monthLen = 30;
    }

    if (doy < monthLen) {
      const sasi = SASI_JAWA_NAMES[m] ?? 'Sura';
      const tahun = TAHUN_WINDU_NAMES[mod(year - 1867, 8)] ?? 'Alip';
      return {
        day: doy + 1,
        sasi,
        sasiIndex: m,
        year,
        tahun,
        kurup,
        isLongYear,
      };
    }

    doy -= monthLen;
  }

  // Fallback (unreachable with valid yearLen)
  return {
    day: 1,
    sasi: 'Sura',
    sasiIndex: 0,
    year,
    tahun: TAHUN_WINDU_NAMES[mod(year - 1867, 8)] ?? 'Alip',
    kurup,
    isLongYear,
  };
}

/**
 * Computes Javanese calendar date directly from Gregorian year, month, and day.
 */
export function getJavaneseDate(
  year: number,
  month: number,
  day: number,
  reckoning: JavaneseReckoning = 'kurup'
): JavaneseDate {
  const jdn = gregorianToJdn(year, month, day);
  return jdnToJavanese(jdn, reckoning);
}
