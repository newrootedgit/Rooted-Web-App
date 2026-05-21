import { createClerkClient } from '@clerk/fastify';
import { TRPCError } from '@trpc/server';

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const CACHE_TTL_MS = 60_000;
const CLERK_TIMEOUT_MS = 3_000;
const adminCache = new Map<string, { value: boolean; expiresAt: number }>();

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

async function fetchIsAdmin(userId: string): Promise<boolean> {
  const cached = adminCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const user = await withTimeout(clerk.users.getUser(userId), CLERK_TIMEOUT_MS, 'Clerk getUser');
  const value = Boolean(user.publicMetadata.isAdmin);
  adminCache.set(userId, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}

export async function requireAdmin(userId: string): Promise<void> {
  const ok = await fetchIsAdmin(userId);
  if (!ok) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }
}

/**
 * Best-effort admin check. Returns false on any Clerk failure so that
 * non-admin routes using this for the admin bypass degrade gracefully
 * (the caller continues down its normal tenant-scoped path).
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    return await fetchIsAdmin(userId);
  } catch (err) {
    console.warn('[admin.isAdmin] Clerk lookup failed, treating as non-admin', {
      userId,
      error: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}
