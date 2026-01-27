import { vi } from 'vitest';
export type MockPrismaClient = {
    machines: {
        findMany: ReturnType<typeof vi.fn>;
        findFirst: ReturnType<typeof vi.fn>;
        create: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
    };
};
export declare function createMockPrisma(): MockPrismaClient;
export declare function createMockDbMachine(overrides?: Partial<{
    id: string;
    tenant_id: string | null;
    farm_id: string | null;
    name: string;
    device_id: string;
    created_at: Date | null;
}>): {
    id: string;
    tenant_id: string | null | undefined;
    farm_id: string | null | undefined;
    name: string;
    device_id: string;
    created_at: Date | null | undefined;
};
//# sourceMappingURL=mockPrisma.d.ts.map