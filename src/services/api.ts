// src/services/api.ts
import axios ,{AxiosError} from "axios";
import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";


import { API_BASE_URL, TOKEN_STORAGE_KEYS } from '@/config/api';
import type { ApiError } from '@/types';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
    console.log("Access Token",token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
      console.log("refresh token", refreshToken);
      if (refreshToken) {
        try {
          interface RefreshTokenResponse {
            data: {
              access_token: string;
            }
          }

          const response = await axios.post<RefreshTokenResponse>(`${API_BASE_URL}/auth/refresh-token`, {
            refresh_token: refreshToken,
          });
          
          const { access_token } = response.data.data;
          localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, access_token);
          
          // Retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const handleApiError = (error: any): ApiError => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return {
        message: error.response.data.message,
        statusCode: error.response.status,
      };
    }
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
  };
};

export default api;