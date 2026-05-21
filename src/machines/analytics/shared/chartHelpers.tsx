import { Activity } from 'lucide-react';
import type { AnalyticsData } from './types';
import { formatTimestamp } from './formatters';

// Tableau 10 palette — more saturation than matplotlib, reads well at small sizes
export const chartColors = {
  primary: '#4E79A7', // blue
  accent: '#F28E2B',  // orange
  third: '#59A14F',   // green
  warning: '#EDC948', // yellow
  purple: '#B07AA1',
  cyan: '#76B7B2',
  pink: '#FF6B9D',
  danger: '#E15759',  // red
  muted: '#9C755F',   // brown
};

export function KpiCell({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="flex-1 px-5 py-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon size={14} />
        {label}
      </div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      {subValue && <div className="mt-1 text-sm text-muted-foreground">{subValue}</div>}
    </div>
  );
}

export function KpiStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card md:flex-row md:divide-x md:divide-y-0">
      {children}
    </div>
  );
}

export function ChartPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="h-72 min-w-0">{children}</div>
    </div>
  );
}

export function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border bg-secondary/30 text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function SectionHeading({ icon: Icon, title, subtitle }: { icon: typeof Activity; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-muted-foreground" />
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {subtitle && <span className="text-sm text-muted-foreground">| {subtitle}</span>}
    </div>
  );
}

export function EventList({ data }: { data: AnalyticsData }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-base font-semibold text-foreground">Recent Events</h3>
        <p className="text-sm text-muted-foreground">Latest telemetry events in the selected range</p>
      </div>
      <div className="max-h-72 overflow-auto">
        {data.events.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-border bg-secondary/30 text-sm text-muted-foreground">
            No events for this range
          </div>
        ) : (
          <div className="space-y-2">
            {data.events.map((event) => (
              <div key={event.id} className="flex items-start justify-between gap-3 rounded-md border border-border bg-secondary/40 p-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{event.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {event.motor ? `${event.motor} motor` : event.type.replace('_', ' ')}
                    {event.torquePct !== null ? ` | ${event.torquePct}% torque` : ''}
                  </div>
                </div>
                <div className="shrink-0 text-right text-xs text-muted-foreground">
                  {formatTimestamp(event.occurredAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function StackOutline(props: any) {
  const items = (props.formattedGraphicalItems ?? []).filter(
    (item: any) =>
      Array.isArray(item?.props?.data) &&
      item.props.data.length > 0 &&
      typeof item.props.data[0]?.x === 'number' &&
      typeof item.props.data[0]?.height === 'number'
  );
  if (items.length === 0) return null;

  const categoryCount = items[0]?.props?.data?.length ?? 0;
  const rects: Array<{ x: number; y: number; width: number; height: number }> = [];

  for (let i = 0; i < categoryCount; i++) {
    let minY = Infinity;
    let maxY = -Infinity;
    let x = 0;
    let width = 0;
    for (const item of items) {
      const seg = item.props.data[i];
      if (!seg || seg.height <= 0) continue;
      x = seg.x;
      width = seg.width;
      minY = Math.min(minY, seg.y);
      maxY = Math.max(maxY, seg.y + seg.height);
    }
    if (minY < maxY) {
      rects.push({ x, y: minY, width, height: maxY - minY });
    }
  }

  return (
    <g pointerEvents="none">
      {rects.map((r, idx) => (
        <rect
          key={idx}
          x={r.x}
          y={r.y}
          width={r.width}
          height={r.height}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={1.25}
        />
      ))}
    </g>
  );
}
