import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { handleConfigResponse } from './machine-presets/handleConfigResponse.js';
import { handleLifecycleEvent } from './machine-lifecycle/handleLifecycleEvent.js';
import { handleTelemetry } from './machine-telemetry/handleTelemetry.js';

const PONG_TOPIC = 'rooted/machines/+/pong';
const TELEMETRY_TOPIC = 'rooted/machines/+/telemetry';
const LIFECYCLE_CONNECTED_TOPIC = '$aws/events/presence/connected/+';
const LIFECYCLE_DISCONNECTED_TOPIC = '$aws/events/presence/disconnected/+';

let connection: mqtt.MqttClientConnection | null = null;

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
    .with_client_id(`rooted-api-${process.pid}-${Date.now()}`)
    .with_clean_session(true)
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

  // Telemetry
  await connection.subscribe(TELEMETRY_TOPIC, mqtt.QoS.AtLeastOnce, (topic, payload) => {
    try {
      const message = JSON.parse(new TextDecoder().decode(payload));
      console.log('[MQTT] Telemetry on', topic, ':', JSON.stringify(message));

      // Extract deviceId from topic: rooted/machines/<deviceId>/telemetry
      const deviceId = topic.split('/')[2];
      if (!deviceId) {
        console.warn('[MQTT] Could not extract deviceId from telemetry topic:', topic);
        return;
      }

      handleTelemetry(deviceId, message).catch((err) => {
        console.error('[MQTT] Error handling telemetry:', err);
      });
    } catch (err) {
      console.error('[MQTT] Error processing telemetry message:', err);
    }
  });

  console.log('[MQTT] Subscribed to', TELEMETRY_TOPIC);
}

export async function stopMqttSubscriber(): Promise<void> {
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
