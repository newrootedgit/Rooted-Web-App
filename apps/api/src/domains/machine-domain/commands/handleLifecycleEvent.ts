import type { PrismaClient } from '../../../generated/prisma/client.js';

interface LifecycleEventInput {
  deviceId: string;
  eventType: 'connected' | 'disconnected';
  timestamp: string;
  sessionId?: string;
  wifiSsid?: string;
}

export async function handleLifecycleEvent(
  prisma: PrismaClient,
  input: LifecycleEventInput
): Promise<void> {
  const machine = await prisma.machines.findFirst({
    where: { device_id: input.deviceId },
  });

  if (!machine) {
    throw new Error(`Machine not found: ${input.deviceId}`);
  }

  await prisma.machines.update({
    where: { id: machine.id },
    data: {
      status: input.eventType === 'connected' ? 'online' : 'offline',
      last_seen_at: new Date(input.timestamp)
    },
  });
}
