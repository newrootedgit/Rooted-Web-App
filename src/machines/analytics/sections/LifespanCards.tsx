import { useState } from 'react';
import { AlertTriangle, Wrench, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

interface LifespanCardsProps {
  machineId: string;
}

type PartStatus = 'OK' | 'WARNING' | 'CRITICAL';

const STATUS_CONFIG: Record<PartStatus, {
  label: string;
  pill: string;
  bar: string;
  icon: typeof CheckCircle2;
}> = {
  OK: {
    label: 'OK',
    pill: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    bar: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  WARNING: {
    label: 'Warning',
    pill: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    bar: 'bg-amber-500',
    icon: AlertTriangle,
  },
  CRITICAL: {
    label: 'Critical',
    pill: 'bg-red-500/10 text-red-600 border-red-500/30',
    bar: 'bg-red-500',
    icon: AlertCircle,
  },
};

function formatUsage(value: number, metric: 'HOURS' | 'CYCLES') {
  if (metric === 'HOURS') {
    if (value < 1) return `${Math.round(value * 60)}m`;
    return `${value.toFixed(1)}h`;
  }
  return `${Math.round(value).toLocaleString('en-US')} cycles`;
}

function formatDaysRemaining(days: number | null) {
  if (days === null) return 'Calculating…';
  if (days <= 0) return 'Past lifespan';
  if (days < 7) return `~${days} day${days === 1 ? '' : 's'} remaining`;
  if (days < 60) return `~${Math.round(days / 7)} weeks remaining`;
  if (days < 365) return `~${Math.round(days / 30)} months remaining`;
  return `~${(days / 365).toFixed(1)} years remaining`;
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function LifespanCards({ machineId }: LifespanCardsProps) {
  const partsQuery = trpc.machineParts.list.useQuery(
    { machineId },
    { enabled: !!machineId, staleTime: 60 * 1000, refetchOnWindowFocus: false }
  );

  if (partsQuery.isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-muted-foreground">
        <Loader2 size={24} className="mr-2 animate-spin" />
        Loading parts
      </div>
    );
  }

  if (partsQuery.error) {
    return (
      <div className="rounded-lg border border-destructive bg-card p-4 text-sm text-destructive">
        {partsQuery.error.message}
      </div>
    );
  }

  const data = partsQuery.data;
  if (!data || data.parts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        No part lifespan tracking available for this machine type.
      </div>
    );
  }

  const criticalCount = data.parts.filter((p) => p.status === 'CRITICAL').length;
  const warningCount = data.parts.filter((p) => p.status === 'WARNING').length;
  const showBanner = criticalCount + warningCount > 0;

  return (
    <div className="space-y-4">
      {showBanner && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />
          <div className="text-sm">
            <div className="font-semibold text-foreground">
              {criticalCount > 0 && `${criticalCount} critical`}
              {criticalCount > 0 && warningCount > 0 && ', '}
              {warningCount > 0 && `${warningCount} warning${warningCount === 1 ? '' : 's'}`}
            </div>
            <div className="text-muted-foreground">
              Replace parts that have reached their lifespan to clear alerts.
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.parts.map((part) => (
          <PartCard key={part.id} machineId={machineId} part={part} />
        ))}
      </div>
    </div>
  );
}

interface Part {
  id: string;
  name: string;
  metric: 'HOURS' | 'CYCLES';
  lifespan: number;
  installedAt: string;
  lastReplacedAt: string | null;
  usageSoFar: number;
  wearPct: number;
  status: PartStatus;
  estimatedDaysRemaining: number | null;
}

function PartCard({ machineId, part }: { machineId: string; part: Part }) {
  const trpcUtils = trpc.useUtils();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const replaceMutation = trpc.machineParts.replace.useMutation({
    onSuccess: () => {
      trpcUtils.machineParts.list.invalidate({ machineId });
      setConfirmOpen(false);
    },
  });

  const cfg = STATUS_CONFIG[part.status];
  const StatusIcon = cfg.icon;
  const tooltip = `${formatUsage(part.usageSoFar, part.metric)} / ${formatUsage(part.lifespan, part.metric)}`;
  const displayPct = Math.min(100, part.wearPct);
  const replacedDate = formatDate(part.lastReplacedAt) ?? formatDate(part.installedAt);
  const replacedLabel = part.lastReplacedAt ? 'Replaced' : 'Installed';

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">{part.name}</h3>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.pill}`}>
          <StatusIcon size={12} />
          {cfg.label}
        </span>
      </div>

      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">Wear</span>
        <span className="font-semibold text-foreground">{part.wearPct.toFixed(1)}%</span>
      </div>
      <div
        title={tooltip}
        className="mb-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div
          className={`h-full rounded-full transition-all ${cfg.bar}`}
          style={{ width: `${Math.max(2, displayPct)}%` }}
        />
      </div>

      <div className="space-y-1 text-sm text-muted-foreground">
        <div>{formatDaysRemaining(part.estimatedDaysRemaining)}</div>
        {replacedDate && (
          <div>
            {replacedLabel} {replacedDate}
          </div>
        )}
      </div>

      <div className="mt-4">
        {confirmOpen ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={replaceMutation.isPending}
              onClick={() => replaceMutation.mutate({ machinePartId: part.id })}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-60"
            >
              {replaceMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Wrench size={14} />}
              Confirm
            </button>
            <button
              type="button"
              disabled={replaceMutation.isPending}
              onClick={() => setConfirmOpen(false)}
              className="inline-flex h-9 items-center rounded-md border border-border bg-secondary px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary px-3 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Wrench size={14} />
            Replace
          </button>
        )}
        {replaceMutation.error && (
          <div className="mt-2 text-xs text-destructive">{replaceMutation.error.message}</div>
        )}
      </div>
    </div>
  );
}
