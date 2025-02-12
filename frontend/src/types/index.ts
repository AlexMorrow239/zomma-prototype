import { ProspectFormData } from "@/pages/prospect-questionnaire/schema";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

// Request Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User | null, token: string | null) => void;
  logout: (callback?: () => void) => void;
  isAuthenticated: () => boolean;
  updateUser: (userData: Partial<User>) => void;
  updateToken: (newToken: string) => void;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: {
    firstName: string;
    lastName: string;
  };
}

// Response Types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

export interface Prospect extends ProspectFormData {
  id: string;
  contacted: boolean;
  createdAt?: string;
  updatedAt?: string;
}
