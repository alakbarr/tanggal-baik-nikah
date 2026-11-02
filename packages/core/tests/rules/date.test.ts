import { describe, expect, it } from 'vitest';
import { getDayPoint } from '../../src/calendar/month-grid.js';
import { gregorianToJdn } from '../../src/calendar/jdn.js';
import type { DayPoint } from '../../src/types.js';
import {
  evaluateJ07,
  evaluateJ08,
  evaluateJ12,
  evaluateJ14,
  evaluateJ26,
  evaluateJ27,
  evaluateJ28,
  evaluateJ29,
  evaluateJ30,
  evaluateJ31,
  evaluateJ32,
  evaluateJ33,
  evaluateJ34,
  monthHasSelasaKliwon,
} from '../../src/rules/date/index.js';

describe('Date Rules Evaluators (Betaljemur Adammakna)', () => {
  it('J-07 Kunarpaning Warsa: detects last day of Besar', () => {
    // 1960 Be last day of Besar is 29 Besar 1960 Be (2027-06-05, Sabtu Pon)
    const jLastBesar1960 = gregorianToJdn(2027, 6, 5);
    const dp1 = getDayPoint(jLastBesar1960);
    expect(dp1.javanese.sasi).toBe('Besar');
    expect(dp1.javanese.day).toBe(29);
    const r1 = evaluateJ07(dp1);
    expect(r1.verdict).toBe('fail');
    expect(r1.labelJv).toBe('Kunarpaning Warsa');

    // Next day (1 Sura 1961 Wawu) is not Kunarpaning Warsa
    const dpNext = getDayPoint(jLastBesar1960 + 1);
    expect(evaluateJ07(dpNext).verdict).toBe('pass');
  });

  it('J-08 Sangaring Warsa: detects 3 Sura', () => {
    // 3 Sura 1961 Wawu is 2027-06-08 (Selasa Legi)
    const j3Sura1961 = gregorianToJdn(2027, 6, 8);
    const dp = getDayPoint(j3Sura1961);
    expect(dp.javanese.sasi).toBe('Sura');
    expect(dp.javanese.day).toBe(3);
    const res = evaluateJ08(dp);
    expect(res.verdict).toBe('fail');
    expect(res.labelJv).toBe('Sangaring Warsa');
  });

  it('J-12 Anggaraksih: identifies months lacking Selasa Kliwon (1960-1962 J)', () => {
    // Months of 1960-1962 lacking Selasa Kliwon per RESEARCH.md §3.1:
    // Mulud 1960, Sawal 1960, Bakdamulud 1961, Sawal 1961, Jumadilawal 1962, Dulkangidah 1962
    expect(monthHasSelasaKliwon(1960, 'Mulud')).toBe(false);
    expect(monthHasSelasaKliwon(1960, 'Sawal')).toBe(false);
    expect(monthHasSelasaKliwon(1961, 'Bakdamulud')).toBe(false);
    expect(monthHasSelasaKliwon(1961, 'Sawal')).toBe(false);
    expect(monthHasSelasaKliwon(1962, 'Jumadilawal')).toBe(false);
    expect(monthHasSelasaKliwon(1962, 'Dulkangidah')).toBe(false);

    // Rejeb 1960 HAS Selasa Kliwon
    expect(monthHasSelasaKliwon(1960, 'Rejeb')).toBe(true);

    // A day in a month lacking Anggaraksih fails J-12
    let jScan = gregorianToJdn(2026, 6, 17);
    while (true) {
      const dp = getDayPoint(jScan);
      if (dp.javanese.year === 1960 && dp.javanese.sasi === 'Mulud') {
        expect(evaluateJ12(dp).verdict).toBe('fail');
        break;
      }
      jScan++;
    }
  });

  it('J-14 and J-30: Sangaring Tanggal (variants 4+1 and 1)', () => {
    // Sura 11 is in J-14
    const dpSura11 = getDayPoint(gregorianToJdn(2026, 6, 27)); // 11 Sura 1960 Be
    if (dpSura11.javanese.day === 11 && dpSura11.javanese.sasi === 'Sura') {
      expect(evaluateJ14(dpSura11).verdict).toBe('fail');
    }

    // Sura 18 is in J-30
    const dpSura18 = getDayPoint(gregorianToJdn(2026, 7, 4));
    if (dpSura18.javanese.day === 18 && dpSura18.javanese.sasi === 'Sura') {
      expect(evaluateJ30(dpSura18).verdict).toBe('fail');
    }
  });

  it('J-26 and J-27: Dina Ala and Dina Sangaring Asal', () => {
    // In Sawal: No. 26 forbids Saturday (6) and Sunday (0)
    // No. 27 forbids Friday (5)
    // Find a Sawal day in 1960
    let jScan = gregorianToJdn(2027, 4, 1);
    while (getDayPoint(jScan).javanese.sasi !== 'Sawal') jScan++;

    // Find Saturday of Sawal
    let jSat = jScan;
    while (getDayPoint(jSat).weton.dayIndex !== 6) jSat++;
    const dpSat = getDayPoint(jSat);
    expect(evaluateJ26(dpSat).verdict).toBe('fail');
    expect(evaluateJ27(dpSat).verdict).toBe('pass'); // No. 27 allows Saturday in Sawal
  });

  it('J-29, J-31, J-32, J-33: Naas tanggal, bangas padewan, taliwangke, and ala becik sasi', () => {
    // J-29: Sura 11 is naasing tanggal
    const dpSura11 = getDayPoint(gregorianToJdn(2026, 6, 27));
    if (dpSura11.javanese.day === 11 && dpSura11.javanese.sasi === 'Sura') {
      expect(evaluateJ29(dpSura11).verdict).toBe('fail');
    }

    // J-31: Sura 11 is also bangas padewan
    if (dpSura11.javanese.day === 11 && dpSura11.javanese.sasi === 'Sura') {
      expect(evaluateJ31(dpSura11).verdict).toBe('fail');
    }

    // J-32: Taliwangke sasi Sura is Rebo Pahing (dayIndex 3, pasaranIndex 1)
    const mockTali = {
      weton: { dayIndex: 3, pasaranIndex: 1, neptu: 16 },
      javanese: { day: 1, sasi: 'Sura', sasiIndex: 0, year: 1960, tahun: 'Be', kurup: 'Asapon', isLongYear: false },
    } as unknown as DayPoint;
    expect(evaluateJ32(mockTali).verdict).toBe('fail');

    // J-33: Sura is ala
    expect(evaluateJ33(mockTali).verdict).toBe('fail');
  });

  it('J-28 Naasing Para Nabi: detects Nabi naas dates', () => {
    // Mulud 3 is Naas Nabi Adam
    let jScan = gregorianToJdn(2026, 9, 1);
    while (!(getDayPoint(jScan).javanese.sasi === 'Mulud' && getDayPoint(jScan).javanese.day === 3)) {
      jScan++;
    }
    const dp = getDayPoint(jScan);
    expect(evaluateJ28(dp).verdict).toBe('fail');
    expect(evaluateJ28(dp).labelJv).toContain('Nabi');
  });

  it('J-34 Rupa 3: verifies the 6 exact consensus days', () => {
    // Consensus set: Jumuah 1, Akad 2, Senèn 2, Selasa 4, Rebo 2, Kemis 3
    // Test kaping calculation: day 1..7 -> kaping 1; day 8..14 -> kaping 2; day 15..21 -> kaping 3; day 22..28 -> kaping 4; day 29..30 -> kaping 5
    // Jumuah (5) day 1 -> kaping 1 -> PASS
    // Akad (0) day 8 -> kaping 2 -> PASS
    // Senen (1) day 9 -> kaping 2 -> PASS
    // Selasa (2) day 23 -> kaping 4 -> PASS
    // Rebo (3) day 10 -> kaping 2 -> PASS
    // Kemis (4) day 17 -> kaping 3 -> PASS
    const consensusDays = [
      { dayIndex: 5, day: 1 },  // Jumuah 1
      { dayIndex: 0, day: 8 },  // Akad 2
      { dayIndex: 1, day: 9 },  // Senen 2
      { dayIndex: 2, day: 23 }, // Selasa 4
      { dayIndex: 3, day: 10 }, // Rebo 2
      { dayIndex: 4, day: 17 }, // Kemis 3
    ] as const;

    for (const c of consensusDays) {
      // Create mock dayPoint matching this weekday and Javanese day
      const mockDay = {
        weton: { dayIndex: c.dayIndex, pasaranIndex: 0, neptu: 10 },
        javanese: { day: c.day, sasi: 'Rejeb', sasiIndex: 6, year: 1960, tahun: 'Be', kurup: 'Asapon', isLongYear: false },
      } as unknown as DayPoint;
      expect(evaluateJ34(mockDay).verdict).toBe('pass');
    }
  });
});
