// store/slices/adminSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { AdminService } from '@/services/adminService';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  DashboardStats,
  // PaginationResponse,
  SearchProductsParams,
  // BatchDeleteResponse,
  Review,
} from '@/types/product';

interface AdminState {
  dashboard: {
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
  };
  products: {
    list: Product[];
    currentProduct: Product | null;
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages?: number;
    } | null;
    loading: boolean;
    error: string | null;
  };
  reviews: {
    flaggedReviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages?: number;
    } | null;
    loading: boolean;
    error: string | null;
  };
}

const initialState: AdminState = {
  dashboard: {
    stats: null,
    loading: false,
    error: null,
  },
  products: {
    list: [],
    currentProduct: null,
    pagination: null,
    loading: false,
    error: null,
  },
  reviews: {
    flaggedReviews: [],
    pagination: null,
    loading: false,
    error: null,
  },
};

// Async Thunks
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      return await AdminService.getDashboard();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'admin/fetchProducts',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await AdminService.getProducts(page, limit);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'admin/fetchProduct',
  async (productId: number, { rejectWithValue }) => {
    try {
      return await AdminService.getProduct(productId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (
    { productData, images }: { productData: CreateProductRequest; images?: File[] },
    { rejectWithValue }
  ) => {
    try {
      return await AdminService.createProduct(productData, images);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async (
    {
      productId,
      productData,
      images,
      deleteImageIds,
    }: {
      productId: number;
      productData: UpdateProductRequest;
      images?: File[];
      deleteImageIds?: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      return await AdminService.updateProduct(productId, productData, images, deleteImageIds);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId: number, { rejectWithValue }) => {
    try {
      await AdminService.deleteProduct(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const batchDeleteProducts = createAsyncThunk(
  'admin/batchDeleteProducts',
  async (productIds: number[], { rejectWithValue }) => {
    try {
      const result = await AdminService.batchDeleteProducts(productIds);
      return { result, productIds };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete products');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'admin/searchProducts',
  async (params: SearchProductsParams, { rejectWithValue }) => {
    try {
      return await AdminService.searchProducts(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products');
    }
  }
);


export const deleteProductImage = createAsyncThunk<
  any,
  { productID: number; imageIds: string },
  { rejectValue: string }
>(
  'admin/deleteImageIds',
  async ({ productID, imageIds }, { rejectWithValue }) => {
    try {
      return await AdminService.deleteProductImage(productID, imageIds);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete images');
    }
  }
)

export const fetchFlaggedReviews = createAsyncThunk(
  'admin/fetchFlaggedReviews',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await AdminService.getFlaggedReviews(page, limit);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch flagged reviews');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.products.error = null;
    },
    clearDashboardError: (state) => {
      state.dashboard.error = null;
    },
    clearReviewsError: (state) => {
      state.reviews.error = null;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.products.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Dashboard
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboard.loading = true;
        state.dashboard.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.error = action.payload as string;
      })

    // Products
      .addCase(fetchProducts.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.list = action.payload.data;
        state.products.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload as string;
      })

      .addCase(fetchProduct.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload as string;
      })

      .addCase(createProduct.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.list.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload as string;
      })

      .addCase(updateProduct.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products.loading = false;
        const index = state.products.list.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products.list[index] = action.payload;
        }
        if (state.products.currentProduct?.id === action.payload.id) {
          state.products.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload as string;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products.list = state.products.list.filter(p => p.id !== action.payload);
        if (state.products.currentProduct?.id === action.payload) {
          state.products.currentProduct = null;
        }
      })

      .addCase(batchDeleteProducts.fulfilled, (state, action) => {
        const deletedIds = action.payload.productIds;
        state.products.list = state.products.list.filter(p => !deletedIds.includes(p.id));
      })

      .addCase(searchProducts.fulfilled, (state, action) => {
        state.products.list = action.payload.data;
        state.products.pagination = action.payload.pagination;
      })

    // Reviews
      .addCase(fetchFlaggedReviews.pending, (state) => {
        state.reviews.loading = true;
        state.reviews.error = null;
      })
      .addCase(fetchFlaggedReviews.fulfilled, (state, action) => {
        state.reviews.loading = false;
        state.reviews.flaggedReviews = action.payload.data;
        state.reviews.pagination = action.payload.pagination;
      })
      .addCase(fetchFlaggedReviews.rejected, (state, action) => {
        state.reviews.loading = false;
        state.reviews.error = action.payload as string;
      })


      //deleteProductImage
      .addCase(deleteProductImage.pending, (state) => {
        state.products.error = null;
      })
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        const productId = action.payload.productId;
        const imageId = action.payload.imageId;
        const productIndex = state.products.list.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
          const product = state.products.list[productIndex];
          const imageIndex = product.images.findIndex(i => i.id === imageId);
          if (imageIndex !== -1) {
            product.images.splice(imageIndex, 1);
          }
        }
      } )
      .addCase(deleteProductImage.rejected, (state, action) => {
        state.products.error = action.payload as string;
      })
  },
});

export const { clearProductError, clearDashboardError, clearReviewsError, setCurrentProduct } = adminSlice.actions;
export default adminSlice.reducer;