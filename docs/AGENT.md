# Agent Development Guide - Rooted Planner

## Overview

This document outlines how AI coding agents can effectively support developers working on the Rooted Planner codebase. It covers the project structure, development workflows, common tasks, and best practices for agent-assisted development.

## Project Context Understanding

### Core Business Domain
- **Microgreen farm management** application
- **Production workflow**: Order → Tasks (SOAK → SEED → MOVE_TO_LIGHT → HARVEST)
- **Multi-tenant architecture** with farm isolation
- **Real-world operations**: Tracking trays, yields, customers, employees

### Technical Architecture
- **Monorepo**: Apps (web/api) + shared packages (db/ui/logic/config)
- **Type-safe stack**: tRPC + Zod + TypeScript + Prisma
- **Frontend**: React + Vite + TailwindCSS + Shadcn
- **Backend**: Fastify + tRPC + PostgreSQL + Redis
- **Auth**: Clerk with farm_id in JWT metadata
- **Deployment**: Docker containers on AWS EC2

## Development Workflow Support

### Initial Project Setup

**Agent Tasks:**
1. **Environment Setup**
   ```bash
   # Clone and install dependencies
   git clone <repo>
   cd rooted-planner-erp
   pnpm install
   
   # Setup environment files
   cp .env.example .env.local
   # Guide developer through required environment variables
   ```

2. **Database Initialization**
   ```bash
   # Start PostgreSQL container
   docker-compose up -d postgres redis
   
   # Run Prisma migrations
   cd packages/db
   pnpm prisma migrate dev
   pnpm prisma generate
   ```

3. **Development Server**
   ```bash
   # Start all services
   pnpm dev
   # This should start:
   # - apps/web (React + Vite)
   # - apps/api (Fastify + tRPC)
   # - Database and Redis containers
   ```

### Code Navigation Assistance

**Help developers understand:**

```
├── apps/
│   ├── web/                # Frontend React app
│   │   ├── src/
│   │   │   ├── products/   # Product management features
│   │   │   ├── orders/     # Order management features
│   │   │   ├── tasks/      # Production workflow features
│   │   │   └── shared/     # Reusable components/hooks
│   └── api/                # Backend tRPC API
│       ├── src/
│       │   ├── products/   # Product domain logic
│       │   ├── orders/     # Order domain logic
│       │   ├── tasks/      # Task domain logic
│       │   └── shared/     # Middleware, utils
├── packages/
│   ├── db/                 # Prisma schema + migrations
│   ├── ui/                 # Shadcn components
│   ├── logic/              # Zod schemas + business rules
│   └── config/             # Shared tooling configs
```

**Key Files to Understand:**
- `packages/db/prisma/schema.prisma` - Database schema
- `packages/logic/src/` - Business rules and validation
- `apps/api/src/router/index.ts` - tRPC router setup
- `apps/web/src/lib/trpc.ts` - tRPC client setup

## Common Development Tasks

### 1. Adding New Features

**Agent Workflow:**
1. **Understand Requirements**
   - Ask clarifying questions about business logic
   - Reference existing similar features
   - Check BASIC_SPEC.md for feature requirements

2. **Plan Implementation**
   ```
   For new feature "Supplier Management":
   1. Add database schema (packages/db)
   2. Create Zod schemas (packages/logic)
   3. Build tRPC procedures (apps/api)
   4. Create React components (apps/web)
   5. Add navigation and routing
   ```

3. **Database Schema Changes**
   ```typescript
   // packages/db/prisma/schema.prisma
   model Supplier {
     id        String   @id @default(uuid())
     farmId    String   @map("farm_id")
     name      String
     email     String?
     phone     String?
     address   Json?
     createdAt DateTime @default(now()) @map("created_at")
     
     // Relations
     farm      Farm     @relation(fields: [farmId], references: [id])
     supplies  Supply[]
     
     @@map("suppliers")
   }
   ```

4. **Business Logic & Validation**
   ```typescript
   // packages/logic/src/suppliers/schemas.ts
   export const supplierSchema = z.object({
     id: z.string().uuid(),
     farmId: z.string().uuid(),
     name: z.string().min(1).max(100),
     email: z.string().email().optional(),
     phone: z.string().optional(),
     address: z.record(z.any()).optional(),
   });
   
   export const createSupplierSchema = supplierSchema.omit({ 
     id: true, 
     farmId: true 
   });
   ```

5. **tRPC Procedures**
   ```typescript
   // apps/api/src/suppliers/router.ts
   export const supplierRouter = router({
     list: farmProcedure.query(async ({ ctx }) => {
       return ctx.prisma.supplier.findMany({
         where: { farmId: ctx.farmId },
         orderBy: { name: 'asc' },
       });
     }),
     
     create: farmProcedure
       .input(createSupplierSchema)
       .mutation(async ({ ctx, input }) => {
         return ctx.prisma.supplier.create({
           data: { ...input, farmId: ctx.farmId },
         });
       }),
   });
   ```

