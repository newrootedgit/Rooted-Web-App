# Planner Feature Parity — Rooted-Planner → Rooted-Web-App

## Overview

This document catalogs every functional gap between the Rooted-Planner (standalone monorepo) and the Rooted-Web-App planner module. The goal is to bring the Rooted-Web-App planner to full feature parity. Each gap is described from the user's perspective — what they can do today in Rooted-Planner but cannot do in Rooted-Web-App — and then translated into the code changes required.

Items are ordered by priority: core production workflow first, then business operations, then nice-to-haves.

**Reference projects:**
- Rooted-Planner: `/Users/VishalVunnam/Desktop/Rooted/Rooted-Planner`
- Rooted-Web-App: `/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App`

---

## Priority 1 — Core Production Workflow Gaps

These gaps directly affect daily farm production operations. A user relying on the Rooted-Web-App planner cannot run their farm day-to-day without these.

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

**What the user can do in Rooted-Web-App:**
- Nothing. The `recurring_order_schedules` table exists in the Prisma schema, but there is no UI, no API router, and no generation logic.

**Code changes required:**

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

**What the user can do in Rooted-Web-App:**
- Nothing. There is no clone button, no clone modal, and no clone API endpoint.

**Code changes required:**

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

**What the user can do in Rooted-Web-App:**
- When creating an order, select a variety and enter raw oz directly (e.g., "48")
- Products have a single optional `sku` text field — it is just a label, not a relational entity
- There are no package types, no SKU management page, no channel/availability concepts

**Code changes required:**

| Layer | Work |
|-------|------|
| **Prisma schema** | Create a `skus` table: `id`, `productId` (FK → products), `code` (unique), `name`, `weightOz`, `price`, `packageTypeId` (FK), `salesChannel` (enum: WHOLESALE, RETAIL, BOTH), `isAvailable`, `isPublic`, `stockQuantity`, `lowStockThreshold`. Create a `package_types` table: `id`, `name`, `farmId`. |
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

**What the user can do in Rooted-Web-App:**
- When completing a task, fill out a simpler form:
  - Actual Trays (optional)
  - Seed Lot (free text, optional)
  - Notes (optional)
- No employee selector, no actual yield field, no date/time picker, no rack assignment
- Rack assignment modal exists but is a non-functional placeholder ("Phase 5")
- No Logs tab to review past completions
- Batch completion only exists in the Seeding view (not other views)

**Code changes required:**

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

**What the user can do in Rooted-Web-App:**
- Blends can be selected in orders, but the form shows only the aggregate values (total oz, total trays, single set of dates)
- No per-ingredient breakdown is visible during order creation

**Code changes required:**

| Layer | Work |
|-------|------|
| **Shared utility** | Port the `calculateBlendProductionSchedule()` function from Rooted-Planner's `packages/shared/src/utils/production-calculator.ts`. This function takes a blend's ingredients, their ratios, and the harvest date, and returns per-ingredient schedules (oz, trays, soak/seed/light dates). |
| **Frontend — OrderForm** | In `OrderForm.tsx`, detect when the selected product is a blend. Query the blend's ingredients. Call the blend calculator with the entered harvest date and quantity. Render an ingredient breakdown section below the item showing each ingredient's name, ratio, oz, trays, and individual production dates. Update live as the user changes quantity or harvest date. |
| **Backend — order creation** | When an order item references a blend, generate tasks per ingredient (not just per blend). Each ingredient may have different soak/seed/light dates based on its own product's growth parameters. Store `blendIngredientId` on the task or order item sub-records. |

---

## Priority 2 — Business Operations

These features support running the business side of the farm. Users can operate without them short-term, but they are required for a complete production-to-delivery workflow.

---

### 2A. Supplies & Inventory Management

**What the user can do in Rooted-Planner:**
- Navigate to Supplies & Inventory with four tabs: Stock, Purchases, Usage, Categories
- **Stock tab**: view supplies grouped by category, see stock quantity with status indicators (In Stock / Out of Stock / Negative), expand groups to see individual suppliers, edit supply details, record usage directly
- **Purchases tab**: log new purchases with date, supplier, multi-item selection, per-item quantity and unit cost, running total; view purchase history
- **Usage tab**: record supply usage with quantity, purpose (General Use, Restocking, Waste), and optional link to a task/order; view usage log
- **Categories tab**: create and manage supply categories
- Supply form includes: name, category, unit, supplier, quantity on hand, reorder point, cost per unit, shelf location, notes, product link (for seeds)

