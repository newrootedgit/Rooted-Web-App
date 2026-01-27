import { vi } from 'vitest';
export function createMockPrisma() {
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
export function createMockDbMachine(overrides = {}) {
    return {
        id: overrides.id ?? 'machine-uuid-1',
        tenant_id: 'tenant_id' in overrides ? overrides.tenant_id : 'tenant-uuid-1',
        farm_id: 'farm_id' in overrides ? overrides.farm_id : 'farm-uuid-1',
        name: overrides.name ?? 'Test Machine',
        device_id: overrides.device_id ?? 'device-001',
        created_at: 'created_at' in overrides ? overrides.created_at : new Date('2024-01-01'),
    };
}
//# sourceMappingURL=mockPrisma.js.map