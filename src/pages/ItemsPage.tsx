// pages/ItemsPage.tsx
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { 
  fetchProducts, 
  fetchCategories, 
  setFilters, 
  setCurrentPage,
  clearError 
} from '@/store/slices/productSlice';
import FilterTabs from '../components/items/FilterTabs';
import MasonryGrid from '../components/items/MasonryGrid';
import ItemDetailModal from '../components/items/ItemDetailModal';
import AdminBanner from '../components/items/AdminBanner';
import {LoadingSpinner} from '../components/ui/LoadsSpinner';
import { type Product } from '../types/product';

interface CategoryResponse {
  data: string[];
}

interface ProductResponse {
  products: Product[];
  pages: number;
}

const ItemsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);
  const { 
    products, 
    categories, 
    loading, 
    error, 
    filters, 
    currentPage, 
    totalPages 
  } = useAppSelector((state) => state.products);

  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Debug logs - only when values actually change
  useEffect(() => {
    console.log("Products:", products);
  }, [products]);

  useEffect(() => {
    console.log("currentPage:", currentPage);
  }, [currentPage]);

  useEffect(() => {
    console.log("totalPages:", totalPages);
  }, [totalPages]);

  // Initial fetch - only run once on component mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ page: 1, filters }));
    setIsInitialLoad(false);
  }, [dispatch]); // Only dispatch as dependency

  // Fetch products when filters or page changes (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      dispatch(fetchProducts({ page: currentPage, filters }));
    }
  }, [dispatch, currentPage, filters, isInitialLoad]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleCategorySelect = (category: string | null) => {
    dispatch(setFilters({ category: category || '' }));
    dispatch(setCurrentPage(1)); // Reset to first page when filter changes
  };

  const handleItemClick = (item: Product) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const categoriesData = Array.isArray(categories)  
    ? categories 
    : (categories as CategoryResponse)?.data || [];

  // Extract products data from API response
  const productsData = Array.isArray(products) 
    ? products 
    : (products as ProductResponse)?.products || [];


  // Extract total pages from API response
  const totalPagesCount = (Array.isArray(products) ? totalPages : (products as ProductResponse).pages) || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    } transition-colors duration-200`}>
      
      {/* Admin Banner - only shows if user is admin */}
      <AdminBanner />
      
      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="text-red-500 text-center py-2">
            {error}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <FilterTabs 
        categories={categoriesData}
        selectedCategory={filters.category}
        onSelectCategory={handleCategorySelect}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Items Grid */}
      <main className="max-w-7xl mx-auto pb-8">
        {!loading && productsData.length > 0 && (
          <MasonryGrid 
            items={productsData}
            onItemClick={handleItemClick}
          />
        )}
        
        {/* Empty State */}
        {!loading && productsData.length === 0 && (
          <div className="text-center py-12">
            <div className={`text-6xl mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
              🔍
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              No products found
            </h3>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </main>

      {/* Pagination */}
      {!loading && productsData.length > 0 && totalPagesCount > 1 && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Previous
            </button>
            
            {[...Array(totalPagesCount)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPagesCount}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPagesCount
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          product={selectedItem}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ItemsPage;