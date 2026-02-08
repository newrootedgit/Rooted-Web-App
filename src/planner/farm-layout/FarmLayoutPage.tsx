import { useState } from 'react';
import { LayoutList } from './components/LayoutList';
import { LayoutEditor } from './components/LayoutEditor';

type View = { type: 'list' } | { type: 'editor'; layoutId: string | null };

export function FarmLayoutPage() {
  const [view, setView] = useState<View>({ type: 'list' });

  if (view.type === 'editor') {
    return (
      <LayoutEditor
        layoutId={view.layoutId}
        onBack={() => setView({ type: 'list' })}
      />
    );
  }

  return (
    <LayoutList
      onEdit={(layoutId) => setView({ type: 'editor', layoutId })}
      onNew={() => setView({ type: 'editor', layoutId: null })}
    />
  );
}
