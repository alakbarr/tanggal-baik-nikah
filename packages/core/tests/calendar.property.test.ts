import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { ASAPON_EPOCH_JDN, jdnToJavanese } from '../src/calendar/javanese.js';
import { gregorianToJdn, jdnToGregorian } from '../src/calendar/jdn.js';
import { getPawukonFromJdn } from '../src/calendar/pawukon.js';
import { getWetonFromJdn } from '../src/calendar/weton.js';

const START_JDN = ASAPON_EPOCH_JDN; // 1936-03-24 (2428252)
const END_JDN = gregorianToJdn(2060, 12, 31); // (2473824)

describe('Calendar Mathematical Property Tests (fast-check)', () => {
  it('Property 1: Gregorian <-> JDN is an exact bijection (round-trip identity)', () => {
    fc.assert(
      fc.property(fc.integer({ min: START_JDN, max: END_JDN }), (jdn) => {
        const g = jdnToGregorian(jdn);
        const jdnBack = gregorianToJdn(g.year, g.month, g.day);
        return jdnBack === jdn;
      }),
      { numRuns: 1000 }
    );
  });

  it('Property 2: Weekday and Pasaran advance by exactly 1 every successive day', () => {
    fc.assert(
      fc.property(fc.integer({ min: START_JDN, max: END_JDN - 1 }), (jdn) => {
        const w1 = getWetonFromJdn(jdn);
        const w2 = getWetonFromJdn(jdn + 1);

        const expectedDay = (w1.dayIndex + 1) % 7;
        const expectedPasaran = (w1.pasaranIndex + 1) % 5;

        return w2.dayIndex === expectedDay && w2.pasaranIndex === expectedPasaran;
      }),
      { numRuns: 1000 }
    );
  });

  it('Property 3: Wuku advances by 1 if and only if the next day is Ahad (Sunday)', () => {
    fc.assert(
      fc.property(fc.integer({ min: START_JDN, max: END_JDN - 1 }), (jdn) => {
        const p1 = getPawukonFromJdn(jdn);
        const p2 = getPawukonFromJdn(jdn + 1);
        const w2 = getWetonFromJdn(jdn + 1);

        if (w2.dayIndex === 0) {
          // Ahad: wuku must increment (mod 30)
          return p2.wukuIndex === (p1.wukuIndex + 1) % 30;
        } else {
          // Monday through Saturday: wuku must remain identical
          return p2.wukuIndex === p1.wukuIndex;
        }
      }),
      { numRuns: 1000 }
    );
  });

  it('Property 4: Javanese calendar day advances by 1 or resets to 1 on a valid month boundary', () => {
    fc.assert(
      fc.property(fc.integer({ min: START_JDN, max: END_JDN - 1 }), (jdn) => {
        const j1 = jdnToJavanese(jdn);
        const j2 = jdnToJavanese(jdn + 1);

        if (j2.day === 1) {
          // Month changed
          const expectedMonthIndex = (j1.sasiIndex + 1) % 12;
          return (
            j2.sasiIndex === expectedMonthIndex &&
            (j1.day === 29 || j1.day === 30)
          );
        } else {
          // Within same month
          return (
            j2.day === j1.day + 1 &&
            j2.sasiIndex === j1.sasiIndex &&
            j2.year === j1.year
          );
        }
      }),
      { numRuns: 1000 }
    );
  });

  it('Property 5: 1 Sura of every Alip year falls on the defining weton of its kurup', () => {
    // Kurup Asapon (1867..1986 J, 15 windus): 1 Sura Alip must be Selasa Pon (dayIndex 2, pasaranIndex 2)
    for (let k = 0; k < 15; k++) {
      const alipJdn = ASAPON_EPOCH_JDN + k * 2835;
      const jd = jdnToJavanese(alipJdn);
      expect(jd.year).toBe(1867 + k * 8);
      expect(jd.sasi).toBe('Sura');
      expect(jd.day).toBe(1);
      expect(jd.kurup).toBe('Asapon');

      const w = getWetonFromJdn(alipJdn);
      expect(w.dayIndex).toBe(2); // Selasa
      expect(w.pasaranIndex).toBe(2); // Pon
    }

    // Kurup Anenhing (1987 J onwards): 1 Sura Alip must be Senin Pahing (dayIndex 1, pasaranIndex 1)
    const anenhingEpoch = ASAPON_EPOCH_JDN + 42524;
    for (let k = 0; k < 5; k++) {
      const alipJdn = anenhingEpoch + k * 2835;
      const jd = jdnToJavanese(alipJdn);
      expect(jd.year).toBe(1987 + k * 8);
      expect(jd.sasi).toBe('Sura');
      expect(jd.day).toBe(1);
      expect(jd.kurup).toBe('Anenhing');

      const w = getWetonFromJdn(alipJdn);
      expect(w.dayIndex).toBe(1); // Senin
      expect(w.pasaranIndex).toBe(1); // Pahing
    }
  });
});
