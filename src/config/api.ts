// src/config/api.ts
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://ecommerce-backend-production-8ac4.up.railway.app/api/v1" ||
  "http://localhost:8080/api/v1";
// export const API_BASE_URL ="http://localhost:8080/api/v1";

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    VALIDATE_RESET_TOKEN: "/password/validate-reset-token",
    FORGET_PASSWORD: "/password/forgot",
    RESET_PASSWORD: "/password/reset",
    REFRESH_TOKEN: "/auth/refresh-token",
    FETCH_USER_PROFILE: "/auth/profile",
    UPDATE_PROFILE: "/auth/profile-update",
    CHANGE_PASSWORD: "/password/change",
  },
  PRODUCTS: {
    LIST: "/products/",
    CATEGORIES: "/products/category",
    DETAILS: (id: Number) => {
      return `/products/${id}`;
    },
    REACT: (id: Number) => {
      return `/reviews/product/like/${id}`;
    },
  },
  REVIEWS: {
    PRODUCT: (id: number) => `/reviews/product/${id}`,
    CREATE: "/reviews/",
    LIKE: (id: number) => `/reviews/${id}/like`,
    FLAG: (id: number) => `/reviews/${id}/flag`,
    MODERATE: (id: number) => `/reviews/${id}/moderate`,
  },
  ADMIN: {
    DASHBOARD:'/admin/dashboard',
    PRODUCTS: "/admin/products",
    PRODUCT_BY_ID: (id: Number) => `/admin/products/${id}`,
    UPDATE_PRODUCT: (id: Number) => `/admin/products/${id}`,
    DELETE_PRODUCT: (id: Number) => `/admin/products/${id}`,
    BATCH_DELETE_PRODUCTS: "/admin/products/batch",
    SEARCH_PRODUCTS: "/admin/products/search",

    // Product Images
    UPLOAD_PRODUCT_IMAGES: (id: Number) => `/admin/products/${id}/images`,
    DELETE_PRODUCT_IMAGE: (productId: Number, imageId: string) =>
      `/admin/products/${productId}/images/${imageId}`,

    // Reviews
    FLAGGED_REVIEWS: "/admin/reviews/flagged",
    MODERATE_REVIEW: (id: Number) => `/admin/reviews/${id}/moderate`,
  },
} as const;

export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

export const THEME_STORAGE_KEY = "theme-preference";
