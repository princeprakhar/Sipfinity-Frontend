// src/utils/constants.ts
import  type {BackendUser, User,UpdateProfileData} from "@/types"
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



export const transformUser = (backendUser: BackendUser): User => {
  return {
    id: backendUser.id.toString(),
    email: backendUser.email,
    username: backendUser.email, // Use email as username if not provided
    isAdmin: backendUser.role === 'admin',
    createdAt: backendUser.created_at,
    firstName: backendUser.first_name,
    lastName: backendUser.last_name,
    phoneNumber: backendUser.phone_number,
    role: backendUser.role,
    avatarUrl: undefined, // Not provided by backend
    updatedAt: backendUser.updated_at,
  };
};



