# First-Login Tutorial + Demo Machine Upgrade Phase

## Overview

Add a first-login tutorial for new Rooted users after they complete farm onboarding. The tutorial should feel like a production SaaS onboarding flow: short, contextual, dismissible, restartable, and backed by persisted completion state.

To make the Machines experience useful before a customer has physical hardware connected, each newly created farm will receive one clearly marked demo machine. This demo machine gives the tutorial real UI to point at without requiring Bluetooth setup or AWS IoT connectivity.

This phase defines the production-grade approach, data model, API changes, frontend flow, demo machine safety rules, and test plan.

---

## Product Goals

1. Show a guided tutorial the first time a user reaches the Machines page after creating a farm.
2. Give new users a believable machine card immediately, even before adding real hardware.
3. Persist tutorial completion server-side so it does not repeat across devices.
4. Prevent demo machines from interacting with real AWS IoT command paths.
5. Keep the first version focused on Machines; planner onboarding can be added later as a separate flow.

---

## Library Research

### Recommended: `react-joyride`

Use `react-joyride` for the first implementation.

Why:

- Mature React-specific product tour library.
- MIT licensed.
- Large usage footprint.
- The npm page showed roughly 424k weekly downloads during research.
- GitHub showed 7.7k stars, 588 forks, 943 commits, and a latest release listed as `3.0.2` on April 1, 2026 during research.
- Supports custom components and styles.
- Its README advertises focus trapping, keyboard navigation, ARIA support, SSR safety, and React 16.8 through React 19 compatibility.

Sources:

- https://docs.react-joyride.com/
- https://github.com/gilbarbara/react-joyride
- https://www.npmjs.com/package/react-joyride

### Rejected: `@tour-kit/react`

Do not use this for the first implementation. It has promising technical claims, but the contributor base is too small for the reliability bar.

### Rejected: Shepherd.js

Shepherd is mature and powerful, but its GitHub README currently describes AGPL/commercial dual licensing for commercial products. That adds avoidable legal/product risk for this app.

Source:

- https://github.com/shipshapecode/shepherd

### Fallback: `@reactour/tour`

Reactour is MIT and React-specific, but Joyride has stronger adoption and release confidence for this use case.

Source:

- https://docs.reactour.dev/

---

## Core Decisions

### Demo Machine Lifecycle

Create one demo machine per newly created farm, during `onboarding.createTenantAndFarm`.

Do not create a new demo machine on every login.

Reasoning:

- "Every login" would recreate demo data after a user deletes it, which is surprising and messy.
- A persisted demo machine gives the tutorial stable UI targets.
- A per-farm demo model is simple to reason about and easy to remove later.
- Existing users should not get demo machines unless we explicitly run a backfill or add a "reset demo data" action.

### Tutorial Persistence

Store tutorial status on `farm_users`, not `localStorage`.

Reasoning:

- Works across devices and browsers.
- Avoids re-showing after refresh or sign-out/sign-in.
- Tracks per-user completion, which is better than per-farm completion if multiple people join the same farm.

### Demo Machine Safety

Demo machines must never publish AWS IoT commands.

Any backend path that sends commands to a physical machine must reject `is_demo = true`.

---

## Database Changes

### Prisma Schema Changes

Update `apps/api/prisma/schema.prisma`.

