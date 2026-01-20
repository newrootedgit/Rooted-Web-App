# User Onboarding System Implementation

**Date:** 2026-01-19  
**Developer:** Vishal Vunnam  
**Agent:** Kiro CLI

## Overview

Implemented automatic tenant and farm creation on user signup using lazy initialization. When a user first accesses the app after signing up with Clerk, the system automatically creates a placeholder `farm_users` entry if one doesn't exist. The user is then redirected to an onboarding page where they enter their farm name, which creates a tenant and farm in a single transaction.

## Implementation Summary

### Lazy Initialization Pattern

**Reasoning:** Simpler than webhooks - no external configuration, no ngrok for local dev, no webhook secrets. The farm_users entry is created on first app access rather than immediately on signup.

**Implementation:** The `onboarding.status` endpoint checks if a farm_users entry exists for the authenticated user. If not, it creates a placeholder entry with null farm_id.

**Tradeoffs:**
- ✅ Simpler development and deployment
- ✅ No webhook configuration required
- ✅ Works immediately without external setup
- ⚠️ Slight delay on first login (one extra DB write)
- ⚠️ User record doesn't exist until first app access

### Phase 1: Onboarding Domain (Backend)

**Reasoning:** Following feature-based module structure from STYLE.md. Onboarding is a distinct business domain that handles tenant/farm creation.

**Files Created:**
- `apps/api/src/onboarding-domain/types.ts` - Zod schemas and TypeScript types
- `apps/api/src/onboarding-domain/service/createTenantAndFarm.ts` - Business logic for tenant/farm creation
- `apps/api/src/onboarding-domain/router.ts` - tRPC procedures for onboarding

**Files Modified:**
- `apps/api/src/lib/trpc/router.ts` - Added onboarding router to main app router
- `apps/api/src/onboarding-domain/router.ts` - Added lazy initialization in status endpoint

**Key Decisions:**
- Lazy initialization: Create farm_users on first app access if missing
- Used `authedProcedure` (not `farmProcedure`) since users don't have farm context yet
- Slug generation: lowercase, replace non-alphanumeric with hyphens, ensure uniqueness
- Transaction ensures atomicity: create tenant → create farm → update farm_user
- Three endpoints: `status` (check onboarding + lazy init), `createTenantAndFarm` (complete onboarding), `farms` (list user's farms)

**API Endpoints:**
```typescript
trpc.onboarding.status.query()
// Returns: { needsOnboarding: boolean, status: 'no_farm' | 'has_farm', farm?: {...} }

trpc.onboarding.createTenantAndFarm.mutate({ farmName: 'My Farm' })
// Returns: { tenantId, farmId, farmSlug }

trpc.onboarding.farms.query()
// Returns: [{ farmId, name, slug, role }]
```

### Phase 2: Onboarding Page (Frontend)

**Reasoning:** Simple, focused UI for farm name input. Follows existing patterns from machines/planner pages.

**Files Created:**
- `src/onboarding/OnboardingPage.tsx` - Onboarding form component

**Files Modified:**
- `src/App.tsx` - Added `/onboarding` route
- `src/auth/components/ProtectedRoute.tsx` - Added onboarding status check
- `tsconfig.json` - Added `@onboarding/*` path alias
- `vite.config.ts` - Added `@onboarding` alias

**Key Decisions:**
- ProtectedRoute checks onboarding status and redirects to `/onboarding` if needed
- Prevents infinite redirect by checking `location.pathname !== '/onboarding'`
- Form validation: minimum 2 characters for farm name
- Loading states during mutation
- Error display for user feedback
- Auto-redirect to `/machines` on success

## Flow Diagram

```
User Signs Up (Clerk)
    ↓
User logs in → ProtectedRoute checks onboarding status
    ↓
onboarding.status endpoint checks farm_users
    ↓
If not exists → Create placeholder farm_users (lazy init)
    ↓
If farm_id is null → Redirect to /onboarding
    ↓
User enters farm name → Submit form
    ↓
createTenantAndFarm mutation
    ↓
Transaction:
  1. Create tenant
  2. Create farm with unique slug
  3. Update farm_users.farm_id
    ↓
Redirect to /machines
```

## Database Changes

No schema changes required. Existing tables support the flow:
- `farm_users.farm_id` can be null (for users pending onboarding)
- `farm_users` entry created lazily on first app access
- `tenants` table for multi-tenancy
- `farms` table with unique slug constraint

## Testing Checklist

1. **First Login Test:**
   - Sign up as new user in Clerk
   - Log in to app
   - Verify farm_users entry auto-created (check database)
   - Verify redirect to `/onboarding`

2. **Onboarding Test:**
   - Enter farm name and submit
   - Verify tenant + farm created in database
   - Verify farm_users.farm_id updated
   - Verify redirect to `/machines`

3. **Existing User Test:**
   - User with farm_id should not see onboarding
   - Should go directly to dashboard

## Future Phases (Deferred)

### Webhooks (Alternative Approach)
- Clerk webhook for user.created event
- Eager farm_users creation on signup (vs current lazy initialization)
- Webhook signature verification with svix
- Benefits: User record exists immediately, better for analytics/admin tools

### Farm Invites System
- Farm invites table (email, token, role, expiration)
- Invite domain with create, list, cancel endpoints
- Invite link flow for joining existing farms
- Email notifications for invites

### Additional Features
- Farm switcher UI for users with multiple farms
- Onboarding progress indicator
- User profile management

## Dependencies

No external dependencies added. Removed svix (was for webhook approach).

## Code Quality Notes

- Followed STYLE.md: feature-based modules, camelCase files, Zod schemas
- Followed AGENT.md: documented reasoning, ensured farm multi-tenancy
- Minimal comments (per user preference)
- Early returns over deep nesting
- Type safety throughout (no `any` types)
- Error handling with user-friendly messages
