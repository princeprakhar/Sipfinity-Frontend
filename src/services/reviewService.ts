import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import api, { handleApiError } from "./api";
import { API_ENDPOINTS } from "@/config/api";
import type {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import type { LikeProductRequest } from "@/types/product";
import type { QueryReturnValue } from "@reduxjs/toolkit/query";

export interface BackendReview {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
  like_count: number;
  dislike_count: number;
}

export interface CreateReviewRequest {
  product_id: number;
  rating: number;
  comment: string;
}

export interface LikeReviewRequest {
  reviewId: number;
  is_like: boolean;
}

export interface GetReviewsParams {
  productId: number;
  page: number;
  limit: number;
}

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getProductReviews: builder.query<BackendReview[], GetReviewsParams>({
      queryFn: async ({
        productId,
        page,
        limit,
      }): Promise<
        QueryReturnValue<
          BackendReview[],
          FetchBaseQueryError,
          FetchBaseQueryMeta
        >
      > => {
        try {
          const response = await api.get(
            API_ENDPOINTS.REVIEWS.PRODUCT(productId),
            {
              params: { page, limit },
            }
          );

          console.log("Reviews API Response:", response.data);

          return { data: response.data.data || [] }; // ✅ FIXED HERE
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: handleApiError(error),
            },
          };
        }
      },
      providesTags: (result, _, { productId }) => {
        const tags: { type: "Review"; id: string | number }[] = [
          { type: "Review" as const, id: `product-${productId}` },
        ];
        if (Array.isArray(result)) {
          tags.push(
            ...result.map(({ id }) => ({ type: "Review" as const, id }))
          );
        }
        return tags;
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { productId } = queryArgs;
        return { productId };
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return [...currentCache, ...newItems];
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    createReview: builder.mutation<BackendReview, CreateReviewRequest>({
      queryFn: async (reviewData) => {
        try {
          const response = await api.post(
            API_ENDPOINTS.REVIEWS.CREATE,
            reviewData
          );
          console.log(response.data);
          return { data: response.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: handleApiError(error),
            },
          };
        }
      },
      invalidatesTags: (result, error, { product_id }) => [
        { type: "Review", id: `product-${product_id}` },
      ],
    }),

    likeReview: builder.mutation<void, LikeReviewRequest>({
      queryFn: async ({ reviewId, is_like }) => {
        try {
          const response = await api.post(
            API_ENDPOINTS.REVIEWS.LIKE(reviewId),
            { is_like }
          );
          console.log("Like response:", response.data);
          return { data: undefined };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: handleApiError(error),
            },
          };
        }
      },
    }),

    flagReview: builder.mutation<void, { reviewId: number }>({
      queryFn: async ({ reviewId }) => {
        try {
          await api.post(API_ENDPOINTS.REVIEWS.FLAG(reviewId));
          return { data: undefined };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: handleApiError(error),
            },
          };
        }
      },
      invalidatesTags: (result, error, { reviewId }) => [
        { type: "Review", id: reviewId },
      ],
    }),

    likeOrDislikeProduct: builder.mutation<void, LikeProductRequest>({
      queryFn: async ({ productId, like, dislike }) => {
        try {
          console.log(like,dislike);
          const response = await api.post(
            API_ENDPOINTS.PRODUCTS.REACT(productId),
            { like, dislike }
          );
          console.log("Reaction response:", response.data);
          return { data: undefined };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: handleApiError(error),
            },
          };
        }
      },
    }),
    getProductReaction: builder.query<{ liked: boolean; disliked: boolean }, number>({
      queryFn: async (productId) => {
        try {
          const response = await api.get(`${API_ENDPOINTS.PRODUCTS.REACT(productId)}`);
          console.log("Backend Reaction Data",response.data);
          return { data: response.data.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || 'Something went wrong',
            },
          };
        }
      },
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useLikeReviewMutation,
  useFlagReviewMutation,
  useLikeOrDislikeProductMutation,
  useGetProductReactionQuery
} = reviewApi;
