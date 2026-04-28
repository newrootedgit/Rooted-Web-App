import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { CompleteMachineTutorialInput } from '../types.js';

export async function completeMachineTutorial(
  prisma: PrismaClient,
  userId: string,
  input: CompleteMachineTutorialInput
): Promise<{ success: true }> {
  const farmUser = await prisma.farm_users.findFirst({
    where: { clerk_user_id: userId, is_active: true },
  });

  if (!farmUser) {
    throw new Error('User not found');
  }

  const now = new Date();

  await prisma.farm_users.update({
    where: { id: farmUser.id },
    data: input.outcome === 'completed'
      ? { machine_tutorial_completed_at: now }
      : { machine_tutorial_dismissed_at: now },
  });

  return { success: true };
}