```prisma
model farm_users {
  id                            String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  tenant_id                     String?   @db.Uuid
  farm_id                       String?   @db.Uuid
  clerk_user_id                 String    @unique @db.VarChar(255)
  role                          String    @db.VarChar(50)
  first_name                    String?   @db.VarChar(100)
  last_name                     String?   @db.VarChar(100)
  email                         String?   @db.VarChar(255)
  is_active                     Boolean?  @default(true)
  created_at                    DateTime? @default(now()) @db.Timestamp(6)

  machine_tutorial_completed_at DateTime? @db.Timestamp(6)
  machine_tutorial_dismissed_at DateTime? @db.Timestamp(6)

  farms                         farms?    @relation(fields: [farm_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
  tenants                       tenants?  @relation(fields: [tenant_id], references: [id], onDelete: Cascade, onUpdate: NoAction)

  @@index([clerk_user_id], map: "idx_farm_users_clerk_user_id")
  @@index([farm_id], map: "idx_farm_users_farm_id")
  @@index([tenant_id], map: "idx_farm_users_tenant_id")
}

model machines {
  id                 String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  tenant_id          String?   @db.Uuid
  farm_id            String?   @db.Uuid
  name               String    @db.VarChar(255)
  display_name       String?   @db.VarChar(255)
  device_id          String    @db.VarChar(255)
  created_at         DateTime? @default(now()) @db.Timestamp(6)
  aws_iot_thing_name String?   @unique @db.VarChar(255)
  status             String?   @default("offline") @db.VarChar(50)
  last_seen_at       DateTime? @db.Timestamp(6)
  current_wifi_ssid  String?   @db.VarChar(255)

  is_demo            Boolean   @default(false)
  demo_config        Json?

  farms              farms?    @relation(fields: [farm_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
  tenants            tenants?  @relation(fields: [tenant_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
  machine_faults     machine_faults[]

  @@index([device_id], map: "idx_machines_device_id")
  @@index([farm_id], map: "idx_machines_farm_id")
  @@index([tenant_id], map: "idx_machines_tenant_id")
  @@index([is_demo], map: "idx_machines_is_demo")
}
```

### SQL Migration Shape

Create a Prisma migration equivalent to:

```sql
ALTER TABLE "farm_users"
  ADD COLUMN "machine_tutorial_completed_at" TIMESTAMP(6),
  ADD COLUMN "machine_tutorial_dismissed_at" TIMESTAMP(6);

ALTER TABLE "machines"
  ADD COLUMN "is_demo" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "demo_config" JSONB;

CREATE INDEX "idx_machines_is_demo" ON "machines"("is_demo");
```

---

## Backend Implementation Plan

### 1. Extend Machine Types

Update `apps/api/src/domains/machine-domain/types.ts`.

```ts
export interface Machine {
  id: string;
  tenantId: string | null;
  farmId: string | null;
  name: string;
  displayName: string | null;
  deviceId: string;
  createdAt: Date | null;
  awsIotThingName?: string | null;
  status?: 'online' | 'offline';
  lastSeenAt?: Date | null;
  currentWifiSsid?: string | null;
  isDemo?: boolean;
  totalSteps?: string | null;
  totalUptimeMs?: string | null;
  currentBootUptimeMs?: string | null;
  rebootCount?: number | null;
  beltFaultCount?: number | null;
  bladeFaultCount?: number | null;
  trayCount?: number | null;
  lastBeltFault?: number | null;
  lastBladeFault?: number | null;
  beltMotorUptimeMs?: string | null;
  bladeMotorUptimeMs?: string | null;
  lastEventCode?: string | null;
  lastEventValue?: number | null;
  lastEventAt?: Date | null;
}
```

Also update `shared/types/machines.ts` with:

```ts
isDemo?: boolean;
```

### 2. Map Demo Flag in Machine Query Enrichment

Update `apps/api/src/domains/machine-domain/queries/enrichMachinesWithTelemetry.ts`.

```ts
interface DbMachineRow {
  id: string;
  tenant_id: string | null;
  farm_id: string | null;
  name: string;
  display_name: string | null;
  device_id: string;
  created_at: Date | null;
  aws_iot_thing_name: string | null;
  status: string | null;
  last_seen_at: Date | null;
  current_wifi_ssid: string | null;
  is_demo: boolean;
  machine_faults?: Array<{
    fault_type: string;
    motor: string | null;
    created_at: Date;
  }>;
}
```

Then map it:

