/**
 * In-memory store for temporary MQTT request-response data.
 *
 * Used for machine config requests where:
 * 1. API sends request to device via MQTT
 * 2. Device responds asynchronously
 * 3. Client polls for response
 *
 * Memory Safety:
 * - TTL-based expiration (100s)
 * - Automatic cleanup every 60s to prevent memory leaks from unpolled entries
 * - Cleanup uses unref() to allow graceful process shutdown
 * - Store size monitored via getStoreStats()
 */

const CONFIG_TTL_MS = Number(process.env.CONFIG_TTL_MS) || 100_000;
const CLEANUP_INTERVAL_MS = Number(process.env.CLEANUP_INTERVAL_MS) || 60_000;

interface StoredResponse {
    data: Record<string, unknown>;
    expiresAt: number;
    timestamp: number;
}

const store = new Map<string, StoredResponse>();

let cleanupStats = {
    lastCleanup: Date.now(),
    totalCleaned: 0,
    lastCleanedCount: 0,
};

function runCleanup(): void {
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
}

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

export function startCleanup(): void {
    stopCleanup();
    cleanupInterval = setInterval(runCleanup, CLEANUP_INTERVAL_MS);
    cleanupInterval.unref();
}

export function stopCleanup(): void {
    if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
    }
}

// Auto-start on module load
startCleanup();

export function clearStore(): void {
    store.clear();
    cleanupStats = {
        lastCleanup: Date.now(),
        totalCleaned: 0,
        lastCleanedCount: 0,
    };
}

export function getStoreStats() {
    return {
        size: store.size,
        cleanup: { ...cleanupStats },
    };
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
