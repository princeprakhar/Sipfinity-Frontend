// components/admin/ProductGrid.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { toggleProductSelection } from '@/store/slices/productSlice';
import type { Product } from '@/types/product';
import ProductCard from './ProductCard';
import MasonryGrid from '@/components/ui/MasonryGrid';

interface ProductGridProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onEditProduct }) => {
  const dispatch = useAppDispatch();
  const { selectedProducts } = useAppSelector(state => state.products);

  const handleSelectProduct = (productId: string) => {
    dispatch(toggleProductSelection(productId));
  };

  return (
    <MasonryGrid
      items={products.map(product => ({
        ...product,
        size: 'medium' as const, // or determine size dynamically
      }))}
      renderItem={(product: Product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedProducts.includes((product.id).toString())}
          onSelect={() => handleSelectProduct((product.id).toString())}
          onEdit={() => onEditProduct(product)}
        />
      )}
      columns={{ default: 1, sm: 2, lg: 3, xl: 4 }}
      gap={6}
    />
  );
};

export default ProductGrid;