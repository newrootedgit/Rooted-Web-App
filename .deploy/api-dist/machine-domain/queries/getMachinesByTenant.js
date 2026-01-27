/**
 * Fetches machines for a tenant with optional farm filtering and pagination
 *
 * @param prisma - Prisma client
 * @param tenantId - Tenant ID (required)
 * @param farmId - Farm ID (optional, null = don't filter by farm)
 * @param options - Pagination and ordering options
 */
export async function getMachinesByTenant(prisma, tenantId, farmId, options) {
    const where = {
        tenant_id: tenantId,
    };
    if (farmId) {
        where.farm_id = farmId;
    }
    const machines = await prisma.machines.findMany({
        where,
        ...options,
    });
    return machines.map((m) => ({
        id: m.id,
        tenantId: m.tenant_id,
        farmId: m.farm_id,
        name: m.name,
        deviceId: m.device_id,
        createdAt: m.created_at,
    }));
}
//# sourceMappingURL=getMachinesByTenant.js.map