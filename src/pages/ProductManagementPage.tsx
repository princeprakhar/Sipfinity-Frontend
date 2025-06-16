// // components/admin/ProductManagement.tsx
// import React, { useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector, useTheme } from '@/hooks';
// import { 
//   fetchProducts, 
//   setFilters, 
//   setCurrentPage, 
//   clearSelection,
// } from '@/store/slices/productSlice';
// import type{ Product } from '@/types/product';
// // import ProductHeader from '@/components/admin/ProductHeader';
// // import ProductStats from '@/components/admin/ProductStats';
// // import ProductFilters from '@/components/admin/ProductFilters';
// // import ProductGrid from '@/components/admin/ProductGrid';
// // import ProductModal from '@/components/admin/ProductModal';
// // import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
// import BulkActionsBar from '@/components/admin/BulkActionBar';
// import Pagination from '@/components/ui/Pagination';
// import {LoadingSpinner} from '@/components/ui/LoadsSpinner';
// // import { Plus, Download, Upload } from 'lucide-react';

// const ProductManagement: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { 
//     products, 
//     loading, 
//     error, 
//     filters, 
//     selectedProducts, 
//     currentPage, 
//     totalPages 
//   } = useAppSelector(state => state.products);
//   const { theme } = useTheme();

//   // const [isModalOpen, setIsModalOpen] = useState(false);
//   // const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   // const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     dispatch(fetchProducts({ page: currentPage, filters }));
//   }, [dispatch, currentPage, filters]);

//   const handleAddProduct = () => {
//     setEditingProduct(null);
//     setIsModalOpen(true);
//   };

//   const handleEditProduct = (product: Product) => {
//     setEditingProduct(product);
//     setIsModalOpen(true);
//   };

//   const handleDeleteSelected = () => {
//     setIsDeleteModalOpen(true);
//   };

//   // const confirmDelete = async () => {
//   //   // await dispatch(deleteProducts(selectedProducts));
//   //   setIsDeleteModalOpen(false);
//   //   dispatch(fetchProducts({ page: currentPage, filters }));
//   // };

//   const handleExportProducts = () => {
//     const dataStr = JSON.stringify(products, null, 2);
//     const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
//     const exportFileDefaultName = `products_${new Date().toISOString().split('T')[0]}.json`;
    
//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', dataUri);
//     linkElement.setAttribute('download', exportFileDefaultName);
//     linkElement.click();
//   };

//   const handlePageChange = (page: number) => {
//     dispatch(setCurrentPage(page));
//   };

//   return (
//     <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <ProductHeader 
//           onAddProduct={handleAddProduct}
//           onExport={handleExportProducts}
//           onToggleFilters={() => setShowFilters(!showFilters)}
//         />

//         {/* Stats */}
//         <ProductStats />

//         {/* Filters */}
//         {showFilters && (
//           <ProductFilters 
//             filters={filters}
//             onFiltersChange={(newFilter) => dispatch(setFilters(newFilter))}
//           />
//         )}

//         {/* Bulk Actions */}
//         {selectedProducts.length > 0 && (
//           <BulkActionsBar 
//             selectedCount={selectedProducts.length}
//             onDelete={handleDeleteSelected}
//             onClearSelection={() => dispatch(clearSelection())}
//           />
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
//             {error}
//           </div>
//         )}

//         {/* Loading State */}
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <LoadingSpinner />
//           </div>
//         ) : (
//           <>
//             {/* Product Grid */}
//             <ProductGrid 
//               products={products}
//               onEditProduct={handleEditProduct}
//             />

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="mt-8">
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   onPageChange={handlePageChange}
//                 />
//               </div>
//             )}
//           </>
//         )}

//         {/* Modals */}
//         {/* <ProductModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           product={editingProduct}
//           onSave={() => {
//             setIsModalOpen(false);
//             dispatch(fetchProducts({ page: currentPage, filters }));
//           }}
//         /> */}

//         {/* <DeleteConfirmModal
//           isOpen={isDeleteModalOpen}
//           onClose={() => setIsDeleteModalOpen(false)}
//           onConfirm={confirmDelete}
//           itemCount={selectedProducts.length}
//         /> */}
//       </div>
//     </div>
//   );
// };

// export default ProductManagement;