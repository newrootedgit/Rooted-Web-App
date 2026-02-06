import { useTaskList } from './useTaskList';

interface TransplantTaskFilters {
  status?: string;
  dueDateStart?: string;
  dueDateEnd?: string;
}

export function useTransplantTasks(filters: TransplantTaskFilters) {
  return useTaskList({
    types: ['MOVE_TO_LIGHT'],
    status: filters.status,
    dueDateStart: filters.dueDateStart,
    dueDateEnd: filters.dueDateEnd,
  });
}
