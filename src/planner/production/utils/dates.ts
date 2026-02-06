export type CalendarView = 'day' | 'week' | 'month';

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function startOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  return startOfDay(addDays(date, diff));
}

export function endOfWeek(date: Date): Date {
  return addDays(startOfWeek(date), 6);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function toInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
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
  return new Date(`${value}T00:00:00`);
}

export function getDateRangeForView(view: CalendarView, anchorDate: Date): { start: Date; end: Date } {
  if (view === 'day') {
    const start = startOfDay(anchorDate);
    return { start, end: start };
  }
  if (view === 'week') {
    return { start: startOfWeek(anchorDate), end: endOfWeek(anchorDate) };
  }
  return { start: startOfMonth(anchorDate), end: endOfMonth(anchorDate) };
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

export function formatShortDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatLongDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
