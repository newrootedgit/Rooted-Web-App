import { useState } from 'react';
import { X, Wifi, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useChangeWifi } from '../hooks/useChangeWifi';

interface ChangeWifiModalProps {
  machineName: string;
  onClose: () => void;
}

export default function ChangeWifiModal({ machineName, onClose }: ChangeWifiModalProps) {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const { step, statusMessage, connect, submitWifi, reset } = useChangeWifi({ machineName });

  const handleConnect = () => {
    connect();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ssid) {
      submitWifi(ssid, password);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-card border border-border rounded-lg w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Change WiFi Network</h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wifi size={16} />
            <span>Device: <span className="font-mono text-foreground">{machineName}</span></span>
          </div>

          {step === 'idle' && (
            <button
              onClick={handleConnect}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Connect to Device
            </button>
          )}

          {(step === 'scanning' || step === 'connecting') && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              <span>{statusMessage}</span>
            </div>
          )}

          {step === 'ready' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">WiFi Network (SSID)</label>
                <input
                  type="text"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  placeholder="Enter network name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  placeholder="Enter password"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Update WiFi
              </button>
            </form>
          )}

          {step === 'provisioning' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              <span>{statusMessage}</span>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 size={16} />
                <span>{statusMessage}</span>
              </div>
              <button
                onClick={handleClose}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {step === 'failed' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle size={16} />
                <span>{statusMessage}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    reset();
                    connect();
                  }}
                  className="flex-1 px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-transparent border border-border text-foreground rounded-md hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
