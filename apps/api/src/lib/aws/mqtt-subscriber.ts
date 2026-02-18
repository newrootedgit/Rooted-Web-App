import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { handleConfigResponse } from '../../domains/machine-domain/mqtt/handleConfigResponse.js';

const PONG_TOPIC = 'rooted/machines/+/pong';

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

  // Strip protocol prefix if present (e.g. "https://xxx-ats.iot.region.amazonaws.com")
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
      console.error('[MQTT] Error processing message:', err);
    }
  });

  console.log('[MQTT] Subscribed to', PONG_TOPIC);
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
