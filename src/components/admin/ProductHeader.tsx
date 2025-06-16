// components/admin/ProductHeader.tsx
import React from 'react';
import {  useTheme } from '@/hooks';
import { Plus, Download,  Filter } from 'lucide-react';

interface ProductHeaderProps {
  onAddProduct: () => void;
  onExport: () => void;
  onToggleFilters: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  onAddProduct,
  onExport,
  onToggleFilters
}) => {
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-6 mb-6`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Product Management
          </h1>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your product catalog, inventory, and pricing
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onToggleFilters}
            className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium transition-colors
              ${theme === 'dark' 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          
          <button
            onClick={onExport}
            className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium transition-colors
              ${theme === 'dark' 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          
          <button
            onClick={onAddProduct}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;