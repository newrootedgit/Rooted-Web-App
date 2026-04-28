import { useEffect, useMemo, useState } from 'react';
import { ACTIONS, Joyride, STATUS, type EventData, type Step } from 'react-joyride';
import { RootedTourTooltip } from './RootedTourTooltip';

type MachineTutorialOutcome = 'continueToPresets' | 'dismissed';

interface MachineTutorialProps {
  shouldRun: boolean;
  onFinish: (outcome: MachineTutorialOutcome) => void;
}

export function MachineTutorial({ shouldRun, onFinish }: MachineTutorialProps) {
  const [run, setRun] = useState(false);

  const steps = useMemo<Step[]>(() => [
    {
      target: '[data-tour="machines-heading"]',
      title: 'Machine Management',
      content: 'This is where you monitor machines, connect new hardware, and review operational status.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="demo-machine-card"]',
      title: 'Demo Machine',
      content: 'We added a demo machine so you can explore the dashboard before connecting physical hardware.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="machine-status"]',
      title: 'Machine Status',
      content: 'Status, network, last seen time, uptime, and fault metrics appear here as real telemetry arrives.',
      placement: 'left',
    },
    {
      target: '[data-tour="add-machine-button"]',
      title: 'Add Real Hardware',
      content: 'When your machine is ready, use Add Machine to connect over Bluetooth and provision WiFi.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="sidebar-presets"]',
      title: 'Practice Presets',
      content: 'Next, open Presets to practice changing machine settings on the demo machine. Demo changes are saved only to the sandbox config.',
      placement: 'right',
    },
  ], []);

  useEffect(() => {
    if (!shouldRun) {
      setRun(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      const hasRequiredTarget = document.querySelector('[data-tour="demo-machine-card"]');
      if (hasRequiredTarget) {
        setRun(true);
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [shouldRun]);

  function handleEvent(data: EventData) {
    if (data.status === STATUS.FINISHED) {
      setRun(false);
      onFinish('continueToPresets');
    }

    if (data.status === STATUS.SKIPPED || data.action === ACTIONS.CLOSE) {
      setRun(false);
      onFinish('dismissed');
    }
  }

  return (
    <Joyride
      run={run}
      steps={steps}
      continuous
      onEvent={handleEvent}
      tooltipComponent={RootedTourTooltip}
      locale={{ last: 'Practice presets' }}
      options={{
        buttons: ['back', 'skip', 'primary'],
        overlayClickAction: false,
        primaryColor: '#16a34a',
        showProgress: true,
        skipBeacon: true,
        zIndex: 10000,
      }}
    />
  );
}
