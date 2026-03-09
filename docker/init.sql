-- Rooted Planner Database Schema
-- Generated from Prisma migrations - keep in sync with apps/api/prisma/migrations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Tenants
-- ============================================

CREATE TABLE "tenants" (
  "id"            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name"          VARCHAR(255) NOT NULL,
  "slug"          VARCHAR(255) NOT NULL,
  "contact_email" VARCHAR(255),
  "contact_phone" VARCHAR(50),
  "settings"      JSONB,
  "created_at"    TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at"    TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- ============================================
-- Farms
-- ============================================

CREATE TABLE "farms" (
  "tenant_id"     UUID REFERENCES "tenants"("id") ON DELETE CASCADE,
  "id"            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name"          VARCHAR(255) NOT NULL,
  "slug"          VARCHAR(255) NOT NULL,
  "logo_url"      VARCHAR(500),
  "brand_color"   VARCHAR(7),
  "contact_email" VARCHAR(255),
  "contact_phone" VARCHAR(50),
  "address"       JSONB,
  "settings"      JSONB,
  "created_at"    TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at"    TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "farms_slug_key" ON "farms"("slug");
CREATE INDEX "idx_farms_tenant_id" ON "farms"("tenant_id");

-- ============================================
-- Farm Users
-- ============================================

CREATE TABLE "farm_users" (
  "id"            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant_id"     UUID REFERENCES "tenants"("id") ON DELETE CASCADE,
  "farm_id"       UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "clerk_user_id" VARCHAR(255) NOT NULL,
  "role"          VARCHAR(50) NOT NULL,
  "first_name"    VARCHAR(100),
  "last_name"     VARCHAR(100),
  "email"         VARCHAR(255),
  "is_active"     BOOLEAN DEFAULT true,
  "created_at"    TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "farm_users_clerk_user_id_key" ON "farm_users"("clerk_user_id");
CREATE INDEX "idx_farm_users_clerk_user_id" ON "farm_users"("clerk_user_id");
CREATE INDEX "idx_farm_users_farm_id" ON "farm_users"("farm_id");
CREATE INDEX "idx_farm_users_tenant_id" ON "farm_users"("tenant_id");

-- ============================================
-- Machines (IoT Devices)
-- ============================================

CREATE TABLE "machines" (
  "id"                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant_id"          UUID REFERENCES "tenants"("id") ON DELETE CASCADE,
  "farm_id"            UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "name"               VARCHAR(255) NOT NULL,
  "display_name"       VARCHAR(255),
  "device_id"          VARCHAR(255) NOT NULL,
  "created_at"         TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  "aws_iot_thing_name"      VARCHAR(255),
  "status"                  VARCHAR(50) DEFAULT 'offline',
  "last_seen_at"            TIMESTAMP(6),
  "current_wifi_ssid"       VARCHAR(255)
);

CREATE UNIQUE INDEX "machines_aws_iot_thing_name_key" ON "machines"("aws_iot_thing_name");
CREATE INDEX "idx_machines_device_id" ON "machines"("device_id");
CREATE INDEX "idx_machines_farm_id" ON "machines"("farm_id");
CREATE INDEX "idx_machines_tenant_id" ON "machines"("tenant_id");

-- ============================================
-- Machine Faults (discrete fault events in RDS)
-- ============================================

CREATE TABLE "machine_faults" (
  "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "machine_id"  UUID NOT NULL REFERENCES "machines"("id") ON DELETE CASCADE,
  "fault_type"  VARCHAR(50) NOT NULL,
  "fault_value" INTEGER NOT NULL,
  "event_code"  VARCHAR(100),
  "created_at"  TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_machine_faults_machine_id" ON "machine_faults"("machine_id");
CREATE INDEX "idx_machine_faults_created_at" ON "machine_faults"("created_at");

-- ============================================
-- Products & Production
-- ============================================

CREATE TABLE "product_categories" (
  "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "farm_id"     UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "name"        VARCHAR(255) NOT NULL,
  "description" TEXT,
  "created_at"  TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_product_categories_farm_id" ON "product_categories"("farm_id");

CREATE TABLE "products" (
  "id"                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "farm_id"            UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "category_id"        UUID REFERENCES "product_categories"("id") ON DELETE SET NULL,
  "name"               VARCHAR(255) NOT NULL,
  "sku"                VARCHAR(100),
  "days_soaking"       INTEGER NOT NULL,
  "days_germination"   INTEGER NOT NULL,
  "days_light"         INTEGER NOT NULL,
  "avg_yield_per_tray" DECIMAL(8,2),
  "seed_weight"        DECIMAL(8,2),
  "seed_unit"          VARCHAR(50),
  "unit_cost"          DECIMAL(10,2),
  "unit_price"         DECIMAL(10,2),
  "is_active"          BOOLEAN DEFAULT true,
  "created_at"         TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_products_farm_id" ON "products"("farm_id");
CREATE INDEX "idx_products_category_id" ON "products"("category_id");

CREATE TABLE "blends" (
  "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "farm_id"     UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "name"        VARCHAR(255) NOT NULL,
  "description" TEXT,
  "created_at"  TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_blends_farm_id" ON "blends"("farm_id");

CREATE TABLE "blend_ingredients" (
  "id"              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "blend_id"        UUID REFERENCES "blends"("id") ON DELETE CASCADE,
  "product_id"      UUID REFERENCES "products"("id") ON DELETE CASCADE,
  "percentage"      DECIMAL(5,2) NOT NULL,
  "timing_override" JSONB
);

CREATE INDEX "idx_blend_ingredients_blend_id" ON "blend_ingredients"("blend_id");

-- ============================================
-- Customers
-- ============================================

CREATE TABLE "customers" (
  "id"            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "farm_id"       UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "name"          VARCHAR(255) NOT NULL,
  "email"         VARCHAR(255),
  "phone"         VARCHAR(50),
  "company_name"  VARCHAR(255),
  "customer_type" VARCHAR(50),
  "payment_terms" VARCHAR(50),
  "address"       JSONB,
  "tags"          TEXT[],
  "notes"         TEXT,
  "is_active"     BOOLEAN DEFAULT true,
  "created_at"    TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_customers_farm_id" ON "customers"("farm_id");

-- ============================================
-- Orders & Order Items
-- ============================================

CREATE TABLE "orders" (
  "id"           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "farm_id"      UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "customer_id"  UUID REFERENCES "customers"("id") ON DELETE SET NULL,
  "order_number" VARCHAR(50) NOT NULL,
  "status"       VARCHAR(50) NOT NULL,
  "notes"        TEXT,
  "created_at"   TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at"   TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");
CREATE INDEX "idx_orders_farm_id" ON "orders"("farm_id");
CREATE INDEX "idx_orders_customer_id" ON "orders"("customer_id");
CREATE INDEX "idx_orders_status" ON "orders"("status");

CREATE TABLE "order_items" (
  "id"                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order_id"           UUID REFERENCES "orders"("id") ON DELETE CASCADE,
  "product_id"         UUID REFERENCES "products"("id") ON DELETE SET NULL,
  "blend_id"           UUID REFERENCES "blends"("id") ON DELETE SET NULL,
  "quantity_oz"        DECIMAL(8,2) NOT NULL,
  "harvest_date"       DATE NOT NULL,
  "overage_percent"    DECIMAL(5,2) DEFAULT 10.00,
  "trays_needed"       INTEGER,
  "soak_date"          DATE,
  "seed_date"          DATE,
  "move_to_light_date" DATE,
  "created_at"         TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_order_items_order_id" ON "order_items"("order_id");
CREATE INDEX "idx_order_items_harvest_date" ON "order_items"("harvest_date");

-- ============================================
-- Production Tasks
-- ============================================

CREATE TABLE "tasks" (
  "id"               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "farm_id"          UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "order_item_id"    UUID REFERENCES "order_items"("id") ON DELETE CASCADE,
  "title"            VARCHAR(255) NOT NULL,
  "type"             VARCHAR(50) NOT NULL,
  "due_date"         DATE NOT NULL,
  "status"           VARCHAR(50) DEFAULT 'TODO',
  "priority"         VARCHAR(50) DEFAULT 'MEDIUM',
  "completed_at"     TIMESTAMP(6),
  "completed_by"     VARCHAR(255),
  "completion_notes" TEXT,
  "actual_trays"     INTEGER,
  "seed_lot"         VARCHAR(100),
  "created_at"       TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_tasks_farm_id" ON "tasks"("farm_id");
CREATE INDEX "idx_tasks_order_item_id" ON "tasks"("order_item_id");
CREATE INDEX "idx_tasks_due_date" ON "tasks"("due_date");
CREATE INDEX "idx_tasks_status" ON "tasks"("status");
CREATE INDEX "idx_tasks_type" ON "tasks"("type");

-- ============================================
-- Farm Layout & Rack Management
-- ============================================

CREATE TABLE "farm_layouts" (
  "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "farm_id"     UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "name"        VARCHAR(255) NOT NULL,
  "canvas_data" JSONB NOT NULL,
  "is_active"   BOOLEAN DEFAULT true,
  "created_at"  TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_farm_layouts_farm_id" ON "farm_layouts"("farm_id");

CREATE TABLE "rack_assignments" (
  "id"              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "farm_id"         UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "rack_element_id" VARCHAR(255) NOT NULL,
  "level"           INTEGER NOT NULL,
  "order_item_id"   UUID REFERENCES "order_items"("id") ON DELETE SET NULL,
  "tray_count"      INTEGER NOT NULL,
  "assigned_at"     TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  "assigned_by"     VARCHAR(255),
  "is_active"       BOOLEAN DEFAULT true,
  "removed_at"      TIMESTAMP(6)
);

CREATE INDEX "idx_rack_assignments_farm_id" ON "rack_assignments"("farm_id");
CREATE INDEX "idx_rack_assignments_order_item_id" ON "rack_assignments"("order_item_id");

-- ============================================
-- Recurring Orders
-- ============================================

CREATE TABLE "recurring_order_schedules" (
  "id"             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "farm_id"        UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "customer_id"    UUID REFERENCES "customers"("id") ON DELETE CASCADE,
  "name"           VARCHAR(255) NOT NULL,
  "schedule_type"  VARCHAR(50) NOT NULL,
  "days_of_week"   INTEGER[],
  "interval_days"  INTEGER,
  "start_date"     DATE NOT NULL,
  "end_date"       DATE,
  "lead_time_days" INTEGER DEFAULT 7,
  "is_active"      BOOLEAN DEFAULT true,
  "created_at"     TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_recurring_order_schedules_farm_id" ON "recurring_order_schedules"("farm_id");
CREATE INDEX "idx_recurring_order_schedules_customer_id" ON "recurring_order_schedules"("customer_id");

-- ============================================
-- Employees
-- ============================================

CREATE TABLE "employees" (
  "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "farm_id"     UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "first_name"  VARCHAR(100) NOT NULL,
  "last_name"   VARCHAR(100) NOT NULL,
  "email"       VARCHAR(255),
  "phone"       VARCHAR(50),
  "position"    VARCHAR(100),
  "status"      VARCHAR(50) DEFAULT 'ACTIVE',
  "hire_date"   DATE,
  "hourly_rate" DECIMAL(10,2),
  "notes"       TEXT,
  "created_at"  TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_employees_farm_id" ON "employees"("farm_id");

-- ============================================
-- Supplies & Inventory
-- ============================================

CREATE TABLE "supply_categories" (
  "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "farm_id"     UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "name"        VARCHAR(255) NOT NULL,
  "description" TEXT,
  "created_at"  TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_supply_categories_farm_id" ON "supply_categories"("farm_id");

CREATE TABLE "supplies" (
  "id"            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "farm_id"       UUID REFERENCES "farms"("id") ON DELETE CASCADE,
  "category_id"   UUID REFERENCES "supply_categories"("id") ON DELETE SET NULL,
  "product_id"    UUID REFERENCES "products"("id") ON DELETE SET NULL,
  "name"          VARCHAR(255) NOT NULL,
  "sku"           VARCHAR(100),
  "current_stock" DECIMAL(10,2) DEFAULT 0,
  "unit"          VARCHAR(50),
  "reorder_level" DECIMAL(10,2),
  "created_at"    TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_supplies_farm_id" ON "supplies"("farm_id");
CREATE INDEX "idx_supplies_category_id" ON "supplies"("category_id");

CREATE TABLE "supply_purchases" (
  "id"            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "supply_id"     UUID REFERENCES "supplies"("id") ON DELETE CASCADE,
  "quantity"      DECIMAL(10,2) NOT NULL,
  "unit_cost"     DECIMAL(10,2),
  "total_cost"    DECIMAL(10,2),
  "supplier"      VARCHAR(255),
  "lot_number"    VARCHAR(100),
  "expiry_date"   DATE,
  "purchase_date" DATE NOT NULL,
  "notes"         TEXT,
  "created_at"    TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_supply_purchases_supply_id" ON "supply_purchases"("supply_id");

CREATE TABLE "supply_usage" (
  "id"         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "supply_id"  UUID REFERENCES "supplies"("id") ON DELETE CASCADE,
  "task_id"    UUID REFERENCES "tasks"("id") ON DELETE SET NULL,
  "quantity"   DECIMAL(10,2) NOT NULL,
  "usage_type" VARCHAR(50),
  "notes"      TEXT,
  "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_supply_usage_supply_id" ON "supply_usage"("supply_id");
CREATE INDEX "idx_supply_usage_task_id" ON "supply_usage"("task_id");

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE "farm_users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "blends" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "blend_ingredients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "farm_layouts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rack_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recurring_order_schedules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employees" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "supply_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "supplies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "supply_purchases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "supply_usage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "machines" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Seed Data
-- ============================================

INSERT INTO tenants (id, name, slug) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Rooted_Dev', 'rooted-dev');

INSERT INTO farms (id, tenant_id, name, slug) VALUES
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Rooted_Microgreens', 'rooted-microgreens');
