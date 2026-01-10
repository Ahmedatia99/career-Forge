import api from "@/lib/axios";
import { LoginData, RegisterResponse, LoginResponse, AuthUser } from "@/types/auth-types";
import { RegisterFormData } from "@/types/types";

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponseData {
  success: boolean;
  data: {
    token?: string;
    user?: AuthUser;
    userId?: string;
  };
  message?: string;
}

export interface LoginResponseData {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
  message?: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: AuthUser;
  message?: string;
}

/**
 * Register a new user
 */
export const register = (data: RegisterFormData) => {
  return api.post<RegisterResponseData>("/v1/auth/register", data);
};

/**
 * Authenticate a user and get access token
 */
export const login = (data: LoginData) => {
  return api.post<LoginResponseData>("/v1/auth/login", data);
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = () => {
  return api.post<LoginResponseData>("/v1/auth/refresh");
};

/**
 * Logout user and invalidate tokens
 */
export const logout = () => {
  return api.post("/auth/logout");
};

/**
 * Resend email verification link
 */
export const resendVerification = () => {
  return api.post("/auth/resend-verification");
};

/**
 * Get current authenticated user profile
 */
export const getCurrentUser = () => {
  return api.get<UserProfileResponse>("/v1/users/me");
};