import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../apps/api/src/lib/trpc/router.js';
import { isProd } from '../env.js';

export const trpc = createTRPCReact<AppRouter>();

export function createTRPCClient(getAuthToken: () => Promise<string | null>) {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: isProd() ? '/api/trpc' : (import.meta.env.VITE_API_URL || 'http://localhost:8000/trpc'),
        async headers() {
          const token = await getAuthToken();
          if (!isProd()) {
            console.log('[tRPC] Auth token:', token ? `${token.slice(0, 20)}...` : 'null');
          }
          return {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          };
        },
      }),
    ],
  });
}
