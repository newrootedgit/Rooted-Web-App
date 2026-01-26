import { useState, useCallback, useRef, useEffect } from 'react';
import { scanForDevice, MachineGATTClient } from '../../../lib/bluetooth';
import { trpc } from '../../../lib/trpc';
import { STATUS_CODES } from '../../../../shared';
import type { OnboardStep, StatusCode } from '../../../../shared';

// Re-export type from shared for convenience
export type { OnboardStep } from '../../../../shared';

interface UseOnboardMachineOptions {
  tenantId: string;
  userEmail: string;
  farmId?: string;
  onSuccess?: () => void;
}

export function useOnboardMachine({ tenantId, userEmail, farmId, onSuccess }: UseOnboardMachineOptions) {
  const [step, setStep] = useState<OnboardStep>('scan');
  const [statusMessage, setStatusMessage] = useState('');
  const [device, setDevice] = useState<MachineGATTClient | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [displayName, setDisplayName] = useState('');

  const createMachine = trpc.machines.create.useMutation();
  const trpcUtils = trpc.useUtils();

  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const deviceInfoRef = useRef<{ name: string; id: string } | null>(null);
  const deviceIdRef = useRef<string | null>(null);

  const isDeviceRegistered = useCallback(async (deviceId: string): Promise<boolean> => {
    const existingMachine = await trpcUtils.machines.byDeviceId.fetch({ deviceId });
    return existingMachine !== null;
  }, [trpcUtils]);

  const registerMachine = useCallback(async () => {
    if (!deviceInfoRef.current) return;

    setStep('registering');

    try {
      const currentDeviceId = deviceIdRef.current;
      if (!currentDeviceId) {
        setStatusMessage('Device ID not available');
        setStep('failed');
        return;
      }

      setStatusMessage('Registering machine...');
      await createMachine.mutateAsync({
        name: deviceInfoRef.current.name,
        deviceId: currentDeviceId,
        displayName: displayName || undefined,
      });
      setStatusMessage('Machine registered successfully!');
      setStep('success');
      onSuccess?.();
    } catch (err) {
      const error = err as Error;
      setStatusMessage(error.message || 'Failed to register machine');
      setStep('failed');
    }
  }, [createMachine, displayName, onSuccess]);

  const handleStatusChange = useCallback((status: StatusCode) => {
    const currentStep = stepRef.current;
    console.log('Status received:', status, 'Current step:', currentStep);

    switch (status) {
      case STATUS_CODES.ONBOARDED:
        setStatusMessage('Device onboarded successfully');
        setStep('wifi');
        break;
      case STATUS_CODES.CONNECTING:
        setStatusMessage('Connecting to WiFi...');
        break;
      case STATUS_CODES.CONNECTED:
        setStatusMessage('WiFi connected! Registering machine...');
        registerMachine();
        break;
      case STATUS_CODES.FAILED:
        if (currentStep === 'connecting') {
          console.log('WiFi connection failed');
          setStatusMessage('Wifi connection failed. Please try again.');
          setStep('failed');
        }
        break;
    }
  }, [registerMachine]);

  const handleOnboarding = useCallback(async (client: MachineGATTClient) => {
    try {
      // First, read the device ID to check if already registered
      setStatusMessage('Reading device ID...');
      const id = await client.read_device_id();
      deviceIdRef.current = id;

      // Check if device is already registered before proceeding
      setStatusMessage('Checking if device is already registered...');
      const alreadyRegistered = await isDeviceRegistered(id);
      if (alreadyRegistered) {
        setStatusMessage('This device is already registered. If you believe this is an error, please contact support.');
        setStep('failed');
        return;
      }

      // Device not registered, proceed with onboarding
      setStatusMessage('Sending onboarding code...');
      await client.writeOnboardingCode();

      setStatusMessage('Sending user info...');
      await client.writeUserInfo({
        tenant_id: tenantId,
        user_email: userEmail,
        ...(farmId && { farm_id: farmId })
      });
      setStatusMessage('Waiting for device confirmation...');
    } catch (err) {
      const error = err as Error;
      setStatusMessage(error.message || 'Onboarding failed');
      setStep('failed');
    }
  }, [tenantId, userEmail, farmId, isDeviceRegistered]);

  const scan = useCallback(async () => {
    setIsScanning(true);
    setStatusMessage('');

    try {
      const bluetoothDevice = await scanForDevice();

      deviceInfoRef.current = {
        name: bluetoothDevice.name || 'Unknown Device',
        id: bluetoothDevice.id,
      };
      setDeviceName(bluetoothDevice.name || 'Unknown Device');

      const client = new MachineGATTClient(bluetoothDevice, {
        onStatusChange: handleStatusChange,
        onDisconnect: () => {
          const currentStep = stepRef.current;
          console.log('BLE disconnected, current step:', currentStep);
          setDevice(null);
          if (currentStep !== 'success') {
            setStatusMessage('Device disconnected');
          }
        },
      });

      await client.connect();
      await client.subscribeToStatus();

      setDevice(client);
      setStep('onboarding');

      await handleOnboarding(client);
    } catch (err) {
      const error = err as Error;
      if (error.message?.includes('cancelled')) {
        setIsScanning(false);
        return;
      }
      setStatusMessage(error.message || 'Failed to connect');
      setStep('failed');
    } finally {
      setIsScanning(false);
    }
  }, [handleStatusChange, handleOnboarding]);

  const submitWifi = useCallback(async (ssid: string, password: string) => {
    if (!device || !ssid) return;

    setStep('connecting');
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
    setStep('scan');
    setStatusMessage('');
    setDisplayName('');
    deviceInfoRef.current = null;
  }, [device]);

  const retry = useCallback(() => {
    setStep('scan');
    setStatusMessage('');
  }, []);

  return {
    step,
    statusMessage,
    isScanning,
    isConnected: !!device,
    deviceName,
    displayName,
    setDisplayName,
    scan,
    submitWifi,
    reset,
    retry,
  };
}
