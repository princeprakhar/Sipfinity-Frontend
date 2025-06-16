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
      console.log("response.data", response.data )
      return response.data;
    } catch (error) {
      throw handleApiError(error as ApiError);
    }
  },
  async fetchCategories(): Promise<string[]> {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.CATEGORIES);
      console.log("response.data", response.data )
      return response.data;
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
}

const adminProductService = {
  async fetchProducts(page: number, filters: Partial<Product>): Promise<{ data: Product[]; totalPages: number }> {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS_ADMIN.LIST, {
        params: { page, ...filters },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  async addProduct(product: Product): Promise<Product> {   
    try {
      const response = await api.post(API_ENDPOINTS.PRODUCTS_ADMIN.DETAILS(product.id), product);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  async updateProduct(product: Product): Promise<Product> {
    try {
      const response = await api.put(`${API_ENDPOINTS.PRODUCTS_ADMIN.DETAILS(product.id)}`, product);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  async deleteProducts(productId: string): Promise<void> {
    try {
      await api.delete(`${API_ENDPOINTS.PRODUCTS_ADMIN.DETAILS(Number(productId))}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  async uploadImages(productId: string, images: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      images.forEach((image) => formData.append('images', image));
      const response = await api.post(`${API_ENDPOINTS.PRODUCTS_ADMIN.UPLOAD_IMAGES(Number(productId))}`, formData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  async deleteImages(productId: string, imageID: string): Promise<void> {
    try {
        const response = await api.delete(`${API_ENDPOINTS.PRODUCTS_ADMIN.DELETE_IMAGES(Number(productId), imageID)}`);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
  },
  async fetchProductById(id: string): Promise<Product> {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS_ADMIN.DETAILS(Number(id)));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default productService;
export { adminProductService };
