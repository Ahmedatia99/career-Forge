import api from "@/lib/axios";
import { LoginResponse, RegisterResponse } from "@/types/auth-types";

export const register = (data: RegisterResponse) =>
  api.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/auth/register`, data);

export const login = (data: LoginResponse) => {
  return api.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/auth/login`, data);
};

export const refreshToken = () =>
  api.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/auth/refresh`);

export const logout = () => api.post("/auth/logout");


export const resendVerification = () => api.post("/auth/resend-verification");

export const getCurrentUser = () =>
  api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/users/me`);