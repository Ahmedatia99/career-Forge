import api from "@/lib/axios";

export type JobType = "parsing" | "optimization" | "ats-analysis" | "pdf-generation";

export type JobStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";

export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  cvId?: string;
  progress?: number;
  metadata?: Record<string, any>;
  error?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface JobListResponse {
  success: boolean;
  data: Job[];
  message?: string;
}

export interface JobResponse {
  success: boolean;
  data: Job;
  message?: string;
}

export interface JobStatsResponse {
  success: boolean;
  data: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    byType: Record<JobType, number>;
  };
  message?: string;
}

export interface JobLogsResponse {
  success: boolean;
  data: {
    logs: Array<{
      level: "info" | "warning" | "error";
      message: string;
      timestamp: string;
    }>;
  };
  message?: string;
}

/**
 * List all background jobs for the user
 */
export const listJobs = () => {
  return api.get<JobListResponse>("/v1/jobs");
};

/**
 * Get overall job statistics
 */
export const getJobStats = () => {
  return api.get<JobStatsResponse>("/v1/jobs/stats");
};

/**
 * Get details of a specific job
 */
export const getJobDetails = (jobId: string) => {
  return api.get<JobResponse>(`/v1/jobs/${jobId}`);
};

/**
 * Get execution logs for a job
 */
export const getJobLogs = (jobId: string) => {
  return api.get<JobLogsResponse>(`/v1/jobs/${jobId}/logs`);
};

/**
 * Cancel a pending/processing job
 */
export const cancelJob = (jobId: string) => {
  return api.delete(`/v1/jobs/${jobId}`);
};

/**
 * Retry a failed job
 */
export const retryJob = (jobId: string) => {
  return api.post<JobResponse>(`/v1/jobs/${jobId}/retry`);
};
