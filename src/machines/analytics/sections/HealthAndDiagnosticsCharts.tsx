import { Activity, Gauge } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AnalyticsData, AnalyticsRange } from '../shared/types';
import {
  formatAxisTime,
  formatDecimal,
  formatInteger,
  baseTooltipProps,
} from '../shared/formatters';
import {
  ChartPanel,
  EmptyChart,
  EventList,
  SectionHeading,
  chartColors,
} from '../shared/chartHelpers';

export function HealthAndDiagnosticsCharts({
  data,
  range,
  isAdmin,
}: {
  data: AnalyticsData;
  range: AnalyticsRange;
  isAdmin: boolean;
}) {
  if (data.series.length === 0) return <EmptyChart message="No telemetry for this range" />;

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <SectionHeading icon={Activity} title="Health" subtitle="Faults, alerts, and stops" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartPanel title="Fault Samples" subtitle="Belt and blade fault indicators">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.series}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="bucket" tickFormatter={(value) => formatAxisTime(value, range)} stroke="var(--muted-foreground)" />
                <YAxis allowDecimals={false} stroke="var(--muted-foreground)" />
                <Tooltip {...baseTooltipProps()} />
                <Legend />
                <Bar dataKey="beltFaultCount" name="Belt" fill={chartColors.warning} radius={[4, 4, 0, 0]} />
                <Bar dataKey="bladeFaultCount" name="Blade" fill={chartColors.danger} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
          <ChartPanel title="Alerts and Stops" subtitle="Alert bits and kill switch samples">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.series}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="bucket" tickFormatter={(value) => formatAxisTime(value, range)} stroke="var(--muted-foreground)" />
                <YAxis allowDecimals={false} stroke="var(--muted-foreground)" />
                <Tooltip {...baseTooltipProps()} />
                <Legend />
                <Line type="monotone" dataKey="alertCount" name="Alerts" stroke={chartColors.warning} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="killSwitchCount" name="Kill switch" stroke={chartColors.danger} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      </section>

      {isAdmin ? (
      <section className="space-y-3">
        <SectionHeading icon={Gauge} title="Diagnostics" subtitle="Torque, command age, and UDP" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartPanel title="Torque" subtitle="Average and peak torque percentage">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.series}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="bucket" tickFormatter={(value) => formatAxisTime(value, range)} stroke="var(--muted-foreground)" />
                <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" />
                <Tooltip {...baseTooltipProps()} formatter={(value) => `${formatDecimal(Number(value), 1)}%`} />
                <Legend />
                <Line type="monotone" dataKey="avgTorquePct" name="Average" stroke={chartColors.primary} strokeWidth={2} dot={false} connectNulls />
                <Line type="monotone" dataKey="maxTorquePct" name="Peak" stroke={chartColors.warning} strokeWidth={2} dot={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>
          <ChartPanel title="Command Age" subtitle="Average command age in milliseconds">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.series}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="bucket" tickFormatter={(value) => formatAxisTime(value, range)} stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip {...baseTooltipProps()} formatter={(value) => `${formatInteger(Number(value))} ms`} />
                <Area type="monotone" dataKey="avgCmdAgeMs" name="Command age" stroke={chartColors.accent} fill={chartColors.accent} fillOpacity={0.2} connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>
          <ChartPanel title="UDP Failures" subtitle="Highest reported fail count per bucket">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.series}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="bucket" tickFormatter={(value) => formatAxisTime(value, range)} stroke="var(--muted-foreground)" />
                <YAxis allowDecimals={false} stroke="var(--muted-foreground)" />
                <Tooltip {...baseTooltipProps()} />
                <Bar dataKey="maxUdpFailCount" name="UDP failures" fill={chartColors.muted} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
          <EventList data={data} />
        </div>
      </section>
      ) : null}
    </div>
  );
}
