import api from "@/lib/axios";
import { extractData } from "@/lib/api-helpers";

export interface TargetJob {
  title?: string;
  description: string;
}

export interface ATSAnalysis {
  id: string;
  jobId?: string;
  cvId: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  targetJob?: TargetJob;
  score?: number;
  matchPercentage?: number;
  strengths?: string[];
  weaknesses?: string[];
  missingKeywords?: string[];
  suggestions?: string[];
  recommendations?: string[];
  breakdown?: Record<string, any>;
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
  type?: 'compatibility' | 'comprehensive';
  targetJob?: TargetJob;
  versionId?: string;
}

export interface ATSScoreResult {
  score: number;
  breakdown?: Record<string, any>;
  recommendations?: string[];
  missingKeywords?: string[];
}

/**
 * Start an ATS analysis job
 */
export const startATSAnalysis = (data: StartATSAnalysisRequest) => {
  return api.post<ATSAnalysisResponse>("/v1/ats-analyses", data);
};

/**
 * Get ATS score with polling - comprehensive function like frontend
 */
export const getATSScore = async (cvId: string, versionId?: string, jobDescription?: string): Promise<{ success: boolean; data: ATSScoreResult }> => {
  // Determine analysis type based on job description presence
  const type = (jobDescription && jobDescription.trim()) ? 'compatibility' : 'comprehensive';

  const payload: StartATSAnalysisRequest = {
    cvId,
    type,
  };

  if (jobDescription && jobDescription.trim()) {
    payload.targetJob = { description: jobDescription.trim() };
  }

  if (versionId) {
    payload.versionId = versionId;
  }

  const response = await api.post('/v1/ats-analyses', payload);
  const result = extractData<ATSAnalysis>(response);

  if (!result.jobId && !result.id) {
    throw new Error('Failed to start ATS analysis: No job ID returned');
  }

  const jobId = result.jobId || result.id;

  // Poll for completion
  let status = result.status || 'pending';
  let attempts = 0;
  const maxAttempts = 60; // 60 * 2s = 120s timeout

  while (status !== 'completed' && status !== 'failed' && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const statusResponse = await api.get(`/v1/ats-analyses/${jobId}`);
      const statusData = extractData<ATSAnalysis>(statusResponse);
      status = statusData.status;

      if (status === 'completed') {
        const resultResponse = await api.get(`/v1/ats-analyses/${jobId}/result`);
        const resultData = extractData<any>(resultResponse);

        return {
          success: true,
          data: {
            score: resultData.results?.overallScore || resultData.score || 0,
            breakdown: resultData.results?.breakdown || resultData.breakdown || {},
            recommendations: resultData.results?.recommendations || resultData.recommendations || [],
            missingKeywords: resultData.results?.missingKeywords || resultData.missingKeywords || [],
          },
        };
      }
    } catch (err) {
      break;
    }
    attempts++;
  }

  if (status === 'failed') {
    throw new Error('ATS analysis failed');
  }

  throw new Error(`ATS analysis timed out after ${maxAttempts * 2} seconds. Status: ${status}`);
};

/**
 * Get ATS analysis history
 */
export const getATSAnalysisHistory = async (options: { page?: number; limit?: number } = {}) => {
  const response = await api.get<ATSAnalysisListResponse>("/v1/ats-analyses/history", { params: options });
  const rawData = extractData<any[]>(response);
  
  // Normalize data to ensure id is always present
  const data = (rawData || []).map((item: any, index: number) => ({
    ...item,
    id: item.id || item._id || `analysis-${index}`,
  }));
  
  return {
    data: {
      success: true,
      data: data,
    },
  };
};

/**
 * Get overall ATS statistics
 */
export const getATSStats = async () => {
  try {
    const response = await api.get("/v1/ats-analyses/stats");
    const rawData = extractData<any>(response);
    
    // Map the actual API response structure to what UI expects
    const overview = rawData?.overview?.[0] || {};
    const scoreDistribution = rawData?.scoreDistribution || [];
    
    // Calculate highest and lowest from score distribution
    let highestScore = 0;
    let lowestScore = 100;
    
    if (scoreDistribution.length > 0) {
      scoreDistribution.forEach((item: any) => {
        const score = item.average || item._id || 0;
        if (score > highestScore) highestScore = score;
        if (score < lowestScore && score > 0) lowestScore = score;
      });
    } else {
      // If no distribution, use average as both
      highestScore = overview.averageScore || 0;
      lowestScore = overview.averageScore || 0;
    }
    
    const mappedData = {
      totalAnalyses: overview.totalAnalyses || 0,
      completedAnalyses: overview.completedAnalyses || 0,
      failedAnalyses: overview.failedAnalyses || 0,
      averageScore: overview.averageScore || 0,
      highestScore: highestScore,
      lowestScore: lowestScore === 100 ? 0 : lowestScore,
      scoreDistribution: scoreDistribution,
      topSuggestions: rawData?.topSuggestions || [],
    };
    
    return {
      data: {
        success: true,
        data: mappedData,
      },
    };
  } catch (error) {
    return {
      data: {
        success: false,
        data: { totalAnalyses: 0, averageScore: 0, highestScore: 0, lowestScore: 0 },
      },
    };
  }
};

/**
 * Get ATS scoring trends over time
 */
export const getATSTrends = (options: { period?: string } = {}) => {
  return api.get<ATSTrendsResponse>("/v1/ats-analyses/trends", { params: options });
};

/**
 * Get recent ATS scores
 */
export const getRecentScores = async () => {
  const response = await api.get("/v1/ats-analyses/recent-scores");
  return extractData(response);
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
