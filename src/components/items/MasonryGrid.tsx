// components/items/MasonryGrid.tsx
import React from 'react';
import { type Item } from '../../types';
import ItemCard from './ItemCard';
import { useAppSelector } from '../../hooks';

interface MasonryGridProps {
  items: Item[];
  onItemClick: (item: Item) => void;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ items, onItemClick }) => {
  const { theme } = useAppSelector((state) => state.theme);
  
  if (items.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-medium mb-2">No items found</h3>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 auto-rows-[100px] px-0.5 ${
      theme === 'dark' ? 'bg-gray-900' : ''
    }`}>
      {items.map(item => {
        // All items will have the same width (1 column) but different heights
        let heightClass = '';
        
        switch(item.size) {
          case 'small':
            heightClass = 'row-span-2'; // Small: 1x2 (100px × 2)
            break;
          case 'medium':
            heightClass = 'row-span-3'; // Medium: 1x3 (100px × 3)
            break;
          case 'large':
            heightClass = 'row-span-4'; // Large: 1x4 (100px × 4)
            break;
          default:
            heightClass = 'row-span-2';
        }
        
        // Each item takes exactly 1 column width uniformly
        const widthClass = 'col-span-1';
        
        // Special cases for featured items on larger screens
        const isFeatureItem = item.size === 'large';
        const featureWidthClass = isFeatureItem ? 'sm:col-span-2' : '';
        
        return (
          <ItemCard 
            key={item.id}
            item={item}
            className={`${widthClass} ${featureWidthClass} ${heightClass} overflow-hidden`}
            onClick={() => onItemClick(item)}
          />
        );
      })}
    </div>
  );
};

export default MasonryGrid;