import { createClerkClient } from '@clerk/fastify';
import { TRPCError } from '@trpc/server';

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function requireAdmin(userId: string): Promise<void> {
  const user = await clerk.users.getUser(userId);

  if (!user.publicMetadata.isAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  const user = await clerk.users.getUser(userId);
  return user.publicMetadata.isAdmin === true;
}
