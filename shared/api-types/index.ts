// Re-export API router type for frontend consumption
// This file should only contain type exports to avoid pulling in backend dependencies

export type { AppRouter } from '../../apps/api/src/lib/trpc/router.js';
