# Phase 3: Order Management & Task Generation

**Status:** Complete (with known bugs noted below)
**Tests:** 72 passing across 17 test files (38 new tests added)

## What Was Built

### Core Workflow
Orders are the centerpiece of the planner. When a user creates an order with items (products or blends), the system:

1. Generates a sequential order number (`ORD-000001`)
2. For each item, calculates production dates working backward from the harvest date:
   - `move_to_light_date = harvest_date - days_light`
   - `seed_date = move_to_light_date - days_germination`
   - `soak_date = seed_date - days_soaking`
3. Calculates trays needed: `ceil(quantityOz * (1 + overagePercent/100) / avgYieldPerTray)`
4. Auto-generates 4 tasks per order item: SOAK, SEED, MOVE_TO_LIGHT, HARVEST
5. For blends, uses the ingredient with the longest total growing time

### Order Status Machine
```
Pending → In Progress → Ready → Delivered
   ↓          ↓           ↓
 Cancelled  Cancelled   Cancelled
```
No backward transitions allowed. Orders can only be edited (notes/customer) while Pending.

### Task Status Machine
```
TODO → IN_PROGRESS → COMPLETED
```
Tasks can also jump from TODO directly to COMPLETED. Completing a task records `completed_at`, and optionally `actual_trays`, `seed_lot`, and `completion_notes`.

## Files Created

### Backend - `apps/api/src/domains/planner-domain/`

```
utils/
  dateCalc.ts                          # subDays, calculateTraysNeeded, generateOrderNumber, date calc

orders/
  types.ts                             # Order, OrderItem interfaces + Zod schemas
  logger.ts                            # planner-orders logger
  router.ts                            # list, byId, create, updateStatus, update
  queries/
    listOrders.ts                      # Paginated, filters: status, customerId, search
    getOrderById.ts                    # Full order with customer, items, tasks + mapDb functions
    index.ts
  commands/
    createOrder.ts                     # Transaction: order + items + date calc + task generation
    updateOrderStatus.ts               # State machine transitions
    updateOrder.ts                     # Edit notes/customer (Pending only)
    index.ts

tasks/
  types.ts                             # Task interface + Zod schemas
  logger.ts                            # planner-tasks logger
  router.ts                            # list, byId, complete, updateStatus, updateDueDate
  queries/
    listTasks.ts                       # Paginated, filters: type, status, dueDateStart/End
    getTaskById.ts                     # Full task with order item relations + mapDbTask
    index.ts
  commands/
    generateTasksForOrderItem.ts       # Internal helper: creates 4 tasks per item
    completeTask.ts                    # Mark complete with optional fields
    updateTaskStatus.ts                # State machine transitions
    updateTaskDueDate.ts               # Change due date
    index.ts
```

### Frontend - `src/planner/`

```
orders/
  OrdersPage.tsx                       # List page with status/search filters, "New Order" button
  components/
    OrderList.tsx                      # Expandable cards with items table, status actions
    OrderForm.tsx                      # Modal: customer picker, multi-item form, date preview
    OrderStatusBadge.tsx               # Color-coded status pills

tasks/
  TasksPage.tsx                        # List page with type/status filters
  components/
    TaskList.tsx                       # Cards grouped by date
    TaskCard.tsx                       # Type-colored cards (SOAK=blue, SEED=green, etc.)
    TaskCompletionForm.tsx             # Modal: actual trays, seed lot, notes
```

### Modified Files
- `apps/api/src/lib/trpc/router.ts` — Added `orders: orderRouter`, `tasks: taskRouter`
- `apps/api/src/test/mockPrisma.ts` — Added order_items (expanded), tasks mocks + createMockDbOrder/Item/Task helpers
- `src/planner/PlannerPage.tsx` — Added Orders (ClipboardList) and Tasks (CheckSquare) sidebar items

## Test Coverage

| Test File | Tests | What it covers |
|-----------|-------|---------------|
| `dateCalc.test.ts` | 11 | subDays, calculateTraysNeeded, generateOrderNumber, calculateDatesFromHarvest, findLongestTimingFromBlend |
| `createOrder.test.ts` | 4 | Order creation with tasks, tray calculation, customer validation, blend support |
| `updateOrderStatus.test.ts` | 7 | All valid transitions, invalid backward transitions, terminal states, not found |
| `listOrders.test.ts` | 4 | Pagination, status filter, customer filter, search |
| `completeTask.test.ts` | 3 | Completion with optional fields, not found, already completed |
| `generateTasks.test.ts` | 4 | 4 tasks with correct types, titles, due dates, default status/priority |
| `listTasks.test.ts` | 5 | Pagination, type filter, status filter, date range filter, sort order |

## Known Issues / Bugs

- Logger imports were modified by linter to use `import { logger as rootLogger } from '../../../../lib/logger/index.js'` pattern instead of the per-domain `createLogger` pattern used in Phases 1-2. Both work, but the pattern is inconsistent across domains.
- The order form's calculated date preview only works for products (not blends) since blend ingredient timing data isn't available on the frontend dropdown.
- No delete/cancel order items individually — the whole order must be cancelled.
- `$transaction` callback in `createOrder` uses `tx: any` to avoid Prisma type complexity.

## How to Run

```bash
# Backend tests
cd apps/api && npx vitest run src/domains/planner-domain

# TypeScript check (ignore pre-existing middleware.ts error)
npx tsc --noEmit

# Frontend build
cd project-root && npx vite build
```

## What Comes Next (Phase 4)

Phase 4 is **Production Views**: calendar view, seeding/transplant/harvest views, and specialized production interfaces that consume the order and task data built in this phase.
