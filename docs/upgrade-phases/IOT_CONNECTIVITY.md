# AWS IoT Connectivity Implementation

## Overview

This document outlines the implementation of AWS IoT lifecycle events for real-time machine connectivity monitoring. Instead of polling machines, AWS IoT automatically notifies us when machines connect or disconnect.

## Architecture

```
Raspberry Pi
    ↓ (MQTT Connect)
AWS IoT Core
    ↓ (Lifecycle Event)
$aws/events/presence/connected/{clientId}
    ↓
IoT Rule (Filter & Route)
    ↓
Lambda Function
    ↓ (HTTPS POST)
Fastify API (on VM)
    ↓
PostgreSQL (on VM)
    ↓
Dashboard (Refresh Button)
```

## How It Works

1. **Pi connects** to AWS IoT via MQTT
2. **AWS IoT detects** connection and publishes to lifecycle topic
3. **IoT Rule** triggers Lambda function
4. **Lambda** calls your API with connection event
5. **API** updates database (machines table + connection_events table)
6. **Dashboard** shows latest status on refresh

**Benefits:**
- No 2-second ping delay
- Instant updates when machines connect/disconnect
- Handles ungraceful disconnects (power loss) via MQTT keep-alive
- Scales to 1000s of machines

---

## Implementation Steps

### Step 1: Database Schema

#### 1.1 Create Migration

**File:** `apps/api/prisma/schema.prisma`

Add to existing `machines` model:
```prisma
model machines {
  // ... existing fields
  status            String?   @default("offline")
  last_seen_at      DateTime?
  current_wifi_ssid String?
  
  connection_events machine_connection_events[]
}
```

Add new model:
```prisma
model machine_connection_events {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  machine_id String   @db.Uuid
  event_type String   @db.VarChar  // 'connected' | 'disconnected'
  timestamp  DateTime @db.Timestamp(6)
  wifi_ssid  String?  @db.VarChar
  session_id String?  @db.VarChar
  created_at DateTime @default(now()) @db.Timestamp(6)
  
  machine machines @relation(fields: [machine_id], references: [id], onDelete: Cascade)
  
  @@index([machine_id])
  @@index([timestamp(sort: Desc)])
  @@index([event_type])
  @@map("machine_connection_events")
}
```

#### 1.2 Run Migration

```bash
cd apps/api
pnpm prisma migrate dev --name add_machine_connection_events
pnpm prisma generate
```

---

### Step 2: Backend API Changes

#### 2.1 Add Environment Variable

**File:** `apps/api/.env`

```env
# Lambda Authentication
LAMBDA_SECRET_TOKEN=generate-a-secure-random-token-here-min-32-chars
```

Generate token:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 2.2 Create Lifecycle Event Handler

**File:** `apps/api/src/domains/machine-domain/service/handleLifecycleEvent.ts`

```typescript
import { PrismaClient } from '../../../generated/prisma/index.js';

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
  // Find machine by device_id
  const machine = await prisma.machines.findFirst({
    where: { device_id: input.deviceId },
  });

  if (!machine) {
    throw new Error(`Machine not found: ${input.deviceId}`);
  }

  // Create connection event record
  await prisma.machine_connection_events.create({
    data: {
      machine_id: machine.id,
      event_type: input.eventType,
      timestamp: new Date(input.timestamp),
      wifi_ssid: input.wifiSsid || null,
      session_id: input.sessionId || null,
    },
  });

  // Update machine status
  await prisma.machines.update({
    where: { id: machine.id },
    data: {
      status: input.eventType === 'connected' ? 'online' : 'offline',
      last_seen_at: new Date(input.timestamp),
      current_wifi_ssid: input.eventType === 'connected' ? input.wifiSsid : null,
    },
  });
}
```

#### 2.3 Create Internal API Route

**File:** `apps/api/src/domains/machine-domain/internal-routes.ts`

