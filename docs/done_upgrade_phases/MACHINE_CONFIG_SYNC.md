# Machine Configuration Sync - Bidirectional Presets via AWS IoT MQTT

## Overview

This upgrade adds bidirectional machine configuration sync between the web app and Raspberry Pi devices. Users can view and edit machine presets from a new "Presets" tab, with changes delivered to the Pi via AWS IoT MQTT and acknowledged in real-time. The schema is machine-agnostic -- each preset is a flexible key-value map of numbers, so different machine types (HARVESTER, SEEDER, WASHER) can have different config fields without code changes.

## Architecture

### Communication Flow

```
FETCH CONFIG:
  Frontend                Backend                  AWS IoT              Pi
     |                       |                        |                  |
     |-- requestConfig -->   |                        |                  |
     |   (returns requestId) |-- publish to ping -->   |-- deliver -->   |
     |                       |                        |                  |-- reads config.json
     |                       |                        |   <-- pong --    |
     |                       |   <-- IoT Rule+Lambda   |                  |
     |                       |   stores in memory     |                  |
     |-- poll(requestId) --> |   (returns config)     |                  |

UPDATE CONFIG:
  Frontend                Backend                  AWS IoT              Pi
     |                       |                        |                  |
     |-- updateConfig -->    |                        |                  |
     |   (returns requestId) |-- publish to ping -->   |-- deliver -->   |
     |                       |                        |                  |-- writes config.json
     |                       |                        |   <-- pong ack   |
     |                       |   <-- IoT Rule+Lambda   |                  |
     |-- poll(requestId) --> |   (returns ack)        |                  |
```

### MQTT Topics (already in IoT policy)

| Topic | Direction | Purpose |
|-------|-----------|---------|
| `rooted/machines/{thingName}/ping` | Backend → Pi | Commands (get_config, update_config) |
| `rooted/machines/{thingName}/pong` | Pi → Backend | Responses (config data, ack) |

### Config JSON Structure (stored on Pi at `/opt/rooted-ble/config.json`)

```json
{
  "ready_to_run": false,
  "active_variety": 1,
  "1": {
    "blade_speed": 1,
    "belt_speed": 1,
    "blade_height": 1,
    "airknife_mode": 0
  },
  "2": { "..." },
  "...": "...",
  "20": { "..." }
}
```

- **20 numbered variety presets** (1-20), each containing arbitrary numeric key-value pairs
- Preset fields vary per machine type (e.g. a harvester has blade_speed/belt_speed, a washer may have different fields)
- The web app treats presets as `Record<string, number>` -- it renders whatever keys the Pi sends
- `ready_to_run` and `active_variety` are **read-only** from the web app
- Only preset values (keys "1"-"20") are editable from the web

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Transport** | AWS IoT MQTT ping/pong | Topics already defined in IoT policy; reuses existing infrastructure |
| **Response correlation** | In-memory Map with TTL | Single PM2 process; no Redis needed for ephemeral 60s data |
| **Pong routing** | IoT Rule → Lambda → Internal endpoint | Follows existing lifecycle event pattern exactly |
| **Frontend polling** | tRPC query with refetchInterval | Clean, stops automatically when requestId cleared |
| **Poll interval** | 1.5 seconds | Balances responsiveness with server load |
| **Timeout** | 15 seconds | Generous for slow networks, short enough for UX |
| **QoS** | 1 (at least once) | Ensures delivery; requestId provides idempotency |
| **Config validation** | Pi only merges keys "1"-"20" | Prevents web from modifying ready_to_run or active_variety |
| **Preset schema** | Agnostic `Record<string, number>` | Different machine types have different config fields; frontend renders dynamically |

---

## Implementation Steps

### Step 1: Install AWS SDK

```bash
cd apps/api
pnpm add @aws-sdk/client-iot-data-plane
```

### Step 2: Create IoT Publish Client

**New file:** `apps/api/src/lib/aws/iot-client.ts`

