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
    $transaction: vi.fn((cb) => cb(mock)),
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
  created_at: Date | null;
}> = {}) {
  return {
    id: overrides.id ?? 'machine-uuid-1',
    tenant_id: 'tenant_id' in overrides ? overrides.tenant_id : 'tenant-uuid-1',
    farm_id: 'farm_id' in overrides ? overrides.farm_id : 'farm-uuid-1',
    name: overrides.name ?? 'Test Machine',
    display_name: 'display_name' in overrides ? overrides.display_name : overrides.name ?? 'Test Machine',
    device_id: overrides.device_id ?? 'device-001',
    created_at: 'created_at' in overrides ? overrides.created_at : new Date('2024-01-01'),
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
