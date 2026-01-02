/**
 * API Client for CV Builder Application
 * 
 * This file provides a type-safe API client for communicating with the backend.
 * Replace localStorage calls with these API methods.
 */

// Types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Array<{
      field?: string;
      message: string;
    }>;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

interface CVListItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  template: string;
}

interface CVListResponse {
  cvs: CVListItem[];
  pagination: PaginationMeta;
}

// Import your CV type from types
import type { CV, LoginFormData, RegisterFormData, UserProfile } from "@/types/types";

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Base API request function
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error?.message || 'Request failed',
      data.error?.code || 'UNKNOWN_ERROR',
      response.status,
      data.error?.details
    );
  }

  return data;
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: Array<{ field?: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Register a new user
   */
  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: data.email.split('@')[0], // You might want to adjust this
        lastName: '',
        email: data.email,
        password: data.password,
        confirmedPassword: data.confirmedPassword,
      }),
    });

    if (response.success && response.data) {
      // Store tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.data.tokens.accessToken);
        localStorage.setItem('refresh_token', response.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    }

    throw new ApiError('Registration failed', 'REGISTRATION_FAILED', 400);
  },

  /**
   * Login user
   */
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      // Store tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.data.tokens.accessToken);
        localStorage.setItem('refresh_token', response.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    }

    throw new ApiError('Login failed', 'LOGIN_FAILED', 401);
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiRequest<User>('/auth/me');

    if (response.success && response.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    }

    throw new ApiError('Failed to get user', 'GET_USER_FAILED', 401);
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiRequest<void>('/auth/logout', {
        method: 'POST',
      });
    } finally {
      // Clear local storage regardless of API response
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_profile');
        localStorage.removeItem('cvs');
      }
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh_token') 
      : null;

    if (!refreshToken) {
      throw new ApiError('No refresh token available', 'NO_REFRESH_TOKEN', 401);
    }

    const response = await apiRequest<{ accessToken: string; expiresIn: number }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (response.success && response.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.data.accessToken);
      }
      return {
        accessToken: response.data.accessToken,
        refreshToken: refreshToken,
        expiresIn: response.data.expiresIn,
      };
    }

    throw new ApiError('Token refresh failed', 'REFRESH_FAILED', 401);
  },
};

/**
 * User Profile API
 */
export const userApi = {
  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiRequest<UserProfile>('/user/profile');

    if (response.success && response.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_profile', JSON.stringify(response.data));
      }
      return response.data;
    }

    throw new ApiError('Failed to get profile', 'GET_PROFILE_FAILED', 400);
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiRequest<UserProfile>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_profile', JSON.stringify(response.data));
      }
      return response.data;
    }

    throw new ApiError('Failed to update profile', 'UPDATE_PROFILE_FAILED', 400);
  },
};

/**
 * CV API
 */
export const cvApi = {
  /**
   * Get all CVs for the current user
   */
  async getAll(options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<CVListResponse> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.order) params.append('order', options.order);

    const queryString = params.toString();
    const endpoint = queryString ? `/cv?${queryString}` : '/cv';

    const response = await apiRequest<CVListResponse>(endpoint);

    if (response.success && response.data) {
      return response.data;
    }

    throw new ApiError('Failed to get CVs', 'GET_CVS_FAILED', 400);
  },

  /**
   * Get CV by ID
   */
  async getById(id: string): Promise<CV> {
    const response = await apiRequest<CV>(`/cv/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new ApiError('CV not found', 'CV_NOT_FOUND', 404);
  },

  /**
   * Create a new CV
   */
  async create(data: Partial<CV>): Promise<CV> {
    const response = await apiRequest<CV>('/cv', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new ApiError('Failed to create CV', 'CREATE_CV_FAILED', 400);
  },

  /**
   * Update an existing CV
   */
  async update(id: string, data: Partial<CV>): Promise<CV> {
    const response = await apiRequest<CV>(`/cv/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new ApiError('Failed to update CV', 'UPDATE_CV_FAILED', 400);
  },

  /**
   * Delete a CV
   */
  async delete(id: string): Promise<void> {
    const response = await apiRequest<void>(`/cv/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new ApiError('Failed to delete CV', 'DELETE_CV_FAILED', 400);
    }
  },

  /**
   * Duplicate a CV
   */
  async duplicate(id: string): Promise<CV> {
    const response = await apiRequest<CV>(`/cv/${id}/duplicate`, {
      method: 'POST',
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new ApiError('Failed to duplicate CV', 'DUPLICATE_CV_FAILED', 400);
  },

  /**
   * Export CV to PDF
   */
  async exportToPDF(id: string, template?: string): Promise<{ downloadUrl: string; expiresAt: string }> {
    const response = await apiRequest<{ downloadUrl: string; expiresAt: string }>(`/cv/${id}/export/pdf`, {
      method: 'POST',
      body: JSON.stringify({ template }),
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new ApiError('Failed to export CV', 'EXPORT_CV_FAILED', 400);
  },
};

/**
 * Helper function to handle token refresh on 401 errors
 */
export async function withAuthRetry<T>(
  apiCall: () => Promise<T>
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      try {
        // Try to refresh token
        await authApi.refreshToken();
        // Retry the original request
        return await apiCall();
      } catch (refreshError) {
        // Refresh failed, logout user
        await authApi.logout();
        throw new ApiError('Session expired. Please login again.', 'SESSION_EXPIRED', 401);
      }
    }
    throw error;
  }
}

// Export default API client
export default {
  auth: authApi,
  user: userApi,
  cv: cvApi,
};


