import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Clock3,
  Gauge,
  Layers,
  Loader2,
  RefreshCw,
  Timer,
  Zap,
} from 'lucide-react';
import { trpc } from '../lib/trpc';
import type { AnalyticsRange, AnalyticsSection, AnalyticsData } from '../../machines/analytics/shared/types';
import { RANGES } from '../../machines/analytics/shared/types';
import {
  formatDecimal,
  formatDurationMs,
  formatInteger,
  formatTimestamp,
} from '../../machines/analytics/shared/formatters';
import { KpiCell, KpiStrip } from '../../machines/analytics/shared/chartHelpers';
import { UsageCharts } from '../../machines/analytics/sections/UsageCharts';
import { OutputCharts } from '../../machines/analytics/sections/OutputCharts';
import { HealthAndDiagnosticsCharts } from '../../machines/analytics/sections/HealthAndDiagnosticsCharts';

const SECTIONS: Array<{ id: AnalyticsSection; label: string; icon: typeof Activity }> = [
  { id: 'usage', label: 'Usage', icon: Clock3 },
  { id: 'output', label: 'Output', icon: Layers },
  { id: 'health', label: 'Health & Diagnostics', icon: Activity },
];

function machineOptionLabel(option: {
  displayName: string | null;
  name: string;
  tenantName: string | null;
  farmName: string | null;
}) {
  const machine = option.displayName || option.name;
  const parts = [option.tenantName, option.farmName, machine].filter(Boolean);
  return parts.join(' — ');
}

function AnalyticsBody({
  data,
  range,
  section,
}: {
  data: AnalyticsData;
  range: AnalyticsRange;
  section: AnalyticsSection;
}) {
  if (data.source === 'unavailable') {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Telemetry analytics are unavailable because TimescaleDB is not configured or could not be reached.
      </div>
    );
  }

  if (section === 'usage') return <UsageCharts data={data} range={range} />;
  if (section === 'output') return <OutputCharts data={data} range={range} />;
  return <HealthAndDiagnosticsCharts data={data} range={range} isAdmin={true} />;
}

