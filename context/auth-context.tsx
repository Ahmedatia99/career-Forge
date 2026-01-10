"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  setToken,
  clearToken,
  setUser as saveUser,
  getUser as getStoredUser,
  getToken,
} from "@/lib/auth-storage";
import { LoginResponse, AuthUser, RegisterResponse } from "@/types/auth-types";
import { register, login, getCurrentUser, logout as logoutService } from "@/services/auth.service";
import { RegisterFormData } from "@/types/types";

interface AuthContextType {
  user: AuthUser | null;
  loginUser: (data: LoginResponse) => void;
  registerUser: (data: RegisterFormData) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true); // Start with true to

  // Restore user from localStorage and verify with API on mount/refresh
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        // Verify token is still valid by fetching current user
        try {
          const response = await getCurrentUser();
          if (response.data.success && response.data.data) {
            setUser(response.data.data);
            saveUser(response.data.data);
          } else {
            clearToken();
            setUser(null);
          }
        } catch (err) {
          // Token expired or invalid
          clearToken();
          setUser(null);
        }
      } else {
        clearToken();
        setUser(null);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Moved cookie setting logic inside loginUser function, using 'data'
  const loginUser = (data: LoginResponse) => {
    setToken({ token: data.token });
    saveUser(data.user);
    setUser(data.user);
    if (typeof document !== "undefined") {
      document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=604800; SameSite=Lax`;
    }
  };

  const registerUser = async (
    data: RegisterFormData
  ): Promise<RegisterResponse> => {
    try {
      const res = await register(data);

      const result = res.data;

      if (result.success && result.data) {
        // Save token and user
        setToken({ token: result.data.token });
        saveUser(result.data.user);
        setUser(result.data.user);

        return {
          success: true,
          status: res.status || 200,
          message: result.message || "User registered successfully",
          data: result.data,
        };
      } else {
        return {
          success: false,
          status: res.status || 400,
          message: result.message,
          error: result.error || "Registration failed",
        };
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";

      return {
        success: false,
        status: err?.response?.status || 500,
        error: errorMessage,
      };
    }
  };
  const logout = async () => {
    try {
      await logoutService();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loginUser, registerUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
