// src/utils/constants.ts
export const APP_NAME = 'Container';
export const APP_DESCRIPTION = 'Modern inventory management solution';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
} as const;

export const LOCAL_STORAGE_KEYS = {
  THEME: 'container-theme',
  TOKENS: 'container-tokens',
} as const;