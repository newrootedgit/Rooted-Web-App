import { useState } from 'react';
import { BarChart3, Bot, UserRoundCog } from 'lucide-react';
import { AppLayout, NavItem } from '@shared/ui/components/AppLayout';
import MachinesDashboard from './dashboard/MachinesDashboard';
import MachinePresets from './presets/MachinePresets';
import MachineAnalytics from './analytics/MachineAnalytics';
import { trpc } from '../lib/trpc';


const sidebarItems: NavItem[] = [
  { id: 'dashboard', label: 'Robot Dashboard', icon: <Bot size={20} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { id: 'presets', label: 'Presets', icon: <UserRoundCog size={20} /> },
];

export function MachinesPage() {
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
      {activeItem === 'analytics' && <MachineAnalytics />}
    </AppLayout>
  );
}
