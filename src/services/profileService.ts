import api,{ handleApiError} from './api';
import {API_ENDPOINTS} from '@/config/api';
import type {User, UpdateProfileData} from '@/types';


export const profileService = {
//   async getProfile(): Promise<User> {
//     try {
//       return await api.get(API_ENDPOINTS.AUTH.GET_PROFILE);
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      const response = await api.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async changePassword(data: { current_password: string; new_password: string }): Promise<void> {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
      console.log('Password changed successfully:', response.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};