"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    // Mock signup - in production, this would call an API
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      firstName,
      lastName,
    };

    // Store user data
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("auth_token", "mock_token_" + newUser.id);
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    // Mock login - in production, this would call an API
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      firstName: "Ahmed",
      lastName: "Atia",
    };

    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("auth_token", "mock_token_" + mockUser.id);
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_profile");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
