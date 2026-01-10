import api from "@/lib/axios";
import type { CV } from "@/types/types";

export interface CVVersion {
  id: string;
  cvId: string;
  name: string;
  description?: string;
  data: CV;
  createdAt: string;
  updatedAt: string;
}

export interface CVVersionListResponse {
  success: boolean;
  data: CVVersion[];
  message?: string;
}

export interface CVVersionResponse {
  success: boolean;
  data: CVVersion;
  message?: string;
}

export interface CreateCVVersionRequest {
  name: string;
  description?: string;
}

/**
 * List all versions of a CV
 */
export const listCVVersions = (cvId: string) => {
  return api.get<CVVersionListResponse>(`/v1/cvs/${cvId}/versions`);
};

/**
 * Create a snapshot version of the current CV state
 */
export const createCVVersion = (cvId: string, data: CreateCVVersionRequest) => {
  return api.post<CVVersionResponse>(`/v1/cvs/${cvId}/versions`, data);
};

/**
 * Get specific version details
 */
export const getCVVersion = (cvId: string, versionId: string) => {
  return api.get<CVVersionResponse>(`/v1/cvs/${cvId}/versions/${versionId}`);
};

/**
 * Activate/restore a version (restores main CV to this version's state)
 */
export const activateCVVersion = (cvId: string, versionId: string) => {
  return api.post<CVVersionResponse>(`/v1/cvs/${cvId}/versions/${versionId}/activate`, {});
};
