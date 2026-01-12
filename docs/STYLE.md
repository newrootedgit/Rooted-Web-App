# Style Guide - Rooted Planner

## Code Organization & Modularity

### Feature-Based Module Structure

Organize code by business domain, not technical layer:

```
apps/api/src/
├── products/
│   ├── router.ts          # tRPC procedures
│   ├── service.ts         # Business logic
│   ├── queries.ts         # Database queries
│   └── types.ts           # Domain-specific types
├── orders/
├── tasks/
└── shared/
    ├── middleware/
    ├── utils/
    └── types/
```

```
apps/web/src/
├── products/
│   ├── components/        # Feature-specific components
│   ├── hooks/            # Feature-specific hooks
│   ├── pages/            # Route components
│   └── types.ts          # Frontend-specific types
├── orders/
├── tasks/
└── shared/
    ├── components/       # Reusable UI components
    ├── hooks/           # Generic hooks
    └── utils/
```

### Package Boundaries

**packages/logic** - Universal business rules:
```typescript
// ✅ Good - Pure business logic
export const calculateHarvestDate = (seedDate: Date, daysToHarvest: number) => {
  return addDays(seedDate, daysToHarvest);
};

// ✅ Good - Shared validation schemas
export const createOrderSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(orderItemSchema),
});

// ❌ Bad - Framework-specific code
export const useOrderQuery = () => { /* React-specific */ };
```

**packages/ui** - Reusable React components:
```typescript
// ✅ Good - Generic, reusable components
export const Button = ({ variant, children, ...props }) => { /* */ };
export const DataTable = ({ data, columns }) => { /* */ };

// ❌ Bad - Business logic in UI components
export const OrderForm = () => {
  // Complex order calculation logic should be in packages/logic
};
```

### Import/Export Patterns

**Use barrel exports for clean imports:**
```typescript
// packages/logic/src/index.ts
export * from './orders';
export * from './products';
export * from './validation';

// apps/web/src/orders/components/OrderForm.tsx
import { createOrderSchema, calculateTotal } from '@rooted/logic';
```

**Prefer absolute imports for packages:**
```typescript
// ✅ Good
import { Button } from '@rooted/ui';
import { createOrderSchema } from '@rooted/logic';

// ❌ Bad
import { Button } from '../../../packages/ui/src/button';
```

**Use relative imports within features:**
```typescript
// apps/web/src/orders/components/OrderForm.tsx
// ✅ Good - within same feature
import { OrderItem } from './OrderItem';
import { useOrderMutations } from '../hooks/useOrderMutations';

// ❌ Bad - cross-feature imports should be absolute
import { ProductSelect } from '../../products/components/ProductSelect';
```

## Naming Conventions

### File Naming

**React Components**: PascalCase
```
OrderForm.tsx
ProductList.tsx
TaskCalendar.tsx
```

**Hooks, utilities, services**: camelCase
```
useOrderQuery.ts
calculateHarvest.ts
orderService.ts
```

**Pages/Routes**: kebab-case
```
order-details.tsx
product-catalog.tsx
task-calendar.tsx
```

**Configuration files**: kebab-case
```
tailwind.config.js
eslint.config.js
docker-compose.yml
```

### Variable & Function Naming

**Functions**: Verb-first, descriptive
```typescript
// ✅ Good
const calculateHarvestDate = (seedDate: Date, days: number) => { /* */ };
const validateOrderItems = (items: OrderItem[]) => { /* */ };
const fetchActiveProducts = async (farmId: string) => { /* */ };

// ❌ Bad
const harvestDate = (date: Date, days: number) => { /* */ };
const orderItems = (items: OrderItem[]) => { /* */ };
const products = async (id: string) => { /* */ };
```

**Variables**: Descriptive nouns
```typescript
// ✅ Good
const activeProducts = await fetchActiveProducts(farmId);
const totalTraysNeeded = calculateTraysNeeded(orderItems);
const harvestDate = addDays(seedDate, product.daysToHarvest);

// ❌ Bad
const data = await fetchActiveProducts(farmId);
const total = calculateTraysNeeded(orderItems);
const date = addDays(seedDate, product.daysToHarvest);
```