```ts
function mapBaseFields(m: DbMachineRow): Machine {
  return {
    id: m.id,
    tenantId: m.tenant_id,
    farmId: m.farm_id,
    name: m.name,
    displayName: m.display_name,
    deviceId: m.device_id,
    createdAt: m.created_at,
    awsIotThingName: m.aws_iot_thing_name,
    status: m.status as 'online' | 'offline' | undefined,
    lastSeenAt: m.last_seen_at,
    currentWifiSsid: m.current_wifi_ssid,
    isDemo: m.is_demo,
    totalSteps: '0',
    totalUptimeMs: '0',
    currentBootUptimeMs: '0',
    rebootCount: 0,
    beltFaultCount: 0,
    bladeFaultCount: 0,
    trayCount: 0,
    lastBeltFault: 0,
    lastBladeFault: 0,
    beltMotorUptimeMs: '0',
    bladeMotorUptimeMs: '0',
    lastEventCode: null,
    lastEventValue: null,
    lastEventAt: null,
  };
}
```

### 3. Create Demo Machine During Farm Onboarding

Update `apps/api/src/domains/onboarding-domain/commands/createTenantAndFarm.ts`.

Inside the existing transaction, after creating `farm`, create the demo machine.

```ts
const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
  const tenant = await tx.tenants.create({
    data: {
      name: input.farmName,
      slug,
    },
  });

  const farm = await tx.farms.create({
    data: {
      tenants: {
        connect: { id: tenant.id },
      },
      name: input.farmName,
      slug,
    },
  });

  await tx.machines.create({
    data: {
      tenant_id: tenant.id,
      farm_id: farm.id,
      name: 'HARVESTER',
      display_name: 'Demo Harvester',
      device_id: `demo-${farm.id}`,
      status: 'online',
      current_wifi_ssid: 'DEMO_NETWORK',
      is_demo: true,
      demo_config: DEFAULT_DEMO_MACHINE_CONFIG,
      last_seen_at: new Date(),
    },
  });

  await tx.farm_users.update({
    where: { id: farmUser.id },
    data: {
      tenant_id: tenant.id,
      farm_id: farm.id,
    },
  });

  return {
    tenantId: tenant.id,
    farmId: farm.id,
    farmSlug: slug,
  };
});
```

Important: existing code currently updates `farm_id` but not `tenant_id` on `farm_users`. This phase should set both because tutorial status and future user-scoped features depend on clean farm membership data.

### 4. Include Tutorial Status in Onboarding Status

Update `apps/api/src/domains/onboarding-domain/types.ts`.

```ts
export const tutorialStatusSchema = z.object({
  machineTutorialCompletedAt: z.date().nullable(),
  machineTutorialDismissedAt: z.date().nullable(),
});

export type TutorialStatus = z.infer<typeof tutorialStatusSchema>;
```

Extend `OnboardingStatus` result to include:

```ts
tutorial: {
  machineTutorialCompletedAt: Date | null;
  machineTutorialDismissedAt: Date | null;
}
```

Update `getOnboardingStatus.ts` to return tutorial state for users with a farm.

```ts
return {
  needsOnboarding: false,
  status: 'has_farm',
  farm: {
    id: farmUser.farms.id,
    name: farmUser.farms.name,
    slug: farmUser.farms.slug,
    tenantId: farmUser.farms.tenant_id!,
  },
  tutorial: {
    machineTutorialCompletedAt: farmUser.machine_tutorial_completed_at,
    machineTutorialDismissedAt: farmUser.machine_tutorial_dismissed_at,
  },
};
```

For users still needing onboarding, return null tutorial values.

### 5. Add Tutorial Completion Mutation

Update `apps/api/src/domains/onboarding-domain/types.ts`.

```ts
export const completeMachineTutorialSchema = z.object({
  outcome: z.enum(['completed', 'dismissed']),
});

export type CompleteMachineTutorialInput = z.infer<typeof completeMachineTutorialSchema>;
```

Add command file:

`apps/api/src/domains/onboarding-domain/commands/completeMachineTutorial.ts`

