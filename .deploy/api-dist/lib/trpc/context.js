import { prisma } from '../db/index.js';
import '../auth/types.js'; // Import for FastifyRequest augmentation
export async function createContext({ req, res, }) {
    return {
        req,
        res,
        prisma,
        auth: req.auth,
    };
}
//# sourceMappingURL=context.js.map