import { z } from 'zod';
export const createTenantAndFarmSchema = z.object({
    farmName: z.string().min(2).max(255),
    userEmail: z.string().email(),
});
//# sourceMappingURL=types.js.map