```typescript
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';

const iotClient = new IoTDataPlaneClient({
  region: process.env.AWS_REGION,
  endpoint: `https://${process.env.AWS_IOT_ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function publishToDevice(
  thingName: string,
  payload: Record<string, unknown>
): Promise<void> {
  const topic = `rooted/machines/${thingName}/ping`;
  await iotClient.send(new PublishCommand({
    topic,
    payload: Buffer.from(JSON.stringify(payload)),
    qos: 1,
  }));
}
```

Uses existing env vars: `AWS_REGION`, `AWS_IOT_ENDPOINT`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.

### Step 3: Create In-Memory Response Store

**New file:** `apps/api/src/lib/aws/config-store.ts`

```typescript
const CONFIG_TTL_MS = 60_000; // 60 seconds

interface StoredResponse {
  data: Record<string, unknown>;
  expiresAt: number;
}

const store = new Map<string, StoredResponse>();

export function storeResponse(requestId: string, data: Record<string, unknown>): void {
  store.set(requestId, { data, expiresAt: Date.now() + CONFIG_TTL_MS });
}

export function getResponse(requestId: string): Record<string, unknown> | null {
  const entry = store.get(requestId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(requestId);
    return null;
  }
  return entry.data;
}
```

No Redis dependency. Entries auto-expire on read. Suitable for single-process PM2 deployment.

### Step 4: Add Config Types and Schemas

**Modify:** `apps/api/src/domains/machine-domain/types.ts`

```typescript
// Add after existing schemas:

// Agnostic preset schema - each preset is a flexible map of string keys to numbers.
// Different machine types can have different fields (e.g. blade_speed, wash_pressure, etc.)
export const varietyPresetSchema = z.record(z.string(), z.number());

export const machineConfigSchema = z.object({
  ready_to_run: z.boolean(),
  active_variety: z.number().int().min(1).max(20),
}).catchall(varietyPresetSchema);

export type VarietyPreset = z.infer<typeof varietyPresetSchema>;
export type MachineConfig = z.infer<typeof machineConfigSchema>;

export const requestConfigSchema = z.object({
  machineId: z.string().uuid(),
});

export const getConfigResponseSchema = z.object({
  requestId: z.string().uuid(),
});

export const updateConfigSchema = z.object({
  machineId: z.string().uuid(),
  presets: z.record(
    z.string().regex(/^([1-9]|1[0-9]|20)$/),
    varietyPresetSchema
  ),
});
```

### Step 5: Create Backend Commands

**New file:** `apps/api/src/domains/machine-domain/commands/requestMachineConfig.ts`

```typescript
import type { PrismaClient } from '../../../generated/prisma/client.js';
import { TRPCError } from '@trpc/server';
import { publishToDevice } from '../../../lib/aws/iot-client.js';
import { randomUUID } from 'crypto';

export async function requestMachineConfig(
  prisma: PrismaClient,
  machineId: string,
  tenantId: string
): Promise<{ requestId: string }> {
  const machine = await prisma.machines.findFirst({
    where: { id: machineId, tenant_id: tenantId },
  });

  if (!machine) throw new TRPCError({ code: 'NOT_FOUND', message: 'Machine not found' });
  if (!machine.aws_iot_thing_name)
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Machine not IoT-registered' });
  if (machine.status !== 'online')
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Machine is offline' });

  const requestId = randomUUID();
  await publishToDevice(machine.aws_iot_thing_name, {
    action: 'get_config',
    requestId,
  });

  return { requestId };
}
```

**New file:** `apps/api/src/domains/machine-domain/commands/updateMachineConfig.ts`

```typescript
import type { PrismaClient } from '../../../generated/prisma/client.js';
import { TRPCError } from '@trpc/server';
import { publishToDevice } from '../../../lib/aws/iot-client.js';
import { randomUUID } from 'crypto';
export async function updateMachineConfig(
  prisma: PrismaClient,
  machineId: string,
  tenantId: string,
  presets: Record<string, Record<string, number>>
): Promise<{ requestId: string }> {
  const machine = await prisma.machines.findFirst({
    where: { id: machineId, tenant_id: tenantId },
  });

  if (!machine) throw new TRPCError({ code: 'NOT_FOUND', message: 'Machine not found' });
  if (!machine.aws_iot_thing_name)
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Machine not IoT-registered' });
  if (machine.status !== 'online')
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Machine is offline' });

  const requestId = randomUUID();
  await publishToDevice(machine.aws_iot_thing_name, {
    action: 'update_config',
    requestId,
    config: presets,
  });

  return { requestId };
}
```

**New file:** `apps/api/src/domains/machine-domain/commands/handleConfigResponse.ts`

```typescript
import { storeResponse } from '../../../lib/aws/config-store.js';

