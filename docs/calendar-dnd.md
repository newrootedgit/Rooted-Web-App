# Calendar Drag-and-Drop (Phase 4.1)

## Overview

The production calendar lets users view tasks (Soak, Seed, Move to Light, Harvest) on a day/week/month grid. Tasks can be **dragged between days** to reschedule them, and a detail panel on the right shows full task info with a quick status-change button.

---

## Library

**`@dnd-kit/core` v6.3.1** — a lightweight, accessible React drag-and-drop toolkit.

We only use the core package (no `@dnd-kit/sortable`) because tasks move between day containers rather than being reordered within a list.

Key imports from `@dnd-kit/core`:

| Import | Where used | Purpose |
|---|---|---|
| `DndContext` | `CalendarView.tsx` | Wraps the entire calendar grid; provides DnD context to all children |
| `DragOverlay` | `CalendarView.tsx` | Renders a floating clone of the task being dragged |
| `useDraggable` | `TaskEvent.tsx` | Makes each task card draggable |
| `useDroppable` | `CalendarGrid.tsx` → `DayColumn` | Makes each day column a valid drop target |
| `PointerSensor` | `CalendarView.tsx` | Detects mouse/touch drags with an 8px activation distance |
| `KeyboardSensor` | `CalendarView.tsx` | Allows keyboard-based dragging for accessibility |

---

## File Structure

```
src/planner/production/
├── calendar/
│   ├── CalendarView.tsx       ← DnD context, sensors, drag event handlers
│   ├── CalendarGrid.tsx       ← Day columns (drop targets)
│   ├── TaskEvent.tsx          ← Individual task cards (draggable)
│   ├── TaskDetailPanel.tsx    ← Right-side detail panel with status actions
│   └── CalendarControls.tsx   ← View toggle, navigation, date picker
├── hooks/
│   ├── useTaskDragDrop.ts     ← Mutation hook for rescheduling
│   └── useCalendarTasks.ts    ← Data fetching hook (infinite query)
└── utils/
    └── dates.ts               ← toDateKey(), listDaysBetween(), etc.
```

---

## How Drag-and-Drop Works

### 1. Sensors (CalendarView.tsx)

```ts
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  useSensor(KeyboardSensor)
);
```

- **PointerSensor**: The drag only activates after the pointer moves 8px from the initial click point. This prevents accidental drags when the user just wants to click-to-select a task.
- **KeyboardSensor**: Enables drag via keyboard for accessibility.

### 2. Draggable Tasks (TaskEvent.tsx)

Each `TaskEvent` calls `useDraggable({ id: task.id, data: { task } })`, which returns:
- `setNodeRef` — attached to the `<button>` element so dnd-kit knows the DOM node
- `listeners` / `attributes` — pointer event handlers and ARIA attributes spread onto the button
- `isDragging` — true while this task is being dragged; we set `opacity-30` to ghost the original

The `data: { task }` payload is important — it's read back during `onDragEnd` to know which task was moved and what its current date is.

When rendered as a **DragOverlay** (the floating clone), the component receives `isDragOverlay={true}` and skips attaching `setNodeRef`/`listeners` (the overlay is just a visual; dnd-kit manages it separately).

### 3. Droppable Day Columns (CalendarGrid.tsx → DayColumn)

Each day is a `DayColumn` component that calls `useDroppable({ id: dateKey })`, where `dateKey` is a `YYYY-MM-DD` string (e.g. `"2026-02-08"`).

- `setNodeRef` — attached to the day's `<div>` container
- `isOver` — true when a task is being hovered over this day; triggers a `ring-2 ring-primary bg-primary/5` highlight

### 4. DnD Context & Event Handling (CalendarView.tsx)

The `<DndContext>` wraps the entire grid + detail panel. It handles two events:

**`onDragStart`**: Stores the dragged task in `activeTask` state so the `<DragOverlay>` can render a clone.

**`onDragEnd`**: The core logic:
```ts
function onDragEnd(event: DragEndEvent) {
  setActiveTask(null);                          // clear overlay
  const { active, over } = event;
  if (!over) return;                            // dropped outside any day

  const taskId = active.id as string;           // UUID of the task
  const newDateKey = over.id as string;         // "YYYY-MM-DD" of the target day
  const task = active.data.current?.task;       // full task object from useDraggable data
  if (!task) return;

  const currentDateKey = toDateKey(task.dueDate);
  if (currentDateKey === newDateKey) return;    // dropped on same day — no-op

  rescheduleTask(taskId, newDateKey);           // fire the mutation
}
```

---

## How Saving Works

### Frontend (useTaskDragDrop.ts)

```ts
function handleDragEnd(taskId: string, newDateKey: string) {
  mutation.mutate({ id: taskId, dueDate: `${newDateKey}T00:00:00` });
}
```

When a drag completes on a new day:
1. The hook calls `trpc.tasks.updateDueDate.useMutation()` with the task UUID and the new date string.
2. **On success**, it calls `utils.tasks.list.invalidate()` which tells React Query to refetch the task list. The calendar re-renders with the task now grouped under the new day.
3. While the mutation is in flight, a "Saving..." indicator appears in the filter bar (`isUpdating` from the hook).

There is **no optimistic update** — the task stays in its original position until the server confirms the change and the query refetches. This keeps the UI consistent with the database.

### Backend (updateTaskDueDate.ts)

The tRPC mutation `tasks.updateDueDate`:
1. Validates the task exists and belongs to the user's farm (`farm_id` check via `findFirst`)
2. Updates the `due_date` column in the `tasks` table in PostgreSQL
3. Returns the updated task with related `order_items`, `orders`, `products`, and `blends` included

The input is validated by Zod:
```ts
const updateTaskDueDateSchema = z.object({
  id: z.string().uuid(),
  dueDate: z.string().or(z.date()),
});
```

### Data Storage

Tasks live in the `tasks` table in PostgreSQL (via Prisma). The relevant column is:
- `due_date` — `timestamp(6)` — the date the task is scheduled for

When the frontend sends `"2026-02-10T00:00:00"`, the backend does `new Date(input.dueDate)` and writes it to this column. The calendar then fetches tasks within the visible date range using `dueDateStart`/`dueDateEnd` filters on the `tasks.list` infinite query.

---

## How the Detail Panel Works (TaskDetailPanel.tsx)

The panel on the right side shows:
- **Type badge** (Soak/Seed/Move to Light/Harvest) color-coded
- **Status badge** (To Do/In Progress/Completed) color-coded
- **Product name** (from the related order item's product or blend)
- **Order number**, **due date**, **trays needed**, **quantity**

It also has a **quick status action button**:
- If status is `TODO` → button says "Start Task" and sets status to `IN_PROGRESS`
- If status is `IN_PROGRESS` → button says "Complete Task" and sets status to `COMPLETED`
- If status is `COMPLETED` → no button shown

This uses `trpc.tasks.updateStatus.useMutation()` and invalidates the task list on success, same pattern as the DnD reschedule.

---

## Click vs. Drag

The 8px activation distance on `PointerSensor` is the key to making click-to-select and drag-to-reschedule coexist:
- **Click**: pointer down + pointer up within 8px → `onClick` fires on the button → task gets selected in the detail panel
- **Drag**: pointer down + move 8px+ → dnd-kit takes over → `onDragStart` fires → `onDragEnd` fires when released

This means clicking a task still works normally; dragging only kicks in with deliberate movement.
