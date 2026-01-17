-- Rooted Planner Database Schema
-- Auto-generated init script for PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Tenants (Top-level Organizations)
-- ============================================

CREATE TABLE tenants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) UNIQUE NOT NULL,
  contact_email   VARCHAR(255),
  contact_phone   VARCHAR(50),
  settings        JSONB,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Farms & User Management
-- ============================================

CREATE TABLE farms (
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) UNIQUE NOT NULL,
  logo_url        VARCHAR(500),
  brand_color     VARCHAR(7),
  contact_email   VARCHAR(255),
  contact_phone   VARCHAR(50),
  address         JSONB,
  settings        JSONB,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_farms_tenant_id ON farms(tenant_id);

CREATE TABLE farm_users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  clerk_user_id   VARCHAR(255) UNIQUE NOT NULL,
  role            VARCHAR(50) NOT NULL, -- OWNER, ADMIN, FARM_MANAGER, FARM_OPERATOR
  first_name      VARCHAR(100),
  last_name       VARCHAR(100),
  email           VARCHAR(255),
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_farm_users_tenant_id ON farm_users(tenant_id);
CREATE INDEX idx_farm_users_farm_id ON farm_users(farm_id);
CREATE INDEX idx_farm_users_clerk_user_id ON farm_users(clerk_user_id);

-- ============================================
-- Products & Production
-- ============================================

