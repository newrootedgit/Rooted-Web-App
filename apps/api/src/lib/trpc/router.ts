import { router } from './trpc.js';
import { machineRouter } from '../../machine-domain/router.js';

export const appRouter = router({
  machines: machineRouter,
});

export type AppRouter = typeof appRouter;
