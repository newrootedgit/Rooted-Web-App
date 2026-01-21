import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface BluetoothIndicatorProps {
  isSupported: boolean;
}

export default function BluetoothIndicator({ isSupported }: BluetoothIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center rounded-md hover:bg-muted transition-colors p-1"
        aria-label="Web Bluetooth status"
      >
        {isSupported ? (
          <CheckCircle2 size={20} className="text-green-600" />
        ) : (
          <XCircle size={20} className="text-red-500" />
        )}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-full left-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            {isSupported ? (
              <>
                <CheckCircle2 size={20} className="text-green-600" />
                <span className="font-semibold text-foreground">Web Bluetooth Supported</span>
              </>
            ) : (
              <>
                <XCircle size={20} className="text-red-500" />
                <span className="font-semibold text-foreground">Web Bluetooth Not Supported</span>
              </>
            )}
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground mb-2">
                Web Bluetooth allows your browser to communicate directly with Bluetooth devices.
              </p>
            </div>

            {isSupported ? (
              <div className="space-y-2">
                <p className="font-medium text-foreground">With Web Bluetooth you can:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Discover and add new machines via Bluetooth</li>
                  <li>Configure machine settings wirelessly</li>
                  <li>Connect machines to your WiFi network</li>
                  <li>Perform firmware updates</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-medium text-foreground">Without Web Bluetooth:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>You can view and manage existing machines</li>
                  <li>Monitor machine status and data</li>
                  <li>Cannot add new machines via Bluetooth</li>
                </ul>
                <div className="mt-3 p-2 bg-muted rounded-md">
                  <p className="text-muted-foreground">
                    <span className="font-medium">To enable:</span> Use Chrome, Edge, or Opera on desktop or Android.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
