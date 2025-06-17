// services/adminService.ts
import api from './api';
import { API_ENDPOINTS } from '@/config/api';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  DashboardStats,
  PaginationResponse,
  SearchProductsParams,
  // BatchDeleteRequest,
  BatchDeleteResponse,
  Review,
  ModerateReviewRequest,
} from '@/types/product';

export class AdminService {
  // Dashboard
  static async getDashboard(): Promise<DashboardStats> {
    const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    return response.data.data;
  }

  // Product Management
  static async getProducts(page = 1, limit = 20): Promise<PaginationResponse<Product>> {
    const response = await api.get(API_ENDPOINTS.ADMIN.PRODUCTS,{
      params: { page, limit }}
    );
    return {
      data: response.data.data.products,
      pagination: response.data.data.pagination
    };
  }

  static async getProduct(productId: number): Promise<Product> {
    const response = await api.get(API_ENDPOINTS.ADMIN.PRODUCT_BY_ID(productId));
    return response.data.data;
  }

  static async createProduct(
    productData: CreateProductRequest,
    images?: File[]
  ): Promise<Product> {
    const formData = new FormData();
    
    // Add product data
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'services' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Add images if provided
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await api.post(API_ENDPOINTS.ADMIN.PRODUCTS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  static async updateProduct(
    productId: number,
    productData: UpdateProductRequest,
    images?: File[],
    deleteImageIds?: string[]
  ): Promise<Product> {
    const formData = new FormData();
    
    // Add product data
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'services' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Add new images if provided
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    // Add image IDs to delete
    if (deleteImageIds && deleteImageIds.length > 0) {
      formData.append('delete_image_ids', deleteImageIds.join(','));
    }

    const response = await api.put(API_ENDPOINTS.ADMIN.PRODUCT_BY_ID(productId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  static async uploadProductImages(productId: number, images: File[]): Promise<Product> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await api.post(
      API_ENDPOINTS.ADMIN.UPLOAD_PRODUCT_IMAGES(productId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }

  static async deleteProductImage(productId: number, imageId: string): Promise<Product> {
    const response = await api.delete(
      API_ENDPOINTS.ADMIN.DELETE_PRODUCT_IMAGE(productId, imageId)
    );
    return response.data.data;
  }

  static async deleteProduct(productId: number): Promise<void> {
    await api.delete(API_ENDPOINTS.ADMIN.PRODUCT_BY_ID(productId));
  }

  static async batchDeleteProducts(productIds: number[]): Promise<BatchDeleteResponse> {
    const response = await api.delete(API_ENDPOINTS.ADMIN.BATCH_DELETE_PRODUCTS, {
      data: { product_ids: productIds }
    });
    return response.data.data;
  }

  static async searchProducts(params: SearchProductsParams): Promise<PaginationResponse<Product>> {
    const response = await api.get(API_ENDPOINTS.ADMIN.SEARCH_PRODUCTS, { params });
    return {
      data: response.data.data.products,
      pagination: response.data.data.pagination
    };
  }

  // Review Management
  static async getFlaggedReviews(page = 1, limit = 20): Promise<PaginationResponse<Review>> {
    const response = await api.get(API_ENDPOINTS.ADMIN.FLAGGED_REVIEWS, {
      params: { page, limit }
    });
    return {
      data: response.data.data.reviews,
      pagination: response.data.data.pagination
    };
  }

  static async moderateReview(
    reviewId: number,
    moderationData: ModerateReviewRequest
  ): Promise<Review> {
    const response = await api.post(
      API_ENDPOINTS.ADMIN.MODERATE_REVIEW(reviewId),
      moderationData
    );
    return response.data.data;
  }
}