export type MachineType = 'SEEDER' | 'HARVESTER' | 'OTHER';

export function getMachineType(name: string | null | undefined): MachineType {
  const upper = (name ?? '').toUpperCase();
  if (upper.startsWith('SEEDER')) return 'SEEDER';
  if (upper.startsWith('HARVESTER')) return 'HARVESTER';
  return 'OTHER';
}