```typescript
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/db/index.js';
import { handleLifecycleEvent } from './service/handleLifecycleEvent.js';

interface LifecycleEventBody {
  deviceId: string;
  eventType: 'connected' | 'disconnected';
  timestamp: string;
  sessionId?: string;
  wifiSsid?: string;
}

export async function registerInternalRoutes(fastify: FastifyInstance) {
  // Lambda authentication hook
  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    const expectedToken = `Bearer ${process.env.LAMBDA_SECRET_TOKEN}`;

    if (!authHeader || authHeader !== expectedToken) {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }
  });

  // Lifecycle event endpoint
  fastify.post<{ Body: LifecycleEventBody }>(
    '/internal/machines/lifecycle-event',
    async (request, reply) => {
      try {
        const { deviceId, eventType, timestamp, sessionId, wifiSsid } = request.body;

        // Validate input
        if (!deviceId || !eventType || !timestamp) {
          reply.code(400).send({ error: 'Missing required fields' });
          return;
        }

        if (!['connected', 'disconnected'].includes(eventType)) {
          reply.code(400).send({ error: 'Invalid eventType' });
          return;
        }

        // Handle event
        await handleLifecycleEvent(prisma, {
          deviceId,
          eventType,
          timestamp,
          sessionId,
          wifiSsid,
        });

        reply.code(200).send({ success: true });
      } catch (error: any) {
        if (error.message.includes('not found')) {
          reply.code(404).send({ error: error.message });
        } else {
          request.log.error(error);
          reply.code(500).send({ error: 'Internal server error' });
        }
      }
    }
  );
}
```

#### 2.4 Register Routes in Main Server

**File:** `apps/api/src/index.ts`

Add after tRPC setup:

```typescript
import { registerInternalRoutes } from './domains/machine-domain/internal-routes.js';

// ... existing code ...

async function main() {
  // ... existing setup ...

  // Register internal routes
  await registerInternalRoutes(server);

  // ... rest of setup ...
}
```

---

### Step 3: Lambda Function

#### 3.1 Create Lambda Code

**File:** `infrastructure/lambda/machine-lifecycle/index.js`

```javascript
const https = require('https');

const API_ENDPOINT = process.env.API_ENDPOINT;
const SECRET_TOKEN = process.env.SECRET_TOKEN;

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    // Extract event data
    const { deviceId, eventType, timestamp, sessionIdentifier } = event;

    // Determine event type from topic
    let normalizedEventType;
    if (eventType === 'connected' || event.eventType === 'connected') {
      normalizedEventType = 'connected';
    } else if (eventType === 'disconnected' || event.eventType === 'disconnected') {
      normalizedEventType = 'disconnected';
    } else {
      console.log('Unknown event type, skipping');
      return { statusCode: 200, body: 'Ignored' };
    }

    // Prepare payload
    const payload = {
      deviceId,
      eventType: normalizedEventType,
      timestamp: new Date(timestamp).toISOString(),
      sessionId: sessionIdentifier,
    };

    // Call API
    const result = await callAPI(payload);
    
    console.log('API call successful:', result);
    return { statusCode: 200, body: 'Success' };

  } catch (error) {
    console.error('Error processing event:', error);
    throw error; // Let Lambda retry
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

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data || '{}'));
        } else {
          reject(new Error(`API returned ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(payload));
    req.end();
  });
}
```

#### 3.2 Package Lambda

```bash
cd infrastructure/lambda/machine-lifecycle
zip -r ../machine-lifecycle.zip index.js
```

---

### Step 4: Deploy AWS Infrastructure

#### 4.1 Configure Terraform Variables

**File:** `infrastructure/terraform/terraform.tfvars`

```hcl
aws_region          = "us-west-2"
project_name        = "rooted"
environment         = "prod"
api_endpoint        = "https://api.yourdomain.com"
lambda_secret_token = "your-generated-token-from-step-2.1"
```

#### 4.2 Deploy

```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Review plan
terraform plan

# Deploy
terraform apply

# Save outputs
terraform output -json > outputs.json
```

#### 4.3 Note Important Outputs

```bash
# Get IoT endpoint
terraform output iot_endpoint

# Get IoT policy name
terraform output iot_policy_name

# Get Lambda function name
terraform output lambda_function_name
```

---

### Step 5: Raspberry Pi Changes

#### 5.1 Update Environment Variables

**File:** `pi-src/.env` (or system environment)

```bash
AWS_REGION=us-west-2
AWS_IOT_ENDPOINT=<from-terraform-output>
AWS_IOT_POLICY_NAME=<from-terraform-output>
AWS_ACCESS_KEY_ID=<pi-iam-user-key>
AWS_SECRET_ACCESS_KEY=<pi-iam-user-secret>
```

#### 5.2 Update AWS IoT Registration

**File:** `pi-src/aws_iot_registration.py`

Update to use lifecycle events (no ping/pong needed):

```python
import json
import os
import boto3
from awscrt import io, mqtt
from awsiot import mqtt_connection_builder

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEVICE_FILE = os.path.join(SCRIPT_DIR, 'device_config.json')
CERTS_DIR = os.path.join(SCRIPT_DIR, 'certs')

def get_device_id():
    """Load device_id from config"""
    with open(DEVICE_FILE, 'r') as f:
        config = json.load(f)
    return config['device_id']

