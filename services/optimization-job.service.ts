import api from "@/lib/axios";
import { extractData, extractCVContent } from "@/lib/api-helpers";
import type { CV } from "@/types/types";

export interface OptimizationJob {
  id: string;
  jobId?: string;
  cvId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  jobDescription?: string;
  targetJobTitle?: string;
  optimizedCV?: CV;
  suggestions?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
}

export interface OptimizationJobResponse {
  success: boolean;
  data: OptimizationJob;
  message?: string;
}

export interface StartFullOptimizationRequest {
  cvId: string;
  jobDescription: string;
  targetJobTitle?: string;
}

export interface TailorForJobRequest {
  cvId: string;
  cvData?: any;
  jobData?: {
    title?: string;
    description: string;
  };
  jobDescription?: string;
  options?: {
    versionId?: string;
  };
}

/**
 * Start a comprehensive AI optimization job
 */
export const startFullOptimization = (data: StartFullOptimizationRequest) => {
  return api.post<OptimizationJobResponse>("/v1/optimization-jobs", data);
};

/**
 * Tailor existing CV to a new job description
 * Fetches CV data first and sends it with the optimization request
 */
export const tailorForJob = async (data: TailorForJobRequest) => {
  // If no cvData provided, fetch it first
  if (!data.cvData) {
    const response = await api.get(`/v1/cvs/${data.cvId}`);
    const cvResource = extractData(response);
    const cvContent = extractCVContent(cvResource);

    if (!cvContent || Object.keys(cvContent).length === 0) {
      throw new Error('CV data not available. Please wait for parsing to complete.');
    }

    data.cvData = cvContent;
  }

  const payload: any = {
    cvId: data.cvId,
    cvData: data.cvData,
  };

  // Support both old and new API format
  if (data.jobData) {
    payload.jobData = data.jobData;
  } else if (data.jobDescription) {
    payload.jobData = {
      description: data.jobDescription,
    };
  }

  if (data.options?.versionId) {
    payload.options = { versionId: data.options.versionId };
  }

  const postResponse = await api.post('/v1/optimization-jobs/tailor', payload);
  return { data: { success: true, data: extractData(postResponse) } };
};

/**
 * Optimize specific sections of a CV
 */
export const optimizeSections = async (cvId: string, sections: string[]) => {
  // Fetch CV first to get the data
  const response = await api.get(`/v1/cvs/${cvId}`);
  const cvResource = extractData(response);
  const cvData = extractCVContent(cvResource);

  if (!cvData || Object.keys(cvData).length === 0) {
    throw new Error('CV data not available. Please wait for parsing to complete.');
  }

  const postResponse = await api.post('/v1/optimization-jobs/sections', {
    cvId,
    cvData,
    sections
  });
  return extractData(postResponse);
};

/**
 * Get optimization capabilities
 */
export const getOptimizationCapabilities = async () => {
  const response = await api.get('/v1/optimization-jobs/capabilities');
  return extractData(response);
};

/**
 * Get optimization job status
 */
export const getOptimizationJobStatus = async (jobId: string) => {
  const response = await api.get(`/v1/optimization-jobs/${jobId}`);
  return { data: { success: true, data: extractData(response) } };
};

/**
 * Get optimization job result
 */
export const getOptimizationJobResult = async (jobId: string) => {
  const response = await api.get(`/v1/optimization-jobs/${jobId}/result`);
  return extractData(response);
};