import api from "@/lib/axios";
import type { CV } from "@/types/types";

export interface OptimizationJob {
  id: string;
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
  jobDescription: string;
}

/**
 * Start a comprehensive AI optimization job
 */
export const startFullOptimization = (data: StartFullOptimizationRequest) => {
  return api.post<OptimizationJobResponse>("/v1/optimization-jobs", data);
};

/**
 * Tailor existing CV to a new job description
 */
export const tailorForJob = (data: TailorForJobRequest) => {
  return api.post<OptimizationJobResponse>("/v1/optimization-jobs/tailor", data);
};
