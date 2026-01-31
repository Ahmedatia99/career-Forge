import api from "@/lib/axios";
import { extractData } from "@/lib/api-helpers";
import { AuthUser } from "@/types/auth-types";
import { setUser } from "@/lib/auth-storage";

export interface UserProfileResponse {
  success: boolean;
  data: AuthUser;
  message?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  data: AuthUser;
  message?: string;
}

/**
 * Get current authenticated user profile
 */
export const getCurrentUser = () => {
  return api.get<UserProfileResponse>("/v1/users/me");
};

/**
 * Update current user profile
 */
export const updateCurrentUser = (data: UpdateUserRequest) => {
  return api.patch<UpdateUserResponse>("/v1/users/me", data);
};

/**
 * Update user profile with storage update
 */
export const updateProfile = async (userData: UpdateUserRequest) => {
  const response = await api.patch<UpdateUserResponse>('/v1/users/profile', userData);
  const payload = response.data?.data || response.data;
  if (payload) {
    setUser(payload);
  }
  return payload;
};

/**
 * Upload user avatar
 */
export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  
  return api.post<UpdateUserResponse>("/v1/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Delete user account
 */
export const deleteAccount = () => {
  return api.delete("/v1/users/me");
};