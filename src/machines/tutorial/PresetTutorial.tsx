import { useEffect, useMemo, useState } from 'react';
import { Joyride, STATUS, type EventData, type Step } from 'react-joyride';
import { RootedTourTooltip } from './RootedTourTooltip';

interface PresetTutorialProps {
  shouldRun: boolean;
  onFinish: () => void;
}

export function PresetTutorial({ shouldRun, onFinish }: PresetTutorialProps) {
  const [run, setRun] = useState(false);

  const steps = useMemo<Step[]>(() => [
    {
      target: '[data-tour="demo-preset-card"]',
      title: 'Demo Presets',
      content: 'This demo machine uses sandbox presets. You can practice without sending anything to hardware.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="demo-preset-list"]',
      title: 'Preset Values',
      content: 'Open a preset, adjust a value within its allowed range, or rename a variety.',
      placement: 'left',
    },
    {
      target: '[data-tour="demo-preset-list"]',
      title: 'Save Practice Changes',
      content: 'After changing a value, Save All Changes updates the demo config in the database only. Real machines use AWS IoT and require a device acknowledgement.',
      placement: 'top',
    },
  ], []);

  useEffect(() => {
    if (!shouldRun) {
      setRun(false);
      return;
    }

    const interval = window.setInterval(() => {
      const hasPresetTarget = document.querySelector('[data-tour="demo-preset-list"]');
      if (hasPresetTarget) {
        setRun(true);
        window.clearInterval(interval);
      }
    }, 250);

    const timeout = window.setTimeout(() => window.clearInterval(interval), 10000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [shouldRun]);

  function handleEvent(data: EventData) {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      setRun(false);
      onFinish();
    }
  }

  return (
    <Joyride
      run={run}
      steps={steps}
      continuous
      onEvent={handleEvent}
      tooltipComponent={RootedTourTooltip}
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
