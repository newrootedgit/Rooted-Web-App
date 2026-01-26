import { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { AppLayout, NavItem } from '@shared/ui/components/AppLayout';
import { TenantOverview } from '../components/TenantOverview';

const sidebarItems: NavItem[] = [
  { id: 'overview', label: 'Tenant Overview', icon: <LayoutDashboard size={20} /> },
];

export function Dashboard() {
  const [activeItem, setActiveItem] = useState('overview');

  return (
    <AppLayout
      currentApp="machines"
      sidebarItems={sidebarItems}
      activeSidebarItem={activeItem}
      onSidebarItemClick={setActiveItem}
      hideAppSwitcher
    >
      {activeItem === 'overview' && <TenantOverview />}
    </AppLayout>
  );
}
