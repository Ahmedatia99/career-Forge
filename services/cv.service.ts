import api from "@/lib/axios";
import { extractData } from "@/lib/api-helpers";
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
    cvId: string;
    status: string;
    progress?: number;
    stage?: string;
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

export interface UploadCVResponse {
  success: boolean;
  data: {
    cvId: string;
    parsingJob?: {
      jobId: string;
      status: string;
    };
  };
}

/**
 * List all CVs belonging to the authenticated user
 */
export const getUserCVs = async (options: { page?: number; limit?: number; sort?: string; status?: string } = {}) => {
  const { page = 1, limit = 20, sort = '-createdAt', status } = options;
  const params: any = { page, limit, sort };
  if (status) params.status = status;
  
  const response = await api.get<CVListResponse>("/v1/cvs", { params });
  const rawData = extractData<any[]>(response);
  
  // Normalize data to ensure id is always present
  const data = (rawData || []).map((item: any, index: number) => ({
    ...item,
    id: item.id || item._id || `cv-${index}`,
  }));
  
  return {
    data: {
      success: true,
      data: data,
    },
  };
};

/**
 * Upload CV from file (PDF)
 */
export const uploadCV = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", file.name.replace(/\.[^/.]+$/, ""));
  
  const response = await api.post("/v1/cvs/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const payload = response.data?.data || response.data;
  
  // Backend returns { cv: { id, ... }, parsing: { jobId, status } }
  const cvId = payload.cv?.id || payload.cvId || payload.id;

  if (!cvId) {
    console.error('Upload response missing cvId:', payload);
    throw new Error('Upload failed: No CV ID returned');
  }

  return {
    data: {
      success: true,
      data: {
        cvId: cvId,
        parsingJob: payload.parsing,
        // Also include full response for backwards compatibility
        ...payload,
        id: cvId,
        _id: cvId,
      },
    },
  };
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
export const getCVById = async (id: string, versionId?: string) => {
  const response = await api.get<CVResponse>(`/v1/cvs/${id}`, {
    params: { _t: Date.now() }
  });
  return response;
};

/**
 * Get CV parsing/processing status (lightweight endpoint for polling)
 */
export const getCVStatus = async (cvId: string) => {
  try {
    // First try the status endpoint for quick check
    const statusResponse = await api.get(`/v1/cvs/${cvId}/status`);
    const statusData = extractData(statusResponse);

    // Map backend parsingStatus to frontend status
    let currentStatus = 'processing';
    if (statusData.parsingStatus === 'parsed' || statusData.parsingStatus === 'optimized' || statusData.isParsed === true) {
      currentStatus = statusData.parsingStatus === 'optimized' ? 'optimized' : 'parsed';
    } else if (statusData.parsingStatus === 'failed') {
      currentStatus = 'failed';
    } else if (statusData.parsingStatus === 'pending') {
      currentStatus = 'queued';
    } else if (statusData.parsingStatus === 'processing') {
      currentStatus = 'processing';
    }

    // If parsing is complete, fetch the full CV data to get parsed content
    if (currentStatus === 'parsed' || currentStatus === 'optimized') {
      const fullCVResponse = await api.get(`/v1/cvs/${cvId}`);
      const fullCVData = extractData(fullCVResponse);
      
      return {
        data: {
          success: true,
          data: {
            ...fullCVData,
            cvId: fullCVData._id || fullCVData.id || cvId,
            status: currentStatus,
            progress: 100,
            parsingStatus: currentStatus,
          },
        },
      };
    }

    return {
      data: {
        success: true,
        data: {
          cvId: statusData.cvId || cvId,
          status: currentStatus,
          progress: currentStatus === 'parsed' ? 100 : (statusData.parsingProgress || 0),
          stage: statusData.parsingStage || null,
          parsingStatus: currentStatus,
        },
      },
    };
  } catch (error: any) {
    return {
      data: {
        success: false,
        data: {
          cvId,
          status: 'error',
          error: { message: error.message },
        },
      },
    };
  }
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
 * Update CV (full update)
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

/**
 * Get CV stats
 */
export const getCVStats = async () => {
  const response = await api.get('/v1/cvs/stats');
  return extractData(response);
};