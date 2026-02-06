import { trpc } from '../../../lib/trpc';

interface TaskListFilters {
  types?: string[];
  status?: string;
  dueDateStart?: string;
  dueDateEnd?: string;
  limit?: number;
}

export function useTaskList(filters: TaskListFilters) {
  const query = trpc.tasks.list.useInfiniteQuery(
    {
      types: filters.types && filters.types.length > 0 ? filters.types : undefined,
      status: filters.status || undefined,
      dueDateStart: filters.dueDateStart || undefined,
      dueDateEnd: filters.dueDateEnd || undefined,
      limit: filters.limit ?? 100,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const tasks = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    tasks,
  };
}
