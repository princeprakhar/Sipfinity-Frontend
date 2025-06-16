// components/items/MasonryGrid.tsx
import React from 'react';
import { type Product } from '@/types/product';
import ItemCard from './ItemCard';
import { useAppSelector } from '../../hooks';

interface MasonryGridProps {
  items: Product[];
  onItemClick: (product: Product) => void;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ items, onItemClick }) => {
  const { theme } = useAppSelector((state) => state.theme);
  
  if (items.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-medium mb-2">No products found</h3>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-1 p-0.5 auto-rows-[60px] xs:auto-rows-[70px] sm:auto-rows-[80px] lg:auto-rows-[90px] xl:auto-rows-[100px]
      grid-cols-4 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 2xl:grid-cols-16 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {items.map((product, index) => {
        const responsiveDimensions = getResponsiveDimensions(product.size, index);
        
        return (
          <ItemCard 
            key={product.id.toString()}
            product={product}
            className={`${responsiveDimensions} min-h-0 overflow-hidden`}
            onClick={() => onItemClick(product)}
          />
        );
      })}
    </div>
  );
};

// Comprehensive responsive dimensions helper
const getResponsiveDimensions = (size: string, index: number): string => {
  const sizeVariations = {
    small: [
      // Mobile (4 cols) -> XS (6 cols) -> SM (8 cols) -> MD (10 cols) -> LG (12 cols) -> XL (14 cols) -> 2XL (16 cols)
      'col-span-2 row-span-2 xs:col-span-2 xs:row-span-2 sm:col-span-2 sm:row-span-3 md:col-span-2 md:row-span-3 lg:col-span-2 lg:row-span-3 xl:col-span-2 xl:row-span-3 2xl:col-span-2 2xl:row-span-3',
      'col-span-2 row-span-3 xs:col-span-3 xs:row-span-2 sm:col-span-3 sm:row-span-2 md:col-span-2 md:row-span-4 lg:col-span-3 lg:row-span-2 xl:col-span-3 xl:row-span-2 2xl:col-span-3 2xl:row-span-2',
      'col-span-2 row-span-2 xs:col-span-2 xs:row-span-3 sm:col-span-2 sm:row-span-2 md:col-span-3 md:row-span-2 lg:col-span-2 lg:row-span-4 xl:col-span-2 xl:row-span-4 2xl:col-span-2 2xl:row-span-4',
    ],
    medium: [
      // Medium items - more space on larger screens
      'col-span-2 row-span-3 xs:col-span-3 xs:row-span-3 sm:col-span-3 sm:row-span-4 md:col-span-3 md:row-span-4 lg:col-span-3 lg:row-span-4 xl:col-span-3 xl:row-span-4 2xl:col-span-3 2xl:row-span-4',
      'col-span-4 row-span-2 xs:col-span-4 xs:row-span-3 sm:col-span-4 sm:row-span-3 md:col-span-4 md:row-span-3 lg:col-span-4 lg:row-span-3 xl:col-span-4 xl:row-span-3 2xl:col-span-4 2xl:row-span-3',
      'col-span-2 row-span-4 xs:col-span-3 xs:row-span-4 sm:col-span-3 sm:row-span-5 md:col-span-3 md:row-span-5 lg:col-span-3 lg:row-span-5 xl:col-span-3 xl:row-span-5 2xl:col-span-4 2xl:row-span-4',
      'col-span-3 row-span-3 xs:col-span-3 xs:row-span-3 sm:col-span-4 sm:row-span-3 md:col-span-4 md:row-span-4 lg:col-span-4 lg:row-span-4 xl:col-span-4 xl:row-span-4 2xl:col-span-4 2xl:row-span-4',
    ],
    large: [
      // Large items - hero pieces
      'col-span-4 row-span-4 xs:col-span-4 xs:row-span-4 sm:col-span-5 sm:row-span-5 md:col-span-5 md:row-span-5 lg:col-span-5 lg:row-span-5 xl:col-span-5 xl:row-span-5 2xl:col-span-6 2xl:row-span-5',
      'col-span-4 row-span-3 xs:col-span-6 xs:row-span-4 sm:col-span-6 sm:row-span-4 md:col-span-6 md:row-span-4 lg:col-span-6 lg:row-span-4 xl:col-span-6 xl:row-span-4 2xl:col-span-6 2xl:row-span-4',
      'col-span-2 row-span-5 xs:col-span-3 xs:row-span-5 sm:col-span-4 sm:row-span-6 md:col-span-4 md:row-span-6 lg:col-span-4 lg:row-span-6 xl:col-span-5 xl:row-span-6 2xl:col-span-5 2xl:row-span-6',
    ]
  };

  // Get variations for the size
  const variations = sizeVariations[size as keyof typeof sizeVariations] || sizeVariations.small;
  
  // Return variation based on index to create visual variety
  return variations[index % variations.length];
};

export default MasonryGrid;