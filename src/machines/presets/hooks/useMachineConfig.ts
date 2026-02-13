import { useState, useCallback, useRef, useEffect } from 'react';
import { trpc } from '../../../lib/trpc';

const POLL_INTERVAL = 1500;
const TIMEOUT = 15000;

type ConfigStatus = 'idle' | 'fetching' | 'received' | 'updating' | 'updated' | 'error' | 'timeout';

export function useMachineConfig(machineId: string) {
  const [status, setStatus] = useState<ConfigStatus>('idle');
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const requestConfigMutation = trpc.machines.requestConfig.useMutation();
  const updateConfigMutation = trpc.machines.updateConfig.useMutation();

  const pollQuery = trpc.machines.getConfigResponse.useQuery(
    { requestId: activeRequestId! },
    {
      enabled: !!activeRequestId,
      refetchInterval: POLL_INTERVAL,
    }
  );

  useEffect(() => {
    if (!pollQuery.data || pollQuery.data.status === 'pending') return;

    setActiveRequestId(null);
    clearTimeout(timeoutRef.current);

    if (pollQuery.data.status === 'received' && pollQuery.data.config) {
      setConfig(pollQuery.data.config);
      setStatus('received');
    } else if (pollQuery.data.status === 'received' && pollQuery.data.success !== undefined) {
      setStatus('updated');
    } else if (pollQuery.data.status === 'error') {
      setError(pollQuery.data.error || 'Unknown error');
      setStatus('error');
    }
  }, [pollQuery.data]);

  const fetchConfig = useCallback(async () => {
    setStatus('fetching');
    setError(null);
    try {
      const { requestId } = await requestConfigMutation.mutateAsync({ machineId });
      setActiveRequestId(requestId);
      timeoutRef.current = setTimeout(() => {
        setActiveRequestId(null);
        setStatus('timeout');
        setError('Machine did not respond in time');
      }, TIMEOUT);
    } catch (e: any) {
      setStatus('error');
      setError(e.message);
    }
  }, [machineId, requestConfigMutation]);

  const updatePresets = useCallback(async (payload: {
    presets?: Record<string, Record<string, number>>;
    variety_names?: Record<string, string>;
  }) => {
    setStatus('updating');
    setError(null);
    try {
      const { requestId } = await updateConfigMutation.mutateAsync({ machineId, ...payload });
      setActiveRequestId(requestId);
      timeoutRef.current = setTimeout(() => {
        setActiveRequestId(null);
        setStatus('timeout');
        setError('Machine did not acknowledge update');
      }, TIMEOUT);
    } catch (e: any) {
      setStatus('error');
      setError(e.message);
    }
  }, [machineId, updateConfigMutation]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return { status, config, error, fetchConfig, updatePresets };
}
