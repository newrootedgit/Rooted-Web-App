# IoT Lambda Environment & Architecture Optimization

**Status**: Planning  
**Priority**: Medium  
**Timeline**: 2-3 weeks  
**Complexity**: Medium

## Problem Statement

### Current Issues
1. **Environment Configuration**: All Lambda functions hardcoded to prod environment via single `terraform.tfvars`
2. **Unnecessary Lambda**: `machine-config-response` Lambda adds latency/complexity for regular MQTT topic that API can subscribe to directly
3. **No Dev Testing**: Cannot test IoT infrastructure changes locally without deploying to production

### Current Architecture
```
AWS IoT Core
├── Lifecycle Events ($aws/events/presence/+/+)
│   └── IoT Rule → machine-lifecycle Lambda → API /internal/machines/lifecycle-event
└── Config Responses (rooted/machines/+/pong)
    └── IoT Rule → machine-config-response Lambda → API /internal/machines/config-response
```

### Why Lambdas Exist
- **Lifecycle Lambda**: REQUIRED - System topics like `$aws/events/presence` can ONLY be consumed via IoT Rules, not MQTT
- **Config Lambda**: UNNECESSARY - Regular MQTT topic, API can subscribe directly

## Solution Overview

### Phase 1: Mock System for Local Development
Build comprehensive mock system to test IoT flows locally without Lambda/AWS

### Phase 2: Remove Config Response Lambda
Eliminate unnecessary Lambda, subscribe to MQTT directly from API

### Phase 3: Production-Only Lambda Deployment
Keep Lambda deployment simple - prod only, test locally with mocks

---

## Phase 1: Mock System for Local Development

### Goals
- Test IoT flows locally without AWS infrastructure
- Mock Pi responses for all actions (presets, diagnostics, firmware updates)
- Support configurable test scenarios (success, failures, timeouts)
- Extensible for future Pi actions

### Architecture

```
LOCAL DEVELOPMENT:
  Frontend → tRPC → API (mocked IoT) → Mock Pi Simulator → Internal Endpoints

PRODUCTION:
  Frontend → tRPC → API → AWS IoT → Real Pi → Lambda → Internal Endpoints
```

### Implementation

#### 1.1 Environment Configuration

**File: `apps/api/.env.development`**
```env
# Mock IoT in non-prod by default
MOCK_IOT=true
MOCK_IOT_DELAY_MS=500  # Simulate network latency
MOCK_IOT_FAILURE_RATE=0  # 0-100, percentage of requests that fail
```

**File: `apps/api/.env.production`**
```env
MOCK_IOT=false
AWS_IOT_ENDPOINT=your-endpoint.iot.us-west-2.amazonaws.com
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

#### 1.2 Mock IoT Client

**File: `apps/api/src/lib/aws/iot-client.mock.ts`**
```typescript
import { mockPiSimulator } from '../testing/mock-pi-simulator.js';

export async function publishToDevice(
  thingName: string,
  payload: Record<string, unknown>
): Promise<void> {
  console.log(`[MOCK IoT] Publishing to ${thingName}:`, payload);
  
  // Simulate network delay
  const delay = parseInt(process.env.MOCK_IOT_DELAY_MS || '500');
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate random failures
  const failureRate = parseInt(process.env.MOCK_IOT_FAILURE_RATE || '0');
  if (Math.random() * 100 < failureRate) {
    throw new Error(`[MOCK IoT] Simulated publish failure for ${thingName}`);
  }
  
  // Trigger mock Pi response
  await mockPiSimulator.handleCommand(thingName, payload);
}
```

#### 1.3 Mock Pi Simulator

**File: `apps/api/src/lib/testing/mock-pi-simulator.ts`**
```typescript
import { mockLambdaCaller } from './mock-lambda-caller.js';
import { getMockPresetData } from './mock-preset-data.js';

type PiAction = 'get_presets' | 'update_presets' | 'get_diagnostics' | 'update_firmware';

