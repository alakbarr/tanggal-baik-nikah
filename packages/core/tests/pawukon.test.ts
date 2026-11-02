import { describe, expect, it } from 'vitest';
import { gregorianToJdn } from '../src/calendar/jdn.js';
import {
  getHastawara,
  getPawukonFromGregorian,
  getPawukonFromJdn,
  getSangawara,
} from '../src/calendar/pawukon.js';

describe('Pawukon 210-Day Cycle and Sadwara (Paringkelan)', () => {
  it('correctly calculates wuku for baseline dates', () => {
    // 2026-11-02 -> Sinta (#0), Senin Pon, sadwara Aryang
    const p1 = getPawukonFromGregorian(2026, 11, 2);
    expect(p1.wukuIndex).toBe(0);
    expect(p1.wuku).toBe('Sinta');
    expect(p1.dayInCycle).toBe(1);
    expect(p1.sadwara).toBe('Aryang');
    expect(p1.hastawara).toBe('Indra');
    expect(p1.sangawara).toBe('Dangu');

    // 2027-07-10 -> Gumbreg (#5), Sabtu Pon, sadwara Mawulu
    const p2 = getPawukonFromGregorian(2027, 7, 10);
    expect(p2.wukuIndex).toBe(5);
    expect(p2.wuku).toBe('Gumbreg');
    expect(p2.dayInCycle).toBe(41);
    expect(p2.sadwara).toBe('Mawulu');
    expect(p2.hastawara).toBe('Indra');
    expect(p2.sangawara).toBe('Gigis');
  });

  it('correctly cross-checks against all 5 Balinese Galungan dates (all wuku #10 Galungan)', () => {
    const galunganDates = [
      [2024, 2, 28],
      [2024, 9, 25],
      [2025, 4, 23],
      [2025, 11, 19],
      [2026, 6, 17],
    ] as const;

    for (const [y, m, d] of galunganDates) {
      const p = getPawukonFromGregorian(y, m, d);
      expect(p.wukuIndex).toBe(10);
      expect(p.wuku).toBe('Galungan');
      // Rabu of wuku 10 is day 73 of the 210-day cycle (10 * 7 + 3)
      expect(p.dayInCycle).toBe(73);
      expect(p.hastawara).toBe('Uma');
      expect(p.sangawara).toBe('Wurung');
    }
  });

  it('uses d mod 6 for Sadwara, not JDN mod 6', () => {
    // For 2026-11-01 (Sunday, Sinta, d = 0):
    // d mod 6 = 0 -> Tungle
    // JDN is 2461346: JDN mod 6 = 2 (Wurukung)
    // The two formulas differ by 2; Sadwara must follow d mod 6
    const jdnSundaySinta = gregorianToJdn(2026, 11, 1);
    const p = getPawukonFromJdn(jdnSundaySinta);
    expect(p.dayInCycle).toBe(0);
    expect(p.sadwara).toBe('Tungle');
    expect(p.hastawara).toBe('Sri');
    expect(p.sangawara).toBe('Dangu');
  });

  it('correctly calculates Hastawara (Padewan) with Kala Tiga exception at d=70..72', () => {
    expect(getHastawara(0)).toBe('Sri');
    expect(getHastawara(1)).toBe('Indra');
    expect(getHastawara(69)).toBe('Brama');
    expect(getHastawara(70)).toBe('Kala');
    expect(getHastawara(71)).toBe('Kala'); // Kala repeat 1
    expect(getHastawara(72)).toBe('Kala'); // Kala repeat 2
    expect(getHastawara(73)).toBe('Uma');
    expect(getHastawara(74)).toBe('Sri');
    expect(getHastawara(209)).toBe('Uma');
    expect(getHastawara(210)).toBe('Sri'); // cycle reset
  });

  it('correctly calculates Sangawara (Padangon) with Dangu Pat exception at d=0..3', () => {
    expect(getSangawara(0)).toBe('Dangu');
    expect(getSangawara(1)).toBe('Dangu'); // Dangu repeat 1
    expect(getSangawara(2)).toBe('Dangu'); // Dangu repeat 2
    expect(getSangawara(3)).toBe('Dangu'); // Dangu repeat 3
    expect(getSangawara(4)).toBe('Jagur');
    expect(getSangawara(5)).toBe('Gigis');
    expect(getSangawara(12)).toBe('Dangu');
    expect(getSangawara(209)).toBe('Dadi');
    expect(getSangawara(210)).toBe('Dangu'); // cycle reset
  });
});
