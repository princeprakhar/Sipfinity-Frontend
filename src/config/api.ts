// src/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: "/auth/logout",
    FORGET_PASSWORD:"/password/forgot",
    RESET_PASSWORD: '/password/reset',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
} as const;

export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const THEME_STORAGE_KEY = 'theme-preference';