interface ActionHandler {
  handle(thingName: string, payload: any): Promise<any>;
}

class MockPiSimulator {
  private handlers = new Map<PiAction, ActionHandler>();
  private devicePresets = new Map<string, any>();

  constructor() {
    this.registerDefaultHandlers();
  }

  registerAction(action: PiAction, handler: ActionHandler) {
    this.handlers.set(action, handler);
  }

  async handleCommand(thingName: string, payload: any): Promise<void> {
    const action = payload.action as PiAction;
    const requestId = payload.requestId;

    if (!requestId) {
      console.warn('[MOCK Pi] Missing requestId, ignoring');
      return;
    }

    const handler = this.handlers.get(action);
    if (!handler) {
      console.warn(`[MOCK Pi] Unknown action: ${action}`);
      return;
    }

    try {
      const response = await handler.handle(thingName, payload);
      await mockLambdaCaller.callConfigResponse({
        requestId,
        ...response,
      });
    } catch (error: any) {
      await mockLambdaCaller.callConfigResponse({
        requestId,
        action: `${action}_response`,
        error: error.message,
      });
    }
  }

  private registerDefaultHandlers() {
    // Get presets handler
    this.registerAction('get_presets', {
      handle: async (thingName: string) => {
        let presets = this.devicePresets.get(thingName);
        if (!presets) {
          presets = getMockPresetData(thingName);
          this.devicePresets.set(thingName, presets);
        }
        return {
          action: 'presets_response',
          config: presets,
        };
      },
    });

    // Update presets handler
    this.registerAction('update_presets', {
      handle: async (thingName: string, payload: any) => {
        let current = this.devicePresets.get(thingName) || getMockPresetData(thingName);

        if (payload.presets) {
          for (const [key, values] of Object.entries(payload.presets)) {
            if (current[key] && typeof current[key] === 'object') {
              current[key] = { ...current[key], ...values };
            } else {
              current[key] = values;
            }
          }
        }

        if (payload.variety_names) {
          current.variety_names = {
            ...current.variety_names,
            ...payload.variety_names,
          };
        }

        this.devicePresets.set(thingName, current);

        return {
          action: 'presets_updated',
          success: true,
        };
      },
    });
  }

  // For testing: reset device state
  resetDevice(thingName: string) {
    this.devicePresets.delete(thingName);
  }

  // For testing: set specific preset data
  setDevicePresets(thingName: string, presets: any) {
    this.devicePresets.set(thingName, presets);
  }
}

export const mockPiSimulator = new MockPiSimulator();
```

#### 1.4 Mock Lambda Caller

**File: `apps/api/src/lib/testing/mock-lambda-caller.ts`**
```typescript
import { handleConfigResponse } from '../../domains/machine-domain/mqtt/handleConfigResponse.js';
import { handleLifecycleEvent } from '../../domains/machine-domain/commands/handleLifecycleEvent.js';
import { prisma } from '../db/index.js';

class MockLambdaCaller {
  async callConfigResponse(payload: {
    requestId: string;
    action: string;
    config?: any;
    success?: boolean;
    error?: string;
  }): Promise<void> {
    console.log('[MOCK Lambda] Calling config-response handler:', payload);
    await handleConfigResponse(payload);
  }

  async callLifecycleEvent(payload: {
    deviceId: string;
    eventType: 'connected' | 'disconnected';
    timestamp: string;
    sessionId?: string;
    wifiSsid?: string;
  }): Promise<void> {
    console.log('[MOCK Lambda] Calling lifecycle-event handler:', payload);
    await handleLifecycleEvent(prisma, payload);
  }
}

