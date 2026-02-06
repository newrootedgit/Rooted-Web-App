# Rooted Planner Implementation Roadmap

**Document Version:** 1.0  
**Last Updated:** February 5, 2026  
**Status:** Planning Phase

## Executive Summary

This document provides a comprehensive implementation plan for the Rooted Planner platform - a microgreen farm management ERP system. The planner will be built within the existing Rooted Web App infrastructure, leveraging the established multi-tenant architecture, authentication system (Clerk), and backend framework (Fastify + tRPC + PostgreSQL).

**Current State:**
- ✅ Database schema fully defined (all tables created)
- ✅ Multi-tenant infrastructure operational
- ✅ Authentication and authorization framework ready
- ✅ tRPC + React Query architecture proven (Machine IoT)
- ✅ Shared UI component library available (Shadcn)
- 🚧 Backend domain logic: Empty structure created, no implementation
- 🚧 Frontend: Placeholder page only

**Target State:**
- Full-featured microgreen farm management system
- Complete production workflow automation (order → tasks → harvest)
- Visual farm layout editor with rack management
- Customer relationship management
- Inventory and supply tracking
- Production analytics and reporting

---

## Table of Contents

1. [Current Codebase Analysis](#current-codebase-analysis)
2. [Architecture Standards](#architecture-standards)
3. [Implementation Phases](#implementation-phases)
4. [Technical Specifications](#technical-specifications)
5. [Development Workflow](#development-workflow)
6. [Testing Strategy](#testing-strategy)
7. [Deployment Plan](#deployment-plan)
8. [Risk Assessment](#risk-assessment)

---

## Current Codebase Analysis

### Infrastructure Assessment

#### ✅ **Fully Operational Components**

**1. Multi-Tenant Architecture**
- PostgreSQL with Row-Level Security (RLS) policies
- Farm-based data isolation via `farm_id` column
- Tenant-farm hierarchy established
- JWT-based context extraction from Clerk tokens

**2. Authentication & Authorization**
- Clerk integration for user management
- JWT validation middleware (`apps/api/src/lib/auth/middleware.ts`)
- Role-based access control (OWNER, ADMIN, FARM_MANAGER, FARM_OPERATOR)
- Protected route components on frontend

**3. Backend Framework**
- Fastify server with tRPC integration
- Type-safe API procedures with Zod validation
- Prisma ORM with generated client
- Error handling and logging infrastructure
- Request context with farm isolation

**4. Frontend Foundation**
- React 18 + TypeScript + Vite
- TailwindCSS + Shadcn UI component library
- React Router with protected routes
- tRPC client with React Query integration
- Shared UI components (AppLayout, AppHeader, Sidebar)

**5. Database Schema**
- All planner tables created and migrated
- Proper indexing on foreign keys and query columns
- Relationships defined with cascade rules
- JSON fields for flexible data (address, settings, canvas_data)

#### 🚧 **Partially Implemented Components**

**1. Planner Domain Backend**
```
apps/api/src/domains/planner-domain/
├── products/
│   ├── router.ts          # Empty file
│   ├── types.ts           # Empty file
│   ├── commands/          # Empty directory
│   └── queries/           # Empty directory
├── tasks/                 # Empty directory
└── orders/                # Empty directory
```

**Status:** Directory structure created but no implementation. All files are empty placeholders.

**2. Planner Frontend**
```
src/planner/
├── PlannerPage.tsx        # Shows "Coming Soon" message
└── index.ts               # Basic export
```

**Status:** Minimal placeholder. No feature components, hooks, or business logic.

#### ❌ **Not Implemented**

1. **All Business Logic**
   - No tRPC procedures defined
   - No database queries or mutations
   - No validation schemas
   - No business rule enforcement

2. **All UI Features**
   - No product management interface
   - No order creation/management
   - No task views (calendar, seeding, harvest)
   - No farm layout editor
   - No customer management
   - No inventory tracking

3. **Integrations**
   - No recurring order automation (cron jobs)
   - No email notifications
   - No reporting/analytics

### Code Standards & Patterns

Based on the existing Machine IoT implementation, the codebase follows these established patterns:

#### **1. Feature-Based Module Organization**

```typescript
// Backend domain structure
apps/api/src/domains/{domain-name}/
├── router.ts              # tRPC router with all procedures
├── types.ts               # Zod schemas and TypeScript types
├── commands/              # Write operations (create, update, delete)
│   ├── createEntity.ts
│   ├── updateEntity.ts
│   └── __tests__/
└── queries/               # Read operations (list, get, find)
    ├── listEntities.ts
    ├── getEntityById.ts
    └── __tests__/

// Frontend feature structure
src/{platform}/{feature}/
├── components/            # React components
├── hooks/                 # Custom hooks for business logic
├── utils/                 # Feature-specific utilities
└── types.ts              # Frontend-specific types
```

#### **2. tRPC Procedure Patterns**

```typescript
// Query procedures (read operations)
export const productRouter = router({
  list: farmProcedure
    .input(z.object({
      page: z.number().default(1),
      pageSize: z.number().default(20),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Implementation
    }),
    
  byId: farmProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      // Implementation
    }),
});

// Mutation procedures (write operations)
export const productRouter = router({
  create: farmProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      // Implementation
    }),
    
  update: farmProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      // Implementation
    }),
});
```

#### **3. Type Safety with Zod**

```typescript
// Define Zod schema as single source of truth
export const productSchema = z.object({
  id: z.string().uuid(),
  farmId: z.string().uuid(),
  name: z.string().min(1).max(255),
  daysSoaking: z.number().int().min(0),
  daysGermination: z.number().int().min(0),
  daysLight: z.number().int().min(0),
  avgYieldPerTray: z.number().positive().optional(),
  isActive: z.boolean().default(true),
});

// Derive TypeScript types
export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
```

#### **4. React Query Integration**

```typescript
// Frontend usage - automatic type inference
const { data: products, isLoading } = trpc.products.list.useQuery({
  page: 1,
  pageSize: 20,
});

const createProduct = trpc.products.create.useMutation({
  onSuccess: () => {
    utils.products.list.invalidate();
    toast.success('Product created');
  },
});
```

#### **5. Error Handling**

```typescript
// Custom error classes
export class BusinessError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

// Usage in procedures
if (!product) {
  throw new NotFoundError('Product', productId);
}

if (existingProduct) {
  throw new BusinessError(
    'Product name already exists',
    'DUPLICATE_PRODUCT_NAME'
  );
}
```

#### **6. Database Query Patterns**

```typescript
// Separate complex queries into dedicated files
export const listProducts = async (
  prisma: PrismaClient,
  farmId: string,
  filters: ProductFilters
) => {
  return prisma.product.findMany({
    where: {
      farmId,
      isActive: filters.activeOnly ? true : undefined,
      name: filters.search ? {
        contains: filters.search,
        mode: 'insensitive',
      } : undefined,
    },
    include: {
      category: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
};
```

#### **7. Component Structure**

```typescript
interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({ props }) => {
  // 1. Hooks (tRPC queries, mutations, React hooks)
  const { data } = trpc.entity.list.useQuery();
  const mutation = trpc.entity.create.useMutation();
  
  // 2. Local state
  const [state, setState] = useState();
  
  // 3. Event handlers
  const handleAction = () => {
    // Implementation
  };
  
  // 4. Early returns
  if (!data) return <LoadingSpinner />;
  
  // 5. Render
  return <div>{/* JSX */}</div>;
};
```

### Technology Stack Summary

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Shadcn UI (component library)
- tRPC Client + React Query (data fetching)
- React Router (routing)
- Zod (validation)

**Backend:**
- Fastify (HTTP server)
- tRPC (type-safe API)
- Prisma ORM (database)
- PostgreSQL (database)
- Clerk (authentication)
- Zod (validation)

**Infrastructure:**
- Docker + Docker Compose
- PostgreSQL with RLS
- Redis (planned for caching)
- AWS EC2 (deployment target)
- Cloudflare (CDN, SSL)

---

## Architecture Standards

### Multi-Tenant Data Isolation

**Every planner table includes `farm_id` for tenant isolation:**

```sql
-- Example: products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  -- other columns
);

-- Row-Level Security policy
CREATE POLICY farm_isolation ON products
  USING (farm_id = current_setting('app.current_farm_id')::uuid);
```

**Backend enforcement:**
```typescript
// Farm context automatically injected by middleware
export const farmProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.farmId) {
    throw new UnauthorizedError('Farm context required');
  }
  return next({ ctx: { ...ctx, farmId: ctx.farmId } });
});

// All queries automatically scoped to farm
const products = await ctx.prisma.product.findMany({
  where: { farmId: ctx.farmId }, // Always included
});
```

### Type Safety Flow

```
Zod Schema (types.ts)
    ↓
tRPC Procedure Definition (router.ts)
    ↓
Automatic TypeScript Inference
    ↓
Frontend tRPC Client (React components)
    ↓
Type-safe API calls with autocomplete
```

**No code generation needed** - types flow automatically through tRPC.

### State Management Strategy

**Server State (via tRPC + React Query):**
- All database-backed data
- Automatic caching and invalidation
- Optimistic updates for mutations
- Background refetching

**Local State (via React hooks):**
- UI state (modals, tabs, form inputs)
- Temporary selections
- Canvas editor state (farm layout)

**No global state management library needed** (no Redux, Zustand for planner data).

### API Design Principles

1. **Clean URLs:** `/api/trpc/products.list` (farm context from JWT)
2. **Consistent naming:** Queries use nouns, mutations use verbs
3. **Pagination:** All list endpoints support pagination
4. **Filtering:** Optional filter parameters for queries
5. **Validation:** Zod schemas validate all inputs
6. **Error handling:** Consistent error responses with codes

### Database Design Principles

1. **Normalization:** Proper relational design, avoid duplication
2. **Indexing:** All foreign keys and frequently queried columns
3. **Cascade rules:** Proper ON DELETE CASCADE for dependent data
4. **JSON fields:** For flexible/nested data (address, settings, canvas_data)
5. **Timestamps:** created_at, updated_at on all entities
6. **Soft deletes:** is_active flags instead of hard deletes where appropriate

---

## Implementation Phases

The implementation is divided into 6 phases, each building on the previous phase. Each phase delivers a functional subset of features that can be tested and validated before moving forward.

### Phase 0: Foundation Setup (Week 1)

**Goal:** Establish development infrastructure and shared utilities.

**Deliverables:**
- [ ] Development environment documentation
- [ ] Shared type definitions for planner domain
- [ ] Base tRPC router structure
- [ ] Frontend routing and navigation
- [ ] Development database seeded with test data

**Tasks:**

1. **Backend Foundation**
   - Create base router structure in `apps/api/src/lib/trpc/router.ts`
   - Set up planner domain router exports
   - Create shared utility functions for date calculations
   - Set up test utilities and mocks

2. **Frontend Foundation**
   - Update `src/planner/PlannerPage.tsx` with proper layout
   - Create navigation structure (sidebar items)
   - Set up routing for planner sub-pages
   - Create shared planner components (page layouts, headers)

3. **Development Tools**
   - Create database seed script with sample data
   - Document local development setup
   - Set up testing framework for planner domain
   - Create development utilities (date helpers, formatters)

**Acceptance Criteria:**
- Planner page loads with proper navigation
- tRPC router structure in place
- Database can be seeded with test data
- Development documentation complete

---

### Phase 1: Product Management (Weeks 2-3)

**Goal:** Implement complete product catalog management including microgreen varieties, categories, and blends.

**Database Tables:**
- `products`
- `product_categories`
- `blends`
- `blend_ingredients`

**Features:**

#### 1.1 Product Categories
- List all categories for a farm
- Create new category
- Update category details
- Archive category (soft delete)

#### 1.2 Microgreen Products
- List products with filtering (category, active status, search)
- View product details
- Create new product with growing parameters
- Update product information
- Archive product (prevent deletion if used in orders)
- Calculate total growing days (soak + germination + light)

#### 1.3 Product Blends
- List blends
- Create blend with multiple ingredients
- Validate ingredient percentages total 100%
- Calculate blend timing from longest-growing ingredient
- Update blend composition
- Archive blend

**Backend Implementation:**

```
apps/api/src/domains/planner-domain/products/
├── router.ts
├── types.ts
├── commands/
│   ├── createProduct.ts
│   ├── updateProduct.ts
│   ├── archiveProduct.ts
│   ├── createCategory.ts
│   ├── createBlend.ts
│   ├── updateBlend.ts
│   └── __tests__/
└── queries/
    ├── listProducts.ts
    ├── getProductById.ts
    ├── listCategories.ts
    ├── listBlends.ts
    ├── getBlendById.ts
    └── __tests__/
```

**Frontend Implementation:**

```
src/planner/products/
├── ProductsPage.tsx
├── components/
│   ├── ProductList.tsx
│   ├── ProductCard.tsx
│   ├── ProductForm.tsx
│   ├── ProductDetails.tsx
│   ├── CategoryManager.tsx
│   ├── BlendList.tsx
│   ├── BlendForm.tsx
│   └── BlendIngredientSelector.tsx
├── hooks/
│   ├── useProducts.ts
│   ├── useProductMutations.ts
│   ├── useBlends.ts
│   └── useCategories.ts
└── utils/
    └── productCalculations.ts
```

**Key Business Rules:**
- Product names must be unique within a farm
- Cannot delete products used in orders (archive only)
- Blend ingredients must total exactly 100%
- All growing day values must be non-negative integers
- Yield per tray must be positive if provided

**Testing:**
- Unit tests for all commands and queries
- Integration tests for tRPC procedures
- Frontend component tests
- E2E test for complete product creation flow

**Acceptance Criteria:**
- ✅ Can create, view, update, and archive products
- ✅ Can organize products into categories
- ✅ Can create blends with percentage-based ingredients
- ✅ Blend timing calculated correctly
- ✅ Validation prevents invalid data
- ✅ UI is responsive and user-friendly

---

### Phase 2: Customer Management (Week 4)

**Goal:** Implement customer relationship management for tracking wholesale, retail, and restaurant customers.

**Database Tables:**
- `customers`

**Features:**

#### 2.1 Customer CRUD
- List customers with filtering (type, status, tags, search)
- View customer details and order history
- Create new customer with contact information
- Update customer information
- Deactivate customer (soft delete)
- Prevent deletion if customer has orders

#### 2.2 Customer Organization
- Customer types (Retail, Wholesale, Restaurant, Farmers Market, Distributor)
- Payment terms (Due on Receipt, Net 7/15/30/60)
- Custom tags for categorization
- Address management (JSON field)
- Notes and status tracking

**Backend Implementation:**

```
apps/api/src/domains/planner-domain/customers/
├── router.ts
├── types.ts
├── commands/
│   ├── createCustomer.ts
│   ├── updateCustomer.ts
│   ├── deactivateCustomer.ts
│   └── __tests__/
└── queries/
    ├── listCustomers.ts
    ├── getCustomerById.ts
    ├── getCustomerOrders.ts
    └── __tests__/
```

**Frontend Implementation:**

```
src/planner/customers/
├── CustomersPage.tsx
├── components/
│   ├── CustomerList.tsx
│   ├── CustomerCard.tsx
│   ├── CustomerForm.tsx
│   ├── CustomerDetails.tsx
│   ├── CustomerFilters.tsx
│   └── CustomerOrderHistory.tsx
├── hooks/
│   ├── useCustomers.ts
│   └── useCustomerMutations.ts
└── types.ts
```

**Key Business Rules:**
- Customer names required
- Email validation if provided
- Cannot delete customers with existing orders
- Tags stored as array for flexible categorization
- Address stored as JSON for flexibility

**Acceptance Criteria:**
- ✅ Can create, view, update, and deactivate customers
- ✅ Can filter and search customers
- ✅ Can view customer order history
- ✅ Validation prevents invalid data
- ✅ Cannot delete customers with orders

---

### Phase 3: Order Management & Task Generation (Weeks 5-7)

**Goal:** Implement order creation with automatic task generation and production scheduling.

**Database Tables:**
- `orders`
- `order_items`
- `tasks`

**Features:**

#### 3.1 Order Creation
- Create order with customer selection
- Add multiple order items (products or blends)
- Specify quantity in ounces and target harvest date
- Set overage percentage (default 10%)
- Calculate trays needed based on product yield
- Auto-calculate soak, seed, and move-to-light dates
- Generate unique order numbers

#### 3.2 Order Management
- List orders with filtering (status, customer, date range)
- View order details with all items
- Update order status (Pending → In Progress → Ready → Delivered → Cancelled)
- Edit orders in Pending status only
- Prevent changes to orders with completed tasks
- Standalone orders (without customer)

#### 3.3 Task Generation
- Auto-generate 4 tasks per order item:
  - SOAK task (soak seeds before planting)
  - SEED task (plant seeds in trays)
  - MOVE_TO_LIGHT task (transfer to grow racks)
  - HARVEST task (harvest ready microgreens)
- Calculate due dates working backwards from harvest date
- Link tasks to order items
- Set initial task status to TODO

#### 3.4 Task Management
- List tasks with filtering (type, status, date range)
- View task details
- Update task status (TODO → IN_PROGRESS → COMPLETED)
- Record task completion with:
  - Completion timestamp
  - Completed by (user)
  - Actual trays processed
  - Seed lot number
  - Completion notes
- Flag overdue tasks
- Modify task due dates

**Backend Implementation:**

```
apps/api/src/domains/planner-domain/orders/
├── router.ts
├── types.ts
├── commands/
│   ├── createOrder.ts
│   ├── updateOrder.ts
│   ├── updateOrderStatus.ts
│   ├── generateTasks.ts
│   └── __tests__/
└── queries/
    ├── listOrders.ts
    ├── getOrderById.ts
    ├── getOrderItems.ts
    └── __tests__/

apps/api/src/domains/planner-domain/tasks/
├── router.ts
├── types.ts
├── commands/
│   ├── completeTask.ts
│   ├── updateTaskStatus.ts
│   ├── updateTaskDueDate.ts
│   └── __tests__/
└── queries/
    ├── listTasks.ts
    ├── getTaskById.ts
    ├── getTasksByOrderItem.ts
    ├── getOverdueTasks.ts
    └── __tests__/
```

**Frontend Implementation:**

```
src/planner/orders/
├── OrdersPage.tsx
├── components/
│   ├── OrderList.tsx
│   ├── OrderCard.tsx
│   ├── OrderForm.tsx
│   ├── OrderDetails.tsx
│   ├── OrderItemForm.tsx
│   ├── OrderStatusBadge.tsx
│   └── OrderTimeline.tsx
├── hooks/
│   ├── useOrders.ts
│   ├── useOrderMutations.ts
│   └── useOrderCalculations.ts
└── utils/
    ├── orderCalculations.ts
    └── taskGeneration.ts

src/planner/tasks/
├── TasksPage.tsx
├── components/
│   ├── TaskList.tsx
│   ├── TaskCard.tsx
│   ├── TaskDetails.tsx
│   ├── TaskCompletionForm.tsx
│   ├── TaskStatusBadge.tsx
│   └── TaskFilters.tsx
├── hooks/
│   ├── useTasks.ts
│   └── useTaskMutations.ts
└── types.ts
```

**Key Business Rules:**
- Order numbers must be unique
- Cannot modify orders with completed tasks
- Task due dates calculated from harvest date and product timing
- Trays needed = (quantity_oz * (1 + overage_percent/100)) / avg_yield_per_tray
- For blends, use longest-growing ingredient timing
- Task completion requires actual trays and completion timestamp
- Cannot delete orders with tasks in progress

**Date Calculation Logic:**
```typescript
// Working backwards from harvest date
harvest_date = target_harvest_date
move_to_light_date = harvest_date - product.days_light
seed_date = move_to_light_date - product.days_germination
soak_date = seed_date - product.days_soaking
```

**Testing:**
- Unit tests for date calculations
- Unit tests for tray calculations
- Integration tests for order creation with task generation
- Test edge cases (blends, zero overage, missing yield data)
- E2E test for complete order-to-task workflow

**Acceptance Criteria:**
- ✅ Can create orders with multiple items
- ✅ Tasks automatically generated with correct dates
- ✅ Trays calculated correctly based on yield
- ✅ Can update order status through workflow
- ✅ Can complete tasks with all required information
- ✅ Cannot modify orders inappropriately
- ✅ Overdue tasks flagged correctly

---

### Phase 4: Production Views & Calendar (Weeks 8-9)

**Goal:** Implement specialized views for production workflow management.

**Features:**

#### 4.1 Calendar View
- Timeline view of all tasks
- Color-coded by task type
- Filter by task type, status, date range
- Click task to view details
- Drag-and-drop to reschedule (optional)
- Month, week, day views

#### 4.2 Seeding View
- Focus on SOAK and SEED tasks
- Group by due date
- Show product, quantity, trays needed
- Batch completion for multiple tasks
- Print seeding schedule

#### 4.3 Transplant View
- Focus on MOVE_TO_LIGHT tasks
- Show tasks ready to move to grow racks
- Rack assignment interface
- Track where products are growing

#### 4.4 Harvest View
- Focus on HARVEST tasks
- Show ready-to-harvest items
- Record actual yields
- Mark orders as ready for delivery
- Print harvest schedule

**Frontend Implementation:**

```
src/planner/production/
├── ProductionPage.tsx
├── calendar/
│   ├── CalendarView.tsx
│   ├── CalendarGrid.tsx
│   ├── TaskEvent.tsx
│   └── CalendarControls.tsx
├── seeding/
│   ├── SeedingView.tsx
│   ├── SeedingSchedule.tsx
│   ├── SeedingTaskCard.tsx
│   └── BatchCompletionForm.tsx
├── transplant/
│   ├── TransplantView.tsx
│   ├── TransplantSchedule.tsx
│   └── RackAssignmentModal.tsx
├── harvest/
│   ├── HarvestView.tsx
│   ├── HarvestSchedule.tsx
│   ├── HarvestTaskCard.tsx
│   └── YieldRecordingForm.tsx
├── hooks/
│   ├── useCalendarTasks.ts
│   ├── useSeedingTasks.ts
│   ├── useTransplantTasks.ts
│   └── useHarvestTasks.ts
└── components/
    ├── TaskTypeFilter.tsx
    ├── DateRangeFilter.tsx
    └── ProductionMetrics.tsx
```

**Backend Enhancements:**

```
apps/api/src/domains/planner-domain/tasks/
└── queries/
    ├── getTasksByDateRange.ts
    ├── getTasksByType.ts
    ├── getSeedingSchedule.ts
    ├── getTransplantSchedule.ts
    └── getHarvestSchedule.ts
```

**Key Features:**
- Efficient queries for date-range filtering
- Grouping and sorting by due date
- Batch operations for task completion
- Print-friendly views
- Real-time updates via React Query

**Acceptance Criteria:**
- ✅ Calendar view displays all tasks correctly
- ✅ Can filter tasks by type and date
- ✅ Seeding view shows upcoming planting tasks
- ✅ Transplant view enables rack assignment
- ✅ Harvest view tracks actual yields
- ✅ Views update in real-time
- ✅ Print-friendly layouts work

---

### Phase 5: Farm Layout & Rack Management (Weeks 10-11)

**Goal:** Implement visual farm layout editor with rack management and space tracking.

**Database Tables:**
- `farm_layouts`
- `rack_assignments`

**Features:**

#### 5.1 Farm Layout Editor
- Canvas-based visual editor
- Draw farm elements:
  - Walls and boundaries
  - Tables and work surfaces
  - Sinks and utilities
  - Walkways
  - Grow racks with configurable levels
- Drag-and-drop positioning
- Resize and rotate elements
- Color customization
- Save/load layouts
- Multiple layouts per farm

#### 5.2 Rack Management
- Define racks with multiple levels
- Set tray capacity per level
- Assign order items to rack levels during MOVE_TO_LIGHT
- Replace Phase 4 rack assignment placeholder in Transplant view with persistent rack assignments
- Track rack occupancy
- Visual indicators of space utilization
- Auto-clear assignments on harvest completion

#### 5.3 Space Tracking
- Show what's growing on each rack
- Display occupancy percentage
- Highlight available space
- Search for specific products/orders
- View rack history

**Backend Implementation:**

```
apps/api/src/domains/planner-domain/farm-layout/
├── router.ts
├── types.ts
├── commands/
│   ├── createLayout.ts
│   ├── updateLayout.ts
│   ├── deleteLayout.ts
│   ├── assignToRack.ts
│   ├── removeFromRack.ts
│   └── __tests__/
└── queries/
    ├── listLayouts.ts
    ├── getLayoutById.ts
    ├── getActiveLayout.ts
    ├── getRackAssignments.ts
    ├── getRackOccupancy.ts
    └── __tests__/
```

**Frontend Implementation:**

```
src/planner/farm-layout/
├── FarmLayoutPage.tsx
├── editor/
│   ├── CanvasEditor.tsx
│   ├── ToolPalette.tsx
│   ├── ElementProperties.tsx
│   ├── LayerManager.tsx
│   └── GridOverlay.tsx
├── racks/
│   ├── RackManager.tsx
│   ├── RackView.tsx
│   ├── RackLevel.tsx
│   ├── RackAssignmentForm.tsx
│   └── RackOccupancy.tsx
├── components/
│   ├── CanvasElement.tsx
│   ├── RackElement.tsx
│   ├── WallElement.tsx
│   └── TableElement.tsx
├── hooks/
│   ├── useCanvasEditor.ts
│   ├── useRackManagement.ts
│   └── useLayoutPersistence.ts
└── utils/
    ├── canvasHelpers.ts
    └── rackCalculations.ts
```

**Canvas Data Structure:**
```typescript
interface FarmLayout {
  id: string;
  farmId: string;
  name: string;
  canvasData: {
    dimensions: { width: number; height: number };
    elements: CanvasElement[];
  };
  isActive: boolean;
}

interface CanvasElement {
  id: string;
  type: 'rack' | 'wall' | 'table' | 'sink' | 'walkway';
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  rotation: number;
  color: string;
  properties: Record<string, any>; // Type-specific properties
}

interface RackElement extends CanvasElement {
  type: 'rack';
  properties: {
    levels: number;
    traysPerLevel: number;
    label: string;
  };
}
```

**Key Business Rules:**
- Canvas data stored as JSON in database
- Rendering happens entirely on frontend
- Rack assignments linked to order items
- Assignments cleared when harvest task completed
- Cannot over-assign racks (capacity validation)
- Multiple layouts allowed, one active at a time

**Testing:**
- Unit tests for canvas calculations
- Unit tests for rack assignment logic
- Integration tests for layout persistence
- E2E test for complete layout creation and rack assignment

**Acceptance Criteria:**
- ✅ Can create and edit farm layouts visually
- ✅ Can add racks with configurable levels
- ✅ Can assign order items to rack levels
- ✅ Rack occupancy tracked correctly
- ✅ Assignments cleared on harvest
- ✅ Canvas state persists correctly
- ✅ UI is intuitive and responsive

---

### Phase 6: Inventory, Employees & Settings (Weeks 12-13)

**Goal:** Complete remaining features for full ERP functionality.

**Database Tables:**
- `employees`
- `supplies`
- `supply_categories`
- `supply_purchases`
- `supply_usage`

**Features:**

#### 6.1 Employee Management
- List employees with filtering
- Create employee records
- Update employee information
- Track positions and roles
- Employment status (Active, On Leave, Terminated)
- Link to user accounts
- Assign tasks to employees
- Track task completion by employee

#### 6.2 Supply Management
- Organize supplies into categories
- Track current stock levels
- Record purchases with lot numbers
- Log usage (linked to tasks)
- Low stock alerts
- Cost tracking
- Expiry date management

#### 6.3 Farm Settings
- Farm information (name, logo, contact)
- Branding (colors, logo)
- Unit preferences (weight, length)
- Default values (overage %, lead times)
- Timezone configuration
- Notification preferences

#### 6.4 Reporting & Analytics
- Production metrics dashboard
- Task completion rates
- Actual vs. planned yields
- Product performance
- Customer order history
- Supply usage reports
- Employee productivity

**Backend Implementation:**

```
apps/api/src/domains/planner-domain/employees/
├── router.ts
├── types.ts
├── commands/
│   ├── createEmployee.ts
│   ├── updateEmployee.ts
│   └── __tests__/
└── queries/
    ├── listEmployees.ts
    ├── getEmployeeById.ts
    └── __tests__/

apps/api/src/domains/planner-domain/supplies/
├── router.ts
├── types.ts
├── commands/
│   ├── createSupply.ts
│   ├── recordPurchase.ts
│   ├── recordUsage.ts
│   └── __tests__/
└── queries/
    ├── listSupplies.ts
    ├── getSupplyById.ts
    ├── getLowStockSupplies.ts
    └── __tests__/

apps/api/src/domains/planner-domain/settings/
├── router.ts
├── types.ts
├── commands/
│   ├── updateFarmSettings.ts
│   └── __tests__/
└── queries/
    ├── getFarmSettings.ts
    └── __tests__/

apps/api/src/domains/planner-domain/analytics/
├── router.ts
├── types.ts
└── queries/
    ├── getProductionMetrics.ts
    ├── getTaskCompletionRates.ts
    ├── getYieldAnalysis.ts
    └── __tests__/
```

**Frontend Implementation:**

```
src/planner/employees/
├── EmployeesPage.tsx
├── components/
│   ├── EmployeeList.tsx
│   ├── EmployeeForm.tsx
│   └── EmployeeDetails.tsx
└── hooks/
    └── useEmployees.ts

src/planner/supplies/
├── SuppliesPage.tsx
├── components/
│   ├── SupplyList.tsx
│   ├── SupplyForm.tsx
│   ├── PurchaseForm.tsx
│   ├── UsageForm.tsx
│   └── LowStockAlert.tsx
└── hooks/
    └── useSupplies.ts

src/planner/settings/
├── SettingsPage.tsx
├── components/
│   ├── FarmInfoSettings.tsx
│   ├── BrandingSettings.tsx
│   ├── UnitPreferences.tsx
│   └── DefaultValues.tsx
└── hooks/
    └── useSettings.ts

src/planner/analytics/
├── AnalyticsPage.tsx
├── components/
│   ├── ProductionDashboard.tsx
│   ├── TaskMetrics.tsx
│   ├── YieldAnalysis.tsx
│   └── SupplyUsageChart.tsx
└── hooks/
    └── useAnalytics.ts
```

**Key Business Rules:**
- Employees can be linked to user accounts
- Supply stock updated on purchases and usage
- Low stock alerts based on reorder level
- Settings stored in farm.settings JSON field
- Analytics calculated from historical data
- Cannot delete employees with task assignments

**Acceptance Criteria:**
- ✅ Can manage employee records
- ✅ Can track supply inventory
- ✅ Can record purchases and usage
- ✅ Low stock alerts work
- ✅ Can configure farm settings
- ✅ Analytics dashboard displays metrics
- ✅ Reports can be exported

---

### Phase 7: Recurring Orders & Automation (Week 14)

**Goal:** Implement automated recurring order generation for regular customers.

**Database Tables:**
- `recurring_order_schedules`

**Features:**

#### 7.1 Recurring Order Schedules
- Create recurring order templates
- Schedule types:
  - Fixed days (e.g., every Tuesday and Friday)
  - Intervals (e.g., every 7 days)
- Define template items with standard quantities
- Set lead time for advance order generation
- Start and end dates
- Skip specific dates (holidays, vacations)

#### 7.2 Automated Order Generation
- Background job to check schedules
- Generate orders based on lead time
- Create order items from template
- Auto-generate tasks for new orders
- Notification when orders created
- Pause/resume schedules

**Backend Implementation:**

```
apps/api/src/domains/planner-domain/recurring-orders/
├── router.ts
├── types.ts
├── commands/
│   ├── createSchedule.ts
│   ├── updateSchedule.ts
│   ├── pauseSchedule.ts
│   ├── skipDate.ts
│   ├── generateOrders.ts (cron job)
│   └── __tests__/
└── queries/
    ├── listSchedules.ts
    ├── getScheduleById.ts
    ├── getUpcomingOrders.ts
    └── __tests__/

apps/api/src/lib/cron/
├── scheduler.ts
├── jobs/
│   └── recurringOrdersJob.ts
└── __tests__/
```

**Frontend Implementation:**

```
src/planner/recurring-orders/
├── RecurringOrdersPage.tsx
├── components/
│   ├── ScheduleList.tsx
│   ├── ScheduleForm.tsx
│   ├── ScheduleDetails.tsx
│   ├── TemplateItemsForm.tsx
│   ├── SkipDateForm.tsx
│   └── UpcomingOrdersPreview.tsx
├── hooks/
│   ├── useRecurringOrders.ts
│   └── useScheduleMutations.ts
└── utils/
    └── scheduleCalculations.ts
```

**Cron Job Logic:**
```typescript
// Run daily at midnight
async function generateRecurringOrders() {
  const activeSchedules = await getActiveSchedules();
  
  for (const schedule of activeSchedules) {
    const nextOrderDate = calculateNextOrderDate(schedule);
    const shouldGenerate = shouldGenerateOrder(
      nextOrderDate,
      schedule.leadTimeDays
    );
    
    if (shouldGenerate) {
      await createOrderFromSchedule(schedule, nextOrderDate);
      await notifyCustomer(schedule.customerId, nextOrderDate);
    }
  }
}
```

**Key Business Rules:**
- Lead time determines when to generate order
- Skip dates prevent order generation
- Template items define standard order contents
- Generated orders start in Pending status
- Schedules can be paused without deletion
- End date optional (ongoing schedules)

**Testing:**
- Unit tests for date calculations
- Unit tests for order generation logic
- Integration tests for cron job
- Test edge cases (holidays, end dates, paused schedules)

**Acceptance Criteria:**
- ✅ Can create recurring order schedules
- ✅ Orders generated automatically based on schedule
- ✅ Can skip specific dates
- ✅ Lead time respected
- ✅ Notifications sent when orders created
- ✅ Can pause/resume schedules

---

## Technical Specifications

### Backend Architecture

#### tRPC Router Structure

```typescript
// apps/api/src/lib/trpc/router.ts
export const appRouter = router({
  // Existing routers
  machines: machineRouter,
  admin: adminRouter,
  onboarding: onboardingRouter,
  
  // New planner routers
  products: productRouter,
  customers: customerRouter,
  orders: orderRouter,
  tasks: taskRouter,
  farmLayout: farmLayoutRouter,
  employees: employeeRouter,
  supplies: suppliesRouter,
  settings: settingsRouter,
  analytics: analyticsRouter,
  recurringOrders: recurringOrderRouter,
});

export type AppRouter = typeof appRouter;
```

#### Procedure Types

**Query Procedures (Read Operations):**
```typescript
// List with pagination and filtering
list: farmProcedure
  .input(z.object({
    page: z.number().default(1),
    pageSize: z.number().default(20),
    search: z.string().optional(),
    filters: z.object({...}).optional(),
  }))
  .query(async ({ ctx, input }) => {
    const { page, pageSize, search, filters } = input;
    
    const where = {
      farmId: ctx.farmId,
      // Apply filters
    };
    
    const [data, total] = await Promise.all([
      ctx.prisma.entity.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { /* relations */ },
        orderBy: { /* sorting */ },
      }),
      ctx.prisma.entity.count({ where }),
    ]);
    
    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }),

// Get by ID
byId: farmProcedure
  .input(z.string().uuid())
  .query(async ({ ctx, input }) => {
    const entity = await ctx.prisma.entity.findUnique({
      where: { id: input, farmId: ctx.farmId },
      include: { /* relations */ },
    });
    
    if (!entity) {
      throw new NotFoundError('Entity', input);
    }
    
    return entity;
  }),
```

**Mutation Procedures (Write Operations):**
```typescript
// Create
create: farmProcedure
  .input(createEntitySchema)
  .mutation(async ({ ctx, input }) => {
    // Additional validation
    await validateBusinessRules(input, ctx.farmId);
    
    // Create entity
    const entity = await ctx.prisma.entity.create({
      data: {
        ...input,
        farmId: ctx.farmId,
      },
      include: { /* relations */ },
    });
    
    // Side effects (logging, notifications, etc.)
    await logActivity(ctx.farmId, 'ENTITY_CREATED', entity.id);
    
    return entity;
  }),

// Update
update: farmProcedure
  .input(updateEntitySchema)
  .mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    
    // Verify ownership
    const existing = await ctx.prisma.entity.findUnique({
      where: { id, farmId: ctx.farmId },
    });
    
    if (!existing) {
      throw new NotFoundError('Entity', id);
    }
    
    // Validate update
    await validateUpdate(existing, data);
    
    // Update entity
    const updated = await ctx.prisma.entity.update({
      where: { id },
      data,
      include: { /* relations */ },
    });
    
    return updated;
  }),

// Delete/Archive
archive: farmProcedure
  .input(z.string().uuid())
  .mutation(async ({ ctx, input }) => {
    // Check if can be deleted
    const canDelete = await checkDependencies(input, ctx.farmId);
    
    if (!canDelete) {
      throw new BusinessError(
        'Cannot delete entity with dependencies',
        'HAS_DEPENDENCIES'
      );
    }
    
    // Soft delete
    await ctx.prisma.entity.update({
      where: { id: input, farmId: ctx.farmId },
      data: { isActive: false },
    });
    
    return { success: true };
  }),
```

#### Database Query Patterns

**Complex Queries in Separate Files:**
```typescript
// apps/api/src/domains/planner-domain/orders/queries/listOrders.ts
export interface OrderFilters {
  status?: string;
  customerId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export const listOrders = async (
  prisma: PrismaClient,
  farmId: string,
  filters: OrderFilters,
  pagination: { page: number; pageSize: number }
) => {
  const where: Prisma.ordersWhereInput = {
    farmId,
    status: filters.status,
    customerId: filters.customerId,
    createdAt: filters.dateRange ? {
      gte: filters.dateRange.start,
      lte: filters.dateRange.end,
    } : undefined,
    OR: filters.search ? [
      { orderNumber: { contains: filters.search, mode: 'insensitive' } },
      { customer: { name: { contains: filters.search, mode: 'insensitive' } } },
    ] : undefined,
  };
  
  return prisma.orders.findMany({
    where,
    include: {
      customer: true,
      orderItems: {
        include: {
          product: true,
          blend: {
            include: {
              blendIngredients: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      },
    },
    skip: (pagination.page - 1) * pagination.pageSize,
    take: pagination.pageSize,
    orderBy: {
      createdAt: 'desc',
    },
  });
};
```

#### Business Logic in Commands

```typescript
// apps/api/src/domains/planner-domain/orders/commands/createOrder.ts
export const createOrder = async (
  prisma: PrismaClient,
  farmId: string,
  input: CreateOrderInput
) => {
  // Generate unique order number
  const orderNumber = await generateOrderNumber(prisma, farmId);
  
  // Validate customer exists
  if (input.customerId) {
    const customer = await prisma.customers.findUnique({
      where: { id: input.customerId, farmId },
    });
    
    if (!customer) {
      throw new NotFoundError('Customer', input.customerId);
    }
  }
  
  // Create order with items in transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.orders.create({
      data: {
        farmId,
        customerId: input.customerId,
        orderNumber,
        status: 'PENDING',
        notes: input.notes,
      },
    });
    
    // Create order items
    for (const item of input.items) {
      const product = await tx.products.findUnique({
        where: { id: item.productId },
      });
      
      if (!product) {
        throw new NotFoundError('Product', item.productId);
      }
      
      // Calculate dates and trays
      const calculations = calculateOrderItemDates(
        item.harvestDate,
        product
      );
      
      await tx.orderItems.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          blendId: item.blendId,
          quantityOz: item.quantityOz,
          harvestDate: item.harvestDate,
          overagePercent: item.overagePercent || 10,
          ...calculations,
        },
      });
    }
    
    return newOrder;
  });
  
  // Generate tasks for all order items
  await generateTasksForOrder(prisma, order.id);
  
  return order;
};

// Helper function for date calculations
function calculateOrderItemDates(
  harvestDate: Date,
  product: Product
) {
  const moveToLightDate = subDays(harvestDate, product.daysLight);
  const seedDate = subDays(moveToLightDate, product.daysGermination);
  const soakDate = subDays(seedDate, product.daysSoaking);
  
  const traysNeeded = Math.ceil(
    (quantityOz * (1 + overagePercent / 100)) / product.avgYieldPerTray
  );
  
  return {
    soakDate,
    seedDate,
    moveToLightDate,
    traysNeeded,
  };
}
```

### Frontend Architecture

#### Component Patterns

**Page Components:**
```typescript
// src/planner/products/ProductsPage.tsx
export function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = trpc.products.list.useQuery({
    page,
    pageSize: 20,
    filters,
  });
  
  const { mutate: createProduct } = trpc.products.create.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      toast.success('Product created');
    },
  });
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        action={
          <Button onClick={() => setShowCreateModal(true)}>
            Add Product
          </Button>
        }
      />
      
      <ProductFilters filters={filters} onChange={setFilters} />
      
      <ProductList
        products={data.data}
        onEdit={handleEdit}
        onArchive={handleArchive}
      />
      
      <Pagination
        page={page}
        totalPages={data.pagination.totalPages}
        onChange={setPage}
      />
    </div>
  );
}
```

**Custom Hooks:**
```typescript
// src/planner/products/hooks/useProducts.ts
export function useProducts(filters?: ProductFilters) {
  const [page, setPage] = useState(1);
  
  const query = trpc.products.list.useQuery({
    page,
    pageSize: 20,
    filters,
  });
  
  return {
    products: query.data?.data || [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    error: query.error,
    page,
    setPage,
  };
}

// src/planner/products/hooks/useProductMutations.ts
export function useProductMutations() {
  const utils = trpc.useContext();
  
  const create = trpc.products.create.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      toast.success('Product created');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const update = trpc.products.update.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      utils.products.byId.invalidate();
      toast.success('Product updated');
    },
  });
  
  const archive = trpc.products.archive.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      toast.success('Product archived');
    },
  });
  
  return { create, update, archive };
}
```

**Form Components:**
```typescript
// src/planner/products/components/ProductForm.tsx
interface ProductFormProps {
  product?: Product;
  onSuccess?: (product: Product) => void;
  onCancel?: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const { create, update } = useProductMutations();
  
  const form = useForm<CreateProduct>({
    defaultValues: product || {
      name: '',
      daysSoaking: 0,
      daysGermination: 0,
      daysLight: 0,
    },
  });
  
  const onSubmit = async (data: CreateProduct) => {
    if (product) {
      await update.mutateAsync({ id: product.id, ...data });
    } else {
      await create.mutateAsync(data);
    }
    onSuccess?.(result);
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Product Name"
        {...form.register('name')}
        error={form.formState.errors.name?.message}
      />
      
      <Input
        label="Days Soaking"
        type="number"
        {...form.register('daysSoaking', { valueAsNumber: true })}
      />
      
      {/* More fields */}
      
      <div className="flex gap-2">
        <Button type="submit" loading={form.formState.isSubmitting}>
          {product ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

### Type Safety

**Zod Schemas:**
```typescript
// apps/api/src/domains/planner-domain/products/types.ts
export const productSchema = z.object({
  id: z.string().uuid(),
  farmId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  sku: z.string().max(100).optional(),
  daysSoaking: z.number().int().min(0),
  daysGermination: z.number().int().min(0),
  daysLight: z.number().int().min(0),
  avgYieldPerTray: z.number().positive().optional(),
  seedWeight: z.number().positive().optional(),
  seedUnit: z.string().max(50).optional(),
  unitCost: z.number().positive().optional(),
  unitPrice: z.number().positive().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
});

export const createProductSchema = productSchema.omit({
  id: true,
  farmId: true,
  createdAt: true,
});

export const updateProductSchema = productSchema
  .omit({ farmId: true, createdAt: true })
  .partial()
  .required({ id: true });

export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
```

**Type Flow:**
```
Zod Schema (backend)
    ↓
tRPC Procedure Input/Output
    ↓
Automatic TypeScript Inference
    ↓
Frontend tRPC Client
    ↓
React Components (fully typed)
```

### Error Handling

**Backend Errors:**
```typescript
// apps/api/src/lib/errors/base-error.ts
export class BusinessError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'BusinessError';
  }
}

export class NotFoundError extends BusinessError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404);
  }
}

export class ValidationError extends BusinessError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}
```

**Frontend Error Handling:**
```typescript
// Automatic error handling via React Query
const { mutate } = trpc.products.create.useMutation({
  onError: (error) => {
    if (error.data?.code === 'DUPLICATE_PRODUCT_NAME') {
      toast.error('A product with this name already exists');
    } else {
      toast.error(error.message);
    }
  },
});

// Manual error handling
try {
  await createProduct.mutateAsync(data);
} catch (error) {
  if (error instanceof TRPCClientError) {
    console.error('API Error:', error.data?.code);
  }
}
```

---

## Development Workflow

### Setup & Environment

**Prerequisites:**
- Node.js 18+
- pnpm 9+
- Docker & Docker Compose
- PostgreSQL client (optional, for direct DB access)

**Initial Setup:**
```bash
# Clone and install
git clone <repo-url>
cd Rooted-Web-App
pnpm install

# Start infrastructure
docker compose -f docker/docker-compose.yml up -d

# Setup environment variables
cp .env.example .env
cp apps/api/.env.example apps/api/.env

# Run migrations
cd apps/api
pnpm prisma migrate dev
cd ../..

# Seed database with test data
cd apps/api
pnpm prisma db seed
cd ../..

# Start development servers
pnpm dev              # Frontend (port 5173)
cd apps/api && pnpm dev  # Backend (port 3001)
```

**Environment Variables:**

Root `.env`:
```env
VITE_API_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

`apps/api/.env`:
```env
DATABASE_URL=postgresql://rooted:rooted_dev_password@localhost:5433/rooted_planner
REDIS_URL=redis://localhost:6379
CLERK_SECRET_KEY=sk_test_...
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug
```

### Development Process

**1. Feature Development Workflow:**

```bash
# Create feature branch
git checkout -b feature/planner-products

# Implement backend first
cd apps/api/src/domains/planner-domain/products

# 1. Define types and schemas (types.ts)
# 2. Implement queries (queries/)
# 3. Implement commands (commands/)
# 4. Create router (router.ts)
# 5. Add to main router (apps/api/src/lib/trpc/router.ts)
# 6. Write tests (__tests__/)

# Test backend
cd apps/api
pnpm test products

# Implement frontend
cd ../../src/planner/products

# 1. Create page component
# 2. Create feature components
# 3. Create custom hooks
# 4. Add routing

# Test in browser
pnpm dev

# Commit and push
git add .
git commit -m "feat(planner): implement product management"
git push origin feature/planner-products
```

**2. Database Changes:**

```bash
# Modify Prisma schema
cd apps/api
vim prisma/schema.prisma

# Create migration
pnpm prisma migrate dev --name add_product_fields

# Generate Prisma client
pnpm prisma generate

# Update seed data if needed
vim prisma/seed.ts
pnpm prisma db seed
```

**3. Testing Workflow:**

```bash
# Run backend tests
cd apps/api
pnpm test                    # All tests
pnpm test products           # Specific domain
pnpm test:watch              # Watch mode
pnpm test:coverage           # Coverage report

# Run frontend tests (when implemented)
cd ../..
pnpm test
pnpm test:watch

# E2E tests (when implemented)
pnpm test:e2e
```

**4. Code Quality:**

```bash
# Linting
pnpm lint
pnpm lint:fix

# Type checking
pnpm type-check

# Formatting
pnpm format
pnpm format:check
```

### Git Workflow

**Branch Strategy:**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

**Commit Convention:**
```
feat(planner): add product management
fix(planner): correct date calculation in orders
docs(planner): update implementation roadmap
test(planner): add tests for task generation
refactor(planner): simplify order creation logic
```

**Pull Request Process:**
1. Create feature branch from `develop`
2. Implement feature with tests
3. Ensure all tests pass
4. Update documentation
5. Create PR to `develop`
6. Code review
7. Merge after approval

### Code Review Checklist

**Backend:**
- [ ] Zod schemas defined for all inputs/outputs
- [ ] Farm context enforced (farmId in all queries)
- [ ] Business rules validated
- [ ] Error handling implemented
- [ ] Tests written and passing
- [ ] Database queries optimized
- [ ] Transactions used where needed

**Frontend:**
- [ ] Components follow established patterns
- [ ] Custom hooks for business logic
- [ ] Loading and error states handled
- [ ] Responsive design
- [ ] Accessibility considerations
- [ ] Type safety maintained
- [ ] No console errors

**General:**
- [ ] Code follows style guide
- [ ] No hardcoded values
- [ ] Documentation updated
- [ ] No commented-out code
- [ ] Meaningful variable names

### Debugging

**Backend Debugging:**
```typescript
// Add logging
import { createLogger } from '@/lib/logger/logger';
const logger = createLogger({ service: 'planner-products' });

logger.debug('Creating product', { input });
logger.error('Failed to create product', { error, input });
```

**Database Debugging:**
```bash
# Connect to database
psql postgresql://rooted:rooted_dev_password@localhost:5433/rooted_planner

# View data
SELECT * FROM products WHERE farm_id = '...';

# Check RLS policies
\d+ products
```

**Frontend Debugging:**
```typescript
// React Query DevTools (already configured)
// Open browser and check React Query tab

// tRPC logging
const utils = trpc.useContext();
console.log('Query state:', utils.products.list.getData());
```

---

## Testing Strategy

### Backend Testing

**Unit Tests:**
```typescript
// apps/api/src/domains/planner-domain/products/commands/__tests__/createProduct.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mockPrisma } from '@/test/mockPrisma';
import { createProduct } from '../createProduct';

describe('createProduct', () => {
  beforeEach(() => {
    mockPrisma.reset();
  });
  
  it('should create product with valid input', async () => {
    const input = {
      name: 'Arugula',
      daysSoaking: 0,
      daysGermination: 3,
      daysLight: 7,
    };
    
    mockPrisma.products.create.mockResolvedValue({
      id: 'product-1',
      farmId: 'farm-1',
      ...input,
    });
    
    const result = await createProduct(mockPrisma, 'farm-1', input);
    
    expect(result.name).toBe('Arugula');
    expect(mockPrisma.products.create).toHaveBeenCalledWith({
      data: {
        farmId: 'farm-1',
        ...input,
      },
    });
  });
  
  it('should throw error for duplicate product name', async () => {
    mockPrisma.products.findFirst.mockResolvedValue({
      id: 'existing-product',
      name: 'Arugula',
    });
    
    await expect(
      createProduct(mockPrisma, 'farm-1', { name: 'Arugula', ... })
    ).rejects.toThrow('Product name already exists');
  });
});
```

**Integration Tests:**
```typescript
// apps/api/src/domains/planner-domain/products/__tests__/router.test.ts
import { describe, it, expect } from 'vitest';
import { createCaller } from '@/lib/trpc/test-utils';
import { productRouter } from '../router';

describe('productRouter', () => {
  it('should list products for farm', async () => {
    const caller = createCaller(productRouter, {
      farmId: 'farm-1',
      userId: 'user-1',
    });
    
    const result = await caller.list({
      page: 1,
      pageSize: 20,
    });
    
    expect(result.data).toBeInstanceOf(Array);
    expect(result.pagination.page).toBe(1);
  });
  
  it('should create product', async () => {
    const caller = createCaller(productRouter, {
      farmId: 'farm-1',
      userId: 'user-1',
    });
    
    const product = await caller.create({
      name: 'Pea Shoots',
      daysSoaking: 8,
      daysGermination: 3,
      daysLight: 7,
    });
    
    expect(product.name).toBe('Pea Shoots');
    expect(product.farmId).toBe('farm-1');
  });
});
```

### Frontend Testing

**Component Tests:**
```typescript
// src/planner/products/components/__tests__/ProductForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from '../ProductForm';
import { trpc } from '@/lib/trpc/client';

vi.mock('@/lib/trpc/client');

describe('ProductForm', () => {
  it('should render form fields', () => {
    render(<ProductForm />);
    
    expect(screen.getByLabelText('Product Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Days Soaking')).toBeInTheDocument();
  });
  
  it('should submit form with valid data', async () => {
    const mockCreate = vi.fn();
    trpc.products.create.useMutation.mockReturnValue({
      mutateAsync: mockCreate,
    });
    
    render(<ProductForm />);
    
    fireEvent.change(screen.getByLabelText('Product Name'), {
      target: { value: 'Arugula' },
    });
    
    fireEvent.click(screen.getByText('Create'));
    
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        name: 'Arugula',
        // ...
      });
    });
  });
});
```

**Hook Tests:**
```typescript
// src/planner/products/hooks/__tests__/useProducts.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from '../useProducts';
import { trpc } from '@/lib/trpc/client';

vi.mock('@/lib/trpc/client');

describe('useProducts', () => {
  it('should fetch products', async () => {
    const mockProducts = [
      { id: '1', name: 'Arugula' },
      { id: '2', name: 'Pea Shoots' },
    ];
    
    trpc.products.list.useQuery.mockReturnValue({
      data: { data: mockProducts, pagination: {} },
      isLoading: false,
    });
    
    const { result } = renderHook(() => useProducts());
    
    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts);
    });
  });
});
```

### E2E Testing

**Playwright Tests:**
```typescript
// e2e/planner/products.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Product Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/planner/products');
  });
  
  test('should create new product', async ({ page }) => {
    await page.click('text=Add Product');
    
    await page.fill('[name="name"]', 'Arugula');
    await page.fill('[name="daysSoaking"]', '0');
    await page.fill('[name="daysGermination"]', '3');
    await page.fill('[name="daysLight"]', '7');
    
    await page.click('text=Create');
    
    await expect(page.locator('text=Arugula')).toBeVisible();
  });
  
  test('should filter products', async ({ page }) => {
    await page.fill('[placeholder="Search products"]', 'Pea');
    
    await expect(page.locator('text=Pea Shoots')).toBeVisible();
    await expect(page.locator('text=Arugula')).not.toBeVisible();
  });
});
```

### Test Coverage Goals

- **Backend:** 80%+ coverage
  - Commands: 90%+
  - Queries: 80%+
  - Routers: 70%+

- **Frontend:** 70%+ coverage
  - Components: 70%+
  - Hooks: 80%+
  - Utils: 90%+

- **E2E:** Critical user flows
  - Product creation
  - Order creation with task generation
  - Task completion workflow
  - Farm layout editing

---

## Deployment Plan

### Development Environment

**Local Development:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Database: `localhost:5433`
- Redis: `localhost:6379`

**Development Database:**
- Seeded with test data
- Reset script available
- Migrations applied automatically

### Staging Environment

**Infrastructure:**
- AWS EC2 instance (t3.medium)
- Docker Compose deployment
- PostgreSQL container
- Redis container
- Nginx reverse proxy

**Deployment Process:**
```bash
# Build containers
docker compose -f docker/docker-compose.staging.yml build

# Deploy
docker compose -f docker/docker-compose.staging.yml up -d

# Run migrations
docker exec rooted-api pnpm prisma migrate deploy

# Verify
curl https://staging.rootedrobotics.com/api/health
```

**Environment:**
- URL: `https://staging.rootedrobotics.com`
- Database: Separate staging database
- Clerk: Staging environment
- Automatic deployment from `develop` branch

### Production Environment

**Infrastructure:**
- AWS EC2 instance (t3.large or larger)
- Docker Compose deployment
- PostgreSQL with automated backups
- Redis for caching
- Cloudflare CDN and SSL
- Automated backups to S3

**Deployment Process:**
```bash
# Tag release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Build production containers
docker compose -f docker/docker-compose.prod.yml build

# Deploy with zero downtime
docker compose -f docker/docker-compose.prod.yml up -d --no-deps --build web-app

# Run migrations
docker exec rooted-api pnpm prisma migrate deploy

# Verify
curl https://app.rootedrobotics.com/api/health

# Monitor logs
docker compose -f docker/docker-compose.prod.yml logs -f
```

**Environment:**
- URL: `https://app.rootedrobotics.com`
- Database: Production PostgreSQL with RLS
- Clerk: Production environment
- Manual deployment from `main` branch
- Automated backups every 6 hours

### Database Migrations

**Development:**
```bash
# Create migration
pnpm prisma migrate dev --name add_feature

# Apply migration
pnpm prisma migrate dev
```

**Production:**
```bash
# Generate migration (dev environment)
pnpm prisma migrate dev --name add_feature

# Deploy to production
pnpm prisma migrate deploy
```

**Rollback Strategy:**
```bash
# Revert migration
pnpm prisma migrate resolve --rolled-back <migration-name>

# Apply previous migration
pnpm prisma migrate deploy
```

### Monitoring & Logging

**Application Logs:**
- Structured JSON logging
- Log levels: debug, info, warn, error
- Request ID tracking
- Farm context in all logs

**Monitoring:**
- Health check endpoint: `/api/health`
- Database connection monitoring
- Redis connection monitoring
- Error rate tracking
- Response time monitoring

**Alerts:**
- High error rate
- Database connection failures
- Disk space warnings
- Memory usage warnings

### Backup Strategy

**Database Backups:**
```bash
# Automated backup script
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${TIMESTAMP}.sql"

docker exec rooted-postgres pg_dump -U rooted rooted_planner > $BACKUP_FILE
aws s3 cp $BACKUP_FILE s3://rooted-backups/database/

# Keep last 30 days
find . -name "backup_*.sql" -mtime +30 -delete
```

**Backup Schedule:**
- Full backup: Every 6 hours
- Retention: 30 days
- Storage: AWS S3
- Automated via cron job

**Restore Process:**
```bash
# Download backup
aws s3 cp s3://rooted-backups/database/backup_20260205_120000.sql .

# Restore
docker exec -i rooted-postgres psql -U rooted rooted_planner < backup_20260205_120000.sql
```

### Scaling Considerations

**Current Architecture (Phase 1):**
- Single EC2 instance
- Suitable for ~50 concurrent users
- Estimated cost: $100-150/month

**Scaling Path:**
- **Phase 2 (100+ users):** Larger EC2 instance, managed PostgreSQL (RDS)
- **Phase 3 (500+ users):** Load balancer, multiple app instances, Redis cluster
- **Phase 4 (1000+ users):** Microservices, managed services, CDN optimization

---

## Risk Assessment

### Technical Risks

**1. Database Performance**
- **Risk:** Complex queries with multiple joins may slow down as data grows
- **Mitigation:**
  - Proper indexing on all foreign keys and query columns
  - Query optimization and monitoring
  - Pagination on all list endpoints
  - Consider read replicas if needed
- **Likelihood:** Medium
- **Impact:** High

**2. Multi-Tenant Data Isolation**
- **Risk:** Data leakage between farms
- **Mitigation:**
  - Row-Level Security policies enforced at database level
  - Farm context validation in all procedures
  - Comprehensive testing of tenant isolation
  - Regular security audits
- **Likelihood:** Low
- **Impact:** Critical

**3. Task Generation Complexity**
- **Risk:** Edge cases in date calculations and task generation
- **Mitigation:**
  - Comprehensive unit tests for date calculations
  - Validation of product timing data
  - Manual review capability for generated tasks
  - Ability to modify task dates
- **Likelihood:** Medium
- **Impact:** Medium

**4. Canvas Editor Performance**
- **Risk:** Large farm layouts may cause performance issues
- **Mitigation:**
  - Canvas rendering optimization
  - Limit number of elements
  - Lazy loading of layout data
  - Consider using canvas library (Konva, Fabric.js)
- **Likelihood:** Low
- **Impact:** Medium

### Business Risks

**1. Scope Creep**
- **Risk:** Feature requests expanding beyond initial scope
- **Mitigation:**
  - Strict adherence to phased implementation
  - Feature prioritization framework
  - Regular stakeholder alignment
  - Clear acceptance criteria
- **Likelihood:** High
- **Impact:** Medium

**2. User Adoption**
- **Risk:** Users may find system too complex or not fitting workflow
- **Mitigation:**
  - User testing at each phase
  - Iterative feedback incorporation
  - Comprehensive documentation
  - Training materials and onboarding
- **Likelihood:** Medium
- **Impact:** High

**3. Data Migration**
- **Risk:** Existing users may have data in other systems
- **Mitigation:**
  - CSV import functionality
  - Data migration scripts
  - Validation of imported data
  - Rollback capability
- **Likelihood:** Medium
- **Impact:** Medium

### Operational Risks

**1. Deployment Issues**
- **Risk:** Production deployment failures or downtime
- **Mitigation:**
  - Staging environment testing
  - Blue-green deployment strategy
  - Automated rollback capability
  - Comprehensive monitoring
- **Likelihood:** Low
- **Impact:** High

**2. Data Loss**
- **Risk:** Database corruption or accidental deletion
- **Mitigation:**
  - Automated backups every 6 hours
  - 30-day retention policy
  - Tested restore procedures
  - Soft deletes where appropriate
- **Likelihood:** Low
- **Impact:** Critical

**3. Performance Degradation**
- **Risk:** System slowdown under load
- **Mitigation:**
  - Performance testing before launch
  - Monitoring and alerting
  - Scaling plan ready
  - Query optimization
- **Likelihood:** Medium
- **Impact:** High

### Mitigation Summary

**High Priority:**
1. Implement comprehensive testing (unit, integration, E2E)
2. Set up monitoring and alerting
3. Establish backup and restore procedures
4. Conduct security audit of tenant isolation
5. Performance testing with realistic data volumes

**Medium Priority:**
1. Create user documentation and training materials
2. Develop data import/export functionality
3. Optimize database queries
4. Implement feature flags for gradual rollout

**Low Priority:**
1. Plan for horizontal scaling
2. Consider microservices architecture
3. Evaluate managed services migration

---

## Success Metrics

### Development Metrics

**Code Quality:**
- Test coverage: 80%+ backend, 70%+ frontend
- Zero critical security vulnerabilities
- Linting and formatting compliance: 100%
- Code review approval required for all PRs

**Development Velocity:**
- Phase completion within estimated timeframes
- Average PR merge time: < 2 days
- Bug fix turnaround: < 1 week
- Feature delivery predictability

### Product Metrics

**Functionality:**
- All requirements from REQUIREMENTS.md implemented
- All acceptance criteria met for each phase
- Zero critical bugs in production
- < 5 minor bugs per phase

**Performance:**
- Page load time: < 2 seconds
- API response time: < 500ms (p95)
- Database query time: < 100ms (p95)
- Zero downtime deployments

### User Metrics

**Adoption:**
- User onboarding completion rate: > 80%
- Daily active users growth
- Feature usage tracking
- User satisfaction score: > 4/5

**Engagement:**
- Orders created per week
- Tasks completed per week
- Products managed per farm
- Time spent in application

### Business Metrics

**Operational:**
- System uptime: > 99.5%
- Support ticket volume: < 10 per week
- Average resolution time: < 24 hours
- Customer retention rate: > 90%

**Financial:**
- Development cost within budget
- Infrastructure cost: < $200/month initially
- Customer acquisition cost
- Lifetime value per customer

---

## Next Steps

### Immediate Actions (Week 1)

1. **Review and Approval**
   - [ ] Stakeholder review of this roadmap
   - [ ] Technical team review
   - [ ] Approval to proceed

2. **Environment Setup**
   - [ ] Ensure all developers have local environment working
   - [ ] Set up staging environment
   - [ ] Configure CI/CD pipeline

3. **Phase 0 Kickoff**
   - [ ] Create Phase 0 tasks in project management tool
   - [ ] Assign team members
   - [ ] Set up development branch
   - [ ] Begin foundation work

### Phase Kickoff Process

**Before Each Phase:**
1. Review phase objectives and deliverables
2. Create detailed task breakdown
3. Assign tasks to team members
4. Set up feature branches
5. Schedule daily standups

**During Phase:**
1. Daily standup meetings
2. Code reviews for all PRs
3. Continuous testing
4. Documentation updates
5. Weekly progress reviews

**Phase Completion:**
1. All acceptance criteria met
2. Tests passing
3. Documentation complete
4. Stakeholder demo
5. Deployment to staging
6. User acceptance testing
7. Approval to proceed to next phase

### Long-Term Roadmap

**Q1 2026:**
- Phases 0-2: Foundation, Products, Customers

**Q2 2026:**
- Phases 3-4: Orders, Tasks, Production Views

**Q3 2026:**
- Phases 5-6: Farm Layout, Inventory, Settings

**Q4 2026:**
- Phase 7: Recurring Orders, Automation
- Production launch
- User onboarding and training

**2027:**
- Feature enhancements based on user feedback
- Mobile app development
- Advanced analytics and reporting
- Integration with accounting systems
- IoT sensor integration

---

## Appendix

### Glossary

- **Farm**: A microgreen production facility (tenant in multi-tenant system)
- **Product**: A microgreen variety with growing parameters
- **Blend**: A composite product made from multiple varieties
- **Order**: Customer request for products with target harvest dates
- **Order Item**: Individual product/blend within an order
- **Task**: Production step (SOAK, SEED, MOVE_TO_LIGHT, HARVEST)
- **Tray**: Physical growing container
- **Rack**: Growing structure with multiple levels
- **Farm Layout**: Visual representation of farm space
- **Recurring Order**: Automated order generation schedule

### References

- [Business Requirements](../rooted-planner/REQUIREMENTS.md)
- [Architecture Document](../rooted-planner/ARCH.md)
- [Project Structure](../PROJECT_STRUCTURE.md)
- [Style Guide](../STYLE.md)
- [Database Schema](../DATABASE_SCHEMA.md)

### Contact

For questions or clarifications about this roadmap:
- Technical Lead: [Contact Info]
- Product Owner: [Contact Info]
- Project Manager: [Contact Info]

---

**Document End**

This roadmap provides a comprehensive plan for implementing the Rooted Planner platform. It should be treated as a living document and updated as the project progresses and requirements evolve.
