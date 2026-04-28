import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, UserRoundCog } from 'lucide-react';
import { AppLayout, NavItem } from '@shared/ui/components/AppLayout';
import { AppType } from '@shared/ui/components/AppHeader';
import MachinesDashboard from './dashboard/MachinesDashboard';
import MachinePresets from './presets/MachinePresets';
import { trpc } from '../lib/trpc';


const sidebarItems: NavItem[] = [
  { id: 'dashboard', label: 'Robot Dashboard', icon: <Bot size={20} /> },
  { id: 'presets', label: 'Presets', icon: <UserRoundCog size={20} /> }

];

export function MachinesPage() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [presetTutorialRequested, setPresetTutorialRequested] = useState(false);
  const { data: onboardingStatus } = trpc.onboarding.status.useQuery(undefined, {
    retry: false,
  });
  const trpcUtils = trpc.useUtils();
  const completeTutorialMutation = trpc.onboarding.completeMachineTutorial.useMutation({
    onSuccess: () => {
      trpcUtils.onboarding.status.invalidate();
    },
  });

  const shouldRunTutorial = !!onboardingStatus
    && !onboardingStatus.needsOnboarding
    && !onboardingStatus.tutorial.machineTutorialCompletedAt
    && !onboardingStatus.tutorial.machineTutorialDismissedAt;

  function handleAppChange(app: AppType) {
    if (app === 'planner') {
      navigate('/planner');
    }
  }

  function handleDashboardTutorialFinish(outcome: 'continueToPresets' | 'dismissed') {
    if (outcome === 'dismissed') {
      completeTutorialMutation.mutate({ outcome: 'dismissed' });
      return;
    }

    setPresetTutorialRequested(true);
    setActiveItem('presets');
  }

  function handlePresetTutorialFinish() {
    setPresetTutorialRequested(false);
    completeTutorialMutation.mutate({ outcome: 'completed' });
  }

  return (
    <AppLayout
      currentApp="machines"
      onAppChange={handleAppChange}
      sidebarItems={sidebarItems}
      activeSidebarItem={activeItem}
      onSidebarItemClick={setActiveItem}
    >
      {activeItem === 'dashboard' && (
        <MachinesDashboard
          runTutorial={shouldRunTutorial && !presetTutorialRequested}
          onTutorialFinish={handleDashboardTutorialFinish}
        />
      )}
      {activeItem === 'presets' && (
        <MachinePresets
          runTutorial={shouldRunTutorial && presetTutorialRequested}
          onTutorialFinish={handlePresetTutorialFinish}
        />
      )}
    </AppLayout>
  );
}
