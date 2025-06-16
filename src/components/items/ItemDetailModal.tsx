// components/ItemDetailModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  ExternalLink,
  Circle,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Send,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageCircle,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useLikeReviewMutation,
  useFlagReviewMutation,
  useLikeOrDislikeProductMutation,
  useGetProductReactionQuery
} from "@/services/reviewService";
import {
  openReviewForm,
  closeReviewForm,
  updateReviewRating,
  updateReviewComment,
  setReviewSubmitting,
  setReviewInteraction,
  incrementPage,
  resetPagination,
  selectReviewForm,
  selectUserReviewInteractions,
  selectPagination,

} from "@/store/slices/reviewSlice";

interface ItemDetailModalProps {
  product: Product;
  onClose: () => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  product,
  onClose,
}) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  // Redux selectors
  const reviewForm = useSelector(selectReviewForm);
  const userInteractions = useSelector(selectUserReviewInteractions);
  const pagination = useSelector((state: any) =>
    selectPagination(state, product.id)
  );
  const currentUser = useSelector((state: any) => state.auth?.user);

  // Local state for UI
  const [imageFullscreen, setImageFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likeOrDislikeProduct] = useLikeOrDislikeProductMutation();

  const limit = 10; // Reviews per page

  // RTK Query hooks
  const {
    data: reviews = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductReviewsQuery({
    productId: product.id,
    page: pagination.currentPage,
    limit,
  });

  const [createReview] = useCreateReviewMutation();
  const [likeReview] = useLikeReviewMutation();
  const [flagReview] = useFlagReviewMutation();

  // Get active images
  const activeImages = product.images?.filter((img) => img.is_active) || [];

  const { data: reactionData } = useGetProductReactionQuery(
    product.id
  ); // pass the current productId
  const [userProductInteraction, setUserProductInteraction] = useState({
    liked: false,
    disliked: false,
  });

  // Sync data when fetched
  useEffect(() => {
    console.log(reactionData)
    if (reactionData) {
      setUserProductInteraction({
        liked: reactionData.liked,
        disliked: reactionData.disliked,
      });
    }
  }, [reactionData]);

  // Helper function to get current image URL
  const getCurrentImageUrl = (index: number = currentImageIndex) => {
    if (activeImages.length > 0 && activeImages[index]) {
      return activeImages[index].s3_url;
    }
    return "/placeholder-image.jpg";
  };

  // Reset pagination when product changes
  useEffect(() => {
    dispatch(resetPagination({ productId: product.id }));
  }, [product.id, dispatch]);

  // Handle create review
  const handleAddComment = async () => {
    if (
      reviewForm.comment.trim() === "" ||
      reviewForm.rating < 1 ||
      reviewForm.rating > 5
    )
      return;

    try {
      dispatch(setReviewSubmitting(true));

      const reviewData = {
        product_id: product.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      };

      await createReview(reviewData).unwrap();

      // Close form and reset pagination to show new review
      dispatch(closeReviewForm());
      dispatch(resetPagination({ productId: product.id }));
      refetch();
      toast.success("Review Added");
    } catch (error: any) {
      toast.error("Failed to add Review");
    } finally {
      dispatch(setReviewSubmitting(false));
    }
  };

  // Handle like/dislike review
  const handleLikeReview = async (reviewId: number, isLike: boolean) => {
    try {
      const currentInteraction = userInteractions[reviewId];
      let newInteraction: "like" | "dislike" | "none";

      if (isLike) {
        newInteraction = currentInteraction?.liked ? "none" : "like";
      } else {
        newInteraction = currentInteraction?.disliked ? "none" : "dislike";
      }

      // Optimistic update
      dispatch(setReviewInteraction({ reviewId, interaction: newInteraction }));

      // Make API call
      await likeReview({ reviewId, is_like: isLike }).unwrap();

      // Refetch to get updated counts
      refetch();
    } catch (error) {
      // Revert optimistic update on error
      const currentInteraction = userInteractions[reviewId];
      const revertInteraction = currentInteraction?.liked
        ? "like"
        : currentInteraction?.disliked
        ? "dislike"
        : "none";
      dispatch(
        setReviewInteraction({ reviewId, interaction: revertInteraction })
      );
      console.error("Error liking review:", error);
    }
  };

  // Handle product like/dislike (top-right interaction bar)
  const debouncedInteraction = useRef(
    debounce((productId: number, like: boolean, dislike: boolean) => {
      likeOrDislikeProduct({ productId, like, dislike });
    }, 500) // Adjust debounce delay as needed
  ).current;

  const handleProductInteraction = (type: "like" | "dislike") => {
    setUserProductInteraction((prev) => {
      const productId = product.id; // Ensure this is accessible
      let like = prev.liked;
      let dislike = prev.disliked;

      if (type === "like") {
        const newLiked = !prev.liked;
        like = newLiked;
        dislike = newLiked ? false : prev.disliked;
      } else {
        const newDisliked = !prev.disliked;
        dislike = newDisliked;
        like = newDisliked ? false : prev.liked;
      }

      // Trigger the debounced API call
      debouncedInteraction(productId, like, dislike);

      return { liked: like, disliked: dislike };
    });
  };

  // Handle flag review
  const handleFlagReview = async (reviewId: number) => {
    try {
      await flagReview({ reviewId }).unwrap();
      toast.success("Review FLagged");
      refetch();
    } catch (error) {
      toast.error("Error flagging review")
      alert("Failed to flag review");
    }
  };

  // Load more reviews
  const loadMoreReviews = () => {
    if (!isLoading && pagination.hasMore) {
      dispatch(incrementPage({ productId: product.id }));
    }
  };

  const nextImage = () => {
    if (activeImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % activeImages.length);
    }
  };

  const prevImage = () => {
    if (activeImages.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + activeImages.length) % activeImages.length
      );
    }
  };

  // Render star rating
  const renderStars = (
    rating: number,
    interactive: boolean = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${
              interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"
            } transition-transform`}
          >
            <Star
              size={16}
              className={`${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Handle modal backdrop click (prevent closing when clicking inside modal content)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col md:flex-row relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-all duration-200"
          aria-label="Close"
        >
          <X size={20} className="text-white" />
        </button>

        {/* Top-right Interaction Bar */}
        {currentUser && (
          <div className="absolute right-16 top-4 z-20 flex items-center gap-2">
            {/* Like Button */}
            <button
              onClick={() => handleProductInteraction("like")}
              className={`p-2 rounded-full transition-all duration-200 ${
                userProductInteraction.liked
                  ? "bg-green-500 text-white"
                  : "bg-black/20 hover:bg-black/30 text-white hover:text-green-400"
              }`}
              aria-label="Like product"
            >
              <ThumbsUp size={18} />
            </button>

            {/* Dislike Button */}
            <button
              onClick={() => handleProductInteraction("dislike")}
              className={`p-2 rounded-full transition-all duration-200 ${
                userProductInteraction.disliked
                  ? "bg-red-500 text-white"
                  : "bg-black/20 hover:bg-black/30 text-white hover:text-red-400"
              }`}
              aria-label="Dislike product"
            >
              <ThumbsDown size={18} />
            </button>

            {/* Comment Button */}
            <button
              onClick={() =>
                dispatch(openReviewForm({ productId: product.id }))
              }
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white hover:text-blue-400 transition-all duration-200"
              aria-label="Add comment"
            >
              <MessageCircle size={18} />
            </button>
          </div>
        )}

        {/* Left side - Image */}
        <div className="relative md:w-1/2 h-64 md:h-auto bg-gray-100 dark:bg-gray-700">
          <img
            src={getCurrentImageUrl()}
            alt={product.title}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={(e) => {
              e.stopPropagation();
              setImageFullscreen(true);
            }}
          />

          {/* Image navigation */}
          {activeImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>

              {/* Image dots indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {activeImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Zoom icon */}
          <button
            className="absolute top-4 left-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setImageFullscreen(true);
            }}
            aria-label="View fullscreen"
          >
            <ZoomIn size={16} />
          </button>

          {/* Price tag */}
          <div className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold">
            ₹{product.price.toFixed(2)}
          </div>
        </div>

        {/* Right side - Content */}
        <div className="md:w-1/2 p-6 overflow-y-auto">
          {/* Title and Status */}
          <div className="mb-4 pt-8 md:pt-0">
            <h2
              className={`text-2xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {product.title}
            </h2>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                product.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
              }`}
            >
              {product.status}
            </span>
          </div>

          {/* Product Info Tags */}
          <div className="flex flex-wrap gap-2 mb-4 text-sm">
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
              {product.category}
            </span>
            {/* {product.size && (
              <span className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200 px-3 py-1 rounded-full">
                Size: {product.size}
              </span>
            )} */}
            {product.material && (
              <span className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200 px-3 py-1 rounded-full">
                {product.material}
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full ${
                product.stock > 0
                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Available Services */}
          {product.services && product.services.length > 0 && (
            <div className="mb-4">
              <h4
                className={`font-medium mb-2 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Available on:
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.services.map((service, index) => (
                  <a
                    key={index}
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-3 py-1 rounded-lg text-sm hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors"
                  >
                    {service.name}
                    <ExternalLink size={12} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h4
              className={`font-medium mb-3 ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Product Details
            </h4>
            <div
              className={`text-sm leading-relaxed ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {product.description.split("\n").map((point, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <Circle
                    size={4}
                    className="mt-2 fill-current flex-shrink-0"
                  />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center mb-3">
              <h4
                className={`font-medium ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Reviews ({reviews.length})
              </h4>
              {currentUser && (
                <button
                  onClick={() =>
                    dispatch(openReviewForm({ productId: product.id }))
                  }
                  className="text-xs px-3 py-1 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                >
                  Add Review
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {reviews.map((review) => {
                const userInteraction = userInteractions[review.id];

                return (
                  <div
                    key={review.id}
                    className={`p-3 rounded-lg ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`font-medium text-sm ${
                              theme === "dark"
                                ? "text-gray-200"
                                : "text-gray-700"
                            }`}
                          >
                            {review.user_name}
                          </span>
                          {renderStars(review.rating)}
                        </div>
                        <p
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {new Date(review.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      {/* Flag button */}
                      {currentUser && currentUser.id !== review.user_id && (
                        <button
                          onClick={() => handleFlagReview(review.id)}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="Flag review"
                        >
                          <Flag size={12} className="text-gray-400" />
                        </button>
                      )}
                    </div>

                    <p
                      className={`text-sm mb-2 ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {review.comment}
                    </p>

                    {/* Like/Dislike buttons */}
                    {currentUser && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLikeReview(review.id, true)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                            userInteraction?.liked
                              ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          <ThumbsUp size={12} />
                          {review.like_count}
                        </button>

                        <button
                          onClick={() => handleLikeReview(review.id, false)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                            userInteraction?.disliked
                              ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          <ThumbsDown size={12} />
                          {review.dislike_count}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Load more reviews button */}
              {pagination.hasMore && (
                <button
                  onClick={loadMoreReviews}
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-lg text-sm transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Loading..." : "Load More Reviews"}
                </button>
              )}

              {/* Empty state */}
              {reviews.length === 0 && !isLoading && (
                <p
                  className={`text-center py-4 text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No reviews yet. Be the first to review this product!
                </p>
              )}

              {/* Error state */}
              {isError && (
                <p className={`text-center py-4 text-sm text-red-500`}>
                  Failed to load reviews. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {reviewForm.isOpen && reviewForm.productId === product.id && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60 backdrop-blur-sm"
          onClick={(e) => {
            // Only close if clicking the backdrop, not the modal content
            if (e.target === e.currentTarget) {
              dispatch(closeReviewForm());
            }
          }}
        >
          <div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-xl max-w-md w-full p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Add Review
              </h3>
              <button
                onClick={() => dispatch(closeReviewForm())}
                className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
              >
                <X
                  size={20}
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }
                />
              </button>
            </div>

            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Rating
                </label>
                {renderStars(reviewForm.rating, true, (rating) =>
                  dispatch(updateReviewRating(rating))
                )}
              </div>

              {/* Comment */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    dispatch(updateReviewComment(e.target.value))
                  }
                  placeholder="Share your experience with this product..."
                  className={`w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  rows={4}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                />
              </div>

              {/* Submit button */}
              <div className="flex gap-3">
                <button
                  onClick={() => dispatch(closeReviewForm())}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={
                    reviewForm.isSubmitting ||
                    reviewForm.comment.trim() === "" ||
                    reviewForm.rating < 1
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                    reviewForm.isSubmitting ||
                    reviewForm.comment.trim() === "" ||
                    reviewForm.rating < 1
                      ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {reviewForm.isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {imageFullscreen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-70 backdrop-blur-sm"
          onClick={() => setImageFullscreen(false)}
        >
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setImageFullscreen(false)}
              className="absolute right-4 top-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
              aria-label="Close fullscreen"
            >
              <X size={24} />
            </button>

            <img
              src={getCurrentImageUrl()}
              alt={product.title}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navigation in fullscreen */}
            {activeImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                  {currentImageIndex + 1} / {activeImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailModal;
