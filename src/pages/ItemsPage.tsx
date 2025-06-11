// pages/ItemsPage.tsx
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setItems,  setSelectedCategory } from '../store/slices/itemSlice';
import { mockItems, getCategories } from '@/data/mockItem';
import FilterTabs from '../components/items/FilterTabs';
import MasonryGrid from '../components/items/MasonryGrid';
import ItemDetailModal from '../components/items/ItemDetailModal';
import { type Item } from '../types';

const ItemsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);
  const { filteredItems, selectedCategory } = useAppSelector((state) => state.items);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const categories = getCategories();

  // Initialize items on component mount
  useEffect(() => {
    dispatch(setItems(mockItems));
  }, [dispatch]);


  const handleCategorySelect = (category: string | null) => {
    dispatch(setSelectedCategory(category));
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    } transition-colors duration-200`}>
      
      {/* Filter Tabs */}
      <FilterTabs 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Items Grid */}
      <main className="max-w-7xl mx-auto pb-8">
        <MasonryGrid 
          items={filteredItems}
          onItemClick={handleItemClick}
        />
      </main>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ItemsPage;