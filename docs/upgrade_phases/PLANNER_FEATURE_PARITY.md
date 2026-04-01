# Planner Feature Parity — Rooted-Planner → Rooted-Web-App

## Overview

This document catalogs every functional gap between the Rooted-Planner (standalone monorepo) and the Rooted-Web-App planner module. The goal is to bring the Rooted-Web-App planner to full feature parity. Each gap is described from the user's perspective — what they can do today in Rooted-Planner but cannot do in Rooted-Web-App — and then translated into the code changes required.

Items are ordered by priority: core production workflow first, then business operations, then nice-to-haves.

**Current status note (2026-03-27):**
- Priority 1 is implemented in the Rooted-Web-App codebase.
- The remaining operational requirement for Priority 1 is database rollout: the planner parity Prisma migration must be applied in each environment before the new schema-backed features are used.

**Reference projects:**
- Rooted-Planner: `/Users/VishalVunnam/Desktop/Rooted/Rooted-Planner`
- Rooted-Web-App: `/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App`

---

## Priority 1 — Core Production Workflow Gaps ✅ Complete

These gaps directly affected daily farm production operations. They are now implemented in Rooted-Web-App.

**Completion notes:**
- Recurring schedules, order cloning, SKU/package-driven ordering, richer task completion logging, and blend ingredient scheduling are implemented in the planner backend and frontend.
- Team management was added as a supporting surface so task completion can reference employees.
- Priority 1 is considered complete at the application layer; environments still need the planner parity migration applied for the schema-backed features to operate correctly.

---

### 1A. Recurring Order Schedules

**What the user can do in Rooted-Planner:**
- Navigate to Orders → Recurring tab
- Create a recurring schedule with a name, optional customer, and one of two schedule types:
  - **FIXED_DAY**: check specific weekdays (e.g., every Monday and Wednesday)
  - **INTERVAL**: every N days (e.g., every 7 days)
- Add items to the schedule (product + quantity in oz + overage %)
- Save the schedule, then toggle it Active or Inactive
- Click "Generate Order" to manually create an order from the schedule at any time
- View next harvest date, item summary, and schedule description on the card
- See stats: active schedule count alongside active order count
- The system can auto-generate orders based on lead time (e.g., 28 days ahead)
- Add skip dates for holidays/vacations so no orders are generated on those days

**What the user can do in Rooted-Web-App now:**
- Navigate to a dedicated Recurring page in the planner
- Create, edit, activate/deactivate, and delete recurring schedules
- Add schedule items and skip dates
- Manually generate an order from a schedule
- Use server-side recurring date calculations and startup/interval generation hooks

**Status:** Complete in application code. Requires the planner parity migration in the target database before production use.

**Implementation notes:**

| Layer | Work |
|-------|------|
| **Backend — tRPC router** | Create `apps/api/src/domains/planner-domain/recurring-schedules/router.ts` with procedures: `list`, `byId`, `create`, `update`, `delete`, `toggleActive`, `addSkipDate`, `removeSkipDate`, `generateOrder`. The `generateOrder` procedure must reuse the existing order-creation logic (including task auto-generation) from the orders domain. |
| **Backend — generation service** | Create a service that calculates the next harvest dates from a schedule definition. Port the `calculateRecurringHarvestDates()` and `getNextRecurringDate()` utilities from Rooted-Planner's `packages/shared/src/utils/production-calculator.ts`. |
| **Backend — auto-generation** | Add a cron job or scheduled invocation that queries active schedules where `nextGenerationDate <= now + leadTimeDays`, generates orders, and records the generated order IDs on the schedule. |
| **Frontend — RecurringSchedulesPage** | Create `src/planner/recurring-schedules/` with: `RecurringSchedulesPage.tsx` (list + stats), `RecurringScheduleForm.tsx` (create/edit modal), `RecurringScheduleCard.tsx` (display card with actions). |
| **Frontend — form** | Schedule type radio (FIXED_DAY / INTERVAL), weekday checkboxes (conditionally shown), interval days input, customer dropdown, repeating items section (product selector + qty oz + overage %), skip dates picker. |
| **Frontend — actions** | Generate Order button (calls `generateOrder`), Activate/Deactivate toggle, Delete with confirmation. |
| **Navigation** | Add "Recurring" entry to planner sidebar in `PlannerPage.tsx`, or add a tab to the existing Orders page. |
| **Prisma schema** | The table exists but verify all columns match: `scheduleType`, `daysOfWeek`, `intervalDays`, `leadTimeDays`, `startDate`, `endDate`, `isActive`, `skipDates`, `lastGeneratedAt`. Add missing columns if needed. |

---

### 1B. Order Cloning with Date Offset

**What the user can do in Rooted-Planner:**
- On any order card, click the "Clone" button
- A modal appears showing the original order number, customer, and item count
- Enter a number of days to shift harvest dates forward (e.g., +7)
- Click "Clone Order"
- A new order is created with identical items but all harvest dates (and calculated soak/seed/light dates) shifted forward by the offset
- The new order gets its own order number and generates its own tasks

**What the user can do in Rooted-Web-App now:**
- Clone an order from the order list
- Shift harvest dates by a day offset in a dedicated modal
- Generate a fresh order number and a new set of recalculated production tasks

**Status:** Complete.

**Implementation notes:**

| Layer | Work |
|-------|------|
| **Backend** | Add a `clone` procedure to the orders router. Input: `orderId` + `dayOffset` (integer). Logic: fetch the source order with items, create a new order with same customer/notes, copy each item with `harvestDate + dayOffset` days, recalculate all production dates per item, auto-generate tasks for the new order. |
| **Frontend** | Add a "Clone" icon button to each order card in `OrderList.tsx`. Create `CloneOrderModal.tsx` showing source order summary and a "Shift harvest dates by ___ days" number input. On submit, call the clone mutation and navigate to or highlight the new order. |

