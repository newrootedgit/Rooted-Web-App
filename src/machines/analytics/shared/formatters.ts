import type { AnalyticsRange } from './types';

export function formatInteger(value: number | null | undefined) {
  return Math.round(value ?? 0).toLocaleString('en-US');
}

export function formatDecimal(value: number | null | undefined, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatDurationMs(value: number | null | undefined) {
  if (!value) return '0m';
  const totalMinutes = Math.max(0, Math.round(value / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatTimestamp(value: string | Date | null | undefined) {
  if (!value) return 'Never';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatAxisTime(value: string, range: AnalyticsRange) {
  const date = new Date(value);
  if (range === '24h') {
    return date.toLocaleTimeString('en-US', { hour: 'numeric' });
  }
  if (range === '7d') {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function tooltipLabel(value: unknown) {
  if (typeof value !== 'string') return '';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function baseTooltipProps() {
  return {
    contentStyle: {
      background: 'var(--popover)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      color: 'var(--popover-foreground)',
    },
    labelStyle: { color: 'var(--foreground)' },
    labelFormatter: tooltipLabel,
  };
}
