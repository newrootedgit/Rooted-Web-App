import { ReactNode } from 'react';
import { AppHeader } from '../AppHeader';
import { Sidebar, NavItem } from '../Sidebar';
import { SupportWidget } from '../../../../src/support/SupportWidget';

interface AppLayoutProps {
  children: ReactNode;
  sidebarItems: NavItem[];
  activeSidebarItem: string;
  onSidebarItemClick: (id: string) => void;
}

export function AppLayout({
  children,
  sidebarItems,
  activeSidebarItem,
  onSidebarItemClick,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <div className="flex flex-1">
        <Sidebar items={sidebarItems} activeItem={activeSidebarItem} onItemClick={onSidebarItemClick} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
      <SupportWidget />
    </div>
  );
}
