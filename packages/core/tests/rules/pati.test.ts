import { describe, expect, it } from 'vitest';
import {
  evaluateU01,
  evaluateU02,
  evaluateU03,
  evaluateU04,
  evaluateU05,
  calculateDinaPengapesan,
} from '../../src/rules/pati.js';
import type { Weton } from '../../src/types.js';

describe('Pati Field Tradition (Setiaji Skripsi / Desa Kropak MS)', () => {
  it('U-01: Ternary rule (coupleNeptu + dayNeptu) mod 3 == 2', () => {
    // Setiaji worked examples with couple neptu = 22:
    // + 9 (Senin Legi) -> (22 + 9) = 31 mod 3 = 1 -> FAIL
    const r1 = evaluateU01(22, 9);
    expect(r1.verdict).toBe('fail');
    expect(r1.explanationId).toContain('(22 + 9) mod 3 = 1');

    // + 7 (Selasa Wage) -> (22 + 7) = 29 mod 3 = 2 -> PASS
    const r2 = evaluateU01(22, 7);
    expect(r2.verdict).toBe('pass');
    expect(r2.explanationId).toContain('(22 + 7) mod 3 = 2');

    // + 10 (Selasa Pon) -> (22 + 10) = 32 mod 3 = 2 -> PASS
    const r3 = evaluateU01(22, 10);
    expect(r3.verdict).toBe('pass');
    expect(r3.explanationId).toContain('(22 + 10) mod 3 = 2');
  });

  it('U-02: Pantangan weton calon penganten', () => {
    const groomWeton: Weton = { dayIndex: 5, pasaranIndex: 0, neptu: 11 }; // Jumat Legi
    const brideWeton: Weton = { dayIndex: 2, pasaranIndex: 2, neptu: 10 }; // Selasa Pon

    // Wedding on Jumat Legi -> FAIL
    const rGroom = evaluateU02({ dayIndex: 5, pasaranIndex: 0, neptu: 11 }, groomWeton, brideWeton);
    expect(rGroom.verdict).toBe('fail');
    expect(rGroom.labelJv).toBe('Weton Penganten');

    // Wedding on Rabu Pahing -> PASS
    const rPass = evaluateU02({ dayIndex: 3, pasaranIndex: 1, neptu: 16 }, groomWeton, brideWeton);
    expect(rPass.verdict).toBe('pass');
  });

  it('U-03 & U-04: Pantangan weton orang tua dan geblak orang tua', () => {
    const fatherWeton: Weton = { dayIndex: 4, pasaranIndex: 3, neptu: 12 }; // Kamis Wage
    const geblakWeton: Weton = { dayIndex: 6, pasaranIndex: 4, neptu: 17 }; // Sabtu Kliwon

    // Testing U-03
    expect(evaluateU03({ dayIndex: 4, pasaranIndex: 3, neptu: 12 }, [fatherWeton]).verdict).toBe('fail');
    expect(evaluateU03({ dayIndex: 0, pasaranIndex: 0, neptu: 10 }, [fatherWeton]).verdict).toBe('pass');

    // Testing U-04
    expect(evaluateU04({ dayIndex: 6, pasaranIndex: 4, neptu: 17 }, [geblakWeton]).verdict).toBe('fail');
    expect(evaluateU04({ dayIndex: 0, pasaranIndex: 0, neptu: 10 }, [geblakWeton]).verdict).toBe('pass');
  });

  it('U-05: Dina Pengapesan matches Setiaji example (Selasa Wage -> Senin Kliwon)', () => {
    // Born Selasa Wage (dayIndex 2, pasaranIndex 3, neptu 3 + 4 = 7)
    const selasaWage: Weton = { dayIndex: 2, pasaranIndex: 3, neptu: 7 };
    const pengapesan = calculateDinaPengapesan(selasaWage);

    // Must be Senin Kliwon (dayIndex 1, pasaranIndex 4)
    expect(pengapesan.dayIndex).toBe(1); // Senin
    expect(pengapesan.pasaranIndex).toBe(4); // Kliwon

    // Evaluating wedding day matching pengapesan
    const rFail = evaluateU05({ dayIndex: 1, pasaranIndex: 4, neptu: 12 }, selasaWage);
    expect(rFail.verdict).toBe('fail');
    expect(rFail.labelJv).toBe('Dina Pengapesan');

    const rPass = evaluateU05({ dayIndex: 0, pasaranIndex: 0, neptu: 10 }, selasaWage);
    expect(rPass.verdict).toBe('pass');
  });
});
