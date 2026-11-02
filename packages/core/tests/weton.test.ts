import { describe, expect, it } from 'vitest';
import { getWetonFromJdn, getWetonFromGregorian, formatWeton } from '../src/calendar/weton.js';

describe('Weton Calculation', () => {
  it('correctly calculates Golden Anchors A-01 through A-04', () => {
    // A-01: 1945-08-17 -> Jumat Legi (neptu 6 + 5 = 11)
    const w1 = getWetonFromJdn(2431685);
    expect(w1).toEqual({ dayIndex: 5, pasaranIndex: 0, neptu: 11, dayName: 'Jumat', pasaranName: 'Legi' });
    expect(formatWeton(w1)).toBe('Jumat Legi');

    // A-02: 1936-03-24 -> Selasa Pon (neptu 3 + 7 = 10)
    const w2 = getWetonFromJdn(2428252);
    expect(w2).toEqual({ dayIndex: 2, pasaranIndex: 2, neptu: 10, dayName: 'Selasa', pasaranName: 'Pon' });
    expect(formatWeton(w2)).toBe('Selasa Pon');

    // A-03: 2052-08-25 -> Ahad Legi (neptu 5 + 5 = 10)
    const w3 = getWetonFromJdn(2470775);
    expect(w3).toEqual({ dayIndex: 0, pasaranIndex: 0, neptu: 10, dayName: 'Ahad', pasaranName: 'Legi' });
    expect(formatWeton(w3)).toBe('Ahad Legi');

    // A-04: 2052-08-26 -> Senin Pahing (neptu 4 + 9 = 13)
    const w4 = getWetonFromJdn(2470776);
    expect(w4).toEqual({ dayIndex: 1, pasaranIndex: 1, neptu: 13, dayName: 'Senin', pasaranName: 'Pahing' });
    expect(formatWeton(w4)).toBe('Senin Pahing');
  });

  it('computes weton directly from Gregorian date', () => {
    const w = getWetonFromGregorian(1945, 8, 17);
    expect(w).toEqual({ dayIndex: 5, pasaranIndex: 0, neptu: 11, dayName: 'Jumat', pasaranName: 'Legi' });
    expect(formatWeton(w)).toBe('Jumat Legi');
  });

  it('handles negative or large values safely with non-negative modulo', () => {
    const wZero = getWetonFromJdn(0);
    expect(wZero.dayIndex).toBeGreaterThanOrEqual(0);
    expect(wZero.dayIndex).toBeLessThan(7);
    expect(wZero.pasaranIndex).toBeGreaterThanOrEqual(0);
    expect(wZero.pasaranIndex).toBeLessThan(5);
  });
});
