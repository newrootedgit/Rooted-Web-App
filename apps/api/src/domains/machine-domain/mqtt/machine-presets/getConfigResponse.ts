import { getResponse } from '../../../../lib/aws/config-store.js';

export function getConfigResponse(requestId: string): {
  status: 'pending' | 'received' | 'error';
  config?: Record<string, unknown>;
  success?: boolean;
  error?: string;
} {
  const data = getResponse(requestId);
  if (!data) return { status: 'pending' };
  if (data.error) return { status: 'error', error: data.error as string };
  return {
    status: 'received',
    config: data.config as Record<string, unknown> | undefined,
    success: data.success as boolean | undefined,
  };
}