export interface TokenObtainPairRequest {
  username: string;
  password: string;
}

export interface TokenObtainPair {
  access: string;
  refresh: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface TokenRefresh {
  access: string;
  refresh?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface ApiErrorResponse {
  detail: string;
  code?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiErrorResponse;
}