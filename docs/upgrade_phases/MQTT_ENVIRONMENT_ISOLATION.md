# MQTT Environment Isolation

## Overview

Local development can currently disrupt production MQTT because the API subscriber uses the same AWS IoT endpoint, the same broad topic filters, and a hard-coded MQTT client ID.

**Confirmed root cause:**

| File | Current behavior | Risk |
|------|------------------|------|
| `apps/api/src/index.ts` | Starts MQTT unless `MOCK_IOT=true` | Local API starts real AWS IoT subscriber by default when AWS vars exist |
| `apps/api/src/domains/machine-domain/mqtt/subscriber.ts` | Uses client ID `rooted-api-subscriber` | Dev and prod compete for one MQTT session; newest connection disconnects the other |
| `apps/api/src/domains/machine-domain/mqtt/subscriber.ts` | Uses `clean_session(false)` | Duplicate client IDs can resume the same persistent session |
| `apps/api/src/domains/machine-domain/mqtt/subscriber.ts` | Subscribes to `rooted/machines/+/...` | Dev can consume prod machine traffic if pointed at prod IoT |

MQTT does not provide a useful "prod priority" mechanism for duplicate client IDs. The fix is isolation: unique client IDs, environment-scoped topics, and separate credentials/infrastructure where possible.

---

## Target State

```
local dev       -> mock IoT by default
staging/dev IoT -> rooted/staging/machines/{deviceId}/...
production IoT  -> rooted/prod/machines/{deviceId}/...
```

**Production machines stay on prod.** Dev machines should be provisioned against staging/dev IoT settings or, at minimum, publish to staging/dev topic prefixes.

---

## Required Changes

### 1. Add MQTT environment variables

Add these to API environments:

```env
APP_ENV=local | staging | prod
MQTT_ENABLED=false
MQTT_TOPIC_PREFIX=rooted/local
MQTT_CLIENT_ID=rooted-api-local-vishal
MQTT_CLEAN_SESSION=true
```

Production:

```env
APP_ENV=prod
MQTT_ENABLED=true
MQTT_TOPIC_PREFIX=rooted/prod
MQTT_CLIENT_ID=rooted-api-prod-primary
MQTT_CLEAN_SESSION=false
```

Staging:

```env
APP_ENV=staging
MQTT_ENABLED=true
MQTT_TOPIC_PREFIX=rooted/staging
MQTT_CLIENT_ID=rooted-api-staging-primary
MQTT_CLEAN_SESSION=false
```

Local default:

```env
APP_ENV=local
MOCK_IOT=true
MQTT_ENABLED=false
MQTT_TOPIC_PREFIX=rooted/local
MQTT_CLIENT_ID=rooted-api-local-${USER}
MQTT_CLEAN_SESSION=true
```

Rules:
- `MOCK_IOT=true` should remain the default local path.
- `MQTT_ENABLED=true` should be required before starting a real MQTT subscriber.
- `MQTT_CLIENT_ID` must never be shared across environments.
- Local real-MQTT testing must use staging/dev topics, not prod topics.

---

### 2. Gate MQTT startup in the API

Update `apps/api/src/index.ts`.

Current behavior:

```ts
if (process.env.MOCK_IOT !== 'true') {
  startMqttSubscriber().catch((err) => {
    logger.error('Failed to start MQTT subscriber', { err });
  });
}
```

Replace with:

```ts
const mqttEnabled = process.env.MQTT_ENABLED === 'true' && process.env.MOCK_IOT !== 'true';

if (mqttEnabled) {
  startMqttSubscriber().catch((err) => {
    logger.error('Failed to start MQTT subscriber', { err });
  });
} else {
  logger.info('MQTT subscriber disabled', {
    mockIot: process.env.MOCK_IOT === 'true',
    mqttEnabled: process.env.MQTT_ENABLED === 'true',
  });
}
```

This makes the real subscriber opt-in instead of "on when credentials exist."

---

### 3. Make API MQTT client IDs environment-specific

Update `apps/api/src/domains/machine-domain/mqtt/subscriber.ts`.

Current behavior:

```ts
.with_client_id('rooted-api-subscriber')
.with_clean_session(false)
```

Replace with:

