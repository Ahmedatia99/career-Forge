"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { setToken, clearToken } from "@/lib/auth-storage";
import { LoginFormData, RegisterFormData } from "@/types/types";

interface AuthUser {
  id: string;
  email: string;
  username?: string;
  isEmailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  headline?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loginUser: (data: LoginFormData) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const loginUser = (data: LoginFormData) => {
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, loading }}>
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