---

### 1C. SKU / Packaging System in Orders

**What the user can do in Rooted-Planner:**
- When creating an order, select a variety, then pick a specific SKU (e.g., "4oz Clamshell", "1lb Bulk Bag")
- Each SKU has: code, name, weight (oz), price, package type, sales channel, availability status, stock quantity
- Enter quantity as number of SKU units (e.g., "12 clamshells"), and the system calculates total oz (12 × 4oz = 48oz)
- Manage SKUs on a dedicated tab under Varieties & Mixes: create, edit, delete SKUs; filter by channel/availability; sort by multiple columns
- Manage package types (clamshell, bulk bag, etc.) with a seed-defaults button
- SKU availability and public visibility toggles are inline-editable

**What the user can do in Rooted-Web-App now:**
- Manage SKU records and package types from the planner products surface
- Select a SKU/package when creating an order and enter unit quantity instead of raw oz
- See total oz derived from `quantity × sku.weightOz`
- Use inline SKU availability/public toggles and package-type assignment
- Order both products and blends through SKU-backed order items

**Status:** Complete.

**Implementation notes:**

| Layer | Work |
|-------|------|
| **Prisma schema** | Add `skus` and `package_types`. In Rooted-Web-App, SKUs are modeled pragmatically to support both varieties and blends, since blend ordering is already part of the planner workflow. |
| **Backend** | Add `skus` sub-router under products: `list` (with filters for channel, availability, search), `create`, `update`, `delete`. Add `packageTypes` sub-router: `list`, `create`, `update`, `delete`, `seedDefaults`. |
| **Frontend — SKU management** | Add a third tab "SKUs" to `ProductsPage.tsx`. Build `SkuList.tsx` (table with sortable columns, inline availability/public toggles, search, channel filter, availability filter) and `SkuForm.tsx` (modal with code, name, product dropdown, weight, price, channel radio, package type dropdown, toggles). |
| **Frontend — package types** | Add package type management (inline list with add/edit/delete) accessible from the SKU tab or as a sub-section. |
| **Frontend — order form change** | Modify `OrderForm.tsx`: after selecting a product, show a SKU dropdown (filtered by selected product + available only). Change quantity input from "oz" to "units of SKU." Auto-calculate and display total oz = `quantity × sku.weightOz`. Keep overage % as-is. This is a breaking change to the order creation UX — the oz field becomes derived, not entered. |
| **Backend — order item change** | Add `skuId` to `order_items` table. Update order creation logic to resolve oz from `quantity × sku.weightOz`. |

---

### 1D. Task Completion — Full Logging

**What the user can do in Rooted-Planner:**
- When completing a task, fill out a detailed log:
  - **Completed By**: select an employee from a dropdown
  - **Actual Trays**: number input
  - **Actual Yield**: oz input (separate from trays)
  - **Seed Lot**: selector showing available lots
  - **Completed Date**: date picker (defaults to today)
  - **Completed Time**: time picker (defaults to now)
  - **Completion Notes**: text area
  - **Rack Destination** (for MOVE_TO_LIGHT tasks): modal picker showing available racks and levels with tray allocation
- View completed task logs in a dedicated "Logs" tab on the Operations page
- Bulk actions: select multiple tasks, then batch mark-complete, batch assign rack, or batch assign seed lot

**What the user can do in Rooted-Web-App now:**
- Complete tasks with employee, trays, yield, timestamp, seed lot, notes, and optional rack assignments
- Use a functional rack-assignment flow for MOVE_TO_LIGHT work
- Review completed-task logs from the Production page

**Status:** Complete at the form/logging layer. Batch actions outside Seeding remain a Priority 3 refinement rather than a blocker for Priority 1 parity.

**Implementation notes:**

| Layer | Work |
|-------|------|
| **Prisma schema** | Add to `tasks` table: `completedById` (FK → employees), `actualYieldOz` (Decimal), `completedAt` (DateTime — currently may only be a boolean flag). Ensure `rack_assignments` table is fully wired to tasks. |
| **Backend** | Update `tasks.complete` procedure to accept: `completedById`, `actualYieldOz`, `completedAt` (ISO timestamp), `rackAssignments` (array of `{ rackElementId, level, trayCount }`). Add a `tasks.listCompleted` query for the Logs tab (filter by date range, type, employee). |
| **Frontend — TaskCompletionForm** | Expand the form in `src/planner/tasks/TaskCompletionForm.tsx`: add employee dropdown (query employees list), actual yield oz input, date picker, time picker. For MOVE_TO_LIGHT tasks, replace the placeholder rack modal with a functional one: query the active farm layout for rack elements, display available levels with capacity, let user allocate trays across rack/level slots. |
| **Frontend — Logs tab** | Add a "Logs" tab to the Production page (or Tasks page) that lists completed tasks with all logged data in a table: date/time, employee, product, task type, actual trays, actual yield, seed lot, rack, notes. Filterable by date range, type, and employee. |
| **Frontend — batch actions** | Add batch selection (checkboxes) to Transplant and Harvest views matching what Seeding already has. Add batch "Assign Rack" and "Assign Seed Lot" actions to the batch action bar. |

---

### 1E. Blend Ingredient-Level Production Breakdown

**What the user can do in Rooted-Planner:**
- When creating an order with a blend/mix product, the order form shows a tree view breaking down each ingredient:
  - Ingredient name (with ratio %)
  - Target oz needed for that ingredient
  - Trays needed for that ingredient
  - Soak date (if that ingredient requires soaking)
  - Seed date for that ingredient
