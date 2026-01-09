export interface AuthUser {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isEmailVerified?: boolean;
    role?: string;
  }
  export interface LoginResponse {
    token: string;
    refreshToken: string;
    user: AuthUser;
  }

  export interface LoginData {
  email: string;
  password: string;
  }
  export interface RegisterResponse {
    success: boolean;
    status?: number;
    message?: string;
    data?: {
      token: string;
      user: AuthUser;
    } | null;
    error?: {
      code?: string;
      message?: string;
    } | string;
  }