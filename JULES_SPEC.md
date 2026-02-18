# Rooted Planner Technical Specification

## 1. Introduction
Rooted Planner is a comprehensive Microgreen Farm Management ERP system designed to handle the entire production lifecycle—from customer relationship management and order processing to automated production scheduling and visual farm layout management.

### 1.1 Purpose
This document provides a detailed technical specification for the Rooted Planner platform, serving as the primary reference for technical developers. It covers system architecture, data models, API definitions, business logic, and UI/UX design.

### 1.2 Target Audience
- Backend Developers (Fastify, tRPC, Prisma)
- Frontend Developers (React, TailwindCSS, Canvas API)
- System Architects
- DevOps Engineers

---

## 2. System Architecture

### 2.1 Overview
Rooted Planner is built as a multi-tenant, containerized application within the Rooted Web App monorepo. It leverages a modern TypeScript-first stack to ensure end-to-end type safety.

### 2.2 Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, Shadcn UI, React Router, React Query.
- **Backend**: Fastify, tRPC (v10+), Prisma ORM.
- **Database**: PostgreSQL (with Row-Level Security).
- **Authentication**: Clerk (JWT-based, with `farm_id` in metadata).
- **State Management**: React Query (Server state), Zustand (Local UI state).
- **Deployment**: Docker, Docker Compose, AWS EC2, Cloudflare.

### 2.3 Multi-Tenant Design
Isolation is enforced at multiple levels:
1.  **Identity Level**: Clerk manages users and their association with `farm_id`.
2.  **Application Level**: tRPC context extracts `farm_id` from the validated JWT for every request.
3.  **Database Level**: Row-Level Security (RLS) policies in PostgreSQL ensure that queries automatically filter by `farm_id`, even if a developer forgets to include it in a `WHERE` clause (though the application layer explicitly includes it for clarity and performance).

---

## 3. Data Models (Prisma Schema)

The core data models are defined in `apps/api/prisma/schema.prisma`. All tenant-specific tables include a `farm_id` UUID field.

### 3.1 Core Identity & Settings
- **`farms`**: The primary tenant record. Contains branding, contact info, and global settings.
- **`farm_users`**: Maps Clerk users to specific farms with roles (`OWNER`, `ADMIN`, `FARM_MANAGER`, `FARM_OPERATOR`).

### 3.2 Product Catalog
- **`products`**: Defines microgreen varieties (e.g., Arugula). Key fields: `days_soaking`, `days_germination`, `days_light`, `avg_yield_per_tray`.
- **`product_categories`**: Organizational grouping for products.
- **`blends`**: Composite products (e.g., "Spicy Mix").
- **`blend_ingredients`**: Links `blends` to multiple `products` with specific percentages.

### 3.3 CRM & Orders
- **`customers`**: Stores contact info, `customer_type` (Wholesale, Retail, etc.), and `payment_terms`.
- **`orders`**: High-level order record with `order_number` (e.g., `ORD-000001`) and `status`.
- **`order_items`**: Individual items within an order. Stores the calculated production dates (`soak_date`, `seed_date`, `move_to_light_date`) and `harvest_date`.

### 3.4 Production Workflow
- **`tasks`**: Actionable steps generated from `order_items`. Types: `SOAK`, `SEED`, `MOVE_TO_LIGHT`, `HARVEST`.
- **`rack_assignments`**: Tracks physical placement of trays on grow racks during the `MOVE_TO_LIGHT` phase.

### 3.5 Inventory & Maintenance (Planned)
- **`supplies`**: Tracks seeds, grow media, and packaging.
- **`supply_purchases`**: Records incoming inventory.
- **`supply_usage`**: Links inventory consumption to production `tasks`.

---

## 4. API Reference (tRPC)

The API is structured into domain-driven routers under `apps/api/src/domains/planner-domain/`.

### 4.1 Products Router (`trpc.products`)
- `list`: Get all products (supports search, category filter, active/inactive).
- `getById`: Get detailed product info.
- `create`/`update`: Manage product definitions.
- `archive`: Soft-delete products.
- `categories.list`: Manage categories.
- `blends.list`/`create`/`update`: Manage product blends.

### 4.2 Orders Router (`trpc.orders`)
- `list`: Get orders with pagination and status filtering.
- `getById`: Get full order details including line items and associated tasks.
- `create`: Primary entry point for production planning. Triggers task generation.
- `updateStatus`: Transition order through workflow (Pending → In Progress → Ready → Delivered).

