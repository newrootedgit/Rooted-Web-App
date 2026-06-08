import { useState } from 'react';
import { Activity, FileText, LayoutDashboard, Wrench } from 'lucide-react';
import { AppLayout, NavItem } from '@shared/ui/components/AppLayout';
import { TenantOverview } from '../components/TenantOverview';
import { MachineAnalyticsAdmin } from '../components/MachineAnalyticsAdmin';
import { PartLifespansAdmin } from '../components/PartLifespansAdmin';
import { DocumentationAdmin } from '../components/DocumentationAdmin';

const sidebarItems: NavItem[] = [
  { id: 'overview', label: 'Tenant Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'machineAnalytics', label: 'Machine Analytics', icon: <Activity size={20} /> },
  { id: 'partLifespans', label: 'Part Lifespans', icon: <Wrench size={20} /> },
  { id: 'documentation', label: 'Documentation', icon: <FileText size={20} /> },
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
      {activeItem === 'documentation' && <DocumentationAdmin />}
    </AppLayout>
  );
}
