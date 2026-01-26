import { useState, useCallback, useRef, useEffect } from 'react';
import { scanForDevice, MachineGATTClient } from '../../../lib/bluetooth';
import { STATUS_CODES } from '../../../../shared';
import type { StatusCode } from '../../../../shared';

type ChangeWifiStep = 'idle' | 'scanning' | 'connecting' | 'ready' | 'provisioning' | 'success' | 'failed';

interface UseChangeWifiOptions {
  machineName: string;
}

export function useChangeWifi({ machineName }: UseChangeWifiOptions) {
  const [step, setStep] = useState<ChangeWifiStep>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [device, setDevice] = useState<MachineGATTClient | null>(null);

  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const handleStatusChange = useCallback((status: StatusCode) => {
    console.log('Status received:', status);

    switch (status) {
      case STATUS_CODES.CONNECTING:
        setStatusMessage('Connecting to WiFi...');
        break;
      case STATUS_CODES.CONNECTED:
        setStatusMessage('WiFi connected successfully!');
        setStep('success');
        break;
      case STATUS_CODES.FAILED:
        setStatusMessage('WiFi connection failed. Please try again.');
        setStep('failed');
        break;
    }
  }, []);

  const connect = useCallback(async () => {
    setStep('scanning');
    setStatusMessage('Scanning for device...');

    try {
      const bluetoothDevice = await scanForDevice(machineName);

      setStep('connecting');
      setStatusMessage('Connecting to device...');

      const client = new MachineGATTClient(bluetoothDevice, {
        onStatusChange: handleStatusChange,
        onDisconnect: () => {
          const currentStep = stepRef.current;
          console.log('BLE disconnected, current step:', currentStep);
          setDevice(null);
          if (currentStep !== 'success') {
            setStatusMessage('Device disconnected');
            setStep('failed');
          }
        },
      });

      await client.connect();
      await client.subscribeToStatus();

      // Send onboarding code so Pi accepts WiFi credentials
      setStatusMessage('Preparing device...');
      await client.writeOnboardingCode();

      setDevice(client);
      setStep('ready');
      setStatusMessage('Device connected. Enter new WiFi credentials.');
    } catch (err) {
      const error = err as Error;
      if (error.message?.includes('cancelled')) {
        setStep('idle');
        setStatusMessage('');
        return;
      }
      setStatusMessage(error.message || 'Device not found. Make sure it\'s powered on and nearby.');
      setStep('failed');
    }
  }, [machineName, handleStatusChange]);

  const submitWifi = useCallback(async (ssid: string, password: string) => {
    if (!device || !ssid) return;

    setStep('provisioning');
    setStatusMessage('Sending WiFi credentials...');

    try {
      await device.writeWiFiCredentials(ssid, password);
    } catch (err) {
      const error = err as Error;
      setStatusMessage(error.message || 'Failed to send credentials');
      setStep('failed');
    }
  }, [device]);

  const reset = useCallback(() => {
    device?.disconnect();
    setDevice(null);
    setStep('idle');
    setStatusMessage('');
  }, [device]);

  return {
    step,
    statusMessage,
    isConnected: !!device,
    connect,
    submitWifi,
    reset,
  };
}
