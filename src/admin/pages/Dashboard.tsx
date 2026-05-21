import { useState } from 'react';
import { Activity, LayoutDashboard, Wrench } from 'lucide-react';
import { AppLayout, NavItem } from '@shared/ui/components/AppLayout';
import { TenantOverview } from '../components/TenantOverview';
import { MachineAnalyticsAdmin } from '../components/MachineAnalyticsAdmin';
import { PartLifespansAdmin } from '../components/PartLifespansAdmin';

const sidebarItems: NavItem[] = [
  { id: 'overview', label: 'Tenant Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'machineAnalytics', label: 'Machine Analytics', icon: <Activity size={20} /> },
  { id: 'partLifespans', label: 'Part Lifespans', icon: <Wrench size={20} /> },
];

export function Dashboard() {
  const [activeItem, setActiveItem] = useState('overview');

  return (
    <AppLayout
      sidebarItems={sidebarItems}
      activeSidebarItem={activeItem}
      onSidebarItemClick={setActiveItem}
    >
      {activeItem === 'overview' && <TenantOverview />}
      {activeItem === 'machineAnalytics' && <MachineAnalyticsAdmin />}
      {activeItem === 'partLifespans' && <PartLifespansAdmin />}
    </AppLayout>
  );
}