- This lets the user see that a "Spicy Mix" order actually needs 3 trays of radish (seed Monday) and 2 trays of mustard (seed Tuesday) because they have different growth timelines

**What the user can do in Rooted-Web-App now:**
- See ingredient-level blend breakdown during order entry
- View ingredient oz, trays, and individual soak/seed/light dates
- Generate backend tasks per blend ingredient rather than using only a single aggregate blend schedule

**Status:** Complete.

**Implementation notes:**

| Layer | Work |
|-------|------|
| **Shared utility** | Port the `calculateBlendProductionSchedule()` function from Rooted-Planner's `packages/shared/src/utils/production-calculator.ts`. This function takes a blend's ingredients, their ratios, and the harvest date, and returns per-ingredient schedules (oz, trays, soak/seed/light dates). |
| **Frontend — OrderForm** | In `OrderForm.tsx`, detect when the selected product is a blend. Query the blend's ingredients. Call the blend calculator with the entered harvest date and quantity. Render an ingredient breakdown section below the item showing each ingredient's name, ratio, oz, trays, and individual production dates. Update live as the user changes quantity or harvest date. |
| **Backend — order creation** | When an order item references a blend, generate tasks per ingredient (not just per blend). Each ingredient may have different soak/seed/light dates based on its own product's growth parameters. Store `blendIngredientId` on the task or order item sub-records. |

---

## Priority 2 — Business Operations

These features support running the business side of the farm. Users can operate without them short-term, but they are required for a complete production-to-delivery workflow.

**Pragmatic delivery order for Priority 2:**
1. Finish `2B. Employee / Team Management` first, because it already exists partially and it removes friction for delivery driver assignment, invoice ownership, and operations auditability.
2. Deliver `2A. Supplies & Inventory Management` next, because the schema already exists in part and it unlocks farm-cost and replenishment workflows without heavy cross-domain coupling.
3. Deliver `2D. Delivery Routes` after Team, because drivers should be selected from employees and routes naturally reuse the existing orders/customers stack.
4. Deliver `2C. Invoicing System` after SKU-backed ordering is stable in production, because invoice line items need to snapshot order/SKU/customer data cleanly.
5. Deliver `2E. CSA / Subscription Programs` last in this priority bucket, because it is effectively a mini product line with its own planning lifecycle and order generation rules.

**General guidance for Part 2:**
- Prefer extending the current planner tRPC/domain pattern instead of introducing a second API style.
- Keep monetary, pricing, and quantity fields as immutable snapshots on downstream records once generated. Orders, deliveries, and invoices should not drift because an upstream product or customer changed later.
- Use string-backed status fields initially for speed unless a strict enum is required for data integrity. The current schema style in Rooted-Web-App already leans that way.
- Reuse existing order creation, customer, task, and employee primitives wherever possible. Part 2 should compose with Priority 1 rather than recreate it.
- Ship internal workflow value before external integrations. For example, invoice CRUD and payment recording should not be blocked on Stripe or outbound email.

---

### 2A. Supplies & Inventory Management

**What the user can do in Rooted-Planner:**
- Navigate to Supplies & Inventory with four tabs: Stock, Purchases, Usage, Categories
- **Stock tab**: view supplies grouped by category, see stock quantity with status indicators (In Stock / Out of Stock / Negative), expand groups to see individual suppliers, edit supply details, record usage directly
- **Purchases tab**: log new purchases with date, supplier, multi-item selection, per-item quantity and unit cost, running total; view purchase history
- **Usage tab**: record supply usage with quantity, purpose (General Use, Restocking, Waste), and optional link to a task/order; view usage log
- **Categories tab**: create and manage supply categories
- Supply form includes: name, category, unit, supplier, quantity on hand, reorder point, cost per unit, shelf location, notes, product link (for seeds)

**What the user can do in Rooted-Web-App today:**
- The schema already contains `supplies`, `supply_categories`, `supply_purchases`, and `supply_usage`
- There is still no planner UI or API surface for operators

**Pragmatic implementation notes:**
- Do not recreate the supplies tables from scratch. Extend the existing schema instead of replacing it.
- Add missing business fields to the existing models rather than introducing a parallel inventory model. The current schema already has the right backbone.
- Keep stock quantity on `supplies` as the operationally queryable current value, but treat purchases and usage as the source-of-truth ledger for adjustments and auditability.
- Record `supply_usage.orderId` and `supply_usage.taskId` as optional links. Do not make usage logging depend on having an associated task or order.
- Start with manual supplier text fields before introducing a full suppliers domain. That keeps this feature useful without adding unnecessary relational overhead.
- Build the frontend around four operator workflows: stock lookup, receive purchase, record usage, manage categories. Cost analytics can remain out of scope for v1.

**Acceptance checks:**
- A user can add a supply, receive stock through Purchases, and see `quantityOnHand` increase immediately.
- A user can record usage from the Usage tab or from an inline stock action and see `quantityOnHand` decrease immediately.
- Out-of-stock / below-reorder / negative states are visually distinct in the Stock tab.
- Category grouping works even when a supply has no purchase history.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Prisma schema** | Extend the existing `supplies`, `supply_categories`, `supply_purchases`, and `supply_usage` models to close the remaining gaps: supplier text, reorder point, cost/unit, shelf location, notes, usage purpose, optional `orderId`, and any missing farm scoping/indexes. Avoid introducing duplicate inventory tables. |
| **Backend** | Create `apps/api/src/domains/planner-domain/supplies/router.ts` with sub-routers for supplies (CRUD + stock adjustment), purchases (list + create), usage (list + record), categories (CRUD). |
| **Frontend** | Create `src/planner/supplies/` with: `SuppliesPage.tsx` (4-tab layout), `StockList.tsx` (grouped by category, expandable, status indicators), `SupplyForm.tsx`, `PurchaseList.tsx`, `PurchaseForm.tsx`, `UsageList.tsx`, `UsageForm.tsx`, `CategoryList.tsx`. |
| **Navigation** | Add "Supplies" to planner sidebar. |

