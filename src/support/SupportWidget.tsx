import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { SupportForm } from './components/SupportForm';

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? '';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Open support"
      >
        <HelpCircle size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative bg-card rounded-lg p-6 w-full max-w-lg shadow-lg border border-border max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <SupportForm userEmail={userEmail} onSuccess={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
