import kemenagData from '../data/hijri/kemenag.json' with { type: 'json' };
import khgtData from '../data/hijri/khgt.json' with { type: 'json' };
import type { HijriAuthority, HijriBasis, HijriDate } from '../types.js';

interface HijriRecord {
  readonly year: number;
  readonly month: number;
  readonly startJdn: number;
  readonly authority: string;
  readonly basis: string;
}

const KEMENAG_RECORDS: readonly HijriRecord[] = kemenagData as readonly HijriRecord[];
const KHGT_RECORDS: readonly HijriRecord[] = khgtData as readonly HijriRecord[];

/**
 * Looks up the Hijri date from Julian Day Number (JDN) for a specific authority.
 *
 * @param jdn Julian Day Number
 * @param authority 'kemenag' or 'khgt'
 */
export function getHijriDate(jdn: number, authority: HijriAuthority = 'kemenag'): HijriDate | null {
  const records = authority === 'kemenag' ? KEMENAG_RECORDS : KHGT_RECORDS;

  if (records.length === 0) {
    return null;
  }

  const first = records[0];
  const last = records[records.length - 1];

  if (!first || !last || jdn < first.startJdn) {
    return null;
  }

  for (let i = 0; i < records.length; i++) {
    const current = records[i];
    if (!current) continue;

    const next = records[i + 1];

    if (next) {
      if (jdn >= current.startJdn && jdn < next.startJdn) {
        return {
          year: current.year,
          month: current.month,
          day: jdn - current.startJdn + 1,
          authority,
          basis: current.basis as HijriBasis,
        };
      }
    } else {
      // Last recorded month: assume standard max 30-day window
      if (jdn >= current.startJdn && jdn < current.startJdn + 30) {
        return {
          year: current.year,
          month: current.month,
          day: jdn - current.startJdn + 1,
          authority,
          basis: current.basis as HijriBasis,
        };
      }
    }
  }

  return null;
}

/**
 * Returns Hijri dates for both Kemenag and KHGT authorities for a given day.
 */
export function getHijriDatesForDay(jdn: number): {
  readonly kemenag: HijriDate | null;
  readonly khgt: HijriDate | null;
} {
  return {
    kemenag: getHijriDate(jdn, 'kemenag'),
    khgt: getHijriDate(jdn, 'khgt'),
  };
}
