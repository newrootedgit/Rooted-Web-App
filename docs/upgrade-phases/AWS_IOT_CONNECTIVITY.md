# AWS IoT Connectivity Implementation

## Overview

This document outlines the implementation plan for adding AWS IoT Core connectivity monitoring to the Machine IoT platform. This enables real-time status checking and WiFi network tracking for all registered Raspberry Pi machines.

## Architecture

### Communication Flow

```
Dashboard Load
    ↓
Backend: Query machines from database
    ↓
Backend: Publish ping to AWS IoT topics (one per machine)
    Topic: rooted/machines/{device_id}/ping
    Payload: { "request_id": "uuid" }
    ↓
Pi (if online): Responds to AWS IoT topic
    Topic: rooted/machines/{device_id}/pong  
    Payload: { "request_id": "uuid", "status": "online", "wifi_ssid": "NetworkName" }
    ↓
Backend: Wait 2 seconds, collect responses
    ↓
Backend: Return machines with live status + WiFi info
```

### Registration Flow

```
Pi WiFi Provisioning Completes
    ↓
Pi: Auto-register with AWS IoT Core
    - Create Thing with device_id as Thing name
    - Generate certificates
    - Store credentials locally
    ↓
Pi: Start MQTT listener
    - Subscribe to rooted/machines/{device_id}/ping
    - Respond to pings with status + WiFi SSID
```

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **AWS Registration Timing** | After WiFi provisioning | Pi needs internet to communicate with AWS |
| **Communication Model** | Request-response via AWS IoT | No automatic heartbeats; backend requests status on-demand |
| **AWS Credentials** | Pre-provisioned on Pi | Credentials baked into Pi image during setup |
| **Communication Pattern** | AWS IoT as intermediary | Avoid direct Pi-to-backend connections; use managed MQTT |
| **Response Timeout** | 2 seconds | Balance between speed and reliability |
| **Status Persistence** | In-memory only (Phase 1) | Avoid DB writes on every dashboard load; add later if needed |
| **Concurrency** | Simultaneous pings | Ping all machines at once for faster response |

## Implementation Phases

---

## Phase 1: Database Schema Update

### 1.1 Add Connectivity Columns

**File:** `apps/api/prisma/schema.prisma`

Add to `machines` model:
```prisma
model machines {
  // ... existing fields
  aws_iot_thing_name String?  @unique
  status             String   @default("offline") // 'online' | 'offline'
  last_seen_at       DateTime?
  current_wifi_ssid  String?
}
```

### 1.2 Create Migration

```bash
cd apps/api
pnpm prisma migrate dev --name add_machine_connectivity_fields
pnpm prisma generate
```

### 1.3 Update TypeScript Types

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

**File:** `apps/api/src/domains/machine-domain/types.ts`

Update `Machine` interface to match shared type.

---

## Phase 2: Backend AWS IoT Integration

### 2.1 Install AWS SDK

```bash
cd apps/api
pnpm add @aws-sdk/client-iot-data-plane
```

### 2.2 Environment Variables

**File:** `apps/api/.env`

```env
AWS_REGION=us-west-2
AWS_IOT_ENDPOINT=<your-iot-endpoint>.iot.us-west-2.amazonaws.com
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
```

Get IoT endpoint:
```bash
aws iot describe-endpoint --endpoint-type iot:Data-ATS
```

### 2.3 Create AWS IoT Client

**File:** `apps/api/src/lib/aws-iot/client.ts`

```typescript
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';

const client = new IoTDataPlaneClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  endpoint: `https://${process.env.AWS_IOT_ENDPOINT}`,
});

export async function publishPing(deviceId: string, requestId: string): Promise<void> {
  const command = new PublishCommand({
    topic: `rooted/machines/${deviceId}/ping`,
    payload: Buffer.from(JSON.stringify({ request_id: requestId })),
    qos: 0,
  });
  
  await client.send(command);
}

export { client as iotClient };
```

**File:** `apps/api/src/lib/aws-iot/index.ts`

```typescript
export { iotClient, publishPing } from './client.js';
```

### 2.4 Create Connectivity Check Service

**File:** `apps/api/src/domains/machine-domain/service/checkMachinesConnectivity.ts`

```typescript
import { v4 as uuidv4 } from 'uuid';
import { publishPing, iotClient } from '../../../lib/aws-iot/index.js';
import { SubscribeCommand } from '@aws-sdk/client-iot-data-plane';

interface ConnectivityResult {
  deviceId: string;
  status: 'online' | 'offline';
  wifiSsid: string | null;
  lastSeen: Date | null;
}

