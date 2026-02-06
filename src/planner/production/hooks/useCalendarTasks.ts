import { useTaskList } from './useTaskList';

interface CalendarTaskFilters {
  types?: string[];
  status?: string;
  dueDateStart?: string;
  dueDateEnd?: string;
}

export function useCalendarTasks(filters: CalendarTaskFilters) {
  return useTaskList({
    types: filters.types,
    status: filters.status,
    dueDateStart: filters.dueDateStart,
    dueDateEnd: filters.dueDateEnd,
  });
}
