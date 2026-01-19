import { useState } from 'react';
import { X, Loader2, CheckCircle, XCircle, Bluetooth } from 'lucide-react';
import { useOnboardMachine } from '../hooks/useOnboardMachine';

interface OnboardMachineProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tenantId: string;
  farmId: string;
}

export function OnboardMachine({ isOpen, onClose, onSuccess, tenantId, farmId }: OnboardMachineProps) {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  const {
    step,
    statusMessage,
    isScanning,
    scan,
    submitWifi,
    reset,
    retry,
  } = useOnboardMachine({ tenantId, farmId, onSuccess });

  const handleClose = () => {
    reset();
    setSsid('');
    setPassword('');
    onClose();
  };

  const handleWifiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitWifi(ssid, password);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-card rounded-lg p-6 w-full max-w-md shadow-lg border border-border">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
          Onboard Machine
        </h2>

        {step === 'scan' && (
          <div className="flex flex-col items-center gap-4">
            <Bluetooth size={48} className="text-primary" />
            <p className="text-muted-foreground text-center">
              Make sure your Raspberry Pi is powered on and running the BLE service.
            </p>
            <button
              onClick={scan}
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isScanning ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Scanning...
                </>
              ) : (
                'Scan for Device'
              )}
            </button>
          </div>
        )}

        {step === 'onboarding' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-primary" />
            <p className="text-muted-foreground">Onboarding device...</p>
            <p className="text-sm text-muted-foreground">{statusMessage}</p>
          </div>
        )}

        {step === 'wifi' && (
          <form onSubmit={handleWifiSubmit} className="flex flex-col gap-4">
            <p className="text-muted-foreground text-center">
              Enter WiFi credentials to connect the device to your network.
            </p>
            <div className="flex flex-col gap-1">
              <label htmlFor="ssid" className="text-sm font-medium text-foreground">
                Network Name (SSID)
              </label>
              <input
                id="ssid"
                type="text"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                placeholder="Enter WiFi network name"
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter WiFi password"
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
            >
              Connect to WiFi
            </button>
          </form>
        )}

        {step === 'connecting' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-primary" />
            <p className="text-muted-foreground">Connecting to WiFi...</p>
            <p className="text-sm text-muted-foreground">{statusMessage}</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle size={48} className="text-green-500" />
            <p className="text-muted-foreground">Device successfully connected!</p>
            <p className="text-sm text-muted-foreground">{statusMessage}</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {step === 'failed' && (
          <div className="flex flex-col items-center gap-4">
            <XCircle size={48} className="text-destructive" />
            <p className="text-muted-foreground">Something went wrong</p>
            <p className="text-sm text-muted-foreground">{statusMessage}</p>
            <div className="flex gap-3 w-full">
              <button
                onClick={retry}
                className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-2 bg-transparent text-muted-foreground border border-border rounded-md font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
