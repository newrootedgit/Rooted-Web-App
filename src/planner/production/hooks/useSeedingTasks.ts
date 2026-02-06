import { useTaskList } from './useTaskList';

interface SeedingTaskFilters {
  status?: string;
  dueDateStart?: string;
  dueDateEnd?: string;
}

export function useSeedingTasks(filters: SeedingTaskFilters) {
  return useTaskList({
    types: ['SOAK', 'SEED'],
    status: filters.status,
    dueDateStart: filters.dueDateStart,
    dueDateEnd: filters.dueDateEnd,
  });
}
