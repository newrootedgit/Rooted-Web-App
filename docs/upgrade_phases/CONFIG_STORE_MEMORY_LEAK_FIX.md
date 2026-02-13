# Config Store Memory Leak Fix

**Status:** Planned  
**Priority:** High  
**Estimated Time:** 1-2 hours  
**Target:** Machine Domain - Config Store

## Problem Statement

The current in-memory config store (`apps/api/src/lib/aws/config-store.ts`) has a memory leak:

1. **Lazy Deletion Only** - Expired entries are only removed when accessed via `getResponse()`
2. **Unbounded Growth** - If a config request is made but never polled, the entry stays in memory forever
3. **No Cleanup Mechanism** - The Map grows indefinitely in long-running production environments

### Current Flow
```
Request made → requestId stored in Map with 100s TTL
Response arrives → data stored in Map  
Client polls → if expired, delete and return null
❌ Problem: If client never polls, entry never gets deleted
```

### Impact
- Memory accumulates over time with orphaned request entries
- Production risk with high-frequency machine config requests
- No visibility into store size or memory usage

## Solution: Periodic Cleanup

Add background cleanup interval to proactively remove expired entries.

### Design Decisions
- **Cleanup Interval:** 60 seconds (configurable)
- **TTL:** Keep existing 100 seconds
- **Graceful Shutdown:** Use `unref()` to allow process exit
- **Export Cleanup Control:** Allow manual stop for testing

## Implementation Phases

### Phase 1: Add Periodic Cleanup (30 min)

**File:** `apps/api/src/lib/aws/config-store.ts`

**Changes:**
1. Add cleanup interval constant
2. Implement cleanup function that iterates Map and deletes expired entries
3. Start interval on module load with `unref()`
4. Export `stopCleanup()` for graceful shutdown

**Code:**
```typescript
const CONFIG_TTL_MS = 100_000; 
const CLEANUP_INTERVAL_MS = 60_000; // Clean every 60s

interface StoredResponse { 
    data: Record<string, unknown>;
    expiresAt: number;
    timestamp: number;
}

const store = new Map<string, StoredResponse>();

// Periodic cleanup
const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [requestId, entry] of store.entries()) {
        if (now > entry.expiresAt) {
            store.delete(requestId);
        }
    }
}, CLEANUP_INTERVAL_MS);

// Allow graceful shutdown - don't block process exit
cleanupInterval.unref();

export function stopCleanup(): void {
    clearInterval(cleanupInterval);
}

export function storeResponse(requestId: string, data: Record<string, unknown>): void { 
    store.set(requestId, {
        data,
        expiresAt: Date.now() + CONFIG_TTL_MS,
        timestamp: Date.now(),
    });
}

export function getResponse(requestId: string): Record<string, unknown> | null {
    const entry = store.get(requestId);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
        store.delete(requestId);
        return null;
    }
    
    return entry.data;
}
```

**Testing:**
- Verify cleanup runs every 60s
- Verify expired entries are removed
- Verify active entries are preserved
- Verify `unref()` allows process to exit

### Phase 2: Add Observability (20 min)

**File:** `apps/api/src/lib/aws/config-store.ts`

**Changes:**
1. Add `getStoreStats()` function for monitoring
2. Track cleanup metrics (entries removed per cycle)

**Code:**
```typescript
let cleanupStats = {
    lastCleanup: Date.now(),
    totalCleaned: 0,
    lastCleanedCount: 0,
};

// Update cleanup interval
const cleanupInterval = setInterval(() => {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [requestId, entry] of store.entries()) {
        if (now > entry.expiresAt) {
            store.delete(requestId);
            cleaned++;
        }
    }
    
    cleanupStats = {
        lastCleanup: now,
        totalCleaned: cleanupStats.totalCleaned + cleaned,
        lastCleanedCount: cleaned,
    };
}, CLEANUP_INTERVAL_MS);

export function getStoreStats() {
    return {
        size: store.size,
        cleanup: cleanupStats,
    };
}
```

**Testing:**
- Verify stats return current store size
- Verify cleanup counts are accurate
- Add to health check endpoint if needed

### Phase 3: Add Tests (30 min)

**File:** `apps/api/src/lib/aws/__tests__/config-store.test.ts` (new)

**Test Cases:**
1. Store and retrieve response within TTL
2. Expired response returns null
3. Cleanup removes expired entries
4. Cleanup preserves active entries
5. Stats return accurate counts
6. `stopCleanup()` stops interval

