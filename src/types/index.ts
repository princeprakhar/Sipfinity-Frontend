// src/types/index.ts
export interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  createdAt: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  avatarUrl?: string;
  updatedAt?: string;
}

export interface BackendUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}



export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

// src/types/index.ts (or wherever your types are defined)
export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Add these new fields for token validation
  resetToken: string | null;
  tokenValidated: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
}
export interface ResetPasswordData {
  token: string;
  new_password: string;
}


export interface ForgotPasswordData {
  email: string;
}





export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}


export interface ItemService {
  name: string;
  link: string;
}

export interface Item {
  id: string;
  title: string;
  price: number;
  image_src: string;
  description: string;
  category: string;
  material?: string[];
  features?: string[];
  size: 'small' | 'medium' | 'large';
  services: ItemService[];
}

export interface Category {
  id: string;
  name: string;
  color: TailwindColor;
  icon: any; // You can make this more specific based on your icon library
}

export type TailwindColor =
  | 'pink' | 'amber' | 'green' | 'emerald'
  | 'blue' | 'indigo' | 'violet' | 'purple'
  | 'yellow' | 'red' | 'rose' | 'fuchsia'
  | 'lime' | 'teal' | 'sky' | 'cyan' | 'slate' | 'orange';




export interface ProfileState {
  profile: User | null;
  isLoading: boolean;
  error: ApiError | null;
}


export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user: User;
}
export interface ChangePasswordState {
  isLoading: boolean;
  error: ApiError | null;
  successMessage: string | null;
}
