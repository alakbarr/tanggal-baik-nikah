import { describe, expect, it } from 'vitest';
import {
  evaluateB01,
  evaluateB02,
  evaluateCulturalTaboos,
  evaluateJ15,
  evaluateJ16,
  evaluateJ17,
  evaluateJ22,
  evaluateJ23,
  evaluateJ24,
  evaluateJ25,
} from '../../src/rules/couple/index.js';
import type { JavaneseDate, Weton } from '../../src/types.js';

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
      for (const sum of [18, 19, 27, 28, 36]) {
        expect(evaluateB01(sum / 2, sum / 2).labelJv).toBe('Pegat');
      }
      expect(evaluateB01(10, 10).labelJv).toBe('Ratu');
      expect(evaluateB01(14, 15).labelJv).toBe('Ratu');
      expect(evaluateB01(10, 11).labelJv).toBe('Jodoh');
      expect(evaluateB01(15, 15).labelJv).toBe('Jodoh');
      expect(evaluateB01(11, 11).labelJv).toBe('Topo');
      expect(evaluateB01(15, 16).labelJv).toBe('Topo');
      expect(evaluateB01(11, 12).labelJv).toBe('Tinari');
      expect(evaluateB01(16, 16).labelJv).toBe('Tinari');
      expect(evaluateB01(12, 12).labelJv).toBe('Padu');
      expect(evaluateB01(16, 17).labelJv).toBe('Padu');
      expect(evaluateB01(12, 13).labelJv).toBe('Sujanan');
      expect(evaluateB01(17, 17).labelJv).toBe('Sujanan');
      expect(evaluateB01(13, 13).labelJv).toBe('Pesthi');
      expect(evaluateB01(17, 18).labelJv).toBe('Pesthi');
    });
  });

  describe('B-02: Popular 7-Category Couple Rule (mod 7 Bale Kedhawang)', () => {
    it('evaluates mod 7 correctly: 29 -> Pisang Pinanggel, 28 -> Bale Kedhawang, 30 -> Tebu Manteb', () => {
      const res29 = evaluateB02(14, 15);
      expect(res29.labelJv).toBe('Pisang Pinanggel');

      const res28 = evaluateB02(14, 14);
      expect(res28.labelJv).toBe('Bale Kedhawang');
      expect(res28.verdict).toBe('pass');

      const res30 = evaluateB02(15, 15);
      expect(res30.labelJv).toBe('Tebu Manteb');
      expect(res30.verdict).toBe('pass');
    });
  });

  describe('J-15: Pasatohan 9x9 (Betaljemur No. 15)', () => {
    it('verifies the Betaljemur worked example: Jumat Kliwon (14 -> 5) x Jumat Pahing (15 -> 6)', () => {
      const res = evaluateJ15(14, 15);
      expect(res.labelJv).toBe('5, 6');
      expect(res.explanationId).toContain('cepak rijekiné');
      expect(res.verdict).toBe('pass');
    });

    it('verifies cell 7,9 tulus palakramané is pass (corrected from false fail)', () => {
      const res = evaluateJ15(7, 9);
      expect(res.labelJv).toBe('7, 9');
      expect(res.verdict).toBe('pass');
      expect(res.explanationId).toContain('tulus palakramané');
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
      expect(res.explanationId).toContain('(13 + 17 = 30) mod 4 = 2');
    });
  });

  describe('J-17: Saptawara Pairs (Betaljemur No. 17)', () => {
    it('evaluates weekday pair compatibility including Monday (Senin) pairs', () => {
      // Akad (0) x Jumuah (5) -> yuwana (pass)
      const res1 = evaluateJ17(0, 5);
      expect(res1.labelJv).toBe('Ahad & Jumat');
      expect(res1.verdict).toBe('pass');

      // Selasa (2) x Jumuah (5) -> pegat (fail)
      const res2 = evaluateJ17(2, 5);
      expect(res2.verdict).toBe('fail');
      expect(res2.explanationId).toContain('pegat');

      // Senin (1) x Senin (1) -> ala (fail)
      const resSenin1 = evaluateJ17(1, 1);
      expect(resSenin1.labelJv).toBe('Senin & Senin');
      expect(resSenin1.verdict).toBe('fail');

      // Senin (1) x Selasa (2) -> yuwana (pass)
      const resSenin2 = evaluateJ17(1, 2);
      expect(resSenin2.verdict).toBe('pass');

      // Senin (1) x Sabtu (6) -> berkat (pass)
      const resSenin6 = evaluateJ17(1, 6);
      expect(resSenin6.verdict).toBe('pass');
      expect(resSenin6.explanationId).toContain('berkat');
    });
  });

  describe('J-22: Pancasuda Salaki Rabi (Betaljemur No. 22)', () => {
    it('verifies Betaljemur worked examples on p. 17: 31 -> Wasésasegara and 28 -> Lebu Katiup Angin', () => {
      // Rebo Paing (16) + Kemis Pon (15) = 31 -> 31 mod 10 = 1 -> Wasésasegara (pass)
      const res31 = evaluateJ22(16, 15);
      expect(res31.labelJv).toBe('Wasésasegara');
      expect(res31.verdict).toBe('pass');
      expect(res31.explanationId).toContain('dibagi 10 sisa 1 -> Wasésasegara');

      // Sum = 28 -> 28 mod 10 = 8 (> 7) -> 28 mod 7 = 0/7 -> Lebu Katiup Angin (fail)
      const res28 = evaluateJ22(14, 14);
      expect(res28.labelJv).toBe('Lebu Katiup Angin');
      expect(res28.verdict).toBe('fail');
      expect(res28.explanationId).toContain('dibagi 7 sisa 7 -> Lebu Katiup Angin');
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

  describe('J-24 & J-25: Birth Coordinate Rules (Betaljemur No. 24 & 25)', () => {
    it('verifies Betaljemur worked example on p. 18: Rebo Kliwon Sura 20 Alip x Jumat Pon Sapar 14 Wawu', () => {
      // Rebo Kliwon: neptu 7 + 8 = 15; Sura: 7; Day: 20; Alip: 1 -> Coord = 43
      const groomWeton: Weton = { dayIndex: 3, pasaranIndex: 4, neptu: 15 };
      const groomJav: JavaneseDate = {
        day: 20,
        sasi: 'Sura',
        sasiIndex: 0,
        year: 1867,
        tahun: 'Alip',
        kurup: 'Asapon',
        isLongYear: false,
      };

      // Jumat Pon: neptu 6 + 7 = 13; Sapar: 2; Day: 14; Wawu: 6 -> Coord = 35
      const brideWeton: Weton = { dayIndex: 5, pasaranIndex: 2, neptu: 13 };
      const brideJav: JavaneseDate = {
        day: 14,
        sasi: 'Sapar',
        sasiIndex: 1,
        year: 1873,
        tahun: 'Wawu',
        kurup: 'Asapon',
        isLongYear: false,
      };

      // Total = 43 + 35 = 78
      // J-24: 78 mod 9 = 6 -> Pangantèn (pass)
      const res24 = evaluateJ24(groomWeton, groomJav, brideWeton, brideJav);
      expect(res24.labelJv).toBe('Pangantèn');
      expect(res24.verdict).toBe('pass');

      // J-25: 78 mod 3 = 0/3 -> Pati (fail)
      const res25 = evaluateJ25(groomWeton, groomJav, brideWeton, brideJav);
      expect(res25.labelJv).toBe('Pati');
      expect(res25.verdict).toBe('fail');
    });
  });

  describe('Cultural Taboos (Gehing, Jilu, Tunggal Weton)', () => {
    it('identifies Gehing (Wage x Pahing) and Tunggal Weton', () => {
      const wageWeton: Weton = { dayIndex: 3, pasaranIndex: 3, neptu: 11 }; // Rabu Wage
      const pahingWeton: Weton = { dayIndex: 4, pasaranIndex: 1, neptu: 17 }; // Kamis Pahing

      const taboos = evaluateCulturalTaboos(wageWeton, pahingWeton, 1, 3);
      const gehing = taboos.find((t) => t.id === 'gehing');
      const jilu = taboos.find((t) => t.id === 'jilu');
      const tunggal = taboos.find((t) => t.id === 'tunggal_weton');

      expect(gehing?.isTriggered).toBe(true);
      expect(jilu?.isTriggered).toBe(true);
      expect(jilu?.isApplicable).toBe(true);
      expect(tunggal?.isTriggered).toBe(false);

      // Without child order, Jilu is not applicable
      const taboosNoOrder = evaluateCulturalTaboos(wageWeton, pahingWeton);
      const jiluNoOrder = taboosNoOrder.find((t) => t.id === 'jilu');
      expect(jiluNoOrder?.isApplicable).toBe(false);
      expect(jiluNoOrder?.isTriggered).toBe(false);
      expect(jiluNoOrder?.advice).toContain('Data urutan kelahiran anak belum diisi');
    });
  });
});