```ts
import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { CompleteMachineTutorialInput } from '../types.js';

export async function completeMachineTutorial(
  prisma: PrismaClient,
  userId: string,
  input: CompleteMachineTutorialInput
): Promise<{ success: true }> {
  const farmUser = await prisma.farm_users.findFirst({
    where: {
      clerk_user_id: userId,
      is_active: true,
    },
  });

  if (!farmUser) {
    throw new Error('User not found');
  }

  const now = new Date();

  await prisma.farm_users.update({
    where: { id: farmUser.id },
    data: input.outcome === 'completed'
      ? { machine_tutorial_completed_at: now }
      : { machine_tutorial_dismissed_at: now },
  });

  return { success: true };
}
```

Update `apps/api/src/domains/onboarding-domain/router.ts`.

```ts
import { completeMachineTutorialSchema } from './types.js';
import { completeMachineTutorial } from './commands/completeMachineTutorial.js';

export const onboardingRouter = router({
  status: authedProcedure.query(({ ctx }) =>
    getOnboardingStatus(ctx.prisma, ctx.userId)
  ),

  createTenantAndFarm: authedProcedure
    .input(createTenantAndFarmSchema)
    .mutation(({ ctx, input }) =>
      createTenantAndFarm(ctx.prisma, ctx.userId, input)
    ),

  completeMachineTutorial: authedProcedure
    .input(completeMachineTutorialSchema)
    .mutation(({ ctx, input }) =>
      completeMachineTutorial(ctx.prisma, ctx.userId, input)
    ),

  farms: authedProcedure.query(({ ctx }) =>
    getUserFarms(ctx.prisma, ctx.userId)
  ),
});
```

### 6. Simulate Preset Sync for Demo Machines Without IoT

Users should be able to walk through changing presets on the demo machine. The implementation should keep the same frontend request/poll/update flow, but short-circuit demo machines in the backend and never call `publishToDevice`.

Use a persisted `machines.demo_config` JSON field for demo machines. This lets a user edit demo presets, refresh the page, and still see the edited demo values. It also keeps all real machine config in the existing IoT-backed flow.

Add a demo config fixture near the preset command code:

`apps/api/src/domains/machine-domain/mqtt/machine-presets/demoConfig.ts`

```ts
import type { MachineConfig } from '../../types.js';

export const DEFAULT_DEMO_MACHINE_CONFIG: MachineConfig = {
  ready_to_run: true,
  active_variety: 1,
  variable_ranges: {
    belt_speed: { min: 10, max: 100 },
    blade_height: { min: 1, max: 50 },
    tray_spacing: { min: 1, max: 20 },
  },
  variety_names: {
    '1': 'Sunflower',
    '2': 'Radish',
    '3': 'Pea Shoots',
  },
  '1': {
    belt_speed: 45,
    blade_height: 12,
    tray_spacing: 6,
  },
  '2': {
    belt_speed: 38,
    blade_height: 10,
    tray_spacing: 5,
  },
  '3': {
    belt_speed: 52,
    blade_height: 14,
    tray_spacing: 7,
  },
};
```

Add a small merge helper so updates behave like the Pi command handler:

```ts
import type { MachineConfig, VarietyPreset } from '../../types.js';

export function mergeDemoMachineConfig(
  currentConfig: MachineConfig,
  payload: {
    presets?: Record<string, VarietyPreset>;
    variety_names?: Record<string, string>;
  }
): MachineConfig {
  const nextConfig: MachineConfig = {
    ...currentConfig,
    variable_ranges: currentConfig.variable_ranges,
    variety_names: {
      ...(currentConfig.variety_names ?? {}),
      ...(payload.variety_names ?? {}),
    },
  };

  if (payload.presets) {
    for (const [presetNumber, values] of Object.entries(payload.presets)) {
      nextConfig[presetNumber] = {
        ...((nextConfig[presetNumber] as VarietyPreset | undefined) ?? {}),
        ...values,
      };
    }
  }

  return nextConfig;
}
```

Update:

- `apps/api/src/domains/machine-domain/mqtt/machine-presets/requestMachineConfig.ts`
- `apps/api/src/domains/machine-domain/mqtt/machine-presets/updateMachineConfig.ts`

