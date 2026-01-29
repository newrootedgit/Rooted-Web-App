const https = require('https');

const API_ENDPOINT = process.env.API_ENDPOINT;
const SECRET_TOKEN = process.env.SECRET_TOKEN;

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    // AWS IoT sends either 'clientId' or 'deviceId' depending on the rule
    const deviceId = event.deviceId || event.clientId;
    const { eventType, timestamp, sessionIdentifier } = event;

    if (!deviceId || !eventType || !timestamp) {
      console.error('Missing required fields:', { deviceId, eventType, timestamp });
      return { statusCode: 400, body: 'Missing required fields' };
    }

    let normalizedEventType;
    if (eventType === 'connected') {
      normalizedEventType = 'connected';
    } else if (eventType === 'disconnected') {
      normalizedEventType = 'disconnected';
    } else {
      console.log('Unknown event type, skipping');
      return { statusCode: 200, body: 'Ignored' };
    }

    const payload = {
      deviceId,
      eventType: normalizedEventType,
      timestamp: new Date(timestamp).toISOString(),
      sessionId: sessionIdentifier,
    };

    const result = await callAPI(payload);
    console.log('API call successful:', result);
    return { statusCode: 200, body: 'Success' };

  } catch (error) {
    console.error('Error processing event:', error);
    throw error;
  }
};

function callAPI(payload) {
  return new Promise((resolve, reject) => {
    const url = new URL('/internal/machines/lifecycle-event', API_ENDPOINT);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SECRET_TOKEN}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data || '{}'));
        } else {
          reject(new Error(`API returned ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.write(JSON.stringify(payload));
    req.end();
  });
}