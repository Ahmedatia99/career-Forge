import api from "@/lib/axios";

export interface ParsingJob {
  id: string;
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
 * Get parsing history for a specific CV
 */
export const getParsingHistory = (cvId: string) => {
  return api.get<ParsingJobListResponse>("/v1/parsing-jobs/history", {
    params: { cvId },
  });
};
