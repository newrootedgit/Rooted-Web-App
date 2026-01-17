import { useState, useEffect } from 'react';

export function useBluetoothSupport() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof navigator !== 'undefined' && 'bluetooth' in navigator);
  }, []);

  return isSupported;
}
