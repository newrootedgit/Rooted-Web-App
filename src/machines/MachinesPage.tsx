import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, UserRoundCog } from 'lucide-react';
import { AppLayout, NavItem } from '@shared/ui/components/AppLayout';
import { AppType } from '@shared/ui/components/AppHeader';
import MachinesDashboard from './dashboard/MachinesDashboard';
import MachinePresets from './presets/MachinePresets';


const sidebarItems: NavItem[] = [
  { id: 'dashboard', label: 'Robot Dashboard', icon: <Bot size={20} /> },
  { id: 'presets', label: 'Presets', icon: <UserRoundCog size={20} /> }

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
      {activeItem === 'presets' && <MachinePresets />}
    </AppLayout>
  );
}
