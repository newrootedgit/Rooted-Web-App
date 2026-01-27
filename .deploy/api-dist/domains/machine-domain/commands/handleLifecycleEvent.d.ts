import type { PrismaClient } from '../../../generated/prisma/client.js';
interface LifecycleEventInput {
    deviceId: string;
    eventType: 'connected' | 'disconnected';
    timestamp: string;
    sessionId?: string;
    wifiSsid?: string;
}
export declare function handleLifecycleEvent(prisma: PrismaClient, input: LifecycleEventInput): Promise<void>;
export {};
//# sourceMappingURL=handleLifecycleEvent.d.ts.map