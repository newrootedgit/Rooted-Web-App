import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Cpu, Calendar } from 'lucide-react';
import { Logo } from '../Logo';

export type AppType = 'machines' | 'planner';

interface AppOption {
  id: AppType;
  label: string;
  icon: React.ReactNode;
}

const apps: AppOption[] = [
  { id: 'machines', label: 'Machines', icon: <Cpu size={18} /> },
  { id: 'planner', label: 'Planner', icon: <Calendar size={18} /> },
];

interface AppHeaderProps {
  currentApp: AppType;
  onAppChange: (app: AppType) => void;
}

export function AppHeader({ currentApp, onAppChange }: AppHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentAppData = apps.find((app) => app.id === currentApp)!;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-secondary border-b border-border h-20">
      <div className="flex items-center gap-6">
        <Logo size="md" />
        <div className="w-px h-10 bg-border" />
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-3 py-2 bg-popover border border-border rounded-md text-sm font-medium hover:bg-muted hover:border-primary/30 transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-primary">{currentAppData.icon}</span>
            <span className="min-w-[70px] text-left">{currentAppData.label}</span>
            <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <ul className="absolute top-full left-0 mt-1 min-w-[160px] bg-popover border border-border rounded-md shadow-lg p-1 z-50">
              {apps.map((app) => (
                <li key={app.id}>
                  <button
                    className={`flex items-center gap-2 w-full px-3 py-2 rounded text-sm text-left transition-colors ${
                      app.id === currentApp
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => { onAppChange(app.id); setIsOpen(false); }}
                  >
                    <span className={app.id === currentApp ? 'text-primary-foreground' : 'text-primary'}>{app.icon}</span>
                    <span>{app.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
