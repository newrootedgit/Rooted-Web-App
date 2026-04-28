import { ReactNode } from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
}

interface SidebarProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
}

export function Sidebar({ items, activeItem, onItemClick }: SidebarProps) {
  return (
    <aside className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col">
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                data-tour={`sidebar-${item.id}`}
                onClick={() => onItemClick(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.id === activeItem
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <span className={item.id === activeItem ? 'text-sidebar-primary-foreground' : 'text-primary'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
