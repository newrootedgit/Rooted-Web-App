# Database Schema - Rooted Web App

Complete database schema for both Rooted Planner and Machine IoT platforms.

## Implementation Status

**✅ IMPLEMENTED & IN USE:**
- Multi-tenant architecture (tenants, farms, farm_users)
- Machine IoT tables (machines)
- Authentication and onboarding

**🚧 DEFINED BUT NOT USED:**
- All Rooted Planner tables (products, orders, tasks, customers, etc.)
- These tables exist in the schema but have no application logic yet

## Multi-Tenant Architecture ✅ **IN USE**

**Hierarchy**: `tenants` → `farms` → data tables

- **Tenant**: Top-level organization (e.g., "Rooted Farms LLC")
- **Farm**: Individual farm locations under a tenant (e.g., "Downtown Farm", "Warehouse Farm")
- Users can belong to multiple farms within a tenant (or across tenants)
- All data tables include both `tenant_id` and `farm_id` for proper isolation
- Row-level security (RLS) enforces tenant and farm boundaries

**Context Setting:**
```sql
SET app.current_tenant_id = '<tenant-uuid>';
SET app.current_farm_id = '<farm-uuid>';
```

**Note**: RLS is defined in schema but enforcement happens at application level via tRPC middleware.

---

## Tenant & Farm Management ✅ **IMPLEMENTED & IN USE**

### tenants
Top-level organization representing a business entity.

```sql
CREATE TABLE tenants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR NOT NULL,
  slug            VARCHAR UNIQUE NOT NULL,
  brand_color     VARCHAR,
  logo_url        VARCHAR,
  contact_email   VARCHAR,
  contact_phone   VARCHAR,
  address         JSONB,
  settings        JSONB,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
```

**Status**: ✅ Actively used for multi-tenancy. Created during user onboarding.

### farms
Individual farm locations under a tenant.

```sql
CREATE TABLE farms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name            VARCHAR NOT NULL,
  location        VARCHAR,
  timezone        VARCHAR DEFAULT 'America/Los_Angeles',
  settings        JSONB,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_farms_tenant_id ON farms(tenant_id);
CREATE UNIQUE INDEX idx_farms_tenant_name ON farms(tenant_id, name);
```

**Status**: ✅ Actively used. Created during user onboarding. Users can switch between farms.

### farm_users
User-farm relationship with role-based access control.

```sql
CREATE TABLE farm_users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  clerk_user_id   VARCHAR NOT NULL,
  role            VARCHAR NOT NULL, -- OWNER, ADMIN, FARM_MANAGER, FARM_OPERATOR
  first_name      VARCHAR,
  last_name       VARCHAR,
  email           VARCHAR,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_farm_users_tenant_id ON farm_users(tenant_id);
CREATE INDEX idx_farm_users_farm_id ON farm_users(farm_id);
CREATE INDEX idx_farm_users_clerk_id ON farm_users(clerk_user_id);
CREATE UNIQUE INDEX idx_farm_users_unique ON farm_users(clerk_user_id, farm_id);

-- Note: Users can belong to multiple farms, so no unique constraint on clerk_user_id alone
```

**Status**: ✅ Actively used. Links Clerk users to farms with roles. Created during onboarding.

---

## Machine IoT Platform ✅ **IMPLEMENTED & IN USE**

### machines
Raspberry Pi IoT devices for farm automation and monitoring.