interface ConfigResponseInput {
  requestId: string;
  action: 'config_response' | 'config_updated';
  config?: Record<string, unknown>;
  success?: boolean;
  error?: string;
}

export async function handleConfigResponse(input: ConfigResponseInput): Promise<void> {
  storeResponse(input.requestId, {
    action: input.action,
    config: input.config,
    success: input.success,
    error: input.error,
  });
}
```

### Step 6: Create Backend Query

**New file:** `apps/api/src/domains/machine-domain/queries/getConfigResponse.ts`

```typescript
import { getResponse } from '../../../lib/aws/config-store.js';

export function getConfigResponse(requestId: string): {
  status: 'pending' | 'received' | 'error';
  config?: Record<string, unknown>;
  success?: boolean;
  error?: string;
} {
  const data = getResponse(requestId);
  if (!data) return { status: 'pending' };
  if (data.error) return { status: 'error', error: data.error as string };
  return {
    status: 'received',
    config: data.config as Record<string, unknown> | undefined,
    success: data.success as boolean | undefined,
  };
}
```

### Step 7: Update Barrel Exports

**Modify:** `apps/api/src/domains/machine-domain/commands/index.ts`

```typescript
export { createOrUpdateMachine } from './createOrUpdateMachine.js';
export { deleteMachine } from './deleteMachine.js';
export { handleLifecycleEvent } from './handleLifecycleEvent.js';
export { requestMachineConfig } from './requestMachineConfig.js';
export { updateMachineConfig } from './updateMachineConfig.js';
export { handleConfigResponse } from './handleConfigResponse.js';
```

**Modify:** `apps/api/src/domains/machine-domain/queries/index.ts`

```typescript
// ... existing exports ...
export { getConfigResponse } from './getConfigResponse.js';
```

### Step 8: Add tRPC Endpoints

**Modify:** `apps/api/src/domains/machine-domain/router.ts`

```typescript
import { requestConfigSchema, getConfigResponseSchema, updateConfigSchema } from './types.js';
import { requestMachineConfig, updateMachineConfig } from './commands/index.js';
import { getConfigResponse } from './queries/index.js';

// Add to machineRouter:
requestConfig: tenantProcedure
  .input(requestConfigSchema)
  .mutation(({ ctx, input }) =>
    requestMachineConfig(ctx.prisma, input.machineId, ctx.tenantId)
  ),

getConfigResponse: authedProcedure
  .input(getConfigResponseSchema)
  .query(({ input }) =>
    getConfigResponse(input.requestId)
  ),

updateConfig: tenantProcedure
  .input(updateConfigSchema)
  .mutation(({ ctx, input }) =>
    updateMachineConfig(ctx.prisma, input.machineId, ctx.tenantId, input.presets)
  ),
```

### Step 9: Add Internal Webhook Route

**Modify:** `apps/api/src/domains/machine-domain/internal-routes.ts`

Add second POST handler inside `registerInternalRoutes`, after the lifecycle-event handler:

```typescript
interface ConfigResponseBody {
  requestId: string;
  action: 'config_response' | 'config_updated';
  config?: Record<string, unknown>;
  success?: boolean;
  error?: string;
}

