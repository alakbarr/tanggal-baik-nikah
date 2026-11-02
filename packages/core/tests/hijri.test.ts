import { describe, expect, it } from 'vitest';
import { gregorianToJdn } from '../src/calendar/jdn.js';
import { getHijriDate, getHijriDatesForDay } from '../src/calendar/hijri.js';

describe('Hijri Calendar (Kemenag MABIMS & Muhammadiyah KHGT)', () => {
  it('correctly maps 1 Muharram 1447 for both authorities', () => {
    // 27 Jun 2025 (JDN 2460854) -> 1 Muharram 1447 Kemenag
    const jdnKemenagStart = gregorianToJdn(2025, 6, 27);
    const hKemenag = getHijriDate(jdnKemenagStart, 'kemenag');
    expect(hKemenag).toEqual({
      year: 1447,
      month: 1,
      day: 1,
      authority: 'kemenag',
      basis: 'official',
    });

    // 26 Jun 2025 (JDN 2460853) -> 1 Muharram 1447 KHGT (1 day earlier)
    const jdnKhgtStart = gregorianToJdn(2025, 6, 26);
    const hKhgt = getHijriDate(jdnKhgtStart, 'khgt');
    expect(hKhgt).toEqual({
      year: 1447,
      month: 1,
      day: 1,
      authority: 'khgt',
      basis: 'official',
    });
  });

  it('reproduces 1-day KHGT/Kemenag differences in 1447 H', () => {
    // Ramadan 1447: Kemenag 19 Feb 2026, KHGT 18 Feb 2026
    const jdnRamadanKhgt = gregorianToJdn(2026, 2, 18);
    expect(getHijriDate(jdnRamadanKhgt, 'khgt')).toMatchObject({
      year: 1447,
      month: 9,
      day: 1,
    });
    expect(getHijriDate(jdnRamadanKhgt, 'kemenag')).toMatchObject({
      year: 1447,
      month: 8,
      day: 30, // Still 30 Syaban under Kemenag
    });

    // Syawal 1447: Kemenag 21 Mar 2026, KHGT 20 Mar 2026
    const jdnSyawalKhgt = gregorianToJdn(2026, 3, 20);
    expect(getHijriDate(jdnSyawalKhgt, 'khgt')).toMatchObject({
      year: 1447,
      month: 10,
      day: 1,
    });
    expect(getHijriDate(jdnSyawalKhgt, 'kemenag')).toMatchObject({
      year: 1447,
      month: 9,
      day: 30,
    });
  });

  it('labels 1447 as official and 1448 onwards as forecast', () => {
    // 1447 is officially pinned
    const h1447 = getHijriDate(gregorianToJdn(2025, 6, 27), 'kemenag');
    expect(h1447?.basis).toBe('official');

    // 1448 is forecast awaiting future isbat/confirmation
    const h1448 = getHijriDate(gregorianToJdn(2026, 6, 17), 'kemenag');
    expect(h1448?.basis).toBe('forecast');
  });

  it('returns both authorities in getHijriDatesForDay', () => {
    const pair = getHijriDatesForDay(gregorianToJdn(2025, 6, 27));
    expect(pair.kemenag).toMatchObject({ year: 1447, month: 1, day: 1 });
    expect(pair.khgt).toMatchObject({ year: 1447, month: 1, day: 2 });
  });
});