```sql
CREATE TABLE machines (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id           UUID REFERENCES farms(id) ON DELETE CASCADE,
  onboarded_by      VARCHAR NOT NULL, -- Clerk user ID who onboarded
  name              VARCHAR NOT NULL, -- Device name from BLE (e.g., "Germination Room 1")
  aws_iot_thing_name VARCHAR UNIQUE, -- AWS IoT Core thing name
  status            VARCHAR DEFAULT 'offline', -- 'online' | 'offline'
  wifi_configured   BOOLEAN DEFAULT false,
  last_seen_at      TIMESTAMP,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_machines_farm_name ON machines(tenant_id, farm_id, name);
CREATE INDEX idx_machines_tenant_id ON machines(tenant_id);
CREATE INDEX idx_machines_farm_id ON machines(farm_id);
CREATE INDEX idx_machines_status ON machines(tenant_id, farm_id, status);
CREATE INDEX idx_machines_aws_thing ON machines(aws_iot_thing_name);

-- Row-level security
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;

CREATE POLICY machines_isolation ON machines
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid AND
    farm_id = current_setting('app.current_farm_id')::uuid
  );
```

**Status**: ✅ Fully implemented and actively used. Machines are onboarded via BLE, registered with AWS IoT Core, and monitored for connectivity.

**Notes:**
- `name` comes from BLE device name during onboarding
- `aws_iot_thing_name` is set after successful WiFi provisioning and AWS IoT registration
- `status` is updated via periodic AWS IoT Core connectivity checks (Lambda function)
- Unique constraint on `(tenant_id, farm_id, name)` prevents duplicate machine names per farm
- Both `tenant_id` and `farm_id` required for proper multi-tenant isolation
- RLS policy defined but enforcement happens at application level via tRPC middleware

---

## Rooted Planner Platform 🚧 **DEFINED BUT NOT USED**

**All tables below are defined in the Prisma schema but have NO application logic implemented yet.**

### product_categories
Categorization for microgreen varieties.

```sql
CREATE TABLE product_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  name            VARCHAR NOT NULL,
  description     TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_categories_tenant_id ON product_categories(tenant_id);
CREATE INDEX idx_product_categories_farm_id ON product_categories(farm_id);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY product_categories_isolation ON product_categories
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid AND
    farm_id = current_setting('app.current_farm_id')::uuid
  );
```

### products
Microgreen varieties with production timing parameters.

```sql
CREATE TABLE products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id             UUID REFERENCES farms(id) ON DELETE CASCADE,
  category_id         UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  name                VARCHAR NOT NULL,
  sku                 VARCHAR,
  days_soaking        INTEGER NOT NULL,
  days_germination    INTEGER NOT NULL,
  days_light          INTEGER NOT NULL,
  avg_yield_per_tray  DECIMAL(8,2),
  seed_weight         DECIMAL(8,2),
  seed_unit           VARCHAR,
  unit_cost           DECIMAL(10,2),
  unit_price          DECIMAL(10,2),
  is_active           BOOLEAN DEFAULT true,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_products_farm_id ON products(farm_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(tenant_id, farm_id, is_active);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY products_isolation ON products
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid AND
    farm_id = current_setting('app.current_farm_id')::uuid
  );
```

### blends
Composite products made from multiple microgreen varieties.

```sql
CREATE TABLE blends (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  name            VARCHAR NOT NULL,
  description     TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blends_tenant_id ON blends(tenant_id);
CREATE INDEX idx_blends_farm_id ON blends(farm_id);

ALTER TABLE blends ENABLE ROW LEVEL SECURITY;
CREATE POLICY blends_isolation ON blends
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid AND
    farm_id = current_setting('app.current_farm_id')::uuid
  );
```

### blend_ingredients
Product composition for blends.

```sql
CREATE TABLE blend_ingredients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blend_id        UUID REFERENCES blends(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES products(id) ON DELETE CASCADE,
  percentage      DECIMAL(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  timing_override JSONB, -- Optional timing overrides for this ingredient
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blend_ingredients_blend ON blend_ingredients(blend_id);
CREATE INDEX idx_blend_ingredients_product ON blend_ingredients(product_id);
```

### customers
CRM for wholesale and retail customers.