**Boolean variables**: is/has/can/should prefix
```typescript
// ✅ Good
const isOrderComplete = order.status === 'COMPLETED';
const hasOverdueTask = tasks.some(task => isOverdue(task));
const canEditOrder = user.role === 'ADMIN' || order.status === 'PENDING';

// ❌ Bad
const orderComplete = order.status === 'COMPLETED';
const overdueTask = tasks.some(task => isOverdue(task));
const editOrder = user.role === 'ADMIN';
```

### Database Naming

**Tables**: snake_case, plural
```sql
farms
product_categories
order_items
recurring_order_schedules
```

**Columns**: snake_case
```sql
created_at
updated_at
farm_id
days_to_harvest
avg_yield_per_tray
```

**Prisma mapping**: Use camelCase in schema, snake_case in database
```prisma
model Product {
  id              String   @id @default(uuid())
  farmId          String   @map("farm_id")
  daysToHarvest   Int      @map("days_to_harvest")
  avgYieldPerTray Decimal? @map("avg_yield_per_tray")
  createdAt       DateTime @default(now()) @map("created_at")

  @@map("products")
}
```

### tRPC Procedure Naming

**Queries**: Noun-based, descriptive
```typescript
// ✅ Good
products: {
  list: publicProcedure.query(/* */),
  byId: publicProcedure.input(z.string()).query(/* */),
  categories: publicProcedure.query(/* */),
}

// ❌ Bad
products: {
  getProducts: publicProcedure.query(/* */),
  getProductById: publicProcedure.query(/* */),
  getCategories: publicProcedure.query(/* */),
}
```

**Mutations**: Verb-based, action-oriented
```typescript
// ✅ Good
products: {
  create: publicProcedure.input(createProductSchema).mutation(/* */),
  update: publicProcedure.input(updateProductSchema).mutation(/* */),
  archive: publicProcedure.input(z.string()).mutation(/* */),
}

// ❌ Bad
products: {
  createProduct: publicProcedure.mutation(/* */),
  updateProduct: publicProcedure.mutation(/* */),
  deleteProduct: publicProcedure.mutation(/* */),
}
```

## TypeScript Patterns

### Zod Schema Organization

**Co-locate with domain logic:**
```typescript
// packages/logic/src/products/schemas.ts
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  daysToHarvest: z.number().int().min(1).max(365),
  avgYieldPerTray: z.number().positive().optional(),
});

export const createProductSchema = productSchema.omit({ id: true });
export const updateProductSchema = productSchema.partial().required({ id: true });
```

**Derive TypeScript types from schemas:**
```typescript
// ✅ Good - Single source of truth
export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;

// ❌ Bad - Duplicate type definitions
export interface Product {
  id: string;
  name: string;
  // ... duplicating schema
}
```

### Type Definitions

**Use interfaces for object shapes that might be extended:**
```typescript
// ✅ Good - Extensible
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Product extends BaseEntity {
  name: string;
  farmId: string;
}
```

**Use types for unions, computed types, and utilities:**
```typescript
// ✅ Good - Union types
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
type UserRole = 'OWNER' | 'ADMIN' | 'FARM_MANAGER' | 'FARM_OPERATOR';

// ✅ Good - Computed types
type ProductWithCategory = Product & { category: ProductCategory };
type CreateOrderInput = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
```

### Generic Patterns

