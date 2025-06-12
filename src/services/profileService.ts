import api,{ handleApiError} from './api';
import {API_ENDPOINTS} from '@/config/api';
import type {User} from '@/types';


export const profileService = {
  async updateProfile(data: {first_name: string, last_name: string, email: string, phone_number: string}): Promise<User> {
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