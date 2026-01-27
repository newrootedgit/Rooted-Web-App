-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "blend_ingredients" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "blend_id" UUID,
    "product_id" UUID,
    "percentage" DECIMAL(5,2) NOT NULL,
    "timing_override" JSONB,

    CONSTRAINT "blend_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blends" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "farm_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "farm_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "company_name" VARCHAR(255),
    "customer_type" VARCHAR(50),
    "payment_terms" VARCHAR(50),
    "address" JSONB,
    "tags" TEXT[],
    "notes" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "farm_id" UUID,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "position" VARCHAR(100),
    "status" VARCHAR(50) DEFAULT 'ACTIVE',
    "hire_date" DATE,
    "hourly_rate" DECIMAL(10,2),
    "notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farm_layouts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "farm_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "canvas_data" JSONB NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "farm_layouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farm_users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID,
    "farm_id" UUID,
    "clerk_user_id" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "email" VARCHAR(255),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "farm_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farms" (
    "tenant_id" UUID,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "logo_url" VARCHAR(500),
    "brand_color" VARCHAR(7),
    "contact_email" VARCHAR(255),
    "contact_phone" VARCHAR(50),
    "address" JSONB,
    "settings" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machines" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID,
    "farm_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "device_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "aws_iot_thing_name" VARCHAR(255),
    "status" VARCHAR(50) DEFAULT 'offline',
    "last_seen_at" TIMESTAMP(6),
    "current_wifi_ssid" VARCHAR(255),

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "order_id" UUID,
    "product_id" UUID,
    "blend_id" UUID,
    "quantity_oz" DECIMAL(8,2) NOT NULL,
    "harvest_date" DATE NOT NULL,
    "overage_percent" DECIMAL(5,2) DEFAULT 10.00,
    "trays_needed" INTEGER,
    "soak_date" DATE,
    "seed_date" DATE,
    "move_to_light_date" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "farm_id" UUID,
    "customer_id" UUID,
    "order_number" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "farm_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "farm_id" UUID,
    "category_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(100),
    "days_soaking" INTEGER NOT NULL,
    "days_germination" INTEGER NOT NULL,
    "days_light" INTEGER NOT NULL,
    "avg_yield_per_tray" DECIMAL(8,2),
    "seed_weight" DECIMAL(8,2),
    "seed_unit" VARCHAR(50),
    "unit_cost" DECIMAL(10,2),
    "unit_price" DECIMAL(10,2),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rack_assignments" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "farm_id" UUID,
    "rack_element_id" VARCHAR(255) NOT NULL,
    "level" INTEGER NOT NULL,
    "order_item_id" UUID,
    "tray_count" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" VARCHAR(255),
    "is_active" BOOLEAN DEFAULT true,
    "removed_at" TIMESTAMP(6),

    CONSTRAINT "rack_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurring_order_schedules" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "farm_id" UUID,
    "customer_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "schedule_type" VARCHAR(50) NOT NULL,
    "days_of_week" INTEGER[],
    "interval_days" INTEGER,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "lead_time_days" INTEGER DEFAULT 7,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recurring_order_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplies" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "farm_id" UUID,
    "category_id" UUID,
    "product_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(100),
    "current_stock" DECIMAL(10,2) DEFAULT 0,
    "unit" VARCHAR(50),
    "reorder_level" DECIMAL(10,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply_categories" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "farm_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supply_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply_purchases" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "supply_id" UUID,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit_cost" DECIMAL(10,2),
    "total_cost" DECIMAL(10,2),
    "supplier" VARCHAR(255),
    "lot_number" VARCHAR(100),
    "expiry_date" DATE,
    "purchase_date" DATE NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supply_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply_usage" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "supply_id" UUID,
    "task_id" UUID,
    "quantity" DECIMAL(10,2) NOT NULL,
    "usage_type" VARCHAR(50),
    "notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supply_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "farm_id" UUID,
    "order_item_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "due_date" DATE NOT NULL,
    "status" VARCHAR(50) DEFAULT 'TODO',
    "priority" VARCHAR(50) DEFAULT 'MEDIUM',
    "completed_at" TIMESTAMP(6),
    "completed_by" VARCHAR(255),
    "completion_notes" TEXT,
    "actual_trays" INTEGER,
    "seed_lot" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "contact_email" VARCHAR(255),
    "contact_phone" VARCHAR(50),
    "settings" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_blend_ingredients_blend_id" ON "blend_ingredients"("blend_id");

-- CreateIndex
CREATE INDEX "idx_blends_farm_id" ON "blends"("farm_id");

-- CreateIndex
CREATE INDEX "idx_customers_farm_id" ON "customers"("farm_id");

-- CreateIndex
CREATE INDEX "idx_employees_farm_id" ON "employees"("farm_id");

-- CreateIndex
CREATE INDEX "idx_farm_layouts_farm_id" ON "farm_layouts"("farm_id");

-- CreateIndex
CREATE UNIQUE INDEX "farm_users_clerk_user_id_key" ON "farm_users"("clerk_user_id");

-- CreateIndex
CREATE INDEX "idx_farm_users_clerk_user_id" ON "farm_users"("clerk_user_id");

-- CreateIndex
CREATE INDEX "idx_farm_users_farm_id" ON "farm_users"("farm_id");

-- CreateIndex
CREATE INDEX "idx_farm_users_tenant_id" ON "farm_users"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "farms_slug_key" ON "farms"("slug");

-- CreateIndex
CREATE INDEX "idx_farms_tenant_id" ON "farms"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "machines_aws_iot_thing_name_key" ON "machines"("aws_iot_thing_name");

-- CreateIndex
CREATE INDEX "idx_machines_device_id" ON "machines"("device_id");

-- CreateIndex
CREATE INDEX "idx_machines_farm_id" ON "machines"("farm_id");

-- CreateIndex
CREATE INDEX "idx_machines_tenant_id" ON "machines"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_order_items_harvest_date" ON "order_items"("harvest_date");

-- CreateIndex
CREATE INDEX "idx_order_items_order_id" ON "order_items"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "idx_orders_customer_id" ON "orders"("customer_id");

-- CreateIndex
CREATE INDEX "idx_orders_farm_id" ON "orders"("farm_id");

-- CreateIndex
CREATE INDEX "idx_orders_status" ON "orders"("status");

-- CreateIndex
CREATE INDEX "idx_product_categories_farm_id" ON "product_categories"("farm_id");

-- CreateIndex
CREATE INDEX "idx_products_category_id" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "idx_products_farm_id" ON "products"("farm_id");

-- CreateIndex
CREATE INDEX "idx_rack_assignments_farm_id" ON "rack_assignments"("farm_id");

-- CreateIndex
CREATE INDEX "idx_rack_assignments_order_item_id" ON "rack_assignments"("order_item_id");

-- CreateIndex
CREATE INDEX "idx_recurring_order_schedules_customer_id" ON "recurring_order_schedules"("customer_id");

-- CreateIndex
CREATE INDEX "idx_recurring_order_schedules_farm_id" ON "recurring_order_schedules"("farm_id");

-- CreateIndex
CREATE INDEX "idx_supplies_category_id" ON "supplies"("category_id");

-- CreateIndex
CREATE INDEX "idx_supplies_farm_id" ON "supplies"("farm_id");

-- CreateIndex
CREATE INDEX "idx_supply_categories_farm_id" ON "supply_categories"("farm_id");

-- CreateIndex
CREATE INDEX "idx_supply_purchases_supply_id" ON "supply_purchases"("supply_id");

-- CreateIndex
CREATE INDEX "idx_supply_usage_supply_id" ON "supply_usage"("supply_id");

-- CreateIndex
CREATE INDEX "idx_supply_usage_task_id" ON "supply_usage"("task_id");

-- CreateIndex
CREATE INDEX "idx_tasks_due_date" ON "tasks"("due_date");

-- CreateIndex
CREATE INDEX "idx_tasks_farm_id" ON "tasks"("farm_id");

-- CreateIndex
CREATE INDEX "idx_tasks_order_item_id" ON "tasks"("order_item_id");

-- CreateIndex
CREATE INDEX "idx_tasks_status" ON "tasks"("status");

-- CreateIndex
CREATE INDEX "idx_tasks_type" ON "tasks"("type");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- AddForeignKey
ALTER TABLE "blend_ingredients" ADD CONSTRAINT "blend_ingredients_blend_id_fkey" FOREIGN KEY ("blend_id") REFERENCES "blends"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blend_ingredients" ADD CONSTRAINT "blend_ingredients_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blends" ADD CONSTRAINT "blends_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "farm_layouts" ADD CONSTRAINT "farm_layouts_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "farm_users" ADD CONSTRAINT "farm_users_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "farm_users" ADD CONSTRAINT "farm_users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "farms" ADD CONSTRAINT "farms_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_blend_id_fkey" FOREIGN KEY ("blend_id") REFERENCES "blends"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rack_assignments" ADD CONSTRAINT "rack_assignments_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rack_assignments" ADD CONSTRAINT "rack_assignments_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recurring_order_schedules" ADD CONSTRAINT "recurring_order_schedules_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recurring_order_schedules" ADD CONSTRAINT "recurring_order_schedules_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "supplies" ADD CONSTRAINT "supplies_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "supply_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "supplies" ADD CONSTRAINT "supplies_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "supplies" ADD CONSTRAINT "supplies_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "supply_categories" ADD CONSTRAINT "supply_categories_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "supply_purchases" ADD CONSTRAINT "supply_purchases_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "supplies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "supply_usage" ADD CONSTRAINT "supply_usage_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "supplies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "supply_usage" ADD CONSTRAINT "supply_usage_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
