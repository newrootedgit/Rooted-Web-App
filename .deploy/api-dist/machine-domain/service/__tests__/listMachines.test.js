import { describe, it, expect, beforeEach } from 'vitest';
import { listMachines } from '../listMachines.js';
import { createMockPrisma, createMockDbMachine } from '../../../test/mockPrisma.js';
describe('listMachines', () => {
    let mockPrisma;
    beforeEach(() => {
        mockPrisma = createMockPrisma();
    });
    it('should return empty paginated result when no machines exist', async () => {
        mockPrisma.machines.findMany.mockResolvedValue([]);
        const result = await listMachines(mockPrisma, 'tenant-1', 'farm-1', {});
        expect(result.items).toEqual([]);
        expect(result.hasMore).toBe(false);
        expect(result.nextCursor).toBeNull();
    });
    it('should return empty result when no tenantId', async () => {
        const result = await listMachines(mockPrisma, '', 'farm-1', {});
        expect(result.items).toEqual([]);
        expect(result.hasMore).toBe(false);
        expect(result.nextCursor).toBeNull();
        expect(mockPrisma.machines.findMany).not.toHaveBeenCalled();
    });
    it('should filter by tenant and farm when farmId provided', async () => {
        const dbMachine = createMockDbMachine({
            id: 'machine-1',
            tenant_id: 'tenant-1',
            farm_id: 'farm-1',
            name: 'Harvester',
            device_id: 'dev-001',
        });
        mockPrisma.machines.findMany.mockResolvedValue([dbMachine]);
        const result = await listMachines(mockPrisma, 'tenant-1', 'farm-1', {});
        expect(result.items).toHaveLength(1);
        expect(result.items[0]).toEqual({
            id: 'machine-1',
            tenantId: 'tenant-1',
            farmId: 'farm-1',
            name: 'Harvester',
            deviceId: 'dev-001',
            createdAt: dbMachine.created_at,
        });
        expect(mockPrisma.machines.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: {
                tenant_id: 'tenant-1',
                farm_id: 'farm-1',
            },
        }));
    });
    it('should filter by tenant only when farmId is null', async () => {
        const dbMachine = createMockDbMachine({
            id: 'machine-1',
            tenant_id: 'tenant-1',
            farm_id: 'farm-1',
            name: 'Harvester',
            device_id: 'dev-001',
        });
        mockPrisma.machines.findMany.mockResolvedValue([dbMachine]);
        const result = await listMachines(mockPrisma, 'tenant-1', null, {});
        expect(result.items).toHaveLength(1);
        expect(mockPrisma.machines.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: {
                tenant_id: 'tenant-1',
            },
        }));
    });
    it('should return multiple machines with pagination info', async () => {
        const machines = [
            createMockDbMachine({ id: 'machine-1', name: 'Machine 1' }),
            createMockDbMachine({ id: 'machine-2', name: 'Machine 2' }),
        ];
        mockPrisma.machines.findMany.mockResolvedValue(machines);
        const result = await listMachines(mockPrisma, 'tenant-uuid-1', 'farm-uuid-1', { limit: 10 });
        expect(result.items).toHaveLength(2);
        expect(result.items[0].name).toBe('Machine 1');
        expect(result.items[1].name).toBe('Machine 2');
        expect(result.hasMore).toBe(false);
    });
    it('should indicate hasMore when more results exist', async () => {
        // When limit is 2, we fetch 3 (limit + 1) to check for more
        const machines = [
            createMockDbMachine({ id: 'machine-1', name: 'Machine 1' }),
            createMockDbMachine({ id: 'machine-2', name: 'Machine 2' }),
            createMockDbMachine({ id: 'machine-3', name: 'Machine 3' }),
        ];
        mockPrisma.machines.findMany.mockResolvedValue(machines);
        const result = await listMachines(mockPrisma, 'tenant-uuid-1', 'farm-uuid-1', { limit: 2 });
        expect(result.items).toHaveLength(2);
        expect(result.hasMore).toBe(true);
        expect(result.nextCursor).toBe('machine-2');
    });
});
//# sourceMappingURL=listMachines.test.js.map