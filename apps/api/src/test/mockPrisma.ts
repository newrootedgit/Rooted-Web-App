import { vi } from 'vitest';
import type { PrismaClient } from '../generated/prisma/client.js';

export type MockPrismaClient = {
  machines: {
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

export function createMockPrisma(): MockPrismaClient {
  return {
    machines: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  };
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