For `requestMachineConfig`, if `machine.is_demo` is true:

```ts
if (machine.is_demo) {
  const requestId = randomUUID();
  const config = (machine.demo_config as MachineConfig | null) ?? DEFAULT_DEMO_MACHINE_CONFIG;

  await prisma.machines.update({
    where: { id: machine.id },
    data: { demo_config: config },
  });

  storeResponse(requestId, {
    action: 'presets_response',
    config,
  });

  storeVariableRanges(machine.device_id, config.variable_ranges ?? {});

  return { requestId };
}
```

For `updateMachineConfig`, if `machine.is_demo` is true:

```ts
if (machine.is_demo) {
  const requestId = randomUUID();
  const currentConfig = (machine.demo_config as MachineConfig | null) ?? DEFAULT_DEMO_MACHINE_CONFIG;

  if (payload.presets && Object.keys(payload.presets).length > 0) {
    validatePresetValues(payload.presets, currentConfig.variable_ranges ?? {});
  }

  const nextConfig = mergeDemoMachineConfig(currentConfig, payload);

  await prisma.machines.update({
    where: { id: machine.id },
    data: { demo_config: nextConfig },
  });

  storeResponse(requestId, {
    action: 'presets_updated',
    success: true,
  });

  storeVariableRanges(machine.device_id, nextConfig.variable_ranges ?? {});

  return { requestId };
}
```

For non-demo machines, keep the existing behavior: validate ranges, publish to AWS IoT, and wait for a real `pong` response.

This gives the tutorial a fully working preset-editing path while still preventing accidental publishes to `rooted/machines/demo-{farmId}/commands`.

### 7. Delete Behavior for Demo Machines

Existing delete behavior can remain if it deletes by `deviceId` and tenant scope. The important rule is:

- Deleting a demo machine is allowed.
- The app must not recreate the demo machine on every login.
- Demo machine recreation should only happen through a future explicit "Reset demo data" action.

---

## Frontend Implementation Plan

### 1. Install Joyride

Root package:

```bash
pnpm add react-joyride
```

### 2. Add Stable Tour Targets

Use `data-tour` attributes instead of fragile class selectors.

In `src/machines/dashboard/MachinesDashboard.tsx`:

```tsx
<h1
  data-tour="machines-heading"
  className="text-2xl font-semibold text-foreground"
>
  Machine Management
</h1>

<button
  data-tour="add-machine-button"
  onClick={() => setIsOnboardModalOpen(true)}
  disabled={!isBluetoothSupported}
  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
>
  <Plus size={18} />
  Add Machine
</button>
```

In `src/machines/dashboard/components/MachineCard.tsx`:

```tsx
<div
  data-tour={machine.isDemo ? 'demo-machine-card' : undefined}
  className={`bg-card border rounded-lg transition-all overflow-hidden ${
    collapsible ? 'cursor-pointer' : ''
  } ${
    isCardExpanded ? 'border-primary shadow-lg' : 'border-border hover:border-border/80 hover:shadow-md'
  }`}
>
```

Add a visible demo label near the title:

```tsx
{machine.isDemo && (
  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
    Demo
  </span>
)}
```

Add a target around status:

```tsx
<div data-tour={machine.isDemo ? 'machine-status' : undefined} className="flex items-start gap-2">
  ...
</div>
```

In the sidebar item rendering, add a way to target Presets. If the shared sidebar component does not currently support arbitrary attributes per item, add a deterministic attribute based on the nav item ID:

```tsx
data-tour={`sidebar-${item.id}`}
```

Then the Presets target is:

```ts
'[data-tour="sidebar-presets"]'
```

### 3. Add Tutorial Component

Create:

`src/machines/tutorial/MachineTutorial.tsx`