```ts
function getMqttClientId(): string {
  const explicit = process.env.MQTT_CLIENT_ID;
  if (explicit) return explicit;

  const appEnv = process.env.APP_ENV ?? process.env.NODE_ENV ?? 'local';
  const instanceId = process.env.HOSTNAME ?? `${process.pid}`;
  return `rooted-api-${appEnv}-${instanceId}`;
}

function getCleanSession(): boolean {
  return process.env.MQTT_CLEAN_SESSION === 'true';
}
```

Then:

```ts
.with_client_id(getMqttClientId())
.with_clean_session(getCleanSession())
```

Production should use a stable client ID when only one prod subscriber is active. If multiple prod API instances will run simultaneously, use unique client IDs per instance and make telemetry ingestion idempotent.

---

### 4. Prefix all API MQTT topics by environment

Update `apps/api/src/domains/machine-domain/mqtt/subscriber.ts`.

Replace fixed topics:

```ts
const PONG_TOPIC = 'rooted/machines/+/pong';
const TELEMETRY_TOPIC = 'rooted/machines/+/telemetry';
```

With:

```ts
const MQTT_TOPIC_PREFIX = process.env.MQTT_TOPIC_PREFIX ?? 'rooted/local';

const PONG_TOPIC = `${MQTT_TOPIC_PREFIX}/machines/+/pong`;
const TELEMETRY_TOPIC = `${MQTT_TOPIC_PREFIX}/machines/+/telemetry`;
```

Update device ID extraction because the segment index changes:

```ts
function getDeviceIdFromMachineTopic(topic: string): string | undefined {
  const parts = topic.split('/');
  const machinesIndex = parts.indexOf('machines');
  return machinesIndex >= 0 ? parts[machinesIndex + 1] : undefined;
}
```

Use this helper instead of:

```ts
topic.split('/')[2]
```

Lifecycle topics stay under AWS system topics:

```ts
$aws/events/presence/connected/+
$aws/events/presence/disconnected/+
```

They are filtered by MQTT client ID. Once machine client IDs include an environment prefix or suffix, update lifecycle handling to ignore non-matching environments.

---

### 5. Prefix API command publishing topics

Update `apps/api/src/lib/aws/iot-client.ts`.

Current topic shape is rooted/machines-based. Change command publishing to use the same prefix:

```ts
const MQTT_TOPIC_PREFIX = process.env.MQTT_TOPIC_PREFIX ?? 'rooted/local';
const topic = `${MQTT_TOPIC_PREFIX}/machines/${thingName}/commands`;
```

Also update any older code or docs that still publish to `/ping` if that path is still used.

---

### 6. Update Pi MQTT topics

Update `pi-src/aws/command_handler.py`.

Current behavior:

```py
commands_topic  = f'rooted/machines/{device_id}/commands'
pong_topic      = f'rooted/machines/{device_id}/pong'
telemetry_topic = f'rooted/machines/{device_id}/telemetry'
```

Replace with:

```py
mqtt_topic_prefix = config.get('mqtt_topic_prefix', 'rooted/local')

commands_topic  = f'{mqtt_topic_prefix}/machines/{device_id}/commands'
pong_topic      = f'{mqtt_topic_prefix}/machines/{device_id}/pong'
telemetry_topic = f'{mqtt_topic_prefix}/machines/{device_id}/telemetry'
```

Update each machine's `device_config.json`:

Production machines:

```json
{
  "device_id": "prod-machine-001",
  "mqtt_topic_prefix": "rooted/prod"
}
```

Dev/staging machines:

```json
{
  "device_id": "dev-machine-001",
  "mqtt_topic_prefix": "rooted/staging"
}
```

---

### 7. Separate dev/staging machine provisioning

Preferred approach:
- Create staging/dev AWS IoT things, certificates, policies, and topic rules.
- Provision dev machines with staging/dev certificates and endpoint.
- Keep prod certificates only on prod machines.

Minimum acceptable approach:
- Use same AWS IoT endpoint.
- Use separate topic prefixes.
- Use separate machine certificates/policies that only allow their environment prefix.

Do not use prod machine certificates on dev hardware.

---

### 8. Update Terraform IoT policy

Update `infra/terraform/iot.tf` so machine policies are environment-scoped.

Current policy allows:

```hcl
topicfilter/rooted/machines/$${iot:Connection.Thing.ThingName}/commands
topic/rooted/machines/$${iot:Connection.Thing.ThingName}/pong
```

