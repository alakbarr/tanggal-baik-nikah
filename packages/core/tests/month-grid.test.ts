import { describe, expect, it } from 'vitest';
import { generateMonthGrid, getDayPoint } from '../src/calendar/month-grid.js';

describe('Month Grid (42-cell matrix)', () => {
  it('constructs a complete DayPoint for a given date', () => {
    // 2026-11-02 -> Monday Pon
    const dp = getDayPoint(2461347);
    expect(dp.jdn).toBe(2461347);
    expect(dp.gregorian).toEqual({ year: 2026, month: 11, day: 2 });
    expect(dp.weton.dayIndex).toBe(1); // Senin
    expect(dp.weton.pasaranIndex).toBe(2); // Pon
    expect(dp.javanese.sasi).toBe('Jumadilawal');
    expect(dp.javanese.day).toBe(21);
    expect(dp.pawukon.wuku).toBe('Sinta');
  });

  it('generates 42-cell grid with configurable first weekday for November 2026', () => {
    // With firstWeekday = 0 (Ahad)
    const gridAhad = generateMonthGrid(2026, 11, 0);
    expect(gridAhad.cells.length).toBe(42);

    // 1 Nov 2026 is Ahad -> cell 0 must be 1 Nov 2026
    const firstCellAhad = gridAhad.cells[0];
    expect(firstCellAhad).toBeDefined();
    expect(firstCellAhad?.isCurrentMonth).toBe(true);
    expect(firstCellAhad?.day.gregorian).toEqual({ year: 2026, month: 11, day: 1 });

    // November has 30 days -> in-month cells are exactly 30
    const inMonthCellsAhad = gridAhad.cells.filter((c) => c.isCurrentMonth);
    expect(inMonthCellsAhad.length).toBe(30);

    // With firstWeekday = 1 (Senin)
    const gridSenin = generateMonthGrid(2026, 11, 1);
    expect(gridSenin.cells.length).toBe(42);

    // 1 Nov 2026 (Ahad) must be at index 6
    const sundayCell = gridSenin.cells[6];
    expect(sundayCell).toBeDefined();
    expect(sundayCell?.isCurrentMonth).toBe(true);
    expect(sundayCell?.day.gregorian).toEqual({ year: 2026, month: 11, day: 1 });

    // Cells 0..5 must be October (previous month)
    expect(gridSenin.cells[0]?.isCurrentMonth).toBe(false);
    expect(gridSenin.cells[0]?.day.gregorian.month).toBe(10);
    expect(gridSenin.cells[5]?.isCurrentMonth).toBe(false);
    expect(gridSenin.cells[5]?.day.gregorian.month).toBe(10);
  });
});
