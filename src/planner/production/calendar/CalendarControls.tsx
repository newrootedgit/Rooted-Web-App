import type { CalendarView } from '../utils/dates';
import { addDays, formatShortDate, getDateRangeForView, toInputDate } from '../utils/dates';

interface CalendarControlsProps {
  view: CalendarView;
  anchorDate: Date;
  onViewChange: (view: CalendarView) => void;
  onAnchorChange: (date: Date) => void;
}

export function CalendarControls({
  view,
  anchorDate,
  onViewChange,
  onAnchorChange,
}: CalendarControlsProps) {
  const range = getDateRangeForView(view, anchorDate);

  function handlePrev() {
    if (view === 'day') {
      onAnchorChange(addDays(anchorDate, -1));
      return;
    }
    if (view === 'week') {
      onAnchorChange(addDays(anchorDate, -7));
      return;
    }
    onAnchorChange(new Date(anchorDate.getFullYear(), anchorDate.getMonth() - 1, 1));
  }

  function handleNext() {
    if (view === 'day') {
      onAnchorChange(addDays(anchorDate, 1));
      return;
    }
    if (view === 'week') {
      onAnchorChange(addDays(anchorDate, 7));
      return;
    }
    onAnchorChange(new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 1));
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {(['day', 'week', 'month'] as CalendarView[]).map((option) => (
          <button
            key={option}
            onClick={() => onViewChange(option)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
              view === option
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary text-foreground border-border hover:bg-secondary/80'
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          className="px-3 py-1.5 rounded-md text-sm border border-border hover:bg-secondary transition-colors"
        >
          Prev
        </button>
        <button
          onClick={() => onAnchorChange(new Date())}
          className="px-3 py-1.5 rounded-md text-sm border border-border hover:bg-secondary transition-colors"
        >
          Today
        </button>
        <button
          onClick={handleNext}
          className="px-3 py-1.5 rounded-md text-sm border border-border hover:bg-secondary transition-colors"
        >
          Next
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{formatShortDate(range.start)}</span>
        <span>-</span>
        <span>{formatShortDate(range.end)}</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={toInputDate(anchorDate)}
          onChange={(e) => onAnchorChange(new Date(`${e.target.value}T00:00:00`))}
          className="px-3 py-1.5 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  );
}
