import { describe, expect, it } from 'vitest';
import { evaluateS01Iddah, evaluateS02Ihram } from '../../src/rules/shariah.js';
import { gregorianToJdn } from '../../src/calendar/jdn.js';

describe('Shariah Hard Limits (S-01 & S-02)', () => {
  it('S-01: Bride must be past her iddah period (QS. Al-Baqarah: 235)', () => {
    const iddahEndJdn = gregorianToJdn(2027, 4, 15);

    // Before or on iddah end date -> FAIL
    const rBefore = evaluateS01Iddah(gregorianToJdn(2027, 4, 10), iddahEndJdn);
    expect(rBefore.verdict).toBe('fail');
    expect(rBefore.labelJv).toBe('Masa Iddah');

    const rOn = evaluateS01Iddah(iddahEndJdn, iddahEndJdn);
    expect(rOn.verdict).toBe('fail');

    // After iddah end date -> PASS
    const rAfter = evaluateS01Iddah(iddahEndJdn + 1, iddahEndJdn);
    expect(rAfter.verdict).toBe('pass');
    expect(rAfter.labelJv).toBe('Selesai Iddah');

    // No iddah specified -> PASS
    const rNone = evaluateS01Iddah(gregorianToJdn(2027, 4, 10), undefined);
    expect(rNone.verdict).toBe('pass');
  });

  it('S-02: Neither spouse nor wali in ihram (HR. Muslim No. 1409)', () => {
    const ihramPeriod = {
      startJdn: gregorianToJdn(2027, 5, 10),
      endJdn: gregorianToJdn(2027, 5, 25),
    };

    // Inside ihram period -> FAIL
    const rInside = evaluateS02Ihram(gregorianToJdn(2027, 5, 15), [ihramPeriod]);
    expect(rInside.verdict).toBe('fail');
    expect(rInside.labelJv).toBe('Kondisi Ihram');
    expect(rInside.explanationId).toContain('Muslim No. 1409');

    // Boundary dates: start and end are inside ihram -> FAIL
    expect(evaluateS02Ihram(ihramPeriod.startJdn, [ihramPeriod]).verdict).toBe('fail');
    expect(evaluateS02Ihram(ihramPeriod.endJdn, [ihramPeriod]).verdict).toBe('fail');

    // Outside ihram period -> PASS
    const rOutside = evaluateS02Ihram(gregorianToJdn(2027, 5, 26), [ihramPeriod]);
    expect(rOutside.verdict).toBe('pass');
    expect(rOutside.labelJv).toBe('Bebas Ihram');
  });
});
