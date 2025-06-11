// src/hooks/useTheme.ts
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { setTheme, toggleTheme } from '@/store/slices/themeSlice';

export const useTheme = () => {
  const { theme } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const switchTheme = (newTheme: 'light' | 'dark') => {
    dispatch(setTheme(newTheme));
  };

  const toggle = () => {
    dispatch(toggleTheme());
  };

  return {
    theme,
    switchTheme,
    toggle,
    isDark: theme === 'dark',
  };
};