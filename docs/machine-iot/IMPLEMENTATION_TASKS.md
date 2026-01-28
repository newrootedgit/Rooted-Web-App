# Machine Onboarding - Implementation Tasks

Sequential tasks to implement machine onboarding functionality.

---

## Phase 1: Database Setup ✅ **COMPLETED**

### Task 1.1: Create Migration for Machines Table
- [x] Create migration file for `machines` table
- [x] Add columns: `id`, `tenant_id`, `farm_id`, `name`, `display_name`, `device_id`, `aws_iot_thing_name`, `status`, `current_wifi_ssid`, `last_seen_at`, `created_at`
- [x] Add indexes: `tenant_id`, `farm_id`, `device_id`
- [x] Add RLS policy for tenant/farm isolation
- [x] Run migration

### Task 1.2: Update Prisma Schema (if using Prisma)
- [x] Add `Machine` model to schema.prisma
- [x] Run `prisma generate`
- [x] Run `prisma db push` or create migration

---

## Phase 2: Backend API ✅ **COMPLETED**

### Task 2.1: Environment Variables
- [x] Add `MACHINE_ONBOARDING_CODE` to `.env`
- [x] Add to `.env.example`

### Task 2.2: Create tRPC Router for Machines
**File**: `apps/api/src/domains/machine-domain/router.ts`

- [x] Create `machineRouter`
- [x] Add `list` procedure (protected)
- [x] Add `create` (onboard) procedure (protected)
- [x] Add `delete` (remove) procedure (protected)

### Task 2.3: Register Machines Router
- [x] Import `machineRouter` in main tRPC router
- [x] Add to router: `machines: machineRouter`

### Task 2.4: Update tRPC Context
- [x] Ensure context includes `tenantId` and `farmId` from JWT
- [x] Verify Clerk JWT metadata includes these fields

---

## Phase 3: Frontend - Dashboard ✅ **COMPLETED**

### Task 3.1: Create Machines Dashboard Page
**File**: `src/machines/dashboard/MachinesDashboard.tsx`

- [x] Create component
- [x] Add route: `/machines`
- [x] Use `trpc.machines.list.useQuery()` to fetch machines
- [x] Display loading state
- [x] Display empty state with "Add New Machine" button
- [x] Display machine grid/list when data exists

### Task 3.2: Create Machine Card Component
**File**: `src/machines/dashboard/components/MachineCard.tsx`

- [x] Accept props: `machine` object
- [x] Display machine name
- [x] Display status indicator (online/offline)
- [x] Display "WiFi Configured" badge if WiFi is set up
- [x] Display last seen timestamp
- [x] Add "Provision WiFi" button
- [x] Add "Remove" button with confirmation

### Task 3.3: Add Machine List Component
**File**: `src/machines/dashboard/components/MachinesList.tsx`

- [x] Map over machines array
- [x] Render `MachineCard` for each machine
- [x] Handle empty state

---

## Phase 4: Frontend - Onboarding ✅ **COMPLETED**

### Task 4.1: Create BLE Scanner Hook
**File**: `src/machines/dashboard/hooks/useBluetoothScanner.ts`

- [x] Create hook `useBluetoothScanner()`
- [x] Check if Web Bluetooth is supported
- [x] Implement `scanForDevice()` functionality
- [x] Handle errors (not supported, user cancelled, etc.)

### Task 4.2: Create Onboarding Modal Component
**File**: `src/machines/device-discovery/components/OnboardMachine.tsx`

- [x] Display device name
- [x] Add "Onboard" flow
- [x] Call `trpc.machines.create.useMutation()`
- [x] On success: close modal, refetch machine list

### Task 4.3: Wire Up "Add New Machine" Flow
- [x] Add "Add New Machine" button
- [x] On click: call `scanForDevice()`
- [x] On device selected: open onboarding flow

---

## Phase 5: Frontend - Remove Machine ✅ **COMPLETED**

### Task 5.1: Implement Remove Functionality
- [x] Add `trpc.machines.delete.useMutation()`
- [x] On "Remove" button click: show confirmation dialog
- [x] On confirm: call mutation with machine id

---

## Phase 6: Testing & Polish ✅ **COMPLETED**

### Task 6.1: Test Onboarding Flow
- [x] Start Pi with BLE service running
- [x] Navigate to `/machines`
- [x] Verify onboarding flow works

### Task 6.2: Test Error Cases
- [x] Test with unsupported browser
- [x] Test user cancelling device picker

### Task 6.3: UI Polish
- [x] Add loading spinners
- [x] Add success/error toasts
- [x] Ensure responsive design

---

## Phase 7: Pi Integration ✅ **COMPLETED**

### Task 7.1: Update Pi BLE Service
**File**: `pi-src/provisioner.py`

- [x] Ensure device name is set correctly
- [x] Verify service UUID matches
- [x] Test BLE advertisement is working

---

## Verification Checklist

- [ ] Database migration applied successfully
- [ ] Backend API endpoints working (test with Postman/curl)
- [ ] Frontend can fetch empty machine list
- [ ] "Add New Machine" button triggers BLE scan
- [ ] Browser shows device picker with Pi device
- [ ] Onboarding modal appears with device name
- [ ] Entering correct code creates machine in database
- [ ] Machine appears on dashboard after onboarding
- [ ] Remove button deletes machine from database
- [ ] Multi-tenant isolation working (machines scoped to farm)

---

## Next Steps (After Onboarding Complete)

1. WiFi provisioning flow (BLE characteristic writes)
2. AWS IoT Core integration (connectivity monitoring)
3. Status checking endpoint
4. "Find via Bluetooth" for offline machines
5. Re-provisioning flow

---

## Dependencies

**Backend:**
- tRPC setup
- Clerk authentication
- PostgreSQL with RLS
- Prisma (optional)

**Frontend:**
- React
- tRPC client
- React Query
- Web Bluetooth API support

**Pi:**
- Python 3.9+
- bluezero library
- BLE service running

---

## Estimated Time

- Phase 1: 30 min
- Phase 2: 1 hour
- Phase 3: 1 hour
- Phase 4: 1.5 hours
- Phase 5: 30 min
- Phase 6: 1 hour
- Phase 7: 15 min

**Total: ~5.5 hours**