export const mockLambdaCaller = new MockLambdaCaller();
```

#### 1.5 Mock Preset Data

**File: `apps/api/src/lib/testing/mock-preset-data.ts`**
```typescript
export function getMockPresetData(thingName: string): any {
  // Generate realistic preset data for 20 varieties
  const presets: any = {
    ready_to_run: false,
    active_variety: 1,
    variety_names: {},
  };

  for (let i = 1; i <= 20; i++) {
    presets[i.toString()] = {
      blade_speed: Math.floor(Math.random() * 10) + 1,
      belt_speed: Math.floor(Math.random() * 10) + 1,
      blade_height: Math.floor(Math.random() * 10) + 1,
      airknife_mode: Math.random() > 0.5 ? 1 : 0,
    };
    presets.variety_names[i.toString()] = `Variety ${i}`;
  }

  return presets;
}

// For testing specific scenarios
export const mockPresetScenarios = {
  empty: {
    ready_to_run: false,
    active_variety: 1,
    variety_names: {},
  },
  
  singleVariety: {
    ready_to_run: true,
    active_variety: 1,
    '1': {
      blade_speed: 5,
      belt_speed: 5,
      blade_height: 5,
      airknife_mode: 1,
    },
    variety_names: { '1': 'Sunflower' },
  },
  
  // Add more scenarios as needed
};
```

#### 1.6 IoT Client Factory

**File: `apps/api/src/lib/aws/iot-client.ts`**
```typescript
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';

// Real implementation
async function publishToDeviceReal(
  thingName: string,
  payload: Record<string, unknown>
): Promise<void> {
  const iotClient = new IoTDataPlaneClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_IOT_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const topic = `rooted/machines/${thingName}/commands`;

  await iotClient.send(
    new PublishCommand({
      topic,
      qos: 1,
      payload: Buffer.from(JSON.stringify(payload)),
    })
  );
}

// Export based on environment
export const publishToDevice =
  process.env.MOCK_IOT === 'true'
    ? (await import('./iot-client.mock.js')).publishToDevice
    : publishToDeviceReal;
```

#### 1.7 Testing Utilities

**File: `apps/api/src/lib/testing/iot-test-helpers.ts`**
```typescript
import { mockPiSimulator } from './mock-pi-simulator.js';
import { mockLambdaCaller } from './mock-lambda-caller.js';

