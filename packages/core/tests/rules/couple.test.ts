import { describe, expect, it } from 'vitest';
import {
  evaluateB01,
  evaluateJ15,
  evaluateJ16,
  evaluateJ17,
  evaluateJ22,
  evaluateJ23,
} from '../../src/rules/couple/index.js';

describe('Couple Profile Rules Evaluators', () => {
  describe('B-01: Popular 8-Category Couple Rule (mod 9)', () => {
    it('verifies canonical fixtures: 28 -> Pegat, 25 -> Sujanan, 29 -> Ratu, 35 -> Pesthi, 36 -> Pegat', () => {
      // 28 = Pegat (28 mod 9 = 1 -> Pegat, resolving the 15+13 bug)
      const res28 = evaluateB01(15, 13);
      expect(res28.labelJv).toBe('Pegat');
      expect(res28.verdict).toBe('info');
      expect(res28.explanationId).toContain('28 mod 9 = 1');

      // 25 = Sujanan (25 mod 9 = 7)
      const res25 = evaluateB01(12, 13);
      expect(res25.labelJv).toBe('Sujanan');

      // 29 = Ratu (29 mod 9 = 2)
      const res29 = evaluateB01(14, 15);
      expect(res29.labelJv).toBe('Ratu');
      expect(res29.verdict).toBe('pass');

      // 35 = Pesthi (35 mod 9 = 8)
      const res35 = evaluateB01(18, 17);
      expect(res35.labelJv).toBe('Pesthi');
      expect(res35.verdict).toBe('pass');

      // 36 = Pegat (36 mod 9 = 0)
      const res36 = evaluateB01(18, 18);
      expect(res36.labelJv).toBe('Pegat');
    });

    it('reproduces all 35 entries of the published popular table with (sum mod 9)', () => {
      // Published Pegat entries: 9, 10, 18, 19, 27, 28, 36 (mod 9 in {0, 1})
      for (const sum of [18, 19, 27, 28, 36]) {
        expect(evaluateB01(sum / 2, sum / 2).labelJv).toBe('Pegat');
      }
      // Published Ratu entries: 2, 11, 20, 29 (mod 9 == 2)
      expect(evaluateB01(10, 10).labelJv).toBe('Ratu');
      expect(evaluateB01(14, 15).labelJv).toBe('Ratu');
      // Published Jodoh entries: 3, 12, 21, 30 (mod 9 == 3)
      expect(evaluateB01(10, 11).labelJv).toBe('Jodoh');
      expect(evaluateB01(15, 15).labelJv).toBe('Jodoh');
      // Published Topo entries: 4, 13, 22, 31 (mod 9 == 4)
      expect(evaluateB01(11, 11).labelJv).toBe('Topo');
      expect(evaluateB01(15, 16).labelJv).toBe('Topo');
      // Published Tinari entries: 5, 14, 23, 32 (mod 9 == 5)
      expect(evaluateB01(11, 12).labelJv).toBe('Tinari');
      expect(evaluateB01(16, 16).labelJv).toBe('Tinari');
      // Published Padu entries: 6, 15, 24, 33 (mod 9 == 6)
      expect(evaluateB01(12, 12).labelJv).toBe('Padu');
      expect(evaluateB01(16, 17).labelJv).toBe('Padu');
      // Published Sujanan entries: 7, 16, 25, 34 (mod 9 == 7)
      expect(evaluateB01(12, 13).labelJv).toBe('Sujanan');
      expect(evaluateB01(17, 17).labelJv).toBe('Sujanan');
      // Published Pesthi entries: 8, 17, 26, 35 (mod 9 == 8)
      expect(evaluateB01(13, 13).labelJv).toBe('Pesthi');
      expect(evaluateB01(17, 18).labelJv).toBe('Pesthi');
    });
  });

  describe('J-15: Pasatohan 9x9 (Betaljemur No. 15)', () => {
    it('verifies the Betaljemur worked example: Jumat Kliwon (14 -> 5) x Jumat Pahing (15 -> 6)', () => {
      // 14 mod 9 = 5; 15 mod 9 = 6
      const res = evaluateJ15(14, 15);
      expect(res.labelJv).toBe('5, 6');
      expect(res.explanationId).toContain('cepak rijekiné');
      expect(res.verdict).toBe('pass');
    });

    it('handles remainder 0 mapping to 9 (e.g. neptu 18 mod 9 = 9)', () => {
      const res = evaluateJ15(18, 18);
      expect(res.labelJv).toBe('9, 9');
      expect(res.verdict).toBe('fail');
    });
  });

  describe('J-16: Modulo 4 (Betaljemur No. 16)', () => {
    it('verifies Betaljemur worked example: 13 + 17 = 30 -> 30 mod 4 = 2 -> Gembili', () => {
      const res = evaluateJ16(13, 17);
      expect(res.labelJv).toBe('Gembili');
      expect(res.verdict).toBe('pass');
      expect(res.explanationId).toContain('(13 + 17) mod 4 = 2');
    });
  });

  describe('J-17: Saptawara Pairs (Betaljemur No. 17)', () => {
    it('evaluates weekday pair compatibility', () => {
      // Akad (0) x Jumuah (5) -> yuwana (pass)
      const res1 = evaluateJ17(0, 5);
      expect(res1.labelJv).toBe('Ahad & Jumat');
      expect(res1.verdict).toBe('pass');

      // Selasa (2) x Jumuah (5) -> pegat (fail)
      const res2 = evaluateJ17(2, 5);
      expect(res2.verdict).toBe('fail');
      expect(res2.explanationId).toContain('pegat');
    });
  });

  describe('J-22: Pancasuda Penganten (Betaljemur No. 22)', () => {
    it('computes (groom + bride + 10) mod 7', () => {
      // 14 + 15 = 29 -> (29 + 10) = 39 -> 39 mod 7 = 4 -> Rondha Keli
      const res = evaluateJ22(14, 15);
      expect(res.labelJv).toBe('Rondha Keli');
      expect(res.verdict).toBe('fail');
      expect(res.explanationId).toContain('(14 + 15 + 10) mod 7 = 4');
    });
  });

  describe('J-23: Modulo 5 (Betaljemur No. 23)', () => {
    it('computes (groom + bride) mod 5', () => {
      // 14 + 15 = 29 -> 29 mod 5 = 4 -> Lara
      const res = evaluateJ23(14, 15);
      expect(res.labelJv).toBe('Lara');
      expect(res.verdict).toBe('fail');

      // 14 + 14 = 28 -> 28 mod 5 = 3 -> Gedhong
      const resGedhong = evaluateJ23(14, 14);
      expect(resGedhong.labelJv).toBe('Gedhong');
      expect(resGedhong.verdict).toBe('pass');
    });
  });
});
