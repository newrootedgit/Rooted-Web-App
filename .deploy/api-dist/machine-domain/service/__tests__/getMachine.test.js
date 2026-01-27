import { describe, it, expect, beforeEach } from 'vitest';
import { TRPCError } from '@trpc/server';
import { getMachine } from '../getMachine.js';
import { createMockPrisma, createMockDbMachine } from '../../../test/mockPrisma.js';
describe('getMachine', () => {
    let mockPrisma;
    beforeEach(() => {
        mockPrisma = createMockPrisma();
    });
    it('should return machine when found', async () => {
        const dbMachine = createMockDbMachine({
            id: 'machine-uuid',
            tenant_id: 'tenant-1',
            farm_id: 'farm-1',
            name: 'Test Machine',
            device_id: 'dev-123',
        });
        mockPrisma.machines.findFirst.mockResolvedValue(dbMachine);
        const result = await getMachine(mockPrisma, 'machine-uuid', 'tenant-1', 'farm-1');
        expect(result).toEqual({
            id: 'machine-uuid',
            tenantId: 'tenant-1',
            farmId: 'farm-1',
            name: 'Test Machine',
            deviceId: 'dev-123',
            createdAt: dbMachine.created_at,
        });
    });
    it('should throw NOT_FOUND error when machine does not exist', async () => {
        mockPrisma.machines.findFirst.mockResolvedValue(null);
        await expect(getMachine(mockPrisma, 'non-existent-id', 'tenant-1', 'farm-1')).rejects.toThrow(TRPCError);
        try {
            await getMachine(mockPrisma, 'non-existent-id', 'tenant-1', 'farm-1');
        }
        catch (error) {
            expect(error).toBeInstanceOf(TRPCError);
            expect(error.code).toBe('NOT_FOUND');
            expect(error.message).toBe('Machine not found');
        }
    });
    it('should query with correct tenant and farm filters', async () => {
        mockPrisma.machines.findFirst.mockResolvedValue(null);
        try {
            await getMachine(mockPrisma, 'machine-id', 'tenant-abc', 'farm-xyz');
        }
        catch {
            // Expected to throw
        }
        expect(mockPrisma.machines.findFirst).toHaveBeenCalledWith({
            where: {
                id: 'machine-id',
                tenant_id: 'tenant-abc',
                farm_id: 'farm-xyz',
            },
        });
    });
});
//# sourceMappingURL=getMachine.test.js.map