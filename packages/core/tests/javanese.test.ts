import { describe, expect, it } from 'vitest';
import { gregorianToJdn } from '../src/calendar/jdn.js';
import { getJavaneseDate, jdnToJavanese } from '../src/calendar/javanese.js';
import { CalendarRangeError } from '../src/errors.js';

describe('Sultan Agungan Javanese Calendar', () => {
  it('throws CalendarRangeError for dates before 1 Sura 1747 (JDN 2385728 / 1819-10-20)', () => {
    expect(() => jdnToJavanese(2385727)).toThrow(CalendarRangeError);
  });

  it('correctly calculates the 12 Golden Anchors for Javanese date', () => {
    // A-05: Aboge epoch (1819-10-20 / JDN 2385728)
    const a05 = jdnToJavanese(2385728);
    expect(a05).toEqual({
      day: 1,
      sasi: 'Sura',
      sasiIndex: 0,
      year: 1747,
      tahun: 'Alip',
      kurup: 'Aboge',
      isLongYear: false,
    });

    // A-02: Asapon epoch (1936-03-24 / JDN 2428252)
    const a02 = jdnToJavanese(2428252);
    expect(a02).toEqual({
      day: 1,
      sasi: 'Sura',
      sasiIndex: 0,
      year: 1867,
      tahun: 'Alip',
      kurup: 'Asapon',
      isLongYear: false,
    });

    // A-01: Proclamation (1945-08-17 / JDN 2431685)
    const a01 = jdnToJavanese(2431685);
    expect(a01).toEqual({
      day: 9,
      sasi: 'Pasa',
      sasiIndex: 8,
      year: 1876,
      tahun: 'Ehe',
      kurup: 'Asapon',
      isLongYear: true,
    });

    // A-06: 2024-07-08 -> 1 Sura 1958 Je
    const a06 = jdnToJavanese(2460500);
    expect(a06).toEqual({
      day: 1,
      sasi: 'Sura',
      sasiIndex: 0,
      year: 1958,
      tahun: 'Je',
      kurup: 'Asapon',
      isLongYear: false,
    });

    // A-07: 2025-06-27 -> 1 Sura 1959 Dal
    const a07 = jdnToJavanese(2460854);
    expect(a07).toEqual({
      day: 1,
      sasi: 'Sura',
      sasiIndex: 0,
      year: 1959,
      tahun: 'Dal',
      kurup: 'Asapon',
      isLongYear: true,
    });

    // A-08: 2026-06-17 -> 1 Sura 1960 Be
    const a08 = jdnToJavanese(2461209);
    expect(a08).toEqual({
      day: 1,
      sasi: 'Sura',
      sasiIndex: 0,
      year: 1960,
      tahun: 'Be',
      kurup: 'Asapon',
      isLongYear: false,
    });

    // A-09: 2026-11-02 -> 21 Jumadilawal 1960 Be
    const a09 = jdnToJavanese(2461347);
    expect(a09).toEqual({
      day: 21,
      sasi: 'Jumadilawal',
      sasiIndex: 4,
      year: 1960,
      tahun: 'Be',
      kurup: 'Asapon',
      isLongYear: false,
    });

    // A-10: 2027-07-10 -> 5 Sapar 1961 Wawu
    const a10 = jdnToJavanese(2461597);
    expect(a10).toEqual({
      day: 5,
      sasi: 'Sapar',
      sasiIndex: 1,
      year: 1961,
      tahun: 'Wawu',
      kurup: 'Asapon',
      isLongYear: false,
    });

    // A-03: End of Kurup Asapon (2052-08-25 / JDN 2470775) -> 29 Besar 1986 Jimakir (dropped leap day)
    const a03 = jdnToJavanese(2470775);
    expect(a03).toEqual({
      day: 29,
      sasi: 'Besar',
      sasiIndex: 11,
      year: 1986,
      tahun: 'Jimakir',
      kurup: 'Asapon',
      isLongYear: false, // 120th year gugur sedina!
    });

    // A-04: Anenhing Epoch (2052-08-26 / JDN 2470776) -> 1 Sura 1987 Alip
    const a04 = jdnToJavanese(2470776);
    expect(a04).toEqual({
      day: 1,
      sasi: 'Sura',
      sasiIndex: 0,
      year: 1987,
      tahun: 'Alip',
      kurup: 'Anenhing',
      isLongYear: false,
    });
  });

  it('correctly handles the community Aboge reckoning without gugur sedina', () => {
    // 1 Sura 1960 under Aboge reckoning falls on Kamis Legi 2026-06-18 (JDN 2461210)
    const jAboge = gregorianToJdn(2026, 6, 18);
    const javaneseAboge = jdnToJavanese(jAboge, 'aboge');
    expect(javaneseAboge).toEqual({
      day: 1,
      sasi: 'Sura',
      sasiIndex: 0,
      year: 1960,
      tahun: 'Be',
      kurup: 'Aboge',
      isLongYear: false,
    });
  });

  it('computes Javanese date from Gregorian date via getJavaneseDate', () => {
    const jd = getJavaneseDate(1945, 8, 17);
    expect(jd.year).toBe(1876);
    expect(jd.sasi).toBe('Pasa');
    expect(jd.day).toBe(9);
  });
});
