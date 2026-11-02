import { describe, expect, it } from 'vitest';
import { getSunsetTime, getEffectiveJdnForBirth } from '../src/calendar/sunset.js';
import { gregorianToJdn } from '../src/calendar/jdn.js';
import { getWetonFromJdn } from '../src/calendar/weton.js';

describe('NOAA Solar Sunset Algorithm', () => {
  it('computes Yogyakarta sunset within expected civil sunset window (17:25 - 18:05 WIB)', () => {
    // 2026-11-02 (early November)
    const sNov = getSunsetTime(2026, 11, 2);
    expect(sNov.hours).toBe(17);
    expect(sNov.minutes).toBeGreaterThanOrEqual(30);
    expect(sNov.minutes).toBeLessThanOrEqual(40);

    // 2024-07-08 (early July)
    const sJul = getSunsetTime(2024, 7, 8);
    expect(sJul.hours).toBe(17);
    expect(sJul.minutes).toBeGreaterThanOrEqual(30);
    expect(sJul.minutes).toBeLessThanOrEqual(40);

    // 2025-01-15 (mid January: later sunset)
    const sJan = getSunsetTime(2025, 1, 15);
    expect(sJan.hours).toBe(18);
    expect(sJan.minutes).toBeGreaterThanOrEqual(0);
    expect(sJan.minutes).toBeLessThanOrEqual(10);
  });

  it('correctly shifts JDN and weton by +1 for births occurring after sunset', () => {
    // Born on 1945-08-17 at 14:00 (daytime) -> Friday Legi
    const jdnDay = getEffectiveJdnForBirth({ year: 1945, month: 8, day: 17 }, { hours: 14, minutes: 0 });
    expect(jdnDay).toBe(gregorianToJdn(1945, 8, 17));
    expect(getWetonFromJdn(jdnDay).dayIndex).toBe(5); // Jumat

    // Born on 1945-08-17 at 20:00 (after sunset ~17:35 WIB) -> Saturday Pahing
    const jdnNight = getEffectiveJdnForBirth({ year: 1945, month: 8, day: 17 }, { hours: 20, minutes: 0 });
    expect(jdnNight).toBe(gregorianToJdn(1945, 8, 17) + 1);
    expect(getWetonFromJdn(jdnNight).dayIndex).toBe(6); // Sabtu
    expect(getWetonFromJdn(jdnNight).pasaranIndex).toBe(1); // Pahing
  });

  it('accepts custom boolean flag birthAfterSunset', () => {
    const jdnFlagTrue = getEffectiveJdnForBirth({ year: 1945, month: 8, day: 17 }, undefined, true);
    expect(jdnFlagTrue).toBe(gregorianToJdn(1945, 8, 17) + 1);

    const jdnFlagFalse = getEffectiveJdnForBirth({ year: 1945, month: 8, day: 17 }, undefined, false);
    expect(jdnFlagFalse).toBe(gregorianToJdn(1945, 8, 17));
  });
});
