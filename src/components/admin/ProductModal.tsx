// components/admin/ProductModal.tsx
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAppDispatch, useAppSelector, useTheme } from '@/hooks';
import { addProduct, updateProduct } from '@/store/slices/adminSlice';
import type { Product, ProductService } from '@/types/product';
import Modal2 from '@/components/ui/Modal';
import FileUpload from '@/components/ui/FileUpload';
import { X, Plus, Link as LinkIcon } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: () => void;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  price: number;
  images: File[];
  services: ProductService[];
  size: string;
  stock: string;
  status: 'active' | 'inactive';
  material: string;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave
}) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector(state => state.products);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: 0,
      images: [],
      services: [],
      size: 'medium',
      stock: 'in-stock',
      status: 'active',
      material: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services'
  });

  const sizes = ['small', 'medium', 'large', 'extra-large'];
  const stockOptions = ['in-stock', 'out-of-stock', 'low-stock'];

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        images: product.images || [],
        services: product.services || [],
        size: product.size,
        stock: product.stock,
        status: product.status,
        material: product.material || ''
      });
    } else {
      reset({
        title: '',
        description: '',
        category: '',
        price: 0,
        images: [],
        services: [],
        size: 'medium',
        stock: 'in-stock',
        status: 'active',
        material: ''
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (product) {
        const updatedProduct: Product = {
          ...product,
          ...data,
          updatedAt: new Date().toISOString()
        };
        await dispatch(updateProduct(updatedProduct)).unwrap();
      } else {
        const newProduct: Product = {
          ...data,
          id: Date.now(), // Changed from string to number
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await dispatch(addProduct(newProduct)).unwrap();
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addService = () => {
    append({ name: '', link: '' }); // Removed id as it's not in ProductService interface
  };

  const handleImageUpload = (files: File[]) => {
    setValue('images', files);
  };

  return (
    <Modal2 isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add New Product'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Product Title *
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : ''
              }`}
              placeholder="Enter product title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Price *
            </label>
            <input
              {...register('price', { 
                required: 'Price is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Price must be positive' }
              })}
              type="number"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.price ? 'border-red-500' : ''
              }`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>
        </div>

        {/* Category, Size, Stock, and Material */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Category *
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.category ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((category: string) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Size *
            </label>
            <select
              {...register('size', { required: 'Size is required' })}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Stock *
            </label>
            <select
              {...register('stock', { required: 'Stock status is required' })}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              {stockOptions.map((stock) => (
                <option key={stock} value={stock}>
                  {stock.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Status *
            </label>
            <select
              {...register('status')}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Material */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Material
          </label>
          <input
            {...register('material')}
            type="text"
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="e.g., Cotton, Polyester, Wood, Metal, etc."
          />
        </div>

        {/* Description */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Description *
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : ''
            }`}
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Product Images
          </label>
          <FileUpload
            onFilesSelected={handleImageUpload}
            accept="image/*"
            maxFiles={5} // Allow multiple images
            currentFiles={watch('images').map(file => URL.createObjectURL(file))}
          />
        </div>

        {/* Services */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Services
            </label>
            <button
              type="button"
              onClick={addService}
              className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Service
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    {...register(`services.${index}.name`, { required: 'Service name is required' })}
                    type="text"
                    placeholder="Service name"
                    className={`w-full px-3 py-2 border rounded-md text-sm ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {errors.services?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.services[index]?.name?.message}</p>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    {...register(`services.${index}.link`, { 
                      required: 'Service link is required',
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Please enter a valid URL'
                      }
                    })}
                    type="url"
                    placeholder="https://example.com"
                    className={`w-full px-3 py-2 border rounded-md text-sm ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {errors.services?.[index]?.link && (
                    <p className="mt-1 text-sm text-red-600">{errors.services[index]?.link?.message}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className={`p-2 rounded-md ${theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </Modal2>
  );
};

export default ProductModal;