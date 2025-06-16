// store/productSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductFilters, ProductState } from '@/types/product';
import productService from '@/services/productService';
import type { ApiError } from '@/types';

const initialState: ProductState = {
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
  itemsPerPage: 12
};

// Async thunks for user operations
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.fetchCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: { page: number; filters: ProductFilters }, { rejectWithValue }) => {
    try {
      // Convert filters to the format expected by your backend
      const apiFilters: Partial<Product> = {};
      
      if (params.filters.category) {
        apiFilters.category = params.filters.category;
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

      // Only show active products for users
      apiFilters.status = 'active';

      const response = await productService.fetchProducts(params.page, apiFilters);
      
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

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productService.fetchProductById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filters change
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
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to fetch categories';
      })
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to fetch products';
      })
      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        // Update product in the list if it exists
        const index = state.products.findIndex((p: Product) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to fetch product';
      });
  }
});

export const {
  setFilters,
  setCurrentPage,
  toggleProductSelection,
  selectAllProducts,
  clearSelection,
  clearError,
  resetProducts
} = productSlice.actions;

export default productSlice.reducer;