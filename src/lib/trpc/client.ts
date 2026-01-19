import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../apps/api/src/lib/trpc/router.js';

export const trpc = createTRPCReact<AppRouter>();

export function createTRPCClient(getAuthToken: () => Promise<string | null>) {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: import.meta.env.VITE_API_URL || 'http://localhost:8001/trpc',
        async headers() {
          const token = await getAuthToken();
          console.log('[tRPC] Auth token:', token ? `${token.slice(0, 20)}...` : 'null');
          return {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          };
        },
      }),
    ],
  });
}
