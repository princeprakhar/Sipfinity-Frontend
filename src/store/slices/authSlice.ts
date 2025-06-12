// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';
import { TOKEN_STORAGE_KEYS } from '@/config/api';
import type {
  AuthState,
  SignInCredentials,
  SignUpCredentials,
  ResetPasswordData,
  User,
  AuthTokens,
  ApiError,
} from '@/types';

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  // Add these new fields
  resetToken: null,
  tokenValidated: false,
};

// Async thunks
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: SignInCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.signIn(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (credentials: SignUpCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.signUp(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword({email});
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

// Add this new action for token validation
export const validateResetToken = createAsyncThunk(
  'auth/validateResetToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authService.validateResetToken(token);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(data);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken(refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
      state.resetToken = null;
      state.tokenValidated = false;
      localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add this new action
    clearResetState: (state) => {
      state.resetToken = null;
      state.tokenValidated = false;
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, action.payload.tokens.accessToken);
      localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, action.payload.tokens.refreshToken);
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        state.error = null;
        console.log('Sign in successful:', action.payload);
        localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, action.payload.tokens.accessToken);
        localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, action.payload.tokens.refreshToken);
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as ApiError)?.message || 'Sign in failed';
      })
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, action.payload.tokens.accessToken);
        localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, action.payload.tokens.refreshToken);
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as ApiError)?.message || 'Sign up failed';
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to send reset token';
      })
      // Add Validate Reset Token cases
      .addCase(validateResetToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateResetToken.fulfilled, (state) => {
        state.isLoading = false;
        state.tokenValidated = true;
        state.error = null;
      })
      .addCase(validateResetToken.rejected, (state, action) => {
        state.isLoading = false;
        state.tokenValidated = false;
        state.error = (action.payload as ApiError)?.message || 'Token validation failed';
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Clear reset state on successful password reset
        state.resetToken = null;
        state.tokenValidated = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as ApiError)?.message || 'Password reset failed';
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (state.tokens) {
          state.tokens.accessToken = action.payload.access_token;
          localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, action.payload.access_token);
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
      });
  },
});

export const { logout, clearError, clearResetState, setCredentials } = authSlice.actions;
export default authSlice.reducer;