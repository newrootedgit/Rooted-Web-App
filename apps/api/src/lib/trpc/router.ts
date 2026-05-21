import { router } from './trpc.js';
import { machineRouter } from '../../domains/machine-domain/router.js';
import { machinePartsRouter } from '../../domains/machine-parts-domain/router.js';
import { onboardingRouter } from '../../domains/onboarding-domain/router.js';
import { adminRouter } from '../../domains/admin-domain/router.js';
import { productRouter } from '../../domains/planner-domain/products/router.js';
import { customerRouter } from '../../domains/planner-domain/customers/router.js';
import { orderRouter } from '../../domains/planner-domain/orders/router.js';
import { taskRouter } from '../../domains/planner-domain/tasks/router.js';
import { farmLayoutRouter } from '../../domains/planner-domain/farm-layout/router.js';
import { recurringSchedulesRouter } from '../../domains/planner-domain/recurring-schedules/router.js';
import { employeeRouter } from '../../domains/planner-domain/employees/router.js';
import { userRouter } from '../../domains/user-domain/router.js';
import { supportRouter } from '../../domains/support-domain/router.js';

export const appRouter = router({
  machines: machineRouter,
  machineParts: machinePartsRouter,
  onboarding: onboardingRouter,
  admin: adminRouter,
  products: productRouter,
  customers: customerRouter,
  orders: orderRouter,
  tasks: taskRouter,
  farmLayouts: farmLayoutRouter,
  recurringSchedules: recurringSchedulesRouter,
  employees: employeeRouter,
  user: userRouter,
  support: supportRouter,
});

export type AppRouter = typeof appRouter;
