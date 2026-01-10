import { useJobPolling } from "./use-job-polling";
import { getJobDetails } from "@/services/job.service";
import { showSuccess, showError } from "@/lib/toast";

/**
 * Hook for polling PDF generation job status
 */
export function usePDFGeneration(jobId: string | null, enabled: boolean = true) {
  return useJobPolling({
    jobId: jobId || "",
    enabled: enabled && !!jobId,
    checkStatus: async () => {
      if (!jobId) throw new Error("Job ID is required");
      const response = await getJobDetails(jobId);
      if (response.data.success && response.data.data) {
        return {
          status: response.data.data.status,
          data: response.data.data,
        };
      }
      throw new Error("Failed to get job status");
    },
    onComplete: (data) => {
      showSuccess("PDF generated successfully!");
    },
    onError: (error) => {
      showError("PDF generation failed. Please try again.");
    },
    pollInterval: 2000,
    maxPollAttempts: 30, // 1 minute
  });
}
