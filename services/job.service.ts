import api from "@/lib/axios";
import { extractData } from "@/lib/api-helpers";

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
export const listJobs = async (options: { type?: JobType; status?: JobStatus; limit?: number } = {}) => {
  const response = await api.get('/v1/jobs', { params: options });
  const rawData = extractData<any>(response);
  
  // Normalize to always return array
  const data = Array.isArray(rawData) ? rawData : (rawData?.jobs || rawData?.data || []);
  
  // Normalize each job to ensure id is present
  const normalizedData = data.map((job: any) => ({
    ...job,
    id: job.id || job._id || job.jobId,
  }));
  
  return {
    data: {
      success: true,
      data: normalizedData,
    },
  };
};

/**
 * Get jobs with extractData helper
 */
export const getJobs = async (options: { type?: JobType; status?: JobStatus; limit?: number } = {}) => {
  const response = await api.get('/v1/jobs', { params: options });
  return extractData(response);
};

/**
 * Get overall job statistics
 */
export const getJobStats = async () => {
  try {
    const response = await api.get('/v1/jobs/stats');
    const rawData = extractData<any>(response);
    
    // Normalize stats structure
    const stats = {
      total: rawData?.total || rawData?.totalJobs || 0,
      pending: rawData?.pending || rawData?.byStatus?.pending || 0,
      processing: rawData?.processing || rawData?.byStatus?.processing || 0,
      completed: rawData?.completed || rawData?.byStatus?.completed || 0,
      failed: rawData?.failed || rawData?.byStatus?.failed || 0,
      byType: rawData?.byType || {},
    };
    
    return {
      data: {
        success: true,
        data: stats,
      },
    };
  } catch (err) {
    // If stats endpoint fails, return empty stats
    return {
      data: {
        success: true,
        data: {
          total: 0,
          pending: 0,
          processing: 0,
          completed: 0,
          failed: 0,
          byType: {},
        },
      },
    };
  }
};

/**
 * Get details of a specific job
 */
export const getJobDetails = async (jobId: string) => {
  const response = await api.get(`/v1/jobs/${jobId}`);
  return extractData(response);
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
export const cancelJob = async (jobId: string) => {
  const response = await api.delete(`/v1/jobs/${jobId}`);
  return extractData(response);
};

/**
 * Retry a failed job
 */
export const retryJob = async (jobId: string) => {
  const response = await api.post(`/v1/jobs/${jobId}/retry`);
  return extractData(response);
};