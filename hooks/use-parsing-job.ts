import { useJobPolling } from "./use-job-polling";
import { getCVStatus } from "@/services/cv.service";
import { showInfo, showSuccess, showError } from "@/lib/toast";

/**
 * Hook for polling CV parsing job status
 */
export function useParsingJob(cvId: string | null, enabled: boolean = true) {
  return useJobPolling({
    jobId: cvId || "",
    enabled: enabled && !!cvId,
    checkStatus: async () => {
      if (!cvId) throw new Error("CV ID is required");
      const response = await getCVStatus(cvId);
      if (response.data.success && response.data.data) {
        return {
          status: response.data.data.status as any,
          data: response.data.data,
        };
      }
      throw new Error("Failed to get CV status");
    },
    onComplete: (data) => {
      showSuccess("CV parsed successfully!");
    },
    onError: (error) => {
      showError("Failed to parse CV. Please try again.");
    },
    pollInterval: 2000,
    maxPollAttempts: 60, // 2 minutes
  });
}
