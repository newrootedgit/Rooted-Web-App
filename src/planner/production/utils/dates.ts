export type CalendarView = 'day' | 'week' | 'month';

// All date helpers use noon UTC to avoid timezone day-boundary shifts.
// Noon UTC is safe: even UTC+14 / UTC-12 stay on the same calendar date.

export function startOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12));
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

export function startOfWeek(date: Date): Date {
  const day = date.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  return startOfDay(addDays(date, diff));
}

export function endOfWeek(date: Date): Date {
  return addDays(startOfWeek(date), 6);
}

export function startOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 12));
}

export function endOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 12));
}

export function toInputDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toDateKey(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return toInputDate(date);
}

export function parseDateInput(value: string): Date {
  return new Date(`${value}T12:00:00Z`);
}

export function getDateRangeForView(view: CalendarView, anchorDate: Date): { start: Date; end: Date } {
  if (view === 'day') {
    const start = startOfDay(anchorDate);
    return { start, end: start };
  }
  if (view === 'week') {
    return { start: startOfWeek(anchorDate), end: endOfWeek(anchorDate) };
  }
  return { start: startOfWeek(startOfMonth(anchorDate)), end: endOfWeek(endOfMonth(anchorDate)) };
}

export function listDaysBetween(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  let current = startOfDay(start);
  const last = startOfDay(end);
  while (current <= last) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }
  return days;
}

export function getDayOfWeekHeaders(): string[] {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}

export function getMonthGridDays(anchorDate: Date): Date[] {
  const first = startOfMonth(anchorDate);
  const last = endOfMonth(anchorDate);
  const gridStart = startOfWeek(first);
  const gridEnd = endOfWeek(last);
  return listDaysBetween(gridStart, gridEnd);
}

export function formatShortDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatLongDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
