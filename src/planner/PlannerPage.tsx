import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { AppLayout, NavItem } from '@shared/ui/components/AppLayout';
import { AppType } from '@shared/ui/components/AppHeader';
import { ComingSoon } from '@shared/ui/components/ComingSoon';

const sidebarItems: NavItem[] = [
  { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
];

export function PlannerPage() {
  const navigate = useNavigate();

  function handleAppChange(app: AppType) {
    if (app === 'machines') {
      navigate('/machines');
    }
  }

  return (
    <AppLayout
      currentApp="planner"
      onAppChange={handleAppChange}
      sidebarItems={sidebarItems}
      activeSidebarItem="calendar"
      onSidebarItemClick={() => {}}
    >
      <ComingSoon 
        title="Planner" 
        description="The planner feature is coming soon. Please contact erik@rootedrobotics.com"
      />
    </AppLayout>
  );
}
