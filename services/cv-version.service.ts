import api from "@/lib/axios";
import { extractData } from "@/lib/api-helpers";
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
 * Get CV versions using extractData helper
 */
export const getCVVersions = async (cvId: string) => {
  const response = await api.get(`/v1/cvs/${cvId}/versions`);
  return extractData(response);
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
export const activateCVVersion = async (cvId: string, versionId: string) => {
  const response = await api.post(`/v1/cvs/${cvId}/versions/${versionId}/activate`, {});
  return response.data;
};
