import { trpc } from '../../../lib/trpc';

export function useTaskDragDrop() {
  const utils = trpc.useUtils();

  const mutation = trpc.tasks.updateDueDate.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
    },
  });

  function handleDragEnd(taskId: string, newDateKey: string) {
    mutation.mutate({ id: taskId, dueDate: `${newDateKey}T00:00:00` });
  }

  return {
    handleDragEnd,
    isUpdating: mutation.isPending,
  };
}