export async function checkMachinesConnectivity(
  deviceIds: string[]
): Promise<Map<string, ConnectivityResult>> {
  const requestId = uuidv4();
  const results = new Map<string, ConnectivityResult>();
  
  // Initialize all as offline
  deviceIds.forEach(deviceId => {
    results.set(deviceId, {
      deviceId,
      status: 'offline',
      wifiSsid: null,
      lastSeen: null,
    });
  });

  // Subscribe to pong responses
  const subscriptions = deviceIds.map(deviceId => 
    subscribeToPong(deviceId, requestId, results)
  );

  // Publish pings to all machines
  await Promise.all(
    deviceIds.map(deviceId => publishPing(deviceId, requestId))
  );

  // Wait 2 seconds for responses
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Cleanup subscriptions
  subscriptions.forEach(sub => sub.unsubscribe());

  return results;
}

function subscribeToPong(
  deviceId: string,
  requestId: string,
  results: Map<string, ConnectivityResult>
) {
  // Note: AWS IoT Data Plane doesn't support MQTT subscriptions directly
  // This requires using AWS IoT Device SDK or implementing WebSocket MQTT
  // For Phase 1, we'll use a simplified polling approach via Device Shadow
  
  // TODO: Implement proper MQTT subscription in Phase 2
  return { unsubscribe: () => {} };
}
```

**Note:** Full MQTT subscription requires AWS IoT Device SDK. For Phase 1, we'll use a simplified approach.

### 2.5 Update Machine List Service

**File:** `apps/api/src/domains/machine-domain/service/listMachines.ts`

```typescript
import { PrismaClient } from '../../../generated/prisma/index.js';
import { PrismaPaginationOptions } from '../../../lib/trpc/pagination/index.js';
import { checkMachinesConnectivity } from './checkMachinesConnectivity.js';
import { Machine } from '../types.js';

export async function listMachines(
  prisma: PrismaClient,
  tenantId: string,
  farmId: string | null,
  pagination: PrismaPaginationOptions
): Promise<{ items: Machine[]; total: number }> {
  const where = {
    tenant_id: tenantId,
    ...(farmId && { farm_id: farmId }),
  };

  const [machines, total] = await Promise.all([
    prisma.machines.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: { created_at: 'desc' },
    }),
    prisma.machines.count({ where }),
  ]);

  // Check connectivity for all machines
  const deviceIds = machines.map(m => m.device_id);
  const connectivityResults = await checkMachinesConnectivity(deviceIds);

  // Merge connectivity data
  const items: Machine[] = machines.map(m => {
    const connectivity = connectivityResults.get(m.device_id);
    return {
      id: m.id,
      tenantId: m.tenant_id,
      farmId: m.farm_id,
      name: m.name,
      deviceId: m.device_id,
      createdAt: m.created_at,
      awsIotThingName: m.aws_iot_thing_name,
      status: connectivity?.status || 'offline',
      lastSeenAt: connectivity?.lastSeen,
      currentWifiSsid: connectivity?.wifiSsid,
    };
  });

  return { items, total };
}
```

---

## Phase 3: Raspberry Pi Implementation

### 3.1 Install Dependencies

**File:** `pi-src/requirements.txt`

Add:
```
awsiotsdk==1.11.1
```

Install:
```bash
pip3 install -r requirements.txt
```

### 3.2 AWS IoT Registration Module

**File:** `pi-src/aws_iot_registration.py`

```python
import json
import os
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
    """
    Auto-register device with AWS IoT Core.
    Assumes AWS credentials are pre-provisioned in environment or config.
    """
    device_id = get_device_id()
    thing_name = device_id
    
    # Check if already registered
    cert_path = os.path.join(CERTS_DIR, 'certificate.pem.crt')
    if os.path.exists(cert_path):
        print(f"Device {device_id} already registered")
        return thing_name
    
    # Create Thing and certificates using AWS IoT API
    # This requires AWS credentials with iot:CreateThing and iot:CreateKeysAndCertificate permissions
    
    import boto3
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
        
        # Attach policy to certificate
        policy_name = os.getenv('AWS_IOT_POLICY_NAME', 'RootedMachinePolicy')
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
```

### 3.3 MQTT Listener Module

**File:** `pi-src/mqtt_listener.py`

```python
import json
import subprocess
from awscrt import mqtt
from awsiot import mqtt_connection_builder
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CERTS_DIR = os.path.join(SCRIPT_DIR, 'certs')

def get_current_wifi_ssid():
    """Get currently connected WiFi SSID"""
    try:
        result = subprocess.run(
            ['nmcli', '-t', '-f', 'active,ssid', 'dev', 'wifi'],
            capture_output=True,
            text=True
        )
        for line in result.stdout.split('\n'):
            if line.startswith('yes:'):
                return line.split(':')[1]
    except Exception as e:
        print(f"Error getting WiFi SSID: {e}")
    return None