Target shape:

```hcl
topicfilter/rooted/${var.environment}/machines/$${iot:Connection.Thing.ThingName}/commands
topic/rooted/${var.environment}/machines/$${iot:Connection.Thing.ThingName}/pong
topic/rooted/${var.environment}/machines/$${iot:Connection.Thing.ThingName}/telemetry
```

Also confirm the API IAM principal can subscribe/publish only to the matching environment prefix.

---

### 9. Update lifecycle handling

Presence events report MQTT client IDs, not topic prefixes. To keep lifecycle status isolated:

Option A: encode environment in machine client IDs:

```txt
prod:machine-001
staging:machine-001
```

Option B: maintain separate IoT endpoints/accounts per environment.

Option C: keep device IDs globally unique:

```txt
prod-machine-001
staging-machine-001
```

Recommended for now: globally unique device IDs plus separate IoT policies. This requires the least code change and avoids lifecycle collisions.

Update `apps/api/src/domains/machine-domain/mqtt/machine-lifecycle/handleLifecycleEvent.ts` so ignored API subscriber IDs are prefix-aware:

```ts
const IGNORED_CLIENT_ID_PREFIXES = ['rooted-api-'];

if (IGNORED_CLIENT_ID_PREFIXES.some((prefix) => clientId.startsWith(prefix))) {
  return;
}
```

---

### 10. Update docs and examples

Update:

| File | Change |
|------|--------|
| `.env.example` | Add `APP_ENV`, `MQTT_ENABLED`, `MQTT_TOPIC_PREFIX`, `MQTT_CLIENT_ID`, `MQTT_CLEAN_SESSION` |
| `README.md` | Make `MOCK_IOT=true` the default local recommendation |
| `pi-src/README.md` | Document `mqtt_topic_prefix` and separate dev/prod provisioning |
| `docs/machine-iot/ARCH.md` | Document environment-scoped topic structure |

---

## Rollout Plan

### Phase 1: Stop local from disrupting prod

1. Add `MQTT_ENABLED=false` to local `.env`.
2. Add `MOCK_IOT=true` to local `.env`.
3. Deploy API startup guard.
4. Deploy unique API MQTT client IDs.

This removes the immediate disconnect risk.

### Phase 2: Add topic prefixes

1. Add `MQTT_TOPIC_PREFIX` to API config.
2. Update subscriber topics.
3. Update publish topics.
4. Update Pi topics.
5. Provision one staging/dev machine with `rooted/staging`.
6. Verify staging traffic does not appear in prod handlers.

### Phase 3: Harden AWS isolation

1. Update Terraform IoT policies to environment-scoped topics.
2. Re-provision dev/staging machines with non-prod certs.
3. Confirm prod certificates cannot publish/subscribe to staging topics and staging certificates cannot publish/subscribe to prod topics.

### Phase 4: Optional full split

Move staging/dev IoT into separate AWS account or separate AWS IoT endpoint if operationally feasible. This is the cleanest boundary, but topic and policy isolation are enough to fix the current failure mode.

---

## Verification Checklist

Local:
- `pnpm dev:api` logs `MQTT subscriber disabled` by default.
- Setting AWS credentials locally does not start MQTT unless `MQTT_ENABLED=true`.
- If local MQTT is explicitly enabled, the client ID is not `rooted-api-prod-primary`.

Staging:
- Staging API subscribes to `rooted/staging/machines/+/...`.
- Staging machine publishes telemetry to `rooted/staging/machines/{deviceId}/telemetry`.
- Prod API receives no staging telemetry.

Production:
- Prod API subscribes to `rooted/prod/machines/+/...`.
- Prod machine telemetry still appears in TimescaleDB.
- Starting a dev API no longer disconnects prod API from AWS IoT.

AWS IoT:
- CloudWatch no longer shows prod MQTT disconnect events immediately after local dev server startup.
- IoT policies reject cross-environment topics.

---

## Acceptance Criteria

- Local dev cannot connect to prod MQTT accidentally.
- Dev/staging and prod API subscribers use distinct MQTT client IDs.
- Dev/staging and prod machines use distinct MQTT topic prefixes.
- Dev/staging certificates cannot publish to prod topics.
- Prod machines do not require any topic or certificate change until the prod rollout window.
- The production MQTT subscriber remains stable when a development server starts.
