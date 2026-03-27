-- Planner Priority 1 parity schema changes

ALTER TABLE "order_items"
  ADD COLUMN "sku_id" UUID,
  ADD COLUMN "quantity_units" INTEGER;

ALTER TABLE "orders"
  ADD COLUMN "recurring_schedule_id" UUID,
  ADD COLUMN "recurring_generation_date" DATE;

ALTER TABLE "rack_assignments"
  ADD COLUMN "task_id" UUID;

ALTER TABLE "recurring_order_schedules"
  ADD COLUMN "notes" TEXT,
  ADD COLUMN "last_generated_at" TIMESTAMP(6);

ALTER TABLE "tasks"
  ADD COLUMN "blend_ingredient_id" UUID,
  ADD COLUMN "completed_by_employee_id" UUID,
  ADD COLUMN "actual_yield_oz" DECIMAL(8,2);

CREATE TABLE "package_types" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "farm_id" UUID,
  "name" VARCHAR(255) NOT NULL,
  "code" VARCHAR(50),
  "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "package_types_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "skus" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "farm_id" UUID,
  "product_id" UUID,
  "blend_id" UUID,
  "code" VARCHAR(100) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "weight_oz" DECIMAL(8,2) NOT NULL,
  "price" DECIMAL(10,2),
  "package_type_id" UUID,
  "sales_channel" VARCHAR(50) NOT NULL DEFAULT 'BOTH',
  "is_available" BOOLEAN DEFAULT true,
  "is_public" BOOLEAN DEFAULT false,
  "stock_quantity" INTEGER DEFAULT 0,
  "low_stock_threshold" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "skus_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "skus_code_key" ON "skus"("code");
CREATE INDEX "idx_package_types_farm_id" ON "package_types"("farm_id");
CREATE INDEX "idx_skus_farm_id" ON "skus"("farm_id");
CREATE INDEX "idx_skus_product_id" ON "skus"("product_id");
CREATE INDEX "idx_skus_blend_id" ON "skus"("blend_id");
CREATE INDEX "idx_skus_package_type_id" ON "skus"("package_type_id");

CREATE TABLE "recurring_order_schedule_items" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "farm_id" UUID,
  "schedule_id" UUID NOT NULL,
  "product_id" UUID,
  "blend_id" UUID,
  "quantity_oz" DECIMAL(8,2) NOT NULL,
  "overage_percent" DECIMAL(5,2) DEFAULT 10.00,
  "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "recurring_order_schedule_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_recurring_order_schedule_items_farm_id" ON "recurring_order_schedule_items"("farm_id");
CREATE INDEX "idx_recurring_order_schedule_items_schedule_id" ON "recurring_order_schedule_items"("schedule_id");
CREATE INDEX "idx_recurring_order_schedule_items_product_id" ON "recurring_order_schedule_items"("product_id");
CREATE INDEX "idx_recurring_order_schedule_items_blend_id" ON "recurring_order_schedule_items"("blend_id");

CREATE TABLE "recurring_order_schedule_skips" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "farm_id" UUID,
  "schedule_id" UUID NOT NULL,
  "skip_date" DATE NOT NULL,
  "reason" TEXT,
  "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "recurring_order_schedule_skips_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_recurring_order_schedule_skips_farm_id" ON "recurring_order_schedule_skips"("farm_id");
CREATE INDEX "idx_recurring_order_schedule_skips_schedule_id" ON "recurring_order_schedule_skips"("schedule_id");
CREATE UNIQUE INDEX "uq_recurring_order_schedule_skips_date" ON "recurring_order_schedule_skips"("schedule_id", "skip_date");

CREATE INDEX "idx_order_items_sku_id" ON "order_items"("sku_id");
CREATE INDEX "idx_orders_recurring_schedule_id" ON "orders"("recurring_schedule_id");
CREATE UNIQUE INDEX "uq_orders_recurring_generation" ON "orders"("recurring_schedule_id", "recurring_generation_date");
CREATE INDEX "idx_rack_assignments_task_id" ON "rack_assignments"("task_id");
CREATE INDEX "idx_tasks_blend_ingredient_id" ON "tasks"("blend_ingredient_id");
CREATE INDEX "idx_tasks_completed_by_employee_id" ON "tasks"("completed_by_employee_id");

ALTER TABLE "package_types"
  ADD CONSTRAINT "package_types_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "skus"
  ADD CONSTRAINT "skus_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT "skus_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT "skus_blend_id_fkey" FOREIGN KEY ("blend_id") REFERENCES "blends"("id") ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT "skus_package_type_id_fkey" FOREIGN KEY ("package_type_id") REFERENCES "package_types"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE "recurring_order_schedule_items"
  ADD CONSTRAINT "recurring_order_schedule_items_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT "recurring_order_schedule_items_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "recurring_order_schedules"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT "recurring_order_schedule_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT "recurring_order_schedule_items_blend_id_fkey" FOREIGN KEY ("blend_id") REFERENCES "blends"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE "recurring_order_schedule_skips"
  ADD CONSTRAINT "recurring_order_schedule_skips_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT "recurring_order_schedule_skips_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "recurring_order_schedules"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "order_items"
  ADD CONSTRAINT "order_items_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "skus"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE "orders"
  ADD CONSTRAINT "orders_recurring_schedule_id_fkey" FOREIGN KEY ("recurring_schedule_id") REFERENCES "recurring_order_schedules"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE "rack_assignments"
  ADD CONSTRAINT "rack_assignments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE "tasks"
  ADD CONSTRAINT "tasks_blend_ingredient_id_fkey" FOREIGN KEY ("blend_ingredient_id") REFERENCES "blend_ingredients"("id") ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT "tasks_completed_by_employee_id_fkey" FOREIGN KEY ("completed_by_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