6. **React Components**
   ```typescript
   // apps/web/src/suppliers/components/SupplierList.tsx
   export const SupplierList = () => {
     const { data: suppliers, isLoading } = trpc.suppliers.list.useQuery();
     
     if (isLoading) return <LoadingSpinner />;
     
     return (
       <div className="space-y-4">
         {suppliers?.map(supplier => (
           <SupplierCard key={supplier.id} supplier={supplier} />
         ))}
       </div>
     );
   };
   ```

### 2. Debugging Issues

**Agent Debugging Support:**

1. **tRPC Errors**
   ```typescript
   // Common tRPC error patterns
   
   // Input validation error
   if (error.code === 'BAD_REQUEST') {
     // Check Zod schema validation
     // Verify input data structure
   }
   
   // Unauthorized error
   if (error.code === 'UNAUTHORIZED') {
     // Check Clerk JWT validation
     // Verify farm_id extraction
   }
   
   // Database constraint error
   if (error.code === 'CONFLICT') {
     // Check unique constraints
     // Verify foreign key relationships
   }
   ```

2. **Database Issues**
   ```bash
   # Check database connection
   docker-compose logs postgres
   
   # Verify schema sync
   cd packages/db
   pnpm prisma db pull
   pnpm prisma generate
   
   # Reset database if needed
   pnpm prisma migrate reset
   ```

3. **Frontend Issues**
   ```typescript
   // React Query devtools
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
   
   // Add to app root for debugging
   <ReactQueryDevtools initialIsOpen={false} />
   ```

### 3. Testing Support

**Agent Testing Assistance:**

1. **Unit Tests**
   ```typescript
   // packages/logic/src/products/__tests__/calculations.test.ts
   import { calculateHarvestDate, calculateTraysNeeded } from '../calculations';
   
   describe('Product Calculations', () => {
     test('calculates harvest date correctly', () => {
       const seedDate = new Date('2024-01-01');
       const daysToHarvest = 14;
       const expected = new Date('2024-01-15');
       
       expect(calculateHarvestDate(seedDate, daysToHarvest)).toEqual(expected);
     });
   });
   ```

2. **Integration Tests**
   ```typescript
   // apps/api/src/__tests__/products.test.ts
   import { createTRPCMsw } from 'msw-trpc';
   import { appRouter } from '../router';
   
   const trpcMsw = createTRPCMsw(appRouter);
   
   test('creates product successfully', async () => {
     const mockProduct = { name: 'Arugula', daysToHarvest: 7 };
     
     server.use(
       trpcMsw.products.create.mutation(() => {
         return { id: '123', ...mockProduct };
       })
     );
     
     // Test implementation
   });
   ```

3. **E2E Tests**
   ```typescript
   // apps/web/src/__tests__/order-workflow.e2e.ts
   import { test, expect } from '@playwright/test';
   
   test('complete order workflow', async ({ page }) => {
     // 1. Create customer
     await page.goto('/customers');
     await page.click('[data-testid="add-customer"]');
     
     // 2. Create order
     await page.goto('/orders');
     await page.click('[data-testid="add-order"]');
     
     // 3. Verify tasks created
     await page.goto('/tasks');
     await expect(page.locator('[data-testid="task-soak"]')).toBeVisible();
   });
   ```

## Code Quality Assistance

### 1. Code Review Support

**Agent Review Checklist:**

```typescript
// ✅ Type Safety
- All tRPC procedures have proper input/output types
- Zod schemas are used for validation
- No 'any' types without justification

// ✅ Business Logic
- Farm isolation enforced (farmId in all queries)
- Error handling follows established patterns
- Business rules implemented in packages/logic

// ✅ Performance
- Database queries are optimized
- Proper indexing on farm_id columns
- React Query used for caching

// ✅ Security
- Input validation with Zod
- Authorization checks in tRPC middleware
- No sensitive data in client-side code

// ✅ Consistency
- Follows naming conventions from STYLE.md
- Component structure matches established patterns
- Import organization is consistent
```

### 2. Refactoring Support

**Common Refactoring Patterns:**

1. **Extract Business Logic**
   ```typescript
   // Before: Business logic in tRPC procedure
   create: farmProcedure
     .input(createOrderSchema)
     .mutation(async ({ ctx, input }) => {
       // Complex order calculation logic here
       const traysNeeded = input.items.reduce((total, item) => {
         const product = await ctx.prisma.product.findUnique({
           where: { id: item.productId }
         });
         return total + Math.ceil(item.quantity / product.avgYieldPerTray);
       }, 0);
       // ... more logic
     });
   
   // After: Extract to packages/logic
   // packages/logic/src/orders/calculations.ts
   export const calculateOrderRequirements = (
     items: OrderItem[],
     products: Product[]
   ) => {
     return items.map(item => {
       const product = products.find(p => p.id === item.productId);
       return {
         ...item,
         traysNeeded: Math.ceil(item.quantity / product.avgYieldPerTray),
         soakDate: subDays(item.harvestDate, product.daysToHarvest),
       };
     });
   };
   ```

