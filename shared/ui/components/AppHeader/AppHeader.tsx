import { UserButton } from '@clerk/clerk-react';
import { Logo } from '../Logo';

export function AppHeader() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-secondary border-b border-border h-20">
      <div className="flex items-center gap-6">
        <Logo size="md" />
      </div>
      <div className="relative flex items-center justify-center">
        <UserButton
          appearance={{
            elements: {
              userButtonTrigger: 'focus:shadow-none focus:outline-none',
              avatarBox: 'h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 transition-colors',
              avatarImage: 'opacity-0',
              userButtonPopoverCard: 'shadow-lg border border-border',
              userButtonPopoverActionButton: 'hover:bg-muted',
              userButtonPopoverActionButtonText: 'text-foreground',
              userButtonPopoverFooter: 'hidden',
            },
          }}
        />
      </div>
    </header>
  );
}
