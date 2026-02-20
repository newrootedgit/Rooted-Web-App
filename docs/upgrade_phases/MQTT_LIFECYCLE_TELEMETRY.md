# MQTT Lifecycle & Telemetry Upgrade

**Status:** Ready to implement
**Priority:** High
**Target:** Consolidate all IoT event handling into the MQTT subscriber, remove Lambda dependency, add telemetry support

---

## Current Architecture

```
Lifecycle:  Pi → IoT Core → IoT Rule → Lambda → POST /internal/machines/lifecycle-event → handleLifecycleEvent → DB
Config:     Pi → IoT Core → MQTT subscriber → handleConfigResponse → config-store
Telemetry:  Not implemented
```

**Problems with the current lifecycle path:**
- Extra hops: IoT Rule → Lambda → HTTP adds latency and cost
- Lambda requires separate deployment and IAM management
- The API already has a live MQTT connection — lifecycle events can be handled the same way as pong

---

## Target Architecture

```
Lifecycle:  Pi → IoT Core → MQTT subscriber → handleMqttLifecycleEvent → handleLifecycleEvent → DB
Config:     Pi → IoT Core → MQTT subscriber → handleConfigResponse → config-store  (unchanged)
Telemetry:  Pi → IoT Core → MQTT subscriber → handleTelemetry → DB
```

Everything flows through `subscriber.ts`. No Lambda. No internal HTTP route.

---

## Topics

| Topic | Direction | Handler |
|-------|-----------|---------|
| `rooted/machines/+/pong` | Pi → API | `handleConfigResponse` (existing) |
| `$aws/events/presence/connected/+` | IoT Core → API | `handleMqttLifecycleEvent` (new) |
| `$aws/events/presence/disconnected/+` | IoT Core → API | `handleMqttLifecycleEvent` (new) |
| `rooted/machines/+/telemetry` | Pi → API | `handleTelemetry` (new) |

---

## Files to Create

### 1. `mqtt/machine-lifecycle/handleMqttLifecycleEvent.ts`

**Why:** AWS IoT presence events have a different payload shape than what the Lambda was forwarding to the HTTP route. This adapter normalizes the raw MQTT payload and calls the existing `handleLifecycleEvent` command.

**AWS IoT presence event payload:**
```json
{
  "clientId": "my-thing-name",
  "timestamp": 1708473600000,
  "eventType": "connected",
  "sessionIdentifier": "uuid",
  "ipAddress": "1.2.3.4"
}
```

**What it does:**
- Receives the raw MQTT presence payload
- Maps `clientId` → `deviceId` (same normalization the Lambda was doing)
- Converts `timestamp` (ms epoch) to ISO string
- Calls `handleLifecycleEvent(prisma, { deviceId, eventType, timestamp })`

**Approximate shape:**
```typescript
import { prisma } from '../../../../lib/db/index.js';
import { handleLifecycleEvent } from '../../commands/index.js';

interface PresencePayload {
  clientId: string;
  timestamp: number;
  eventType: 'connected' | 'disconnected';
  sessionIdentifier?: string;
  ipAddress?: string;
}

export async function handleMqttLifecycleEvent(payload: PresencePayload): Promise<void> {
  await handleLifecycleEvent(prisma, {
    deviceId: payload.clientId,
    eventType: payload.eventType,
    timestamp: new Date(payload.timestamp).toISOString(),
    sessionId: payload.sessionIdentifier,
  });
}
```

---

### 2. `mqtt/machine-telemetry/handleTelemetry.ts`

**Why:** New handler for sensor/operational data sent from the Pi on a regular interval. Stores readings against the machine in the DB.

**Expected telemetry payload (to confirm with Pi code):**
```json
{
  "deviceId": "thing-name",
  "timestamp": 1708473600000,
  "data": {
    "seedsPlanted": 120,
    "speed": 0.5,
    "batteryLevel": 87,
    "wifiSsid": "FarmNetwork"
  }
}
```

> **Action required before implementing:** Confirm the exact telemetry payload fields with the Pi code (`pi-src/`). The handler shape depends on what the Pi actually sends.

**What it does:**
- Receives the telemetry payload from `rooted/machines/+/telemetry`
- Looks up the machine by `deviceId`
- Updates `last_seen_at` and any machine-level fields (e.g. `current_wifi_ssid`)
- Stores sensor readings — see DB note below

