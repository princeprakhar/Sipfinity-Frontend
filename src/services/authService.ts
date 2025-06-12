// src/services/authService.ts
import api, { handleApiError } from './api';
import { API_ENDPOINTS } from '@/config/api';
import type {
  SignInCredentials,
  SignUpCredentials,
  ResetPasswordData,
  ForgotPasswordData,
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

  forgotPassword: async (payload: ForgotPasswordData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.FORGET_PASSWORD, payload);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Request failed with status ${response.status}`);
      }


      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  validateResetToken: async (token: string) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.AUTH.VALIDATE_RESET_TOKEN}?token=${token}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  resetPassword: async (data: ResetPasswordData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
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