// store/slices/reviewSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ReviewState {
  // Track user interactions
  userReviewInteractions: {
    [reviewId: number]: {
      liked: boolean;
      disliked: boolean;
    };
  };
  
  // Pagination state per product
  pagination: {
    [productId: number]: {
      currentPage: number;
      hasMore: boolean;
      totalReviews: number;
    };
  };
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Review form state
  reviewForm: {
    isOpen: boolean;
    productId: number | null;
    rating: number;
    comment: string;
    isSubmitting: boolean;
  };
}

const initialState: ReviewState = {
  userReviewInteractions: {},
  pagination: {},
  loading: false,
  error: null,
  reviewForm: {
    isOpen: false,
    productId: null,
    rating: 5,
    comment: '',
    isSubmitting: false,
  },
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    // Review form actions
    openReviewForm: (state, action: PayloadAction<{ productId: number }>) => {
      state.reviewForm.isOpen = true;
      state.reviewForm.productId = action.payload.productId;
      state.reviewForm.rating = 5;
      state.reviewForm.comment = '';
      state.reviewForm.isSubmitting = false;
    },
    
    closeReviewForm: (state) => {
      state.reviewForm.isOpen = false;
      state.reviewForm.productId = null;
      state.reviewForm.rating = 5;
      state.reviewForm.comment = '';
      state.reviewForm.isSubmitting = false;
    },
    
    updateReviewRating: (state, action: PayloadAction<number>) => {
      state.reviewForm.rating = action.payload;
    },
    
    updateReviewComment: (state, action: PayloadAction<string>) => {
      state.reviewForm.comment = action.payload;
    },
    
    setReviewSubmitting: (state, action: PayloadAction<boolean>) => {
      state.reviewForm.isSubmitting = action.payload;
    },
    
    // User interaction tracking
    setReviewInteraction: (state, action: PayloadAction<{ 
      reviewId: number; 
      interaction: 'like' | 'dislike' | 'none' 
    }>) => {
      const { reviewId, interaction } = action.payload;
      
      if (!state.userReviewInteractions[reviewId]) {
        state.userReviewInteractions[reviewId] = { liked: false, disliked: false };
      }
      
      switch (interaction) {
        case 'like':
          state.userReviewInteractions[reviewId].liked = true;
          state.userReviewInteractions[reviewId].disliked = false;
          break;
        case 'dislike':
          state.userReviewInteractions[reviewId].liked = false;
          state.userReviewInteractions[reviewId].disliked = true;
          break;
        case 'none':
          state.userReviewInteractions[reviewId].liked = false;
          state.userReviewInteractions[reviewId].disliked = false;
          break;
      }
    },
    
    // Pagination actions
    setPagination: (state, action: PayloadAction<{ 
      productId: number; 
      currentPage: number; 
      hasMore: boolean;
      totalReviews?: number;
    }>) => {
      const { productId, currentPage, hasMore, totalReviews } = action.payload;
      if (!state.pagination[productId]) {
        state.pagination[productId] = { currentPage: 1, hasMore: true, totalReviews: 0 };
      }
      state.pagination[productId].currentPage = currentPage;
      state.pagination[productId].hasMore = hasMore;
      if (totalReviews !== undefined) {
        state.pagination[productId].totalReviews = totalReviews;
      }
    },
    
    incrementPage: (state, action: PayloadAction<{ productId: number }>) => {
      const { productId } = action.payload;
      if (!state.pagination[productId]) {
        state.pagination[productId] = { currentPage: 1, hasMore: true, totalReviews: 0 };
      }
      state.pagination[productId].currentPage += 1;
    },
    
    resetPagination: (state, action: PayloadAction<{ productId: number }>) => {
      const { productId } = action.payload;
      state.pagination[productId] = { currentPage: 1, hasMore: true, totalReviews: 0 };
    },
    
    // General state actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset all review state
    resetReviewState: () => initialState,
  },
});

export const {
  openReviewForm,
  closeReviewForm,
  updateReviewRating,
  updateReviewComment,
  setReviewSubmitting,
  setReviewInteraction,
  setPagination,
  incrementPage,
  resetPagination,
  setLoading,
  setError,
  clearError,
  resetReviewState,
} = reviewSlice.actions;

export default reviewSlice.reducer;

// Selectors
export const selectReviewForm = (state: { review: ReviewState }) => state.review.reviewForm;
export const selectUserReviewInteractions = (state: { review: ReviewState }) => state.review.userReviewInteractions;
export const selectPagination = (state: { review: ReviewState }, productId: number) => 
  state.review.pagination[productId] || { currentPage: 1, hasMore: true, totalReviews: 0 };
export const selectReviewLoading = (state: { review: ReviewState }) => state.review.loading;
export const selectReviewError = (state: { review: ReviewState }) => state.review.error;