### 4.3 Tasks Router (`trpc.tasks`)
- `list`: Fetch tasks for specific date ranges or types. Used by Calendar and Operations views.
- `updateStatus`: Mark tasks as TODO, IN_PROGRESS, or COMPLETED.
- `complete`: Specific mutation for `HARVEST` and `SEED` tasks to record actual trays and lot numbers.

### 4.4 Customers Router (`trpc.customers`)
- CRUD operations for managing the customer database. Supports filtering by tags and customer type.

---

## 5. Business Logic Deep Dive

### 5.1 Production Scheduling Algorithm
The system uses "Backwards Planning" from the target `harvest_date`.

**Input**: `harvest_date`, `days_light`, `days_germination`, `days_soaking`.

**Formula**:
1.  `move_to_light_date = harvest_date - days_light`
2.  `seed_date = move_to_light_date - days_germination`
3.  `soak_date = seed_date - days_soaking`

For **Blends**, the system identifies the ingredient with the longest total growth cycle and uses its timing to schedule the entire blend, ensuring all components are ready simultaneously.

### 5.2 Yield Calculation
**Formula**: `trays_needed = Ceil((requested_ounces * (1 + overage_percent / 100)) / avg_yield_per_tray)`

### 5.3 Task Generation
When an order is created, 4 tasks are automatically injected into the `tasks` table for every `order_item`:
1.  **SOAK**: Due on `soak_date`.
2.  **SEED**: Due on `seed_date`.
3.  **MOVE_TO_LIGHT**: Due on `move_to_light_date`.
4.  **HARVEST**: Due on `harvest_date`.

---

## 6. UI/UX Specification

### 6.1 Layout & Navigation
The Planner uses a sidebar-driven layout (`AppLayout.tsx`).
- **Dashboard**: Overview of today's tasks and upcoming harvests.
- **Varieties**: Split view for Products and Blends. Includes a Category sidebar.
- **Orders**: Kanban or Table view for tracking order progress.
- **Tasks**: List view with quick-completion toggles.
- **Production**:
    - **Calendar**: Drag-and-drop scheduling (planned).
    - **Seeding View**: Batch-oriented view for today's planting.
    - **Transplant View**: Focus on moving trays to lights.
    - **Harvest View**: Checklist for fulfilling today's orders.
- **Farm Layout**: Interactive 2D Canvas for mapping racks and trays.

### 6.2 Visual Farm Editor
Implemented using the HTML5 Canvas API.
- Users can draw "Elements" (Racks, Sinks, Tables).
- Racks have "Levels" and "Capacity".
- During the `MOVE_TO_LIGHT` task, operators assign `order_items` to specific `rack_element_id` + `level`.

#### 6.2.1 Data Structure (Canvas JSON)
The `canvas_data` is stored as a JSONB blob in PostgreSQL:
```typescript
interface CanvasElement {
  id: string;
  type: 'RACK' | 'TABLE' | 'SINK' | 'WALL';
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  rotation: number;
  color: string;
  properties: {
    levels?: number;
    trayCapacityPerLevel?: number;
    label?: string;
  };
}
```

---

## 7. Implementation Roadmap (Planned Features)

### 7.1 Recurring Orders
- **Logic**: A cron job runs daily at midnight.
- **Function**: Check `recurring_order_schedules`. If `today + lead_time` matches a scheduled day, generate a new `Order` and its corresponding `Tasks`.

### 7.2 Inventory Management
- Automated deduction of seeds (by weight) and trays when a `SEED` task is completed.
- Low-stock alerts via dashboard notifications.

### 7.3 Mobile Operator App
- Progressive Web App (PWA) focus.
- Optimized for "Gloves-on" operation (large buttons, QR code scanning for seed lots).

---

## 8. Technical Setup & Development

### 8.1 Local Development
1.  `pnpm install` at root.
2.  `docker compose -f docker/docker-compose.yml up -d` (Postgres + Redis).
3.  `cd apps/api && pnpm prisma migrate dev`
4.  `pnpm dev` (Frontend) & `cd apps/api && pnpm dev` (Backend).

### 8.2 Testing
- **Unit Tests**: Vitest for business logic (`dateCalc.test.ts`).
- **API Tests**: Integration tests using a mock Prisma client in `apps/api/src/test/`.
- **E2E Tests**: Playwright for critical paths (Order creation → Task completion).

---

**Document Owner**: Jules (AI Architect)
**Last Updated**: 2024
