# IoT Lambda Environment Fix - Implementation Summary

## Overview

Updated approach for IoT Lambda environment management and testing. Instead of creating separate dev/staging Lambda infrastructure, we use a comprehensive mock system for local development and keep production Lambda deployment simple.

## Key Decisions

### 1. **No Multi-Environment Lambdas**
**Rationale**: Lambda cannot call localhost, so a dev Lambda would require a publicly accessible dev API endpoint. This adds complexity without significant benefit.

**Solution**: 
- Production only: Real AWS IoT + Lambda
- Local development: Comprehensive mock system
- No dev/staging Lambda infrastructure

### 2. **Comprehensive Mock System**
**Features**:
- Mocks entire IoT flow (publish → Pi simulator → Lambda → API)
- Extensible action registry for future Pi commands
- Configurable test scenarios (success, timeout, failure)
- Enabled by default in non-prod environments

**Benefits**:
- Fast feedback loop (no AWS deployment needed)
- Test all scenarios locally
- Easy to add new Pi actions
- No AWS costs for development

### 3. **Remove Config Response Lambda**
**Why**: The `machine-config-response` Lambda is unnecessary because:
- It subscribes to a regular MQTT topic (`rooted/machines/+/pong`)
- Regular topics can be consumed directly by MQTT clients
- Lambda just forwards messages, adding latency

**Solution**: API subscribes directly to MQTT topic using `aws-iot-device-sdk-v2`

**Keep**: `machine-lifecycle` Lambda (required for system topics like `$aws/events/presence`)

## Implementation Phases

### Phase 1: Mock System (Week 1)
**Files to create**:
- `apps/api/src/lib/aws/iot-client.mock.ts` - Mock IoT publish
- `apps/api/src/lib/testing/mock-pi-simulator.ts` - Simulates Pi behavior
- `apps/api/src/lib/testing/mock-lambda-caller.ts` - Calls internal endpoints
- `apps/api/src/lib/testing/mock-preset-data.ts` - Test data fixtures
- `apps/api/src/lib/testing/iot-test-helpers.ts` - Testing utilities

**Changes**:
- Update `apps/api/src/lib/aws/iot-client.ts` to export mock or real based on `MOCK_IOT` env var
- Add `MOCK_IOT`, `MOCK_IOT_DELAY_MS`, `MOCK_IOT_FAILURE_RATE` to `.env.development`

**Testing**: All IoT operations work locally without AWS

### Phase 2: Remove Config Lambda (Week 2-3)
**Files to create**:
- `apps/api/src/lib/iot/mqtt-client.ts` - MQTT client for direct subscription

**Changes**:
- Update `apps/api/src/index.ts` to initialize MQTT client (prod only)
- Add IoT certificate env vars to `.env.production`
- Remove config Lambda from `infra/terraform/lambda.tf`
- Remove config IoT rule from `infra/terraform/iot.tf`
- Install `aws-iot-device-sdk-v2`

**AWS Setup**:
- Create IoT Thing for API (`rooted-api-prod`)
- Generate certificates
- Attach policy and certificates

**Testing**: 
- Deploy MQTT client to prod
- Run both Lambda and MQTT client in parallel for 48h
- Remove Lambda after validation

### Phase 3: Documentation (Week 4)
**Updates needed**:
- `README.md` - Mock system usage
- `docs/machine-iot/ARCH.md` - Architecture diagram
- `apps/api/README.md` - MQTT client setup
- Add troubleshooting guide

## Extensibility

### Adding New Pi Actions

The mock system uses an action registry pattern:

```typescript
// Easy to add new actions
mockPiSimulator.registerAction('get_diagnostics', {
  handle: async (thingName: string, payload: any) => {
    return {
      action: 'diagnostics_response',
      data: { cpu_temp: 45.2, memory_usage: 62.5 },
    };
  },
});
```

**Planned actions**:
- `get_diagnostics` - System health metrics
- `update_firmware` - Firmware updates
- `stream_sensors` - Real-time sensor data

### Test Scenarios

```typescript
// Simulate timeout
iotTestHelpers.simulateTimeout();

// Simulate 20% failure rate
iotTestHelpers.simulateFailures(20);

// Custom preset data
iotTestHelpers.setDevicePresets('device-123', customPresets);
```

## Environment Configuration

### Local Development
```env
MOCK_IOT=true                # Enabled by default
MOCK_IOT_DELAY_MS=500        # Simulate network latency
MOCK_IOT_FAILURE_RATE=0      # 0-100 percentage
```

### Production
```env
MOCK_IOT=false
AWS_IOT_ENDPOINT=...
IOT_CERT_PATH=/etc/rooted/certs/api-cert.pem
IOT_KEY_PATH=/etc/rooted/certs/api-private.key
IOT_CA_PATH=/etc/rooted/certs/AmazonRootCA1.pem
```

## Cost Impact

**Before**:
- 2 Lambda functions
- 2 CloudWatch log groups
- 2 IoT Rules

**After**:
- 1 Lambda function (50% reduction)
- 1 CloudWatch log group (50% reduction)
- 1 IoT Rule (50% reduction)
- MQTT connection (~$0.08/month)

**Savings**: ~$5-10/month + reduced latency + simpler architecture

## Rollback Plan

If MQTT client fails:
```bash
cd infra/terraform
git checkout HEAD~1 lambda.tf iot.tf
terraform apply -var-file="terraform.tfvars"
```

**Rollback time**: ~15 minutes

## Next Steps

1. Review updated `docs/upgrade_phases/IOT_LAMBDA_ENVIRONMENT_FIX.md`
2. Implement Phase 1 (mock system)
3. Test locally with frontend
4. Proceed to Phase 2 when ready
