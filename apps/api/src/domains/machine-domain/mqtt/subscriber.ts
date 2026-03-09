import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { handleConfigResponse } from './machine-presets/handleConfigResponse.js';
import { handleLifecycleEvent } from './machine-lifecycle/handleLifecycleEvent.js';
import { handleTelemetry, TelemetryPayload } from './machine-telemetry/handleTelemetry.js';

const PONG_TOPIC = 'rooted/machines/+/pong';
const TELEMETRY_TOPIC = 'rooted/machines/+/telemetry';
const LIFECYCLE_CONNECTED_TOPIC = '$aws/events/presence/connected/+';
const LIFECYCLE_DISCONNECTED_TOPIC = '$aws/events/presence/disconnected/+';

let connection: mqtt.MqttClientConnection | null = null;

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
    .with_client_id('rooted-api-subscriber')
    .with_clean_session(false)
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

  // Pong (preset config responses)
  await connection.subscribe(PONG_TOPIC, mqtt.QoS.AtLeastOnce, (topic, payload) => {
    try {
      const message = JSON.parse(new TextDecoder().decode(payload));
      console.log('[MQTT] Received message on', topic, ':', JSON.stringify(message));

      const { requestId, action, config, success, error } = message;

      if (!requestId || !action) {
        console.warn('[MQTT] Ignoring message with missing requestId or action:', message);
        return;
      }

      handleConfigResponse({ requestId, action, config, success, error });
    } catch (err) {
      console.error('[MQTT] Error processing pong message:', err);
    }
  });

  console.log('[MQTT] Subscribed to', PONG_TOPIC);

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

  // Telemetry (buffered — collects events per device, flushes on fixed interval)
  await connection.subscribe(TELEMETRY_TOPIC, mqtt.QoS.AtLeastOnce, (topic, payload) => {
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
  });

  console.log('[MQTT] Subscribed to', TELEMETRY_TOPIC);
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
}