export function MachineAnalyticsAdmin() {
  const [selectedMachineId, setSelectedMachineId] = useState<string>('');
  const [range, setRange] = useState<AnalyticsRange>('7d');
  const [section, setSection] = useState<AnalyticsSection>('usage');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  const machineOptionsQuery = trpc.machines.options.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const machineOptions = useMemo(
    () => machineOptionsQuery.data ?? [],
    [machineOptionsQuery.data]
  );

  useEffect(() => {
    if (!selectedMachineId && machineOptions.length > 0) {
      setSelectedMachineId(machineOptions[0].id);
    }
  }, [machineOptions, selectedMachineId]);

  const analyticsQuery = trpc.machines.analytics.useQuery(
    { machineId: selectedMachineId, range },
    {
      enabled: !!selectedMachineId,
      staleTime: 5 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (analyticsQuery.dataUpdatedAt) {
      setLastRefreshedAt(new Date(analyticsQuery.dataUpdatedAt));
    }
  }, [analyticsQuery.dataUpdatedAt]);

  const selectedMachine = useMemo(
    () => machineOptions.find((m) => m.id === selectedMachineId),
    [machineOptions, selectedMachineId]
  );

  const data = analyticsQuery.data;
  const summary = data?.summary;
  const isSeeder = data?.machine.type === 'SEEDER';

  useEffect(() => {
    if (!isSeeder && section === 'output') setSection('usage');
  }, [isSeeder, section]);

  const handleRefresh = async () => {
    await analyticsQuery.refetch();
    setLastRefreshedAt(new Date());
  };

  if (machineOptionsQuery.isLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center text-muted-foreground">
        <Loader2 size={24} className="mr-2 animate-spin" />
        Loading machines
      </div>
    );
  }

  if (machineOptions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Machine Analytics</h1>
        <p className="mt-2 text-sm text-muted-foreground">No machines available.</p>
      </div>
    );
  }

  const visibleSections = SECTIONS.filter((item) => item.id !== 'output' || isSeeder);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Machine Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedMachine
              ? `${machineOptionLabel(selectedMachine)} | ${selectedMachine.deviceId}`
              : 'Select a machine'}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={selectedMachineId}
            onChange={(event) => setSelectedMachineId(event.target.value)}
            className="h-10 min-w-72 rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary"
          >
            {machineOptions.map((machine) => (
              <option key={machine.id} value={machine.id}>
                {machineOptionLabel(machine)}
              </option>
            ))}
          </select>

          <div className="inline-flex h-10 rounded-md border border-border bg-secondary p-1">
            {RANGES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRange(item.id)}
                className={`min-w-12 rounded px-3 text-sm font-medium transition-colors ${
                  range === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={analyticsQuery.isFetching}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-3 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
          >
            {analyticsQuery.isFetching ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-y border-border py-3 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex w-full rounded-md border border-border bg-secondary p-1 md:w-auto">
          {visibleSections.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors md:flex-none ${
                  section === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon size={16} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="text-sm text-muted-foreground">
          {data?.source === 'raw' && 'Using bounded raw telemetry fallback | '}
          {data?.source === 'demo' && 'Demo telemetry | '}
          Last refreshed {lastRefreshedAt ? formatTimestamp(lastRefreshedAt) : 'Never'}
        </div>
      </div>

      {analyticsQuery.error && (
        <div className="rounded-lg border border-destructive bg-card p-4 text-sm text-destructive">
          {analyticsQuery.error.message}
        </div>
      )}

      {analyticsQuery.isLoading || !data || !summary ? (
        <div className="flex min-h-[360px] items-center justify-center text-muted-foreground">
          <Loader2 size={24} className="mr-2 animate-spin" />
          Loading analytics
        </div>
      ) : (
        <>
          <KpiStrip>
            {section === 'usage' ? (
              <>
                <KpiCell icon={Clock3} label="Runtime" value={formatDurationMs(summary.beltMotorUptimeMs + summary.bladeMotorUptimeMs + summary.rollerMotorUptimeMs)} subValue={`Last seen ${formatTimestamp(data.machine.lastSeenAt)}`} />
                <KpiCell icon={Timer} label="Labor Saved" value={formatDurationMs(summary.laborMinutesSaved * 60000)} subValue="vs. manual process" />
              </>
            ) : section === 'output' ? (
              <KpiCell icon={Layers} label="Trays" value={formatInteger(summary.totalTrays)} subValue={`${formatDecimal(summary.traysPerMotorHour, 2)} trays/hr`} />
            ) : (
              <>
                <KpiCell icon={AlertTriangle} label="Faults" value={formatInteger(summary.totalFaults)} subValue={`Belt ${summary.beltFaults} | Blade ${summary.bladeFaults}`} />
                <KpiCell icon={Zap} label="Alerts" value={formatInteger(summary.alertEvents)} subValue={`${summary.killSwitchEvents} kill switch samples`} />
                <KpiCell icon={Activity} label="Last Fault" value={data.events.find((event) => event.type === 'fault') ? formatTimestamp(data.events.find((event) => event.type === 'fault')!.occurredAt) : 'None'} subValue={data.events.find((event) => event.type === 'fault')?.label ?? 'No faults in this range'} />
                <KpiCell icon={Gauge} label="Avg Torque" value={summary.avgTorquePct === null ? 'N/A' : `${formatDecimal(summary.avgTorquePct, 1)}%`} subValue={summary.maxTorquePct === null ? 'Peak N/A' : `Peak ${formatDecimal(summary.maxTorquePct, 1)}%`} />
              </>
            )}
          </KpiStrip>

          <AnalyticsBody data={data} range={range} section={section} />
        </>
      )}
    </div>
  );
}
