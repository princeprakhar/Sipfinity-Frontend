// components/admin/ProductCard.tsx
import React, { useState } from 'react';
import {  useTheme } from '@/hooks';
import type { Product } from '@/types/product';
import { Edit, ExternalLink, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onSelect,
  onEdit
}) => {
  const { theme } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} overflow-hidden transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <button
          onClick={onSelect}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-blue-600 border-blue-600'
              : theme === 'dark'
              ? 'border-gray-600 hover:border-gray-500'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </button>
      </div>

      {/* Product Images */}
      <div className="relative">
        {/* Main Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.images[currentImageIndex].s3_url}
            alt={`${product.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          
          {/* Navigation Arrows (only show if more than 1 image) */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Navigation (only show if more than 1 image) */}
        {product.images.length > 1 && (
          <div className="flex gap-1 p-2 bg-gray-50 dark:bg-gray-900 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={image.id || index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                  index === currentImageIndex
                    ? 'border-blue-500 ring-1 ring-blue-500'
                    : theme === 'dark'
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img
                  src={image.s3_url}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            product.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.status}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
            {product.title}
          </h3>
          <button
            onClick={onEdit}
            className={`ml-2 p-1 rounded-md ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>

        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3 line-clamp-3`}>
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            ₹{product.price}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
            {product.size}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {product.category}
          </span>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            {new Date(product.updated_at).toLocaleDateString()}
          </span>
        </div>

        {/* Services */}
        {product?.services.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Services:
            </p>
            <div className="flex flex-wrap gap-2">
              {product.services.map((service) => (
                <a
                  key={service.id}
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-2 py-1 text-xs rounded-md ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                >
                  {service.name}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;