import { useTaskList } from './useTaskList';

interface HarvestTaskFilters {
  status?: string;
  dueDateStart?: string;
  dueDateEnd?: string;
}

export function useHarvestTasks(filters: HarvestTaskFilters) {
  return useTaskList({
    types: ['HARVEST'],
    status: filters.status,
    dueDateStart: filters.dueDateStart,
    dueDateEnd: filters.dueDateEnd,
  });
}
