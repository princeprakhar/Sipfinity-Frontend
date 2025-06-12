import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '@/services/profileService';
import type { ProfileState, UpdateProfileData, ChangePasswordData, ApiError } from '@/types';




const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};


export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (data: UpdateProfileData, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfile(data);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);


export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (data: ChangePasswordData, { rejectWithValue }) => {
    try {
      const response = await profileService.changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);


export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.profile = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as ApiError) || null;
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as ApiError) || null;
      });
  },
});
export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
export const selectProfile = (state: { profile: ProfileState }) => state.profile.profile;