**What the user can do in Rooted-Web-App:**
- Nothing. The `supplies`, `supply_categories`, `supply_purchases`, and `supply_usage` tables may exist in the schema but there is no UI or API.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Prisma schema** | Create tables: `supply_categories` (id, name, farmId), `supplies` (id, name, categoryId, unit, supplierId, quantityOnHand, reorderPoint, costPerUnit, shelfLocation, notes, productId, farmId), `supply_purchases` (id, supplyId, date, quantity, unitCost, notes, farmId), `supply_usage` (id, supplyId, date, quantity, purpose, notes, taskId, orderId, farmId). |
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

**What the user can do in Rooted-Web-App:**
- Nothing in the planner UI. The `employees` table exists in the schema. Employee data is needed for the task completion "Completed By" dropdown.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Backend** | Create `apps/api/src/domains/planner-domain/employees/router.ts` with: `list` (search, position filter, status filter), `byId`, `create`, `update`, `delete`, `sendInvite`, `resendInvite`. Integrate with Clerk for invitation flows. |
| **Frontend** | Create `src/planner/employees/` with: `EmployeesPage.tsx` (list + search + filters), `EmployeeForm.tsx` (modal), `EmployeeCard.tsx` (position badge, status badge, invite status). |
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

**What the user can do in Rooted-Web-App:**
- Nothing. No invoicing tables, API, or UI.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Prisma schema** | Create: `invoices` (id, invoiceNumber, customerId, farmId, status, issueDate, dueDate, subtotal, taxRate, taxAmount, total, internalNotes, customerNotes, paymentTerms), `invoice_items` (id, invoiceId, description, quantity, unitPrice, amount, orderId, orderItemId), `invoice_payments` (id, invoiceId, method, amount, date, reference, notes). |
| **Backend** | Create invoices router with: `list` (search + status filter), `byId`, `create`, `update`, `updateStatus`, `delete`, `recordPayment`, `deletePayment`. Auto-generate invoice numbers (INV-YYYY-NNN). |
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

**What the user can do in Rooted-Web-App:**
- Nothing. No delivery tables, API, or UI.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Prisma schema** | Create: `delivery_routes` (id, name, driverId, farmId, date, status), `delivery_stops` (id, routeId, orderId, sequence, status, notes, deliveredAt). |
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

**What the user can do in Rooted-Web-App:**
- Nothing.

**Code changes required:**

| Layer | Work |
|-------|------|
| **Prisma schema** | Create: `csa_programs` (id, name, farmId, status, startDate, endDate, description), `csa_share_types` (id, programId, name, weeklyAllocationOz, pricePerWeek, maxMembers), `csa_members` (id, programId, customerId, shareTypeId, status, paymentStatus, deliveryPreference, startWeek, autoRenew), `csa_weeks` (id, programId, weekNumber, startDate, endDate, status), `csa_allocations` (id, weekId, shareTypeId, productId, quantityOz), `csa_pickup_locations` (id, farmId, name, address, dayOfWeek, time, capacity), `csa_payments` (id, memberId, method, amount, date, reference). |
| **Backend** | Create CSA domain router with sub-routers for programs, share types, members, weeks, allocations, pickup locations, and a `generateOrders` procedure that creates one order per active member for a finalized week. |
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

| # | Feature | Priority | Effort | Depends On |
|---|---------|----------|--------|------------|
| 1A | Recurring Order Schedules | P1 | Large | — |
| 1B | Order Cloning | P1 | Small | — |
| 1C | SKU / Packaging System | P1 | Large | — |
| 1D | Task Completion — Full Logging | P1 | Medium | 2B (employees) |
| 1E | Blend Ingredient Breakdown | P1 | Medium | — |
| 2A | Supplies & Inventory | P2 | Large | — |
| 2B | Employee / Team Management | P2 | Medium | — |
| 2C | Invoicing System | P2 | Large | 1C (SKUs for line items) |
| 2D | Delivery Routes | P2 | Medium | 2B (drivers) |
| 2E | CSA / Subscription Programs | P2 | X-Large | — |
| 3A | Dashboard & Priority Panel | P3 | Medium | — |
| 3B | All Tasks View & Logs Tab | P3 | Medium | 1D (full completion data) |
| 3C | Rack Assignment — Functional | P3 | Medium | Farm Layout (exists) |
| 3D | Customer Detail — Stats & Actions | P3 | Small | 1B (clone for reorder) |
| 4A | Financials / Analytics | P4 | Large | — |
| 4B | Print & Export | P4 | Medium | 2C (invoice print) |
| 5A | Store / Marketplace | P5 | X-Large | 1C (SKUs) |
| 5B | Wiki / SOPs | P5 | Medium | — |
| 5C | Settings Page | P5 | Medium | — |
| 6A | Role-Based Access | P6 | Medium | 2B (roles) |
| 6B | Farm Selector | P6 | Small | — |