def on_ping_received(topic, payload, **kwargs):
    """Handle ping requests from backend"""
    try:
        message = json.loads(payload)
        request_id = message.get('request_id')
        
        # Get current WiFi
        wifi_ssid = get_current_wifi_ssid()
        
        # Prepare response
        response = {
            'request_id': request_id,
            'status': 'online',
            'wifi_ssid': wifi_ssid,
        }
        
        # Publish pong response
        device_id = os.getenv('DEVICE_ID')
        pong_topic = f'rooted/machines/{device_id}/pong'
        
        mqtt_connection.publish(
            topic=pong_topic,
            payload=json.dumps(response),
            qos=mqtt.QoS.AT_MOST_ONCE
        )
        
        print(f"Responded to ping {request_id}")
        
    except Exception as e:
        print(f"Error handling ping: {e}")

def start_mqtt_listener(device_id):
    """Start MQTT listener for ping requests"""
    global mqtt_connection
    
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
        keep_alive_secs=30
    )
    
    # Connect
    connect_future = mqtt_connection.connect()
    connect_future.result()
    print(f"Connected to AWS IoT as {device_id}")
    
    # Subscribe to ping topic
    ping_topic = f'rooted/machines/{device_id}/ping'
    subscribe_future, _ = mqtt_connection.subscribe(
        topic=ping_topic,
        qos=mqtt.QoS.AT_MOST_ONCE,
        callback=on_ping_received
    )
    subscribe_future.result()
    print(f"Subscribed to {ping_topic}")
    
    return mqtt_connection
```

### 3.4 Update Main Provisioner

**File:** `pi-src/provisioner.py`

Add after WiFi connection succeeds:

```python
def connect_to_wifi(self):
    # ... existing WiFi connection code ...
    
    if result.returncode == 0:
        print("WiFi connected successfully!")
        if self.status_chr:
            self.status_chr.set_value([0x02])  # Success
        
        # NEW: Register with AWS IoT and start MQTT listener
        try:
            from aws_iot_registration import register_with_aws_iot
            from mqtt_listener import start_mqtt_listener
            
            thing_name = register_with_aws_iot()
            device_id = get_device_config()['device_id']
            start_mqtt_listener(device_id)
            
        except Exception as e:
            print(f"AWS IoT setup failed: {e}")
            # Continue anyway - WiFi is connected
```

### 3.5 AWS Credentials Setup

**File:** `pi-src/.env` (or system environment)

```bash
AWS_REGION=us-west-2
AWS_IOT_ENDPOINT=<your-endpoint>.iot.us-west-2.amazonaws.com
AWS_IOT_POLICY_NAME=RootedMachinePolicy
AWS_ACCESS_KEY_ID=<pi-credentials>
AWS_SECRET_ACCESS_KEY=<pi-secret>
DEVICE_ID=<loaded-from-device_config.json>
```

### 3.6 Download Root CA Certificate

```bash
cd pi-src
mkdir -p certs
curl -o certs/AmazonRootCA1.pem https://www.amazontrust.com/repository/AmazonRootCA1.pem
```

---

## Phase 4: Frontend Updates

### 4.1 Update Machine Card Component

**File:** `src/machines/dashboard/components/MachineCard.tsx`

Add status indicator and WiFi display:

```typescript
// Add to imports
import { Wifi, WifiOff } from 'lucide-react';

// Inside component
const { machine } = props;
const isOnline = machine.status === 'online';

// Add to JSX
<div className="flex items-center gap-2">
  {isOnline ? (
    <Wifi className="text-green-500" size={16} />
  ) : (
    <WifiOff className="text-gray-400" size={16} />
  )}
  <span className={isOnline ? 'text-green-600' : 'text-gray-500'}>
    {isOnline ? 'Online' : 'Offline'}
  </span>
</div>

{machine.currentWifiSsid && (
  <div className="text-sm text-muted-foreground">
    Connected to: {machine.currentWifiSsid}
  </div>
)}
```

---

## Phase 5: AWS IoT Policy Setup

### 5.1 Create IoT Policy

**Policy Name:** `RootedMachinePolicy`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iot:Connect",
      "Resource": "arn:aws:iot:us-west-2:ACCOUNT_ID:client/${iot:Connection.Thing.ThingName}"
    },
    {
      "Effect": "Allow",
      "Action": "iot:Subscribe",
      "Resource": "arn:aws:iot:us-west-2:ACCOUNT_ID:topicfilter/rooted/machines/${iot:Connection.Thing.ThingName}/ping"
    },
    {
      "Effect": "Allow",
      "Action": "iot:Receive",
      "Resource": "arn:aws:iot:us-west-2:ACCOUNT_ID:topic/rooted/machines/${iot:Connection.Thing.ThingName}/ping"
    },
    {
      "Effect": "Allow",
      "Action": "iot:Publish",
      "Resource": "arn:aws:iot:us-west-2:ACCOUNT_ID:topic/rooted/machines/${iot:Connection.Thing.ThingName}/pong"
    }
  ]
}
```

