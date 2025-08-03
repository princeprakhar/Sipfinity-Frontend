import api, { handleApiError } from './api';
import { API_ENDPOINTS } from '@/config/api';
import type { Product } from '@/types/product';
import type { ApiError } from '@/types';


const productService = {
  async fetchProducts(page: number, filters: Partial<Product>): Promise<{ data: Product[]; totalPages: number }> {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.LIST, {
        params: { page, ...filters },
      });
      // console.log("response.data", response.data )
      return response.data;
    } catch (error) {
      throw handleApiError(error as ApiError);
    }
  },
  async fetchCategories(): Promise<string[]> {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.CATEGORIES);
      // console.log("response.data", response.data )
      return response.data.data;
    } catch (error) {
      throw handleApiError(error as ApiError);
    }
  },
  async fetchProductById(id: string): Promise<Product> {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.DETAILS(Number(id)));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async fetchProductReviewsById(productId: number): Promise<any> {
    try {
      const response = await api.get(API_ENDPOINTS.REVIEWS.PRODUCT(productId));
      return response.data;
    } catch (error) {
      throw handleApiError(error as ApiError);
    }
  },
};

export default productService;
