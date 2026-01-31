import api from "@/lib/axios";
import { LoginData, RegisterResponse, LoginResponse, AuthUser } from "@/types/auth-types";
import { RegisterFormData } from "@/types/types";
import { setToken, setUser, getUser, clearToken, getToken } from "@/lib/auth-storage";

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

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
    refreshToken?: string;
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
export const register = async (data: RegisterFormData) => {
  const response = await api.post<RegisterResponseData>("/v1/auth/register", data);
  const payload = response.data?.data || response.data;
  return response;
};

/**
 * Authenticate a user and get access token
 */
export const login = async (data: LoginData) => {
  const response = await api.post<LoginResponseData>("/v1/auth/login", data);
  const payload = response.data?.data || response.data;

  if (payload.token) {
    setToken({ token: payload.token });
    if (payload.user) {
      setUser(payload.user);
    }
  }

  return response;
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async () => {
  // Get refresh token from cookie
  let refreshTokenValue = '';
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const refreshCookie = cookies.find(c => c.trim().startsWith('refreshToken='));
    if (refreshCookie) {
      refreshTokenValue = refreshCookie.split('=')[1];
    }
  }
  
  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }
  
  const response = await api.post<LoginResponseData>("/v1/auth/refresh", {
    refreshToken: refreshTokenValue
  });
  
  const payload = response.data?.data || response.data;

  if (payload.token) {
    setToken({ token: payload.token });
  }

  return response;
};

/**
 * Logout user and invalidate tokens
 */
export const logout = async () => {
  try {
    await api.post("/v1/auth/logout");
  } catch (error) {
    // Continue with logout even if API call fails
    console.error('Logout API call failed:', error);
  } finally {
    clearToken();
  }
};

/**
 * Resend email verification link
 */
export const resendVerification = () => {
  return api.post("/v1/auth/resend-verification");
};

/**
 * Get current authenticated user profile
 */
export const getCurrentUser = async () => {
  const response = await api.get<UserProfileResponse>("/v1/users/me");
  const payload = response.data?.data || response.data;

  // The payload itself is the user object in getMe response
  if (payload && payload.email) {
    setUser(payload);
  }
  return response;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get stored user
 */
export const getStoredUser = () => {
  return getUser();
};