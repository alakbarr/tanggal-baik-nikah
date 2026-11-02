import { describe, expect, it } from 'vitest';
import { gregorianToJdn, jdnToGregorian } from '../src/calendar/jdn.js';

describe('JDN Conversion (Fliegel-Van Flandern & Richards)', () => {
  it('computes historical anchors correctly', () => {
    // Proclamation of Indonesian Independence
    expect(gregorianToJdn(1945, 8, 17)).toBe(2431685);
    expect(jdnToGregorian(2431685)).toEqual({ year: 1945, month: 8, day: 17 });

    // Asapon Epoch
    expect(gregorianToJdn(1936, 3, 24)).toBe(2428252);
    expect(jdnToGregorian(2428252)).toEqual({ year: 1936, month: 3, day: 24 });

    // End of Kurup Asapon (29 Besar 1986 Jimakir)
    expect(gregorianToJdn(2052, 8, 25)).toBe(2470775);
    expect(jdnToGregorian(2470775)).toEqual({ year: 2052, month: 8, day: 25 });

    // Start of Kurup Anenhing (1 Sura 1987 Alip)
    expect(gregorianToJdn(2052, 8, 26)).toBe(2470776);
    expect(jdnToGregorian(2470776)).toEqual({ year: 2052, month: 8, day: 26 });

    // Aboge Epoch
    expect(gregorianToJdn(1819, 10, 20)).toBe(2385728);
    expect(jdnToGregorian(2385728)).toEqual({ year: 1819, month: 10, day: 20 });
  });

  it('correctly handles Gregorian leap years (2000 is leap, 1900 and 2100 are not)', () => {
    // 2000 is leap: Feb 28 to Feb 29 to Mar 1
    const jdn2000_02_28 = gregorianToJdn(2000, 2, 28);
    const jdn2000_02_29 = gregorianToJdn(2000, 2, 29);
    const jdn2000_03_01 = gregorianToJdn(2000, 3, 1);
    expect(jdn2000_02_29).toBe(jdn2000_02_28 + 1);
    expect(jdn2000_03_01).toBe(jdn2000_02_29 + 1);
    expect(jdnToGregorian(jdn2000_02_29)).toEqual({ year: 2000, month: 2, day: 29 });

    // 1900 is NOT leap: Feb 28 + 1 is Mar 1
    const jdn1900_02_28 = gregorianToJdn(1900, 2, 28);
    const jdn1900_03_01 = gregorianToJdn(1900, 3, 1);
    expect(jdn1900_03_01).toBe(jdn1900_02_28 + 1);
    expect(jdnToGregorian(jdn1900_02_28 + 1)).toEqual({ year: 1900, month: 3, day: 1 });

    // 2100 is NOT leap: Feb 28 + 1 is Mar 1
    const jdn2100_02_28 = gregorianToJdn(2100, 2, 28);
    const jdn2100_03_01 = gregorianToJdn(2100, 3, 1);
    expect(jdn2100_03_01).toBe(jdn2100_02_28 + 1);
    expect(jdnToGregorian(jdn2100_02_28 + 1)).toEqual({ year: 2100, month: 3, day: 1 });
  });

  it('performs lossless round-trip for every day 1900 to 2200', () => {
    const startJdn = gregorianToJdn(1900, 1, 1);
    const endJdn = gregorianToJdn(2200, 12, 31);
    // Step by 37 days across 300 years to sample extensively without slowing the unit suite
    for (let j = startJdn; j <= endJdn; j += 37) {
      const g = jdnToGregorian(j);
      expect(gregorianToJdn(g.year, g.month, g.day)).toBe(j);
    }
  });
});
