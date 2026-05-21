import { useEffect, useMemo, useState } from 'react';
import {
  Clock3,
  Layers,
  Loader2,
  RefreshCw,
  Timer,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { trpc } from '../../lib/trpc';
import type { AnalyticsData, AnalyticsRange, AnalyticsSection } from './shared/types';
import { RANGES } from './shared/types';
import {
  formatDecimal,
  formatDurationMs,
  formatInteger,
  formatTimestamp,
} from './shared/formatters';
import { KpiCell, KpiStrip } from './shared/chartHelpers';
import { UsageCharts } from './sections/UsageCharts';
import { OutputCharts } from './sections/OutputCharts';
import { LifespanCards } from './sections/LifespanCards';

function getSections(machineType: 'SEEDER' | 'HARVESTER' | 'OTHER' | undefined): Array<{ id: AnalyticsSection; label: string; icon: LucideIcon }> {
  const isSeeder = machineType === 'SEEDER';
  const hasLifespan = machineType === 'SEEDER' || machineType === 'HARVESTER';
  return [
    { id: 'usage', label: 'Usage', icon: Clock3 },
    ...(isSeeder ? [{ id: 'output' as const, label: 'Output', icon: Layers }] : []),
    ...(hasLifespan ? [{ id: 'lifespan' as const, label: 'Lifespan', icon: Wrench }] : []),
  ];
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
  if (section === 'lifespan') {
    return <LifespanCards machineId={data.machine.id} />;
  }

  if (data.source === 'unavailable') {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Telemetry analytics are unavailable because TimescaleDB is not configured or could not be reached.
      </div>
    );
  }

  if (section === 'output') return <OutputCharts data={data} range={range} />;
  return <UsageCharts data={data} range={range} />;
}

export default function MachineAnalytics() {
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
    () => machineOptions.find((machine) => machine.id === selectedMachineId),
    [machineOptions, selectedMachineId]
  );

  const data = analyticsQuery.data;
  const summary = data?.summary;
  const machineType = data?.machine.type;
  const isSeeder = machineType === 'SEEDER';
  const sections = useMemo(() => getSections(machineType), [machineType]);

  useEffect(() => {
    if (!isSeeder && section === 'output') setSection('usage');
    if (machineType === 'OTHER' && section === 'lifespan') setSection('usage');
  }, [isSeeder, machineType, section]);

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
        <p className="mt-2 text-sm text-muted-foreground">Add a machine before viewing telemetry analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Machine Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedMachine ? `${selectedMachine.displayName || selectedMachine.name} | ${selectedMachine.deviceId}` : 'Select a machine'}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={selectedMachineId}
            onChange={(event) => setSelectedMachineId(event.target.value)}
            className="h-10 min-w-64 rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary"
          >
            {machineOptions.map((machine) => (
              <option key={machine.id} value={machine.id}>
                {machine.displayName || machine.name}
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
          {sections.map((item) => {
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
          {section !== 'lifespan' && (
            <KpiStrip>
              {section === 'output' ? (
                <KpiCell icon={Layers} label="Trays" value={formatInteger(summary.totalTrays)} subValue={`${formatDecimal(summary.traysPerMotorHour, 2)} trays/hr`} />
              ) : (
                <>
                  <KpiCell icon={Clock3} label="Runtime" value={formatDurationMs(summary.beltMotorUptimeMs + summary.bladeMotorUptimeMs + summary.rollerMotorUptimeMs)} subValue={`Last seen ${formatTimestamp(data.machine.lastSeenAt)}`} />
                  <KpiCell icon={Timer} label="Labor Saved" value={formatDurationMs(summary.laborMinutesSaved * 60000)} subValue="vs. manual process" />
                </>
              )}
            </KpiStrip>
          )}

          <AnalyticsBody data={data} range={range} section={section} />
        </>
      )}
    </div>
  );
}
