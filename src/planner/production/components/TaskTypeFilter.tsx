const TYPE_OPTIONS = [
  { id: 'SOAK', label: 'Soak' },
  { id: 'SEED', label: 'Seed' },
  { id: 'MOVE_TO_LIGHT', label: 'Move to Light' },
  { id: 'HARVEST', label: 'Harvest' },
];

interface TaskTypeFilterProps {
  selected: string[];
  onChange: (types: string[]) => void;
}

export function TaskTypeFilter({ selected, onChange }: TaskTypeFilterProps) {
  function toggleType(type: string) {
    if (selected.includes(type)) {
      onChange(selected.filter((t) => t !== type));
      return;
    }
    onChange([...selected, type]);
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {TYPE_OPTIONS.map((option) => (
        <label key={option.id} className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={selected.includes(option.id)}
            onChange={() => toggleType(option.id)}
            className="rounded"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
