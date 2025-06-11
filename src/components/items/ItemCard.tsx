// components/items/ItemCard.tsx
import React from 'react';
import { type  Item } from '../../types';
import { useAppSelector } from '../../hooks';

interface ItemCardProps {
  item: Item;
  className?: string;
  onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, className, onClick }) => {
  const { theme } = useAppSelector((state) => state.theme);

  return (
    <div 
      className={`${className} rounded-xl ${
        theme === 'dark' 
          ? 'bg-gray-800 hover:shadow-gray-700' 
          : 'bg-white hover:shadow-md'
      } overflow-hidden shadow-sm transition-all duration-300 cursor-pointer group relative`}
      onClick={onClick}
    >
      <div className="h-full flex flex-col">
        <div className="flex-grow overflow-hidden hover:opacity-90 relative">
          <img 
            src={item.image_src} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Always visible price tag that changes color on hover */}
          <div className="absolute bottom-2 right-2">
            <span className={`px-3 py-1 rounded-lg text-white text-sm font-medium transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-indigo-700 group-hover:bg-indigo-500' 
                : 'bg-indigo-600 group-hover:bg-indigo-500'
            }`}>
              ₹{item.price.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          } line-clamp-2`}>
            {item.title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;