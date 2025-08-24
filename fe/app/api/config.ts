export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/token/',
      LOGOUT: '/api/auth/logout/',
      REGISTER: '/api/auth/register/',
      PROFILE: '/api/auth/profile/',
      REFRESH_TOKEN: '/api/auth/token/refresh/',
    },
  },
} as const;