import { useState } from 'react';
import { CalendarView } from './calendar/CalendarView';
import { LogsView } from './LogsView';
import { SeedingView } from './seeding/SeedingView';
import { TransplantView } from './transplant/TransplantView';
import { HarvestView } from './harvest/HarvestView';

type ProductionTab = 'calendar' | 'seeding' | 'transplant' | 'harvest' | 'logs';

const TABS: { id: ProductionTab; label: string }[] = [
  { id: 'calendar', label: 'Calendar' },
  { id: 'seeding', label: 'Seeding' },
  { id: 'transplant', label: 'Transplant' },
  { id: 'harvest', label: 'Harvest' },
  { id: 'logs', label: 'Logs' },
];

export function ProductionPage() {
  const [tab, setTab] = useState<ProductionTab>('calendar');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Production</h1>
      </div>

      <div className="flex items-center gap-4 border-b border-border">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              tab === item.id
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'calendar' && <CalendarView />}
      {tab === 'seeding' && <SeedingView />}
      {tab === 'transplant' && <TransplantView />}
      {tab === 'harvest' && <HarvestView />}
      {tab === 'logs' && <LogsView />}
    </div>
  );
}
