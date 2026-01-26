import { ReactNode } from 'react';
import { AppHeader, AppType } from '../AppHeader';
import { Sidebar, NavItem } from '../Sidebar';

interface AppLayoutProps {
  children: ReactNode;
  currentApp: AppType;
  onAppChange?: (app: AppType) => void;
  sidebarItems: NavItem[];
  activeSidebarItem: string;
  onSidebarItemClick: (id: string) => void;
  hideAppSwitcher?: boolean;
}

export function AppLayout({
  children,
  currentApp,
  onAppChange,
  sidebarItems,
  activeSidebarItem,
  onSidebarItemClick,
  hideAppSwitcher = false,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader currentApp={currentApp} onAppChange={onAppChange} hideAppSwitcher={hideAppSwitcher} />
      <div className="flex flex-1">
        <Sidebar items={sidebarItems} activeItem={activeSidebarItem} onItemClick={onSidebarItemClick} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
