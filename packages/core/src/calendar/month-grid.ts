import type {
  DayPoint,
  JavaneseReckoning,
  SaptawaraIndex,
} from '../types.js';
import { getHijriDatesForDay } from './hijri.js';
import { jdnToJavanese } from './javanese.js';
import { gregorianToJdn, jdnToGregorian } from './jdn.js';
import { getPawukonFromJdn } from './pawukon.js';
import { getWetonFromJdn, mod } from './weton.js';

export interface MonthGridCell {
  readonly day: DayPoint;
  readonly isCurrentMonth: boolean;
  readonly isWeekend: boolean;
}

export interface MonthGrid {
  readonly year: number;
  readonly month: number;
  readonly firstWeekday: SaptawaraIndex;
  readonly cells: readonly MonthGridCell[]; // exactly 42 cells
}

/**
 * Builds a complete DayPoint representing all calendar coordinate systems for a given JDN.
 */
export function getDayPoint(
  jdn: number,
  reckoning: JavaneseReckoning = 'kurup'
): DayPoint {
  const gregorian = jdnToGregorian(jdn);
  const weton = getWetonFromJdn(jdn);
  const javanese = jdnToJavanese(jdn, reckoning);
  const pawukon = getPawukonFromJdn(jdn);
  const hijri = getHijriDatesForDay(jdn);

  return {
    jdn,
    gregorian,
    weton,
    javanese,
    pawukon,
    hijri,
  };
}

/**
 * Generates a full 42-cell (6 rows x 7 days) calendar grid for a given Gregorian month and year.
 *
 * @param year Gregorian year (e.g. 2026)
 * @param month Gregorian month (1..12)
 * @param firstWeekday Starting weekday column (0 = Ahad/Sunday, 1 = Senin/Monday). Default is 0.
 * @param reckoning 'kurup' (default) or 'aboge'
 */
export function generateMonthGrid(
  year: number,
  month: number,
  firstWeekday: SaptawaraIndex = 0,
  reckoning: JavaneseReckoning = 'kurup'
): MonthGrid {
  const firstOfMonthJdn = gregorianToJdn(year, month, 1);
  const firstOfMonthWeton = getWetonFromJdn(firstOfMonthJdn);

  const offset = mod(firstOfMonthWeton.dayIndex - firstWeekday, 7);
  const gridStartJdn = firstOfMonthJdn - offset;

  const cells: MonthGridCell[] = [];

  for (let i = 0; i < 42; i++) {
    const currentJdn = gridStartJdn + i;
    const day = getDayPoint(currentJdn, reckoning);
    const isCurrentMonth =
      day.gregorian.year === year && day.gregorian.month === month;
    const isWeekend = day.weton.dayIndex === 6 || day.weton.dayIndex === 0;

    cells.push({
      day,
      isCurrentMonth,
      isWeekend,
    });
  }

  return {
    year,
    month,
    firstWeekday,
    cells: Object.freeze(cells),
  };
}
