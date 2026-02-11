const CONFIG_TTL_MS = 100_000; 

interface StoredResponse { 
    data: Record<string, unknown>;
    expiresAt: number;
    timestamp: number;
}

const store = new Map<string, StoredResponse>();

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