**Code:**
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { storeResponse, getResponse, stopCleanup, getStoreStats } from '../config-store.js';

describe('config-store', () => {
    afterEach(() => {
        stopCleanup();
    });

    it('stores and retrieves response within TTL', () => {
        storeResponse('req-1', { config: 'test' });
        const result = getResponse('req-1');
        expect(result).toEqual({ config: 'test' });
    });

    it('returns null for expired response', async () => {
        vi.useFakeTimers();
        storeResponse('req-2', { config: 'test' });
        
        vi.advanceTimersByTime(101_000); // Past TTL
        
        const result = getResponse('req-2');
        expect(result).toBeNull();
        vi.useRealTimers();
    });

    it('cleanup removes expired entries', async () => {
        vi.useFakeTimers();
        
        storeResponse('req-3', { config: 'test' });
        storeResponse('req-4', { config: 'test' });
        
        vi.advanceTimersByTime(101_000); // Expire entries
        vi.advanceTimersByTime(60_000);  // Trigger cleanup
        
        const stats = getStoreStats();
        expect(stats.size).toBe(0);
        expect(stats.cleanup.lastCleanedCount).toBe(2);
        
        vi.useRealTimers();
    });

    it('cleanup preserves active entries', async () => {
        vi.useFakeTimers();
        
        storeResponse('req-5', { config: 'test' });
        
        vi.advanceTimersByTime(60_000); // Trigger cleanup, but not expired
        
        const stats = getStoreStats();
        expect(stats.size).toBe(1);
        expect(stats.cleanup.lastCleanedCount).toBe(0);
        
        vi.useRealTimers();
    });
});
```

**Testing:**
- Run tests: `cd apps/api && pnpm test config-store`
- Verify all tests pass
- Check coverage: `pnpm test:coverage`

### Phase 4: Documentation (10 min)

**File:** `apps/api/src/lib/aws/config-store.ts`

**Changes:**
Add JSDoc comments explaining:
- Purpose of the store
- TTL behavior
- Cleanup mechanism
- Memory safety guarantees

**Code:**
```typescript
/**
 * In-memory store for temporary MQTT request-response data.
 * 
 * Used for machine config requests where:
 * 1. API sends request to device via MQTT
 * 2. Device responds asynchronously
 * 3. API polls for response
 * 
 * Features:
 * - TTL-based expiration (100s default)
 * - Automatic cleanup every 60s to prevent memory leaks
 * - Lazy deletion on access
 * 
 * Memory Safety:
 * - Expired entries removed by background cleanup
 * - Cleanup uses unref() to allow graceful shutdown
 * - Store size monitored via getStoreStats()
 */
```

## Deployment Plan

### Pre-Deployment
1. Review code changes
2. Run full test suite
3. Test in development environment

### Deployment
1. Deploy to production
2. Monitor store stats via health check
3. Watch for memory growth patterns

### Post-Deployment
1. Monitor memory usage for 24 hours
2. Check cleanup stats in logs
3. Verify no performance degradation

## Rollback Plan

If issues occur:
1. Revert to previous version
2. Store will continue working (just without cleanup)
3. Memory leak returns but system remains functional

## Success Metrics

- ✅ Store size remains bounded (< 100 entries typical)
- ✅ Cleanup runs every 60s
- ✅ No memory growth over 24 hours
- ✅ All tests passing
- ✅ Zero production incidents

## Future Considerations

### If Scaling to Multiple API Instances
Current solution only works for single API instance. If horizontal scaling is needed:

**Option A: Redis**
- Already in infrastructure
- Shared across instances
- Built-in TTL
- Network latency trade-off

**Option B: Sticky Sessions**
- Route same device to same API instance
- Keep in-memory store
- More complex load balancing

**Recommendation:** Migrate to Redis when scaling beyond single instance.

## References

- Current Implementation: `apps/api/src/lib/aws/config-store.ts`
- Usage: `apps/api/src/domains/machine-domain/mqtt/`
- Related: [MACHINE_CONFIG_SYNC.md](./MACHINE_CONFIG_SYNC.md)

## Timeline

- **Phase 1:** 30 minutes - Core cleanup implementation
- **Phase 2:** 20 minutes - Observability
- **Phase 3:** 30 minutes - Tests
- **Phase 4:** 10 minutes - Documentation

**Total:** 1.5 hours

## Approval

- [ ] Technical review completed
- [ ] Security review (if needed)
- [ ] Ready for implementation

---

**Last Updated:** 2026-02-13  
**Author:** Development Team  
**Status:** Ready for Implementation
