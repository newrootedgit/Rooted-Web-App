# Machine Documentation Feature - Upgrade Plan

## Overview
Add documentation tab to machines page with setup, troubleshooting, and maintenance guides organized by machine type.

---

## Phase 1: Database Schema

### Tasks
- [ ] Create `machine_types` table
  - id, name, description, image_url, created_at
- [ ] Create `machine_documentation` table
  - id, machine_type_id, section (enum: setup/troubleshooting/maintenance), title, content, order, created_at, updated_at
- [ ] Add `machine_type_id` to `machines` table
- [ ] Create Prisma migration

### Considerations
- Documentation versioning needed?
- Support for images/videos in content?
- Full-text search requirement?

---

## Phase 2: Backend API

### Tasks
- [ ] Add tRPC procedures:
  - `machineTypes.list`
  - `machineTypes.getById`
  - `machineDocumentation.getByMachineType`
  - `machineDocumentation.getBySection`
- [ ] Create seed script for machine types and sample docs
- [ ] Add admin procedures (create/update/delete) for future use

### Considerations
- Seed data for initial machine types
- Documentation content format (markdown vs plain text)

---

## Phase 3: Frontend UI

### Tasks
- [ ] Create `src/machines/documentation/` directory structure
- [ ] Build components:
  - `DocumentationTab.tsx` - Main tab container
  - `DocumentationSection.tsx` - Section display (setup/troubleshooting/maintenance)
  - `DocumentationContent.tsx` - Markdown renderer
- [ ] Create `useDocumentation.ts` hook for tRPC queries
- [ ] Add "Documentation" to sidebar navigation in `MachinesPage.tsx`
- [ ] Implement section navigation (accordion or tabs)

### Considerations
- Show docs for specific machine type or all types?
- Navigation: accordion vs tabs vs list?
- Markdown rendering library (react-markdown?)

---

## Phase 4: Machine Type Assignment

### Tasks
- [ ] Assign machine types to existing machines (manual or script)
- [ ] Update machine onboarding to capture/assign type
- [ ] Add machine type display to machine cards

### Considerations
- **Critical**: How to identify machine type?
  - Option A: BLE device name includes type (e.g., "Rooted-MGv2-ABC123")
  - Option B: Manual selection during onboarding
  - Option C: GATT characteristic for type info
- Default type for unassigned machines?

---

## Phase 5: Content Management (Future)

### Tasks
- [ ] **Option A - Git-based** (Recommended first):
  - Store docs as markdown files in repo
  - Seed database from files on deploy
- [ ] **Option B - Admin Panel** (Later):
  - Build CRUD UI for types and docs
  - Markdown editor with preview
  - Role-based access control

### Considerations
- Git-based easier for version control
- Admin panel better for non-technical updates
- Hybrid approach possible

---

## Open Questions

1. **Machine Type Detection**: How do we identify which type a machine is during onboarding?

2. **Documentation Scope**: 
   - Type-level docs only?
   - Instance-specific notes per machine?
   - Hybrid approach?

3. **Content Format**:
   - Markdown sufficient?
   - Need embedded media support?
   - Interactive troubleshooting flows?

4. **Search**: Full-text search across docs needed in MVP?

---

## Recommended Execution

**MVP** (Phases 1-3):
- Database + API + Basic UI
- Manual type assignment for existing machines

**Full Feature** (Add Phase 4):
- Automated type detection
- Integrated onboarding

**Content Management** (Add Phase 5):
- Git-based docs → Admin panel
