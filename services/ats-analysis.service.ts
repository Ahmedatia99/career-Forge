import api from "@/lib/axios";

export interface TargetJob {
  title: string;
  description: string;
}

export interface ATSAnalysis {
  id: string;
  cvId: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  targetJob: TargetJob;
  score?: number;
  matchPercentage?: number;
  strengths?: string[];
  weaknesses?: string[];
  missingKeywords?: string[];
  suggestions?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
}

export interface ATSAnalysisResponse {
  success: boolean;
  data: ATSAnalysis;
  message?: string;
}

export interface ATSAnalysisListResponse {
  success: boolean;
  data: ATSAnalysis[];
  message?: string;
}

export interface ATSStatsResponse {
  success: boolean;
  data: {
    totalAnalyses: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  };
  message?: string;
}

export interface ATSTrendsResponse {
  success: boolean;
  data: {
    scores: Array<{
      date: string;
      score: number;
    }>;
  };
  message?: string;
}

export interface RecentScoresResponse {
  success: boolean;
  data: Array<{
    id: string;
    score: number;
    targetJob: TargetJob;
    createdAt: string;
  }>;
  message?: string;
}

export interface StartATSAnalysisRequest {
  cvId: string;
  targetJob: TargetJob;
}

/**
 * Start an ATS analysis job
 */
export const startATSAnalysis = (data: StartATSAnalysisRequest) => {
  return api.post<ATSAnalysisResponse>("/v1/ats-analyses", data);
};

/**
 * Get ATS analysis history
 */
export const getATSAnalysisHistory = () => {
  return api.get<ATSAnalysisListResponse>("/v1/ats-analyses/history");
};

/**
 * Get overall ATS statistics
 */
export const getATSStats = () => {
  return api.get<ATSStatsResponse>("/v1/ats-analyses/stats");
};

/**
 * Get ATS scoring trends over time
 */
export const getATSTrends = () => {
  return api.get<ATSTrendsResponse>("/v1/ats-analyses/trends");
};

/**
 * Get recent ATS scores
 */
export const getRecentScores = () => {
  return api.get<RecentScoresResponse>("/v1/ats-analyses/recent-scores");
};

/**
 * Get analysis job status
 */
export const getATSAnalysisStatus = (jobId: string) => {
  return api.get<ATSAnalysisResponse>(`/v1/ats-analyses/${jobId}`);
};

/**
 * Get completed analysis result
 */
export const getATSAnalysisResult = (jobId: string) => {
  return api.get<ATSAnalysisResponse>(`/v1/ats-analyses/${jobId}/result`);
};

/**
 * Cancel a pending/processing ATS analysis
 */
export const cancelATSAnalysis = (jobId: string) => {
  return api.post(`/v1/ats-analyses/${jobId}/cancel`);
};