export const iotTestHelpers = {
  // Simulate device connection
  async simulateDeviceConnect(deviceId: string) {
    await mockLambdaCaller.callLifecycleEvent({
      deviceId,
      eventType: 'connected',
      timestamp: new Date().toISOString(),
    });
  },

  // Simulate device disconnection
  async simulateDeviceDisconnect(deviceId: string) {
    await mockLambdaCaller.callLifecycleEvent({
      deviceId,
      eventType: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  },

  // Set custom preset data for testing
  setDevicePresets(thingName: string, presets: any) {
    mockPiSimulator.setDevicePresets(thingName, presets);
  },

  // Reset device state
  resetDevice(thingName: string) {
    mockPiSimulator.resetDevice(thingName);
  },

  // Simulate timeout (set high delay)
  simulateTimeout() {
    process.env.MOCK_IOT_DELAY_MS = '30000';
  },

  // Simulate failures
  simulateFailures(rate: number) {
    process.env.MOCK_IOT_FAILURE_RATE = rate.toString();
  },

  // Reset to normal
  resetSimulation() {
    process.env.MOCK_IOT_DELAY_MS = '500';
    process.env.MOCK_IOT_FAILURE_RATE = '0';
  },
};
```

### Testing Phase 1

#### Manual Testing
```bash
# Start API with mocks enabled (default in dev)
cd apps/api
pnpm dev

# Test preset fetch
curl -X POST http://localhost:8000/api/trpc/machines.requestConfig \
  -H "Content-Type: application/json" \
  -d '{"machineId": "test-machine-id"}'

# Test preset update
curl -X POST http://localhost:8000/api/trpc/machines.updateConfig \
  -H "Content-Type: application/json" \
  -d '{"machineId": "test-machine-id", "presets": {"1": {"blade_speed": 10}}}'
```

#### Automated Tests
```typescript
// Example test
describe('Machine Config with Mocks', () => {
  beforeEach(() => {
    iotTestHelpers.resetSimulation();
  });

  it('should fetch presets from mock Pi', async () => {
    const { requestId } = await requestMachineConfig(prisma, machineId, tenantId);
    
    // Wait for mock response
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const response = await getConfigResponse(requestId);
    expect(response).toBeDefined();
    expect(response.config).toHaveProperty('ready_to_run');
  });

  it('should handle timeout scenarios', async () => {
    iotTestHelpers.simulateTimeout();
    
    const { requestId } = await requestMachineConfig(prisma, machineId, tenantId);
    
    // Should timeout after 15 seconds
    await expect(
      waitForResponse(requestId, 15000)
    ).rejects.toThrow('timeout');
  });
});
```

### Extensibility for Future Actions

Adding new Pi actions is straightforward:

```typescript
// Add diagnostics support
mockPiSimulator.registerAction('get_diagnostics', {
  handle: async (thingName: string) => {
    return {
      action: 'diagnostics_response',
      data: {
        cpu_temp: 45.2,
        memory_usage: 62.5,
        disk_space: 85.3,
        uptime: 86400,
      },
    };
  },
});

// Add firmware update support
mockPiSimulator.registerAction('update_firmware', {
  handle: async (thingName: string, payload: any) => {
    // Simulate firmware update process
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return {
      action: 'firmware_updated',
      success: true,
      version: payload.version,
    };
  },
});
```

---

## Phase 2: Remove Config Response Lambda

### Goals
- Eliminate `machine-config-response` Lambda
- Subscribe to `rooted/machines/+/pong` directly from API
- Reduce latency and infrastructure complexity

### Why This Works
The config response Lambda is unnecessary because:
1. It subscribes to a regular MQTT topic (`rooted/machines/+/pong`)
2. Regular MQTT topics can be consumed directly by any MQTT client
3. The Lambda just forwards messages to the API - adding latency

**Contrast**: The lifecycle Lambda is required because it subscribes to `$aws/events/presence/+/+` - a system topic that can ONLY be consumed via IoT Rules.

### Implementation

#### 2.1 Add AWS IoT MQTT Client to API

**File: `apps/api/src/lib/iot/mqtt-client.ts`**
```typescript
import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { handleConfigResponse } from '../../domains/machine-domain/mqtt/handleConfigResponse.js';

let connection: mqtt.MqttClientConnection | null = null;

export async function initIoTMqttClient() {
  if (connection) return connection;

  const config = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
    process.env.IOT_CERT_PATH!,
    process.env.IOT_KEY_PATH!
  )
    .with_certificate_authority_from_path(process.env.IOT_CA_PATH!)
    .with_client_id(`rooted-api-${process.env.ENVIRONMENT}`)
    .with_endpoint(process.env.IOT_ENDPOINT!)
    .build();

  const client = new mqtt.MqttClient();
  connection = client.new_connection(config);

  connection.on('connect', () => {
    console.log('Connected to AWS IoT Core');
  });

  connection.on('error', (error) => {
    console.error('IoT connection error:', error);
  });

  connection.on('disconnect', () => {
    console.log('Disconnected from AWS IoT Core');
  });

  await connection.connect();

  // Subscribe to config responses
  await connection.subscribe(
    'rooted/machines/+/pong',
    mqtt.QoS.AtLeastOnce,
    async (topic, payload) => {
      try {
        const message = JSON.parse(new TextDecoder().decode(payload));
        await handleConfigResponse(message);
      } catch (error) {
        console.error('Error handling config response:', error);
      }
    }
  );

  console.log('Subscribed to rooted/machines/+/pong');

  return connection;
}

export async function disconnectIoTMqtt() {
  if (connection) {
    await connection.disconnect();
    connection = null;
  }
}
```

#### 2.2 Initialize MQTT Client on API Startup

**File: `apps/api/src/index.ts`**
```typescript
import { initIoTMqttClient, disconnectIoTMqtt } from './lib/iot/mqtt-client.js';

// After fastify.listen()
if (process.env.MOCK_IOT !== 'true') {
  await initIoTMqttClient();
  console.log('IoT MQTT client initialized');
}

// On shutdown
fastify.addHook('onClose', async () => {
  if (process.env.MOCK_IOT !== 'true') {
    await disconnectIoTMqtt();
  }
});
```

#### 2.3 Add Environment Variables

**File: `apps/api/.env.production`**
```env
# AWS IoT Core MQTT Client
IOT_ENDPOINT=your-endpoint.iot.us-west-2.amazonaws.com
IOT_CERT_PATH=/etc/rooted/certs/api-cert.pem
IOT_KEY_PATH=/etc/rooted/certs/api-private.key
IOT_CA_PATH=/etc/rooted/certs/AmazonRootCA1.pem
ENVIRONMENT=prod
```

#### 2.4 Create IoT Thing for API

```bash
# Create IoT Thing for API
aws iot create-thing --thing-name rooted-api-prod

# Create certificates
aws iot create-keys-and-certificate \
  --set-as-active \
  --certificate-pem-outfile api-cert.pem \
  --public-key-outfile api-public.key \
  --private-key-outfile api-private.key

# Attach policy (use existing machine policy or create API-specific one)
aws iot attach-policy \
  --policy-name rooted-machine-policy-prod \
  --target <certificate-arn>

# Attach certificate to thing
aws iot attach-thing-principal \
  --thing-name rooted-api-prod \
  --principal <certificate-arn>

# Copy certificates to EC2
scp api-cert.pem api-private.key ubuntu@<ec2-ip>:/etc/rooted/certs/
```

#### 2.5 Remove Config Lambda from Terraform

**File: `infra/terraform/lambda.tf`**
```hcl
# DELETE these resources:
# - aws_lambda_function.machine_config_response
# - aws_cloudwatch_log_group.config_response_lambda_logs
# - aws_lambda_permission.allow_iot_config_response
# - aws_lambda_function_event_invoke_config.config_response

# KEEP only machine_lifecycle Lambda
```

**File: `infra/terraform/iot.tf`**
```hcl
# DELETE this resource:
# - aws_iot_topic_rule.machine_config_response

# KEEP only aws_iot_topic_rule.machine_lifecycle
```

#### 2.6 Deploy Changes

```bash
cd infra/terraform

# Review changes
terraform plan -var-file="terraform.tfvars"

# Apply (will destroy config Lambda and IoT rule)
terraform apply -var-file="terraform.tfvars"
```

#### 2.7 Install Dependencies

```bash
cd apps/api
pnpm add aws-iot-device-sdk-v2
```

### Testing Phase 2

#### Parallel Testing (Recommended)
1. Deploy MQTT client to production
2. Keep Lambda running in parallel
3. Monitor both CloudWatch logs and API logs
4. Verify both receive messages for 48 hours
5. Remove Lambda after validation

#### Validation Checklist
- [ ] API connects to IoT Core on startup
- [ ] API receives messages on `rooted/machines/+/pong`
- [ ] Config responses processed correctly
- [ ] No errors in API logs
- [ ] Verify Lambda no longer invoked (after removal)
- [ ] Test reconnection after API restart

---

## Phase 3: Production-Only Lambda Deployment

### Goals
- Keep Lambda deployment simple - production only
- No separate dev/staging Lambda infrastructure
- Test locally with mocks, deploy to prod with confidence

### Rationale

**Why not multi-environment Lambdas?**
- Lambda cannot call localhost - dev Lambda would need publicly accessible dev API
- Setting up dev EC2 + dev Lambda adds complexity without much benefit
- Mock system provides faster feedback loop than deploying to dev AWS
- Production Lambda is simple and stable - rarely needs changes

**When to use mocks vs production:**
- **Local development**: Always use mocks (`MOCK_IOT=true`)
- **Production**: Real AWS IoT + Lambda (`MOCK_IOT=false`)
- **Testing**: Mocks with configurable scenarios

### Current Setup (Keep As-Is)

**File: `infra/terraform/terraform.tfvars`**
```hcl
aws_region          = "us-west-2"
project_name        = "rooted"
environment         = "prod"
api_endpoint        = "https://your-prod-domain.com"  # Update from ngrok
lambda_secret_token = "<secure-token>"
ec2_key_name        = "rooted-prod-key"
```

**No changes needed** - current Terraform setup already works for prod-only deployment.

### Update Production API Endpoint

Once you have a permanent domain:

```bash
cd infra/terraform

# Update terraform.tfvars
# Change api_endpoint from ngrok URL to permanent domain

# Apply changes
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars"
```

### Deployment Workflow

**Local Development:**
```bash
cd apps/api
MOCK_IOT=true pnpm dev  # Mocks enabled by default
```

**Production Deployment:**
```bash
# Deploy via GitHub Actions (existing workflow)
# Workflow already deploys to production EC2
# No Lambda deployment needed (managed by Terraform)
```

**Lambda Updates (Rare):**
```bash
cd infra/lambda/machine-lifecycle
# Update index.js
zip -r ../machine-lifecycle.zip .

cd ../../terraform
terraform apply -var-file="terraform.tfvars"
```

---

## Migration Plan

### Pre-Migration Checklist
- [ ] Implement mock system (Phase 1)
- [ ] Test all IoT flows locally with mocks
- [ ] Create IoT Thing and certificates for API
- [ ] Test MQTT client connection in staging/dev
- [ ] Document rollback procedure

### Migration Steps

#### Week 1: Implement Mock System
1. Create mock IoT client and Pi simulator
2. Add environment configuration
3. Test locally with frontend
4. Verify all preset operations work
5. Add test scenarios (timeouts, failures)

**Validation**: All IoT features work locally without AWS

#### Week 2: Add MQTT Client to API
1. Install `aws-iot-device-sdk-v2`
2. Create IoT Thing for API (`rooted-api-prod`)
3. Generate and configure certificates
4. Implement MQTT client
5. Deploy to production (keep Lambda running)

**Validation**: API receives pong messages, both Lambda and MQTT client work

#### Week 3: Remove Config Lambda
1. Monitor both systems in parallel for 48 hours
2. Verify zero message loss
3. Remove Lambda from Terraform
4. Apply infrastructure changes
5. Clean up Lambda code and IoT Rule

**Validation**: Only MQTT client receives messages, no errors

#### Week 4: Documentation & Cleanup
1. Update README with mock usage
2. Document MQTT client setup
3. Add troubleshooting guide
4. Remove internal config-response endpoint (optional)
5. Update architecture diagrams

### Rollback Plan

**If MQTT client fails:**
1. Redeploy config Lambda from git history
2. Apply Terraform to recreate IoT Rule
3. Restart API without MQTT client
4. Investigate and fix issues

**Rollback time**: ~15 minutes

**Rollback command:**
```bash
cd infra/terraform
git checkout HEAD~1 lambda.tf iot.tf
terraform apply -var-file="terraform.tfvars"
```

---

## Environment Variables Summary

### Local Development

**File: `apps/api/.env.development`**
```env
# Database
DATABASE_URL=postgresql://rooted:rooted_dev_password@localhost:5433/rooted_planner
REDIS_URL=redis://localhost:6379

# Mock IoT (enabled by default in dev)
MOCK_IOT=true
MOCK_IOT_DELAY_MS=500
MOCK_IOT_FAILURE_RATE=0

# Auth
CLERK_SECRET_KEY=your_clerk_secret
LAMBDA_SECRET_TOKEN=dev-secret-token

# Server
PORT=8000
ENVIRONMENT=dev
```

### Production

**File: `apps/api/.env.production` (on EC2)**
```env
# Database
DATABASE_URL=postgresql://rooted:prod_password@prod-rds:5432/rooted_prod
REDIS_URL=redis://prod-redis:6379

# Real AWS IoT
MOCK_IOT=false
AWS_REGION=us-west-2
AWS_IOT_ENDPOINT=your-endpoint.iot.us-west-2.amazonaws.com
AWS_ACCESS_KEY_ID=<from-secrets-manager>
AWS_SECRET_ACCESS_KEY=<from-secrets-manager>

# IoT MQTT Client (for Phase 2)
IOT_ENDPOINT=your-endpoint.iot.us-west-2.amazonaws.com
IOT_CERT_PATH=/etc/rooted/certs/api-cert.pem
IOT_KEY_PATH=/etc/rooted/certs/api-private.key
IOT_CA_PATH=/etc/rooted/certs/AmazonRootCA1.pem

# Auth
CLERK_SECRET_KEY=<from-secrets-manager>
LAMBDA_SECRET_TOKEN=<from-secrets-manager>

# Server
PORT=8000
ENVIRONMENT=prod
```

---

## Success Metrics

### Phase 1 Success (Mock System)
- ✅ All IoT operations work locally without AWS
- ✅ Mock Pi simulator handles all actions correctly
- ✅ Configurable test scenarios (success, timeout, failure)
- ✅ Easy to add new Pi actions
- ✅ Frontend can test preset sync end-to-end locally

### Phase 2 Success (Remove Config Lambda)
- ✅ API subscribes to MQTT successfully
- ✅ Config responses processed < 100ms latency
- ✅ Zero message loss during migration
- ✅ Config Lambda removed from infrastructure
- ✅ CloudWatch costs reduced by ~50%

### Phase 3 Success (Simplified Deployment)
- ✅ Production Lambda stable and unchanged
- ✅ No dev/staging Lambda complexity
- ✅ Clear separation: mocks for dev, real AWS for prod
- ✅ Fast local development feedback loop

---

## Cost Impact

### Current Costs
- 2 Lambda functions × $0.20/million invocations
- 2 CloudWatch log groups × $0.50/GB
- 2 IoT Rules: $0.15/million actions

### After Migration
- 1 Lambda function (50% reduction)
- 1 CloudWatch log group (50% reduction)
- 1 IoT Rule (50% reduction)
- MQTT connection: ~$0.08/month (negligible)

**Estimated Savings**: ~$5-10/month

**More Important Benefits**:
- Reduced latency (no Lambda cold starts for config responses)
- Simpler architecture (fewer moving parts)
- Faster local development (no AWS required)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| MQTT connection drops | High | Auto-reconnect logic in SDK, health checks |
| Message loss during migration | Medium | Run both systems in parallel for 48h |
| Mock diverges from real Pi | Medium | Keep mock handlers in sync with Pi code |
| Certificate management | Low | Document cert creation, use secure storage |
| API restart loses MQTT connection | Low | Reconnect on startup, PM2 handles restarts |

---

## Documentation Updates

After completion, update:
- [ ] `README.md` - Add mock system usage
- [ ] `docs/machine-iot/ARCH.md` - Update architecture diagram
- [ ] `apps/api/README.md` - Document MQTT client setup
- [ ] `infra/terraform/README.md` - Clarify prod-only deployment
- [ ] Add troubleshooting guide for MQTT connection issues

---

## Future Enhancements

### Additional Pi Actions (Planned)
Using the extensible mock system:

```typescript
// Diagnostics
mockPiSimulator.registerAction('get_diagnostics', handler);

// Firmware updates
mockPiSimulator.registerAction('update_firmware', handler);

// Real-time sensor data
mockPiSimulator.registerAction('stream_sensors', handler);
```

### Monitoring & Alerts
- CloudWatch alarms for MQTT disconnects
- Lambda error rate alerts (lifecycle Lambda)
- Cost anomaly detection

### Certificate Rotation
- Automate certificate renewal
- Move secrets to AWS Secrets Manager
- Rotate Lambda secret tokens
