import api from "@/lib/axios";
import type { CV } from "@/types/types";

export interface CVListResponse {
  success: boolean;
  data: CV[];
  message?: string;
}

export interface CVResponse {
  success: boolean;
  data: CV;
  message?: string;
}

export interface CVStatusResponse {
  success: boolean;
  data: {
    status: string;
    progress?: number;
    message?: string;
  };
  message?: string;
}

export interface SearchCVsResponse {
  success: boolean;
  data: CV[];
  message?: string;
}

export interface DuplicateCVRequest {
  title?: string;
}

export interface BulkOperationRequest {
  action: "archive" | "delete";
  cvIds: string[];
}

export interface BulkOperationResponse {
  success: boolean;
  data: {
    affected: number;
  };
  message?: string;
}

export interface CreateCVRequest {
  fileName?: string;
  parsedData?: any;
  [key: string]: any;
}

/**
 * List all CVs belonging to the authenticated user
 */
export const getUserCVs = () => {
  return api.get<CVListResponse>("/v1/cvs");
};

/**
 * Upload CV from file (PDF)
 */
export const uploadCV = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  return api.post<CVResponse>(
    "/v1/cvs/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

/**
 * Create CV manually with JSON data
 */
export const createCV = (cvData: CreateCVRequest) => {
  return api.post<CVResponse>("/v1/cvs", cvData);
};

/**
 * Get CV by ID
 */
export const getCVById = (id: string) => {
  return api.get<CVResponse>(`/v1/cvs/${id}`);
};

/**
 * Get CV parsing/processing status
 */
export const getCVStatus = (id: string) => {
  return api.get<CVStatusResponse>(`/v1/cvs/${id}/status`);
};

/**
 * Search CVs by keywords
 */
export const searchCVs = (query: string) => {
  return api.get<SearchCVsResponse>(`/v1/cvs/search`, {
    params: { q: query },
  });
};

/**
 * Update CV (full update) - Uses PATCH instead of PUT
 */
export const updateCV = (id: string, cvData: Partial<CV>) => {
  return api.patch<CVResponse>(`/v1/cvs/${id}`, cvData);
};

/**
 * Partially update CV or update state (publish, archive)
 */
export const patchCV = (id: string, cvData: Partial<CV> | { published?: boolean; archived?: boolean }) => {
  return api.patch<CVResponse>(`/v1/cvs/${id}`, cvData);
};

/**
 * Duplicate an existing CV
 */
export const duplicateCV = (id: string, data?: DuplicateCVRequest) => {
  return api.post<CVResponse>(`/v1/cvs/${id}/duplicate`, data || {});
};

/**
 * Perform bulk operations on multiple CVs
 */
export const bulkOperationCVs = (data: BulkOperationRequest) => {
  return api.post<BulkOperationResponse>("/v1/cvs/bulk", data);
};

/**
 * Delete CV
 */
export const deleteCV = (id: string) => {
  return api.delete(`/v1/cvs/${id}`);
};
