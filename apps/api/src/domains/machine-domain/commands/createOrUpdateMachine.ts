import { randomUUID } from 'node:crypto';
import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { AddMachineInput, Machine } from '../types.js';
import { findMachineByDeviceId } from '../queries/findMachineByDeviceId.js';
import { subscribeToDevice } from '../mqtt/subscriber.js';
import { publishToDevice } from '../../../lib/aws/iot-client.js';

export async function createOrUpdateMachine(
  prisma: PrismaClient,
  input: AddMachineInput,
  tenantId: string,
  farmId: string | null
): Promise<Machine> {
  const existing = await findMachineByDeviceId(prisma, input.deviceId);

  let machine;
  if (existing) {
    machine = await prisma.machines.update({
      where: { id: existing.id },
      data: {
        name: input.name,
        display_name: input.displayName ?? input.name,
        tenant_id: tenantId,
        farm_id: farmId,
        current_wifi_ssid: input.currentWifiSsid ?? null,
      },
    });
  } else {
    machine = await prisma.machines.create({
      data: {
        tenant_id: tenantId,
        farm_id: farmId,
        name: input.name,
        display_name: input.displayName ?? input.name,
        device_id: input.deviceId,
        current_wifi_ssid: input.currentWifiSsid ?? null,
      },
    });
  }

  if (machine.device_id) {
    await subscribeToDevice(machine.device_id);

    // Solicit proof of life. Status is normally set by AWS IoT presence events,
    // but a device that connected BEFORE this row existed had its "connected"
    // event dropped as unknown-device - so a freshly added machine showed
    // offline until its rooted-iot service reconnected, and onboarding a Pi
    // that was already running ALWAYS hit that. The device answers get_presets
    // on its pong topic; pongHandler marks it online (markDeviceSeen). If it is
    // genuinely offline there is no answer and no harm - the presence event
    // marks it online whenever it does connect, which now works because the
    // row exists. Fire-and-forget: onboarding must not fail because a probe
    // could not be published.
    publishToDevice(machine.device_id, {
      action: 'get_presets',
      requestId: `onboard-probe-${randomUUID()}`,
    }).catch((err) => {
      console.error('[machines] onboarding liveness probe failed for', machine.device_id, err);
    });
  }

  return {
    id: machine.id,
    tenantId: machine.tenant_id,
    farmId: machine.farm_id,
    name: machine.name,
    displayName: machine.display_name,
    deviceId: machine.device_id,
    currentWifiSsid: machine.current_wifi_ssid,
    createdAt: machine.created_at,
    awsIotThingName: machine.aws_iot_thing_name,
    status: machine.status as 'online' | 'offline' | undefined,
    lastSeenAt: machine.last_seen_at,
    isDemo: machine.is_demo ?? false,
    totalSteps: '0',
    totalUptimeMs: '0',
    currentBootUptimeMs: '0',
    rebootCount: 0,
    beltFaultCount: 0,
    bladeFaultCount: 0,
    trayCount: 0,
    lastBeltFault: 0,
    lastBladeFault: 0,
    beltMotorUptimeMs: '0',
    bladeMotorUptimeMs: '0',
  };
}
