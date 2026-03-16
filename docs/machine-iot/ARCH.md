# Machine IoT Architecture

## Status

Implemented in the current codebase.

## Scope

The Machine IoT surface covers:

- BLE-based machine discovery and onboarding
- WiFi provisioning from the browser
- machine registry and dashboard views
- preset/config request-response over AWS IoT
- lifecycle status tracking
- telemetry ingestion into TimescaleDB
- fault history stored in PostgreSQL

Frontend entrypoint: `/machines`

## High-Level Flow

```text
Browser
  ├── Web Bluetooth -> Raspberry Pi BLE service
  └── tRPC -> Fastify API
                 ├── PostgreSQL (machines, faults, tenancy)
                 ├── TimescaleDB (raw telemetry, aggregates)
                 └── AWS IoT Core

Raspberry Pi
  ├── BLE provisioner
  ├── AWS IoT registration / command handling
  ├── telemetry ingest
  └── Vector -> AWS IoT telemetry publish
```

## Frontend Structure

### `src/machines/`

- `MachinesPage.tsx`
  - app shell with sidebar items for dashboard and presets
- `dashboard/`
  - `MachinesDashboard.tsx`
  - machine cards, machine list, BLE support indicator, status banner
  - fault history modal
- `device-discovery/`
  - onboarding via Web Bluetooth device picker
- `wifi-provisioning/`
  - change WiFi flow for a machine
- `presets/`
  - fetch config request status
  - update presets / variety names

## Backend Structure

### tRPC Surface

[apps/api/src/domains/machine-domain/router.ts](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/apps/api/src/domains/machine-domain/router.ts) exposes:

- `list`
- `byId`
- `byDeviceId`
- `create`
- `delete`
- `requestConfig`
- `updateConfig`
- `getConfigResponse`
- `faults`

### MQTT and Telemetry

The API starts an MQTT subscriber unless `MOCK_IOT=true`.

Key files:

- [subscriber.ts](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/apps/api/src/domains/machine-domain/mqtt/subscriber.ts)
- [handleTelemetry.ts](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/apps/api/src/domains/machine-domain/mqtt/machine-telemetry/handleTelemetry.ts)
- [handleLifecycleEvent.ts](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/apps/api/src/domains/machine-domain/mqtt/machine-lifecycle/handleLifecycleEvent.ts)

Behavior:

- telemetry messages are buffered per device
- flushes are serialized on a fixed interval
- raw telemetry is inserted into TimescaleDB
- `machines.last_seen_at` is updated in PostgreSQL
- fault EVENT frames create rows in `machine_faults`

## Data Model

### PostgreSQL

- `machines`
  - ownership, identity, current status
- `machine_faults`
  - discrete fault history and motor attribution

### TimescaleDB

- `raw_telemetry`
  - deduplicated telemetry storage
- `machine_stats`
  - aggregate view used by machine enrichment queries

## Provisioning Flow

1. User opens `/machines`.
2. User starts onboarding from the dashboard.
3. Browser scans for the custom BLE service UUID.
4. User selects a device in the browser picker.
5. Machine record is created in PostgreSQL through tRPC.
6. User can send WiFi credentials over BLE.
7. Pi registers with AWS IoT and begins publishing telemetry/lifecycle events.

## Config Sync Flow

1. User opens the presets screen.
2. Frontend calls `machines.requestConfig`.
3. API publishes a config request to the machine over AWS IoT.
4. Pi responds on the pong topic.
5. API caches the response by request ID.
6. Frontend polls `machines.getConfigResponse`.
7. User updates presets through `machines.updateConfig`.

## Device-Side Components

### `pi-src/`

- `provisioner.py`
  - BLE service and WiFi provisioning behavior
- `aws/`
  - IoT registration, telemetry ingest, command handling
- `vector/rooted-telemetry.toml`
  - telemetry shipping configuration

## Browser Support

Machine onboarding depends on Web Bluetooth.

Supported targets are documented in [docs/user-guides/BROWSERS.md](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/docs/user-guides/BROWSERS.md).

## Operational Notes

- Frontend dev server runs on port `3000`.
- API dev server runs on port `8000`.
- TimescaleDB must be available for telemetry inserts.
- PostgreSQL remains the source of truth for machine ownership and fault history.