**DB consideration:** Decide whether telemetry readings go into:
- A new `machine_telemetry` table (timeseries — better for historical queries)
- Directly onto the `machines` row (simpler — only keeps latest reading)

If a new table is needed, a Prisma migration will be required before this file can be completed.

---

## Files to Modify

### 3. `mqtt/subscriber.ts`

**Why:** Add two new topic subscriptions alongside the existing `pong` subscription.

**Add these subscriptions after the existing pong subscription:**
```typescript
import { handleMqttLifecycleEvent } from './machine-lifecycle/handleMqttLifecycleEvent.js';
import { handleTelemetry } from './machine-telemetry/handleTelemetry.js';

// Lifecycle events
await connection.subscribe('$aws/events/presence/connected/+', mqtt.QoS.AtLeastOnce, handler);
await connection.subscribe('$aws/events/presence/disconnected/+', mqtt.QoS.AtLeastOnce, handler);

// Telemetry
await connection.subscribe('rooted/machines/+/telemetry', mqtt.QoS.AtLeastOnce, handler);
```

Each handler should follow the same try/catch pattern as the existing pong handler.

Note: `$aws/events/presence` topics require the IoT policy to allow `iot:Subscribe` and `iot:Receive` on those ARNs. The IAM policy we added uses `Resource: "*"` so it is already covered.

---

### 4. `mqtt/index.ts`

**Why:** Export the new handlers so they are accessible from outside the mqtt module if needed.

Add:
```typescript
export { handleMqttLifecycleEvent } from './machine-lifecycle/handleMqttLifecycleEvent.js';
export { handleTelemetry } from './machine-telemetry/handleTelemetry.js';
```

---

### 5. `infra/terraform/iot.tf`

**Why:**
1. Remove the `machine_lifecycle` IoT Rule — no longer needed since the subscriber handles it directly
2. Add `iot:Publish` on the telemetry topic to the Pi's IoT policy so the Pi is allowed to send telemetry

**Remove:**
```hcl
resource "aws_iot_topic_rule" "machine_lifecycle" { ... }
resource "aws_cloudwatch_log_group" "iot_rule_errors" { ... }
```

**Add to `aws_iot_policy.machine_policy` statements:**
```hcl
{
  Effect = "Allow"
  Action = "iot:Publish"
  Resource = "arn:aws:iot:...:topic/rooted/machines/$${iot:Connection.Thing.ThingName}/telemetry"
}
```

---

### 6. `infra/terraform/lambda.tf`

**Why:** The `machine_lifecycle` Lambda is no longer needed once the subscriber handles lifecycle events.

**Action:** Delete `lambda.tf` entirely (the whole file — Lambda function, CloudWatch log group, Lambda permission, DLQ, and event invoke config all go away).

Also remove `infra/lambda/machine-lifecycle/` directory and `machine-lifecycle.zip`.

---

### 7. `internal-routes.ts`

**Why:** The `POST /internal/machines/lifecycle-event` route exists solely for the Lambda to call. Once the Lambda is gone, this route serves no purpose.

**Action:** Remove the `/internal/machines/lifecycle-event` handler. If `registerInternalRoutes` becomes empty after that, remove the function and its import from `index.ts`.

---

## Implementation Order

1. **Confirm telemetry payload** with Pi code before writing `handleTelemetry.ts`
2. **Decide DB approach** for telemetry storage (migrate if new table needed)
3. **Create `handleMqttLifecycleEvent.ts`** — straightforward, no DB changes needed
4. **Create `handleTelemetry.ts`** — after payload and DB are confirmed
5. **Update `subscriber.ts`** — add the two new subscriptions
6. **Update `mqtt/index.ts`** — add exports
7. **Test locally** — restart server, verify lifecycle and telemetry messages are received and processed
8. **Update `iot.tf`** — remove lifecycle rule, add telemetry publish permission to Pi policy
9. **Delete `lambda.tf`** and lambda source files
10. **Remove `/internal/machines/lifecycle-event`** from `internal-routes.ts`
11. **Run `terraform apply`** to push infra changes

---

## What Does NOT Change

- `handleLifecycleEvent.ts` command — reused as-is, just called from MQTT instead of HTTP
- `machine-presets/` handlers — untouched
- Pi IoT policy for `ping`, `commands`, `pong` topics — only telemetry topic is added
- `config-store`, `iot-client` lib files — untouched
