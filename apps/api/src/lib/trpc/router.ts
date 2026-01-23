import { router } from './trpc.js';
import { machineRouter } from '../../domains/machine-domain/router.js';
import { onboardingRouter } from '../../domains/onboarding-domain/router.js';

export const appRouter = router({
  machines: machineRouter,
  onboarding: onboardingRouter,
});

export type AppRouter = typeof appRouter;
