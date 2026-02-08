import { router } from './trpc.js';
import { machineRouter } from '../../domains/machine-domain/router.js';
import { onboardingRouter } from '../../domains/onboarding-domain/router.js';
import { adminRouter } from '../../domains/admin-domain/router.js';
import { productRouter } from '../../domains/planner-domain/products/router.js';
import { customerRouter } from '../../domains/planner-domain/customers/router.js';
import { orderRouter } from '../../domains/planner-domain/orders/router.js';
import { taskRouter } from '../../domains/planner-domain/tasks/router.js';
import { farmLayoutRouter } from '../../domains/planner-domain/farm-layout/router.js';

export const appRouter = router({
  machines: machineRouter,
  onboarding: onboardingRouter,
  admin: adminRouter,
  products: productRouter,
  customers: customerRouter,
  orders: orderRouter,
  tasks: taskRouter,
  farmLayouts: farmLayoutRouter,
});

export type AppRouter = typeof appRouter;
