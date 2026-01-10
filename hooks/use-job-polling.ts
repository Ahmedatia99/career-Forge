import { useEffect, useRef, useState, useCallback } from "react";
import type { JobStatus } from "@/services/job.service";

export interface UseJobPollingOptions {
  jobId: string;
  checkStatus: () => Promise<{ status: JobStatus; data?: any }>;
  onComplete?: (data?: any) => void;
  onError?: (error: any) => void;
  pollInterval?: number;
  maxPollAttempts?: number;
  enabled?: boolean;
}

export interface UseJobPollingResult {
  status: JobStatus | null;
  isLoading: boolean;
  error: Error | null;
  data: any;
  startPolling: () => void;
  stopPolling: () => void;
  reset: () => void;
}

/**
 * Hook for polling job status
 */
export function useJobPolling(options: UseJobPollingOptions): UseJobPollingResult {
  const {
    jobId,
    checkStatus,
    onComplete,
    onError,
    pollInterval = 2000,
    maxPollAttempts = 60, // 2 minutes default
    enabled = true,
  } = options;

  const [status, setStatus] = useState<JobStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(false);

  const pollAttemptsRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (!enabled || !jobId) return;

    setIsPolling(true);
    setIsLoading(true);
    setError(null);
    pollAttemptsRef.current = 0;

    const poll = async () => {
      if (!isMountedRef.current) return;

      try {
        pollAttemptsRef.current += 1;

        // Check max attempts
        if (pollAttemptsRef.current > maxPollAttempts) {
          stopPolling();
          const timeoutError = new Error("Polling timeout: Maximum attempts reached");
          setError(timeoutError);
          setIsLoading(false);
          onError?.(timeoutError);
          return;
        }

        const result = await checkStatus();
        const currentStatus = result.status;

        if (!isMountedRef.current) return;

        setStatus(currentStatus);
        if (result.data) {
          setData(result.data);
        }

        // Check if job is complete
        if (currentStatus === "completed") {
          stopPolling();
          setIsLoading(false);
          onComplete?.(result.data);
        } else if (currentStatus === "failed" || currentStatus === "cancelled") {
          stopPolling();
          setIsLoading(false);
          const statusError = new Error(`Job ${currentStatus}`);
          setError(statusError);
          onError?.(statusError);
        }
        // Continue polling for pending/processing status
      } catch (err: any) {
        if (!isMountedRef.current) return;

        stopPolling();
        setIsLoading(false);
        const pollError = err instanceof Error ? err : new Error(String(err));
        setError(pollError);
        onError?.(pollError);
      }
    };

    // Initial poll
    poll();

    // Set up interval
    intervalRef.current = setInterval(poll, pollInterval);
  }, [jobId, checkStatus, onComplete, onError, pollInterval, maxPollAttempts, enabled, stopPolling]);

  const reset = useCallback(() => {
    stopPolling();
    setStatus(null);
    setIsLoading(false);
    setError(null);
    setData(null);
    pollAttemptsRef.current = 0;
  }, [stopPolling]);

  // Auto-start polling when enabled and jobId changes
  useEffect(() => {
    if (enabled && jobId && !isPolling) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, jobId, startPolling, stopPolling, isPolling]);

  return {
    status,
    isLoading,
    error,
    data,
    startPolling,
    stopPolling,
    reset,
  };
}