---

### 2B. Employee / Team Management

**What the user can do in Rooted-Planner:**
- Navigate to Team page
- View employee list with search and position/status filters
- See each employee's name, email, phone, position badge (color-coded: Admin=indigo, Farm Manager=purple, Salesperson=blue, Farm Operator=green, Driver=orange), status (Active/On Leave/Terminated), invite status, hire date, hourly rate
- Create/edit employees with: first name, last name, email, phone, position (dropdown), department, hire date, status, hourly rate
- Send account invites to employees (triggers Clerk invite)
- Resend expired invites
- Transfer farm ownership via a special modal

**What the user can do in Rooted-Web-App today:**
- View a basic Team page
- Create, edit, and delete employees
- Use employees in task completion forms
- Invite and resend-invite actions are still stubbed and there is no ownership-transfer flow yet

**Pragmatic implementation notes:**
- Treat the current employee router/page as the baseline rather than restarting this area.
- Split delivery into two passes:
  - pass 1: finish planner-facing directory quality: filters, badges, invite status, hourly rate visibility
  - pass 2: implement Clerk-backed invitation flows and ownership transfer
- Do not block Delivery Routes or task-completion auditing on invite automation. Employee records are already useful without full auth lifecycle wiring.
- Ownership transfer should be isolated behind an explicit admin-only modal and server command. It should not be mixed into normal employee CRUD.
- If roles/positions remain string-backed for now, centralize the allowed display values in shared constants before the UI starts styling badges from ad hoc strings.

**Acceptance checks:**
- A planner user can search/filter employees by status and position.
- Invite and resend-invite actions produce a deterministic result or a clear failure state.
- Driver selection in Delivery can reuse the employee list without additional schema changes.
- Ownership transfer is unavailable to non-admin users and requires explicit confirmation.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Backend** | Extend the existing `employees` router to complete the surface: position/status filters, invite-status payload, `sendInvite`, `resendInvite`, and an admin-only ownership transfer procedure. Integrate with Clerk for invitation flows instead of keeping placeholder success responses. |
| **Frontend** | Extend the existing `src/planner/employees/` surface with real filters, badges, invite status, resend controls, and an ownership transfer modal. Keep the existing form/list as the base implementation. |
| **Navigation** | Add "Team" to planner sidebar. |

---

### 2C. Invoicing System

**What the user can do in Rooted-Planner:**
- Navigate to Invoices page with three tabs: All, Unpaid, Create
- **All tab**: search invoices by number/customer, filter by status (Draft, Sent, Viewed, Partial, Paid, Overdue, Cancelled, Refunded), see status badges color-coded
- **Unpaid tab**: filtered view of unpaid invoices grouped by Overdue / Upcoming / Partially Paid, showing days overdue and amounts due
- **Create tab**: create invoice with auto-generated number, customer dropdown, due date, payment terms, line items (from orders or manual entry with description/qty/unit price), subtotal/tax/total calculation, internal and customer-facing notes, payment method selection
- View invoice detail in print-ready format with customer info, items table, totals, payment history
- Record payments via modal: method, amount, date, reference
- View payment history per invoice with delete option for corrections
- Send invoices (email)
- Print invoices

**What the user can do in Rooted-Web-App today:**
- Nothing. No invoicing tables, API, or UI.

**Pragmatic implementation notes:**
- Invoice records must snapshot customer name/address, line-item descriptions, unit prices, and amounts at the time of invoice creation. Do not depend on live order/customer records for rendered invoice history.
- Keep v1 invoicing internal-first: draft/create/edit/send status changes, print-ready rendering, and payment recording. Stripe collection and automated email delivery can be layered on later.
- Use per-farm invoice numbering and reset the sequence by year only if that matches the current business expectation. Otherwise keep a simple monotonically increasing per-farm sequence to avoid avoidable edge cases.
- Support both order-derived line items and manual lines in the same invoice. That is required for delivery fees, credits, adjustments, and non-order charges.
- Payment records should be append-only except for explicit correction/deletion actions. Treat them as ledger events, not mutable invoice fields.

**Acceptance checks:**
- A user can create a draft invoice from one or more orders or from manual line items only.
- Totals remain stable after the linked order changes.
- Recording a payment updates invoice status correctly for partial and full payment cases.
- Print-ready invoice output matches the saved invoice snapshot without extra live joins.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Prisma schema** | Create: `invoices` (id, invoiceNumber, customerId, farmId, status, issueDate, dueDate, subtotal, taxRate, taxAmount, total, internalNotes, customerNotes, paymentTerms), `invoice_items` (id, invoiceId, description, quantity, unitPrice, amount, orderId, orderItemId), `invoice_payments` (id, invoiceId, method, amount, date, reference, notes). |
| **Backend** | Create invoices router with: `list` (search + status filter), `byId`, `create`, `update`, `updateStatus`, `delete`, `recordPayment`, `deletePayment`, and optionally `send`. Auto-generate invoice numbers at the backend. Snapshot line-item and customer display data when the invoice is created. |
| **Frontend** | Create `src/planner/invoices/` with: `InvoicesPage.tsx` (3-tab layout), `InvoiceList.tsx`, `UnpaidList.tsx`, `InvoiceForm.tsx` (with items from orders or manual), `InvoiceDetail.tsx` (print-ready), `RecordPaymentModal.tsx`. |
| **Navigation** | Add "Invoices" to planner sidebar. |

