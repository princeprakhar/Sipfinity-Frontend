// src/services/authService.ts
import api, { handleApiError } from './api';
import { API_ENDPOINTS } from '@/config/api';
import type {
  SignInCredentials,
  SignUpCredentials,
  ResetPasswordData,
  ApiResponse,
  AuthTokens,
  User,
} from '@/types';

export const authService = {
  async signIn(credentials: SignInCredentials): Promise<ApiResponse<{
    user: User;
    tokens: AuthTokens;
  }>> {
    try {
      const email = credentials.email;
      const password = credentials.password;
      const response = await api.post(API_ENDPOINTS.AUTH.SIGNIN, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async signUp(credentials: SignUpCredentials): Promise<ApiResponse<{
    user: User;
    tokens: AuthTokens;
  }>> {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, credentials);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  forgotPassword: async (email: string) => {
    const response = await fetch('/api/password/forgot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw handleApiError(errorData);
    }

    return response.json();
  },

  resetPassword: async (data: ResetPasswordData) => {
    const response = await fetch('/api/password/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw handleApiError(errorData);
    }

    return response.json();
  },



  async refreshToken(refreshToken: string): Promise<ApiResponse<{ access_token: string }>> {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refresh_token: refreshToken,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};