```sql
CREATE TABLE customers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  name            VARCHAR NOT NULL,
  email           VARCHAR,
  phone           VARCHAR,
  company_name    VARCHAR,
  customer_type   VARCHAR, -- Retail, Wholesale, Restaurant, etc.
  payment_terms   VARCHAR, -- Due on Receipt, Net 7/15/30/60
  address         JSONB,
  tags            TEXT[],
  notes           TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX idx_customers_farm_id ON customers(farm_id);
CREATE INDEX idx_customers_active ON customers(tenant_id, farm_id, is_active);
CREATE INDEX idx_customers_type ON customers(tenant_id, farm_id, customer_type);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY customers_isolation ON customers
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid AND
    farm_id = current_setting('app.current_farm_id')::uuid
  );
```

### orders
Customer orders with production tracking.

```sql
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_number    VARCHAR UNIQUE NOT NULL,
  status          VARCHAR NOT NULL DEFAULT 'Pending', -- Pending, In Progress, Ready, Delivered, Cancelled
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_orders_farm_id ON orders(farm_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(tenant_id, farm_id, status);
CREATE UNIQUE INDEX idx_orders_number ON orders(order_number);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY orders_isolation ON orders
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid AND
    farm_id = current_setting('app.current_farm_id')::uuid
  );
```

### order_items
Individual line items with production scheduling.

```sql
CREATE TABLE order_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id          UUID REFERENCES products(id) ON DELETE SET NULL,
  blend_id            UUID REFERENCES blends(id) ON DELETE SET NULL,
  quantity_oz         DECIMAL(8,2) NOT NULL,
  harvest_date        DATE NOT NULL,
  overage_percent     DECIMAL(5,2) DEFAULT 10.00,
  trays_needed        INTEGER,
  soak_date           DATE,
  seed_date           DATE,
  move_to_light_date  DATE,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT order_item_product_or_blend CHECK (
    (product_id IS NOT NULL AND blend_id IS NULL) OR
    (product_id IS NULL AND blend_id IS NOT NULL)
  )
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_order_items_blend ON order_items(blend_id);
CREATE INDEX idx_order_items_harvest_date ON order_items(harvest_date);
```

### tasks
Production workflow tasks auto-generated from orders.

```sql
CREATE TABLE tasks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id           UUID REFERENCES farms(id) ON DELETE CASCADE,
  order_item_id     UUID REFERENCES order_items(id) ON DELETE CASCADE,
  title             VARCHAR NOT NULL,
  type              VARCHAR NOT NULL, -- SOAK, SEED, MOVE_TO_LIGHT, HARVEST
  due_date          DATE NOT NULL,
  status            VARCHAR DEFAULT 'TODO', -- TODO, IN_PROGRESS, COMPLETED, CANCELLED
  priority          VARCHAR DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
  completed_at      TIMESTAMP,
  completed_by      VARCHAR, -- Clerk user ID
  completion_notes  TEXT,
  actual_trays      INTEGER,
  seed_lot          VARCHAR,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX idx_tasks_farm_id ON tasks(farm_id);
CREATE INDEX idx_tasks_order_item ON tasks(order_item_id);
CREATE INDEX idx_tasks_due_date ON tasks(tenant_id, farm_id, due_date);
CREATE INDEX idx_tasks_status ON tasks(tenant_id, farm_id, status);
CREATE INDEX idx_tasks_type ON tasks(tenant_id, farm_id, type);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tasks_isolation ON tasks
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid AND
    farm_id = current_setting('app.current_farm_id')::uuid
  );
```

### farm_layouts
Visual farm/grow room layout configurations.

```sql
CREATE TABLE farm_layouts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  name            VARCHAR NOT NULL,
  canvas_data     JSONB NOT NULL, -- Canvas dimensions, elements, racks, etc.
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_farm_layouts_tenant_id ON farm_layouts(tenant_id);
CREATE INDEX idx_farm_layouts_farm_id ON farm_layouts(farm_id);
CREATE INDEX idx_farm_layouts_active ON farm_layouts(tenant_id, farm_id, is_active);

ALTER TABLE farm_layouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY farm_layouts_isolation ON farm_layouts
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid AND
    farm_id = current_setting('app.current_farm_id')::uuid
  );
```