```tsx
import { useEffect, useMemo, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { trpc } from '../../lib/trpc';

interface MachineTutorialProps {
  shouldRun: boolean;
}

export function MachineTutorial({ shouldRun }: MachineTutorialProps) {
  const [run, setRun] = useState(false);
  const trpcUtils = trpc.useUtils();

  const completeMutation = trpc.onboarding.completeMachineTutorial.useMutation({
    onSuccess: () => {
      trpcUtils.onboarding.status.invalidate();
    },
  });

  const steps = useMemo<Step[]>(() => [
    {
      target: '[data-tour="machines-heading"]',
      title: 'Machine Management',
      content: 'This is where you monitor machines, connect new hardware, and review operational status.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="demo-machine-card"]',
      title: 'Demo machine',
      content: 'We added a demo machine so you can explore the dashboard before connecting physical hardware.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="machine-status"]',
      title: 'Machine status',
      content: 'Status, network, last seen time, uptime, and fault metrics appear here as real telemetry arrives.',
      placement: 'left',
    },
    {
      target: '[data-tour="add-machine-button"]',
      title: 'Add real hardware',
      content: 'When your machine is ready, use Add Machine to connect over Bluetooth and provision WiFi.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="sidebar-presets"]',
      title: 'Presets',
      content: 'Presets let you view and update machine configuration once a real machine is online.',
      placement: 'right',
    },
  ], []);

  useEffect(() => {
    if (!shouldRun) return;

    const timeout = window.setTimeout(() => {
      const hasRequiredTarget = document.querySelector('[data-tour="demo-machine-card"]');
      if (hasRequiredTarget) {
        setRun(true);
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [shouldRun]);

  function handleCallback(data: CallBackProps) {
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (!finishedStatuses.includes(data.status)) {
      return;
    }

    setRun(false);

    completeMutation.mutate({
      outcome: data.status === STATUS.FINISHED ? 'completed' : 'dismissed',
    });
  }

  return (
    <Joyride
      run={run}
      steps={steps}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      callback={handleCallback}
      styles={{
        options: {
          primaryColor: '#16a34a',
          zIndex: 10000,
        },
      }}
    />
  );
}
```

### 4. Start Tutorial From Machines Dashboard

Update `src/machines/dashboard/MachinesDashboard.tsx`.

```tsx
import { MachineTutorial } from '../tutorial/MachineTutorial';

export default function MachinesDashboard() {
  ...
  const { data: onboardingStatus } = trpc.onboarding.status.useQuery(undefined, {
    retry: false,
  });

  const machines = machinesData?.items ?? [];
  const hasDemoMachine = machines.some((machine) => machine.isDemo);
  const shouldRunTutorial =
    !isMachinesLoading &&
    hasDemoMachine &&
    !onboardingStatus?.tutorial?.machineTutorialCompletedAt &&
    !onboardingStatus?.tutorial?.machineTutorialDismissedAt;

  return (
    <div className="space-y-6">
      <MachineTutorial shouldRun={shouldRunTutorial} />
      ...
    </div>
  );
}
```

### 5. Restart Tutorial

Add a small action later in the Machines page header or support/help menu. For the first implementation, this can be a local restart button that does not clear server state, because it is user-initiated.

Preferred first version:

```tsx
<button
  type="button"
  onClick={() => setTutorialRunKey((key) => key + 1)}
  className="text-sm text-muted-foreground hover:text-foreground"
>
  Restart tutorial
</button>
```

The exact placement can be decided during implementation, but it should not be prominent enough to distract from Add Machine.

---

## Fake Machine Handling Rules

### What the Demo Machine Is

A demo machine is a normal `machines` row with `is_demo = true`.

It appears in the same Machines list as real machines so the dashboard does not need a separate mock-only UI path.

Recommended demo values:

```ts
{
  name: 'HARVESTER',
  display_name: 'Demo Harvester',
  device_id: `demo-${farm.id}`,
  status: 'online',
  current_wifi_ssid: 'DEMO_NETWORK',
  is_demo: true,
  demo_config: DEFAULT_DEMO_MACHINE_CONFIG,
  last_seen_at: new Date(),
}
```

### What the Demo Machine Is Not