Create via CLI:
```bash
aws iot create-policy \
  --policy-name RootedMachinePolicy \
  --policy-document file://iot-policy.json
```

### 5.2 Backend IAM Policy

Backend needs permissions to publish to ping topics:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iot:Publish",
      "Resource": "arn:aws:iot:us-west-2:ACCOUNT_ID:topic/rooted/machines/*/ping"
    }
  ]
}
```

---

## Testing Plan

### Unit Tests

1. **Backend Connectivity Service**
   - Mock AWS IoT client
   - Test timeout behavior
   - Test response parsing

2. **Pi MQTT Listener**
   - Mock MQTT connection
   - Test ping/pong flow
   - Test WiFi SSID detection

### Integration Tests

1. **End-to-End Flow**
   - Provision Pi with WiFi
   - Verify AWS IoT registration
   - Load dashboard
   - Verify status shows online
   - Verify WiFi SSID displayed

2. **Offline Scenario**
   - Disconnect Pi from network
   - Load dashboard
   - Verify status shows offline

### Manual Testing Checklist

- [ ] Pi registers with AWS IoT after WiFi provisioning
- [ ] Pi responds to ping requests
- [ ] Dashboard shows correct online/offline status
- [ ] Dashboard shows current WiFi SSID
- [ ] Multiple machines show correct individual statuses
- [ ] Timeout works correctly (2 seconds)
- [ ] Offline machines don't block online machines

---

## Deployment Steps

### 1. Backend Deployment

```bash
cd apps/api
pnpm install
pnpm prisma migrate deploy
pnpm build
# Deploy to production
```

### 2. Pi Image Update

```bash
# Update pi-src code
# Install dependencies
pip3 install -r requirements.txt

# Set environment variables
# Copy certificates if needed

# Restart service
sudo systemctl restart machine-iot
```

### 3. AWS Setup

```bash
# Create IoT policy
aws iot create-policy --policy-name RootedMachinePolicy --policy-document file://iot-policy.json

# Verify endpoint
aws iot describe-endpoint --endpoint-type iot:Data-ATS
```

---

## Future Enhancements (Phase 2)

1. **Persistent Status Storage**
   - Update database with connectivity results
   - Track connectivity history
   - Generate uptime reports

2. **Real-time Updates**
   - WebSocket connection to backend
   - Push status updates to dashboard
   - No need to refresh

3. **Refresh Button**
   - Manual connectivity check
   - Loading state during check

4. **Advanced Error Handling**
   - Retry logic for failed pings
   - Exponential backoff
   - Alert on prolonged offline status

5. **WiFi History**
   - Track network changes
   - Alert on unexpected network switches
   - Network quality metrics

---

## Troubleshooting

### Pi Not Registering with AWS IoT

- Check AWS credentials in environment
- Verify internet connectivity
- Check CloudWatch logs for errors
- Verify IAM permissions

### Dashboard Shows All Offline

- Check backend AWS IoT endpoint configuration
- Verify backend IAM permissions
- Check AWS IoT policy allows publish to ping topics
- Test MQTT connection manually

### Pi Not Responding to Pings

- Check MQTT connection status on Pi
- Verify subscription to ping topic
- Check certificate validity
- Review Pi logs for errors

---

## Security Considerations

1. **AWS Credentials on Pi**
   - Use IAM user with minimal permissions
   - Only allow Thing creation and certificate operations
   - Rotate credentials periodically

2. **Certificate Storage**
   - Store certificates in protected directory
   - Set proper file permissions (600)
   - Never commit certificates to git

3. **MQTT Security**
   - Use TLS for all connections
   - Validate certificate chains
   - Use QoS 0 for non-critical messages

4. **Backend Security**
   - Validate device_id format
   - Rate limit ping requests
   - Log all connectivity checks

---

## Open Questions & Decisions Needed

1. **Pi Registration Error Handling**
   - Should Pi retry AWS IoT registration if it fails?
   - How many retries? What backoff strategy?
   - Should user be notified via BLE?

2. **Backend Concurrency**
   - Confirmed: Ping all machines simultaneously
   - Need to implement proper MQTT subscription handling

3. **Database Updates**
   - Phase 1: In-memory only
   - Phase 2: Persist status to database

4. **MQTT Implementation**
   - Phase 1: Simplified approach (may need Device Shadow polling)
   - Phase 2: Full MQTT subscription via WebSocket or Device SDK

---

## Success Criteria

- [ ] Pi auto-registers with AWS IoT after WiFi provisioning
- [ ] Dashboard loads with live connectivity status within 3 seconds
- [ ] Online machines show current WiFi SSID
- [ ] Offline machines show as offline
- [ ] System handles 10+ machines without performance issues
- [ ] No false positives/negatives in connectivity status
