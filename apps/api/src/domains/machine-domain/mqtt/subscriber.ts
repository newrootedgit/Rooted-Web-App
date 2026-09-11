import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { handleConfigResponse } from './machine-presets/handleConfigResponse.js';
import { handleLifecycleEvent } from './machine-lifecycle/handleLifecycleEvent.js';
import { handleTelemetry, TelemetryPayload } from './machine-telemetry/handleTelemetry.js';
import { prisma } from '../../../lib/db/index.js';

const LIFECYCLE_CONNECTED_TOPIC = '$aws/events/presence/connected/+';
const LIFECYCLE_DISCONNECTED_TOPIC = '$aws/events/presence/disconnected/+';

function pongTopicFor(deviceId: string): string {
  return `rooted/machines/${deviceId}/pong`;
}
function telemetryTopicFor(deviceId: string): string {
  return `rooted/machines/${deviceId}/telemetry`;
}

function getMqttClientId(): string {
  if (process.env.MQTT_CLIENT_ID) return process.env.MQTT_CLIENT_ID;
  const env = process.env.APP_ENV ?? 'local';
  const instance = process.env.HOSTNAME ?? String(process.pid);
  return `rooted-api-${env}-${instance}`;
}

function getCleanSession(): boolean {
  if (process.env.MQTT_CLEAN_SESSION) return process.env.MQTT_CLEAN_SESSION === 'true';
  return process.env.APP_ENV !== 'prod';
}

let connection: mqtt.MqttClientConnection | null = null;
const allowedDeviceIds = new Set<string>();

// Fixed-interval buffer: collect per-device telemetry events and flush on a timer
const TELEMETRY_FLUSH_MS = parseInt(process.env.TELEMETRY_FLUSH_MS || '30000', 10);
const telemetryBuffers = new Map<string, TelemetryPayload[]>();
let flushInterval: ReturnType<typeof setInterval> | null = null;

function bufferTelemetry(deviceId: string, payloads: TelemetryPayload[]): void {
  const buffer = telemetryBuffers.get(deviceId) ?? [];
  buffer.push(...payloads);
  telemetryBuffers.set(deviceId, buffer);
}

let flushing = false;

async function flushAllTelemetry(): Promise<void> {
  if (flushing) {
    console.warn('[MQTT] Previous flush still running, skipping this interval');
    return;
  }
  flushing = true;
  try {
    // Snapshot and clear buffer atomically to avoid re-processing
    const snapshot = new Map(telemetryBuffers);
    telemetryBuffers.clear();

    for (const [deviceId, batch] of snapshot) {
      if (batch.length > 0) {
        console.log(`[MQTT] Flushing ${batch.length} telemetry events for ${deviceId}`);
        try {
          await handleTelemetry(deviceId, batch);
        } catch (err) {
          console.error('[MQTT] Error handling telemetry:', err);
        }
      }
    }
  } finally {
    flushing = false;
  }
}

function startTelemetryFlushInterval(): void {
  if (flushInterval) return;
  console.log(`[MQTT] Telemetry flush interval: ${TELEMETRY_FLUSH_MS}ms`);
  flushInterval = setInterval(flushAllTelemetry, TELEMETRY_FLUSH_MS);
}

function stopTelemetryFlushInterval(): void {
  if (flushInterval) {
    clearInterval(flushInterval);
    flushInterval = null;
  }
  // Flush any remaining events
  flushAllTelemetry();
}

export async function startMqttSubscriber(): Promise<void> {
  const endpoint = process.env.AWS_IOT_ENDPOINT;
  const region = process.env.AWS_REGION || 'us-east-1';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    console.error('[MQTT] Missing required env vars (AWS_IOT_ENDPOINT, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)');
    return;
  }

  const host = endpoint.replace(/^https?:\/\//, '');

  const configBuilder = iot.AwsIotMqttConnectionConfigBuilder
    .new_builder_for_websocket()
    .with_endpoint(host)
    .with_credentials(region, accessKeyId, secretAccessKey)
    .with_client_id(getMqttClientId())
    .with_clean_session(getCleanSession())
    .with_keep_alive_seconds(30);

  const config = configBuilder.build();
  const client = new mqtt.MqttClient();
  connection = client.new_connection(config);

  connection.on('connect', () => {
    console.log('[MQTT] Connected to AWS IoT Core');
  });

  connection.on('disconnect', () => {
    console.log('[MQTT] Disconnected from AWS IoT Core');
  });

  connection.on('error', (error) => {
    console.error('[MQTT] Connection error:', error);
  });

  connection.on('interrupt', (error) => {
    console.warn('[MQTT] Connection interrupted:', error.message);
  });

  connection.on('resume', () => {
    console.log('[MQTT] Connection resumed');
  });

  await connection.connect();

  // Lifecycle events (connected / disconnected)
  const lifecycleHandler = (topic: string, payload: ArrayBuffer) => {
    try {
      const message = JSON.parse(new TextDecoder().decode(payload));
      console.log('[MQTT] Lifecycle event on', topic, ':', JSON.stringify(message));
      handleLifecycleEvent(message).catch((err) => {
        console.error('[MQTT] Error handling lifecycle event:', err);
      });
    } catch (err) {
      console.error('[MQTT] Error processing lifecycle message:', err);
    }
  };

  await connection.subscribe(LIFECYCLE_CONNECTED_TOPIC, mqtt.QoS.AtLeastOnce, lifecycleHandler);
  console.log('[MQTT] Subscribed to', LIFECYCLE_CONNECTED_TOPIC);

  await connection.subscribe(LIFECYCLE_DISCONNECTED_TOPIC, mqtt.QoS.AtLeastOnce, lifecycleHandler);
  console.log('[MQTT] Subscribed to', LIFECYCLE_DISCONNECTED_TOPIC);

  startTelemetryFlushInterval();

  const machines = await prisma.machines.findMany({
    select: { device_id: true },
  });
  console.log(`[MQTT] Subscribing to ${machines.length} machine(s) from DB`);
  for (const m of machines) {
    if (m.device_id) {
      await subscribeToDevice(m.device_id);
    }
  }
}