def register_with_aws_iot():
    """Auto-register device with AWS IoT Core"""
    device_id = get_device_id()
    thing_name = device_id
    
    # Check if already registered
    cert_path = os.path.join(CERTS_DIR, 'certificate.pem.crt')
    if os.path.exists(cert_path):
        print(f"Device {device_id} already registered")
        return thing_name
    
    # Create Thing and certificates
    iot_client = boto3.client('iot', region_name=os.getenv('AWS_REGION', 'us-west-2'))
    
    try:
        # Create Thing
        iot_client.create_thing(thingName=thing_name)
        print(f"Created Thing: {thing_name}")
        
        # Create certificates
        cert_response = iot_client.create_keys_and_certificate(setAsActive=True)
        
        # Save certificates
        os.makedirs(CERTS_DIR, exist_ok=True)
        
        with open(os.path.join(CERTS_DIR, 'certificate.pem.crt'), 'w') as f:
            f.write(cert_response['certificatePem'])
        
        with open(os.path.join(CERTS_DIR, 'private.pem.key'), 'w') as f:
            f.write(cert_response['keyPair']['PrivateKey'])
        
        # Set proper permissions
        os.chmod(os.path.join(CERTS_DIR, 'private.pem.key'), 0o600)
        
        # Attach policy
        policy_name = os.getenv('AWS_IOT_POLICY_NAME')
        iot_client.attach_policy(
            policyName=policy_name,
            target=cert_response['certificateArn']
        )
        
        # Attach certificate to Thing
        iot_client.attach_thing_principal(
            thingName=thing_name,
            principal=cert_response['certificateArn']
        )
        
        print(f"Successfully registered {thing_name} with AWS IoT")
        return thing_name
        
    except Exception as e:
        print(f"Error registering with AWS IoT: {e}")
        raise

def connect_to_aws_iot():
    """Establish persistent MQTT connection to AWS IoT"""
    device_id = get_device_id()
    endpoint = os.getenv('AWS_IOT_ENDPOINT')
    cert_path = os.path.join(CERTS_DIR, 'certificate.pem.crt')
    key_path = os.path.join(CERTS_DIR, 'private.pem.key')
    ca_path = os.path.join(CERTS_DIR, 'AmazonRootCA1.pem')
    
    # Build MQTT connection
    mqtt_connection = mqtt_connection_builder.mtls_from_path(
        endpoint=endpoint,
        cert_filepath=cert_path,
        pri_key_filepath=key_path,
        ca_filepath=ca_path,
        client_id=device_id,
        clean_session=False,
        keep_alive_secs=60,
        on_connection_interrupted=on_connection_interrupted,
        on_connection_resumed=on_connection_resumed
    )
    
    # Connect
    print(f"Connecting to AWS IoT as {device_id}...")
    connect_future = mqtt_connection.connect()
    connect_future.result()
    print(f"Connected to AWS IoT!")
    
    return mqtt_connection

def on_connection_interrupted(connection, error, **kwargs):
    print(f"Connection interrupted: {error}")

def on_connection_resumed(connection, return_code, session_present, **kwargs):
    print(f"Connection resumed. Return code: {return_code}, Session present: {session_present}")
```

#### 5.3 Update Main Provisioner

**File:** `pi-src/provisioner.py`

Modify WiFi connection success handler:

```python
def connect_to_wifi(self):
    # ... existing WiFi connection code ...
    
    if result.returncode == 0:
        print("WiFi connected successfully!")
        if self.status_chr:
            self.status_chr.set_value([0x02])  # Success
        
        # Register with AWS IoT and connect
        try:
            from aws_iot_registration import register_with_aws_iot, connect_to_aws_iot
            
            thing_name = register_with_aws_iot()
            mqtt_connection = connect_to_aws_iot()
            
            # Connection stays open - AWS IoT will send lifecycle events
            print("AWS IoT connection established. Lifecycle events enabled.")
            
        except Exception as e:
            print(f"AWS IoT setup failed: {e}")
            # Continue anyway - WiFi is connected
```

#### 5.4 Download Root CA Certificate

```bash
cd pi-src
mkdir -p certs
curl -o certs/AmazonRootCA1.pem https://www.amazontrust.com/repository/AmazonRootCA1.pem
```

---

### Step 6: Frontend Updates

#### 6.1 Update Machine Type

**File:** `shared/types/machines.ts`

```typescript
export interface Machine {
  id: string;
  name: string;
  deviceId: string;
  createdAt: string | Date | null;
  awsIotThingName?: string | null;
  status?: 'online' | 'offline';
  lastSeenAt?: string | Date | null;
  currentWifiSsid?: string | null;
}
```

#### 6.2 Update Machine Card Component

**File:** `src/machines/dashboard/components/MachineCard.tsx`

Add status display:

```typescript
import { Wifi, WifiOff } from 'lucide-react';

