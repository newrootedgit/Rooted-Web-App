import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { AppLayout, NavItem } from '@shared/ui/components/AppLayout';
import { AppType } from '@shared/ui/components/AppHeader';
import MachinesDashboard from './dashboard/MachinesDashboard';

const sidebarItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
];

export function MachinesPage() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('dashboard');

  function handleAppChange(app: AppType) {
    if (app === 'planner') {
      navigate('/planner');
    }
  }

  return (
    <AppLayout
      currentApp="machines"
      onAppChange={handleAppChange}
      sidebarItems={sidebarItems}
      activeSidebarItem={activeItem}
      onSidebarItemClick={setActiveItem}
    >
      {activeItem === 'dashboard' && <MachinesDashboard />}
    </AppLayout>
  );
}