**Reusable API response types:**
```typescript
// packages/logic/src/shared/types.ts
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

**Generic CRUD operations:**
```typescript
// apps/api/src/shared/service.ts
export abstract class BaseService<T, CreateT, UpdateT> {
  abstract create(data: CreateT): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract update(id: string, data: UpdateT): Promise<T>;
  abstract delete(id: string): Promise<void>;
}
```

## React Patterns

### Component Structure

**Consistent component organization:**
```typescript
// ✅ Good structure
interface OrderFormProps {
  orderId?: string;
  customerId?: string;
  onSuccess?: (order: Order) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  orderId,
  customerId,
  onSuccess,
}) => {
  // 1. Hooks
  const { data: order } = trpc.orders.byId.useQuery(orderId);
  const createOrder = trpc.orders.create.useMutation();
  
  // 2. State
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 3. Handlers
  const handleSubmit = async (data: CreateOrderInput) => {
    // Implementation
  };
  
  // 4. Early returns
  if (orderId && !order) return <LoadingSpinner />;
  
  // 5. Render
  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  );
};
```

### Hook Patterns

**Custom hooks for business logic:**
```typescript
// apps/web/src/orders/hooks/useOrderMutations.ts
export const useOrderMutations = () => {
  const utils = trpc.useContext();
  
  const createOrder = trpc.orders.create.useMutation({
    onSuccess: () => {
      utils.orders.list.invalidate();
      toast.success('Order created successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const updateOrder = trpc.orders.update.useMutation({
    onSuccess: () => {
      utils.orders.list.invalidate();
    },
  });
  
  return { createOrder, updateOrder };
};
```

**Hooks for complex state logic:**
```typescript
// apps/web/src/farm-layout/hooks/useCanvasEditor.ts
export const useCanvasEditor = (initialLayout?: FarmLayout) => {
  const [elements, setElements] = useState<LayoutElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [tool, setTool] = useState<CanvasTool>('select');
  
  const addElement = useCallback((element: LayoutElement) => {
    setElements(prev => [...prev, element]);
  }, []);
  
  const updateElement = useCallback((id: string, updates: Partial<LayoutElement>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  }, []);
  
  return {
    elements,
    selectedElement,
    tool,
    addElement,
    updateElement,
    setSelectedElement,
    setTool,
  };
};
```

### State Management Patterns

**Prefer React Query for server state:**
```typescript
// ✅ Good - Server state with React Query
const { data: products, isLoading } = trpc.products.list.useQuery();

// ❌ Bad - Managing server state in local state
const [products, setProducts] = useState<Product[]>([]);
const [isLoading, setIsLoading] = useState(true);
```

**Use local state for UI state:**
```typescript
// ✅ Good - UI state
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState('details');
const [formData, setFormData] = useState<FormData>({});
```

## Backend Patterns

### tRPC Procedure Structure

**Consistent procedure organization:**
```typescript
// apps/api/src/products/router.ts
export const productRouter = router({
  // Queries
  list: farmProcedure
    .input(z.object({
      page: z.number().default(1),
      pageSize: z.number().default(20),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      // 1. Input validation (handled by Zod)
      // 2. Authorization check (handled by middleware)
      // 3. Business logic
      const products = await ctx.prisma.product.findMany({
        where: {
          farmId: ctx.farmId,
          name: input.search ? {
            contains: input.search,
            mode: 'insensitive',
          } : undefined,
        },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      });
      
      // 4. Response formatting
      return {
        data: products,
        total: await ctx.prisma.product.count({
          where: { farmId: ctx.farmId },
        }),
        page: input.page,
        pageSize: input.pageSize,
      };
    }),
    
  // Mutations
  create: farmProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      // 1. Additional validation if needed
      await validateProductName(input.name, ctx.farmId);
      
      // 2. Business logic
      const product = await ctx.prisma.product.create({
        data: {
          ...input,
          farmId: ctx.farmId,
        },
      });
      
      // 3. Side effects
      await logActivity(ctx.farmId, 'PRODUCT_CREATED', product.id);
      
      return product;
    }),
});
```

### Database Query Patterns

**Organize complex queries in separate files:**
```typescript
// apps/api/src/orders/queries.ts
export const getOrdersWithItems = async (
  prisma: PrismaClient,
  farmId: string,
  filters: OrderFilters
) => {
  return prisma.order.findMany({
    where: {
      farmId,
      status: filters.status,
      createdAt: filters.dateRange ? {
        gte: filters.dateRange.start,
        lte: filters.dateRange.end,
      } : undefined,
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
          blend: {
            include: {
              ingredients: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
```

### Error Handling

**Consistent error patterns:**
```typescript
// packages/logic/src/shared/errors.ts
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

// apps/api/src/products/service.ts
export const validateProductName = async (name: string, farmId: string) => {
  const existing = await prisma.product.findFirst({
    where: { name, farmId },
  });
  
  if (existing) {
    throw new BusinessError(
      'Product name already exists',
      'DUPLICATE_PRODUCT_NAME'
    );
  }
};
```

## Formatting & Code Style

### Import Organization

**Consistent import ordering:**
```typescript
// 1. Node modules
import React, { useState, useCallback } from 'react';
import { z } from 'zod';
import { format } from 'date-fns';

// 2. Internal packages
import { Button, Input } from '@rooted/ui';
import { createOrderSchema, calculateTotal } from '@rooted/logic';

// 3. Relative imports (same feature)
import { OrderItem } from './OrderItem';
import { useOrderMutations } from '../hooks/useOrderMutations';

// 4. Type-only imports (last)
import type { Order, OrderItem as OrderItemType } from '@rooted/logic';
```

### Code Nesting & Complexity

**Prefer early returns:**
```typescript
// ✅ Good
const processOrder = async (orderId: string) => {
  const order = await getOrder(orderId);
  if (!order) return null;
  
  if (order.status !== 'PENDING') {
    throw new Error('Order is not pending');
  }
  
  const items = await getOrderItems(orderId);
  if (items.length === 0) {
    throw new Error('Order has no items');
  }
  
  return processOrderItems(items);
};

// ❌ Bad - Deep nesting
const processOrder = async (orderId: string) => {
  const order = await getOrder(orderId);
  if (order) {
    if (order.status === 'PENDING') {
      const items = await getOrderItems(orderId);
      if (items.length > 0) {
        return processOrderItems(items);
      } else {
        throw new Error('Order has no items');
      }
    } else {
      throw new Error('Order is not pending');
    }
  }
  return null;
};
```

**Maximum nesting depth: 3 levels**
```typescript
// ✅ Good - Extract complex logic
const validateOrderItems = (items: OrderItem[]) => {
  return items.every(item => isValidOrderItem(item));
};

const processOrder = (order: Order) => {
  if (!validateOrderItems(order.items)) {
    throw new Error('Invalid order items');
  }
  // Process order
};

// ❌ Bad - Too much nesting
const processOrder = (order: Order) => {
  if (order.items.length > 0) {
    for (const item of order.items) {
      if (item.quantity > 0) {
        if (item.product) {
          // Too deep!
        }
      }
    }
  }
};
```

### Prettier/ESLint Configuration

**Shared configuration in packages/config:**
```javascript
// packages/config/eslint.js
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
};

// packages/config/prettier.js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
};
```

## TailwindCSS Organization

### Component Styling Patterns

**Use Shadcn components as base:**
```typescript
// ✅ Good - Extend Shadcn components
import { Button } from '@rooted/ui';

const OrderActionButton = ({ variant = 'default', ...props }) => (
  <Button 
    variant={variant}
    className="min-w-[120px] font-medium"
    {...props}
  />
);
```

**Organize utility classes logically:**
```typescript
// ✅ Good - Logical grouping
<div className="
  flex items-center justify-between
  p-4 rounded-lg border
  bg-white shadow-sm
  hover:shadow-md transition-shadow
">
```

**Extract complex styles to CSS classes:**
```css
/* apps/web/src/styles/components.css */
.order-card {
  @apply flex flex-col p-6 bg-white rounded-lg border shadow-sm;
  @apply hover:shadow-md transition-all duration-200;
  @apply focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2;
}

.task-status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.task-status-todo {
  @apply task-status-badge bg-gray-100 text-gray-800;
}

.task-status-completed {
  @apply task-status-badge bg-green-100 text-green-800;
}
```

### Responsive Design Patterns

**Mobile-first approach:**
```typescript
// ✅ Good - Mobile first
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
```

**Consistent breakpoint usage:**
```typescript
// ✅ Good - Consistent breakpoints
const BREAKPOINTS = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
} as const;
```

This style guide ensures consistency across the monorepo while leveraging the strengths of tRPC, TypeScript, and modern React patterns.
