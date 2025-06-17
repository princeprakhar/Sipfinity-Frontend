// components/admin/ProductModal.tsx
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAppDispatch, useAppSelector, useTheme } from '@/hooks';
import { createProduct, updateProduct, deleteProduct } from '@/store/slices/adminSlice';
import type { CreateProductRequest, UpdateProductRequest } from '@/types/product';
import Modal2 from '@/components/ui/Modal';
import FileUpload from '@/components/ui/FileUpload';
import { X, Plus, Save, Loader2, Link, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { fetchCategories } from '@/store/slices/productSlice';
import type { Product } from '@/types/product';
import { toast } from 'react-toastify';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: () => void;
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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [showAllS3Images, setShowAllS3Images] = useState(false);

  // Store all existing S3 URLs from the product
  const [existingS3Images, setExistingS3Images] = useState<Array<{url: string, id?: string}>>([]);
  const [s3ImageUrl, setS3ImageUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateProductRequest>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: 0,
      images: [],
      services: [],
      size: 'medium',
      stock: 0,
      status: 'active',
      material: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services'
  });

  const sizes = ['small', 'medium', 'large', 'extra-large'];
  const isEditMode = !!product;

  useEffect(() => {
    if (product) {
      // Extract all S3 URLs from existing images
      const productImages = product.images || [];
      const s3Images = productImages
        .filter(img => img?.s3_url)
        .map(img => ({
          url: img.s3_url,
          id: img.id || img.id
        }));
      
      setExistingS3Images(s3Images);
      
      const firstS3Url = s3Images.length > 0 ? s3Images[0].url : '';

      reset({
        title: product.title || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price || 0,
        images: [], // Reset images for editing
        services: product.services || [],
        size: product.size || 'medium',
        stock: product.stock || 0,
        status: product.status || 'active',
        material: product.material || ''
      });
      
      setCategoryInput(product.category || '');
      setS3ImageUrl(firstS3Url);
    } else {
      // Reset everything for new product
      reset({
        title: '',
        description: '',
        category: '',
        price: 0,
        images: [],
        services: [],
        size: 'medium',
        stock: 0,
        status: 'active',
        material: ''
      });
      setCategoryInput('');
      setS3ImageUrl('');
      setExistingS3Images([]);
    }
    dispatch(fetchCategories());
  }, [product, reset, dispatch]);

  // Filter categories based on input
  useEffect(() => {
    if (categoryInput && Array.isArray(categories)) {
      const filtered = categories.filter((category: string) =>
        category.toLowerCase().includes(categoryInput.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(Array.isArray(categories) ? categories : []);
    }
  }, [categoryInput, categories]);

  const onSubmit = async (data: CreateProductRequest) => {
    setLoading(true);
    try {
      if (product) {
        const productId = (product as any)?.id ?? (product as any)?._id ?? '';
        
        const updatedProduct: UpdateProductRequest = {
          ...data,
          images: data.images,
          ...(s3ImageUrl && validateS3Url(s3ImageUrl) && { s3ImageUrl })
        };

        await dispatch(updateProduct({
          productId,
          productData: updatedProduct,
          images: data.images,
        })).unwrap();
        toast.success('Product updated successfully!');
      } else {
        const newProduct: CreateProductRequest = {
          ...data,
          stock: Number(data.stock),
        };
        await dispatch(createProduct({ 
          productData: newProduct, 
          images: data.images 
        })).unwrap();
      }
      onSave();
      onClose();
      toast.success('Product saved successfully!');
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    
    setDeleteLoading(true);
    try {
      const productId = (product as any)?.id ?? (product as any)?._id ?? '';
      await dispatch(deleteProduct(productId)).unwrap();
      onSave();
      onClose();
      setShowDeleteConfirm(false);
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete product. Please try again.');
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const addService = () => {
    append({ name: '', link: '' });
  };

  const handleImageUpload = (files: File[]) => {
    setValue('images', files);
  };

  const handleCategoryInputChange = (value: string) => {
    setCategoryInput(value);
    setValue('category', value);
    setShowSuggestions(true);
  };

  const handleCategorySelect = (category: string) => {
    setCategoryInput(category);
    setValue('category', category);
    setShowSuggestions(false);
  };

  const handleCategoryFocus = () => {
    setShowSuggestions(true);
  };

  const handleCategoryBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const validateS3Url = (url: string): boolean => {
    if (!url) return true;
    try {
      const urlObj = new URL(url);
      const s3Patterns = [
        /.*\.s3.*\.amazonaws\.com/,
        /s3.*\.amazonaws\.com/,
        /.*\.s3\..*\.amazonaws\.com/
      ];
      return s3Patterns.some(pattern => pattern.test(urlObj.hostname));
    } catch {
      return false;
    }
  };

  const handleS3UrlChange = (value: string) => {
    setS3ImageUrl(value);
  };

  // Delete Confirmation Modal
  const DeleteConfirmModal = () => {
    if (!showDeleteConfirm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full mx-4`}>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Delete Product
            </h3>
          </div>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Are you sure you want to delete "{product?.title}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProduct}
              disabled={deleteLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Product
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal2 
        isOpen={isOpen} 
        onClose={onClose} 
        title={
          <div className="flex items-center justify-between w-full">
            <span>{product ? 'Edit Product' : 'Add New Product'}</span>
            {isEditMode && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete Product"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        }
        className="max-w-xl w-full"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-1">
            {/* Basic Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Basic Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Product Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
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
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
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
            </div>

            {/* Category, Size, Stock, and Material */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category *
                  </label>
                  <div className="relative">
                    <input
                      {...register('category', { required: 'Category is required' })}
                      type="text"
                      value={categoryInput}
                      onChange={(e) => handleCategoryInputChange(e.target.value)}
                      onFocus={handleCategoryFocus}
                      onBlur={handleCategoryBlur}
                      className={`w-full px-4 py-3 border rounded-lg text-sm ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.category ? 'border-red-500' : ''
                      }`}
                      placeholder="Type to search or enter new category..."
                    />
                    
                    {/* Category Suggestions Dropdown */}
                    {showSuggestions && (categoryInput.length > 0 || filteredCategories.length > 0) && (
                      <div className={`absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-lg border shadow-lg ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}>
                        {filteredCategories.length > 0 ? (
                          <>
                            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                              Existing Categories
                            </div>
                            {filteredCategories.map((category, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleCategorySelect(category)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                } ${category.toLowerCase() === categoryInput.toLowerCase() ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                              >
                                {category}
                              </button>
                            ))}
                          </>
                        ) : null}
                        
                        {categoryInput && 
                        !filteredCategories.some(cat => cat.toLowerCase() === categoryInput.toLowerCase()) && (
                          <>
                            {filteredCategories.length > 0 && (
                              <div className="border-t border-gray-200 dark:border-gray-600"></div>
                            )}
                            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Create New Category
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCategorySelect(categoryInput)}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 ${
                                theme === 'dark' ? 'text-green-400' : 'text-green-600'
                              } flex items-center gap-2`}
                            >
                              <Plus className="w-3 h-3" />
                              Create "{categoryInput}"
                            </button>
                          </>
                        )}
                        
                        {!categoryInput && filteredCategories.length > 0 && (
                          <>
                            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                              All Categories
                            </div>
                            {filteredCategories.map((category, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleCategorySelect(category)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
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
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    {sizes.map((size) => (
                      <option key={size} value={size}>
                        {size.charAt(0).toUpperCase() + size.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Stock *
                  </label>
                  <input
                    {...register('stock', { 
                      valueAsNumber: true,
                      min: { value: 0, message: 'Stock must be positive' }
                    })}
                    type="number"
                    step="1"
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.stock ? 'border-red-500' : ''
                    }`}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status *
                  </label>
                  <select
                    {...register('status')}
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
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

              <div className="mt-6">
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Material
                </label>
                <input
                  {...register('material')}
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g., Cotton, Polyester, Wood, Metal, etc."
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 mx-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : ''
                }`}
                placeholder="Enter detailed product description..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <label className={`block text-sm font-medium mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Product Images
              </label>
              <FileUpload
                onFilesSelected={handleImageUpload}
                accept="image/*"
                maxFiles={5}
                currentFiles={(watch('images') ?? []).map(file => URL.createObjectURL(file))}
              />

              {/* Existing S3 Images - Show all images in edit mode */}
              {isEditMode && existingS3Images.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Link className="w-4 h-4 text-blue-500" />
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Existing S3 Images ({existingS3Images.length})
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAllS3Images(!showAllS3Images)}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {showAllS3Images ? 'Hide' : 'View All'}
                    </button>
                  </div>

                  {/* Current/Primary S3 Image Input */}
                  <div className="mb-4">
                    <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2 block`}>
                      Primary S3 Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={s3ImageUrl}
                      onChange={(e) => handleS3UrlChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg text-sm ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        s3ImageUrl && !validateS3Url(s3ImageUrl) ? 'border-red-500' : ''
                      }`}
                      placeholder="https://your-bucket.s3.amazonaws.com/image.jpg"
                    />
                    {s3ImageUrl && !validateS3Url(s3ImageUrl) && (
                      <p className="mt-1 text-sm text-red-600">Please enter a valid S3 URL</p>
                    )}
                  </div>

                  {/* Primary Image Preview */}
                  {s3ImageUrl && validateS3Url(s3ImageUrl) && (
                    <div className="mb-4">
                      <p className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Primary Image Preview:
                      </p>
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                        <img
                          src={s3ImageUrl}
                          alt="Primary S3 Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Failed to load S3 image');
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* All S3 Images Display */}
                  {showAllS3Images && (
                    <div className="space-y-3">
                      <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        All S3 Images:
                      </p>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {existingS3Images.map((image, index) => (
                          <div key={index} className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-start gap-3">
                              <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 flex-shrink-0">
                                <img
                                  src={image.url}
                                  alt={`S3 Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.error('Failed to load S3 image');
                                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTI4IDI4TDM2IDM2TDQ0IDI4IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                                    }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  Image {index + 1}
                                </p>
                                <p className={`text-xs break-all ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {image.url}
                                </p>
                                {image.id && (
                                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    ID: {image.id}
                                  </p>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => setS3ImageUrl(image.url)}
                                className={`px-2 py-1 text-xs rounded ${
                                  s3ImageUrl === image.url
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                                } transition-colors`}
                                title={s3ImageUrl === image.url ? 'Currently selected as primary' : 'Set as primary image'}
                              >
                                {s3ImageUrl === image.url ? 'Primary' : 'Use'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    These are existing images stored in S3. You can select one as the primary image or add new images above.
                  </p>
                </div>
              )}
            </div>

            {/* Services */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Services & Links
                </h3>
                <button
                  type="button"
                  onClick={addService}
                  className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </button>
              </div>

              <div className="space-y-4">
                {fields.length === 0 && (
                  <p className="text-gray-500 text-sm italic text-center py-8">
                    No services added yet. Click "Add Service" to get started.
                  </p>
                )}
                
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                        Service Name *
                      </label>
                      <input
                        {...register(`services.${index}.name`, { required: 'Service name is required' })}
                        type="text"
                        placeholder="e.g., Installation, Warranty, Support"
                        className={`w-full px-3 py-2 border rounded-md text-sm ${
                          theme === 'dark'
                            ? 'bg-gray-600 border-gray-500 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                      {errors.services?.[index]?.name && (
                        <p className="mt-1 text-xs text-red-600">{errors.services[index]?.name?.message}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                        Service Link *
                      </label>
                      <input
                        {...register(`services.${index}.link`, { 
                          required: 'Service link is required',
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: 'Please enter a valid URL starting with http:// or https://'
                          }
                        })}
                        type="url"
                        placeholder="https://example.com/service"
                        className={`w-full px-3 py-2 border rounded-md text-sm ${
                          theme === 'dark'
                            ? 'bg-gray-600 border-gray-500 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                      {errors.services?.[index]?.link && (
                        <p className="mt-1 text-xs text-red-600">{errors.services[index]?.link?.message}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className={`mt-6 p-2 rounded-md ${theme === 'dark' ? 'text-gray-400 hover:text-red-400 hover:bg-gray-600' : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'} transition-colors`}
                      title="Remove service"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 -mx-1 -mb-1 px-7 py-6 rounded-b-lg">
              {/* Delete Button - Left Side (Edit Mode Only) */}
              <div>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Product
                  </button>
                )}
              </div>

              {/* Cancel & Save Buttons - Right Side */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-6 py-3 border rounded-lg text-sm font-medium transition-colors ${
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
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {product ? 'Update Product' : 'Add Product'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal2>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal />
    </>
  );
};

export default ProductModal;