export class CalendarRangeError extends Error {
  readonly code = 'ERR_CALENDAR_RANGE' as const;

  constructor(readonly jdn: number) {
    super(`JDN ${jdn} is outside the supported Javanese range (from 1 Sura 1747 J / 1819-10-20).`);
    this.name = 'CalendarRangeError';
  }
}