---

### 2D. Delivery Routes

**What the user can do in Rooted-Planner:**
- Navigate to Delivery page
- Select a date to see routes for that day
- View route cards with: name, driver, status (Planned/In Progress/Completed/Cancelled), order count, order list
- Create a route: name, driver dropdown, date, add orders (shows ready orders not yet assigned)
- Start/complete routes
- View route detail: ordered stops with customer address, items to deliver, per-stop status (Pending/Out for Delivery/Delivered/Failed)

**What the user can do in Rooted-Web-App today:**
- Nothing. No delivery tables, API, or UI.

**Pragmatic implementation notes:**
- Delivery should reuse `orders`, `customers`, and `employees` rather than inventing a separate delivery-order concept.
- Add an `assignedRouteId` or equivalent route membership relation only if route exclusivity becomes difficult to enforce from `delivery_stops` alone. Start with stops as the source of truth.
- Snapshot customer name and delivery address onto each stop when it is created. Drivers should not lose delivery context because the customer record changed later.
- Restrict route order selection to orders in `Ready` or an explicitly deliverable state. Do not allow cancelled or draft-like records onto routes.
- Treat per-stop status as more important than route status. Route status can be derived or rolled up from stop progress, even if a top-level route status is still stored for convenience.

**Acceptance checks:**
- A user can create a route for a date, assign a driver, and add ready orders that are not already assigned elsewhere.
- Route detail preserves stop order and delivery address snapshot.
- Updating stop status updates the route view without mutating the original order history incorrectly.
- Removing an order from a route cleanly frees it for reassignment.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Prisma schema** | Create: `delivery_routes` (id, name, driverId, farmId, date, status), `delivery_stops` (id, routeId, orderId, sequence, status, notes, deliveredAt). Strongly consider snapshot columns for `customerName` and `deliveryAddress` on `delivery_stops` to prevent historical drift. |
| **Backend** | Create delivery router with: `listByDate`, `byId`, `create`, `update`, `updateStatus`, `addOrders`, `removeOrder`, `updateStopStatus`. |
| **Frontend** | Create `src/planner/delivery/` with: `DeliveryPage.tsx` (date selector + route cards), `RouteForm.tsx` (create/edit with order picker), `RouteDetail.tsx` (stop list with status actions). |
| **Navigation** | Add "Delivery" to planner sidebar. |

---

### 2E. CSA / Subscription Programs

**What the user can do in Rooted-Planner:**
- Navigate to CSA page with three tabs: Programs, Members, Weeks
- **Programs**: create programs with name, start/end dates, description, status (Draft/Open Enrollment/Active/Completed/Cancelled); manage share types (Small, Large) with weekly allocation, price, and capacity
- **Members**: enroll customers into programs with share type selection, payment terms, delivery preference (pickup/delivery), auto-renew toggle; track payment status; pause/cancel memberships
- **Weeks**: plan weekly allocations via a product × share-type grid (editable matrix of oz values); finalize weeks to lock edits; generate orders from finalized allocations (creates one order per member based on their share type)
- Manage pickup locations with name, address, day/time, capacity

**What the user can do in Rooted-Web-App today:**
- Nothing.

**Pragmatic implementation notes:**
- CSA is the largest item in Priority 2 and should be treated as a separate internal product inside the planner, not as a small extension of orders.
- Reuse the existing order engine for generated CSA orders. Do not create a second order-creation path for weekly fulfillment.
- Lock finalized weeks. Once a week is finalized and orders are generated, changes should go through explicit regeneration or adjustment flows rather than silent mutation.
- Start with product-level allocations in oz. Blend support can piggyback on the existing order engine if products/blends are already orderable.
- Keep pickup locations farm-scoped and reusable across programs. They should not be embedded directly into a member record if they may change seasonally.
- Payment status should remain lightweight at first. Detailed accounting belongs in invoicing/payments, while CSA only needs enough state to manage enrollment and operational fulfillment.

**Acceptance checks:**
- A user can define a program, share types, and members without generating any orders yet.
- A user can define a week, finalize it, and generate one order per active member based on the saved allocation matrix.
- Re-running generation for the same finalized week does not duplicate orders accidentally.
- Paused or cancelled members are excluded from weekly order generation.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Prisma schema** | Create: `csa_programs` (id, name, farmId, status, startDate, endDate, description), `csa_share_types` (id, programId, name, weeklyAllocationOz, pricePerWeek, maxMembers), `csa_members` (id, programId, customerId, shareTypeId, status, paymentStatus, deliveryPreference, startWeek, autoRenew), `csa_weeks` (id, programId, weekNumber, startDate, endDate, status), `csa_allocations` (id, weekId, shareTypeId, productId, quantityOz), `csa_pickup_locations` (id, farmId, name, address, dayOfWeek, time, capacity), `csa_payments` (id, memberId, method, amount, date, reference). |
| **Backend** | Create CSA domain router with sub-routers for programs, share types, members, weeks, allocations, pickup locations, and a `generateOrders` procedure that creates one order per active member for a finalized week. Reuse the existing planner order-creation flow so generated CSA orders inherit the same SKU/task/production behavior as normal planner orders. |
| **Frontend** | Create `src/planner/csa/` with: `CSAPage.tsx` (3-tab layout), program CRUD, share type management, member enrollment form, allocation grid (editable matrix component), week management with finalize/generate actions, pickup location management. |
| **Navigation** | Add "CSA" to planner sidebar. |

