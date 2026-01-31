import api from "@/lib/axios";
import { extractData } from "@/lib/api-helpers";

export interface ParsingJob {
  id: string;
  jobId?: string;
  cvId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
}

export interface ParsingJobResponse {
  success: boolean;
  data: ParsingJob;
  message?: string;
}

export interface ParsingJobListResponse {
  success: boolean;
  data: ParsingJob[];
  message?: string;
}

export interface StartParsingRequest {
  cvId: string;
}

/**
 * Manually trigger a parsing job for a CV
 */
export const startParsing = (data: StartParsingRequest) => {
  return api.post<ParsingJobResponse>("/v1/parsing-jobs", data);
};

/**
 * Get parsing history for a specific CV or all
 */
export const getParsingHistory = (cvId?: string, options: { page?: number; limit?: number } = {}) => {
  const params: any = { ...options };
  if (cvId) params.cvId = cvId;
  
  return api.get<ParsingJobListResponse>("/v1/parsing-jobs/history", { params });
};

/**
 * Get parsing stats
 */
export const getParsingStats = async () => {
  const response = await api.get('/v1/parsing-jobs/stats');
  return extractData(response);
};

/**
 * Get supported formats
 */
export const getSupportedFormats = async () => {
  const response = await api.get('/v1/parsing-jobs/formats');
  return extractData(response);
};

/**
 * Get parsing job status
 */
export const getParsingJobStatus = async (jobId: string) => {
  const response = await api.get(`/v1/parsing-jobs/${jobId}`);
  return extractData(response);
};

/**
 * Get parsing job result
 */
export const getParsingJobResult = async (jobId: string) => {
  const response = await api.get(`/v1/parsing-jobs/${jobId}/result`);
  return extractData(response);
};

/**
 * Cancel a parsing job
 */
export const cancelParsingJob = (jobId: string) => {
  return api.post(`/v1/parsing-jobs/${jobId}/cancel`);
};

/**
 * Retry a failed parsing job
 */
export const retryParsingJob = (jobId: string) => {
  return api.post(`/v1/parsing-jobs/${jobId}/retry`);
};