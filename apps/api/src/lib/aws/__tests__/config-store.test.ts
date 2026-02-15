import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { storeResponse, getResponse, stopCleanup, startCleanup, clearStore, getStoreStats } from '../config-store.js';

describe('config-store', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        clearStore();
        // Restart cleanup under fake timers so advanceTimersByTime triggers it
        startCleanup();
    });

    afterEach(() => {
        stopCleanup();
        vi.useRealTimers();
    });

    describe('storeResponse / getResponse', () => {
        it('stores and retrieves a response within TTL', () => {
            storeResponse('req-1', { config: 'test' });
            const result = getResponse('req-1');
            expect(result).toEqual({ config: 'test' });
        });

        it('returns null for unknown requestId', () => {
            const result = getResponse('nonexistent');
            expect(result).toBeNull();
        });

        it('returns null and deletes entry after TTL expires', () => {
            storeResponse('req-2', { config: 'test' });

            vi.advanceTimersByTime(100_001);

            const result = getResponse('req-2');
            expect(result).toBeNull();

            const stats = getStoreStats();
            expect(stats.size).toBe(0);
        });

        it('returns data just before TTL expires', () => {
            storeResponse('req-3', { config: 'test' });

            vi.advanceTimersByTime(99_999);

            const result = getResponse('req-3');
            expect(result).toEqual({ config: 'test' });
        });

        it('overwrites existing entry with same requestId', () => {
            storeResponse('req-4', { version: 1 });
            storeResponse('req-4', { version: 2 });

            const result = getResponse('req-4');
            expect(result).toEqual({ version: 2 });

            const stats = getStoreStats();
            expect(stats.size).toBe(1);
        });
    });

    describe('periodic cleanup', () => {
        it('removes expired entries on cleanup interval', () => {
            storeResponse('req-a', { data: 'a' });
            storeResponse('req-b', { data: 'b' });

            // Expire the entries (past 100s TTL)
            vi.advanceTimersByTime(100_001);

            // Trigger the 60s cleanup interval
            vi.advanceTimersByTime(60_000);

            const stats = getStoreStats();
            expect(stats.size).toBe(0);
            expect(stats.cleanup.lastCleanedCount).toBe(2);
            expect(stats.cleanup.totalCleaned).toBe(2);
        });

        it('preserves active entries during cleanup', () => {
            storeResponse('req-active', { data: 'still here' });

            // Trigger cleanup but entries haven't expired yet
            vi.advanceTimersByTime(60_000);

            const stats = getStoreStats();
            expect(stats.size).toBe(1);
            expect(stats.cleanup.lastCleanedCount).toBe(0);

            const result = getResponse('req-active');
            expect(result).toEqual({ data: 'still here' });
        });

        it('accumulates totalCleaned across multiple cleanup cycles', () => {
            storeResponse('req-1', { data: '1' });

            // Expire and clean first entry
            vi.advanceTimersByTime(100_001);
            vi.advanceTimersByTime(60_000);

            expect(getStoreStats().cleanup.totalCleaned).toBe(1);

            // Add and expire another entry
            storeResponse('req-2', { data: '2' });
            vi.advanceTimersByTime(100_001);
            vi.advanceTimersByTime(60_000);

            const stats = getStoreStats();
            expect(stats.cleanup.totalCleaned).toBe(2);
            expect(stats.cleanup.lastCleanedCount).toBe(1);
        });

        it('handles mixed expired and active entries', () => {
            storeResponse('req-old', { data: 'old' });

            // Advance past TTL for first entry
            vi.advanceTimersByTime(100_001);

            // Add a fresh entry
            storeResponse('req-new', { data: 'new' });

            // Trigger cleanup
            vi.advanceTimersByTime(60_000);

            const stats = getStoreStats();
            expect(stats.size).toBe(1);
            expect(stats.cleanup.lastCleanedCount).toBe(1);

            expect(getResponse('req-old')).toBeNull();
            expect(getResponse('req-new')).toEqual({ data: 'new' });
        });
    });

    describe('stopCleanup', () => {
        it('stops the cleanup interval from running', () => {
            storeResponse('req-stop', { data: 'test' });

            stopCleanup();

            // Expire entry and advance past cleanup interval
            vi.advanceTimersByTime(200_000);

            // Entry is still in the store (cleanup didn't run)
            const stats = getStoreStats();
            expect(stats.size).toBe(1);
            expect(stats.cleanup.lastCleanedCount).toBe(0);
        });
    });

    describe('clearStore', () => {
        it('removes all entries and resets stats', () => {
            storeResponse('req-a', { data: 'a' });
            storeResponse('req-b', { data: 'b' });

            clearStore();

            const stats = getStoreStats();
            expect(stats.size).toBe(0);
            expect(stats.cleanup.totalCleaned).toBe(0);
            expect(stats.cleanup.lastCleanedCount).toBe(0);

            expect(getResponse('req-a')).toBeNull();
            expect(getResponse('req-b')).toBeNull();
        });
    });

    describe('getStoreStats', () => {
        it('returns current store size', () => {
            expect(getStoreStats().size).toBe(0);

            storeResponse('req-1', { data: '1' });
            expect(getStoreStats().size).toBe(1);

            storeResponse('req-2', { data: '2' });
            expect(getStoreStats().size).toBe(2);
        });

        it('returns a copy of cleanup stats (not a reference)', () => {
            const stats1 = getStoreStats();
            const stats2 = getStoreStats();
            expect(stats1.cleanup).not.toBe(stats2.cleanup);
            expect(stats1.cleanup).toEqual(stats2.cleanup);
        });
    });
});