---

## Priority 3 — Operational Views & UX Enhancements

These improve the day-to-day user experience for farm operators and managers.

---

### 3A. Dashboard with Priority Panel

**What the user can do in Rooted-Planner:**
- Land on a Dashboard page after login showing:
  - **Needs Attention panel**: overdue tasks (red, showing days overdue) and tasks due today (amber), each showing task type badge, order number, product, customer, due date — clickable to navigate to operations
  - **Capacity Overview**: rack capacity bar (color-coded by utilization: green <50%, amber 50-80%, red >80%), total/occupied trays, available racks
  - **Week Summary**: pending orders, tasks due this week, completed tasks this week
  - **Harvest Forecast**: table of upcoming harvests by date with product and quantity
  - **Quick Access grid**: 6 cards linking to Farm Layout, Varieties, Employees, Orders, Operations, Wiki
  - **Tutorial system**: guided onboarding with progress tracking, start/restart/show progress options

**What the user can do in Rooted-Web-App:**
- The planner opens directly to whatever sidebar section they click. There is no dashboard or home view. No overdue alerts, no capacity visualization, no forecasting.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Backend** | Create a `dashboard` router with aggregation queries: `getOverdueTasks`, `getTasksDueToday`, `getCapacityOverview` (count trays assigned vs total rack capacity from active layout), `getWeekSummary` (order/task counts), `getHarvestForecast` (upcoming HARVEST tasks grouped by date with product/qty). |
| **Frontend** | Create `src/planner/dashboard/DashboardPage.tsx` with: `PriorityPanel.tsx` (overdue + today's tasks), `CapacityBar.tsx` (progress bar with utilization color), `WeekSummary.tsx` (stat cards), `HarvestForecast.tsx` (table), `QuickAccess.tsx` (link grid). |
| **Navigation** | Add "Dashboard" as the first item in the planner sidebar. Make it the default landing page when entering the planner. |

---

### 3B. Operations — All Tasks View & Logs Tab

**What the user can do in Rooted-Planner:**
- **All Tasks tab**: a unified list of every task regardless of type, with filtering and sorting, bulk selection, and bulk actions (mark complete, assign rack, assign seed lot)
- **Logs tab**: view all completed task logs with full detail (date/time, employee, product, task type, actual trays, yield, seed lot, rack, notes) — filterable by date range, type, and employee
- **Show Completed toggle**: in every operations view, toggle to show/hide completed tasks
- **Show Overdue toggle**: highlight overdue tasks specifically

**What the user can do in Rooted-Web-App:**
- The Tasks page is a separate page from Production. It has type and status filters and groups tasks by date, but there is no "All" combined view within the Production page, no Logs tab, no Show Completed/Overdue toggles in the production views.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Frontend — All Tasks view** | Add an "All" tab to the Production page that renders the existing `TaskList` component without type pre-filtering. Add bulk selection checkboxes and a batch action bar (Complete Selected, Assign Rack, Assign Seed Lot). |
| **Frontend — Logs tab** | Add a "Logs" tab to the Production page. Create `CompletedTasksLog.tsx` — a table component querying completed tasks with columns: completed date/time, employee, product, task type, actual trays, actual yield, seed lot, rack assignment, notes. Add date range picker and type/employee filters. |
| **Frontend — toggles** | Add "Show Completed" and "Show Overdue" checkbox toggles to the Calendar, Seeding, Transplant, and Harvest views. Wire them to the existing task list query filters. |

---

### 3C. Rack Assignment — Functional Implementation

**What the user can do in Rooted-Planner:**
- When completing a MOVE_TO_LIGHT task, a rack destination modal opens
- Shows list of available grow racks from the active farm layout
- Each rack shows levels and current tray occupancy per level
- User selects a rack, picks a level, enters tray count to allocate
- Can split across multiple racks/levels if needed
- Allocation is saved and visible on the farm layout overlay

**What the user can do in Rooted-Web-App:**
- When clicking "Assign Rack" on a transplant task, a placeholder modal opens with a disabled input and a message: "Rack assignments will be fully implemented in Phase 5."

**Code changes required:**

| Layer | Work |
|-------|------|
| **Backend** | The `rack_assignments` table already exists. Create procedures: `listByLayout` (get all assignments for a layout), `assign` (create assignment: rackElementId, level, trayCount, orderItemId, taskId), `unassign`. Add a query to compute rack capacity from the active layout's canvas JSON (iterate rack elements, sum levels × trays per level). |
| **Frontend** | Replace the placeholder `RackAssignmentModal.tsx` with a functional component: query the active farm layout, parse rack elements from canvas data, display each rack with its levels and current occupancy (query existing assignments), let user select rack → level → tray count, support multi-rack allocation, save assignments on confirm. |
| **Farm Layout overlay** | On the `FarmLayoutPage`, optionally overlay rack occupancy data on the canvas — color-code racks by utilization. |

---

### 3D. Customer Detail Panel — Stats & Actions

**What the user can do in Rooted-Planner:**
- Click a customer to open a detail side panel showing:
  - Full customer info
  - **Stats**: total orders count, total revenue (oz proxy), average order value, last order date with "days since" counter
  - **Recent Orders**: last 5 orders with order number, date, status badge, total items
  - **Reorder button**: clones the customer's last order
  - **Create Order button**: opens order form pre-filled with this customer

**What the user can do in Rooted-Web-App:**
- Click a customer card to expand it and see basic contact info, payment terms, address, tags, notes
- Edit and Deactivate buttons
- No order history, no stats, no reorder action, no create-order shortcut

**Code changes required:**

| Layer | Work |
|-------|------|
| **Backend** | Add a `customers.stats` query: given a customerId, return total order count, total oz ordered, average oz per order, most recent order date. Add a `customers.recentOrders` query returning the last 5 orders with number, date, status, item count. |
| **Frontend** | Redesign the customer expanded view (or add a slide-out panel): add a stats section with the 4 metrics, a recent orders list with status badges, a "Reorder" button (clones last order — reuses the clone logic from 1B), and a "New Order" button that navigates to the order form with customer pre-selected. |

---

## Priority 4 — Analytics, Financials & Reporting

---

### 4A. Financials / Analytics Dashboard

**What the user can do in Rooted-Planner:**
- Navigate to Financials page
- Toggle period: 30 days, month-to-date, 90 days, year-to-date
- View key metric cards: Total Volume (with trend), Total Orders (with avg items), Active Customers, Task Completion % (with overdue count)
- View charts: Revenue over time, Order Status breakdown (pie/bar), Top Customers (horizontal bar), Task Metrics (completion rates by type), Yield Variance (expected vs actual)

**What the user can do in Rooted-Web-App:**
- A small `ProductionMetrics` banner on the Production page shows basic counts. No dedicated analytics page, no charts, no period filtering.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Backend** | Create `analytics` router with queries: `volumeByPeriod` (total oz by date range with trend vs prior period), `ordersByPeriod` (count + avg items), `activeCustomers` (distinct customers with orders in period), `taskCompletion` (completed/total/overdue by type), `topCustomers` (ranked by oz ordered), `yieldVariance` (sum actual yield vs sum expected yield by product). Each accepts a `period` enum (30D, MTD, 90D, YTD) and resolves to a date range. |
| **Frontend** | Create `src/planner/analytics/AnalyticsPage.tsx` with: period toggle buttons, `StatCard` components for each metric (with trend arrows), chart components using a charting library (Recharts is already a dependency in Rooted-Planner — add to Rooted-Web-App). Charts: `RevenueChart`, `OrderStatusChart`, `TopCustomersChart`, `TaskMetricsChart`, `YieldVarianceChart`. |
| **Navigation** | Add "Analytics" to planner sidebar. |

---

### 4B. Print & Export Capabilities

**What the user can do in Rooted-Planner:**
- From an order view modal: Print Invoice, Print Pack List (separate formats)
- Pack list format: items by product, quantities, customer, delivery address, notes section, signature line
- Invoice print: professional format with farm info header, items table, totals
- Analytics data exportable to CSV/PDF

**What the user can do in Rooted-Web-App:**
- "Print Schedule" button in Seeding view (CSS print styles)
- No invoice print, no pack list print, no data export

**Code changes required:**

| Layer | Work |
|-------|------|
| **Frontend** | Create `src/planner/orders/PrintPackList.tsx` — a print-optimized layout: order items grouped by product, quantities, customer address, notes, signature line. Triggered by a "Print Pack List" button on order detail. Create `src/planner/invoices/PrintInvoice.tsx` — a print-optimized invoice layout (this pairs with the invoicing feature in 2C). Add `window.print()` triggers with `@media print` CSS rules. |
| **Frontend — export** | Add CSV export buttons to analytics charts and task/order list views. Use a simple utility to convert query results to CSV and trigger a download. |

---

## Priority 5 — Store, Wiki & Settings

These are secondary features that round out the platform but are not blocking daily operations.

---

### 5A. Store / Marketplace

**What the user can do in Rooted-Planner:**
- Navigate to Store with tabs: SKUs, Orders, Share
- **SKUs tab**: manage public-facing product listings with inline availability and public toggles, image uploads
- **Orders tab**: view orders received through the public storefront
- **Share tab**: shareable storefront URL, QR code, copy link button, public/private toggle

**What the user can do in Rooted-Web-App:**
- Nothing.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Backend** | Create a public-facing API (unauthenticated) for storefront: `listPublicProducts` (only products with public SKUs), `createStorefrontOrder` (creates order from external customer). Create an admin router: `getStorefrontSettings` (URL slug, isPublic), `updateStorefrontSettings`. |
| **Frontend — admin** | Create `src/planner/store/` with: `StorePage.tsx` (3-tab layout), SKU management (reuses SKU components from 1C with public/image toggles), storefront order list, share tab with URL display, QR code generation (use a QR library), copy button. |
| **Frontend — public** | Create a public storefront page (may be a separate route or subdomain) that displays available products with images, prices, and an order form. This is a larger effort and may warrant its own phase doc. |

---

### 5B. Wiki / SOPs

**What the user can do in Rooted-Planner:**
- Navigate to Wiki page
- View documentation organized by spaces: Standard Operating Procedures, Training Materials, Equipment Guides, Safety Protocols
- Each space shows an icon, name, and page count
- Search across all documentation
- Create new spaces and pages
- Edit pages using a TipTap rich-text editor with formatting toolbar (bold, italic, lists, headings)
- View recently edited pages for quick access

**What the user can do in Rooted-Web-App:**
- Nothing.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Prisma schema** | Create: `wiki_spaces` (id, farmId, name, icon, sortOrder), `wiki_pages` (id, spaceId, title, content (JSON — TipTap document), createdBy, updatedAt). |
| **Backend** | Create wiki router: `spaces.list`, `spaces.create`, `spaces.update`, `spaces.delete`, `pages.list` (by space), `pages.byId`, `pages.create`, `pages.update`, `pages.delete`, `pages.search` (full-text search on title + content). |
| **Frontend** | Create `src/planner/wiki/` with: `WikiPage.tsx` (space grid + recent pages + search), `SpaceView.tsx` (page list within a space), `PageEditor.tsx` (TipTap editor — add `@tiptap/react`, `@tiptap/starter-kit` as dependencies), `PageView.tsx` (read-only rendered content). |
| **Navigation** | Add "Wiki" to planner sidebar. |

---

### 5C. Settings Page

**What the user can do in Rooted-Planner:**
- Navigate to Settings with tabs: General, Stripe, Advanced
- **General**: edit farm name, slug, full address, timezone (80+ options), currency (20+ options), harvest reminder days, auto-generate tasks toggle, unit system (metric/imperial)
- **Stripe**: connect/disconnect Stripe account for payment processing, view webhook status
- **Advanced**: delete farm (requires typing farm name), export farm data, clear cache, view system info (farm ID, created date)

**What the user can do in Rooted-Web-App:**
- Nothing planner-specific. Farm settings may exist elsewhere but are not in the planner module.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Prisma schema** | Ensure `farms` table has: `slug`, `address` (JSON), `timezone`, `currency`, `unitSystem`, `harvestReminderDays`, `autoGenerateTasks`. Add `stripeAccountId`, `stripeConnected` if Stripe integration is planned. |
| **Backend** | Create settings router: `get` (farm settings), `update` (partial update), `connectStripe` (OAuth flow), `disconnectStripe`, `deleteFarm` (with name confirmation), `exportData` (generate JSON/CSV dump). |
| **Frontend** | Create `src/planner/settings/` with: `SettingsPage.tsx` (3-tab layout), `GeneralSettings.tsx` (form with all fields), `StripeSettings.tsx` (connect button, status display), `AdvancedSettings.tsx` (danger zone with delete confirmation requiring farm name input, export button). |
| **Navigation** | Add "Settings" to planner sidebar (bottom section). |

---

## Priority 6 — Role-Based Access & Multi-Farm

---

### 6A. Role-Based Navigation & Permissions

**What the user can do in Rooted-Planner:**
- Navigation items are filtered by role:
  - **OWNER / ADMIN**: see all pages
  - **FARM_MANAGER**: see Dashboard, Operations, Orders, Varieties, Supplies, Customers, Delivery, Farm Layout, Wiki, Settings
  - **SALESPERSON**: see Dashboard, Operations, Orders, Customers, Delivery, Wiki
  - **FARM_OPERATOR**: see Dashboard, Operations, Wiki
  - **DRIVER**: see Dashboard, Delivery
- API endpoints enforce role-based access — a Farm Operator cannot create orders via the API even if they manipulate the frontend

**What the user can do in Rooted-Web-App:**
- All planner pages are visible to all authenticated farm users. No role-based filtering of navigation or API enforcement.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Backend** | Create a `requireRole(...roles)` middleware/procedure wrapper for tRPC. Apply to each router — e.g., orders.create requires FARM_MANAGER+, employees.* requires ADMIN+. Return 403 for unauthorized access. |
| **Frontend** | Create a `useUserRole()` hook that returns the current user's role for the active farm. Filter sidebar navigation items in `PlannerPage.tsx` based on role. Optionally hide action buttons (Create, Edit, Delete) for users without the required role. |

---

### 6B. Farm Selector & Multi-Farm Support

**What the user can do in Rooted-Planner:**
- A dropdown in the sidebar lets users switch between farms they have access to
- Can create a new farm from the dropdown
- All data is scoped to the selected farm

**What the user can do in Rooted-Web-App:**
- Farm context exists (X-Farm-Id header), but there is no UI for switching farms or creating new ones within the planner.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Frontend** | Add a farm selector dropdown to the top of the planner sidebar (or header). Query `farms.listForUser` to get farms the user belongs to. On selection, update the farm context (Zustand store or context provider) which feeds into the `X-Farm-Id` header for all tRPC calls. Add a "Create Farm" option that opens a form modal. |

---

## Summary Table

| # | Feature | Priority | Status | Effort | Depends On |
|---|---------|----------|--------|--------|------------|
| 1A | Recurring Order Schedules | P1 | Complete | Large | — |
| 1B | Order Cloning | P1 | Complete | Small | — |
| 1C | SKU / Packaging System | P1 | Complete | Large | — |
| 1D | Task Completion — Full Logging | P1 | Complete | Medium | 2B (employees) |
| 1E | Blend Ingredient Breakdown | P1 | Complete | Medium | — |
| 2A | Supplies & Inventory | P2 | Pending | Large | — |
| 2B | Employee / Team Management | P2 | Partial | Medium | — |
| 2C | Invoicing System | P2 | Pending | Large | 1C (SKUs for line items) |
| 2D | Delivery Routes | P2 | Pending | Medium | 2B (drivers) |
| 2E | CSA / Subscription Programs | P2 | Pending | X-Large | — |
| 3A | Dashboard & Priority Panel | P3 | Pending | Medium | — |
| 3B | All Tasks View & Logs Tab | P3 | Partial | Medium | 1D (full completion data) |
| 3C | Rack Assignment — Functional | P3 | Partial | Medium | Farm Layout (exists) |
| 3D | Customer Detail — Stats & Actions | P3 | Pending | Small | 1B (clone for reorder) |
| 4A | Financials / Analytics | P4 | Pending | Large | — |
| 4B | Print & Export | P4 | Pending | Medium | 2C (invoice print) |
| 5A | Store / Marketplace | P5 | Pending | X-Large | 1C (SKUs) |
| 5B | Wiki / SOPs | P5 | Pending | Medium | — |
| 5C | Settings Page | P5 | Pending | Medium | — |
| 6A | Role-Based Access | P6 | Pending | Medium | 2B (roles) |
| 6B | Farm Selector | P6 | Pending | Small | — |
