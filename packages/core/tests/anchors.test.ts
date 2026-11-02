import { describe, expect, it } from 'vitest';
import { getDayPoint } from '../src/calendar/month-grid.js';
import { gregorianToJdn } from '../src/calendar/jdn.js';
import { formatWeton } from '../src/calendar/weton.js';

describe('12 Golden Calendar Anchors (ARCHITECTURE.md §6.1)', () => {
  const ANCHORS = [
    {
      id: 'A-01',
      gregorian: { year: 1945, month: 8, day: 17 },
      expectedJdn: 2431685,
      expectedWeton: 'Jumat Legi',
      expectedWuku: 'Manahil',
      expectedWukuIndex: 22,
      expectedJavanese: { day: 9, sasi: 'Pasa', year: 1876, tahun: 'Ehe', kurup: 'Asapon' },
    },
    {
      id: 'A-02',
      gregorian: { year: 1936, month: 3, day: 24 },
      expectedJdn: 2428252,
      expectedWeton: 'Selasa Pon',
      expectedWuku: 'Langkir',
      expectedWukuIndex: 12,
      expectedJavanese: { day: 1, sasi: 'Sura', year: 1867, tahun: 'Alip', kurup: 'Asapon' },
    },
    {
      id: 'A-03',
      gregorian: { year: 2052, month: 8, day: 25 },
      expectedJdn: 2470775,
      expectedWeton: 'Ahad Legi',
      expectedWuku: 'Kulawu',
      expectedWukuIndex: 27,
      expectedJavanese: { day: 29, sasi: 'Besar', year: 1986, tahun: 'Jimakir', kurup: 'Asapon' },
    },
    {
      id: 'A-04',
      gregorian: { year: 2052, month: 8, day: 26 },
      expectedJdn: 2470776,
      expectedWeton: 'Senin Pahing',
      expectedWuku: 'Kulawu',
      expectedWukuIndex: 27,
      expectedJavanese: { day: 1, sasi: 'Sura', year: 1987, tahun: 'Alip', kurup: 'Anenhing' },
    },
    {
      id: 'A-05',
      gregorian: { year: 1819, month: 10, day: 20 },
      expectedJdn: 2385728,
      expectedWeton: 'Rabu Wage',
      expectedWuku: null,
      expectedWukuIndex: null,
      expectedJavanese: { day: 1, sasi: 'Sura', year: 1747, tahun: 'Alip', kurup: 'Aboge' },
    },
    {
      id: 'A-06',
      gregorian: { year: 2024, month: 7, day: 8 },
      expectedJdn: 2460500,
      expectedWeton: 'Senin Legi',
      expectedWuku: 'Watugunung',
      expectedWukuIndex: 29,
      expectedJavanese: { day: 1, sasi: 'Sura', year: 1958, tahun: 'Je', kurup: 'Asapon' },
    },
    {
      id: 'A-07',
      gregorian: { year: 2025, month: 6, day: 27 },
      expectedJdn: 2460854,
      expectedWeton: 'Jumat Kliwon',
      expectedWuku: 'Medangkungan',
      expectedWukuIndex: 19,
      expectedJavanese: { day: 1, sasi: 'Sura', year: 1959, tahun: 'Dal', kurup: 'Asapon' },
    },
    {
      id: 'A-08',
      gregorian: { year: 2026, month: 6, day: 17 },
      expectedJdn: 2461209,
      expectedWeton: 'Rabu Kliwon',
      expectedWuku: 'Galungan',
      expectedWukuIndex: 10,
      expectedJavanese: { day: 1, sasi: 'Sura', year: 1960, tahun: 'Be', kurup: 'Asapon' },
    },
    {
      id: 'A-09',
      gregorian: { year: 2026, month: 11, day: 2 },
      expectedJdn: 2461347,
      expectedWeton: 'Senin Pon',
      expectedWuku: 'Sinta',
      expectedWukuIndex: 0,
      expectedJavanese: { day: 21, sasi: 'Jumadilawal', year: 1960, tahun: 'Be', kurup: 'Asapon' },
    },
    {
      id: 'A-10',
      gregorian: { year: 2027, month: 7, day: 10 },
      expectedJdn: 2461597,
      expectedWeton: 'Sabtu Pon',
      expectedWuku: 'Gumbreg',
      expectedWukuIndex: 5,
      expectedJavanese: { day: 5, sasi: 'Sapar', year: 1961, tahun: 'Wawu', kurup: 'Asapon' },
    },
    {
      id: 'A-11',
      gregorian: { year: 2024, month: 2, day: 28 },
      expectedJdn: 2460369,
      expectedWeton: 'Rabu Kliwon',
      expectedWuku: 'Galungan',
      expectedWukuIndex: 10,
      expectedJavanese: { day: 17, sasi: 'Ruwah', year: 1957, tahun: 'Jimawal', kurup: 'Asapon' },
    },
    {
      id: 'A-12',
      gregorian: { year: 2025, month: 11, day: 19 },
      expectedJdn: 2460999,
      expectedWeton: 'Rabu Kliwon',
      expectedWuku: 'Galungan',
      expectedWukuIndex: 10,
      expectedJavanese: { day: 28, sasi: 'Jumadilawal', year: 1959, tahun: 'Dal', kurup: 'Asapon' },
    },
  ] as const;

  for (const anchor of ANCHORS) {
    it(`verifies anchor ${anchor.id} (${anchor.gregorian.year}-${anchor.gregorian.month}-${anchor.gregorian.day})`, () => {
      const jdn = gregorianToJdn(
        anchor.gregorian.year,
        anchor.gregorian.month,
        anchor.gregorian.day
      );
      expect(jdn).toBe(anchor.expectedJdn);

      const dp = getDayPoint(jdn);
      expect(formatWeton(dp.weton)).toBe(anchor.expectedWeton);

      if (anchor.expectedWuku !== null) {
        expect(dp.pawukon.wuku).toBe(anchor.expectedWuku);
        expect(dp.pawukon.wukuIndex).toBe(anchor.expectedWukuIndex);
      }

      expect(dp.javanese.day).toBe(anchor.expectedJavanese.day);
      expect(dp.javanese.sasi).toBe(anchor.expectedJavanese.sasi);
      expect(dp.javanese.year).toBe(anchor.expectedJavanese.year);
      expect(dp.javanese.tahun).toBe(anchor.expectedJavanese.tahun);
      expect(dp.javanese.kurup).toBe(anchor.expectedJavanese.kurup);
    });
  }

  it('verifies anchor A-08 under alternative Aboge community reckoning gives Kamis Legi 2026-06-18', () => {
    const jAboge = gregorianToJdn(2026, 6, 18);
    const dpAboge = getDayPoint(jAboge, 'aboge');
    expect(formatWeton(dpAboge.weton)).toBe('Kamis Legi');
    expect(dpAboge.javanese.day).toBe(1);
    expect(dpAboge.javanese.sasi).toBe('Sura');
    expect(dpAboge.javanese.year).toBe(1960);
    expect(dpAboge.javanese.tahun).toBe('Be');
  });
});
