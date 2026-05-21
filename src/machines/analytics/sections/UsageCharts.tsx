import {
  Bar,
  BarChart,
  CartesianGrid,
  Customized,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AnalyticsData, AnalyticsPoint, AnalyticsRange } from '../shared/types';
import {
  formatAxisTime,
  formatDecimal,
  formatDurationMs,
  baseTooltipProps,
} from '../shared/formatters';
import { ChartPanel, EmptyChart, StackOutline, chartColors } from '../shared/chartHelpers';

function aggregateRuntimeSeries(series: AnalyticsPoint[], range: AnalyticsRange): AnalyticsPoint[] {
  const groupKey = (iso: string) => {
    const date = new Date(iso);
    if (range === '24h') {
      date.setMinutes(0, 0, 0);
    } else {
      date.setHours(0, 0, 0, 0);
    }
    return date.toISOString();
  };

  const groups = new Map<string, AnalyticsPoint>();
  for (const point of series) {
    const key = groupKey(point.bucket);
    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, { ...point, bucket: key });
    } else {
      existing.steps += point.steps;
      existing.trays += point.trays;
      existing.killSwitchCount += point.killSwitchCount;
      existing.alertCount += point.alertCount;
      existing.beltFaultCount += point.beltFaultCount;
      existing.bladeFaultCount += point.bladeFaultCount;
      existing.beltMotorDeltaMs += point.beltMotorDeltaMs;
      existing.bladeMotorDeltaMs += point.bladeMotorDeltaMs;
      existing.rollerMotorDeltaMs += point.rollerMotorDeltaMs;
    }
  }
  return Array.from(groups.values()).sort((a, b) => a.bucket.localeCompare(b.bucket));
}

export function UsageCharts({ data, range }: { data: AnalyticsData; range: AnalyticsRange }) {
  if (data.series.length === 0) return <EmptyChart message="No telemetry for this range" />;

  const isSeeder = data.machine.type === 'SEEDER';

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="xl:col-span-2">
            <ChartPanel title="Total Machine Usage" subtitle="Combined motor uptime over time">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={aggregateRuntimeSeries(data.series, range).map((point) => ({
                    ...point,
                    totalMotorMs: point.beltMotorDeltaMs + point.bladeMotorDeltaMs + point.rollerMotorDeltaMs,
                  }))}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                  <XAxis
                    dataKey="bucket"
                    tickFormatter={(value) => formatAxisTime(value, range)}
                    stroke="var(--muted-foreground)"
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickMargin={8}
                  />
                  <YAxis
                    tickFormatter={(value) => `${Math.round(Number(value) / 60000)}m`}
                    stroke="var(--muted-foreground)"
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                  <Tooltip {...baseTooltipProps()} formatter={(value) => formatDurationMs(Number(value))} />
                  <Line
                    type="monotone"
                    dataKey="totalMotorMs"
                    name="Total runtime"
                    stroke={chartColors.pink}
                    strokeWidth={2}
                    dot={{ r: 3, fill: chartColors.pink }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>
          </div>
          <div className="xl:col-span-2">
            <ChartPanel title="Runtime" subtitle={range === '24h' ? 'Per hour' : 'Per day'}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aggregateRuntimeSeries(data.series, range)} barCategoryGap="20%" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                  <XAxis
                    dataKey="bucket"
                    tickFormatter={(value) => formatAxisTime(value, range)}
                    stroke="var(--muted-foreground)"
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickMargin={8}
                  />
                  <YAxis
                    tickFormatter={(value) => `${Math.round(Number(value) / 60000)}m`}
                    stroke="var(--muted-foreground)"
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                  <Tooltip {...baseTooltipProps()} formatter={(value) => formatDurationMs(Number(value))} cursor={{ fill: 'var(--muted)', opacity: 0.15 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: 8 }} />
                  {data.series.some((point) => point.beltMotorDeltaMs > 0) && (
                    <Bar dataKey="beltMotorDeltaMs" stackId="motors" name="Belt" fill={chartColors.primary} maxBarSize={64} />
                  )}
                  {data.series.some((point) => point.bladeMotorDeltaMs > 0) && (
                    <Bar dataKey="bladeMotorDeltaMs" stackId="motors" name="Blade" fill={chartColors.accent} maxBarSize={64} />
                  )}
                  {data.series.some((point) => point.rollerMotorDeltaMs > 0) && (
                    <Bar dataKey="rollerMotorDeltaMs" stackId="motors" name="Roller" fill={chartColors.third} maxBarSize={64} />
                  )}
                  <Customized component={StackOutline} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>
          </div>
          {isSeeder ? (
            <ChartPanel title="Throughput" subtitle="Trays per motor hour">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.series.map((point) => ({
                  ...point,
                  throughput: ((point.beltMotorDeltaMs + point.bladeMotorDeltaMs + point.rollerMotorDeltaMs) / 3600000) > 0
                    ? point.trays / ((point.beltMotorDeltaMs + point.bladeMotorDeltaMs + point.rollerMotorDeltaMs) / 3600000)
                    : null,
                }))}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis dataKey="bucket" tickFormatter={(value) => formatAxisTime(value, range)} stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip {...baseTooltipProps()} formatter={(value) => formatDecimal(Number(value), 2)} />
                  <Line type="monotone" dataKey="throughput" name="Trays/hr" stroke={chartColors.warning} strokeWidth={2} dot={false} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>
          ) : null}
        </div>
      </section>
    </div>
  );
}