CREATE TABLE product_categories (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_categories_farm_id ON product_categories(farm_id);

CREATE TABLE products (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id             UUID REFERENCES farms(id) ON DELETE CASCADE,
  category_id         UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  name                VARCHAR(255) NOT NULL,
  sku                 VARCHAR(100),
  days_soaking        INTEGER NOT NULL,
  days_germination    INTEGER NOT NULL,
  days_light          INTEGER NOT NULL,
  avg_yield_per_tray  DECIMAL(8,2),
  seed_weight         DECIMAL(8,2),
  seed_unit           VARCHAR(50),
  unit_cost           DECIMAL(10,2),
  unit_price          DECIMAL(10,2),
  is_active           BOOLEAN DEFAULT true,
  created_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_farm_id ON products(farm_id);
CREATE INDEX idx_products_category_id ON products(category_id);

CREATE TABLE blends (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blends_farm_id ON blends(farm_id);

CREATE TABLE blend_ingredients (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blend_id        UUID REFERENCES blends(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES products(id) ON DELETE CASCADE,
  percentage      DECIMAL(5,2) NOT NULL, -- 0.00 to 100.00
  timing_override JSONB
);

CREATE INDEX idx_blend_ingredients_blend_id ON blend_ingredients(blend_id);

-- ============================================
-- Customers
-- ============================================

CREATE TABLE customers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  email           VARCHAR(255),
  phone           VARCHAR(50),
  company_name    VARCHAR(255),
  customer_type   VARCHAR(50), -- Retail, Wholesale, Restaurant, etc.
  payment_terms   VARCHAR(50), -- Due on Receipt, Net 7/15/30/60
  address         JSONB,
  tags            TEXT[],
  notes           TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_farm_id ON customers(farm_id);

-- ============================================
-- Orders & Order Items
-- ============================================

CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_number    VARCHAR(50) UNIQUE NOT NULL,
  status          VARCHAR(50) NOT NULL, -- Pending, In Progress, Ready, Delivered, Cancelled
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_farm_id ON orders(farm_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_items (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  created_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_harvest_date ON order_items(harvest_date);

-- ============================================
-- Production Tasks
-- ============================================

CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  order_item_id   UUID REFERENCES order_items(id) ON DELETE CASCADE,
  title           VARCHAR(255) NOT NULL,
  type            VARCHAR(50) NOT NULL, -- SOAK, SEED, MOVE_TO_LIGHT, HARVEST
  due_date        DATE NOT NULL,
  status          VARCHAR(50) DEFAULT 'TODO', -- TODO, IN_PROGRESS, COMPLETED, CANCELLED
  priority        VARCHAR(50) DEFAULT 'MEDIUM',
  completed_at    TIMESTAMP,
  completed_by    VARCHAR(255),
  completion_notes TEXT,
  actual_trays    INTEGER,
  seed_lot        VARCHAR(100),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_farm_id ON tasks(farm_id);
CREATE INDEX idx_tasks_order_item_id ON tasks(order_item_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_type ON tasks(type);

-- ============================================
-- Farm Layout & Rack Management
-- ============================================

CREATE TABLE farm_layouts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  canvas_data     JSONB NOT NULL,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_farm_layouts_farm_id ON farm_layouts(farm_id);

CREATE TABLE rack_assignments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  rack_element_id VARCHAR(255) NOT NULL,
  level           INTEGER NOT NULL,
  order_item_id   UUID REFERENCES order_items(id) ON DELETE SET NULL,
  tray_count      INTEGER NOT NULL,
  assigned_at     TIMESTAMP DEFAULT NOW(),
  assigned_by     VARCHAR(255),
  is_active       BOOLEAN DEFAULT true,
  removed_at      TIMESTAMP
);

CREATE INDEX idx_rack_assignments_farm_id ON rack_assignments(farm_id);
CREATE INDEX idx_rack_assignments_order_item_id ON rack_assignments(order_item_id);

-- ============================================
-- Recurring Orders
-- ============================================

CREATE TABLE recurring_order_schedules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  schedule_type   VARCHAR(50) NOT NULL, -- FIXED_DAY, INTERVAL
  days_of_week    INTEGER[], -- For FIXED_DAY: [1,3,5] = Mon,Wed,Fri
  interval_days   INTEGER, -- For INTERVAL: every N days
  start_date      DATE NOT NULL,
  end_date        DATE,
  lead_time_days  INTEGER DEFAULT 7,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recurring_order_schedules_farm_id ON recurring_order_schedules(farm_id);
CREATE INDEX idx_recurring_order_schedules_customer_id ON recurring_order_schedules(customer_id);

-- ============================================
-- Employees
-- ============================================

CREATE TABLE employees (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  email           VARCHAR(255),
  phone           VARCHAR(50),
  position        VARCHAR(100), -- Admin, Farm Manager, Salesperson, Farm Operator
  status          VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, ON_LEAVE, TERMINATED
  hire_date       DATE,
  hourly_rate     DECIMAL(10,2),
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_employees_farm_id ON employees(farm_id);

-- ============================================
-- Machines (IoT Devices)
-- ============================================

CREATE TABLE machines (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  device_id       VARCHAR(255) NOT NULL,  -- BLE device ID
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_machines_tenant_id ON machines(tenant_id);
CREATE INDEX idx_machines_farm_id ON machines(farm_id);
CREATE INDEX idx_machines_device_id ON machines(device_id);

-- ============================================
-- Supplies & Inventory
-- ============================================

CREATE TABLE supply_categories (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_supply_categories_farm_id ON supply_categories(farm_id);

CREATE TABLE supplies (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id         UUID REFERENCES farms(id) ON DELETE CASCADE,
  category_id     UUID REFERENCES supply_categories(id) ON DELETE SET NULL,
  product_id      UUID REFERENCES products(id) ON DELETE SET NULL, -- For seeds linked to products
  name            VARCHAR(255) NOT NULL,
  sku             VARCHAR(100),
  current_stock   DECIMAL(10,2) DEFAULT 0,
  unit            VARCHAR(50), -- oz, lb, kg, units, etc.
  reorder_level   DECIMAL(10,2),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_supplies_farm_id ON supplies(farm_id);
CREATE INDEX idx_supplies_category_id ON supplies(category_id);

CREATE TABLE supply_purchases (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supply_id       UUID REFERENCES supplies(id) ON DELETE CASCADE,
  quantity        DECIMAL(10,2) NOT NULL,
  unit_cost       DECIMAL(10,2),
  total_cost      DECIMAL(10,2),
  supplier        VARCHAR(255),
  lot_number      VARCHAR(100),
  expiry_date     DATE,
  purchase_date   DATE NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_supply_purchases_supply_id ON supply_purchases(supply_id);

CREATE TABLE supply_usage (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supply_id       UUID REFERENCES supplies(id) ON DELETE CASCADE,
  task_id         UUID REFERENCES tasks(id) ON DELETE SET NULL,
  quantity        DECIMAL(10,2) NOT NULL,
  usage_type      VARCHAR(50), -- PRODUCTION, WASTE, ADJUSTMENT
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_supply_usage_supply_id ON supply_usage(supply_id);
CREATE INDEX idx_supply_usage_task_id ON supply_usage(task_id);

-- ============================================
-- Row Level Security Policies (for multi-tenant)
-- ============================================

-- Enable RLS on all tenant tables
ALTER TABLE farm_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blends ENABLE ROW LEVEL SECURITY;
ALTER TABLE blend_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rack_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_order_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies will be created by the application based on the current user's tenant_id/farm_id
-- Example policy (to be applied per-table):
-- CREATE POLICY farm_isolation ON products
--   USING (farm_id = current_setting('app.current_farm_id')::uuid);


INSERT INTO tenants (id, name, slug) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Rooted_Dev', 'rooted-dev');

INSERT INTO farms (id, tenant_id, name, slug) VALUES 
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Rooted_Microgreens', 'rooted-microgreens');