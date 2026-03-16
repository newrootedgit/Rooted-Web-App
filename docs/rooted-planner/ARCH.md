# Rooted Planner Architecture

## Status

Partially implemented and actively used.

Implemented modules:

- products
- categories
- blends
- customers
- orders
- tasks
- production views
- farm layout

Still planned:

- recurring orders
- employees
- supplies and inventory
- broader caching/load-reduction work

Frontend entrypoint: `/planner`

## High-Level Design

Rooted Planner is a farm-scoped module inside the shared web app. It uses:

- React + Vite on the frontend
- tRPC + Fastify on the backend
- Prisma + PostgreSQL for relational data
- shared Clerk auth and farm context

## Frontend Surface

### `src/planner/`

- `PlannerPage.tsx`
  - hosts the planner shell and sidebar navigation
- `products/`
  - products, categories, blends
- `customers/`
  - customer list and edit/create flows
- `orders/`
  - order list, create, update, status
- `tasks/`
  - task list, completion, status changes
- `production/`
  - calendar
  - seeding
  - transplant
  - harvest
  - drag-and-drop task rescheduling
- `farm-layout/`
  - canvas-based layout editor

## Backend Surface

Planner routes are registered directly on the root tRPC router:

- `products`
- `customers`
- `orders`
- `tasks`
- `farmLayouts`

Each planner router uses `farmProcedure`, so requests require a valid Clerk session plus `X-Farm-Id`.

### Implemented Router Capabilities

#### Products

- product CRUD and archive
- category CRUD and archive
- blend CRUD and archive

#### Customers

- list
- by ID
- create
- update
- deactivate

#### Orders

- list
- by ID
- create
- update
- update status

#### Tasks

- list
- by ID
- complete
- update status
- update due date

#### Farm Layouts

- list
- by ID
- active
- create
- update
- delete

## Core Data Flow

### Orders -> Tasks

1. User creates or updates an order.
2. Each order item stores production timing fields such as soak, seed, move-to-light, and harvest dates.
3. Task commands generate and maintain workflow tasks tied to `order_items`.
4. Production views query tasks by date range and type.

### Production Scheduling

- Calendar view groups tasks by due date.
- Drag-and-drop rescheduling updates `tasks.due_date`.
- Task completion and status changes flow through tRPC mutations.
- Transplant flows can attach rack assignments to order items.

Related guide:

- [calendar-dnd.md](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/docs/calendar-dnd.md)

## Database Usage

### Active Planner Tables

- `product_categories`
- `products`
- `blends`
- `blend_ingredients`
- `customers`
- `orders`
- `order_items`
- `tasks`
- `farm_layouts`
- `rack_assignments`

### Schema Present but Not Yet Wired Into the UI/API

- `employees`
- `recurring_order_schedules`
- `supplies`
- `supply_categories`
- `supply_purchases`
- `supply_usage`

## Auth and Tenancy

- Clerk authenticates the user.
- API middleware resolves tenant/farm membership from `farm_users`.
- Planner procedures are farm-scoped.
- The frontend must send `X-Farm-Id` for planner requests.

## Performance Notes

- React Query is used, but stale-time tuning is still pending.
- Redis is installed as a dependency and local service, but no application cache layer is currently active.
- Large planner list queries still use direct Prisma calls without the planned caching layer.

## Implementation Boundaries

The current planner implementation is a single-app, single-API surface. There is:

- no separate planner frontend build
- no mobile client
- no recurring-order scheduler in production
- no active supply or employee module
