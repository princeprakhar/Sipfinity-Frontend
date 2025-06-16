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