2. **Component Composition**
   ```typescript
   // Before: Large monolithic component
   const OrderForm = () => {
     // 200+ lines of JSX and logic
   };
   
   // After: Composed components
   const OrderForm = () => (
     <form>
       <OrderHeader />
       <CustomerSelection />
       <OrderItemsList />
       <OrderSummary />
       <OrderActions />
     </form>
   );
   ```

### 3. Performance Optimization

**Agent Performance Guidance:**

1. **Database Optimization**
   ```sql
   -- Add indexes for common queries
   CREATE INDEX idx_orders_farm_id_status ON orders(farm_id, status);
   CREATE INDEX idx_tasks_farm_id_due_date ON tasks(farm_id, due_date);
   CREATE INDEX idx_products_farm_id_active ON products(farm_id, is_active);
   ```

2. **React Query Optimization**
   ```typescript
   // Prefetch related data
   const prefetchOrderData = async (orderId: string) => {
     await Promise.all([
       queryClient.prefetchQuery({
         queryKey: ['orders', 'byId', orderId],
         queryFn: () => trpc.orders.byId.fetch(orderId),
       }),
       queryClient.prefetchQuery({
         queryKey: ['customers', 'list'],
         queryFn: () => trpc.customers.list.fetch(),
       }),
     ]);
   };
   ```

3. **Bundle Optimization**
   ```typescript
   // Lazy load heavy components
   const FarmLayoutEditor = lazy(() => import('./FarmLayoutEditor'));
   const ReportsPage = lazy(() => import('./ReportsPage'));
   
   // Code splitting by route
   const router = createBrowserRouter([
     {
       path: '/farm-layout',
       element: <Suspense fallback={<Loading />}><FarmLayoutEditor /></Suspense>,
     },
   ]);
   ```

## Deployment & DevOps Support

### 1. Docker Development

**Agent Docker Assistance:**

```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: rooted_planner
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
      - "3001:3001"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/rooted_planner
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
```

### 2. Environment Management

**Agent Environment Setup:**

```bash
# .env.example
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/rooted_planner"
REDIS_URL="redis://localhost:6379"

# Authentication
CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."

# Application
NODE_ENV="development"
PORT="3001"
FRONTEND_URL="http://localhost:3000"

# AWS (for production)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
```

### 3. Production Deployment

**Agent Deployment Checklist:**

```bash
# Build and deploy steps
1. Build production images
   docker build -t rooted-planner:latest .

2. Run database migrations
   docker run --rm rooted-planner:latest pnpm prisma migrate deploy

3. Start production stack
   docker-compose -f docker-compose.prod.yml up -d

4. Verify health checks
   curl http://localhost:3001/health
   curl http://localhost:3000/health

5. Monitor logs
   docker-compose logs -f web
```

## Troubleshooting Guide

### Common Issues & Solutions

1. **tRPC Type Errors**
   ```bash
   # Regenerate tRPC types
   cd apps/web
   pnpm build
   
   # Clear TypeScript cache
   rm -rf node_modules/.cache
   pnpm install
   ```

2. **Database Schema Drift**
   ```bash
   # Reset and regenerate
   cd packages/db
   pnpm prisma migrate reset
   pnpm prisma generate
   ```

3. **Clerk Authentication Issues**
   ```typescript
   // Check JWT extraction
   const farmId = auth.sessionClaims?.metadata?.farmId;
   if (!farmId) {
     throw new TRPCError({
       code: 'UNAUTHORIZED',
       message: 'Farm ID not found in session',
     });
   }
   ```

4. **Build Failures**
   ```bash
   # Clear all caches and reinstall
   pnpm clean
   rm -rf node_modules
   pnpm install
   pnpm build
   ```

## Agent Best Practices

### 1. Session Documentation
- **Document all work**: Create session logs in `docs/agentic-sessions/`
- **Research Best Practice**: When starting a new session
search the internet for best practices related to the task at hand.
- **Session format**: `YYYY-MM-DD-session-name.md` (e.g., `2024-01-15-product-feature-implementation.md`)
- **Include user name**: Document which user/developer the agent was assisting
- **Include**: All prompts, responses, code changes, and decisions made during the session
- **Track reasoning**: Document why specific approaches were chosen
- **Link related files**: Reference all files created, modified, or reviewed

### 2. Context Awareness
- Always consider the farm multi-tenancy when writing queries
- Reference the business domain (microgreen production workflow)
- Understand the relationship between Orders → Tasks → Production

### 2. Code Consistency
- Follow patterns established in STYLE.md
- Use existing components from packages/ui
- Maintain type safety throughout the stack

### 3. Code Consistency
- Follow patterns established in STYLE.md
- Use existing components from packages/ui
- Maintain type safety throughout the stack

### 4. Testing Mindset
- Write tests for business logic in packages/logic
- Test tRPC procedures with proper mocking
- Consider edge cases in production workflows

### 5. Performance Considerations
- Optimize database queries with proper indexing
- Use React Query for efficient data fetching
- Consider lazy loading for heavy components

### 6. Security Awareness
- Always validate inputs with Zod schemas
- Ensure farm isolation in all database queries
- Never expose sensitive data to the client

This guide enables AI agents to effectively support developers by understanding the project structure, common workflows, and best practices specific to the Rooted Planner codebase.
