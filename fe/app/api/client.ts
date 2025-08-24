import type {
  TokenObtainPairRequest,
  TokenObtainPair,
  TokenRefreshRequest,
  TokenRefresh,
  User,
  LoginRequest,
  RegisterRequest,
} from './types';
import { API_CONFIG } from './config';

export class ApiError extends Error {
  constructor(public status: number, public data: any) {
    super(`API Error: ${status}`);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData);
    }

    return response.json();
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<TokenObtainPair> {
    return this.request<TokenObtainPair>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });
  }

  async register(userData: RegisterRequest): Promise<User> {
    return this.request<User>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  }

  async refreshToken(refreshToken: string): Promise<TokenRefresh> {
    return this.request<TokenRefresh>(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, {
      method: 'POST',
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });
  }

  async getProfile(): Promise<User> {
    return this.request<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE, {
      method: 'GET',
    });
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.request<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
}

export const apiClient = new ApiClient();
export { ApiClient };
export default apiClient;