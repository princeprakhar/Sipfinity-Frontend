// types/product.ts
export interface ProductResponse {
  data: {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  message: string;
  status: string;
}

export interface CategoryResponse {
  data: string[];
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  size: string;
  material: string;
  status: 'active' | 'inactive';
  stock: number; // Changed from string to number
  created_at: string; // Changed from createdAt to created_at
  updated_at: string; // Changed from updatedAt to updated_at
  images: Image[];
  services: ProductService[];
}

export interface Image {
  id: string;
  product_id: number; // Changed from productId to product_id and string to number
  file_name: string; // Added missing field
  s3_key: string; // Changed from key to s3_key
  s3_url: string; // Changed from src to s3_url
  content_type: string; // Added missing field
  size: number; // Added missing field
  is_active: boolean; // Added missing field
  created_at: string; // Changed from createdAt to created_at
  updated_at: string; // Changed from updatedAt to updated_at
}

export interface ProductService {
  id: number; // Added missing field
  product_id: number; // Added missing field
  name: string;
  link: string;
  created_at: string; // Added missing field
  updated_at: string; // Added missing field
}

export interface ProductFilters {
  category: string;
  priceRange: [number, number];
  status: string;
  size: string;
  search: string;
}

export interface ProductState {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  selectedProducts: string[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}


export interface LikeProductRequest {
  productId: number;
  like: boolean;
  dislike: boolean;
}

export interface CreateProductRequest {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  size?: string;
  images?: File[];
  material?: string;
  status?: string;
  stock: number;
  services?: Array<{ name: string; link: string }>;
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  size?: string;
  images?: File[];
  material?: string;
  status?: string;
  stock?: number;
  services?: Array<{ name: string; link: string }>;
}

export interface DashboardStats {
  total_products: number;
  total_users: number;
  total_reviews: number;
  flagged_reviews: number;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages?: number;
  };
}

export interface SearchProductsParams {
  q?: string;
  category?: string;
  brand?: string;
  page?: number;
  limit?: number;
}

export interface BatchDeleteRequest {
  product_ids: number[];
}

export interface BatchDeleteResponse {
  success_count: number;
  total_count: number;
  errors?: string[];
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  is_flagged: boolean;
  is_active: boolean;
  created_at: string;
}

export interface ModerateReviewRequest {
  action: 'approve' | 'reject' | 'flag';
  reason?: string;
}