// A device that answers on its pong topic is online, definitionally. This
// matters because machine status is otherwise only set by AWS IoT presence
// events - and a device that connected BEFORE its machine row existed had its
// "connected" event dropped by handleLifecycleEvent as unknown-device, leaving
// the dashboard stuck on offline until something forced a reconnect. (This was
// the long-standing "added the machine but it never shows online" mystery:
// onboarding a Pi that was already running always hit it.)
// createOrUpdateMachine solicits exactly such a pong right after creating the
// row, so a live machine flips online within about a second of being added.
async function markDeviceSeen(deviceId: string): Promise<void> {
  try {
    // updateMany: a pong from a device with no machine row yet must be a no-op,
    // not an error.
    await prisma.machines.updateMany({
      where: { device_id: deviceId },
      data: { status: 'online', last_seen_at: new Date() },
    });
  } catch (err) {
    console.error('[MQTT] Failed to mark device seen', deviceId, err);
  }
}

const pongHandler = (topic: string, payload: ArrayBuffer): void => {
  try {
    const message = JSON.parse(new TextDecoder().decode(payload));
    console.log('[MQTT] Received message on', topic, ':', JSON.stringify(message));

    const { requestId, action, config, success, error } = message;

    if (!requestId || !action) {
      console.warn('[MQTT] Ignoring message with missing requestId or action:', message);
      return;
    }

    // Extract deviceId from topic: rooted/machines/<deviceId>/pong
    const deviceId = topic.split('/')[2];

    void markDeviceSeen(deviceId);

    handleConfigResponse({ requestId, action, config, success, error, deviceId });
  } catch (err) {
    console.error('[MQTT] Error processing pong message:', err);
  }
};

const telemetryHandler = (topic: string, payload: ArrayBuffer): void => {
  try {
    const message = JSON.parse(new TextDecoder().decode(payload));

    // Extract deviceId from topic: rooted/machines/<deviceId>/telemetry
    const deviceId = topic.split('/')[2];
    if (!deviceId) {
      console.warn('[MQTT] Could not extract deviceId from telemetry topic:', topic);
      return;
    }

    // Normalize: single object → array for backward compatibility
    const payloads = Array.isArray(message) ? message : [message];

    bufferTelemetry(deviceId, payloads);
  } catch (err) {
    console.error('[MQTT] Error processing telemetry message:', err);
  }
};

export async function subscribeToDevice(deviceId: string): Promise<void> {
  if (!connection || !deviceId || allowedDeviceIds.has(deviceId)) return;
  allowedDeviceIds.add(deviceId);
  try {
    await connection.subscribe(pongTopicFor(deviceId), mqtt.QoS.AtLeastOnce, pongHandler);
    await connection.subscribe(telemetryTopicFor(deviceId), mqtt.QoS.AtLeastOnce, telemetryHandler);
    console.log('[MQTT] Subscribed to device', deviceId);
  } catch (err) {
    allowedDeviceIds.delete(deviceId);
    console.error('[MQTT] Failed to subscribe to device', deviceId, err);
  }
}

export async function unsubscribeFromDevice(deviceId: string): Promise<void> {
  if (!connection || !deviceId || !allowedDeviceIds.has(deviceId)) return;
  allowedDeviceIds.delete(deviceId);
  try {
    await connection.unsubscribe(pongTopicFor(deviceId));
    await connection.unsubscribe(telemetryTopicFor(deviceId));
    console.log('[MQTT] Unsubscribed from device', deviceId);
  } catch (err) {
    console.error('[MQTT] Failed to unsubscribe from device', deviceId, err);
  }
}

export async function stopMqttSubscriber(): Promise<void> {
  stopTelemetryFlushInterval();
  if (connection) {
    try {
      await connection.disconnect();
      console.log('[MQTT] Subscriber stopped');
    } catch (err) {
      console.error('[MQTT] Error during disconnect:', err);
    }
    connection = null;
  }
  allowedDeviceIds.clear();
}
