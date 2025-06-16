// store/adminProductSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductFilters } from '@/types/product';
import { adminProductService } from '@/services/productService';
import type { ApiError } from '@/types';

interface AdminProductState {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  selectedProducts: string[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  uploadingImages: boolean;
  currentProduct: Product | null;
}

const initialState: AdminProductState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    priceRange: [0, 1000],
    status: '',
    size: '',
    search: ''
  },
  selectedProducts: [],
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 12,
  uploadingImages: false,
  currentProduct: null
};

// Async thunks for admin operations
export const fetchAdminProducts = createAsyncThunk(
  'adminProducts/fetchProducts',
  async (params: { page: number; filters: ProductFilters }, { rejectWithValue }) => {
    try {
      // Convert filters to the format expected by your backend
      const apiFilters: Partial<Product> = {};
      
      if (params.filters.category) {
        apiFilters.category = params.filters.category;
      }
      
      if (params.filters.status) {
        apiFilters.status = params.filters.status as 'active' | 'inactive';
      }
      
      if (params.filters.size) {
        apiFilters.size = params.filters.size;
      }
      
      if (params.filters.search) {
        (apiFilters as any).search = params.filters.search;
      }
      
      if (params.filters.priceRange && (params.filters.priceRange[0] > 0 || params.filters.priceRange[1] < 1000)) {
        (apiFilters as any).minPrice = params.filters.priceRange[0];
        (apiFilters as any).maxPrice = params.filters.priceRange[1];
      }

      const response = await adminProductService.fetchProducts(params.page, apiFilters);
      
      return {
        products: response.data,
        totalPages: response.totalPages,
        currentPage: params.page
      };
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const fetchAdminProductById = createAsyncThunk(
  'adminProducts/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await adminProductService.fetchProductById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const addProduct = createAsyncThunk(
  'adminProducts/addProduct',
  async (product: Product, { rejectWithValue }) => {
    try {
      const response = await adminProductService.addProduct(product);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'adminProducts/updateProduct',
  async (product: Product, { rejectWithValue }) => {
    try {
      const response = await adminProductService.updateProduct(product);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'adminProducts/deleteProduct',
  async (productId: string, { rejectWithValue }) => {
    try {
      await adminProductService.deleteProducts(productId);
      return { productId };
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const bulkDeleteProducts = createAsyncThunk(
  'adminProducts/bulkDeleteProducts',
  async (productIds: string[], { rejectWithValue }) => {
    try {
      // Delete products one by one (you might want to implement bulk delete in your backend)
      const deletePromises = productIds.map(id => adminProductService.deleteProducts(id));
      await Promise.all(deletePromises);
      return { productIds };
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const uploadProductImages = createAsyncThunk(
  'adminProducts/uploadImages',
  async (params: { productId: string; images: File[] }, { rejectWithValue }) => {
    try {
      const response = await adminProductService.uploadImages(params.productId, params.images);
      return { productId: params.productId, imageUrls: response };
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const deleteProductImage = createAsyncThunk(
  'adminProducts/deleteImage',
  async (params: { productId: string; imageId: string }, { rejectWithValue }) => {
    try {
      await adminProductService.deleteImages(params.productId, params.imageId);
      return { productId: params.productId, imageId: params.imageId };
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

const adminProductSlice = createSlice({
  name: 'adminProducts',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    toggleProductSelection: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const index = state.selectedProducts.indexOf(productId);
      if (index === -1) {
        state.selectedProducts.push(productId);
      } else {
        state.selectedProducts.splice(index, 1);
      }
    },
    selectAllProducts: (state) => {
      state.selectedProducts = state.products.map((p: Product) => p.id.toString());
    },
    clearSelection: (state) => {
      state.selectedProducts = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetProducts: (state) => {
      state.products = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.selectedProducts = [];
      state.currentProduct = null;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to fetch products';
      })
      // Fetch single product
      .addCase(fetchAdminProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        // Update product in the list if it exists
        const index = state.products.findIndex((p: Product) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(fetchAdminProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to fetch product';
      })
      // Add product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
        state.currentProduct = action.payload;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to add product';
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p: Product) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to update product';
      })
      // Delete single product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p: Product) => p.id.toString() !== action.payload.productId);
        state.selectedProducts = state.selectedProducts.filter(id => id !== action.payload.productId);
        if (state.currentProduct?.id.toString() === action.payload.productId) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to delete product';
      })
      // Bulk delete products
      .addCase(bulkDeleteProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkDeleteProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p: Product) => !action.payload.productIds.includes(p.id.toString()));
        state.selectedProducts = [];
      })
      .addCase(bulkDeleteProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to delete products';
      })
      // Upload images
      .addCase(uploadProductImages.pending, (state) => {
        state.uploadingImages = true;
        state.error = null;
      })
      .addCase(uploadProductImages.fulfilled, (state, action) => {
        state.uploadingImages = false;
        // Update the product with new images
        const index = state.products.findIndex((p: Product) => p.id.toString() === action.payload.productId);
        if (index !== -1) {
          const currentImages = (state.products[index] as any).images || [];
          (state.products[index] as any).images = [...currentImages, ...action.payload.imageUrls];
        }
        if (state.currentProduct?.id.toString() === action.payload.productId) {
          const currentImages = (state.currentProduct as any).images || [];
          (state.currentProduct as any).images = [...currentImages, ...action.payload.imageUrls];
        }
      })
      .addCase(uploadProductImages.rejected, (state, action) => {
        state.uploadingImages = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to upload images';
      })
      // Delete image
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        const index = state.products.findIndex((p: Product) => p.id.toString() === action.payload.productId);
        if (index !== -1) {
          const currentImages = (state.products[index] as any).images || [];
          (state.products[index] as any).images = currentImages.filter(
            (img: any) => img.id !== action.payload.imageId
          );
        }
        if (state.currentProduct?.id.toString() === action.payload.productId) {
          const currentImages = (state.currentProduct as any).images || [];
          (state.currentProduct as any).images = currentImages.filter(
            (img: any) => img.id !== action.payload.imageId
          );
        }
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        state.error = (action.payload as ApiError)?.message || 'Failed to delete image';
      });
  }
});

export const {
  setFilters: setAdminFilters,
  setCurrentPage: setAdminCurrentPage,
  toggleProductSelection: toggleAdminProductSelection,
  selectAllProducts: selectAllAdminProducts,
  clearSelection: clearAdminSelection,
  clearError: clearAdminError,
  resetProducts: resetAdminProducts,
  setCurrentProduct
} = adminProductSlice.actions;

export default adminProductSlice.reducer;