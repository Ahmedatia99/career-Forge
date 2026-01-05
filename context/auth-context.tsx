"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { setToken, clearToken } from "@/lib/auth-storage";
import { LoginFormData, RegisterFormData } from "@/types/types";
interface User {
  id: string;
  email: string;
  username: string;
  isEmailVerified: boolean;
}
interface AuthContextType {
  user: User | null;
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

export const useAuth = () => useContext(AuthContext);
