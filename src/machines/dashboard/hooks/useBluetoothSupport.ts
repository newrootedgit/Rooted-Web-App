import { useState, useEffect } from 'react';

export function useBluetoothSupport() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      if (typeof navigator === 'undefined' || !navigator.bluetooth) {
        setIsSupported(false);
        return;
      }

      try {
        if (typeof navigator.bluetooth.getAvailability === 'function') {
          const available = await navigator.bluetooth.getAvailability();
          setIsSupported(available);
        } else {
          setIsSupported(true);
        }
      } catch {
        setIsSupported(true);
      }
    };

    checkSupport();
  }, []);

  return isSupported;
}
