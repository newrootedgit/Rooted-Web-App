# Rooted API — Customer Guide

> **Purpose:** How to connect to the Rooted API and make requests against your own machines using an API key. This guide covers authentication, the kinds of data available, and how we tailor the API to your needs.
>
> **Last updated:** 2026-06-09

---

## Overview

The Rooted API gives your systems programmatic access to our machines on your farm. With your own API key you can:

- **Check machine status** — online/offline, last seen, current variety.
- **Monitor machine health** — uptime, throughput (trays/steps), per-motor run time, and recent faults.
- **Read and update presets** — view a machine's variety configurations and push new preset values.

Everything is **scoped to your farm**. Your key only ever sees and controls your own machines.

> **The API is flexible — and that's the point.** Our data model and endpoints are not one-size-fits-all. We work directly with your team to serve the specific data you care about, in the format and cadence your systems need — whether that's JSON over REST, scheduled exports, webhooks on fault events, or a custom schema mapped to your internal tooling. The examples below show the shape of what's available; the final contract is designed around your integration. **Tell us what you need and we'll build the surface to match.**

---

## Getting Connected

### 1. Request an API key

API keys are issued by the Rooted team. Reach out to your Rooted contact and let us know:

- Which farm and machines you want to integrate.
- Whether you need **read-only** (status/health) or **read + write** (also updating presets) access.
- Roughly how your systems will call us (polling cadence, event-driven, batch).

We'll provision a key scoped to your farm and send it to you securely. **The full key is shown only once** — store it in your secrets manager. If it's ever lost or exposed, we revoke and reissue immediately.

Keys look like:

```
rk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Authenticate your requests

Send your key as a Bearer token on every request:

```
Authorization: Bearer rk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Base URL:**

```
https://app.rootedrobotics.com/api/v1
```

All requests are over HTTPS. Keep your key server-side — never embed it in a browser app or mobile client.

---

## Example Requests

> These illustrate the current shape of the API. Exact fields and formats are finalized with your team as part of onboarding (see [Tailored to You](#tailored-to-you)).

### List your machines

```bash
curl https://app.rootedrobotics.com/api/v1/machines \
  -H "Authorization: Bearer $ROOTED_API_KEY"
```

### Get a machine's status & health

```bash
curl https://app.rootedrobotics.com/api/v1/machines/{machineId} \
  -H "Authorization: Bearer $ROOTED_API_KEY"
```

Returns status, last-seen time, uptime, throughput, per-motor run time, and fault counts.

### See recent faults

```bash
curl https://app.rootedrobotics.com/api/v1/machines/{machineId}/faults \
  -H "Authorization: Bearer $ROOTED_API_KEY"
```

### Read current presets

```bash
curl https://app.rootedrobotics.com/api/v1/machines/{machineId}/config \
  -H "Authorization: Bearer $ROOTED_API_KEY"
```

### Update presets

Preset changes are applied on the physical machine, so updates are **asynchronous**: you submit a change and receive a `requestId`, then poll for the device's confirmation.

```bash
# 1. Submit the change
curl -X POST https://app.rootedrobotics.com/api/v1/machines/{machineId}/config \
  -H "Authorization: Bearer $ROOTED_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "1": { "belt_speed": 45, "blade_height": 12 } }'
# → { "requestId": "...", "status": "pending" }

# 2. Poll for the device's confirmation
curl https://app.rootedrobotics.com/api/v1/machines/{machineId}/config/requests/{requestId} \
  -H "Authorization: Bearer $ROOTED_API_KEY"
# → { "status": "received", "success": true }
```

The machine validates every value against its safe operating ranges and will reject anything out of bounds — the rejection reason is returned to you.

---

## Tailored to You

The endpoints above are a starting point, not a fixed product. As part of onboarding, we work with your team to deliver exactly what your integration requires:

- **The data you need** — additional metrics, aggregations, or historical exports beyond the defaults.
- **The format you need** — JSON, CSV exports, or a schema mapped to your internal field names.
- **The delivery you need** — on-demand REST, scheduled pushes, or webhooks triggered by events (e.g. a fault or a machine going offline).
- **A formal contract** — for production integrations we provide a versioned, documented API specification (and, where useful, an OpenAPI schema and client snippets) built and supported as part of your engagement.

This deeper, formalized build-out is delivered as a paid integration package. The lightweight access above is enough to evaluate and prototype; the full, production-grade API is scoped and built once we're working together.

---

## Good to Know

- **Security:** keys are scoped to your farm only and can be revoked or rotated at any time. Store them as secrets; never expose them client-side.
- **Rate limits:** requests are rate-limited per key. If you expect high volume, let us know and we'll size limits to your usage.
- **Versioning:** the API is versioned (`/v1`). We won't make breaking changes to a version your integration depends on without coordinating with you.
- **Support:** questions, a new data need, or a key issue — contact your Rooted representative and we'll help.
