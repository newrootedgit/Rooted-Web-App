# Machine Onboarding - Implementation Tasks

Sequential tasks to implement machine onboarding functionality.

---

## Phase 1: Database Setup

### Task 1.1: Create Migration for Machines Table
- [ ] Create migration file for `machines` table
- [ ] Add columns: `id`, `tenant_id`, `farm_id`, `onboarded_by`, `name`, `aws_iot_thing_name`, `status`, `wifi_configured`, `last_seen_at`, `created_at`, `updated_at`
- [ ] Add indexes: `(tenant_id, farm_id, name)` unique, `tenant_id`, `farm_id`, `status`, `aws_iot_thing_name`
- [ ] Add RLS policy for tenant/farm isolation
- [ ] Run migration

### Task 1.2: Update Prisma Schema (if using Prisma)
- [ ] Add `Machine` model to schema.prisma
- [ ] Run `prisma generate`
- [ ] Run `prisma db push` or create migration

---

## Phase 2: Backend API

### Task 2.1: Environment Variables
- [ ] Add `MACHINE_ONBOARDING_CODE` to `.env`
- [ ] Add to `.env.example`

### Task 2.2: Create tRPC Router for Machines
**File**: `server/routers/machines.ts` (or similar)

- [ ] Create `machinesRouter`
- [ ] Add `list` procedure (protected)
  - Query machines by `tenant_id` and `farm_id` from context
  - Order by `last_seen_at DESC`
- [ ] Add `onboard` procedure (protected)
  - Input: `{ name: string, onboardingCode: string }`
  - Verify onboarding code matches env variable
  - Create machine record with `tenant_id`, `farm_id`, `onboarded_by` from context
  - Return machine object
- [ ] Add `remove` procedure (protected)
  - Input: `{ id: string }`
  - Delete machine where id matches and belongs to user's farm
- [ ] Export router

### Task 2.3: Register Machines Router
- [ ] Import `machinesRouter` in main tRPC router
- [ ] Add to router: `machines: machinesRouter`

### Task 2.4: Update tRPC Context
- [ ] Ensure context includes `tenantId` and `farmId` from JWT
- [ ] Verify Clerk JWT metadata includes these fields

---

## Phase 3: Frontend - Dashboard

### Task 3.1: Create Machines Dashboard Page
**File**: `machines/src/dashboard/MachinesDashboard.tsx`

- [ ] Create component
- [ ] Add route: `/machines/dashboard`
- [ ] Use `trpc.machines.list.useQuery()` to fetch machines
- [ ] Display loading state
- [ ] Display empty state with "Add New Machine" button
- [ ] Display machine grid/list when data exists

### Task 3.2: Create Machine Card Component
**File**: `machines/src/dashboard/MachineCard.tsx`

- [ ] Accept props: `machine` object
- [ ] Display machine name
- [ ] Display status indicator (online/offline)
- [ ] Display "WiFi Configured" badge if `wifiConfigured === true`
- [ ] Display last seen timestamp
- [ ] Add "Provision WiFi" button
- [ ] Add "Remove" button with confirmation

### Task 3.3: Add Machine List Component
**File**: `machines/src/dashboard/MachineList.tsx`

- [ ] Map over machines array
- [ ] Render `MachineCard` for each machine
- [ ] Handle empty state

---

## Phase 4: Frontend - Onboarding

### Task 4.1: Create BLE Scanner Hook
**File**: `machines/src/lib/bluetooth/useBluetoothScanner.ts`

- [ ] Create hook `useBluetoothScanner()`
- [ ] Check if Web Bluetooth is supported
- [ ] Implement `scanForDevice()` function:
  - Call `navigator.bluetooth.requestDevice()`
  - Filter by service UUID: `322486ee-3b18-476d-86ae-2481eafaea9a`
  - Return device with name
- [ ] Handle errors (not supported, user cancelled, etc.)
- [ ] Return `{ scanForDevice, isScanning, error }`

### Task 4.2: Create Onboarding Modal Component
**File**: `machines/src/dashboard/OnboardingModal.tsx`

- [ ] Accept props: `isOpen`, `onClose`, `deviceName`
- [ ] Display device name
- [ ] Add input field for onboarding code
- [ ] Add "Onboard" button
- [ ] Call `trpc.machines.onboard.useMutation()`
- [ ] On success: close modal, refetch machine list
- [ ] On error: display error message
- [ ] Handle loading state

### Task 4.3: Wire Up "Add New Machine" Flow
**In**: `MachinesDashboard.tsx`

- [ ] Add "Add New Machine" button
- [ ] On click: call `scanForDevice()` from hook
- [ ] On device selected: open `OnboardingModal` with device name
- [ ] Handle BLE errors (show toast/alert)

---

## Phase 5: Frontend - Remove Machine

### Task 5.1: Implement Remove Functionality
**In**: `MachineCard.tsx`

- [ ] Add `trpc.machines.remove.useMutation()`
- [ ] On "Remove" button click: show confirmation dialog
- [ ] On confirm: call mutation with machine id
- [ ] On success: refetch machine list
- [ ] On error: show error message

---

## Phase 6: Testing & Polish

### Task 6.1: Test Onboarding Flow
- [ ] Start Pi with BLE service running
- [ ] Navigate to `/machines/dashboard`
- [ ] Click "Add New Machine"
- [ ] Select device from browser picker
- [ ] Enter correct onboarding code
- [ ] Verify machine appears on dashboard with "offline" status

### Task 6.2: Test Error Cases
- [ ] Test with wrong onboarding code
- [ ] Test with unsupported browser (Firefox/Safari)
- [ ] Test user cancelling device picker
- [ ] Test Bluetooth disabled/unavailable

### Task 6.3: UI Polish
- [ ] Add loading spinners
- [ ] Add success/error toasts
- [ ] Add empty state illustrations
- [ ] Ensure responsive design
- [ ] Add proper error messages

---

## Phase 7: Pi Integration (Minimal for Onboarding)

### Task 7.1: Update Pi BLE Service
**File**: `machines/pi-src/provisioner.py`

- [ ] Ensure device name is set correctly (will show in BLE picker)
- [ ] Verify service UUID matches: `322486ee-3b18-476d-86ae-2481eafaea9a`
- [ ] Test BLE advertisement is working

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