fastify.post<{ Body: ConfigResponseBody }>(
  '/internal/machines/config-response',
  {
    preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
      const authHeader = request.headers.authorization;
      const expectedToken = `Bearer ${process.env.LAMBDA_SECRET_TOKEN}`;
      if (!authHeader || authHeader !== expectedToken) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
      }
    }
  },
  async (request, reply) => {
    try {
      const { requestId, action, config, success, error } = request.body;
      if (!requestId || !action) {
        reply.code(400).send({ error: 'Missing required fields' });
        return;
      }
      await handleConfigResponse({ requestId, action, config, success, error });
      reply.code(200).send({ success: true });
    } catch (error: any) {
      request.log.error(error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  }
);
```

Same auth pattern as the existing lifecycle-event endpoint.

---

### Step 10: Create Config Response Lambda

**New file:** `infra/lambda/machine-config-response/index.js`

Follows the exact pattern of `infra/lambda/machine-lifecycle/index.js`:

```javascript
const https = require('https');

const API_ENDPOINT = process.env.API_ENDPOINT;
const SECRET_TOKEN = process.env.SECRET_TOKEN;

exports.handler = async (event) => {
  console.log('Received config response:', JSON.stringify(event, null, 2));

  try {
    const { requestId, action, config, success, error } = event;

    if (!requestId || !action) {
      console.error('Missing required fields:', { requestId, action });
      return { statusCode: 400, body: 'Missing required fields' };
    }

    const payload = { requestId, action, config, success, error };
    await callAPI(payload);
    console.log('API call successful');
    return { statusCode: 200, body: 'Success' };
  } catch (error) {
    console.error('Error processing config response:', error);
    return { statusCode: 500, body: 'Internal server error' };
  }
};

function callAPI(payload) {
  return new Promise((resolve, reject) => {
    const url = new URL('/internal/machines/config-response', API_ENDPOINT);

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
```

### Step 11: Update Terraform

**Modify:** `infra/terraform/iot.tf` - Add IoT Rule for pong topic:

```hcl
# IoT Rule for Machine Config Responses (pong topic)
resource "aws_iot_topic_rule" "machine_config_response" {
  name        = "${var.project_name}_machine_config_response_${var.environment}"
  description = "Route machine config responses from pong topic to Lambda"
  enabled     = true
  sql         = "SELECT * FROM 'rooted/machines/+/pong'"
  sql_version = "2016-03-23"

  lambda {
    function_arn = aws_lambda_function.machine_config_response.arn
  }

  error_action {
    cloudwatch_logs {
      log_group_name = aws_cloudwatch_log_group.iot_rule_errors.name
      role_arn       = aws_iam_role.iot_rule.arn
    }
  }
}
```

**Modify:** `infra/terraform/lambda.tf` - Add Lambda function:

```hcl
resource "aws_lambda_function" "machine_config_response" {
  filename         = "${path.module}/../lambda/machine-config-response.zip"
  function_name    = "${var.project_name}-machine-config-response-${var.environment}"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("${path.module}/../lambda/machine-config-response.zip")
  runtime          = "nodejs18.x"
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      API_ENDPOINT = var.api_endpoint
      SECRET_TOKEN = var.lambda_secret_token
      ENVIRONMENT  = var.environment
    }
  }

  depends_on = [aws_cloudwatch_log_group.config_response_lambda_logs]
}

resource "aws_cloudwatch_log_group" "config_response_lambda_logs" {
  name              = "/aws/lambda/${var.project_name}-machine-config-response-${var.environment}"
  retention_in_days = 14
}

resource "aws_lambda_permission" "allow_iot_config_response" {
  statement_id  = "AllowExecutionFromIoTConfigResponse"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.machine_config_response.function_name
  principal     = "iot.amazonaws.com"
  source_arn    = aws_iot_topic_rule.machine_config_response.arn
}

resource "aws_lambda_function_event_invoke_config" "config_response" {
  function_name          = aws_lambda_function.machine_config_response.function_name
  maximum_retry_attempts = 2

  destination_config {
    on_failure {
      destination = aws_sqs_queue.lambda_dlq.arn
    }
  }
}
```

---

### Step 12: Update Pi MQTT Handler

**Modify:** `pi-src/aws_iot_registration.py`

Add message handling after the MQTT connection is established:

```python
import json
import os
import time
from awsiot import mqtt_connection_builder
from awscrt.mqtt import QoS

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEVICE_FILE = os.path.join(SCRIPT_DIR, 'device_config.json')
CONFIG_PATH = os.path.join(SCRIPT_DIR, 'config.json')
CERTS_DIR = os.path.join(SCRIPT_DIR, 'certs')

mqtt_connection = None  # Module-level for access from handlers


def on_message_received(topic, payload, **kwargs):
    """Handle incoming MQTT messages on the ping topic."""
    try:
        message = json.loads(payload)
        action = message.get('action')
        request_id = message.get('requestId')

        if action == 'get_config':
            handle_get_config(request_id)
        elif action == 'update_config':
            handle_update_config(request_id, message.get('config', {}))
        else:
            print(f"Unknown action: {action}")
    except Exception as e:
        print(f"Error handling message: {e}")
        if request_id:
            publish_pong({'action': 'error', 'requestId': request_id, 'error': str(e)})


def handle_get_config(request_id):
    """Read local config and publish it back."""
    try:
        with open(CONFIG_PATH, 'r') as f:
            config = json.load(f)
        publish_pong({
            'action': 'config_response',
            'requestId': request_id,
            'config': config,
        })
    except FileNotFoundError:
        publish_pong({
            'action': 'config_response',
            'requestId': request_id,
            'error': 'Config file not found',
        })


def handle_update_config(request_id, new_presets):
    """Merge new presets into local config and save."""
    try:
        with open(CONFIG_PATH, 'r') as f:
            config = json.load(f)

        # Only update numbered preset keys (1-20)
        for key, value in new_presets.items():
            if key.isdigit() and 1 <= int(key) <= 20:
                config[key] = value

        with open(CONFIG_PATH, 'w') as f:
            json.dump(config, f, indent=2)

        publish_pong({
            'action': 'config_updated',
            'requestId': request_id,
            'success': True,
        })
    except Exception as e:
        publish_pong({
            'action': 'config_updated',
            'requestId': request_id,
            'success': False,
            'error': str(e),
        })


def publish_pong(payload):
    """Publish a message to the pong topic."""
    config = get_device_config()
    thing_name = config.get('thing_name', config['device_id'])
    topic = f"rooted/machines/{thing_name}/pong"
    mqtt_connection.publish(
        topic=topic,
        payload=json.dumps(payload),
        qos=QoS.AT_LEAST_ONCE,
    )
    print(f"Published to {topic}: {payload.get('action')}")


# In connect_to_aws_iot(), after connect_future.result():
# config = get_device_config()
# thing_name = config.get('thing_name', config['device_id'])
# ping_topic = f"rooted/machines/{thing_name}/ping"
# subscribe_future, _ = mqtt_connection.subscribe(
#     topic=ping_topic,
#     qos=QoS.AT_LEAST_ONCE,
#     callback=on_message_received,
# )
# subscribe_future.result()
# print(f"Subscribed to {ping_topic}")
```

---

### Step 13: Create Frontend Hook

**New file:** `src/machines/presets/hooks/useMachineConfig.ts`

```typescript
import { useState, useCallback, useRef, useEffect } from 'react';
import { trpc } from '../../../lib/trpc';

const POLL_INTERVAL = 1500;
const TIMEOUT = 15000;

type ConfigStatus = 'idle' | 'fetching' | 'received' | 'updating' | 'updated' | 'error' | 'timeout';

export function useMachineConfig(machineId: string) {
  const [status, setStatus] = useState<ConfigStatus>('idle');
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const requestConfigMutation = trpc.machines.requestConfig.useMutation();
  const updateConfigMutation = trpc.machines.updateConfig.useMutation();

  const pollQuery = trpc.machines.getConfigResponse.useQuery(
    { requestId: activeRequestId! },
    {
      enabled: !!activeRequestId,
      refetchInterval: POLL_INTERVAL,
    }
  );

  useEffect(() => {
    if (!pollQuery.data || pollQuery.data.status === 'pending') return;

    setActiveRequestId(null);
    clearTimeout(timeoutRef.current);

    if (pollQuery.data.status === 'received' && pollQuery.data.config) {
      setConfig(pollQuery.data.config);
      setStatus('received');
    } else if (pollQuery.data.status === 'received' && pollQuery.data.success !== undefined) {
      setStatus('updated');
    } else if (pollQuery.data.status === 'error') {
      setError(pollQuery.data.error || 'Unknown error');
      setStatus('error');
    }
  }, [pollQuery.data]);

  const fetchConfig = useCallback(async () => {
    setStatus('fetching');
    setError(null);
    try {
      const { requestId } = await requestConfigMutation.mutateAsync({ machineId });
      setActiveRequestId(requestId);
      timeoutRef.current = setTimeout(() => {
        setActiveRequestId(null);
        setStatus('timeout');
        setError('Machine did not respond in time');
      }, TIMEOUT);
    } catch (e: any) {
      setStatus('error');
      setError(e.message);
    }
  }, [machineId]);

  const updatePresets = useCallback(async (presets: Record<string, any>) => {
    setStatus('updating');
    setError(null);
    try {
      const { requestId } = await updateConfigMutation.mutateAsync({ machineId, presets });
      setActiveRequestId(requestId);
      timeoutRef.current = setTimeout(() => {
        setActiveRequestId(null);
        setStatus('timeout');
        setError('Machine did not acknowledge update');
      }, TIMEOUT);
    } catch (e: any) {
      setStatus('error');
      setError(e.message);
    }
  }, [machineId]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return { status, config, error, fetchConfig, updatePresets };
}
```

### Step 14: Create Frontend Components

**New file:** `src/machines/presets/components/PresetEditor.tsx`

- Dynamically renders number inputs for whatever keys the preset contains
- Props: `presetNumber`, `values: Record<string, number>`, `onSave`, `disabled`
- Iterates over `Object.entries(values)` to render each field -- no hardcoded field names
- Formats keys for display (e.g. `blade_speed` → `Blade Speed`)
- Highlights changed values, save button triggers update

**New file:** `src/machines/presets/components/PresetCard.tsx`

- Expandable card per machine (follows `MachineCard.tsx` pattern)
- On expand: calls `fetchConfig()` automatically
- Shows loading spinner, error/timeout states with Retry button
- Displays `ready_to_run` and `active_variety` as read-only badges
- Lists 20 presets in accordion/grid, each using `PresetEditor`

**New file:** `src/machines/presets/PresetsPage.tsx`

```typescript
import { trpc } from '../../lib/trpc';
import PresetCard from './components/PresetCard';

export default function PresetsPage() {
  const { data, isLoading } = trpc.machines.list.useQuery({});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Machine Presets</h1>
      {data?.items.map(machine => (
        <PresetCard key={machine.id} machine={machine} />
      ))}
    </div>
  );
}
```

### Step 15: Add Presets Tab to Sidebar

**Modify:** `src/machines/MachinesPage.tsx`

```typescript
import { SlidersHorizontal } from 'lucide-react';
import PresetsPage from './presets/PresetsPage';

// Add to sidebarItems:
{ id: 'presets', label: 'Presets', icon: <SlidersHorizontal size={20} /> }

// Add to render:
{activeItem === 'presets' && <PresetsPage />}
```

---

## Files Summary

| File | Action | Layer |
|------|--------|-------|
| `apps/api/src/lib/aws/iot-client.ts` | Create | Backend infra |
| `apps/api/src/lib/aws/config-store.ts` | Create | Backend infra |
| `apps/api/src/domains/machine-domain/types.ts` | Modify | Backend types |
| `apps/api/src/domains/machine-domain/router.ts` | Modify | Backend routes |
| `apps/api/src/domains/machine-domain/internal-routes.ts` | Modify | Backend webhook |
| `apps/api/src/domains/machine-domain/commands/index.ts` | Modify | Backend barrel |
| `apps/api/src/domains/machine-domain/queries/index.ts` | Modify | Backend barrel |
| `apps/api/src/domains/machine-domain/commands/requestMachineConfig.ts` | Create | Backend command |
| `apps/api/src/domains/machine-domain/commands/updateMachineConfig.ts` | Create | Backend command |
| `apps/api/src/domains/machine-domain/commands/handleConfigResponse.ts` | Create | Backend command |
| `apps/api/src/domains/machine-domain/queries/getConfigResponse.ts` | Create | Backend query |
| `infra/lambda/machine-config-response/index.js` | Create | Infrastructure |
| `infra/terraform/iot.tf` | Modify | Infrastructure |
| `infra/terraform/lambda.tf` | Modify | Infrastructure |
| `pi-src/aws_iot_registration.py` | Modify | Raspberry Pi |
| `src/machines/MachinesPage.tsx` | Modify | Frontend |
| `src/machines/presets/PresetsPage.tsx` | Create | Frontend |
| `src/machines/presets/components/PresetCard.tsx` | Create | Frontend |
| `src/machines/presets/components/PresetEditor.tsx` | Create | Frontend |
| `src/machines/presets/hooks/useMachineConfig.ts` | Create | Frontend |

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Machine offline | Backend rejects with "Machine is offline" before publishing |
| Machine not IoT-registered | Backend rejects with "Machine not IoT-registered" |
| Pi config file missing | Pi responds with error; frontend shows error message |
| MQTT delivery failure | QoS 1 ensures retry; frontend times out after 15s |
| Lambda failure | DLQ catches; Lambda retries up to 2 times |
| Concurrent requests | Each has unique requestId; no collision |
| Server restart during poll | In-memory store lost; frontend times out, user can retry |
| Navigation during poll | useEffect cleanup clears timeout; tRPC stops refetch |

---

## Deployment Steps

### 1. Infrastructure (Terraform)

```bash
cd infra/lambda/machine-config-response
zip -j ../machine-config-response.zip index.js
cd ../../terraform
terraform plan
terraform apply
```

### 2. Backend

```bash
cd apps/api
pnpm add @aws-sdk/client-iot-data-plane
pnpm build
# Deploy via GitHub Actions or manually
```

### 3. Pi

```bash
# SSH into Pi, update aws_iot_registration.py
# Create initial config.json at /opt/rooted-ble/config.json
# Restart IoT service:
sudo systemctl restart rooted-iot
```

### 4. Frontend

```bash
pnpm build
# Deploy via GitHub Actions
```

---

## Testing

### Manual E2E Test

1. Create test `config.json` on Pi at `/opt/rooted-ble/config.json`
2. Ensure Pi is connected to AWS IoT (`pm2 logs rooted-iot` on EC2 or `journalctl -u rooted-iot` on Pi)
3. Deploy Lambda + IoT Rule via Terraform
4. Open web app → Machines → Presets tab
5. Expand a machine card → verify config loads within ~3-5s
6. Edit a preset value, save → verify acknowledgment arrives
7. SSH into Pi → verify `config.json` was updated

### Verify MQTT Flow

```bash
# On Pi, check subscription:
journalctl -u rooted-iot -f

# In AWS Console:
# IoT Core → Test → Subscribe to rooted/machines/+/pong
# IoT Core → Test → Publish to rooted/machines/{thingName}/ping
# Payload: {"action": "get_config", "requestId": "test-123"}
```
