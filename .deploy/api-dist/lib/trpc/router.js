import { router } from './trpc.js';
import { machineRouter } from '../../domains/machine-domain/router.js';
import { onboardingRouter } from '../../domains/onboarding-domain/router.js';
import { adminRouter } from '../../domains/admin-domain/router.js';
export const appRouter = router({
    machines: machineRouter,
    onboarding: onboardingRouter,
    admin: adminRouter,
});
//# sourceMappingURL=router.js.map