import { vi } from 'vitest';
import type { PrismaClient } from '../generated/prisma/client.js';

export type MockPrismaClient = {
  machines: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  tenants: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  farms: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  farm_users: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  products: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  product_categories: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  blends: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  blend_ingredients: {
    findMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    deleteMany: ReturnType<typeof vi.fn>;
  };
  order_items: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    deleteMany: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  customers: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  orders: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  tasks: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  farm_layouts: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  machine_telemetry: {
    create: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};

export function createMockPrisma(): MockPrismaClient {
  const mock: MockPrismaClient = {
    machines: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    tenants: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    farms: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    farm_users: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    products: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    product_categories: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    blends: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    blend_ingredients: {
      findMany: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    order_items: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    customers: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    orders: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    tasks: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    farm_layouts: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateMany: vi.fn(),
      count: vi.fn(),
    },
    machine_telemetry: {
      create: vi.fn(),
    },
    $transaction: vi.fn((opsOrCb: unknown) =>
      Array.isArray(opsOrCb) ? Promise.all(opsOrCb) : (opsOrCb as (tx: unknown) => unknown)(mock)
    ),
  };
  return mock;
}

// Helper to create a mock machine DB record
export function createMockDbMachine(overrides: Partial<{
  id: string;
  tenant_id: string | null;
  farm_id: string | null;
  name: string;
  display_name: string | null;
  device_id: string;
  status: string | null;
  last_seen_at: Date | null;
  current_wifi_ssid: string | null;
  created_at: Date | null;
  // Aggregate fields
  total_steps: bigint;
  total_uptime_ms: bigint;
  current_boot_id: bigint | null;
  current_boot_uptime_ms: bigint;
  reboot_count: number;
  belt_fault_count: number;
  blade_fault_count: number;
  last_belt_fault: number;
  last_blade_fault: number;
  machine_telemetry?: any[];
}> = {}) {
  return {
    id: overrides.id ?? 'machine-uuid-1',
    tenant_id: 'tenant_id' in overrides ? overrides.tenant_id : 'tenant-uuid-1',
    farm_id: 'farm_id' in overrides ? overrides.farm_id : 'farm-uuid-1',
    name: overrides.name ?? 'Test Machine',
    display_name: 'display_name' in overrides ? overrides.display_name : overrides.name ?? 'Test Machine',
    device_id: overrides.device_id ?? 'device-001',
    status: overrides.status ?? null,
    last_seen_at: overrides.last_seen_at ?? null,
    current_wifi_ssid: overrides.current_wifi_ssid ?? null,
    created_at: 'created_at' in overrides ? overrides.created_at : new Date('2024-01-01'),
    total_steps: overrides.total_steps ?? BigInt(0),
    total_uptime_ms: overrides.total_uptime_ms ?? BigInt(0),
    current_boot_id: 'current_boot_id' in overrides ? overrides.current_boot_id! : null,
    current_boot_uptime_ms: overrides.current_boot_uptime_ms ?? BigInt(0),
    reboot_count: overrides.reboot_count ?? 0,
    belt_fault_count: overrides.belt_fault_count ?? 0,
    blade_fault_count: overrides.blade_fault_count ?? 0,
    last_belt_fault: overrides.last_belt_fault ?? 0,
    last_blade_fault: overrides.last_blade_fault ?? 0,
    machine_telemetry: overrides.machine_telemetry ?? [],
  };
}

export function createMockDbTenant(overrides: Partial<{
  id: string;
  name: string;
  slug: string;
  contact_email: string | null;
  created_at: Date | null;
}> = {}) {
  return {
    id: overrides.id ?? 'tenant-uuid-1',
    name: overrides.name ?? 'Test Tenant',
    slug: overrides.slug ?? 'test-tenant',
    contact_email: overrides.contact_email ?? 'admin@test-tenant.com',
    created_at: overrides.created_at ?? new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };
}

export function createMockDbFarm(overrides: Partial<{
  id: string;
  tenant_id: string | null;
  name: string;
  slug: string;
  created_at: Date | null;
}> = {}) {
  return {
    id: overrides.id ?? 'farm-uuid-1',
    tenant_id: overrides.tenant_id ?? 'tenant-uuid-1',
    name: overrides.name ?? 'Test Farm',
    slug: overrides.slug ?? 'test-farm',
    created_at: overrides.created_at ?? new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };
}

export function createMockDbProduct(overrides: Partial<{
  id: string;
  farm_id: string | null;
  category_id: string | null;
  name: string;
  sku: string | null;
  days_soaking: number;
  days_germination: number;
  days_light: number;
  avg_yield_per_tray: number | null;
  seed_weight: number | null;
  seed_unit: string | null;
  unit_cost: number | null;
  unit_price: number | null;
  is_active: boolean | null;
  created_at: Date | null;
}> = {}) {
  return {
    id: overrides.id ?? 'product-uuid-1',
    farm_id: overrides.farm_id ?? 'farm-uuid-1',
    category_id: overrides.category_id ?? null,
    name: overrides.name ?? 'Sunflower',
    sku: overrides.sku ?? null,
    days_soaking: overrides.days_soaking ?? 1,
    days_germination: overrides.days_germination ?? 3,
    days_light: overrides.days_light ?? 4,
    avg_yield_per_tray: overrides.avg_yield_per_tray ?? null,
    seed_weight: overrides.seed_weight ?? null,
    seed_unit: overrides.seed_unit ?? null,
    unit_cost: overrides.unit_cost ?? null,
    unit_price: overrides.unit_price ?? null,
    is_active: overrides.is_active ?? true,
    created_at: overrides.created_at ?? new Date('2024-01-01'),
  };
}

export function createMockDbCategory(overrides: Partial<{
  id: string;
  farm_id: string | null;
  name: string;
  description: string | null;
  created_at: Date | null;
}> = {}) {
  return {
    id: overrides.id ?? 'category-uuid-1',
    farm_id: overrides.farm_id ?? 'farm-uuid-1',
    name: overrides.name ?? 'Microgreens',
    description: overrides.description ?? null,
    created_at: overrides.created_at ?? new Date('2024-01-01'),
  };
}

export function createMockDbBlend(overrides: Partial<{
  id: string;
  farm_id: string | null;
  name: string;
  description: string | null;
  created_at: Date | null;
  blend_ingredients: any[];
}> = {}) {
  return {
    id: overrides.id ?? 'blend-uuid-1',
    farm_id: overrides.farm_id ?? 'farm-uuid-1',
    name: overrides.name ?? 'Spicy Mix',
    description: overrides.description ?? null,
    created_at: overrides.created_at ?? new Date('2024-01-01'),
    blend_ingredients: overrides.blend_ingredients ?? [],
  };
}

export function createMockDbCustomer(overrides: Partial<{
  id: string;
  farm_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  customer_type: string | null;
  payment_terms: string | null;
  address: any;
  tags: string[];
  notes: string | null;
  is_active: boolean | null;
  created_at: Date | null;
}> = {}) {
  return {
    id: overrides.id ?? 'customer-uuid-1',
    farm_id: overrides.farm_id ?? 'farm-uuid-1',
    name: overrides.name ?? 'Test Customer',
    email: 'email' in overrides ? overrides.email : 'customer@test.com',
    phone: overrides.phone ?? null,
    company_name: overrides.company_name ?? null,
    customer_type: overrides.customer_type ?? 'Retail',
    payment_terms: overrides.payment_terms ?? 'Due on Receipt',
    address: overrides.address ?? null,
    tags: overrides.tags ?? [],
    notes: overrides.notes ?? null,
    is_active: overrides.is_active ?? true,
    created_at: overrides.created_at ?? new Date('2024-01-01'),
  };
}

export function createMockDbOrder(overrides: Partial<{
  id: string;
  farm_id: string | null;
  customer_id: string | null;
  order_number: string;
  status: string;
  notes: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  customers: any;
  order_items: any[];
}> = {}) {
  return {
    id: overrides.id ?? 'order-uuid-1',
    farm_id: overrides.farm_id ?? 'farm-uuid-1',
    customer_id: overrides.customer_id ?? 'customer-uuid-1',
    order_number: overrides.order_number ?? 'ORD-000001',
    status: overrides.status ?? 'Pending',
    notes: overrides.notes ?? null,
    created_at: overrides.created_at ?? new Date('2024-01-01'),
    updated_at: overrides.updated_at ?? new Date('2024-01-01'),
    customers: overrides.customers ?? null,
    order_items: overrides.order_items ?? [],
  };
}

export function createMockDbOrderItem(overrides: Partial<{
  id: string;
  order_id: string | null;
  product_id: string | null;
  blend_id: string | null;
  quantity_oz: number;
  harvest_date: Date;
  overage_percent: number | null;
  trays_needed: number | null;
  soak_date: Date | null;
  seed_date: Date | null;
  move_to_light_date: Date | null;
  created_at: Date | null;
  products: any;
  blends: any;
  tasks: any[];
}> = {}) {
  return {
    id: overrides.id ?? 'order-item-uuid-1',
    order_id: overrides.order_id ?? 'order-uuid-1',
    product_id: overrides.product_id ?? 'product-uuid-1',
    blend_id: overrides.blend_id ?? null,
    quantity_oz: overrides.quantity_oz ?? 16,
    harvest_date: overrides.harvest_date ?? new Date('2024-02-01'),
    overage_percent: overrides.overage_percent ?? 10,
    trays_needed: overrides.trays_needed ?? 2,
    soak_date: overrides.soak_date ?? new Date('2024-01-24'),
    seed_date: overrides.seed_date ?? new Date('2024-01-25'),
    move_to_light_date: overrides.move_to_light_date ?? new Date('2024-01-28'),
    created_at: overrides.created_at ?? new Date('2024-01-01'),
    products: overrides.products ?? null,
    blends: overrides.blends ?? null,
    tasks: overrides.tasks ?? [],
  };
}

export function createMockDbTask(overrides: Partial<{
  id: string;
  farm_id: string | null;
  order_item_id: string | null;
  title: string;
  type: string;
  due_date: Date;
  status: string | null;
  priority: string | null;
  completed_at: Date | null;
  completed_by: string | null;
  completion_notes: string | null;
  actual_trays: number | null;
  seed_lot: string | null;
  created_at: Date | null;
  order_items: any;
}> = {}) {
  return {
    id: overrides.id ?? 'task-uuid-1',
    farm_id: overrides.farm_id ?? 'farm-uuid-1',
    order_item_id: overrides.order_item_id ?? 'order-item-uuid-1',
    title: overrides.title ?? 'Soak - Sunflower (ORD-000001)',
    type: overrides.type ?? 'SOAK',
    due_date: overrides.due_date ?? new Date('2024-01-24'),
    status: overrides.status ?? 'TODO',
    priority: overrides.priority ?? 'MEDIUM',
    completed_at: overrides.completed_at ?? null,
    completed_by: overrides.completed_by ?? null,
    completion_notes: overrides.completion_notes ?? null,
    actual_trays: overrides.actual_trays ?? null,
    seed_lot: overrides.seed_lot ?? null,
    created_at: overrides.created_at ?? new Date('2024-01-01'),
    order_items: overrides.order_items ?? null,
  };
}

export function createMockDbFarmLayout(overrides: Partial<{
  id: string;
  farm_id: string | null;
  name: string;
  canvas_data: any;
  is_active: boolean | null;
  created_at: Date | null;
}> = {}) {
  return {
    id: overrides.id ?? 'layout-uuid-1',
    farm_id: overrides.farm_id ?? 'farm-uuid-1',
    name: overrides.name ?? 'Main Layout',
    canvas_data: overrides.canvas_data ?? { elements: [] },
    is_active: overrides.is_active ?? true,
    created_at: overrides.created_at ?? new Date('2024-01-01'),
  };
}

export function createMockDbFarmUser(overrides: Partial<{
  id: string;
  tenant_id: string | null;
  farm_id: string | null;
  clerk_user_id: string;
  role: string;
  is_active: boolean;
}> = {}) {
  return {
    id: overrides.id ?? 'farm-user-uuid-1',
    tenant_id: overrides.tenant_id ?? 'tenant-uuid-1',
    farm_id: 'farm_id' in overrides ? overrides.farm_id : 'farm-uuid-1',
    clerk_user_id: overrides.clerk_user_id ?? 'user-123',
    role: overrides.role ?? 'FARM_OWNER',
    is_active: overrides.is_active ?? true,
    first_name: 'Test',
    last_name: 'User',
    email: 'test@user.com',
    created_at: new Date('2024-01-01'),
  };
}
