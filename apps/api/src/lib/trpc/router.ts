import { router } from './trpc.js';
import { machineRouter } from '../../machine-domain/router.js';
import { onboardingRouter } from '../../onboarding-domain/router.js';

export const appRouter = router({
  machines: machineRouter,
  onboarding: onboardingRouter,
});

export type AppRouter = typeof appRouter;