A demo machine is not:

- an AWS IoT Thing
- a Bluetooth-discoverable device
- a Timescale telemetry producer
- eligible for preset/config command publishing
- recreated on every login

### UI Behavior

- Display a `Demo` badge on demo machine cards.
- Keep existing default telemetry values as zeros.
- Show status as online so the tutorial can explain the online state.
- Do not pretend that live telemetry is flowing.
- If the user opens Presets for a demo machine, show the persisted demo config and allow sandbox edits.
- Preset UI copy should make it clear that demo preset changes are practice changes and are not sent to hardware.

### API Behavior

- Machine list returns demo machines alongside real machines.
- Delete allows removing demo machines.
- Preset/config request and update short-circuit for demo machines, store/read `machines.demo_config`, and never call `publishToDevice`.
- Telemetry handlers ignore demo machines naturally because no telemetry should arrive for `demo-*` device IDs.

### Future Reset Behavior

Do not include reset behavior in v1.

If needed later, add a mutation:

```ts
machines.resetDemoMachine
```

That mutation would:

1. Check the current tenant/farm.
2. Find an existing `is_demo` machine.
3. Restore it if present, or recreate one if absent.
4. Never touch real machines.

---

## Test Plan

### Backend Tests

Add or update tests for:

- `createTenantAndFarm`
  - creates tenant
  - creates farm
  - updates farm user with `tenant_id` and `farm_id`
  - creates exactly one demo machine
  - demo machine has `is_demo = true`
- `getOnboardingStatus`
  - returns tutorial status fields for users with a farm
  - returns null tutorial state for users without a farm
- `completeMachineTutorial`
  - marks completed timestamp for `outcome: "completed"`
  - marks dismissed timestamp for `outcome: "dismissed"`
  - only updates current active `farm_users` row
- `requestMachineConfig`
  - returns persisted demo config for demo machines
  - does not call `publishToDevice`
- `updateMachineConfig`
  - merges demo preset/name changes into `machines.demo_config`
  - does not call `publishToDevice`

### Frontend Manual Checks

1. New user signs in.
2. User creates farm.
3. App redirects to `/machines`.
4. Demo machine appears.
5. Tutorial starts after machine list loads.
6. User can advance through all steps.
7. Completion prevents tutorial from reappearing on refresh.
8. Skip prevents tutorial from reappearing on refresh.
9. Demo badge is visible.
10. Add Machine still opens the real hardware onboarding flow.
11. Deleting the demo machine removes it and does not recreate it on next login.
12. Existing farms do not receive duplicate demo machines.
13. Demo preset edits save, refresh, and reload from `machines.demo_config`.

### Commands to Run

```bash
pnpm build
pnpm --filter @rooted/api test:run
```

---

## Rollout Plan

### Phase 1: Schema and Backend

- Add Prisma migration.
- Add demo machine creation during farm onboarding.
- Add tutorial completion mutation.
- Add demo-machine preset simulation that bypasses IoT command publishing.
- Add backend tests.

### Phase 2: Frontend Tutorial

- Install `react-joyride`.
- Add `data-tour` targets.
- Add `MachineTutorial`.
- Trigger tutorial based on server-side onboarding status.
- Add visible demo badge.
- Add manual restart action if it fits cleanly.

### Phase 3: QA and Production Validation

- Test new-user onboarding locally.
- Test existing-user login to confirm no duplicate demo machines.
- Test demo machine deletion.
- Test demo preset request/update behavior and confirm no AWS IoT publish occurs.
- Run production build and API test suite.

---

## Non-Goals

This phase does not include:

- Planner tutorial.
- Multiple tutorials by role.
- Product analytics integration.
- A no-code onboarding editor.
- Demo telemetry generation.
- Existing-user demo backfill.
- Automatic demo machine recreation after deletion.

---

## Open Follow-Up Ideas

- Add a "Reset demo data" action.
- Track tutorial analytics after a product analytics stack exists.
- Add separate planner onboarding once Machines tutorial is stable.