// Inside component
const isOnline = machine.status === 'online';

// Add to JSX (after machine name)
<div className="flex items-center gap-2 mt-2">
  {isOnline ? (
    <>
      <Wifi className="text-green-500" size={16} />
      <span className="text-sm text-green-600 font-medium">Online</span>
    </>
  ) : (
    <>
      <WifiOff className="text-gray-400" size={16} />
      <span className="text-sm text-gray-500">Offline</span>
    </>
  )}
</div>

{machine.currentWifiSsid && (
  <div className="text-xs text-muted-foreground mt-1">
    Connected to: <span className="font-mono">{machine.currentWifiSsid}</span>
  </div>
)}

{machine.lastSeenAt && (
  <div className="text-xs text-muted-foreground mt-1">
    Last seen: {new Date(machine.lastSeenAt).toLocaleString()}
  </div>
)}
```

#### 6.3 Update Backend Query to Return New Fields

**File:** `apps/api/src/domains/machine-domain/queries/getMachinesByFarm.ts`

```typescript
export async function getMachinesByFarm(
  prisma: PrismaClient,
  tenantId: string,
  farmId: string
): Promise<Machine[]> {
  const machines = await prisma.machines.findMany({
    where: {
      tenant_id: tenantId,
      farm_id: farmId,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return machines.map((m) => ({
    id: m.id,
    tenantId: m.tenant_id,
    farmId: m.farm_id,
    name: m.name,
    deviceId: m.device_id,
    createdAt: m.created_at,
    awsIotThingName: m.aws_iot_thing_name,
    status: m.status as 'online' | 'offline' | undefined,
    lastSeenAt: m.last_seen_at,
    currentWifiSsid: m.current_wifi_ssid,
  }));
}
```

---

## Testing

### Test 1: Lambda Function

```bash
# Test Lambda directly
aws lambda invoke \
  --function-name rooted-machine-lifecycle-prod \
  --payload '{"deviceId":"test-device-123","eventType":"connected","timestamp":"2026-01-23T12:00:00Z"}' \
  response.json

cat response.json
```

### Test 2: API Endpoint

```bash
# Test API endpoint directly
curl -X POST https://api.yourdomain.com/internal/machines/lifecycle-event \
  -H "Authorization: Bearer your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "test-device-123",
    "eventType": "connected",
    "timestamp": "2026-01-23T12:00:00Z",
    "wifiSsid": "TestNetwork"
  }'
```

### Test 3: End-to-End

1. Provision a Pi with WiFi
2. Pi should auto-register with AWS IoT
3. Pi connects to MQTT
4. Check CloudWatch Logs for Lambda invocation
5. Check database for connection event
6. Refresh dashboard - should show "Online"
7. Disconnect Pi from network
8. Wait 60 seconds (keep-alive timeout)
9. AWS IoT detects disconnect
10. Check database - should show "Offline"
11. Refresh dashboard - should show "Offline"

### Test 4: Monitor Logs

```bash
# Lambda logs
aws logs tail /aws/lambda/rooted-machine-lifecycle-prod --follow

# IoT Rule errors
aws logs tail /aws/iot/rules/rooted-lifecycle-errors-prod --follow

# API logs (on VM)
sudo journalctl -u rooted-api -f
```

---

## Monitoring & Alerts

### CloudWatch Alarms

Create alarms for:

1. **Lambda Errors**
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name rooted-lambda-errors \
  --alarm-description "Alert on Lambda errors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=rooted-machine-lifecycle-prod
```

2. **Dead Letter Queue Depth**
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name rooted-dlq-messages \
  --alarm-description "Alert on DLQ messages" \
  --metric-name ApproximateNumberOfMessagesVisible \
  --namespace AWS/SQS \
  --statistic Average \
  --period 60 \
  --evaluation-periods 1 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --dimensions Name=QueueName,Value=rooted-machine-lifecycle-dlq-prod
```

### Dashboard Metrics

Track in your monitoring:
- Connection events per hour
- Average time between connect/disconnect
- Machines online vs offline ratio
- Lambda invocation count
- API endpoint latency

---

## Troubleshooting

### Pi Not Connecting to AWS IoT

**Check:**
1. Certificates exist in `pi-src/certs/`
2. Certificate permissions: `chmod 600 private.pem.key`
3. AWS IoT endpoint correct in `.env`
4. Thing exists in AWS IoT console
5. Policy attached to certificate
6. Certificate attached to Thing

**Debug:**
```bash
# Test MQTT connection manually
mosquitto_pub --cafile certs/AmazonRootCA1.pem \
  --cert certs/certificate.pem.crt \
  --key certs/private.pem.key \
  -h your-endpoint.iot.us-west-2.amazonaws.com \
  -p 8883 \
  -q 1 \
  -t test/topic \
  -i test-client \
  -m "test message" \
  -d
```

### Lambda Not Triggering

**Check:**
1. IoT Rule enabled
2. IoT Rule SQL correct
3. Lambda permission for IoT to invoke
4. CloudWatch Logs for IoT Rule errors

**Debug:**
```bash
# Check IoT Rule
aws iot get-topic-rule --rule-name rooted_machine_lifecycle_prod

# Check Lambda permissions
aws lambda get-policy --function-name rooted-machine-lifecycle-prod
```

### API Not Receiving Calls

**Check:**
1. API publicly accessible
2. SSL certificate valid
3. Firewall allows HTTPS (port 443)
4. Lambda has correct API_ENDPOINT
5. Lambda has correct SECRET_TOKEN

**Debug:**
```bash
# Test from Lambda's perspective
curl -X POST https://api.yourdomain.com/internal/machines/lifecycle-event \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"test","eventType":"connected","timestamp":"2026-01-23T12:00:00Z"}'
```

### Database Not Updating

**Check:**
1. Machine exists in database with matching device_id
2. Database connection from API working
3. Prisma schema up to date
4. Migration ran successfully

**Debug:**
```bash
# Check database directly
sudo -u postgres psql rooted_planner

SELECT * FROM machines WHERE device_id = 'your-device-id';
SELECT * FROM machine_connection_events ORDER BY created_at DESC LIMIT 10;
```

---

## Cost Estimate

**Monthly costs (50 machines, 2 connections/day each):**

| Service | Usage | Cost |
|---------|-------|------|
| AWS IoT Core | 3,000 messages/month | Free tier |
| Lambda | 3,000 invocations/month | Free tier |
| CloudWatch Logs | ~100 MB/month | Free tier |
| DLQ (SQS) | Minimal usage | Free tier |
| **Total** | | **$0/month** |

**At scale (1,000 machines, 10 connections/day):**

| Service | Usage | Cost |
|---------|-------|------|
| AWS IoT Core | 300,000 messages/month | $0.24 |
| Lambda | 300,000 invocations | $0.06 |
| CloudWatch Logs | ~2 GB/month | $1.00 |
| DLQ (SQS) | Minimal | $0.01 |
| **Total** | | **~$1.31/month** |

---

## Future Enhancements (Nice-to-Have)

### 1. WebSocket Real-Time Updates

**Architecture:**
```
Lambda → API → WebSocket Server → Dashboard
```

**Implementation:**
- Add Socket.io to Fastify
- Lambda calls API, API broadcasts to connected clients
- Dashboard subscribes to machine status updates
- No refresh needed

**Effort:** 1-2 days

### 2. Connection Analytics

**Features:**
- Uptime percentage per machine
- Connection stability score
- Network quality metrics
- Alerts for frequent disconnects

**Implementation:**
- Query `machine_connection_events` table
- Calculate metrics on-demand or pre-aggregate
- Display in dashboard

**Effort:** 2-3 days

### 3. Historical Charts

**Features:**
- Connection timeline
- Uptime trends
- Network changes over time

**Implementation:**
- Use Chart.js or Recharts
- Query events table with date ranges
- Display in machine detail view

**Effort:** 1-2 days

### 4. Alerting

**Features:**
- Email/Slack when machine goes offline
- Alert if machine offline > X hours
- Alert on frequent reconnects (network issues)

**Implementation:**
- Add SNS topic to Lambda
- Subscribe email/Slack webhook
- Add alerting logic to Lambda

**Effort:** 1 day

---

## Summary

### What You Built
- Lifecycle event-based connectivity monitoring
- No polling, no delays
- Automatic detection of connect/disconnect
- Full event history in database
- Dashboard shows live status

### Key Benefits
- **Fast:** No 2-second wait
- **Scalable:** Handles 1000s of machines
- **Reliable:** Detects ungraceful disconnects
- **Cost-effective:** Free tier covers most usage
- **Simple:** No complex MQTT ping/pong logic

### Next Steps
1. Deploy infrastructure with Terraform
2. Update API with lifecycle endpoint
3. Update Pi code for AWS IoT connection
4. Test end-to-end flow
5. Monitor and iterate

### When to Add WebSocket
- When you have >10 machines
- When users keep dashboard open for hours
- When real-time updates are critical
- Estimated effort: 1-2 days
