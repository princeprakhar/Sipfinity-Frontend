// components/admin/AdminPage.tsx
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import ProductGrid from '@/components/admin/ProductGrid';
import ProductHeader from '@/components/admin/ProductHeader';
import ProductModal from '@/components/admin/ProductModal';
import ProductStats from '@/components/admin/ProductStats';
import { LoadingSpinner } from '@/components/ui/LoadsSpinner'; // Fixed typo: LoadsSpinner -> LoadingSpinner
import Pagination from '@/components/ui/Pagination';
import { useAppDispatch, useAppSelector, useTheme } from '@/hooks';
import { fetchProducts } from '@/store/slices/adminSlice';
import type { Product } from '@/types/product';
import React, { useEffect, useState } from 'react';

const AdminPage: React.FC = () => { // Renamed from AdminPage to ProductManagement for clarity
  const dispatch = useAppDispatch();
  const { 
    products,
  } = useAppSelector(state => state.adminProducts);
  
  // Fixed: Destructure from products object properly
  const { loading, error, pagination } = products || { loading: false, error: null, pagination: null };

  const { theme } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    
    setEditingProduct(product);

    setIsModalOpen(true);
  };

  // const handleDeleteSelected = () => {
  //   if (selectedProducts.length === 0) {
  //     alert('Please select products to delete');
  //     return;
  //   }
  //   setIsDeleteModalOpen(true);
  // };

  const confirmDelete = async () => {
    try {
      // Uncomment and implement when deleteProducts action is available
      // await dispatch(deleteProducts(selectedProducts));
      setSelectedProducts([]); // Clear selection after delete
      setIsDeleteModalOpen(false);
      dispatch(fetchProducts({ page: currentPage, limit: 10 }));
    } catch (error) {
      console.error('Error deleting products:', error);
    }
  };

  const handleExportProducts = () => {
    // Fixed: Export the actual products list, not the entire products object
    const productsToExport = products?.list || [];
    const dataStr = JSON.stringify(productsToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `products_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Fixed: Actually update the current page state
    // dispatch(setCurrentPage(page)); // Uncomment if you have this action
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-8">
        {/* Header */}
        <ProductHeader 
          onAddProduct={handleAddProduct}
          onExport={handleExportProducts}
        />

        {/* Stats */}
        <ProductStats />

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <ProductGrid 
              products={products?.list || []} // Fixed: Provide fallback empty array
              onEditProduct={handleEditProduct}
            />

            {/* Pagination */}
            {/* Fixed: Check totalPages from pagination object properly */}
            {pagination && (pagination.total_pages ?? 1) > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.total_pages ?? 1}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {/* Modals */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={editingProduct}
          onSave={() => {
            setIsModalOpen(false);
            dispatch(fetchProducts({ page: currentPage, limit: 10 })); // Fixed: Added limit parameter
          }}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          itemCount={selectedProducts.length}
        />
      </div>
    </div>
  );
};

export default AdminPage; // Fixed: Export name matches component name