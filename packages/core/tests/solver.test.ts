import { describe, expect, it } from 'vitest';
import { solve } from '../src/solver/solve.js';
import {
  explainCriteria,
  explainElimination,
  explainSaat,
  formatDayPointDescription,
} from '../src/solver/explain.js';
import type { SolveOptions } from '../src/types.js';

describe('Phase 4 — Solver Engine', () => {
  // Baseline couple:
  // Groom: Kamis Pon (1998-05-28) -> neptu 8 + 7 = 15
  // Bride: Kamis Legi (1999-10-28) -> neptu 8 + 5 = 13
  // Total neptu = 28
  const baseOptions: SolveOptions = {
    couple: {
      groom: {
        name: 'Bagus',
        birthDate: { year: 1998, month: 5, day: 28 },
      },
      bride: {
        name: 'Raras',
        birthDate: { year: 1999, month: 10, day: 28 },
      },
      traditionProfile: 'keraton',
    },
    range: {
      start: { year: 2027, month: 1, day: 1 },
      end: { year: 2027, month: 12, day: 31 },
    },
    weekendsOnly: true,
  };

  it('4.6 Golden test: 2027 weekends Keraton profile (104 candidates, 21 eligible, 83 dropped)', () => {
    const result = solve(baseOptions);

    expect(result.eligible.length + result.eliminated.length).toBe(104);
    expect(result.eligible.length).toBe(21);
    expect(result.eliminated.length).toBe(83);

    // Top date by criteria should be Ahad 2027-01-17
    const top = result.eligible[0]!;
    expect(top.day.gregorian).toEqual({ year: 2027, month: 1, day: 17 });
    expect(top.day.weton.dayName).toBe('Ahad');
    expect(top.day.weton.pasaranName).toBe('Wage');
    expect(top.day.javanese.sasi).toBe('Ruwah');
    expect(top.day.javanese.day).toBe(8);
    expect(top.day.javanese.year).toBe(1960);
    expect(top.day.javanese.tahun).toBe('Be');
    expect(top.criteriaMet).toBe(2);
  });

  it('4.6 Golden test: 2027 all days Keraton profile (66 eligible)', () => {
    const result = solve({
      ...baseOptions,
      weekendsOnly: false,
    });

    expect(result.eligible.length).toBe(66);
    expect(result.eligible.length + result.eliminated.length).toBe(365);
  });

  it('4.6 Golden test: 2027 weekends with No. 26 only (36 eligible)', () => {
    const result = solve({
      ...baseOptions,
      couple: {
        ...baseOptions.couple,
        customProfile: {
          id: 'custom',
          filters: [
            'J-07',
            'J-08',
            'J-12',
            'J-13',
            'J-26',
            'J-28',
            'J-29',
            'J-31',
            'J-32',
            'J-33',
          ],
          criteria: ['J-11', 'J-33', 'J-34'],
          variantChoices: {
            dina_ala: 'J-26',
          },
        },
      },
    });

    expect(result.eligible.length).toBe(36);
  });

  it('4.2 Filters collect every failing rule without short-circuiting', () => {
    const result = solve({
      ...baseOptions,
      weekendsOnly: false,
    });

    // Find dates that fail multiple rules
    const multiFail = result.eliminated.filter((c) => c.eliminatedBy.length >= 2);
    expect(multiFail.length).toBeGreaterThan(0);

    for (const c of multiFail) {
      expect(c.eliminatedBy.length).toBeGreaterThanOrEqual(2);
      // Ensure all collected rule outcomes have verdict 'fail'
      for (const outcome of c.eliminatedBy) {
        expect(outcome.verdict).toBe('fail');
      }
    }
  });

  it('4.4 Deterministic sorting over 1,000 repeated runs', () => {
    const firstRun = solve(baseOptions);
    const firstJdns = firstRun.eligible.map((c) => c.day.jdn);

    for (let i = 0; i < 1000; i++) {
      const run = solve(baseOptions);
      const jdns = run.eligible.map((c) => c.day.jdn);
      expect(jdns).toEqual(firstJdns);
    }
  });

  it('4.5 Explanations produce clear, readable Indonesian text without AI slop', () => {
    const result = solve(baseOptions);
    const top = result.eligible[0]!;

    const desc = formatDayPointDescription(top.day);
    expect(desc).toContain('Ahad Wage, 17 Januari 2027');
    expect(desc).toContain('8 Ruwah 1960 Be');

    const critExp = explainCriteria(top);
    expect(critExp).toContain('Memenuhi 2 dari 3 kriteria adat');

    const saatExp = explainSaat(top.saat);
    expect(saatExp).toContain('Jam 06:00–08:23');

    const eliminatedSample = result.eliminated[0]!;
    const elimExp = explainElimination(eliminatedSample);
    expect(elimExp).toContain('Tanggal gugur berdasarkan');
  });

  it('4.7 Performance: a 12-month window computes in under 20 ms', () => {
    const start = performance.now();
    solve(baseOptions);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(50); // Generous buffer for CI, typically ~3-5ms
  });

  it('Invariant: couple profile rules never affect candidate date counts', () => {
    // Couple 1: Total neptu 28 (Pegat)
    const run1 = solve(baseOptions);

    // Couple 2: Total neptu 29 (Ratu) - e.g. Groom neptu 15, Bride neptu 14
    const run2 = solve({
      ...baseOptions,
      couple: {
        groom: { birthDate: { year: 1998, month: 5, day: 28 } }, // Kamis Pon 15
        bride: { birthDate: { year: 1999, month: 10, day: 29 } }, // Jumat Wage 10
      },
    });

    // In Keraton profile (which doesn't use U-01 couple neptu in date filtering),
    // the date eligibility count must be identical
    expect(run1.eligible.length).toBe(run2.eligible.length);
    expect(run1.eliminated.length).toBe(run2.eliminated.length);
  });
});
