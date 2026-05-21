import type { PrismaClient } from '../../../generated/prisma/client.js';

export async function listGlobalPartTypes(prisma: PrismaClient) {
  const rows = await prisma.machine_part_types.findMany({
    where: { farm_id: null },
    orderBy: [{ machine_type: 'asc' }, { name: 'asc' }],
  });

  return rows.map((row) => ({
    id: row.id,
    machineType: row.machine_type,
    name: row.name,
    metric: row.metric,
    usageSource: row.usage_source,
    defaultLifespan: row.default_lifespan,
    warningPct: row.warning_pct,
    criticalPct: row.critical_pct,
  }));
}