### rack_assignments
Track tray locations during grow phase.

```sql
CREATE TABLE rack_assignments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  rack_element_id VARCHAR NOT NULL, -- Reference to layout element ID
  level           INTEGER NOT NULL,
  order_item_id   UUID REFERENCES order_items(id) ON DELETE CASCADE,
  tray_count      INTEGER NOT NULL,
  assigned_at     TIMESTAMP DEFAULT NOW(),
  assigned_by     VARCHAR, -- Clerk user ID
  is_active       BOOLEAN DEFAULT true,
  removed_at      TIMESTAMP,
  removed_by      VARCHAR -- Clerk user ID
);

CREATE INDEX idx_rack_assignments_tenant_id ON rack_assignments(tenant_id);
CREATE INDEX idx_rack_assignments_farm_id ON rack_assignments(farm_id);
CREATE INDEX idx_rack_assignments_order_item ON rack_assignments(order_item_id);
CREATE INDEX idx_rack_assignments_active ON rack_assignments(tenant_id, farm_id, is_active);

ALTER TABLE rack_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY rack_assignments_isolation ON rack_assignments
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid AND
    farm_id = current_setting('app.current_farm_id')::uuid
  );
```

### recurring_order_schedules
Automated recurring customer orders.

```sql
CREATE TABLE recurring_order_schedules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id) ON DELETE CASCADE,
  name            VARCHAR NOT NULL,
  schedule_type   VARCHAR NOT NULL, -- FIXED_DAY, INTERVAL
  days_of_week    INTEGER[], -- For FIXED_DAY: [1,3,5] = Mon,Wed,Fri (1=Monday)
  interval_days   INTEGER, -- For INTERVAL: every N days
  start_date      DATE NOT NULL,
  end_date        DATE,
  lead_time_days  INTEGER DEFAULT 7,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recurring_schedules_tenant_id ON recurring_order_schedules(tenant_id);
CREATE INDEX idx_recurring_schedules_farm_id ON recurring_order_schedules(farm_id);
CREATE INDEX idx_recurring_schedules_customer ON recurring_order_schedules(customer_id);
CREATE INDEX idx_recurring_schedules_active ON recurring_order_schedules(tenant_id, farm_id, is_active);

ALTER TABLE recurring_order_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY recurring_schedules_isolation ON recurring_order_schedules
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid AND
    farm_id = current_setting('app.current_farm_id')::uuid
  );
```

### recurring_order_items
Line items template for recurring orders.

```sql
CREATE TABLE recurring_order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id     UUID REFERENCES recurring_order_schedules(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES products(id) ON DELETE SET NULL,
  blend_id        UUID REFERENCES blends(id) ON DELETE SET NULL,
  quantity_oz     DECIMAL(8,2) NOT NULL,
  overage_percent DECIMAL(5,2) DEFAULT 10.00,
  created_at      TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT recurring_item_product_or_blend CHECK (
    (product_id IS NOT NULL AND blend_id IS NULL) OR
    (product_id IS NULL AND blend_id IS NOT NULL)
  )
);

CREATE INDEX idx_recurring_items_schedule ON recurring_order_items(schedule_id);
CREATE INDEX idx_recurring_items_product ON recurring_order_items(product_id);
CREATE INDEX idx_recurring_items_blend ON recurring_order_items(blend_id);
```

### supplies
Inventory tracking for seeds and materials.

```sql
CREATE TABLE supplies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  name            VARCHAR NOT NULL,
  category        VARCHAR, -- Seeds, Trays, Growing Medium, etc.
  quantity        DECIMAL(10,2),
  unit            VARCHAR,
  reorder_level   DECIMAL(10,2),
  unit_cost       DECIMAL(10,2),
  supplier        VARCHAR,
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_supplies_tenant_id ON supplies(tenant_id);
CREATE INDEX idx_supplies_farm_id ON supplies(farm_id);
CREATE INDEX idx_supplies_category ON supplies(tenant_id, farm_id, category);

ALTER TABLE supplies ENABLE ROW LEVEL SECURITY;
CREATE POLICY supplies_isolation ON supplies
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid AND
    farm_id = current_setting('app.current_farm_id')::uuid
  );
```

