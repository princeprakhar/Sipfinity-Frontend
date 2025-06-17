// components/items/ItemCard.tsx
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { type Product } from '@/types/product';
import { useAppSelector } from '../../hooks';

interface ItemCardProps {
  product: Product;
  className?: string;
  onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ product, className, onClick }) => {
  const { theme } = useAppSelector((state) => state.theme);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all active images
  const activeImages = product.images?.filter(img => img.is_active) || [];
  // console.log('Total images:', product.images?.length, 'Active images:', activeImages.length);
  const hasMultipleImages = activeImages.length > 1;

  // Reset currentImageIndex if it's out of bounds
  React.useEffect(() => {
    if (currentImageIndex >= activeImages.length) {
      setCurrentImageIndex(0);
    }
  }, [activeImages.length, currentImageIndex]);

  // Navigation functions
  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === activeImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? activeImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  // Get current image URL with fallback
  const getCurrentImageUrl = () => {
    if (activeImages.length > 0 && currentImageIndex < activeImages.length && activeImages[currentImageIndex]) {
      return activeImages[currentImageIndex].s3_url;
    }
    // Fallback to first image if index is out of bounds
    if (activeImages.length > 0) {
      return activeImages[0].s3_url;
    }
    return '/placeholder-image.jpg';
  };

  return (
    <div 
      className={`${className} rounded-xl ${
        theme === 'dark' 
          ? 'bg-gray-800 hover:shadow-gray-700' 
          : 'bg-white hover:shadow-md'
      } overflow-hidden shadow-sm transition-all duration-300 cursor-pointer group relative`}
      onClick={onClick}
    >
      <div className="h-full flex flex-col">
        <div className="flex-grow overflow-hidden hover:opacity-90 relative">
          {/* Main Image */}
          <img 
            src={getCurrentImageUrl()} 
            alt={`${product.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
            loading="lazy"
          />

          {/* Navigation Arrows - Only show if multiple images */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              
              <button
                onClick={goToNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
                aria-label="Next image"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Image dots indicator */}
          {hasMultipleImages && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {activeImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-white'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Always visible price tag that changes color on hover */}
          <div className="absolute bottom-2 right-2">
            <span className={`px-3 py-1 rounded-lg text-white text-sm font-medium transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-indigo-700 group-hover:bg-indigo-500' 
                : 'bg-indigo-600 group-hover:bg-indigo-500'
            }`}>
              ₹{product.price.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="p-3">
          <h3 className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          } line-clamp-2`}>
            {product.title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;