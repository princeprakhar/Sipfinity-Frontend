// src/store/slices/themeSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { THEME_STORAGE_KEY } from '@/config/api';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
}

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
  if (stored && ['light', 'dark'].includes(stored)) {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem(THEME_STORAGE_KEY, action.payload);
      document.documentElement.classList.toggle('dark', action.payload === 'dark');
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;