---

## Key Relationships

### Tenant Hierarchy
- `tenants` (top level)
  - `farms` (multiple farms per tenant)
    - `farm_users` (users can access multiple farms)
    - All data tables (scoped to tenant + farm)

### Machine IoT
- `machines.tenant_id` + `machines.farm_id` → multi-tenant isolation
- `machines.onboarded_by` → Clerk user ID (audit trail)
- `machines.aws_iot_thing_name` → AWS IoT Core integration

### Rooted Planner
- `products` → `order_items` (what to grow)
- `order_items` → `tasks` (production steps)
- `tasks` → `rack_assignments` (where it's growing)
- `recurring_order_schedules` → `orders` (automated generation)
- `blends` → `products` via `blend_ingredients` (composite products)

---

## Row-Level Security (RLS)

All tenant-scoped tables have RLS enabled with policies that filter by both `tenant_id` AND `farm_id`. The application sets the current context via:

```sql
SET app.current_tenant_id = '<tenant-uuid>';
SET app.current_farm_id = '<farm-uuid>';
```

This is automatically handled by the tRPC context middleware after validating the user's JWT from Clerk and determining which farm they're currently accessing.

---

## Indexes Summary

All tables include:
- Primary key index (automatic)
- `tenant_id` index for tenant filtering
- `farm_id` index for farm filtering
- Foreign key indexes for join performance
- Status/active flags for common queries
- Date fields for timeline queries
- Composite indexes on `(tenant_id, farm_id, ...)` for optimal query performance

---

## Data Types

- **UUID**: All primary keys and foreign keys
- **VARCHAR**: Text fields with reasonable length limits
- **TEXT**: Unlimited text (notes, descriptions)
- **JSONB**: Structured data (addresses, settings, canvas data)
- **DECIMAL**: Precise numeric values (money, quantities)
- **INTEGER**: Counts and whole numbers
- **BOOLEAN**: Flags and toggles
- **TIMESTAMP**: Audit trails and scheduling
- **DATE**: Production scheduling
- **TEXT[]**: Arrays for tags and multi-select fields
- **INTEGER[]**: Arrays for day-of-week selections

---

## Notes

1. **Multi-tenancy**: Every data table includes both `tenant_id` and `farm_id` with RLS policies
2. **User Access**: Users can belong to multiple farms (even across tenants) via `farm_users` table
3. **Soft Deletes**: Consider adding `deleted_at` columns for audit requirements
4. **Audit Trails**: User IDs stored as Clerk user IDs (VARCHAR) for traceability
5. **Cascading**: Most foreign keys use `ON DELETE CASCADE` or `ON DELETE SET NULL` appropriately
6. **Constraints**: Check constraints ensure data integrity (e.g., product XOR blend in order items)
7. **Machine Integration**: Machines table follows same multi-tenant pattern as planner tables
8. **Context Switching**: Frontend must allow users to switch between farms they have access to

## Implementation Status Summary

### ✅ Fully Implemented & In Use
- `tenants` - Multi-tenant organization structure
- `farms` - Farm locations under tenants
- `farm_users` - User-farm relationships with roles
- `machines` - IoT device registry with AWS IoT Core integration

### 🚧 Defined But Not Used (Rooted Planner)
All Rooted Planner tables are defined in the Prisma schema but have no application logic:
- `product_categories`, `products`, `blends`, `blend_ingredients`
- `customers`
- `orders`, `order_items`
- `tasks`
- `farm_layouts`, `rack_assignments`
- `recurring_order_schedules`, `recurring_order_items`
- `supplies`

**Next Steps**: Implement Rooted Planner domain logic to utilize these tables. Start with products, then orders, then tasks.
