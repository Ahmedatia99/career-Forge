import api from "@/lib/axios";
import {Login, Register} from "@/types/types";
export const register = (data: Register) =>
  api.post("/auth/register", data);

export const login = (data: Login) =>
  api.post("/auth/login", data);

export const refreshToken = () =>
  api.post("/auth/refresh");

export const logout = () =>
  api.post("/auth/logout");

export const forgotPassword = (email: string) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (data: any) =>
  api.post("/auth/reset-password", data);

export const verifyEmail = (token: string) =>
  api.get(`/auth/verify-email/${token}`);

export const resendVerification = () =>
  api.post("/auth/resend-verification");
